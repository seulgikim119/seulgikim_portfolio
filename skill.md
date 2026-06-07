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

## 작업 6 — 우측 클로버 네비게이션 추가

- **언제**: 2026-06-07
- **누가**: Claude (요청자: 김슬기)
- **무엇을**: 각 섹션 타이틀의 클로버 이미지를 우측 고정 네비게이션 아이콘으로 재사용
- **어디서**: `index.html` (nav 마크업), `styles.css` (leaf-nav 블록), `app.js` (initLeafNav 함수)
- **어떻게**:
  - `#leaf-nav` 고정 우측 네비 추가 — hope/faith/happiness/luck 클로버 이미지 4개
  - CSS: `position: fixed; right; top: 50%` 수직 중앙 배치, 기본 흑백 → 활성 풀컬러 전환
  - JS: `IntersectionObserver` 대신 스크롤 기반 `requestAnimationFrame` 으로 가장 가까운 섹션 감지
  - 클릭 시 `scrollIntoView({ behavior: 'smooth' })` 적용
  - 인트로 `passed-through` 클래스 감지(`MutationObserver`) → 네비 등장
- **왜**: 현재 섹션을 한눈에 파악하고 빠르게 이동할 수 있는 내비게이션 UX 필요

---

## 작업 7 — 전체 인터랙션 스무스 개선 + 반응형 정비

- **언제**: 2026-06-07
- **누가**: Claude (요청자: 김슬기)
- **무엇을**: 모든 인터랙션의 전환 품질 향상 및 화면 크기별 자연스러운 반응형 처리
- **어디서**: `styles.css` (전역 및 leaf-nav 블록), `app.js` (initLeafNav 함수)
- **어떻게**:
  1. **leaf-nav CSS 재작성**
     - `opacity` 토글 → `visibility` 로 변경 (합성 레이어 충돌 방지)
     - `@keyframes leaf-nav-item-in` 추가 — 4개 항목 `68ms` 간격 stagger 등장
     - `will-change: transform, filter` 적용으로 GPU 합성 유도
     - 레이블 슬라이드: `order: -1` + `translateX(6px → 0)` 로 이미지 왼쪽에서 등장
     - 반응형 4단계: >1280px(40px) / 900-1280px(34px) / 600-900px(28px, 레이블 숨김) / <600px(하단 pill 수평 네비)
     - 600px 이하: `backdrop-filter: blur(14px)` pill 형태로 하단 고정, `border-radius: 100px`
  2. **initLeafNav JS 재작성**
     - `IntersectionObserver(threshold:0.3)` → 스크롤 RAF 쓰로틀 + 뷰포트 중앙 거리 계산으로 교체 (깜박임 제거)
     - `window.scrollTo({ top: offsetTop })` → `scrollIntoView({ behavior: 'smooth' })` 로 교체
     - `--nav-i` CSS 변수로 각 항목 stagger delay 제어
     - `shown` 플래그로 입장 애니메이션 최초 1회만 재생 보장
  3. **전역 CSS 스무스 추가**
     - `.photo-modal-close`: `transform scale(1.1) rotate(8deg)` 호버 트랜지션 추가
     - `.foot`: 540px 이하에서 `flex-direction: column; text-align: center` 자연스럽게 줄바꿈
- **왜**: 화면 크기에 따라 네비가 흔들리거나 잘리지 않고 자연스럽게 크기가 변해야 하며, 활성 섹션 감지 깜박임을 제거해야 했음

---

## 작업 8 — 여행 폴라로이드 hover 이미지 배치 재정렬 (왼쪽 3 / 오른쪽 4)

- **언제**: 2026-06-07
- **누가**: Claude (요청자: 김슬기)
- **무엇을**: 여행 폴라로이드 카드 hover 시 나타나는 7장 미니 사진의 위치를 왼쪽 3장·오른쪽 4장으로 균등 배치
- **어디서**: `styles.css` — `.travel-hover-1` ~ `.travel-hover-7` 개별 선택자
- **어떻게**:
  - **왼쪽 3장** (travel-hover-1·3·5): 상단(top:11%) → 중단(top:42%) → 하단(bottom:11%) 수직 균등 분배
    - 각 `--x` 값 `-84% ~ -88%` 로 카드 좌측 충분한 여백 확보
    - `--y` 값: 상단 -22% / 중단 0% / 하단 +20% 으로 기울기 반영
  - **오른쪽 4장** (travel-hover-6·2·4·7): 최상단(top:5%) → 상(top:30%) → 하(top:56%) → 최하단(bottom:5%) 4분할
    - 각 `--x` 값 `+78% ~ +84%` 우측 배치
    - `--y` 값: -36% / -10% / +10% / +34% 로 단계적 하강
  - 회전각(--rot)·float delay(--delay)는 자연스러운 느낌 유지
  - 모바일(max-width:720px) travel-hover-7 오버라이드도 동일 방향 정합성으로 조정
