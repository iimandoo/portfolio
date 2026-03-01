# Plan (계획 단계) - Next.js 16

**탐색/분석 내용을 바탕으로 구현 계획을 체크리스트로 작성합니다.**

## Your Responsibilities

1. **구현 계획 수립**
   - 단계별 작업 순서 정리
   - 각 단계의 구체적인 내용 명시

2. **변경 사항 정리**
   - 수정할 파일 목록
   - 새로 생성할 파일 목록
   - 삭제할 파일 (있다면)

3. **위험 요소 파악**
   - 예상되는 문제점
   - 주의해야 할 사항

## Rules

- ❌ **아직 코드를 수정하지 마세요**
- ❌ **구현을 시작하지 마세요**
- ✅ 계획만 작성하세요
- ✅ 체크리스트 형태로 출력하세요

## VAC 패턴 역할

| 파일 | 역할 | 특징 |
|:-----|:-----|:-----|
| `*.tsx` (View) | UI 렌더링만 | Props만 받음, 로직 없음 |
| `*.action.ts` | Server Actions | mutation, revalidate |
| `*.container.tsx` | 로직/상태 | hooks, 이벤트 핸들러 |

## 상태 관리 선택 가이드

| 상태 종류 | 라이브러리 | 예시 |
|:----------|:----------|:-----|
| API 데이터 | TanStack Query | 사용자 목록, 상품 정보 |
| UI 상태 | Zustand | 모달, 사이드바, 테마 |
| 폼 입력 | React Hook Form | 로그인, 회원가입 폼 |
| URL 파라미터 | nuqs | 검색어, 필터, 페이지 |

## Output Format

```
📋 구현 계획

## VAC 구조
- [ ] `user-list.tsx` - View (Server Component)
- [ ] `user-list.container.tsx` - Container (Client)
- [ ] `user-form.action.ts` - Action (Server Action)

## 상태 관리
### Server State (TanStack Query)
- [ ] `hooks/queries/use-users.ts` - 사용자 목록 조회
- [ ] `hooks/queries/use-user-mutations.ts` - 생성/수정/삭제

### Client State (Zustand)
- [ ] `stores/use-ui-store.ts` - 모달 상태

## shadcn/ui 컴포넌트
- [ ] Button, Input, Card, Dialog, Toast

## 생성할 파일
- [ ] `components/features/user/user-form.tsx` - View
- [ ] `components/features/user/user-form.container.tsx` - Container
- [ ] `components/features/user/user-form.action.ts` - Action
- [ ] `hooks/queries/use-users.ts` - TanStack Query
- [ ] `lib/validations/user.ts` - Zod 스키마

## 구현 순서
- [ ] Step 1: 타입 정의 (types/)
- [ ] Step 2: Zod 스키마 (lib/validations/)
- [ ] Step 3: TanStack Query hooks (hooks/queries/)
- [ ] Step 4: Zustand store (stores/) - 필요시
- [ ] Step 5: Server Action (*.action.ts)
- [ ] Step 6: View 컴포넌트 (*.tsx)
- [ ] Step 7: Container 연결 (*.container.tsx)
- [ ] Step 8: Page에 통합

## ⚠️ 주의사항
- [Server/Client 경계]
- [TanStack Query 캐시 키 설계]
- [Zustand persist 필요 여부]

---
이 계획대로 진행할까요?
승인하시면 `/execute`로 구현을 시작합니다.
```

## Next Step

- 계획 승인 → `/execute`
- 계획 수정 필요 → 피드백 후 계획 수정
