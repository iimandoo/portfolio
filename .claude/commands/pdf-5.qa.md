---
description: PDF → resume.ts 변환 QA 테스트 — 파싱 정확도, Gemini 보완, 엣지 케이스, E2E 검증
---

# QA 테스트 — PDF → resume.ts 변환

선행: `pdf-1.spec.md` ~ `pdf-4.frontend.md` 개발 완료 필수

---

## 테스트 환경 설정

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D jest-environment-jsdom ts-jest
```

`jest.config.ts`:
```typescript
export default {
  testEnvironment: 'node',
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
};
```

---

## TC-01: PDF 파싱 정확도

`src/__tests__/pdf/parser.test.ts`:

```typescript
import { mapPdfToResumeDto } from '@/lib/pdf/dto-mapper';

describe('PDF DTO 매핑', () => {

  const SAMPLE_TEXT = `
이지혜
Full-Side Product Engineer
euneundh@gmail.com
010-7205-0408
서울
github.com/iimandoo

경력
(주)마타에듀
차장
2023.03 ~ 현재
서비스 전략 제안 및 PM, 기획 및 프론트엔드 개발
· 서비스 전략 제안 및 PM
· 기획 및 프론트엔드 개발

프로젝트
AI마타수학 2026년 리뉴얼
(주)마타에듀
전략, 서비스 기획, 프론트엔드 개발
Next.js, React, TypeScript, Redux
2023 ~ 현재

기술
Frontend
React, Next.js, TypeScript, Redux
`;

  test('profile.name 추출', () => {
    const dto = mapPdfToResumeDto(SAMPLE_TEXT);
    expect(dto.profile.name).toBe('이지혜');
  });

  test('profile.email 추출', () => {
    const dto = mapPdfToResumeDto(SAMPLE_TEXT);
    expect(dto.profile.email).toBe('euneundh@gmail.com');
  });

  test('profile.phone 추출', () => {
    const dto = mapPdfToResumeDto(SAMPLE_TEXT);
    expect(dto.profile.phone).toMatch(/010/);
  });

  test('profile.social.github 추출', () => {
    const dto = mapPdfToResumeDto(SAMPLE_TEXT);
    expect(dto.profile.social.github).toContain('github.com/iimandoo');
  });

  test('career.experiences 추출', () => {
    const dto = mapPdfToResumeDto(SAMPLE_TEXT);
    expect(dto.career.experiences.length).toBeGreaterThan(0);
    expect(dto.career.experiences[0].company).toContain('마타에듀');
  });

  test('period.start 정규화 — YYYY.MM 형식', () => {
    const dto = mapPdfToResumeDto(SAMPLE_TEXT);
    expect(dto.career.experiences[0].period.start).toMatch(/^\d{4}\.\d{2}$/);
  });

  test('period.end = "present" 정규화', () => {
    const dto = mapPdfToResumeDto(SAMPLE_TEXT);
    expect(dto.career.experiences[0].period.end).toBe('present');
  });

  test('Project.cases 추출', () => {
    const dto = mapPdfToResumeDto(SAMPLE_TEXT);
    expect(dto.Project.cases.length).toBeGreaterThan(0);
    expect(dto.Project.cases[0].title).toContain('AI마타수학');
  });

  test('skills.categories 추출', () => {
    const dto = mapPdfToResumeDto(SAMPLE_TEXT);
    expect(dto.skills.categories.length).toBeGreaterThan(0);
  });
});
```

---

## TC-02: 내용 부족 감지

`src/__tests__/pdf/deficiency-detector.test.ts`:

```typescript
import { detectDeficientFields } from '@/lib/ai/deficiency-detector';
import type { ResumeDto } from '@/types/resume-dto';

const makeDto = (overrides: Partial<ResumeDto>): ResumeDto => ({
  meta: { siteTitle: '', siteDescription: '', siteUrl: '', ogImage: '', author: '', keywords: [], theme: 'toss' },
  profile: { name: '이지혜', title: 'FE', subtitle: '', email: 'test@test.com', phone: '', location: '', availability: '', bio: '', image: '', social: { github: '', linkedin: '' } },
  career: { summary: '', experiences: [] },
  Project: { intro: '', cases: [] },
  skills: { categories: [] },
  ...overrides,
});

