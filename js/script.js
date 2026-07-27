/* =========================================================
   현대자동차 통일로대리점 — 공통 스크립트
   js/data.js 의 데이터를 각 페이지에 렌더링합니다.
   ========================================================= */

/* ---------- 헬퍼 ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const fmt = (n) => Number(n).toLocaleString("ko-KR");

const ICONS = {
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  kakao: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.48 3 2 6.58 2 11c0 2.8 1.86 5.26 4.66 6.68-.15.52-.96 3.3-.99 3.52 0 0-.02.17.09.24.11.07.24.02.24.02.32-.05 3.65-2.4 4.23-2.81.57.08 1.16.13 1.77.13 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/></svg>',
};

const masterById = (id) => MASTERS.find((m) => m.id === Number(id));

/* 프로필 사진이 있는 카마스터를 앞쪽에 배치 (메인 노출 우선순위) */
const featuredMasters = () =>
  [...MASTERS].sort((a, b) => (b.photo ? 1 : 0) - (a.photo ? 1 : 0));

/* photo 가 있으면 사진, 없으면 이름 첫 글자 아바타 */
const avatarHTML = (m, cls = "") =>
  `<div class="avatar${cls ? " " + cls : ""} av-${m.theme}" aria-hidden="true">` +
  (m.photo ? `<img src="${m.photo}" alt="" loading="lazy" />` : m.name[0]) +
  `</div>`;

const CAT_LABEL = { care: "차량 관리법", product: "상품 소개" };
const STATUS_LABEL = { ongoing: "진행중", upcoming: "예정", ended: "종료" };

/* ---------- 대리점 정보 일괄 반영 ---------- */
function applySiteInfo() {
  $$("[data-site]").forEach((el) => {
    const key = el.dataset.site;
    if (key === "phone") el.textContent = SITE.phone;
    else if (key === "address") el.textContent = SITE.address;
    else if (key === "hours") el.textContent = SITE.hours;
    else if (key === "name") el.textContent = SITE.name;
  });
  $$("[data-site-href]").forEach((el) => {
    const key = el.dataset.siteHref;
    if (key === "tel") el.href = "tel:" + SITE.phone.replace(/-/g, "");
    else if (key === "kakao") el.href = SITE.kakao;
    else if (key === "map") el.href = SITE.mapUrl;
  });
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
}

/* ---------- 헤더 & 모바일 메뉴 ---------- */
function initHeader() {
  const header = $("#siteHeader");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = $("#menuToggle");
  const menu = $("#mobileMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open);
      toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });
    $$("a", menu).forEach((a) =>
      a.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }
}

/* ---------- 공용 카드 템플릿 ---------- */
function starsHTML(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += ICONS.star.replace("<svg", i <= rating ? "<svg" : '<svg class="off"');
  }
  return `<div class="stars" role="img" aria-label="별점 5점 만점에 ${rating}점">${html}</div>`;
}

function masterCardHTML(m) {
  return `
  <article class="master-card">
    <div class="m-top">
      ${avatarHTML(m)}
      <div>
        <div class="m-name">${m.name}<small>${m.position}</small></div>
        <div class="m-meta">경력 ${m.career}년 · 누적 ${fmt(m.sales)}대 출고</div>
      </div>
    </div>
    <p class="m-tagline">“${m.tagline}”</p>
    <div class="chips">${m.tags.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
    <div class="m-stats">
      <span>상담 만족도 <b>${m.satisfaction}</b></span>
      <span>주력 <b>${m.focusCars.slice(0, 2).join(" · ")}</b></span>
    </div>
    <div class="m-links">
      <a class="link-arrow" href="master-detail.html?id=${m.id}">프로필 보기</a>
      <a class="btn btn-primary" href="contact.html?master=${m.id}">상담 예약</a>
    </div>
  </article>`;
}

function reviewCardHTML(r, { linkMaster = true } = {}) {
  const m = masterById(r.masterId);
  const via = linkMaster && m
    ? `<br>담당 <a href="master-detail.html?id=${m.id}">${m.name} ${m.position}</a> · ${r.date}`
    : `<br>${r.date}`;
  return `
  <article class="review-card">
    ${starsHTML(r.rating)}
    <p class="review-text">${r.text}</p>
    <div class="review-meta"><b>${r.name}</b> 고객 · ${r.car} 출고${via}</div>
  </article>`;
}

function postCardHTML(p) {
  const author = masterById(p.authorId);
  return `
  <a class="post-card" href="post-detail.html?id=${p.id}">
    <span class="p-cat cat-${p.cat}">${CAT_LABEL[p.cat]}</span>
    <h3 class="post-title">${p.title}</h3>
    <p class="post-excerpt">${p.excerpt}</p>
    <div class="post-meta">${p.date} · <b>${author ? `${author.name} ${author.position}` : SITE.shortName}</b> · ${p.readTime} 읽기</div>
  </a>`;
}

