const view = document.getElementById("view");
const search = document.getElementById("search");
const tabs = [...document.querySelectorAll(".hub-tabs button")];
const toast = document.getElementById("toast");

let current = "start";
let glossCat = "All";
const openSteps = new Set([0]);

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const strip = (s) => s.replace(/<[^>]+>/g, "");
const phaseOf = (id) => PHASES.find((p) => p.id === id);
const avatar = (key, cls = "avatar") => {
  const p = PEOPLE[key];
  return `<span class="${cls}" style="background:${p.color}22;color:${p.color}">${p.initials}</span>`;
};
const linkPill = (l) =>
  l.todo
    ? `<span class="link-pill todo" title="Link still missing"><i data-lucide="${l.icon}"></i>${esc(l.label)} · link to add</span>`
    : !l.href
    ? `<span class="link-pill"><i data-lucide="${l.icon}"></i>${esc(l.label)}</span>`
    : `<a class="link-pill" href="${l.href}" target="_blank" rel="noopener"><i data-lucide="${l.icon}"></i>${esc(l.label)}</a>`;

function notify(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(notify.t);
  notify.t = setTimeout(() => toast.classList.remove("show"), 1600);
}

/* ---------- views ---------- */

function renderStart() {
  return `
    <div class="hero">
      <h2>New here? Start with this page.</h2>
      <p>This hub shows how a campaign gets built, where every tool and file lives, and who to ask. The idea is that you can find things yourself before asking a colleague or Claude.</p>
      <div class="hero-actions">
        <button class="btn" data-go="flow"><i data-lucide="git-commit-horizontal"></i>Walk through the flow</button>
        <button class="btn ghost" data-go="tools"><i data-lucide="link"></i>All tool links</button>
        <button class="btn ghost" data-go="glossary"><i data-lucide="book-a"></i>What does ICP mean?</button>
      </div>
    </div>

    <div class="section-title"><h2>Your first week</h2><p>Tick them off as you go. Saved only in this browser.</p></div>
    <div class="card">
      <ul class="checklist">
        ${FIRST_WEEK.map((s, i) => `
          <li><input type="checkbox" id="fw${i}" data-check="fw${i}"><label for="fw${i}"><strong>${esc(s.title)}</strong><br><span>${esc(s.text)}</span></label></li>`).join("")}
      </ul>
    </div>

    <div class="section-title"><h2>Who to ask</h2><p>When the hub doesn't answer it.</p></div>
    <div class="people">
      ${Object.keys(PEOPLE).map((k) => `
        <div class="card person">${avatar(k)}<div><h3>${esc(PEOPLE[k].name)}</h3><p>${esc(PEOPLE[k].about)}</p></div></div>`).join("")}
    </div>

    <div class="section-title"><h2>Three rules that save you trouble</h2></div>
    <div class="grid">
      <div class="card"><div class="icon-box"><i data-lucide="eye"></i></div><h3>Green is not delivered</h3><p>A job that says "success" can still do nothing. Check the result, not the status.</p></div>
      <div class="card"><div class="icon-box"><i data-lucide="pen-line"></i></div><h3>Draft first, send after the OK</h3><p>Never send a message as someone else without their review.</p></div>
      <div class="card"><div class="icon-box"><i data-lucide="languages"></i></div><h3>German copy gets checked</h3><p>Everything a client or lead reads in German goes through the core-deutsch-copy skill first.</p></div>
    </div>`;
}

function renderFlow() {
  let n = 0;
  const numbered = STEPS.map((s) => ({ ...s, n: ++n }));
  const map = PHASES.map((p) => `
    <div class="phase-col">
      <h4 style="color:${p.color}"><i style="background:${p.color}"></i>${esc(p.label)}</h4>
      <div class="mini-steps">
        ${numbered.filter((s) => s.phase === p.id).map((s) => `<button class="mini-step" data-jump="${s.n - 1}"><b>${String(s.n).padStart(2, "0")}</b>${esc(s.title)}</button>`).join("")}
      </div>
    </div>`).join("");

  const phases = PHASES.map((p, pi) => `
    <div class="phase">
      <div class="phase-head">
        <span class="num" style="background:${p.color}1f;color:${p.color}">Phase ${pi + 1}</span>
        <div><h2>${esc(p.title)}</h2><p>${esc(p.sub)}</p></div>
      </div>
      <div class="timeline">
        ${numbered.filter((s) => s.phase === p.id).map((s) => renderStep(s, p)).join("")}
      </div>
    </div>`).join("");

  return `
    <div class="section-title"><h2>From "who is this client?" to booked meetings</h2><p>Click a step to open it. Every step has links, a tip and a prompt you can copy.</p></div>
    <div class="phase-map">${map}</div>
    ${phases}`;
}

