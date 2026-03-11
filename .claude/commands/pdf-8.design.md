---
description: PDF → resume.ts 변환 디자인 시스템 — Deep Purple 톤, UI 컴포넌트, 레이아웃 가이드
---

# 디자인 — PDF 변환 서비스 UI

선행: `pdf-1.spec.md` 기획 스펙 확인 필수

---

## 디자인 콘셉트

> **클린 SaaS 대시보드** — shadcn/ui 스타일의 Deep Purple 톤

| 항목 | 값 |
|------|----|
| 톤앤매너 | Deep Purple (Violet-600 계열) |
| 분위기 | 미니멀, 카드 기반, 보라 포인트, 넉넉한 여백 |
| 배경 | `#FAFAFA` 살짝 회색 |
| 카드 | `#FFFFFF` 순백, `border: 1px solid #E5E7EB`, `border-radius: 12px` |
| 그림자 | 거의 없음 — 보더 기반 구분, 초경량 그림자만 |
| 폰트 | Pretendard Variable, 14px 기본, -0.025em 타이틀 |
| 강조색 | `#7C3AED` (CTA 버튼, 활성 탭, AI 뱃지, 차트 포인트) |

---

## 디자인 토큰

`src/styles/themes/purple.ts` 참조 (이미 정의됨)

### 핵심 색상 팔레트

```
#7C3AED  ████  primary — CTA 버튼, 활성 상태, AI 뱃지
#5B21B6  ████  secondaryForeground — 진보라 텍스트
#DDD6FE  ████  accent — 보라 하이라이트 (연한)
#F3F0FF  ████  secondary — 연보라 배경 (뱃지, 카드 강조)
#FAFAFA  ████  background — 페이지 배경
#FFFFFF  ████  card — 카드 배경 (순백)
#0F0B15  ████  foreground — 본문 텍스트
#71717A  ████  mutedForeground — 보조 텍스트
#E5E7EB  ████  border — 구분선
#EF4444  ████  destructive — 에러
```

### 보라색 농도 규칙

| 용도 | 색상 | 농도 |
|------|------|------|
| CTA 버튼 배경, 활성 탭 밑줄 | `#7C3AED` | 100% |
| AI 뱃지 배경 | `#7C3AED` | 100% (작은 면적) |
| 차트/그래프 포인트 | `#7C3AED` | 100% |
| 뱃지/태그 배경 | `#F3F0FF` | 10% |
| AI 보완 필드 배경 | `#FAF5FF` | ~5% |
| AI 보완 필드 보더 | `#D6BCFA` | 30% |
| hover 상태 | `#7C3AED` opacity 0.9 | — |

---

## 레이아웃 원칙

### 페이지 구조

```
┌─────────────────────────────────────┐
│  Nav (흰 배경, 보더 하단)             │
├─────────────────────────────────────┤
│                                     │
│  #FAFAFA 배경                       │
│                                     │
│  ┌──────────────────────────────┐   │
│  │  #FFFFFF 카드                 │   │
│  │  border: 1px solid #E5E7EB   │   │
│  │  border-radius: 12px         │   │
│  │  padding: 1.5rem             │   │
│  │  shadow: 0 1px 2px rgba(4%)  │   │
│  └──────────────────────────────┘   │
│                                     │
│  카드 간 gap: 1rem ~ 1.5rem         │
│                                     │
└─────────────────────────────────────┘
```

### 간격 규칙

| 요소 | 간격 |
|------|------|
| 페이지 좌우 패딩 | `1.5rem` ~ `2rem` |
| 카드 내부 패딩 | `1.5rem` |
| 카드 간 간격 | `1rem` ~ `1.5rem` |
| 필드 그룹 간격 | `1.25rem` |
| 라벨 ↔ 인풋 | `0.375rem` |
| 섹션 제목 ↔ 내용 | `1.5rem` |

### 최대 너비

| 페이지 | max-width |
|--------|-----------|
| 업로드 카드 | `480px` (중앙 정렬) |
| 결과 편집 | `900px` |
| 히스토리 목록 | `1000px` |
| 통계 대시보드 | `1200px` |

---

## 공통 컴포넌트 스타일 가이드

### 카드

```typescript
const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};  // 12px
  box-shadow: ${({ theme }) => theme.shadows.sm};     // 초경량
  padding: 1.5rem;
`;
```

### 버튼

| 버전 | 배경 | 텍스트 | 보더 | 용도 |
|------|------|--------|------|------|
| primary | `#7C3AED` | `#FFF` | none | CTA (다운로드, 저장) |
| ai | `#7C3AED` | `#FFF` | none | AI 보완 실행 |
| outline | `#FFF` | `#333` | `1px solid #E5E7EB` | 보조 액션 |
| destructive | `#EF4444` | `#FFF` | none | 삭제 |

