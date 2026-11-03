const view = document.getElementById("view");
const search = document.getElementById("search");
const tabs = [...document.querySelectorAll(".hub-tabs button")];
const toast = document.getElementById("toast");

let current = "path";
let stageIdx = 0;
let glossCat = "All";
let sentenceTimer;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const strip = (s) => s.replace(/<[^>]+>/g, "");
const initials = (k) => PEOPLE[k].name[0];
const avatar = (k, cls = "avatar") => `<span class="${cls}" style="--pc:${PEOPLE[k].color}">${initials(k)}</span>`;
const linkPill = (l) => `<a class="link-pill" href="${l.href}" target="_blank" rel="noopener"><i data-lucide="${l.icon}"></i>${esc(l.label)}</a>`;
const stageColor = (id) => (STAGES.find((s) => s.id === id) || { color: "#9aa6bd" }).color;

function notify(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(notify.t);
  notify.t = setTimeout(() => toast.classList.remove("show"), 1600);
}

/* ---------- the path ---------- */

function renderPath() {
  const s = STAGES[stageIdx];
  const nodes = STAGES.map((st, i) => `
    <button class="node ${i === stageIdx ? "is-on" : ""} ${i < stageIdx ? "is-done" : ""}" data-stage="${i}" style="--c:${st.color}" aria-pressed="${i === stageIdx}">
      <span class="node-dot"><i data-lucide="${st.icon}"></i></span>
      <span class="node-label">${esc(st.label)}</span>
      <span class="node-sub">${esc(st.sub)}</span>
    </button>`).join("");

  return `
    <div class="path-top">
      <p class="path-intro">Five stages, from "who is this client?" to the first replies. Click a stage to see what happens there.</p>
      <div class="ask-row"><span>Who to ask</span>${Object.keys(PEOPLE).map((k) => `
        <span class="ask" tabindex="0">${avatar(k)}<span class="ask-tip"><strong>${esc(PEOPLE[k].name)}</strong>${esc(PEOPLE[k].about)}</span></span>`).join("")}
      </div>
    </div>

    <div class="track" style="--progress:${(stageIdx / (STAGES.length - 1)) * 100}%">
      <div class="track-line"><span class="track-fill"></span></div>
      ${nodes}
    </div>

    <article class="stage" style="--c:${s.color}">
      <div class="stage-grid">
        <div class="stage-text">
          <span class="stage-count">Stage ${stageIdx + 1} of ${STAGES.length}</span>
          <h2>${esc(s.title)}</h2>
          <p class="stage-intro">${esc(s.intro)}</p>
          <ol class="stage-steps">${s.steps.map((x) => `<li><span>${x}</span></li>`).join("")}</ol>
        </div>
        <div class="stage-visual">${VISUALS[s.visual]()}</div>
      </div>

      <h3 class="sub-h"><i data-lucide="sparkle"></i>Good to know</h3>
      <div class="tips">${s.tips.map((t) => `<div class="tip-card"><h4>${esc(t.t)}</h4><p>${esc(t.d)}</p></div>`).join("")}</div>

      <div class="stage-foot">
        <div class="foot-col">
          <h3 class="sub-h"><i data-lucide="link"></i>Open</h3>
          <div class="link-row">${s.links.map(linkPill).join("")}</div>
          <div class="owner">${avatar(s.owner)}<span>Stuck here? <strong>${esc(PEOPLE[s.owner].name)}</strong> knows this part best.</span></div>
        </div>
        <div class="prompt">
          <div class="label"><i data-lucide="sparkles"></i>Ask Claude</div>
          <button class="copy" data-copy="${esc(s.prompt)}"><i data-lucide="copy"></i>Copy</button>
          ${esc(s.prompt)}
        </div>
      </div>

      <div class="stage-nav">
        ${stageIdx > 0 ? `<button class="btn ghost" data-stage="${stageIdx - 1}"><i data-lucide="arrow-left"></i>${esc(STAGES[stageIdx - 1].title)}</button>` : "<span></span>"}
        ${stageIdx < STAGES.length - 1 ? `<button class="btn" style="--c:${STAGES[stageIdx + 1].color}" data-stage="${stageIdx + 1}">Next: ${esc(STAGES[stageIdx + 1].title)}<i data-lucide="arrow-right"></i></button>` : ""}
      </div>
    </article>

    <div class="shortcuts">
      <button class="shortcut" data-go="tools" style="--c:#5b8cff"><span class="sc-icon"><i data-lucide="link"></i></span><span><strong>Tools</strong><small>${TOOLS.length} links and where the login is</small></span><i class="sc-arrow" data-lucide="arrow-up-right"></i></button>
      <button class="shortcut" data-go="where" style="--c:#f5a524"><span class="sc-icon"><i data-lucide="map-pin"></i></span><span><strong>Where is what</strong><small>Client facts, files, logins, guides</small></span><i class="sc-arrow" data-lucide="arrow-up-right"></i></button>
      <button class="shortcut" data-go="glossary" style="--c:#a78bfa"><span class="sc-icon"><i data-lucide="book-a"></i></span><span><strong>Glossary</strong><small>${GLOSSARY.length} words you'll hear a lot</small></span><i class="sc-arrow" data-lucide="arrow-up-right"></i></button>
    </div>`;
}