function renderStep(s, p) {
  const i = s.n - 1;
  const open = openSteps.has(i);
  return `
    <article class="step ${open ? "is-open" : ""}" id="step-${i}" style="--node-glow:${p.color}33">
      <span class="step-node" style="border-color:${p.color};color:${p.color}">${s.n}</span>
      <button class="step-head" data-step="${i}" aria-expanded="${open}">
        <div><h3>${esc(s.title)}</h3><p>${esc(s.short)}</p></div>
        <i class="chev" data-lucide="chevron-down"></i>
      </button>
      <div class="step-body">
        <div style="display:grid;gap:16px">
          <div class="block"><h5>What you do</h5><ul>${s.what.map((w) => `<li>${w}</li>`).join("")}</ul></div>
          <div class="result"><i data-lucide="flag"></i><div><strong>You end up with:</strong> ${esc(s.result)}</div></div>
          <div class="block"><h5>Links</h5><div class="link-row">${s.links.map(linkPill).join("")}</div></div>
        </div>
        <div style="display:grid;gap:16px;align-content:start">
          <div class="tip"><i data-lucide="lightbulb"></i><div>${esc(s.tip)}</div></div>
          <div class="prompt">
            <div class="label"><i data-lucide="sparkles"></i>Ask Claude</div>
            <button class="copy" data-copy="${esc(s.prompt)}"><i data-lucide="copy"></i>Copy</button>
            ${esc(s.prompt)}
          </div>
          <div class="owner">${avatar(s.owner)}Questions about this step? Ask ${esc(PEOPLE[s.owner].name)}.</div>
        </div>
      </div>
    </article>`;
}

function toolCard(t) {
  return `
    <a class="card tool-card" href="${t.url}" target="_blank" rel="noopener">
      <div class="tool-top"><span class="icon-box"><i data-lucide="${t.icon}"></i></span><div><h3>${esc(t.name)}</h3><span class="tool-url">${esc(t.url.replace(/^https?:\/\//, ""))}</span></div></div>
      <p>${esc(t.what)}</p>
      <div class="tool-meta"><span class="login"><i data-lucide="key-round"></i>${esc(t.access)}</span></div>
    </a>`;
}

function renderTools() {
  const groups = [...new Set(TOOLS.map((t) => t.group))];
  return `
    <div class="tip" style="margin-bottom:8px"><i data-lucide="shield"></i><div>No passwords on this page. Shared logins live in the <strong>Secrets</strong> tab, and the access info here is a first draft to confirm with Leon.</div></div>
    ${groups.map((g) => `
      <div class="section-title"><h2>${esc(g)}</h2></div>
      <div class="grid">${TOOLS.filter((t) => t.group === g).map(toolCard).join("")}</div>`).join("")}`;
}

function whereRow(w) {
  return `
    <div class="card where-row">
      <div class="where-q"><span class="icon-box" style="margin:0"><i data-lucide="${w.icon}"></i></span>${esc(w.q)}</div>
      <div class="where-a"><code>${esc(w.a)}</code><p>${esc(w.note)}</p></div>
    </div>`;
}

function renderWhere() {
  return `
    <div class="section-title"><h2>"I'm looking for…"</h2><p>Where things live, so you don't have to guess.</p></div>
    <div class="where-list">${WHERE.map(whereRow).join("")}</div>`;
}

function renderLearnings() {
  return LEARNINGS.map((g) => `
    <div class="learn-group">
      <div class="section-title"><h2 style="display:flex;gap:10px;align-items:center"><i data-lucide="${g.icon}"></i>${esc(g.group)}</h2><p>${g.items.length} learnings</p></div>
      <div class="learn-grid">
        ${g.items.map((it, i) => `<div class="card learn"><span class="n">${String(i + 1).padStart(2, "0")}</span><p>${it}</p></div>`).join("")}
      </div>
    </div>`).join("");
}

function termCard(g) {
  return `
    <div class="card term" id="term-${esc(g.t[0].toUpperCase())}">
      <div class="term-head"><h3>${esc(g.t)}</h3><span class="tag">${esc(g.cat)}</span></div>
      ${g.long ? `<span class="long">${esc(g.long)}</span>` : ""}
      <p>${esc(g.d)}</p>
      ${g.ex ? `<p class="ex">e.g. ${esc(g.ex)}</p>` : ""}
    </div>`;
}

