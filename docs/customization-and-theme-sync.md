# Jandi 커스터마이징 및 동적 테마 동기화 가이드

Jandi는 GitHub 유저의 최근 1년간 컨트리뷰션 그래프를 Notion, 개인 포트폴리오(`react-notion-x`), 또는 일반 웹 문서에 `<iframe>`으로 임베드할 수 있는 서비스다.

---

## 1. 엔드포인트 구조

| 경로 | 렌더링 방식 | 특징 |
| :--- | :--- | :--- |
| `/[username]` | SVG (`Chart.tsx`) | 기본값. 벡터 기반으로 선명하며 각 날짜 셀과 하단 푸터(`@username`, `Jandi`)에 개별 링크 제공 |
| `/[username]/canvas` | HTML Canvas → PNG (`Canvas.tsx`) | 3배율(`scaleFactor = 3`) 캔버스를 투명 배경 PNG `data:` URL로 변환하고 `<map>` 영역으로 링크 제공 |
| `/api/v1/[username]` | JSON API | GitHub 컨트리뷰션 HTML을 파싱해 `{ total, range, contributions }` 구조로 반환 |

---

## 2. 쿼리 파라미터 상세

| 파라미터 | 기본값 | 형식 / 허용값 | 설명 |
| :--- | :--- | :--- | :--- |
| `scheme` | 시스템 자동 | `light` \| `dark` | 지정 시 시스템 테마와 무관하게 해당 컬러 모드로 고정한다. 동적 테마 연동을 쓰려면 생략해야 한다. |
| `dark` | `#191919` | `bg` 또는 `bg,text` | 다크 모드 배경색(`--color-bg-default`) 및 선택적 텍스트 색상(`--color-text-default`). `#` 없는 헥사 코드(`2f3437`), `#` 포함 값(`%232f3437`), CSS 컬러명(`transparent`) 모두 지원한다. |
| `white` | `#fff` | `bg` 또는 `bg,text` | 라이트 모드 배경색(`--color-bg-default`) 및 선택적 텍스트 색상(`--color-text-default`). |
| `halloween` | `10-31` 자동 | `true` \| `false` | GitHub 공식 Primer 할로윈 팔레트를 활성화하거나 비활성화한다. 미지정 시 `tz` 기준 10월 31일에만 자동 활성화된다. |
| `tz` | `Asia/Seoul` | IANA Time Zone | 오늘 날짜(`presentDate`) 계산 기준 타임존 (예: `UTC`, `America/New_York`). |
| `radius` | `2` | 숫자 (px) | 잔디 셀 사각형의 모서리 둥글기(`rx`, `ry`). |
| `margin` | `3` | 숫자 (px) | 잔디 셀 사이의 간격(px). |
| `weeks` | `true` | `false`, `0`, `hide`, `hidden`, `none` | 좌측 요일(`Mon`, `Wed`, `Fri`) 레이블 표시 여부. |
| `footer` | `true` | `false`, `0`, `hide`, `hidden`, `none` | 하단 컨트리뷰션 총계, `· Jandi` 링크, `Less / More` 범례 표시 여부. |
| `v` | 타임스탬프 앞 8자리 | 임의 문자열 | `/api/v1/[username]` 요청 캐시 우회용 버전 파라미터. |

### `dark` / `white` 컬러 파싱 규칙 (`page.tsx`)

- 단일 값(`?dark=2f3437&white=ffffff`): 배경색(`--color-bg-default`)만 오버라이드하고, 텍스트 색상은 기본값(`rgba(128, 128, 128, 0.9)`)을 유지한다.
- 콤마 구분(`?dark=2f3437,e5e7eb&white=ffffff,37352f`): 첫 번째 값은 배경색(`--color-bg-default`), 두 번째 값은 텍스트 색상(`--color-text-default`)으로 적용한다.
- 한쪽 모드만 텍스트 색상을 지정한 경우(예: `?dark=000000,ffffff&white=ffffff`), 반대쪽 모드로 전환될 때 색상이 섞이지 않도록 미지정 모드의 `--color-text-default`를 기본값(`rgba(128, 128, 128, 0.9)`)으로 명시적 초기화한다.

---

## 3. 할로윈(Halloween) 시즌 테마

GitHub Primer의 공식 할로윈 컨트리뷰션 컬러 팔레트를 라이트·다크 모드별로 제공한다.

| 단계 | 라이트 모드 | 다크 모드 |
| :--- | :--- | :--- |
| `L1` | `#ffee4a` | `#631c03` |
| `L2` | `#ffc501` | `#bd561d` |
| `L3` | `#fe9600` | `#fa7a18` |
| `L4` | `#03001c` | `#fddf68` |

- `tz` 기준 현재 날짜가 **10월 31일**이면 `halloween` 파라미터 없이도 자동 적용된다.
- 10월 31일에 기본 초록색 테마를 유지하려면 `?halloween=false`, 평일에 할로윈 테마를 켜려면 `?halloween=true`를 전달한다.

---

## 4. 부모 사이트 다크모드 토글과 실시간 동기화

자체 다크모드 스위치 버튼을 가진 사이트(예: 포트폴리오, 블로그)에 Jandi를 `<iframe>`으로 임베드할 때, URL에서 `scheme` 파라미터를 생략하면 **리로드 없이 즉시** 테마가 전환된다.

### 방식 1: CSS `color-scheme` 전파 (표장·권장)

CSS Color Adjustment 표준에 따라 부모 문서(또는 `<iframe>` 요소)의 `color-scheme` 값이 변경되면, 크로스 도메인 `<iframe>` 내부의 `@media (prefers-color-scheme: dark)` 평가 결과도 즉시 변경된다.

1. **Jandi 측 (`src/styles/globals.css`)**:
   `:root { color-scheme: light dark; }`가 선언되어 있어 부모 `<iframe>`의 `color-scheme`을 그대로 상속받는다.
2. **부모 사이트 측 CSS 및 테마 훅**:
   ```css
   :root,
   body {
     color-scheme: light;
   }
   .dark-mode,
   body.dark-mode {
     color-scheme: dark;
   }
   ```
   - SVG 모드(`/[username]`): `@media (prefers-color-scheme: dark)` CSS 변수가 즉시 전환된다.
   - Canvas 모드(`/[username]/canvas`): `window.matchMedia('(prefers-color-scheme: dark)')`의 `change` 이벤트 리스너가 캔버스를 즉시 재렌더링한다.

### 방식 2: `window.postMessage` 브로드캐스트

부모 사이트에서 테마 전환 시 `<iframe>`으로 메시지를 전송해도 동일하게 `data-color-mode`가 갱신된다.

```ts
document.querySelectorAll('iframe').forEach((iframe) => {
  iframe.contentWindow?.postMessage({ scheme: isDarkMode ? 'dark' : 'light' }, '*')
})
```

Jandi는 문자열(`'dark'` \| `'light'`) 또는 객체(`{ scheme }`, `{ theme }`, `{ colorMode }`) 형식의 메시지를 모두 수신해 `document.documentElement`와 `<svg>`/`<canvas>`의 `data-color-mode` 속성을 즉시 업데이트한다.