/* ---------- stage visuals ---------- */

const SENTENCES = [
  ["A software firm", "sells HR tools", "to mid-sized companies", "one deal is worth about €20k", "there are about 8,000 of them in DACH"],
  ["A logistics startup", "sells route planning", "to delivery companies", "one deal is worth about €15k", "there are about 3,000 of them in DACH"],
];
const BLANKS = ["Who is the client?", "What do they sell?", "Who pays for it?", "What is one deal worth?", "How many buyers are there?"];

const VISUALS = {
  sentence: () => `
    <div class="vis-card">
      <span class="vis-label">The one-sentence test · example</span>
      <p class="sentence" id="sentence">${sentenceHTML(0)}</p>
      <p class="vis-hint"><i data-lucide="mouse-pointer-2"></i>Hover a part to see the question behind it</p>
    </div>`,

  sources: () => `
    <div class="vis-card">
      <span class="vis-label">Where to look</span>
      <div class="sources">
        <div class="src-list">${SOURCES.map((s, i) => `<button class="src" data-best="${esc(s.best)}" style="--d:${i * 0.35}s">${esc(s.name)}<span class="src-flow"></span></button>`).join("")}</div>
        <div class="src-target"><i data-lucide="table"></i><span>One company table in Clay</span></div>
      </div>
      <p class="vis-caption" data-default="Hover a source to see what it's good for">Hover a source to see what it's good for</p>
    </div>`,

  funnel: () => `
    <div class="vis-card">
      <span class="vis-label">How the list shrinks · example shape</span>
      <div class="funnel">${FUNNEL.map((f, i) => `
        <div class="fbar" data-d="${esc(f.d)}" tabindex="0"><span class="fbar-fill" style="--w:${f.w}%;--i:${i}"></span><span class="fbar-label">${esc(f.label)}</span></div>`).join("")}
      </div>
      <p class="vis-caption" data-default="Hover a bar to see what happens there">Hover a bar to see what happens there</p>
    </div>`,

  checklist: () => `
    <div class="vis-card">
      <span class="vis-label">Before anyone else sees it</span>
      <ul class="checks">${REVIEW_CHECKS.map((c, i) => `
        <li class="check" style="--i:${i}" tabindex="0"><span class="box"><i data-lucide="check"></i></span><div><strong>${esc(c.t)}</strong><span>${esc(c.d)}</span></div></li>`).join("")}
      </ul>
      <p class="vis-hint"><i data-lucide="mouse-pointer-2"></i>Hover a check to see how, click to tick it off</p>
    </div>`,

  gates: () => `
    <div class="vis-card">
      <span class="vis-label">From inbox to reply · Muriel's walkthrough</span>
      <ol class="gates">${GATES.map((g) => `
        <li class="gate ${g.gate ? "is-gate" : ""}" tabindex="0">
          <span class="gate-dot">${g.gate ? `<span class="light"></span>` : ""}</span>
          <div><strong>${esc(g.t)}</strong> <span class="gate-s">${esc(g.s)}</span>
            ${g.bar ? `<span class="warm"><span></span></span>` : ""}
            <span class="gate-d">${esc(g.d)}</span></div>
        </li>`).join("")}
      </ol>
      <p class="vis-hint"><i data-lucide="mouse-pointer-2"></i>Hover a step for details</p>
    </div>`,
};

function sentenceHTML(n) {
  const glue = ["", " ", " ", ", ", ", and "];
  return SENTENCES[n].map((p, i) => `${glue[i]}<span class="blank b${i}" tabindex="0">${esc(p)}<span class="q">${BLANKS[i]}</span></span>`).join("") + ".";
}

function startSentence() {
  clearInterval(sentenceTimer);
  let n = 0;
  sentenceTimer = setInterval(() => {
    const el = document.getElementById("sentence");
    if (!el) return clearInterval(sentenceTimer);
    if (el.matches(":hover") || el.contains(document.activeElement)) return;
    n = (n + 1) % SENTENCES.length;
    el.classList.add("swap");
    setTimeout(() => { el.innerHTML = sentenceHTML(n); el.classList.remove("swap"); }, 300);
  }, 4500);
}

