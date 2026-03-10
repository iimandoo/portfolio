# Explore (탐색/분석 단계) - Next.js 16

**Your task is NOT to implement this yet, but to fully understand and prepare.**

## Your Responsibilities

1. **코드베이스 분석**
   - 관련 파일/폴더 탐색
   - 기존 코드 패턴 파악
   - 의존성 및 영향 범위 확인

2. **요구사항 이해**
   - 구현 또는 디버깅해야 할 내용 파악
   - 현재 상태와 목표 상태 정리

3. **질문 리스트 작성**
   - 모호하거나 불명확한 점 나열
   - 결정이 필요한 사항 질문
   - 가정하지 말고 반드시 질문할 것

## Next.js 16 프로젝트 구조 (App Router + VAC 패턴)

```
src/
├── app/                        # App Router (라우팅)
│   ├── (auth)/                      # Route Group (인증)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (main)/                      # Route Group (메인)
│   │   ├── dashboard/page.tsx
│   │   └── users/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   ├── api/                         # API Routes
│   │   └── users/route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx                # Client Providers (QueryClient, etc.)
│
├── components/                 # 컴포넌트 (VAC 패턴)
│   ├── ui/                          # shadcn/ui 컴포넌트
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── features/                    # 기능별 컴포넌트 (VAC)
│       └── user/
│           ├── user-list.tsx             # View (UI만)
│           ├── user-list.container.tsx   # Container (로직)
│           ├── user-list.action.ts       # Action (Server Action)
│           └── user-card.tsx
│
├── stores/                     # Zustand 스토어 (Client State)
│   ├── use-auth-store.ts
│   ├── use-ui-store.ts              # 모달, 사이드바 등
│   └── index.ts
│
├── hooks/                      # Custom Hooks
│   ├── queries/                     # TanStack Query (Server State)
│   │   ├── use-users.ts
│   │   └── use-user-detail.ts
│   └── use-debounce.ts
│
├── lib/                        # 유틸리티
│   ├── api/
│   │   └── client.ts                # API 클라이언트
│   ├── utils.ts                     # cn() 등
│   └── validations/
│       └── user.ts                  # Zod 스키마
│
├── types/                      # TypeScript 타입
│   ├── user.ts
│   └── api.ts
│
└── styles/
    └── globals.css
```

## 상태 관리 구분

| 종류 | 라이브러리 | 용도 |
|:-----|:----------|:-----|
| **Server State** | TanStack Query | API 데이터, 캐싱, 동기화 |
| **Client State** | Zustand | UI 상태, 모달, 사이드바 |
| **Form State** | React Hook Form | 폼 입력, 유효성 검사 |
| **URL State** | nuqs | URL 쿼리 파라미터 |

## Rules

- ❌ **절대 코드를 수정하지 마세요**
- ❌ **구현을 시작하지 마세요**
- ✅ 분석하고 질문만 하세요
- ✅ 충분히 이해될 때까지 질문하세요

## Next.js 16 특화 체크포인트

- [ ] Server Component vs Client Component 구분
- [ ] VAC 패턴 적용 여부 (View / Action / Container)
- [ ] 상태 종류 구분 (Server State vs Client State)
- [ ] TanStack Query 사용 여부 (API 데이터)
- [ ] Zustand 스토어 구조 (UI 상태)
- [ ] shadcn/ui 컴포넌트 활용
- [ ] Cache Components / use cache 사용 여부
- [ ] Turbopack 설정 확인

## Output Format

```
📂 관련 파일 분석
- [파일 경로]: [역할/내용 요약]

🔍 현재 상태
- [현재 어떻게 동작하는지]
- Server/Client Component: [구분]
- VAC 패턴: [적용 여부]
- 상태 관리: [Server State / Client State 구분]

🎯 목표
- [구현/수정 후 예상 결과]

❓ 질문
1. [명확히 해야 할 점]
2. [결정이 필요한 사항]

질문에 답변해주시면 다음 단계로 진행하겠습니다.
```

## Next Step

- 해결되지 않은 질문이 있으면 추가 질문
- 질문이 모두 해결되면 → `/plan` (복잡한 작업) 또는 `/execute` (간단한 작업)