function renderGlossary() {
  const cats = ["All", ...new Set(GLOSSARY.map((g) => g.cat))];
  const list = GLOSSARY.filter((g) => glossCat === "All" || g.cat === glossCat).sort((a, b) => a.t.localeCompare(b.t));
  const letters = new Set(list.map((g) => g.t[0].toUpperCase()));
  const seen = new Set();
  return `
    <div class="gloss-tools">
      <div class="chips">${cats.map((c) => `<button class="chip ${c === glossCat ? "is-on" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}</div>
      <div class="letters">${"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => `<a class="${letters.has(l) ? "has" : ""}" ${letters.has(l) ? `data-letter="${l}" href="#"` : ""}>${l}</a>`).join("")}</div>
    </div>
    <div class="gloss-grid">
      ${list.map((g) => {
        const L = g.t[0].toUpperCase();
        const card = termCard(g);
        if (seen.has(L)) return card.replace(` id="term-${L}"`, "");
        seen.add(L);
        return card;
      }).join("")}
    </div>`;
}

function renderSearch(q) {
  const needle = q.toLowerCase();
  const hit = (...parts) => parts.join(" ").toLowerCase().includes(needle);
  const steps = STEPS.map((s, i) => ({ ...s, i })).filter((s) => hit(s.title, s.short, strip(s.what.join(" ")), s.tip));
  const tools = TOOLS.filter((t) => hit(t.name, t.what, t.url, t.group));
  const where = WHERE.filter((w) => hit(w.q, w.a, w.note));
  const terms = GLOSSARY.filter((g) => hit(g.t, g.long || "", g.d));
  const learns = LEARNINGS.flatMap((g) => g.items.filter((it) => hit(strip(it))).map((it) => ({ g: g.group, it })));
  const total = steps.length + tools.length + where.length + terms.length + learns.length;
  if (!total) return `<div class="empty">Nothing found for "${esc(q)}". Try a tool name or a term like "ICP".</div>`;
  return `
    <div class="section-title"><h2>${total} results for "${esc(q)}"</h2><p>Press Esc to clear.</p></div>
    ${terms.length ? `<div class="section-title"><h2>Glossary</h2></div><div class="gloss-grid">${terms.map(termCard).join("")}</div>` : ""}
    ${tools.length ? `<div class="section-title"><h2>Tools</h2></div><div class="grid">${tools.map(toolCard).join("")}</div>` : ""}
    ${steps.length ? `<div class="section-title"><h2>Flow steps</h2></div><div class="grid">${steps.map((s) => `<button class="card hoverable" style="text-align:left;cursor:pointer" data-open-step="${s.i}"><span class="tag">Step ${s.i + 1}</span><h3 style="margin-top:10px">${esc(s.title)}</h3><p>${esc(s.short)}</p></button>`).join("")}</div>` : ""}
    ${where.length ? `<div class="section-title"><h2>Where is what</h2></div><div class="where-list">${where.map(whereRow).join("")}</div>` : ""}
    ${learns.length ? `<div class="section-title"><h2>Learnings</h2></div><div class="learn-grid">${learns.map((l) => `<div class="card learn"><span class="tag">${esc(l.g)}</span><p>${l.it}</p></div>`).join("")}</div>` : ""}`;
}

const RENDER = { start: renderStart, flow: renderFlow, tools: renderTools, where: renderWhere, learnings: renderLearnings, glossary: renderGlossary };

/* ---------- wiring ---------- */

function render() {
  const q = search.value.trim();
  tabs.forEach((b) => b.setAttribute("aria-selected", String(!q && b.dataset.tab === current)));
  view.innerHTML = q ? renderSearch(q) : RENDER[current]();
  view.style.animation = "none";
  void view.offsetWidth;
  view.style.animation = "";
  restoreChecks();
  if (window.lucide) lucide.createIcons();
}

function go(tab, push = true) {
  current = RENDER[tab] ? tab : "start";
  search.value = "";
  if (push) history.replaceState(null, "", `#${current}`);
  render();
  window.scrollTo({ top: 0 });
}

function restoreChecks() {
  view.querySelectorAll("[data-check]").forEach((el) => {
    try { el.checked = localStorage.getItem(`kh-${el.dataset.check}`) === "1"; } catch (e) {}
  });
}

tabs.forEach((b) => b.addEventListener("click", () => go(b.dataset.tab)));

view.addEventListener("click", (e) => {
  const t = e.target.closest("[data-go],[data-step],[data-jump],[data-copy],[data-cat],[data-letter],[data-open-step]");
  if (!t) return;
  if (t.dataset.go) return go(t.dataset.go);
  if (t.dataset.step) {
    const i = +t.dataset.step;
    openSteps.has(i) ? openSteps.delete(i) : openSteps.add(i);
    const el = document.getElementById(`step-${i}`);
    el.classList.toggle("is-open");
    t.setAttribute("aria-expanded", String(openSteps.has(i)));
    return;
  }
  if (t.dataset.jump || t.dataset.openStep) {
    const i = +(t.dataset.jump ?? t.dataset.openStep);
    openSteps.add(i);
    if (t.dataset.openStep) { current = "flow"; search.value = ""; history.replaceState(null, "", "#flow"); }
    render();
    document.getElementById(`step-${i}`).scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (t.dataset.copy) {
    e.preventDefault();
    navigator.clipboard?.writeText(t.dataset.copy).then(() => notify("Prompt copied"), () => notify("Couldn't copy, select the text instead"));
    return;
  }
  if (t.dataset.cat) { glossCat = t.dataset.cat; return render(); }
  if (t.dataset.letter) {
    e.preventDefault();
    document.getElementById(`term-${t.dataset.letter}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

view.addEventListener("change", (e) => {
  const k = e.target.dataset.check;
  if (k) try { localStorage.setItem(`kh-${k}`, e.target.checked ? "1" : "0"); } catch (err) {}
});

search.addEventListener("input", render);
search.addEventListener("keydown", (e) => { if (e.key === "Escape") { search.value = ""; render(); search.blur(); } });
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== search) { e.preventDefault(); search.focus(); }
});
window.addEventListener("hashchange", () => go(location.hash.slice(1), false));

go(location.hash.slice(1) || "start", false);