/* ---------- other tabs ---------- */

function toolCard(t) {
  const c = t.stage === "start" ? "#9aa6bd" : stageColor(t.stage);
  return `
    <a class="card tool-card" href="${t.url}" target="_blank" rel="noopener" style="--c:${c}">
      <div class="tool-top"><span class="icon-box"><i data-lucide="${t.icon}"></i></span><div><h3>${esc(t.name)}</h3><span class="tool-url">${esc(t.url.replace(/^https?:\/\//, "").split("/")[0])}</span></div><i class="tool-arrow" data-lucide="arrow-up-right"></i></div>
      <p>${esc(t.what)}</p>
      <span class="login"><i data-lucide="key-round"></i>${esc(t.access)}</span>
    </a>`;
}

function renderTools() {
  const groups = [{ id: "start", title: "Every day", color: "#9aa6bd" }, ...STAGES.filter((s) => TOOLS.some((t) => t.stage === s.id)).map((s) => ({ id: s.id, title: `${s.label} ${s.sub}`, color: s.color }))];
  return `
    <p class="note"><i data-lucide="shield"></i>No passwords here. Shared logins are in the <strong>Secrets</strong> tab. The access notes are a first draft, so please check them with Leon.</p>
    ${groups.map((g) => `
      <div class="section-title"><h2><span class="dot-c" style="--c:${g.color}"></span>${esc(g.title)}</h2></div>
      <div class="grid">${TOOLS.filter((t) => t.stage === g.id).map(toolCard).join("")}</div>`).join("")}`;
}

function whereRow(w) {
  const a = w.href ? `<a href="${w.href}" target="_blank" rel="noopener"><code>${esc(w.a)}</code><i data-lucide="arrow-up-right"></i></a>` : `<code>${esc(w.a)}</code>`;
  return `
    <div class="card where-row">
      <div class="where-q"><span class="icon-box"><i data-lucide="${w.icon}"></i></span>${esc(w.q)}</div>
      <div class="where-a">${a}<p>${esc(w.note)}</p></div>
    </div>`;
}

function renderWhere() {
  return `
    <div class="section-title"><h2>"Where do I find…"</h2></div>
    <div class="where-list">${WHERE.map(whereRow).join("")}</div>
    <div class="section-title"><h2>Who to ask</h2></div>
    <div class="people">${Object.keys(PEOPLE).map((k) => `<div class="card person">${avatar(k)}<div><h3>${esc(PEOPLE[k].name)}</h3><p>${esc(PEOPLE[k].about)}</p></div></div>`).join("")}</div>`;
}

function termCard(g) {
  return `
    <div class="card term" tabindex="0">
      <span class="emoji">${g.e}</span>
      <div>
        <div class="term-head"><h3>${esc(g.t)}</h3><span class="tag">${esc(g.cat)}</span></div>
        ${g.long ? `<span class="long">${esc(g.long)}</span>` : ""}
        <p>${esc(g.d)}</p>
        ${g.like ? `<p class="like">${esc(g.like)}</p>` : ""}
      </div>
    </div>`;
}

