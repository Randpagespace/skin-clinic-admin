# Skin Clinic Admin

Next.js App Router + TypeScript 기반 관리자 웹 개발 환경.

## 시작하기

Node.js 24 계열을 기준으로 한다 (`.nvmrc`). nvm을 사용하는 경우 먼저 `nvm use`를 실행한다.

최초 실행 전 `.env.example`을 `.env.local`로 복사하고 `AUTH_SESSION_SECRET`에 `openssl rand -hex 32`로 생성한 값을 설정한다. `BACKEND_URL` 기본 대상은 `http://localhost:8000`이다. 환경 파일·계정·토큰을 커밋하지 않는다.

```bash
npm ci
npm run dev
```

접속: http://127.0.0.1:8030

로그인은 실제 BE `/auth/login`에 연결한다. 성공하면 HttpOnly 세션 쿠키를 발급하고 대시보드로 이동하며 최초 비밀번호 변경이 필요하면 변경 화면으로 안내한다. 인증 없이 관리자 화면에 접근할 수 없다. 대시보드는 `DASHBOARD`를 표시한다. 고객 메뉴는 `/customers` 목록으로 연결하며 이름/연락처 검색, 10/50/100개 보기, 페이지 이동, 신규 등록 및 고객명 선택 시 상세 조회를 제공한다. 고객 데이터는 화면 확인용 예시이며 추가 데이터는 메모리에만 유지되어 새로고침·로그아웃하면 초기화된다. 실제 개인정보를 입력하지 않는다. 실서버 인증 성공 검증에는 유효한 BE 계정이 필요하다.

## 검사와 프로덕션 실행

```bash
npm run check  # ESLint + route types + TypeScript + tests
npm run build
npm run start
```

`npm test`로 세션 암호화·변조·만료·응답 경계 및 고객 검색·페이지 경계·등록 입력 검사를 실행한다. 운영 세션은 Secure 쿠키이므로 HTTPS가 필요하다. 고객 업무 API·배포 운영 검증은 별도다.

개발 서버와 함께 실행하려면 `npm run start -- --port 3001`을 사용한다. 서버는 기본 loopback 주소에 바인딩된다. 배포 환경에서 외부 바인딩이 필요하면 `npm run start -- --hostname 0.0.0.0`처럼 명시한다.

GitHub Actions도 `npm ci`, `npm run check`, `npm run build`를 사용한다. Node 24 CI 실행은 아직 확인하지 않았으며 초기 로컬 검증은 Node 26.7.0/npm 11.19.0에서 수행했다.

## 구성

- `src/app/`: 라우트·루트 레이아웃·전역 CSS
- `package-lock.json`: 재현 가능한 npm 의존성 설치
- `.github/workflows/check.yml`: 공통 검사

로컬 지식·원본 자료·작업 기록과 비밀 환경 파일은 `.gitignore`로 제외한다. 내부 위키(`docs/README.md`)는 별도 전달받는 로컬 문서이며 clone에 포함되지 않는다.

현재 Next 린트 플러그인의 peer 호환 범위에 맞춰 ESLint 9를 사용한다. 지원 종료 경고가 있으므로 플러그인 호환 버전이 제공되면 함께 갱신해야 한다.
