---
description: PDF → resume.ts 변환 백엔드 개발 — PDF 파싱 API, DTO 매핑, 데이터 정규화
---

# BE 개발 — PDF 파싱 API

선행: `pdf-1.spec.md` 기획 스펙 확인 필수

---

## 개발 범위

1. PDF 업로드 수신 API
2. PDF 텍스트 추출 (unpdf)
3. **AI-First 파싱** (Gemini에 원본 텍스트 + ResumeDto 스키마 전달 → JSON 직접 생성)
4. regex 파서는 fallback으로만 사용 (Gemini API 키 없거나 실패 시)
5. resume.ts 구조로 정규화 출력

---

## Step 1: 패키지 설치

```bash
npm install unpdf
```

---

## Step 2: AI 파서 (핵심)

`src/lib/ai/ai-parser.ts` 생성:

> Gemini에 원본 텍스트 + ResumeDto 스키마를 넘겨서 JSON 직접 생성.
> `responseMimeType: 'application/json'`으로 JSON 응답 보장.
> `temperature: 0.2`로 정확한 추출 우선.
> `maxOutputTokens: 65536`으로 한국어 이력서 전체 JSON 출력 보장 (8192은 부족).

### 핵심 설계 포인트

1. **JSON sanitizer**: Gemini 응답에서 코드블록, trailing comma, 제어 문자, 주석 제거 (URL 내 `//`는 보존)
2. **tryParseJson**: JSON.parse 실패 시 에러 위치 로깅 + 잘린 JSON 복구 (닫히지 않은 괄호/문자열 자동 닫기)
3. **재시도 로직**: MAX_RETRIES=2, 첫 시도 실패 시 자동 재시도
4. **결과 검증**: 경력 0개 + 프로젝트 0개이면 불완전 응답으로 거부 → 재시도 또는 regex fallback

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ResumeDto } from '@/types/resume-dto';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    maxOutputTokens: 65536,    // 한국어 이력서 전체 JSON 출력에 8192는 부족
    temperature: 0.2,
    responseMimeType: 'application/json',
  },
});

const RESUME_SCHEMA = `{
  // ResumeDto 전체 스키마 — meta, profile, career, Project, skills
  // 상세는 src/types/resume-dto.ts 참조
}`;

/** Gemini 응답에서 JSON 문법 오류를 정제 */
function sanitizeJsonResponse(text: string): string {
  let json = text.trim();
  // markdown 코드블록 제거
  json = json.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/, '');
  // trailing comma 제거 (], } 앞의 쉼표)
  json = json.replace(/,\s*([}\]])/g, '$1');
  // 작은따옴표 → 큰따옴표 (JSON 표준)
  json = json.replace(/(?<=[\{,]\s*)'([^']+)'\s*:/g, '"$1":');
  // 주석 제거 (// 라인 주석) — 문자열 내부의 // (URL 등)는 보존
  json = json.replace(/"(?:[^"\\]|\\.)*"|\/\/[^\n]*/g, (match) => {
    if (match.startsWith('"')) return match;  // 문자열 → 유지
    return '';  // 주석 → 제거
  });
  // JSON 문자열 값 내부의 제어 문자 이스케이프
  json = json.replace(/"((?:[^"\\]|\\.)*)"/g, (_match, content: string) => {
    const escaped = content
      .replace(/(?<!\\)\n/g, '\\n')
      .replace(/(?<!\\)\r/g, '\\r')
      .replace(/(?<!\\)\t/g, '\\t')
      .replace(/[\x00-\x1f]/g, (ch) => '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0'));
    return `"${escaped}"`;
  });
  return json;
}

