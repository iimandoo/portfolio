---
description: 기존 화면을 UX 관점에서 점검하고 개선안 제시
argument-hint: "<점검할 화면 또는 페이지>"
---

ui-designer subagent에게 전달:

"$ARGUMENTS" 디자인 리뷰.

사전 체크: CLAUDE.md, docs/designer/style/ 스타일 가이드, docs/pm/ 기획 문서 참고.

리뷰 관점:
1. 첫인상 (3초) — 목적 이해? 다음 행동 명확?
2. 시각적 위계 — 중요도 순서, CTA, 시선 흐름
3. 레이아웃 & 여백 — 간격 일관성, 그룹핑
4. 인터랙션 & 상태 — 탭 구분, Loading/Empty/Error
5. 일관성 — 스타일 가이드 준수, 톤앤매너
6. 접근성 — 대비, 터치 타겟 44px, 아이콘 레이블

피드백 형식: 등급(🔴/🟡/🟢) + 위치 + 현재 + 문제 + 개선안(수치 포함)

대화로 직접 답변. 개선 시안 필요 시 "/designer-sample 추천" 안내.
