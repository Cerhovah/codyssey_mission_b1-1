# Lee Junhyeok — Product Builder Portfolio

경제학에서 출발해 사람들이 실제로 행동하는 방식을 중심으로 제품을 설계하는 Lee Junhyeok의 반응형 포트폴리오입니다. 핵심 자기소개 콘텐츠는 HTML에 정적으로 작성했고, GitHub 저장소 목록과 인터랙션 및 상태 변화만 JavaScript로 처리했습니다. 따라서 API 요청에 실패해도 소개, 학력, 작업 방식, 기술, 현재 프로젝트는 그대로 읽을 수 있습니다.

- GitHub repository: https://github.com/Cerhovah/codyssey_mission_b1-1
- GitHub Pages: [포트폴리오 열기](https://cerhovah.github.io/codyssey_mission_b1-1/) — GitHub Actions로 배포 중

## 사용 기술

- HTML5
- CSS3
- Vanilla JavaScript
- GitHub REST API
- LocalStorage
- Intersection Observer
- Formspree HTTP endpoint
- GitHub Pages

이 목록은 포트폴리오 자체의 구현 기술입니다. 본문에 표시되는 React, React Native, Vite, Tailwind CSS 등은 Lee Junhyeok의 학습 기술입니다.

## 폴더 구조

```text
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── images/
│   ├── profile.svg
│   ├── screenshot-desktop.png
│   ├── screenshot-mobile.png
│   └── screenshot-dark.png
└── README.md
```

## 실행 방법

### 터미널에서 실행하는 방법

프로젝트 루트(`codyssey_mission_b1-1`)에서 다음 명령을 실행합니다.

```bash
cd codyssey_b1_1_workspace
python3 -m http.server 8000
```

서버가 실행되면 브라우저에서 [http://localhost:8000](http://localhost:8000)을 엽니다. macOS 터미널에서는 다음 명령으로 바로 열 수도 있습니다.

```bash
open http://localhost:8000
```

실행을 멈추려면 터미널에서 `Ctrl + C`를 누릅니다. 이 프로젝트는 빌드 도구나 package 설치가 필요 없는 정적 사이트이지만, `index.html`을 파일 탐색기에서 직접 여는 것보다 로컬 HTTP 서버를 사용하는 편이 GitHub API 요청과 실제 배포 환경을 더 정확하게 확인할 수 있습니다.

### VS Code에서 실행하는 방법

1. `codyssey_b1_1_workspace` 폴더를 VS Code로 엽니다.
2. Live Server 확장을 설치합니다.
3. `index.html`에서 **Open with Live Server**를 선택합니다.

### README에서 온라인 페이지 열기

README의 위쪽 **포트폴리오 열기** 링크를 클릭하면 GitHub Pages 주소로 이동합니다. README는 웹사이트를 직접 실행하는 문서가 아니라, 배포된 URL로 이동하거나 로컬 실행 명령을 안내하는 문서입니다.

## GitHub Pages 배포

이 저장소의 실제 웹 파일은 `codyssey_b1_1_workspace` 하위 폴더에 있습니다. GitHub Pages의 branch 방식은 저장소 root 또는 `docs` 폴더를 직접 대상으로 삼기 때문에, 하위 프로젝트 폴더를 그대로 배포하도록 `.github/workflows/pages.yml` workflow를 추가했습니다.

GitHub에서 최초 한 번만 다음을 설정합니다.

1. 저장소의 **Settings**를 엽니다.
2. 왼쪽 메뉴 **Pages**를 선택합니다.
3. **Build and deployment → Source**에서 **GitHub Actions**를 선택합니다.
4. **Actions** 탭에서 `Deploy portfolio to GitHub Pages` workflow를 확인합니다.
5. `main`에 push되면 자동 배포됩니다. 필요하면 **Run workflow**로 수동 실행합니다.
6. 배포가 끝나면 [https://cerhovah.github.io/codyssey_mission_b1-1/](https://cerhovah.github.io/codyssey_mission_b1-1/)에서 확인합니다.

workflow는 `codyssey_b1_1_workspace`의 파일만 Pages artifact로 올리므로, 배포된 사이트의 루트에 `index.html`, `css/`, `js/`, `images/`가 바로 놓입니다. README 파일을 클릭한다고 로컬 서버가 켜지는 것은 아니며, 로컬 확인은 위의 `python3 -m http.server 8000` 명령을 사용합니다.

## 최근 트러블슈팅 기록

| 문제 | 원인 | 해결 |
| --- | --- | --- |
| Pages URL이 404를 표시함 | 실제 사이트 파일이 저장소 root가 아닌 `codyssey_b1_1_workspace`에 있었고 Pages source가 설정되지 않았음 | `pages.yml` workflow가 해당 폴더만 artifact로 배포하도록 구성하고 GitHub Actions source를 사용함 |
| README에서 사이트를 바로 실행할 수 없음 | README는 명령을 실행하는 화면이 아니라 Markdown 문서임 | 온라인 Pages 링크와 `python3 -m http.server 8000` 로컬 실행 명령을 함께 제공함 |
| 타이핑 효과가 잘 보이지 않음 | 한 글자당 24ms라 약 2초 안에 끝났음 | 320ms 뒤 시작하고 한 글자당 42ms로 조정함. 움직임 줄이기 설정에서는 완성 문장을 바로 표시하는 것이 정상임 |
| 문의 폼이 설정 안내만 표시함 | Formspree endpoint가 placeholder 상태였음 | endpoint를 `app.js`에 설정함. 실제 수신 확인은 배포 후 테스트 전송으로 진행함 |

## 주요 기능

- 375px부터 자연스럽게 확장되는 mobile-first 반응형 layout
- 모바일 hamburger menu와 768px 이상 일반 navigation
- navigation 및 CTA의 smooth scroll
- 60px 스크롤 이후 navigation 배경 변화
- 300px 스크롤 이후 Scroll Top button 표시
- light/dark theme 전환, system theme 감지, LocalStorage 유지
- threshold 0.2의 Intersection Observer scroll reveal
- Hero 소개 문구 typing effect
- GitHub repository loading/success/error/empty 상태와 Retry
- API 결과에서 만든 language filter
- Name, Email, Message의 submit/input 실시간 validation
- 실제 endpoint가 없을 때 전송을 가장하지 않는 Formspree 준비 상태

## 구조와 구현 선택

### HTML / CSS / JavaScript 분리

HTML은 콘텐츠 구조와 의미를 담당합니다. CSS는 표현, 색상, layout, responsive design을 담당합니다. JavaScript는 event, application state, API, DOM update를 담당합니다. 역할을 분리하면 한 영역을 수정할 때 다른 영역과 섞이는 정도를 줄이고 코드의 위치와 책임을 쉽게 찾을 수 있습니다.

### Semantic HTML

- `header`: 페이지 상단 영역
- `nav`: 페이지의 주요 navigation
- `main`: 페이지의 핵심 콘텐츠
- `section`: About, Skills, Projects, Contact처럼 각각 하나의 주제를 갖는 영역
- `article`: 하나만 분리해서 보아도 의미가 있는 project card와 content block
- `footer`: 저작권과 실제 GitHub profile link를 담는 페이지 하단 정보

### CSS variables와 theme

색상, spacing, radius, shadow, font 값을 `:root` 변수로 정의했습니다. 같은 값을 여러 selector에 반복하지 않고 한 곳에서 관리할 수 있으며, dark mode에서는 component CSS를 다시 작성하는 대신 `[data-theme='dark']`의 variable 값만 교체할 수 있습니다. 저장값이 없을 때를 위해 `prefers-color-scheme: dark` media query도 제공합니다.

### Flexbox와 Grid

Flexbox는 한 축을 중심으로 Logo와 navigation을 배치하는 데 적합해 `.nav-container`에 사용했습니다. Grid는 여러 project card의 행과 열을 동시에 관리하면서 viewport에 따라 column 수를 자동 조절하기에 적합해 `.projects-grid`에 `auto-fit`과 `minmax()`를 사용했습니다.

### Mobile-first

작은 화면에 필요한 기본 layout을 먼저 정의하고 공간이 넓어질 때 기능과 layout을 확장하면 desktop CSS를 다시 제거하거나 덮어쓰는 규칙이 줄어듭니다. 기본 규칙은 mobile이며 `768px` tablet, `1024px` desktop breakpoint에서 확장합니다.

### addEventListener

HTML의 `onclick`은 markup과 JavaScript 행동을 같은 위치에 섞습니다. `addEventListener`를 사용하면 구조와 행동을 분리할 수 있고 동일 element에도 여러 event listener를 관리할 수 있습니다. 이 프로젝트의 click, input, submit event는 모두 `app.js`에서 연결합니다.

## 상태 관리 방식

`STATE`는 theme, mobile menu, API 상태, filter 상태, form validation 상태를 한 객체에 모읍니다. 이 값들은 하나의 변경이 여러 DOM 표현에 영향을 줍니다. 서로 관련 없는 전역 변수로 흩어 놓으면 현재 화면을 결정하는 값을 추적하기 어렵지만, `STATE`를 사용하면 **event handler → 상태 변경 → render 함수**의 데이터 흐름을 한 곳에서 따라가기 쉽습니다.

이는 React state와 동일한 기술은 아니며, 상태 변화에 따라 UI를 다시 표현하는 사고방식을 Vanilla JavaScript로 연습하기 위한 구조입니다.

| 흐름 | 상태 변경 | 화면 반영 |
| --- | --- | --- |
| Theme click | `STATE.theme` | `applyTheme()`이 `data-theme`과 button 상태 갱신 |
| API request | `STATE.projects.status` | `renderProjects()`가 loading/success/error/empty 렌더링 |
| Filter click | `STATE.projects.selectedLanguage` | `filter()` 후 repository cards 재렌더링 |
| Form input/submit | `STATE.form.values`, `errors`, `submitStatus` | field error와 submit feedback 갱신 |

DOM reference는 application state가 아니므로 `STATE`와 별도의 `DOM`, `FORM_FIELDS` 객체에 둡니다.

## GitHub API 구조

고정 사용자 `Cerhovah`의 public repositories를 GitHub REST API에서 가져옵니다.

```text
fetchProjects() 실행
→ STATE.projects.status = loading
→ renderProjects()
→ await fetch()
→ response.ok 확인
→ 실패 상태이면 throw
→ await response.json()
→ success 또는 empty 상태 저장
→ renderProjects()

실패하면 catch
→ STATE.projects.status = error
→ renderProjects()
→ error UI와 Retry button 표시
```

성공한 repository object 배열은 선택 language가 `All`이 아니면 `filter()`로 거릅니다. 이어서 `map()`으로 repository마다 HTML card를 만들고 `join('')`한 뒤 Projects container의 `innerHTML`로 렌더링합니다. 각 card 생성 시 object destructuring을 사용하며, 동적 문자열은 HTML escape 처리합니다. HTTP 403은 요청 한도 가능성을 알리는 error 상태로 표시합니다.

## 기준값

| 동작 | 값 |
| --- | ---: |
| Navigation style threshold | 60px |
| Scroll Top threshold | 300px |
| Intersection Observer threshold | 0.2 |
| Tablet breakpoint | 768px |
| Desktop breakpoint | 1024px |

## Formspree 설정

현재 문의 폼은 입력값 검증과 비동기 전송 코드까지 구현되어 있으며, Formspree endpoint가 설정되어 있습니다. 실제 수신 여부는 배포 후 test message를 보내 Formspree Dashboard와 수신 이메일에서 확인합니다.

1. [Formspree](https://formspree.io/)에 로그인하거나 가입합니다.
2. Dashboard에서 **New Form**을 만들고 수신할 이메일 주소를 설정합니다.
3. 발급된 endpoint(`https://formspree.io/f/폼_ID` 형태)를 복사합니다.
4. `js/app.js` 첫 부분의 다음 값을 endpoint로 교체합니다.

   ```js
   const FORM_ENDPOINT = 'YOUR_FORMSPREE_ENDPOINT';
   ```

   예를 들어 endpoint가 `https://formspree.io/f/abcdwxyz`라면 다음과 같이 작성합니다.

   ```js
   const FORM_ENDPOINT = 'https://formspree.io/f/abcdwxyz';
   ```

5. 로컬 서버 또는 GitHub Pages에서 Name, Email, Message를 입력하고 전송을 테스트합니다.
6. Formspree Dashboard와 수신 이메일에서 실제 수신을 확인합니다.

endpoint는 브라우저에서 form을 전송하기 위해 공개되어도 되는 주소이며, Formspree 계정 비밀번호나 API secret을 코드에 넣으면 안 됩니다. endpoint가 설정되면 기존 `fetch()` 코드가 `FormData`와 `Accept: application/json` header로 전송하며, 성공 시 form을 초기화하고 실패 시 재시도 안내를 표시합니다.

타이핑 효과는 Hero 문구가 약 320ms 뒤부터 한 글자당 42ms로 나타나도록 구성했습니다. 운영체제 또는 브라우저에서 **움직임 줄이기**를 켠 사용자는 `prefers-reduced-motion` 설정에 따라 타이핑 효과 대신 완성된 문장을 바로 보게 됩니다.

## Screenshots

| Desktop · 1440px | Mobile · 375px | Dark mode · 1440px |
| --- | --- | --- |
| ![Desktop portfolio screenshot](images/screenshot-desktop.png) | ![Mobile portfolio screenshot](images/screenshot-mobile.png) | ![Dark mode portfolio screenshot](images/screenshot-dark.png) |