/** JSON.parse 실패 시 에러 위치 로깅 + 잘린 JSON 복구 */
function tryParseJson(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch (err) {
    if (err instanceof SyntaxError) {
      // 에러 위치 주변 텍스트 로깅
      const posMatch = err.message.match(/position\s+(\d+)/i);
      if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        console.error(`  🔍 JSON 에러 위치 (pos ${pos}): ...⟨HERE⟩...`);
      }

      // 잘린 JSON 복구: 불완전 문자열 제거 → 닫히지 않은 괄호 닫기
      let repaired = json;
      // 닫히지 않은 문자열 닫기
      const quoteCount = (repaired.match(/(?<!\\)"/g) || []).length;
      if (quoteCount % 2 !== 0) repaired += '"';
      // 닫히지 않은 괄호 카운트 후 닫기
      const opens = { '{': 0, '[': 0 };
      let inString = false;
      for (let i = 0; i < repaired.length; i++) {
        const ch = repaired[i];
        if (ch === '"' && (i === 0 || repaired[i - 1] !== '\\')) inString = !inString;
        if (!inString) {
          if (ch === '{') opens['{']++;
          if (ch === '}') opens['{']--;
          if (ch === '[') opens['[']++;
          if (ch === ']') opens['[']--;
        }
      }
      repaired = repaired.replace(/,\s*$/, '');
      for (let i = 0; i < opens['[']; i++) repaired += ']';
      for (let i = 0; i < opens['{']; i++) repaired += '}';

      try { return JSON.parse(repaired); } catch { /* 복구 실패 */ }
    }
    throw err;
  }
}

export async function parseResumeWithAI(pdfText: string): Promise<ResumeDto> {
  const prompt = `...`; // 규칙 10개 + RESUME_SCHEMA + PDF 텍스트

  const MAX_RETRIES = 2;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();

      const cleanedJson = sanitizeJsonResponse(responseText);
      const parsed = tryParseJson(cleanedJson) as ResumeDto;

      // 핵심 데이터 검증 — 잘린 JSON 복구로 빈 결과가 나온 경우 거부
      const careerCount = parsed.career?.experiences?.length || 0;
      const projectCount = parsed.Project?.cases?.length || 0;
      if (careerCount === 0 && projectCount === 0) {
        throw new Error(`AI 응답이 불완전합니다`);
      }

      ensureDefaults(parsed);
      return parsed;
    } catch (err) {
      if (attempt >= MAX_RETRIES) throw err;
    }
  }
  throw new Error('AI 파싱 최대 재시도 초과');
}

/** 필수 필드 기본값 보장 — id, images, social 등 누락 시 채움 */
function ensureDefaults(dto: ResumeDto): void { /* ... */ }
```

---

## Step 2-B: PDF 업로드 API (AI-First + regex fallback)

`src/app/api/pdf/parse/route.ts` 생성:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { extractText } from 'unpdf';
import { parseResumeWithAI } from '@/lib/ai/ai-parser';
import { mapPdfToResumeDto } from '@/lib/pdf/dto-mapper';
import { historyStore } from '@/lib/pdf/history-store';
import { requireSession } from '@/lib/auth/require-session';

export async function POST(req: NextRequest) {
  const { session, response } = await requireSession();
  if (response) return response;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'PDF 파일이 없습니다' }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: '파일 크기는 10MB 이하여야 합니다' }, { status: 400 });
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'PDF 파일만 업로드 가능합니다' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { text } = await extractText(new Uint8Array(buffer));
    const fullText = text.join('\n');

    if (!fullText || fullText.trim().length === 0) {
      return NextResponse.json(
        { error: '텍스트를 추출할 수 없는 PDF입니다 (이미지 전용 PDF)' },
        { status: 422 }
      );
    }

    // AI-First 파싱 (Gemini) → fallback (regex)
    let resumeData;
    let parseMethod: 'ai' | 'regex';

    if (process.env.GEMINI_API_KEY) {
      try {
        resumeData = await parseResumeWithAI(fullText);
        parseMethod = 'ai';
      } catch {
        resumeData = mapPdfToResumeDto(fullText);
        parseMethod = 'regex';
      }
    } else {
      resumeData = mapPdfToResumeDto(fullText);
      parseMethod = 'regex';
    }

    const historyRecord = historyStore.add({
      userId:        session!.user.id,
      fileName:      file.name,
      status:        'success',
      originalDto:   resumeData,
      enrichedDto:   resumeData,
      enrichedPaths: [],
    });

    return NextResponse.json({
      success: true,
      data: resumeData,
      historyId: historyRecord.id,
      parseMethod,
    });
  } catch (err) {
    console.error('PDF 파싱 오류:', err);
    return NextResponse.json({ error: 'PDF 파싱 중 오류가 발생했습니다' }, { status: 500 });
  }
}
```

---

## Step 3: 섹션 분류기

