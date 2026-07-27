=====================================================================
 현대자동차 통일로대리점 — 리드 제너레이션 홈페이지
 (정적 HTML/CSS/JS · 반응형 · 서버 연동 준비 완료)
=====================================================================

■ 폴더 구조
  index.html          메인 (문제 제기 → 신뢰 근거 → 카마스터/후기 → CTA)
  masters.html        우수 카마스터 목록
  master-detail.html  카마스터 상세  (?id=1 형식, 하나의 템플릿으로 전원 대응)
  events.html         대리점 이벤트
  posts.html          콘텐츠 목록 (차량 관리법 / 상품 소개 탭)
  post-detail.html    게시글 상세  (?id=1 형식)
  contact.html        상담 신청 (폼 + 전화/카카오톡/오시는 길)
  css/style.css       공통 스타일 (맨 위 :root 에 색상·폰트 토큰)
  js/data.js          ★ 모든 콘텐츠 데이터 (여기만 고치면 전 페이지 반영)
  js/script.js        공통 스크립트 (렌더링·폼 검증·서버 연동 지점)

■ 실행 방법
  - index.html 을 브라우저로 열어도 전 기능이 동작합니다. (웹폰트만 인터넷 필요)
  - 서버 배포 시 폴더 그대로 업로드하면 됩니다. 예) python3 -m http.server

■ 오픈 전 교체 체크리스트  (검색어: TODO)
  1) js/data.js 상단 SITE — 대표번호, 카카오톡 채널 URL, 주소, 영업시간
  2) js/data.js — 카마스터(MASTERS)·후기(REVIEWS)·이벤트(EVENTS)·게시글(POSTS)
     ※ 현재 값은 전부 "예시 데이터"입니다. 실제 데이터로 교체해 주세요.
  3) 푸터 — 사업자등록번호·대표자명, 그리고 "예시 데이터" 고지 문구 삭제
     (index.html 및 build 된 각 페이지 하단 footer-bottom 영역)
  4) contact.html — "3호선 녹번역 도보 5분 · 주차" 안내 문구를 실제 정보로
  5) SITE.stats — 누적 출고 / 평균 경력 / 재구매율 / 만족도 실제 수치로
  6) 문구 작성 원칙 — 후기·소개 문구를 실제 데이터로 교체할 때,
     다른 지점·대리점·카마스터와 비교하거나 깎아내리는 표현("다른 곳은…",
     "타 지점…" 등)은 넣지 않기. 자사가 하는 일(약속·기준)만 서술하기.

■ 콘텐츠 관리 방법 (백엔드 연동 전, 파일 수정 방식)
  - 카마스터 추가: MASTERS 배열에 객체 1개 추가 → 목록·상세·상담폼 자동 반영
  - 후기 추가:     REVIEWS 에 { masterId, name, car, rating, date, text } 추가
  - 이벤트 추가:   EVENTS 에 추가, status 를 ongoing/upcoming/ended 로 관리
  - 게시글 추가:   POSTS 에 추가. cat 은 care(차량 관리법)/product(상품 소개),
                   body 는 <p>, <h3>, <div class="callout"> 태그로 작성
  - 메인 대표 후기: FEATURED_REVIEWS (REVIEWS 배열의 인덱스 3개)

■ 상담 신청 서버 연동
  - js/script.js 에서 "[서버 연동 지점]" 검색 → fetch 주석 해제 후 엔드포인트 연결
  - 전송 payload: { name, phone, car, masterId, method, time, message,
                    source, submittedAt }
  - 연동 전에는 콘솔 로그로만 남고, 화면상 접수 완료 UX 는 동일하게 동작합니다.

■ 디자인 수정
  - 색상·폰트·간격은 css/style.css 최상단 :root 토큰에서 일괄 변경
  - 시그니처 요소: '통일로(路)' 로드라인 (.roadline) — 히어로/서브히어로 하단
  - 로고 이미지가 있다면 각 페이지 .brand 영역의 SVG 를 <img> 로 교체

■ 접근성·호환
  - 모바일 퍼스트 반응형 (하단 고정 상담 바는 768px 이하 노출)
  - 키보드 포커스 표시, prefers-reduced-motion(모션 최소화) 대응 완료
=====================================================================
