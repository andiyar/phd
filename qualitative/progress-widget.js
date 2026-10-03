// DREAMS Corpus Progress widget — mounts to #progressBtn on either page.
// Self-fetches coded_quotes.json; falls back to an embedded <script id="embedded-data">.
//
// Corpus totals: count of files under Working Data/Day_*/ (excludes _speedtest).
// Computed 2026-06-24; Other added 2026-10-03; if files change, recount and bump CORPUS_TOTALS.
//
// PROGRESS = notes READ (every file in seen_files.json: coded, skipped, or opened), per
// arm x discipline — fixed 2026-10-03. It previously counted only notes that yielded a
// quote (skips never counted) and the discipline rows counted quotes against note totals.
(function () {
  "use strict";

  const CORPUS_TOTALS = {
    DXM: { notes: 576, patients: 26, Medical: 165, Nursing: 359, PCA: 46, Other: 6 },
    MDZ: { notes: 474, patients: 26, Medical: 140, Nursing: 296, PCA: 28, Other: 10 },
  };
  const NOTES_ALL = CORPUS_TOTALS.DXM.notes + CORPUS_TOTALS.MDZ.notes;

  async function loadData() {
    try {
      const r = await fetch("coded_quotes.json", { cache: "no-store" });
      if (r.ok) {
        const j = await r.json();
        if (Array.isArray(j)) return j;
      }
    } catch (_) { /* fall through */ }
    const emb = document.getElementById("embedded-data");
    if (emb) {
      try {
        const j = JSON.parse(emb.textContent || "[]");
        if (Array.isArray(j)) return j;
      } catch (_) { /* ignore */ }
    }
    return [];
  }

  async function loadSeen() {
    try {
      const r = await fetch("seen_files.json", { cache: "no-store" });
      if (r.ok) {
        const j = await r.json();
        if (Array.isArray(j)) return j;
      }
    } catch (_) { /* file:// or missing */ }
    return null;
  }

  function discOf(f) {
    if (f.indexOf("-Nursing-") >= 0) return "Nursing";
    if (f.indexOf("-Medical-") >= 0) return "Medical";
    if (f.indexOf("_PCA_") >= 0) return "PCA";
    return "Other";
  }

  // notes read per arm x discipline, from seen_files.json
  function aggregateSeen(seen) {
    const r = { DXM: { all: 0, coded: 0, skipped: 0, disc: {} }, MDZ: { all: 0, coded: 0, skipped: 0, disc: {} } };
    const done = new Set();
    for (const e of seen) {
      if (!e || !e.file || done.has(e.file)) continue;
      done.add(e.file);
      const a = r[e.file.slice(0, 3)];
      if (!a) continue;
      a.all++;
      if (e.status === "coded") a.coded++;
      if (e.status === "skipped") a.skipped++;
      const d = discOf(e.file);
      a.disc[d] = (a.disc[d] || 0) + 1;
    }
    return r;
  }

  function aggregate(data) {
    const acc = {
      DXM: { codes: 0, notes: new Set(), patients: new Set(), disc: {} },
      MDZ: { codes: 0, notes: new Set(), patients: new Set(), disc: {} },
    };
    for (const it of data) {
      const a = acc[it.arm];
      if (!a) continue;
      if (it.status && it.status !== "in_scope") continue;   // deprecated rows don't count
      a.codes++;
      if (it.source_file) a.notes.add(it.source_file);
      if (it.patient)     a.patients.add(it.patient);
      if (it.discipline)  a.disc[it.discipline] = (a.disc[it.discipline] || 0) + 1;
    }
    return acc;
  }

  function panelHTML(acc, rd) {
    const frac = (n, total) =>
      total != null
        ? '<span class="num">' + n + '</span><span class="frac"> / ' + total + '</span>'
        : '<span class="num">' + n + '</span>';

    const row = (label, dxm, mdz, dxmT, mdzT, divider, verb) => {
      const all = dxm + mdz;
      const allT = (dxmT != null && mdzT != null) ? dxmT + mdzT : null;
      const tip = allT != null
        ? ' title="' + all + ' of ' + allT + ' ' + (verb || "read") + ' · ' + (allT - all) + ' remaining"'
        : '';
      return '<tr' + (divider ? ' class="divider"' : '') + tip + '>' +
        '<td>' + label + '</td>' +
        '<td>' + frac(dxm, dxmT) + '</td>' +
        '<td>' + frac(mdz, mdzT) + '</td>' +
        '<td>' + frac(all, allT) + '</td>' +
      '</tr>';
    };
    const T = CORPUS_TOTALS;
    const qN = acc.DXM.notes.size + acc.MDZ.notes.size;

    if (!rd) {
      // no seen_files.json (opened from file://): fall back to notes-with-quotes
      const pct = NOTES_ALL ? Math.round(1000 * qN / NOTES_ALL) / 10 : 0;
      return '<h2 class="pw-title">Notes with quotes <span class="pw-pct">' + pct + '%</span></h2>' +
        '<table class="pw-table"><tbody>' +
          row("Quotes", acc.DXM.codes, acc.MDZ.codes, null, null) +
          row("Notes with quotes", acc.DXM.notes.size, acc.MDZ.notes.size, T.DXM.notes, T.MDZ.notes, false, "yielded quotes") +
          row("Patients", acc.DXM.patients.size, acc.MDZ.patients.size, T.DXM.patients, T.MDZ.patients) +
        '</tbody></table>' +
        '<div class="pw-foot"><span>reading progress needs seen_files.json (open via the web)</span></div>';
    }

    const dxmN = rd.DXM.all, mdzN = rd.MDZ.all, allN = dxmN + mdzN;
    const pct = NOTES_ALL ? Math.round(1000 * allN / NOTES_ALL) / 10 : 0;
    const dxmBar = NOTES_ALL ? (100 * dxmN / NOTES_ALL) : 0;
    const mdzBar = NOTES_ALL ? (100 * mdzN / NOTES_ALL) : 0;
    const toGo = NOTES_ALL - allN;
    const d = (arm, k) => rd[arm].disc[k] || 0;

    return '' +
      '<h2 class="pw-title">Corpus Progress <span class="pw-pct">' + pct + '%</span></h2>' +
      '<table class="pw-table">' +
        '<thead><tr>' +
          '<th></th>' +
          '<th class="arm-DXM">DXM</th>' +
          '<th class="arm-MDZ">MDZ</th>' +
          '<th>All</th>' +
        '</tr></thead>' +
        '<tbody>' +
          row("Notes read", dxmN, mdzN, T.DXM.notes, T.MDZ.notes) +
          row("Medical",  d("DXM", "Medical"), d("MDZ", "Medical"), T.DXM.Medical, T.MDZ.Medical, true) +
          row("Nursing",  d("DXM", "Nursing"), d("MDZ", "Nursing"), T.DXM.Nursing, T.MDZ.Nursing) +
          row("PCA",      d("DXM", "PCA"),     d("MDZ", "PCA"),     T.DXM.PCA,     T.MDZ.PCA) +
          row("Other",    d("DXM", "Other"),   d("MDZ", "Other"),   T.DXM.Other,   T.MDZ.Other) +
          row("Notes with quotes", acc.DXM.notes.size, acc.MDZ.notes.size, null, null, true) +
          row("Quotes",   acc.DXM.codes, acc.MDZ.codes, null, null) +
          row("Patients", acc.DXM.patients.size, acc.MDZ.patients.size, T.DXM.patients, T.MDZ.patients, false, "with quotes") +
        '</tbody>' +
      '</table>' +
      '<div class="pw-bar" title="' + allN + ' of ' + NOTES_ALL + ' notes read">' +
        '<div class="pw-seg-dxm" style="width:' + dxmBar + '%"></div>' +
        '<div class="pw-seg-mdz" style="width:' + mdzBar + '%"></div>' +
      '</div>' +
      '<div class="pw-foot">' +
        '<span>' + allN + ' read (' + (rd.DXM.coded + rd.MDZ.coded) + ' coded · ' + (rd.DXM.skipped + rd.MDZ.skipped) + ' skipped)</span>' +
        '<span>' + toGo + ' to go</span>' +
      '</div>';
  }

  function positionPanel(panel, btn) {
    const r = btn.getBoundingClientRect();
    const right = Math.max(8, window.innerWidth - r.right);
    panel.style.right = right + "px";
    panel.style.top = (r.bottom + 8) + "px";
  }

  async function init() {
    const btn = document.getElementById("progressBtn");
    if (!btn) return;

    const panel = document.createElement("div");
    panel.className = "pw-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Corpus progress");
    document.body.appendChild(panel);

    function open() {
      positionPanel(panel, btn);
      panel.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
    function close() {
      panel.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (panel.classList.contains("open")) close(); else open();
    });
    document.addEventListener("click", function (e) {
      if (!panel.classList.contains("open")) return;
      if (panel.contains(e.target) || btn.contains(e.target)) return;
      close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    window.addEventListener("resize", function () {
      if (panel.classList.contains("open")) positionPanel(panel, btn);
    });

    const data = await loadData();
    const acc = aggregate(data);
    const seen = await loadSeen();
    const rd = seen ? aggregateSeen(seen) : null;
    const n = rd ? rd.DXM.all + rd.MDZ.all : acc.DXM.notes.size + acc.MDZ.notes.size;
    const pct = NOTES_ALL ? Math.round(1000 * n / NOTES_ALL) / 10 : 0;
    const pctEl = btn.querySelector(".pw-btn-pct");
    if (pctEl) pctEl.textContent = pct + "%";
    panel.innerHTML = panelHTML(acc, rd);
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
