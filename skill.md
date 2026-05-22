# SKILL.MD — 김슬기 포트폴리오 작업 기록

> 작업 규칙
> 1. 무조건 작업계획을 먼저 공유 → 승인 후 진행
> 2. 작업 완료 시 이 파일에 육하원칙으로 기록
> 3. 아래 항목은 매 작업마다 최신 상태로 덮어쓰기 갱신

---

## 작업 1 — 포트폴리오 초기 구현

- **언제**: 2026-05-19
- **누가**: Claude (요청자: 김슬기)
- **무엇을**: 클로버 테마 UIUX 포트폴리오 단일 HTML 페이지 구현
- **어디서**: `index.html` (1806줄 단일 파일)
- **어떻게**: React 18.3.1 CDN + Babel Standalone으로 빌드 없이 JSX 트랜스파일, 디자인 파일의 README·채팅 기록을 참조해 클로버 컨셉 구현
- **왜**: 별도 빌드 툴 없이 브라우저에서 바로 열 수 있는 포트폴리오 파일이 필요

---

## 작업 2 — 섹션 높이 100vh 고정

- **언제**: 2026-05-19
- **누가**: Claude (요청자: 김슬기)
- **무엇을**: 각 섹션의 높이를 정확히 100vh로 제한
- **어디서**: `index.html` 인라인 `<style>` → 이후 `styles.css`로 이동
- **어떻게**: `min-height: 100vh` → `height: 100vh; max-height: 100vh; overflow: hidden` 으로 변경
- **왜**: 각 섹션이 뷰포트 한 화면에 꽉 차게 보여야 하는 UX 요구

---

## 작업 3 — HTML / CSS / JS 파일 분리

- **언제**: 2026-05-19
- **누가**: Claude (요청자: 김슬기)
- **무엇을**: 단일 `index.html`을 세 파일로 분리
- **어디서**: `c:\김슬기\김슬기\portfoli02\`
- **어떻게**:
  - `styles.css` 신규 생성 — 기존 `<style>` 블록 전체 이동
  - `app.js` 신규 생성 — 기존 `<script type="text/babel">` 블록 전체 이동
  - `index.html` 경량화 — 폰트 링크 + `<link href="styles.css">` + `<script src="app.js">` 만 남김
- **왜**: 파일별 역할 분리로 수정 범위를 줄이고 유지보수성 향상

---

## 작업 4 — 코드 리뷰 및 유지보수 구조 정리

- **언제**: 2026-05-19
- **누가**: Claude (요청자: 김슬기)
- **무엇을**: 전체 파일 코드 리뷰 후 유지보수 하기 쉬운 구조로 재정비
- **어디서**: `app.js`, `styles.css`
- **어떻게**:
  1. **콘텐츠 데이터 분리** — 컴포넌트 내부에 하드코딩된 배열을 파일 최상단 상수로 추출
     - `NAV_ITEMS` (사이드 내비게이션 항목)
     - `PROJECTS` (프로젝트 4건)
     - `HOBBIES` (취미 3건 + 인라인 SVG 아트)
     - `CONTACTS` (연락처 4건)
  2. **CSS-in-JS 제거** — `__TWEAKS_STYLE` 인라인 CSS 문자열 → `styles.css`의 `.twk-*` 블록으로 이동, `TweaksPanel`의 런타임 `<style>` 주입 삭제
  3. **코드 순서 정리** — Data → Utilities → Clover → Tweaks → Intro → Layout → Sections → App 순으로 논리적 배치
- **왜**: 콘텐츠(텍스트·링크·태그) 수정 시 컴포넌트 내부를 탐색하지 않고 파일 상단 DATA 블록만 편집하면 되도록

---

## 작업 5 — React 제거 → HTML 구조 + vanilla JS 이펙트로 전환

- **언제**: 2026-05-19
- **누가**: Claude (요청자: 김슬기)
- **무엇을**: React/Babel CDN 완전 제거, 콘텐츠를 HTML로 이전, 이펙트만 vanilla JS로 유지
- **어디서**: `index.html`, `app.js`, `styles.css` 전면 재작성
- **어떻게**:
  1. **index.html** — 실제 콘텐츠를 HTML 태그로 직접 작성 (JSX 없음). React·Babel CDN 삭제, `<script src="app.js">` 일반 스크립트로 교체. JSX 속성(`strokeWidth` 등)을 HTML 속성(`stroke-width`)으로 변환
  2. **app.js** — React 완전 제거, vanilla JS만 사용. `cloverHTML()` (속성 기반, 인트로용), `cloverCSSHTML()` (CSS var 기반, 코너 클로버용) 두 함수로 SVG 생성 분리. `initIntro()` / `initSideNav()` / `initPolaroid()` / `initTweaks()` 함수별 초기화 구조. `_introCleanup` 패턴으로 리플레이 시 이벤트 리스너 중복 방지
  3. **styles.css** — `.clover-fill` / `.clover-vein` / `.clover-stem` / `.clover-center` CSS 클래스 추가 (팔레트 변경 시 코너 클로버 색상 자동 반영). `#tweaks-btn` 스타일 CSS로 이동