function renderGlossary() {
  const cats = ["All", ...new Set(GLOSSARY.map((g) => g.cat))];
  const list = GLOSSARY.filter((g) => glossCat === "All" || g.cat === glossCat);
  return `
    <div class="chips" style="margin-bottom:18px">${cats.map((c) => `<button class="chip ${c === glossCat ? "is-on" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}</div>
    <div class="gloss-grid">${list.map(termCard).join("")}</div>`;
}

function renderSearch(q) {
  const needle = q.toLowerCase();
  const hit = (...parts) => parts.join(" ").toLowerCase().includes(needle);
  const stages = STAGES.map((s, i) => ({ s, i })).filter(({ s }) => hit(s.title, s.intro, strip(s.steps.join(" "))));
  const tips = STAGES.flatMap((s, i) => s.tips.filter((t) => hit(t.t, t.d)).map((t) => ({ ...t, s, i })));
  const tools = TOOLS.filter((t) => hit(t.name, t.what, t.url));
  const where = WHERE.filter((w) => hit(w.q, w.a, w.note));
  const terms = GLOSSARY.filter((g) => hit(g.t, g.long || "", g.d));
  const total = stages.length + tips.length + tools.length + where.length + terms.length;
  if (!total) return `<div class="empty">Nothing found for "${esc(q)}". Try a tool name or a word like "ICP".</div>`;
  return `
    <div class="section-title"><h2>${total} results for "${esc(q)}"</h2><p>Esc to clear</p></div>
    ${terms.length ? `<div class="section-title"><h2>Glossary</h2></div><div class="gloss-grid">${terms.map(termCard).join("")}</div>` : ""}
    ${stages.length ? `<div class="section-title"><h2>Stages</h2></div><div class="grid">${stages.map(({ s, i }) => `<button class="card hoverable result-card" style="--c:${s.color}" data-open-stage="${i}"><span class="tag">Stage ${i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.intro)}</p></button>`).join("")}</div>` : ""}
    ${tips.length ? `<div class="section-title"><h2>Tips</h2></div><div class="tips">${tips.map((t) => `<button class="tip-card result-card" style="--c:${t.s.color}" data-open-stage="${t.i}"><h4>${esc(t.t)}</h4><p>${esc(t.d)}</p></button>`).join("")}</div>` : ""}
    ${tools.length ? `<div class="section-title"><h2>Tools</h2></div><div class="grid">${tools.map(toolCard).join("")}</div>` : ""}
    ${where.length ? `<div class="section-title"><h2>Where is what</h2></div><div class="where-list">${where.map(whereRow).join("")}</div>` : ""}`;
}

const RENDER = { path: renderPath, tools: renderTools, where: renderWhere, glossary: renderGlossary };

/* ---------- wiring ---------- */

function render() {
  const q = search.value.trim();
  tabs.forEach((b) => b.setAttribute("aria-selected", String(!q && b.dataset.tab === current)));
  view.innerHTML = q ? renderSearch(q) : RENDER[current]();
  view.classList.remove("enter");
  void view.offsetWidth;
  view.classList.add("enter");
  if (window.lucide) lucide.createIcons();
  if (!q && current === "path" && STAGES[stageIdx].visual === "sentence") startSentence();
}

function setHash() {
  history.replaceState(null, "", current === "path" ? `#path/${STAGES[stageIdx].id}` : `#${current}`);
}

function go(tab) {
  current = RENDER[tab] ? tab : "path";
  search.value = "";
  setHash();
  render();
  window.scrollTo({ top: 0 });
}

function showStage(i) {
  stageIdx = Math.max(0, Math.min(STAGES.length - 1, i));
  current = "path";
  search.value = "";
  setHash();
  render();
  document.querySelector(".track")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

tabs.forEach((b) => b.addEventListener("click", () => go(b.dataset.tab)));

view.addEventListener("click", (e) => {
  const t = e.target.closest("[data-go],[data-stage],[data-open-stage],[data-copy],[data-cat],.check");
  if (!t) return;
  if (t.dataset.go) return go(t.dataset.go);
  if (t.dataset.stage) return showStage(+t.dataset.stage);
  if (t.dataset.openStage) return showStage(+t.dataset.openStage);
  if (t.dataset.copy) {
    navigator.clipboard?.writeText(t.dataset.copy).then(() => notify("Prompt copied"), () => notify("Couldn't copy, select the text instead"));
    return;
  }
  if (t.dataset.cat) { glossCat = t.dataset.cat; return render(); }
  if (t.classList.contains("check")) t.classList.toggle("is-done");
});

// hover captions for the source list and the funnel
view.addEventListener("pointerover", (e) => {
  const t = e.target.closest("[data-best],[data-d]");
  if (!t) return;
  const cap = t.closest(".vis-card")?.querySelector(".vis-caption");
  if (cap) { cap.textContent = t.dataset.best || t.dataset.d; cap.classList.add("is-live"); }
});
view.addEventListener("pointerout", (e) => {
  const t = e.target.closest("[data-best],[data-d]");
  if (!t || t.contains(e.relatedTarget)) return;
  const cap = t.closest(".vis-card")?.querySelector(".vis-caption");
  if (cap) { cap.textContent = cap.dataset.default; cap.classList.remove("is-live"); }
});
view.addEventListener("focusin", (e) => {
  const t = e.target.closest("[data-best],[data-d]");
  const cap = t?.closest(".vis-card")?.querySelector(".vis-caption");
  if (cap) { cap.textContent = t.dataset.best || t.dataset.d; cap.classList.add("is-live"); }
});

search.addEventListener("input", render);
search.addEventListener("keydown", (e) => { if (e.key === "Escape") { search.value = ""; render(); search.blur(); } });
document.addEventListener("keydown", (e) => {
  const typing = document.activeElement === search;
  if (e.key === "/" && !typing) { e.preventDefault(); search.focus(); }
  if (!typing && current === "path" && !search.value && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
    showStage(stageIdx + (e.key === "ArrowRight" ? 1 : -1));
  }
});

(function init() {
  const [tab, stage] = location.hash.slice(1).split("/");
  current = RENDER[tab] ? tab : "path";
  const i = STAGES.findIndex((s) => s.id === stage);
  if (i >= 0) stageIdx = i;
  setHash();
  render();
})();
