/* ============================================================
   timeline.js — TIMELINE ページ
   js/data.js の WORKS と KH_ERA から、
   「発売日順」と「物語内の時系列順」の2つの表を組み立てる
   ============================================================ */

(() => {
  /* HTML に差し込む文字列を無害化する(album.js と同じ方針) */
  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /* 発売年の表示(未定作品は「発売未定」) */
  function yearLabel(work) {
    return work.year === "NEXT" ? "発売未定" : work.year + "年";
  }

  /* 時系列情報を引く。未登録なら末尾扱い */
  function eraOf(id) {
    return (typeof KH_ERA !== "undefined" && KH_ERA[id]) || { chrono: 99, era: "" };
  }

  /* 作品名の前に添える、作品ごとの色付きバッジ(short表記) */
  function badge(w) {
    return `<span class="kh-table__badge" style="--hue:${w.hue}">${esc(w.short)}</span>`;
  }

  /* 記憶の欠片 その2(発売日順表、4作目の行にそっと紛れさせる) */
  const FRAGMENT_F08 =
    '<span class="fragment" data-fragment="f08" style="margin-left:0.5em;">' +
    '<span class="fragment__shard"></span></span>';

  /* --- 発売日順(WORKS の並びそのまま) --- */
  function releaseRows() {
    return WORKS.map(
      (w, i) => `
        <tr style="--hue:${w.hue}">
          <td class="kh-table__num">${i + 1}</td>
          <td class="kh-table__year">${esc(yearLabel(w))}</td>
          <td class="kh-table__title">${badge(w)}${esc(w.title)}</td>
          <td class="kh-table__plat">${esc(w.platform || "")}</td>
          <td class="kh-table__era">${esc(eraOf(w.id).era)}${i === 3 ? FRAGMENT_F08 : ""}</td>
        </tr>`
    ).join("");
  }

  /* --- 物語内の時系列順(KH_ERA.chrono で並べ替え) --- */
  function chronoRows() {
    const sorted = WORKS.slice().sort(
      (a, b) => eraOf(a.id).chrono - eraOf(b.id).chrono
    );
    return sorted.map(
      (w) => `
        <tr style="--hue:${w.hue}">
          <td class="kh-table__num">${eraOf(w.id).chrono}</td>
          <td class="kh-table__title">${badge(w)}${esc(w.title)}</td>
          <td class="kh-table__era">${esc(eraOf(w.id).era)}</td>
          <td class="kh-table__year">${esc(yearLabel(w))}</td>
        </tr>`
    ).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (typeof WORKS === "undefined") return;

    const rel = document.getElementById("release-body");
    const chr = document.getElementById("chrono-body");
    if (rel) rel.innerHTML = releaseRows();
    if (chr) chr.innerHTML = chronoRows();

    /* 表を組み立てたあとに追加された欠片(f03/f08)を有効化する */
    if (typeof Effects !== "undefined" && Effects.refreshScrollReveal) {
      Effects.refreshScrollReveal();
    }
    if (typeof MemorySystem !== "undefined") MemorySystem.refresh();
  });
})();
