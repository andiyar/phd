// DREAMS Corpus Progress widget — mounts to #progressBtn on either page.
// Self-fetches coded_quotes.json; falls back to an embedded <script id="embedded-data">.
//
// Corpus totals: count of files under Working Data/Day_*/ (excludes _speedtest).
// Computed 2026-06-24; if files change, recount and bump CORPUS_TOTALS.
(function () {
  "use strict";

  const CORPUS_TOTALS = {
    DXM: { notes: 576, patients: 26, Medical: 165, Nursing: 359, PCA: 46 },
    MDZ: { notes: 474, patients: 26, Medical: 140, Nursing: 296, PCA: 28 },
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

  function aggregate(data) {
    const acc = {
      DXM: { codes: 0, notes: new Set(), patients: new Set(), disc: {} },
      MDZ: { codes: 0, notes: new Set(), patients: new Set(), disc: {} },
    };
    for (const it of data) {
      const a = acc[it.arm];
      if (!a) continue;
      a.codes++;
      if (it.source_file) a.notes.add(it.source_file);
      if (it.patient)     a.patients.add(it.patient);
      if (it.discipline)  a.disc[it.discipline] = (a.disc[it.discipline] || 0) + 1;
    }
    return acc;
  }

  function panelHTML(acc) {
    const frac = (n, total) =>
      total != null
        ? '<span class="num">' + n + '</span><span class="frac"> / ' + total + '</span>'
        : '<span class="num">' + n + '</span>';

    const row = (label, dxm, mdz, dxmT, mdzT, divider) => {
      const all = dxm + mdz;
      const allT = (dxmT != null && mdzT != null) ? dxmT + mdzT : null;
      const tip = allT != null
        ? ' title="' + all + ' of ' + allT + ' coded · ' + (allT - all) + ' remaining"'
        : '';
      return '<tr' + (divider ? ' class="divider"' : '') + tip + '>' +
        '<td>' + label + '</td>' +
        '<td>' + frac(dxm, dxmT) + '</td>' +
        '<td>' + frac(mdz, mdzT) + '</td>' +
        '<td>' + frac(all, allT) + '</td>' +
      '</tr>';
    };

    const dxmN = acc.DXM.notes.size, mdzN = acc.MDZ.notes.size, allN = dxmN + mdzN;
    const pct = NOTES_ALL ? Math.round(1000 * allN / NOTES_ALL) / 10 : 0;
    const dxmBar = NOTES_ALL ? (100 * dxmN / NOTES_ALL) : 0;
    const mdzBar = NOTES_ALL ? (100 * mdzN / NOTES_ALL) : 0;
    const toGo = NOTES_ALL - allN;

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
          row("Codes",    acc.DXM.codes,         acc.MDZ.codes,         null, null) +
          row("Notes",    dxmN,                  mdzN,                  CORPUS_TOTALS.DXM.notes,    CORPUS_TOTALS.MDZ.notes) +
          row("Patients", acc.DXM.patients.size, acc.MDZ.patients.size, CORPUS_TOTALS.DXM.patients, CORPUS_TOTALS.MDZ.patients) +
          row("Medical",  acc.DXM.disc.Medical || 0, acc.MDZ.disc.Medical || 0, CORPUS_TOTALS.DXM.Medical, CORPUS_TOTALS.MDZ.Medical, true) +
          row("Nursing",  acc.DXM.disc.Nursing || 0, acc.MDZ.disc.Nursing || 0, CORPUS_TOTALS.DXM.Nursing, CORPUS_TOTALS.MDZ.Nursing) +
          row("PCA",      acc.DXM.disc.PCA || 0,     acc.MDZ.disc.PCA || 0,     CORPUS_TOTALS.DXM.PCA,     CORPUS_TOTALS.MDZ.PCA) +
        '</tbody>' +
      '</table>' +
      '<div class="pw-bar" title="' + allN + ' of ' + NOTES_ALL + ' notes coded">' +
        '<div class="pw-seg-dxm" style="width:' + dxmBar + '%"></div>' +
        '<div class="pw-seg-mdz" style="width:' + mdzBar + '%"></div>' +
      '</div>' +
      '<div class="pw-foot">' +
        '<span>' + allN + ' coded</span>' +
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
    const dxmN = acc.DXM.notes.size, mdzN = acc.MDZ.notes.size;
    const pct = NOTES_ALL ? Math.round(1000 * (dxmN + mdzN) / NOTES_ALL) / 10 : 0;
    const pctEl = btn.querySelector(".pw-btn-pct");
    if (pctEl) pctEl.textContent = pct + "%";
    panel.innerHTML = panelHTML(acc);
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