`src/lib/pdf/section-classifier.ts` 생성:

### 핵심 규칙

1. **40자 가드**: 40자 이상 라인은 절대 섹션 헤더가 아님
2. **`$` 앵커 필수**: "■ 기술 기반 실행 역량" 같은 경력기술서 내 소제목 오분류 방지
3. **번호 매칭**: "N. 경력정보" 같은 번호 붙은 섹션 제목 인식 (`/^[\d.]*\s*/`)
4. **독립 제목만 인식**: 줄 전체가 섹션명인 경우만 섹션 전환

```typescript
export type PdfSection =
  | 'profile'
  | 'career'
  | 'projects'
  | 'skills'
  | 'unknown';

const SECTION_HEADER_PATTERNS: { section: PdfSection; patterns: RegExp[] }[] = [
  {
    section: 'career',
    patterns: [
      /^[\d.]*\s*경력\s*(정보|기술서|사항|요약)?$/,  // "2. 경력정보", "경력기술서", "경력"
      /^경력$/,
      /^(work\s+)?experience$/i,
      /^career\s*(history|summary)?$/i,
      /^이력\s*(사항)?$/,
    ],
  },
  {
    section: 'projects',
    patterns: [
      /^[\d.]*\s*(주요\s*)?(프로젝트|project)\s*(경험|이력|상세)?$/i,
      /^프로젝트$/,
      /^projects?$/i,
      /^주요\s*프로젝트/,
      /^포트폴리오$/i,
      /^project\s*(experience|history)?$/i,
    ],
  },
  {
    section: 'skills',
    patterns: [
      /^[\d.]*\s*(보유\s*)?(기술|스킬)\s*(스택|역량|요약)?$/,
      /^기술$/,
      /^skills?$/i,
      /^tech\s*stack$/i,
      /^사용\s*기술$/,
      /^technical\s*skills?$/i,
      // 주의: /^■\s*(기술|스킬)/ 제거 — "■ 기술 기반 실행 역량" 같은 소제목 오분류 방지
    ],
  },
  {
    section: 'profile',
    patterns: [
      /^[\d.]*\s*(개인\s*정보|인적\s*사항|기본\s*정보|프로필|자기\s*소개서?)$/,
      /^profile$/i,
      /^about(\s*me)?$/i,
      /^summary$/i,
      /^소개$/,
    ],
  },
];

export function classifySection(line: string): PdfSection {
  const trimmed = line.trim();
  if (trimmed.length > 40) return 'unknown';  // 40자 가드
  if (trimmed.length < 1) return 'unknown';

  for (const { section, patterns } of SECTION_HEADER_PATTERNS) {
    if (patterns.some((p) => p.test(trimmed))) {
      return section;
    }
  }
  return 'unknown';
}

export function splitIntoSections(text: string): Record<PdfSection, string[]> {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const sections: Record<PdfSection, string[]> = {
    profile: [], career: [], projects: [], skills: [], unknown: [],
  };

  // PDF 이력서 상단은 보통 프로필 정보
  let current: PdfSection = 'profile';
  for (const line of lines) {
    const classified = classifySection(line);
    if (classified !== 'unknown') {
      current = classified;
      // 섹션 헤더 자체는 내용에 포함하지 않음
    } else {
      sections[current].push(line);
    }
  }
  return sections;
}
```

---

## Step 4: DTO 매퍼

`src/lib/pdf/dto-mapper.ts` 생성:

### 핵심 개선 (v2)

1. **PDF 테이블 행 파싱**: `"성 명 이지혜 경 력 20년 이상 성 별 여"` → 3개 key-value 분리
2. **이름 추출**: 구조화 패턴 우선 ("성 명 홍길동") → 문서 제목("이력서") 스킵
3. **경력 서술 분리**: 경력 테이블 뒤의 경력기술서 서술 텍스트를 별도 `narrativeLines`로 분리 (마지막 경력 achievements에 60줄+ 덤프 방지)
4. **프로필 3인자**: `mapProfile(lines, fullText, careerNarrativeLines)` — 서술 영역에서 title/bio 추출
5. **키워드 DB 스킬 매칭**: 전체 텍스트에서 알려진 기술 키워드 스캔 (카테고리별 분류)