```typescript
const Button = styled.button<{ $variant?: 'primary' | 'ai' | 'outline' | 'destructive' }>`
  padding: 0.6rem 1.25rem;
  border-radius: ${({ theme }) => theme.radius.sm};  // 6px
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: opacity 0.15s ease;
  border: ${({ $variant, theme }) =>
    $variant === 'outline' ? `1px solid ${theme.colors.border}` : 'none'};
  background: ${({ $variant, theme }) =>
    $variant === 'primary' || $variant === 'ai' ? theme.colors.primary
    : $variant === 'destructive' ? theme.colors.destructive
    : theme.colors.card};
  color: ${({ $variant, theme }) =>
    $variant === 'outline' ? theme.colors.foreground
    : theme.colors.primaryForeground};

  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
```

### 탭

```
  ┌──────────┬──────────┬──────────┬──────────┐
  │ 프로필   │ 경력     │ 프로젝트  │ 스킬     │
  ├──────────┴──────────┴──────────┴──────────┤
  │  ══════                                    │  ← 활성 탭: #7C3AED 밑줄 2px
  └────────────────────────────────────────────┘
```

```typescript
const Tab = styled.button<{ $active: boolean }>`
  padding: 0.625rem 1.25rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.mutedForeground};
  border-bottom: 2px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  margin-bottom: -2px;
  transition: color 0.15s ease;
`;
```

### 인풋 / 텍스트에리어

```typescript
// 기본 상태: 회색 보더
// AI 보완 필드: 연보라 배경 + 보라 보더 + "AI 생성" 뱃지
const Input = styled.input<{ $aiGenerated?: boolean }>`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid ${({ $aiGenerated }) =>
    $aiGenerated ? '#D6BCFA' : '#E5E7EB'};
  border-radius: 8px;
  background: ${({ $aiGenerated }) =>
    $aiGenerated ? '#FAF5FF' : '#FFFFFF'};
  font-size: 0.875rem;
  color: #0F0B15;
  outline: none;

  &:focus {
    border-color: #7C3AED;
    box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15);
  }
`;
```

### AI 뱃지

```typescript
const AIBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 500;
  background: #7C3AED;
  color: #FFFFFF;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  margin-left: 0.5rem;
`;
```

### 라벨