function eventCardHTML(e) {
  return `
  <article class="event-card ${e.status === "ended" ? "is-ended" : ""}">
    <div class="e-head">
      <span class="badge b-${e.status}">${STATUS_LABEL[e.status]}</span>
      <span class="e-period">${e.period}</span>
    </div>
    <h3 class="e-title">${e.title}</h3>
    <p class="e-summary">${e.summary}</p>
    <ul class="benefit-list">${e.benefits.map((b) => `<li>${b}</li>`).join("")}</ul>
    ${e.note ? `<p class="e-note">${e.note}</p>` : ""}
  </article>`;
}

/* ---------- 페이지: 메인 ---------- */
function pageHome() {
  /* 통계 숫자는 data.js 의 SITE.stats 에서 가져옵니다 */
  $$(".stat-num[data-stat]").forEach((el) => {
    el.dataset.count = SITE.stats[el.dataset.stat];
  });

  $("#homeMasters").innerHTML = featuredMasters().slice(0, 3).map(masterCardHTML).join("");
  $("#homeReviews").innerHTML = FEATURED_REVIEWS.map((i) => reviewCardHTML(REVIEWS[i])).join("");

  $("#homeEvents").innerHTML = EVENTS.filter((e) => e.status !== "ended").slice(0, 3)
    .map((e) => `
      <a class="mini-item" href="events.html">
        <span class="badge b-${e.status}">${STATUS_LABEL[e.status]}</span>
        <span class="mini-title">${e.title}</span>
      </a>`).join("");

  $("#homePosts").innerHTML = POSTS.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
    .map((p) => `
      <a class="mini-item" href="post-detail.html?id=${p.id}">
        <span class="badge ${p.cat === "care" ? "b-ongoing" : "b-upcoming"}">${CAT_LABEL[p.cat]}</span>
        <span class="mini-title">${p.title}</span>
        <span class="mini-date">${p.date.slice(5)}</span>
      </a>`).join("");
}

/* ---------- 페이지: 카마스터 목록 ---------- */
function pageMasters() {
  $("#mastersGrid").innerHTML = featuredMasters().map(masterCardHTML).join("");
}

/* ---------- 페이지: 카마스터 상세 ---------- */
function pageMasterDetail() {
  const root = $("#mdRoot");
  const m = masterById(new URLSearchParams(location.search).get("id"));
  if (!m) {
    root.innerHTML = `
      <div class="notice-empty">
        <h2>카마스터를 찾을 수 없습니다</h2>
        <p>주소가 잘못되었거나 명단에서 제외된 프로필입니다.</p>
        <a class="btn btn-primary" href="masters.html">카마스터 전체 보기</a>
      </div>`;
    return;
  }
  document.title = `${m.name} ${m.position} — ${SITE.name}`;
  $("#mdName").textContent = `${m.name} ${m.position}`;

  const reviews = REVIEWS.filter((r) => r.masterId === m.id);
  root.innerHTML = `
    <section class="profile-card" data-reveal>
      <div class="p-head">
        ${avatarHTML(m, "avatar--lg")}
        <div class="p-id">
          <h1 class="p-name">${m.name}<small>${m.position}</small></h1>
          <p class="p-meta">경력 ${m.career}년 · ${SITE.shortName} 우수 카마스터</p>
          <p class="p-tagline">“${m.tagline}”</p>
        </div>
        <div class="p-actions">
          <a class="btn btn-primary btn-lg" href="contact.html?master=${m.id}">이 카마스터에게 상담받기</a>
        </div>
      </div>
      <div class="p-stats">
        <div class="p-stat"><b>${fmt(m.sales)}대</b><span>누적 출고</span></div>
        <div class="p-stat"><b>${m.satisfaction} / 5.0</b><span>상담 만족도</span></div>
        <div class="p-stat"><b>${m.career}년</b><span>경력</span></div>
      </div>
    </section>

    <div class="md-grid">
      <div class="md-main">
        <section class="md-block" data-reveal>
          <h2>이렇게 상담합니다</h2>
          <ul class="style-list">
            ${m.stylePoints.map((s) => `<li><span class="check-ic">${ICONS.check}</span><span>${s}</span></li>`).join("")}
          </ul>
        </section>
        <section class="md-block intro-text" data-reveal>
          <h2>${m.name} ${m.position}의 이야기</h2>
          ${m.intro.map((p) => `<p>${p}</p>`).join("")}
        </section>
        <section class="md-block" data-reveal>
          <h2>고객 후기 <small style="color:var(--faint);font-size:.8em;font-weight:700;">${reviews.length}건</small></h2>
          <div class="reviews-stack">
            ${reviews.map((r) => reviewCardHTML(r, { linkMaster: false })).join("")}
          </div>
        </section>
      </div>
      <aside class="md-aside">
        <section class="md-block" data-reveal>
          <h2>주력 차종</h2>
          <div class="chips">${m.focusCars.map((c) => `<span class="chip">${c}</span>`).join("")}</div>
        </section>
        <section class="md-block" data-reveal>
          <h2>이런 상담에 강합니다</h2>
          <div class="chips">${m.tags.map((t) => `<span class="chip chip--sand">${t}</span>`).join("")}</div>
        </section>
        <section class="md-block aside-cta" data-reveal>
          <h2>상담이 필요하신가요?</h2>
          <p>${m.name} ${m.position}을 지정해 상담을 신청하실 수 있습니다.</p>
          <a class="btn btn-light btn-block" href="contact.html?master=${m.id}">상담 신청하기</a>
          <a class="btn btn-kakao btn-block" data-site-href="kakao" href="#" target="_blank" rel="noopener">${ICONS.kakao} 카카오톡 문의</a>
        </section>
      </aside>
    </div>`;
}