- **왜**: 기존에는 hover-5·6이 `top:4%, --y:-30%`로 화면 상단에 과도하게 밀집해 시각적으로 산만했음. 좌우 컬럼 수직 간격을 균등하게 배분하여 깔끔한 부채꼴 레이아웃으로 개선

---

## 작업 9 — 푸터 배경색 섹션과 통일

- **언제**: 2026-06-07
- **누가**: Claude (요청자: 김슬기)
- **무엇을**: 푸터 배경색이 나머지 섹션과 달라 보이던 문제 수정
- **어디서**: `styles.css` — `.foot { background }` 한 줄
- **어떻게**: `background: var(--bg)` → `background: var(--section-bg)` 로 변경
- **왜**: JS `applyPaletteVars()`가 DOMContentLoaded 시 `--bg`를 forest 팔레트 값(`#f6f1e4`)으로 덮어쓰지만 `--section-bg`는 업데이트하지 않아 두 값이 달라짐. 섹션들은 `--section-bg`를 사용하므로 푸터도 동일 변수를 참조하도록 통일

---

## 작업 10 — 사진촬영 폴라로이드 hover 이미지 배치 재정렬 (왼쪽 2 / 오른쪽 3)

- **언제**: 2026-06-07
- **누가**: Claude (요청자: 김슬기)
- **무엇을**: 사진촬영 폴라로이드 카드 hover 시 나타나는 5장 미니 사진 위치 정리
- **어디서**: `styles.css` — `.photo-hover-1` ~ `.photo-hover-5`
- **어떻게**:
  - **왼쪽 2장** (photo-hover-1·3): 상단(top:16%) · 하단(bottom:12%) 2분할
    - `--x: -76 ~ -78%`, `--y: -22% / +22%` 로 위아래 대칭 배분
  - **오른쪽 3장** (photo-hover-2·4·5): 상단(top:8%) · 중단(top:44%) · 하단(bottom:8%) 3분할
    - `--x: +76 ~ +80%`, `--y: -28% / +2% / +26%` 단계적 배분
  - photo-hover-5의 기존 `right: -7%` (클라우드 밖으로 삐져나옴) → `right: 6%` 로 교정
  - 모바일(max-width:720px) photo-hover-5 오버라이드도 정합성 맞게 조정
- **왜**: 기존에 photo-hover-4·5가 모두 bottom에 겹쳐 있고, photo-hover-3이 left:-1%로 클라우드 밖에 걸쳐 있어 시각적으로 산만했음

---

## 작업 11 — About 섹션 모바일 반응형 수정

- **언제**: 2026-06-07
- **누가**: Claude (요청자: 김슬기)
- **무엇을**: 좁은 모바일 뷰포트(390px 등)에서 scatter 포토 3장이 상단에 겹쳐 보이는 문제 수정
- **어디서**: `styles.css` — `@media (max-width: 900px)` 블록 및 `@media (max-width: 540px)` 블록
- **어떻게**:
  - **원인**: `aspect-ratio: 16/8` (2:1 가로비)로 인해 폭이 좁아질수록 portrait 높이가 급격히 감소 → 390px에서 약 184px만 확보돼 사진 3장이 30~40px 구간에 몰림
  - **900px 블록**: 그대로 유지 (`aspect-ratio: 16/8; min-height: 220px`) — 500–900px 범위에서는 충분한 높이 확보됨
  - **540px 블록(신규 추가)**:
    - `.about-portrait`: `aspect-ratio: auto; height: clamp(310px, 86vw, 420px); min-height: 310px` — 폭 비례 대신 명시적 높이 부여
    - `.photo-scatter-board`: `min-height: 288px`
    - scatter-photo-1: `left: 4%; top: 5%` (좌상단 여백 확보)
    - scatter-photo-2: `right: 4%; bottom: 20%; width: clamp(100px, 32vw, 132px)`
    - scatter-photo-3: `left: 26%; bottom: 3%; width: clamp(94px, 30vw, 124px)`
    - scatter-photo-main: `width: clamp(118px, 38vw, 155px)` (중앙 크기 조정)
  - 결과: 390px 뷰포트에서 사진 3장이 15–287px 구간으로 분산 배치
- **왜**: 400px 미만 모바일에서 aspect-ratio 계산값이 min-height 기준보다 작아 레이아웃이 무너짐

---

## 다음 작업

- 실제 사진 및 프로젝트 이미지 삽입 (about-portrait 플레이스홀더 교체)
- 프로젝트 상세 페이지 또는 모달 연결
- localStorage로 마지막 팔레트 설정 유지
- 인트로 스킵 옵션 (재방문 시 바로 메인으로)