```typescript
import type { ResumeDto } from '@/types/resume-dto';
import { splitIntoSections } from './section-classifier';

// ─── PDF 테이블 한 줄 파싱 ────────────────────────────────────────
// PDF에서 표가 한 줄로 추출될 때 key-value 쌍을 분리
// 예: "성 명 이지혜 경 력 20년 이상 성 별 여"
//   → { "성명": "이지혜", "경력": "20년 이상", "성별": "여" }

const TABLE_FIELD_PATTERNS: { key: string; pattern: RegExp }[] = [
  { key: '성명',     pattern: /성\s*명/ },
  { key: '이름',     pattern: /이\s*름/ },
  { key: '경력',     pattern: /경\s*력/ },
  { key: '성별',     pattern: /성\s*별/ },
  { key: '전화',     pattern: /전\s*화/ },
  { key: 'email',    pattern: /[Ee]\s*-?\s*[Mm]ail/ },
  { key: '주소',     pattern: /주\s*소/ },
  { key: '현재연봉', pattern: /현재\s*연봉/ },
  { key: '희망연봉', pattern: /희망\s*연봉/ },
  { key: '생년월일', pattern: /생\s*년\s*월\s*일/ },
  { key: '학력',     pattern: /학\s*력/ },
  { key: '병역',     pattern: /병\s*역/ },
];

function parseTableRow(line: string): TableField[] | null {
  // 2개 이상 키가 매칭되면 테이블 행으로 간주
  // 각 키의 값 = 현재 키 끝 ~ 다음 키 시작 사이의 텍스트
}

function extractProfileFromTableRows(lines: string[]): ProfileTableData {
  // 테이블 행들에서 이름/전화/이메일/주소/경력 추출
}

// ─── 이름 추출 ──────────────────────────────────────────────────

function findKoreanName(lines: string[], fullText: string): string {
  // 1순위: "성 명 홍길동" 구조화 패턴 (전체 텍스트 검색)
  // 2순위: 프로필 상위 15줄에서 단독 한글 이름 (문서 제목 스킵)
}

// ─── 섹션별 매퍼 ──────────────────────────────────────────────────

function mapProfile(lines: string[], fullText: string, careerLines: string[]): ResumeDto['profile'] {
  // 1단계: 테이블 행 파싱 (PDF 표가 한 줄로 추출된 경우)
  // 2단계: 이름 결정 (테이블 > 구조화 패턴 > fallback)
  // 3단계: 이메일/전화 (테이블 > 전체 텍스트 스캔)
  // 4단계: title/subtitle 검색 (프로필 + 경력서술 줄에서)
  //   - "Full-Side Product Engineer | 전략 기획 · UX 설계 · 개발" 패턴 (| 구분)
  //   - 테이블 행은 스킵
}

interface CareerParseResult {
  experiences: ResumeDto['career']['experiences'];
  narrativeLines: string[];  // 경력기술서 서술 텍스트 (profile 보완용)
}

function mapCareer(lines: string[]): CareerParseResult {
  // 경력 테이블 파싱 (기간 regex로 경력 항목 분리)
  // 서술 영역 경계 감지:
  //   - "Full-Side" / "Engineer" + "|" 패턴
  //   - 마지막 경력에 5줄+ 초과 시 서술 시작
  // 서술 영역 진입 후에는 경력으로 파싱하지 않음
}

function mapProjects(lines: string[]): ResumeDto['Project']['cases'] {
  // "■ 프로젝트명" 또는 짧은 대문자 라인 → 프로젝트 제목
  // 기술스택/도구/연도/역할/설명 매핑
}

function mapSkills(lines: string[], fullText: string): ResumeDto['skills']['categories'] {
  // 키워드 DB 기반 매칭 (전체 텍스트 스캔)
  // 카테고리: Frontend, 기획/PM, AI/자동화, Backend, Infrastructure
  // fallback: 라인별 쉼표/파이프 분리
}

// ─── 메인 매퍼 ────────────────────────────────────────────────────

export function mapPdfToResumeDto(pdfText: string): ResumeDto {
  const sections = splitIntoSections(pdfText);

  const { experiences, narrativeLines } = mapCareer(sections.career);
  const profile = mapProfile(sections.profile, pdfText, narrativeLines);
  const cases = mapProjects(sections.projects);
  const skillCategories = mapSkills(sections.skills, pdfText);

  return {
    meta: {
      siteTitle: profile.name ? `${profile.name} 포트폴리오` : '포트폴리오',
      siteDescription: profile.title ? `${profile.title} ${profile.name} 포트폴리오` : '',
      siteUrl: 'https://example.com',
      ogImage: '/images/og.png',
      author: profile.name,
      keywords: [],
      theme: 'toss',
    },
    profile,
    career: { summary: '', experiences },
    Project: { intro: '', cases },
    skills: { categories: skillCategories },
  };
}
```

