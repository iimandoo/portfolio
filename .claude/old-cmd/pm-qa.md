---
description: 기존 기획 질의응답, 검토, 부분 수정
argument-hint: "<기존 기획에 대한 질문>"
---

pm-planner subagent에게 전달:

**모드: Quick QA**

docs/pm/ 하위 기존 문서 + CLAUDE.md 참고 후 답변.

질문: "$ARGUMENTS"

규칙:
- 전체 프레임워크 실행 금지. 질문에만 답변.
- 간단한 답변은 대화로. 분석이 필요하면 docs/pm/qa/[날짜]-[주제].html 생성.
- HTML 생성 시 관련 차트/표 포함해서 가독성 있게.
- 재기획 필요하면 "/plan 추천" 안내.