```typescript
const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #71717A;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.375rem;
`;
```

### 스킬 태그

```typescript
// expert: 보라 배경 + 흰 텍스트
// advanced: 연보라 배경 + 진보라 텍스트
// intermediate: 회색 배경 + 회색 텍스트
const SkillTag = styled.span<{ $level: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${({ $level, theme }) =>
    $level === 'expert' ? theme.colors.primary
    : $level === 'advanced' ? theme.colors.secondary
    : theme.colors.muted};
  color: ${({ $level, theme }) =>
    $level === 'expert' ? theme.colors.primaryForeground
    : $level === 'advanced' ? theme.colors.secondaryForeground
    : theme.colors.mutedForeground};
`;
```

### 메트릭 카드 (통계 페이지용)

```typescript
// 큰 숫자 + 변화율 표시
const MetricCard = styled(Card)`
  .value { font-size: 2rem; font-weight: 700; letter-spacing: -0.025em; }
  .label { font-size: 0.75rem; color: #71717A; }
  .change { font-size: 0.8125rem; color: #22C55E; } // 긍정적 변화
`;
```

---

## 페이지별 디자인 가이드

### 1. 업로드 페이지 (`/pdf`)

```
┌─────────── #FAFAFA 배경 ───────────┐
│                                     │
│     ┌──── 480px 카드 ─────────┐     │
│     │  📄 PDF → resume.ts     │     │
│     │                         │     │
│     │  ┌── 드롭존 ──────────┐ │     │
│     │  │  - - - - - - - - - │ │     │  ← dashed 보더 #E5E7EB
│     │  │  📄 아이콘          │ │     │
│     │  │  텍스트             │ │     │  ← 드래그 시 #F3F0FF 배경, #7C3AED 보더
│     │  │  - - - - - - - - - │ │     │
│     │  └────────────────────┘ │     │
│     │                         │     │
│     │  ╔══════════════════╗   │     │
│     │  ║   변환 시작       ║   │     │  ← #7C3AED primary 버튼
│     │  ╚══════════════════╝   │     │
│     └─────────────────────────┘     │
│                                     │
└─────────────────────────────────────┘
```

- 드롭존 hover/drag 시: 보더 `#7C3AED`, 배경 `#F3F0FF` (연보라)
- 파일 선택 후: 파일명 표시
- 에러: `#EF4444` 텍스트

### 2. 결과 편집 페이지 (`/pdf/result`)

```
┌── max-width: 900px ──────────────────────────────┐
│  변환 결과 확인 & 편집     [AI 보완] [다운로드]    │
│                                                   │
│  ┌─────────┬─────────┬──────────┬────────┐        │
│  │ 프로필  │ 경력    │ 프로젝트  │ 스킬   │        │  ← 탭 (활성: 보라 밑줄)
│  ╞═════════╧═════════╧══════════╧════════╡        │
│  │                                       │        │
│  │  ┌─ 필드 ────────────────────────┐    │        │
│  │  │  LABEL          [AI 생성]     │    │        │  ← AI 뱃지 (보라 pill)
│  │  │  ┌──────────────────────────┐ │    │        │
│  │  │  │  #FAF5FF 배경 (AI 필드)  │ │    │        │  ← AI 보완 필드: 연보라
│  │  │  └──────────────────────────┘ │    │        │
│  │  └────────────────────────────────┘    │        │
│  │                                       │        │
│  │  경력 카드들 (카드 안에 필드 그룹)       │        │
│  └───────────────────────────────────────┘        │
└───────────────────────────────────────────────────┘
```

- 각 경력/프로젝트 항목: 카드로 구분
- AI 보완 필드: `#FAF5FF` 배경, `#D6BCFA` 보더, 보라 `AI 생성` 뱃지
- 스킬 레벨: `<select>` 드롭다운

### 3. 히스토리 목록 (`/pdf/history`)

```
┌── max-width: 1000px ─────────────────────────────┐
│  변환 히스토리                                     │
│                                                   │
│  ┌───────────────────────────────────────────┐    │
│  │ 파일명        │ 시각     │ 상태  │ 리뷰   │    │  ← 테이블 (카드 안)
│  ├───────────────┼─────────┼───────┼────────┤    │
│  │ 이력서.pdf    │ 3.12    │ ✅    │ ★★★★  │    │
│  │ resume2.pdf   │ 3.11    │ ✅    │ —      │    │
│  └───────────────────────────────────────────┘    │
└───────────────────────────────────────────────────┘
```

- 상태 뱃지: 성공(`#22C55E`), 실패(`#EF4444`), 부분(`#F59E0B`)
- 행 hover: `#FAFAFA` 배경

### 4. 통계 대시보드 (`/pdf/history/stats`)

```
┌── max-width: 1200px ─────────────────────────────┐
│  ┌── 메트릭 ──┐  ┌── 메트릭 ──┐  ┌── 메트릭 ──┐ │
│  │  평균 3.8   │  │  보완 12건  │  │  PDF 45건  │ │  ← 보라 차트 포인트
│  └────────────┘  └────────────┘  └────────────┘ │
│                                                   │
│  ┌── 바 차트 (섹션별 정확도) ────────────────┐    │
│  │  ████████████████████  프로필  4.2       │    │  ← #7C3AED 바
│  │  ██████████████████    경력    3.8       │    │
│  │  ████████████████      프로젝트 3.5      │    │
│  └──────────────────────────────────────────┘    │
│                                                   │
│  ┌── 자주 오류 필드 TOP 10 ─────────────────┐    │
│  │  1. profile.bio           42%            │    │
│  │  2. career.achievements   38%            │    │
│  └──────────────────────────────────────────┘    │
└───────────────────────────────────────────────────┘
```

- 차트 색상: `#7C3AED` (primary), `#DDD6FE` (accent), `#F3F0FF` (secondary)
- 바 차트 배경: `#F4F4F5` (muted)

---

## 리뷰 유도 모달

```
┌───── 반투명 오버레이 ─────────────────────┐
│                                           │
│     ┌──── 400px 모달 ────────────┐        │
│     │                            │        │
│     │  다운로드 완료!              │        │
│     │                            │        │
│     │  변환 품질을 평가해주시면    │        │
│     │  서비스 개선에 도움이 됩니다  │        │
│     │                            │        │
│     │  ╔═══════════╗ ┌─────────┐ │        │
│     │  ║ 리뷰 하기  ║ │ 나중에  │ │        │  ← primary + outline 버튼
│     │  ╚═══════════╝ └─────────┘ │        │
│     └────────────────────────────┘        │
│                                           │
└───────────────────────────────────────────┘
```

- 오버레이: `rgba(0,0,0,0.4)`
- 모달: `border-radius: 16px`, `padding: 2rem`

---

## 로딩 상태

- 업로드 후 파싱 중: 버튼 비활성 + "분석 중..." 텍스트 + `opacity: 0.7`
- AI 보완 중: 버튼 비활성 + "AI 보완 중..." + 선택적으로 보라 스피너
- 스피너: `#7C3AED` 색상, `border: 2px solid`, 회전 애니메이션

---

## 반응형

| 브레이크포인트 | 변경사항 |
|---------------|---------|
| `< 768px` | 탭 → 가로 스크롤, 카드 padding `1rem`, 버튼 스택 |
| `< 480px` | 업로드 카드 full-width, 헤더 액션 세로 정렬 |

---

## 완료 체크리스트

- [ ] `src/styles/themes/purple.ts` — Deep Purple 디자인 토큰 (이미 존재 시 확인)
- [ ] 공통 styled-components: Card, Button, Tab, Input, Label, AIBadge, SkillTag
- [ ] 업로드 페이지: 드롭존 (보라 hover/drag), primary 버튼
- [ ] 결과 페이지: 탭 (보라 밑줄), AI 필드 (연보라 배경), 카드 레이아웃
- [ ] 히스토리: 테이블 카드, 상태 뱃지
- [ ] 통계: 메트릭 카드, 보라 차트
- [ ] 리뷰 모달: 반투명 오버레이 + 둥근 모달
- [ ] 로딩 상태: 보라 스피너, 비활성 버튼
- [ ] 반응형: 768px, 480px 브레이크포인트