---

## Step 5: ResumeDto 타입 정의

`src/types/resume-dto.ts` 생성:

```typescript
export interface ResumeDto {
  meta: {
    siteTitle: string;
    siteDescription: string;
    siteUrl: string;
    ogImage: string;
    author: string;
    keywords: string[];
    theme: string;
  };
  profile: {
    name: string;
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    location: string;
    availability: string;
    bio: string;
    image: string;
    social: { github: string; linkedin: string };
  };
  career: {
    summary: string;
    experiences: Array<{
      id: string;
      company: string;
      position: string;
      period: { start: string; end: string };
      description: string;
      achievements: string[];
    }>;
  };
  Project: {
    intro: string;
    cases: Array<{
      id: string;
      title: string;
      company: string;
      role: string;
      description: string;
      execution: string;
      tools: string;
      year: string;
      urls?: Array<{ label: string; href: string }>;
      images: string[];
    }>;
  };
  skills: {
    categories: Array<{
      name: string;
      skills: Array<{ name: string; level: 'expert' | 'advanced' | 'intermediate' }>;
    }>;
  };
}
```

---

## Step 6: resume.ts 파일 생성기

`src/lib/pdf/resume-generator.ts` 생성:

```typescript
import type { ResumeDto } from '@/types/resume-dto';

export function generateResumeTsContent(data: ResumeDto): string {
  const json = JSON.stringify(data, null, 2);

  return `// data/resume.ts
// portfolio content single source — modify only this file to reflect changes everywhere.
// ⚠️ 이 파일을 수정한 후 /sample-page-create 로 page.tsx를 재생성하세요.
// 🤖 PDF에서 자동 생성됨

export const resume = ${json
    .replace(/"([^"]+)":/g, '$1:')           // "key": → key:
    .replace(/: "expert"/g, ": 'expert' as const")
    .replace(/: "advanced"/g, ": 'advanced' as const")
    .replace(/: "intermediate"/g, ": 'intermediate' as const")
    .replace(/"/g, "'")                      // 나머지 " → '
  } as const;

export type Resume        = typeof resume;
export type Experience    = (typeof resume.career.experiences)[number];
export type SkillCategory = (typeof resume.skills.categories)[number];
export type ProjectCase   = (typeof resume.Project.cases)[number];
`;
}
```

---

## Step 7: 다운로드 API

`src/app/api/pdf/download/route.ts` 생성:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateResumeTsContent } from '@/lib/pdf/resume-generator';
import { requireSession } from '@/lib/auth/require-session';
import type { ResumeDto } from '@/types/resume-dto';

export async function POST(req: NextRequest) {
  const { response } = await requireSession();
  if (response) return response;

  const data: ResumeDto = await req.json();
  const content = generateResumeTsContent(data);

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="resume.ts"',
    },
  });
}
```

---

## 완료 체크리스트

- [ ] `POST /api/pdf/parse` — PDF 업로드 및 DTO 반환
- [ ] `POST /api/pdf/download` — resume.ts 파일 다운로드
- [ ] `src/types/resume-dto.ts` — DTO 타입 정의
- [ ] `src/lib/ai/ai-parser.ts` — AI-First 파서 (sanitizer + tryParseJson + 재시도 + 검증)
- [ ] `src/lib/pdf/section-classifier.ts` — 섹션 분류 (40자 가드 + `$` 앵커)
- [ ] `src/lib/pdf/dto-mapper.ts` — DTO 매핑 (테이블 행 파싱 + 서술 분리 + 키워드 DB 스킬)
- [ ] `src/lib/pdf/resume-generator.ts` — resume.ts 생성
- [ ] 에러 핸들링 (파싱 실패, 용량 초과, 텍스트 없음)