describe('내용 부족 감지', () => {

  test('bio가 없으면 deficient로 감지', () => {
    const dto = makeDto({ profile: { ...makeDto({}).profile, bio: '' } });
    const fields = detectDeficientFields(dto);
    expect(fields.some(f => f.path === 'profile.bio')).toBe(true);
  });

  test('bio가 100자 이상이면 deficient 아님', () => {
    const longBio = 'a'.repeat(101);
    const dto = makeDto({ profile: { ...makeDto({}).profile, bio: longBio } });
    const fields = detectDeficientFields(dto);
    expect(fields.some(f => f.path === 'profile.bio')).toBe(false);
  });

  test('experience.description이 50자 미만이면 deficient', () => {
    const dto = makeDto({
      career: {
        summary: '',
        experiences: [{
          id: 'exp-1', company: '테스트', position: '개발자',
          period: { start: '2023.01', end: 'present' },
          description: '짧은 설명',
          achievements: [],
        }],
      },
    });
    const fields = detectDeficientFields(dto);
    expect(fields.some(f => f.path.includes('description'))).toBe(true);
  });

  test('achievements가 비어있으면 deficient', () => {
    const dto = makeDto({
      career: {
        summary: '',
        experiences: [{
          id: 'exp-1', company: '테스트', position: '개발자',
          period: { start: '2023.01', end: 'present' },
          description: 'a'.repeat(60),
          achievements: [],
        }],
      },
    });
    const fields = detectDeficientFields(dto);
    expect(fields.some(f => f.path.includes('achievements'))).toBe(true);
  });
});
```

---

## TC-03: resume.ts 생성 출력 검증

`src/__tests__/pdf/resume-generator.test.ts`:

```typescript
import { generateResumeTsContent } from '@/lib/pdf/resume-generator';
import type { ResumeDto } from '@/types/resume-dto';

const sampleData: ResumeDto = {
  meta: { siteTitle: '테스트 포트폴리오', siteDescription: '', siteUrl: '', ogImage: '', author: '이지혜', keywords: [], theme: 'toss' },
  profile: { name: '이지혜', title: 'FE', subtitle: '', email: 'test@test.com', phone: '', location: '', availability: '', bio: 'bio 내용', image: '', social: { github: '', linkedin: '' } },
  career: { summary: '', experiences: [] },
  Project: { intro: '', cases: [] },
  skills: { categories: [] },
};

describe('resume.ts 파일 생성', () => {

  test('export const resume = 포함', () => {
    const content = generateResumeTsContent(sampleData);
    expect(content).toContain('export const resume =');
  });

  test('as const 포함', () => {
    const content = generateResumeTsContent(sampleData);
    expect(content).toContain('} as const');
  });

  test('타입 export 포함', () => {
    const content = generateResumeTsContent(sampleData);
    expect(content).toContain('export type Resume');
    expect(content).toContain('export type ProjectCase');
  });

  test('큰따옴표 없음 (작은따옴표만)', () => {
    const content = generateResumeTsContent(sampleData);
    // as const 이후의 값들은 작은따옴표여야 함
    const valueSection = content.split('export const resume =')[1];
    expect(valueSection).not.toContain('"이지혜"');
    expect(valueSection).toContain("'이지혜'");
  });
});
```

---

## TC-04: 엣지 케이스

| ID | 케이스 | 기대 결과 |
|----|--------|----------|
| EC-01 | 이미지만 있는 PDF (스캔본) | "텍스트 추출 불가" 에러 반환 |
| EC-02 | 10MB 초과 파일 | 업로드 전 클라이언트 에러 |
| EC-03 | PDF가 아닌 파일 (jpg, docx) | "PDF 파일만 가능" 에러 |
| EC-04 | 경력이 없는 PDF | `career.experiences = []` |
| EC-05 | 영문 이력서 | 영문 키워드로 섹션 분류 확인 |
| EC-06 | Gemini API 타임아웃 | AI 보완 없이 원본 반환, 에러 필드 목록 표시 |
| EC-07 | 빈 PDF (내용 없음) | 빈 DTO 반환, 모든 필드 수동 입력 유도 |

---

## TC-05: E2E 시나리오

**정상 플로우:**
```
1. /pdf 접속
2. 샘플 PDF 드래그&드롭
3. "변환 시작" 클릭
4. /pdf/result 이동 확인
5. 프로필/경력/프로젝트/스킬 탭 모두 데이터 표시 확인
6. "AI 보완" 클릭 → 보라색 배경 필드 표시 확인
7. 필드 직접 편집 → 값 반영 확인
8. "resume.ts 다운로드" → 파일 정상 다운로드 확인
9. 다운로드된 파일 → jione-portfolio(포트폴리오 프로젝트)에 복사 후 빌드 성공 확인
```

---

## 테스트 실행

```bash
# 단위 테스트 전체
npx jest

# 특정 파일
npx jest src/__tests__/pdf/parser.test.ts

# 커버리지
npx jest --coverage
```

---

## 완료 기준 (QA Done)

- [ ] TC-01 파싱 정확도: 핵심 필드 80% 이상 추출
- [ ] TC-02 부족 감지: 모든 조건 정확히 감지
- [ ] TC-03 resume.ts 출력: 빌드 오류 없이 jione-portfolio(포트폴리오 프로젝트)에서 사용 가능
- [ ] TC-04 엣지 케이스 7개 전부 처리
- [ ] TC-05 E2E: 한글 PDF 샘플 1건 완전 통과
- [ ] Gemini API 실패 시 graceful fallback 동작 확인