/* ---------- 페이지: 이벤트 ---------- */
function pageEvents() {
  const order = { ongoing: 0, upcoming: 1, ended: 2 };
  $("#eventList").innerHTML = EVENTS.slice()
    .sort((a, b) => order[a.status] - order[b.status])
    .map(eventCardHTML).join("");
}

/* ---------- 페이지: 콘텐츠 목록 ---------- */
function pagePosts() {
  const grid = $("#postsGrid");
  const render = (cat) => {
    const list = POSTS.slice().sort((a, b) => b.date.localeCompare(a.date))
      .filter((p) => cat === "all" || p.cat === cat);
    grid.innerHTML = list.map(postCardHTML).join("");
    grid.classList.add("is-in");
  };
  $$("#postTabs .tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$("#postTabs .tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      render(tab.dataset.cat);
    });
  });
  render("all");
  grid.classList.remove("is-in"); /* 최초 진입은 스크롤 등장에 맡김 */
}

/* ---------- 페이지: 게시글 상세 ---------- */
function pagePostDetail() {
  const root = $("#articleRoot");
  const p = POSTS.find((x) => x.id === Number(new URLSearchParams(location.search).get("id")));
  if (!p) {
    root.innerHTML = `
      <div class="notice-empty">
        <h2>게시글을 찾을 수 없습니다</h2>
        <p>삭제되었거나 주소가 잘못된 게시글입니다.</p>
        <a class="btn btn-primary" href="posts.html">콘텐츠 전체 보기</a>
      </div>`;
    return;
  }
  document.title = `${p.title} — ${SITE.name}`;
  const author = masterById(p.authorId);
  const related = POSTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 2);

  root.innerHTML = `
    <article class="article" data-reveal>
      <header class="article-head">
        <span class="p-cat cat-${p.cat}">${CAT_LABEL[p.cat]}</span>
        <h1 class="a-title">${p.title}</h1>
        <p class="a-meta">${p.date} · <b>${author ? `${author.name} ${author.position}` : SITE.shortName}</b> · ${p.readTime} 읽기</p>
      </header>
      <div class="article-body">${p.body}</div>
      ${author ? `
      <div class="author-card">
        ${avatarHTML(author)}
        <div class="author-info">
          <b>${author.name} ${author.position}</b>
          <span>${author.tagline}</span>
        </div>
        <a class="btn btn-ghost" href="master-detail.html?id=${author.id}">프로필 보기</a>
      </div>` : ""}
    </article>
    ${related.length ? `
    <section class="related" data-reveal>
      <h2>함께 읽으면 좋은 글</h2>
      <div class="related-grid">${related.map(postCardHTML).join("")}</div>
    </section>` : ""}`;
}