- **왜**: "구조는 HTML, 이펙트만 JS" 원칙 실현. 콘텐츠 수정 시 JS를 전혀 건드리지 않고 HTML만 편집하면 되도록

---

## 이번 작업 목표

React → HTML + vanilla JS 구조 전환 완료

---

## 확정된 UX 정책

| 항목 | 정책 |
|------|------|
| 섹션 높이 | 각 `.leaf` 섹션은 `height: 100vh; overflow: hidden` 고정 |
| 인트로 | 네잎 클로버 돋보기 찾기 → 클릭 후 포트폴리오 진입 |
| 테마 | Forest(기본) / Meadow / Midnight 3종, CSS 변수로 동적 전환 |
| 사이드 내비 | 좌측 고정, IntersectionObserver로 현재 섹션 하이라이트 |
| 폴라로이드 | 드래그·스와이프·버튼 세 가지 방식으로 슬라이드 |
| 반응형 | 900px 이하 사이드 내비 숨김, 그리드 단열 전환 |

---

## 화면 구조

```
index.html
├─ #intro  (fixed 오버레이 — JS가 클로버 필드 생성)
│   ├─ .intro-hint  (정적 텍스트)
│   ├─ #field-bw / #field-color  (JS가 클로버 SVG 삽입)
│   ├─ #lens, #sparkle, #found-hint  (JS가 위치·표시 제어)
│   └─ .intro-foot  (정적 텍스트)
├─ #side-nav  (hidden → 인트로 종료 후 JS가 표시)
└─ .app
    ├─ #leaf1  Leaf1: 자기소개 + Facts
    ├─ #leaf2  Leaf2: 프로젝트 4건
    ├─ #leaf3  Leaf3: 폴라로이드 캐러셀 (취미 3건)
    ├─ #leaf4  Leaf4: 연락처
    └─ footer
```

---

## 상태관리 항목

> React 제거 후 단일 `st` 객체로 통합 관리 (app.js 최상단)

| 키 | 타입 | 설명 |
|----|------|------|
| `st.paletteKey` | string | 현재 팔레트 ('forest' / 'meadow' / 'midnight') |
| `st.density` | number | 인트로 클로버 개수 |
| `st.lensSize` | number | 돋보기 직경(px) |
| `st.showSideNav` | boolean | 사이드 내비 표시 여부 |
| `st.introActive` | boolean | 인트로 화면 활성 여부 |
| `st.carouselIdx` | number | 폴라로이드 현재 인덱스 |
| `st.drag` / `st.dragging` | number / boolean | 드래그 오프셋·진행 여부 |
| `st.dragStartX` | number | 드래그 시작 X 좌표 |

---

## localStorage key 설계

현재 미사용 (새로고침 시 인트로부터 재시작)

| key | 타입 | 용도 | 상태 |
|-----|------|------|------|
| `portfolio_palette` | string | 마지막 선택 테마 저장 | 미구현 (예정) |
| `portfolio_intro_seen` | boolean | 인트로 스킵 여부 | 미구현 (예정) |

---

## 다음 작업

- 실제 사진 및 프로젝트 이미지 삽입 (about-portrait 플레이스홀더 교체)
- 프로젝트 상세 페이지 또는 모달 연결
- localStorage로 마지막 팔레트 설정 유지
- 인트로 스킵 옵션 (재방문 시 바로 메인으로)
- 반응형 모바일 점검 및 개선
