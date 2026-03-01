---
description: 3가지 디자인 시안을 HTML 프로토타입으로 생성
argument-hint: "<디자인할 화면 또는 기능>"
---

ui-designer subagent에게 전달:

"$ARGUMENTS" 3가지 디자인 시안 생성.

사전 체크: CLAUDE.md, docs/designer/style/ 스타일 가이드, docs/pm/ 기획 문서 참고.

**시안 A - 미니멀 & 기능 중심** (토스, Apple 무드)
**시안 B - 감성 & 브랜드 중심** (29CM, Aesop 무드)
**시안 C - 전환율 & 그로스 중심** (쿠팡, 무신사 무드)

각 시안: 단일 HTML, Tailwind CDN, 390px 모바일, 인터랙션 포함, 상단에 컨셉 주석.

저장:
- docs/designer/preview/sample-a-minimal.html
- docs/designer/preview/sample-b-brand.html
- docs/designer/preview/sample-c-growth.html
- docs/designer/preview/README.md (3개 비교 요약 + 추천)

docs/designer/preview/ 폴더 없으면 생성.
