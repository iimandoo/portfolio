---
description: 디자인 스타일 가이드 (HTML + 디자인 토큰) 생성
argument-hint: "<프로젝트명 또는 브랜드 방향 (선택)>"
---

ui-designer subagent에게 전달:

프로젝트 디자인 스타일 가이드 생성.

사전 체크: CLAUDE.md, 기존 코드에서 사용 중인 컬러/폰트/컴포넌트 파악.
"$ARGUMENTS" 있으면 브랜드 방향 참고.

포함 내용:
1. 브랜드 키워드 + 톤앤매너 + Do & Don't
2. 컬러 시스템 (Primary/Secondary/Accent/Semantic/Gray + HEX + 대비)
3. 타이포그래피 (스케일, 크기, 굵기, 줄간격 + 미리보기)
4. 간격 시스템 (Base Unit + 스케일 + 사용 예시)
5. 핵심 컴포넌트 (버튼/인풋/카드/태그/탭바/헤더/모달/Toast, 상태별)
6. 아이콘 + 그리드 & 레이아웃

저장:
- docs/designer/style/style-guide.html (인터랙티브, 앵커 링크, 컬러 클릭 복사)
- docs/designer/style/design-tokens.md (개발팀 전달용 + Tailwind config 매핑)

docs/designer/style/ 폴더 없으면 생성.
