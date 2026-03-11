---
description: PDF → resume.ts 변환 프로젝트 기획 스펙 — 요구사항, UX 플로우, DTO 매핑 정의
---

# 기획 스펙 — PDF → resume.ts 변환

---

## 0. 프로젝트 구조

| 항목 | 값 |
|------|-----|
| **프로젝트명** | jione-transformer |
| **위치** | `c:\work\jione-transformer\` |
| **관계** | `jione-portfolio`와 **완전 독립**된 별도 Next.js 프로젝트 |
| **포트** | `localhost:3001` (portfolio는 3000) |
| **산출물** | `resume.ts` 파일 다운로드 → jione-portfolio에서 사용 |

---

## 1. 프로젝트 목적

PDF 이력서/포트폴리오를 업로드하면 자동으로 `data/resume.ts` 형식으로 변환한다.
내용이 부족한 필드는 **Gemini API**가 보완하여 완성도 높은 포트폴리오 데이터를 생성한다.
**카카오 로그인 회원 전용 서비스**로, 첫 로그인 시 자동 회원가입이 진행된다.

---

## 2. 사용자 스토리

```
AS 포트폴리오 사이트를 만들려는 사용자
I WANT 기존 PDF 이력서를 업로드하면 resume.ts 가 자동 생성되길
SO THAT data/resume.ts 를 직접 작성하는 수고를 줄일 수 있다
```

---

## 3. 기능 요구사항

### Must Have (MVP)
| ID | 기능 | 설명 |
|----|------|------|
| F-00 | 카카오 로그인 | OAuth 2.0, 첫 로그인 시 자동 회원가입, 로그인 전 전체 차단 |
| F-01 | PDF 업로드 | 드래그&드롭 또는 파일 선택 (최대 10MB) |
| F-02 | PDF 파싱 | 텍스트 추출 → DTO 섹션별 분류 |
| F-03 | DTO 매핑 | 추출 텍스트 → resume.ts 필드 매핑 |
| F-04 | 결과 미리보기 | 변환된 데이터를 섹션별 편집 UI로 표시 |
| F-05 | resume.ts 다운로드 | 최종 결과를 `resume.ts` 파일로 저장 |
| F-06 | AI 보완 | 내용 부족 필드를 Gemini API로 자동 보완 |
| F-07 | 변환 히스토리 추적 | 변환 결과(원본/보완 DTO, AI 보완 필드 목록)를 서버에 자동 저장 |
| F-08 | 변환 리뷰 | 섹션별 정확도 별점(1~5) + 잘못된 필드 선택 + 코멘트 입력 |
| F-09 | 성능 통계 | 리뷰 집계 → 섹션별 평균 점수, 자주 오류 필드, AI 보완 효과 시각화 |

### Nice to Have
| ID | 기능 |
|----|------|
| F-10 | 다국어 PDF 지원 (영문 이력서) |
| F-11 | 이력서 이미지/스크린샷 자동 수집 |
| F-12 | 여러 PDF 병합 변환 |

---

## 4. UX 플로우

```
[미인증 접근]
  └→ /pdf/* 또는 /api/pdf/* 요청
       └→ Middleware → /login 리디렉션

[로그인 화면] (/login)
  └→ "카카오로 시작하기" 클릭
       └→ 카카오 OAuth → 첫 로그인: 자동 회원가입 → 재방문: 기존 계정 로그인
            └→ /pdf 리디렉션

[업로드 화면] (🔒 로그인 필요)
  └→ PDF 드래그&드롭 or 파일 선택
       └→ [로딩] 파싱 중... (BE API 호출)
            ├→ 성공 → 히스토리 자동 저장 (historyId 발급)
            │    └→ [미리보기 화면]
            │         ├→ 섹션별 탭: 프로필 / 경력 / 프로젝트 / 스킬
            │         ├→ 각 필드 인라인 편집 가능
            │         ├→ AI 보완 필드 → 보라색 배경 + "AI 생성" 뱃지
            │         ├→ [AI 보완 실행] → 히스토리 갱신 (enrichedPaths 저장)
            │         └→ [resume.ts 다운로드] → 리뷰 입력 유도 모달
            │              └→ [리뷰 하러 가기] → /pdf/history/{id}
            └→ 실패 → 에러 메시지 + 재시도

[히스토리 목록] (/pdf/history)
  └→ 변환 이력 테이블 (파일명, 시각, 상태, AI 보완 수, 리뷰 점수)
       └→ [상세보기] → 리뷰 입력 화면

[리뷰 입력] (/pdf/history/{id})
  ├→ 섹션별 별점 (1~5): 프로필 / 경력 / 프로젝트 / 스킬 / AI 보완 품질
  ├→ 잘못 변환된 필드 선택 (버튼 토글)
  └→ 개선 의견 텍스트

[성능 통계] (/pdf/history/stats)
  ├→ 섹션별 평균 정확도 (바 차트)
  ├→ AI 보완 효과 (보완 전/후 점수 비교)
  └→ 자주 오류 발생 필드 TOP 10 (개선 우선순위)
```

---

## 5. DTO 매핑 규칙

PDF 섹션 텍스트 → `data/resume.ts` 필드 매핑:

| PDF 섹션 키워드 | resume.ts 필드 |
|----------------|---------------|
| 이름, Name | `profile.name` |
| 이메일, Email | `profile.email` |
| 연락처, Phone, Tel | `profile.phone` |
| 주소, Location | `profile.location` |
| 자기소개, Summary, About | `profile.bio` |
| 직함, Title, Position (최상단) | `profile.title` |
| 경력, Work Experience, Career | `career.experiences[]` |
| 프로젝트, Projects | `Project.cases[]` |
| 기술, Skills, Tech Stack | `skills.categories[]` |
| GitHub, LinkedIn | `profile.social.*` |

### experience 매핑 세부 규칙
```
회사명        → company
직책          → position
기간 (시작)   → period.start  ("YYYY.MM" 형식으로 정규화)
기간 (종료)   → period.end    ("present" 또는 "YYYY.MM")
업무 내용     → description   (첫 문장 또는 요약)
성과 목록     → achievements  (bullet point → 배열)
```

### ProjectCase 매핑 세부 규칙
```
프로젝트명    → title
회사/소속     → company
역할          → role         (예: "기획+개발", "FE 개발")
설명          → description
기술 스택     → execution    (콤마 구분 문자열)
사용 도구     → tools        (콤마 구분 문자열)
기간/연도     → year
링크 URL      → urls[{ label, href }]
```

### SkillLevel 추론 규칙
```
경력 5년+ 또는 "전문" 표현     → 'expert'
경력 2~4년 또는 "숙련" 표현   → 'advanced'
경력 1년 미만 또는 "사용 가능" → 'intermediate'
추론 불가                      → 'intermediate' (기본값)
```

---

## 6. AI 보완 조건

Gemini API를 호출하는 조건:

| 필드 | 보완 조건 |
|------|----------|
| `profile.bio` | 없거나 100자 미만 |
| `experience.description` | 없거나 50자 미만 |
| `experience.achievements` | 빈 배열 |
| `ProjectCase.description` | 없거나 50자 미만 |
| `ProjectCase.role` | 없음 |
| `skill.level` | 추론 불가 |

---

## 7. 에러 처리

| 상황 | 처리 |
|------|------|
| PDF 텍스트 추출 실패 | "텍스트를 추출할 수 없는 PDF입니다 (이미지 전용 PDF)" 안내 |
| Gemini API 실패 | AI 보완 없이 추출 결과만 제공, 사용자에게 알림 |
| 필드 매핑 실패 | 빈 값으로 처리, 사용자가 직접 입력 |
| 파일 용량 초과 | 업로드 전 10MB 초과 시 즉시 안내 |

---

## 8. 기술 스택

| 레이어 | 기술 |
|--------|------|
| Frontend | Next.js, React, TypeScript, styled-components |
| Backend | Next.js API Routes |
| PDF 파싱 | `unpdf` (Node.js 서버 호환, 폴리필 불필요) |
| AI | Google Gemini API (`@google/generative-ai`, model: `gemini-2.5-flash`) |
| 인증 | NextAuth.js + 카카오 OAuth |
| 파일 핸들링 | Next.js built-in (formData) |

---

## 완료 기준 (Definition of Done)

- [ ] PDF 업로드 → resume.ts 변환 E2E 동작
- [ ] Gemini API 보완 결과가 편집 가능한 형태로 표시
- [ ] 다운로드한 resume.ts가 빌드 오류 없이 사용 가능
- [ ] 한글/영문 PDF 모두 처리
- [ ] 에러 케이스 전부 처리 (파싱 실패, API 실패 등)