/* ---------- 페이지: 상담 신청 ---------- */
function pageContact() {
  const form = $("#leadForm");
  if (!form) return;

  /* 셀렉트 옵션 채우기 */
  const carSel = $("#fCar");
  CAR_LIST.forEach((c) => carSel.insertAdjacentHTML("beforeend", `<option value="${c}">${c}</option>`));
  const masterSel = $("#fMaster");
  MASTERS.forEach((m) =>
    masterSel.insertAdjacentHTML("beforeend",
      `<option value="${m.id}">${m.name} ${m.position} — ${m.focusCars[0]} 외</option>`)
  );

  /* URL 파라미터로 카마스터 지정 (카마스터 상세 → 상담 예약 흐름) */
  const params = new URLSearchParams(location.search);
  const pre = masterById(params.get("master"));
  if (pre) {
    masterSel.value = String(pre.id);
    const chip = $("#assignChip");
    chip.textContent = `${pre.name} ${pre.position} 지정 상담으로 접수됩니다.`;
    chip.classList.add("show");
  }

  /* 연락처 자동 하이픈 */
  const phone = $("#fPhone");
  phone.addEventListener("input", () => {
    const d = phone.value.replace(/\D/g, "").slice(0, 11);
    let out = d;
    if (d.startsWith("02")) {
      if (d.length > 5) out = `${d.slice(0, 2)}-${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
      else if (d.length > 2) out = `${d.slice(0, 2)}-${d.slice(2)}`;
    } else {
      if (d.length > 7) out = `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}`;
      else if (d.length > 3) out = `${d.slice(0, 3)}-${d.slice(3)}`;
    }
    phone.value = out;
  });

  /* 검증 & 제출 */
  const setInvalid = (el, on) => el.closest(".field, .agree-box").classList.toggle("invalid", on);

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const name = $("#fName");
    const agree = $("#fAgree");
    let firstBad = null;

    const nameOk = name.value.trim().length >= 2;
    setInvalid(name, !nameOk);
    if (!nameOk) firstBad = firstBad || name;

    const phoneOk = /^0\d{1,2}-\d{3,4}-\d{4}$/.test(phone.value.trim());
    setInvalid(phone, !phoneOk);
    if (!phoneOk) firstBad = firstBad || phone;

    const agreeOk = agree.checked;
    setInvalid(agree, !agreeOk);
    if (!agreeOk) firstBad = firstBad || agree;

    if (firstBad) { firstBad.focus(); return; }

    const payload = {
      name: name.value.trim(),
      phone: phone.value.trim(),
      car: carSel.value || "미정",
      masterId: masterSel.value ? Number(masterSel.value) : null,
      method: (form.querySelector('input[name="method"]:checked') || {}).value || "무관",
      time: (form.querySelector('input[name="time"]:checked') || {}).value || "무관",
      message: $("#fMsg").value.trim(),
      source: location.href,
      submittedAt: new Date().toISOString(),
    };

    /* =====================================================
       [서버 연동 지점]
       아래 fetch 주석을 해제하고 엔드포인트만 연결하면 됩니다.
       -----------------------------------------------------
       fetch("/api/leads", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(payload),
       });
       ===================================================== */
    console.log("[상담 신청 접수 — 서버 연동 전 임시 로그]", payload);

    const chosen = masterById(payload.masterId);
    $("#successDesc").textContent = chosen
      ? `${chosen.name} ${chosen.position}이 영업시간 기준 30분 이내에 ${payload.phone} 번호로 연락드립니다.`
      : `상담 내용에 가장 잘 맞는 카마스터를 배정해 영업시간 기준 30분 이내에 ${payload.phone} 번호로 연락드립니다.`;
    form.style.display = "none";
    $("#formSuccess").classList.add("show");
    $("#formSuccess").scrollIntoView({ behavior: "smooth", block: "center" });
  });

  /* 입력 시 오류 표시 해제 */
  [$("#fName"), phone].forEach((el) =>
    el.addEventListener("input", () => setInvalid(el, false)));
  $("#fAgree").addEventListener("change", (e) => setInvalid(e.target, false));
}

/* ---------- 스크롤 등장 & 숫자 카운트업 ---------- */
function initReveal() {
  const targets = $$("[data-reveal], .stagger");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach((t) => io.observe(t));
}

function initCountUp() {
  const nums = $$(".stat-num[data-count]");
  if (!nums.length) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const paint = (el, v) => {
    const dec = Number(el.dataset.dec || 0);
    el.querySelector("b").textContent = dec ? v.toFixed(dec) : fmt(Math.round(v));
  };
  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    if (reduced) { paint(el, target); return; }
    const dur = 1400;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      paint(el, target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { animate(en.target); io.unobserve(en.target); }
    });
  }, { threshold: 0.4 });
  nums.forEach((n) => io.observe(n));
}

/* ---------- 초기화 ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const pages = {
    home: pageHome,
    masters: pageMasters,
    master: pageMasterDetail,
    events: pageEvents,
    posts: pagePosts,
    post: pagePostDetail,
    contact: pageContact,
  };
  const fn = pages[document.body.dataset.page];
  if (fn) fn();
  applySiteInfo(); /* 동적 렌더링 이후 실행 — data-site 링크까지 반영 */
  initHeader();
  initReveal();
  initCountUp();
});
