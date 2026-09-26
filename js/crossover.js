/* ============================================================
   crossover.js — MEMORY CROSSOVER ページ
   js/data.js の CROSSOVERS / CROSSOVER_CATEGORIES から、
   キングダムハーツと縁のある作品の一覧を描く。
   ============================================================ */

(() => {
  /* HTML に差し込む文字列を無害化する(album.js と同じ方針) */
  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* 画像の読み込みに失敗したときの鍵穴プレースホルダー(album.js と同じ) */
  const IMG_FALLBACK =
    "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20120%20120'%3E" +
    "%3Crect%20width='120'%20height='120'%20fill='%230a1428'/%3E" +
    "%3Cpath%20d='M60%2092C46%2079%2033%2069%2033%2057A13%2013%200%200%201%2060%2051A13%2013%200%200%201%2087%2057C87%2069%2074%2079%2060%2092Z'%20fill='none'%20stroke='%234da6ff'%20stroke-width='4'/%3E" +
    "%3Ccircle%20cx='60'%20cy='61'%20r='6'%20fill='%234da6ff'/%3E" +
    "%3Cpath%20d='M56%2066h8l2%2012H54Z'%20fill='%234da6ff'/%3E%3C/svg%3E";
  const IMG_ONERR = `onerror="this.onerror=null;this.src='${IMG_FALLBACK}'"`;

  /* 登場作品バー(album.js の worksTagsHtml と同じ見た目)。
     全12作品を発売順に固定で並べ、works に含む作品だけ点灯させる */
  function worksBar(workIds) {
    const ids = new Set(workIds || []);
    const cells = WORKS.map((w) => {
      const inIt = ids.has(w.id);
      const cat = w.category || "side";
      const title = `${w.short} ― ${w.title}(${w.year})${inIt ? "" : "・未登場"}`;
      return (
        `<span class="appears__cell${inIt ? " is-in" : ""}" data-cat="${cat}"` +
        ` title="${esc(title)}">${esc(w.short)}</span>`
      );
    }).join("");
    const names = WORKS.filter((w) => ids.has(w.id))
      .map((w) => w.title)
      .join(" / ");
    return (
      `<div class="appears" role="img" aria-label="登場作品: ${esc(names || "―")}">` +
      cells +
      "</div>"
    );
  }

  function cardHtml(item, index) {
    const stageLabel = KH_I18N.t("crossover.card.stageLabel");
    const guestsLabel = KH_I18N.t("crossover.card.guestsLabel");
    return `
      <article class="crossover-card reveal" data-cat="${esc(item.cat)}" data-delay="${(index % 4) + 1}">
        <p class="crossover-card__origin">${esc(item.origin || "")}</p>
        <h3 class="crossover-card__title">${esc(item.title)}</h3>
        ${item.stage ? `<p class="crossover-card__stage"><span>${esc(stageLabel)}</span>${esc(item.stage)}</p>` : ""}
        ${item.guests ? `<p class="crossover-card__guests"><span>${esc(guestsLabel)}</span>${esc(item.guests)}</p>` : ""}
        ${item.note ? `<p class="crossover-card__note">${esc(KH_I18N.pick(item, "note"))}</p>` : ""}
        <div class="crossover-card__appears">${worksBar(item.works)}</div>
      </article>`;
  }

  function render() {
    const grid = document.getElementById("crossover-grid");
    if (!grid) return;

    let html = "";
    let cardIndex = 0;

    CROSSOVER_CATEGORIES.forEach((group) => {
      const members = CROSSOVERS.filter((c) => c.cat === group.key);
      if (!members.length) return;

      html += `<h3 class="crossover-group-heading reveal" data-cat="${esc(group.key)}">${esc(KH_I18N.pick(group, "label"))}<span>${members.length}</span></h3>`;
      members.forEach((item) => {
        html += cardHtml(item, cardIndex);
        cardIndex += 1;
      });
    });

    grid.innerHTML = html;
  }

  /* ------------------------------------------------------------
     クロスオーバーの名場面ギャラリー(ページ下部・専用セクション)
     data.js の CROSSOVER_SCENES から、SECRET の場面ギャラリーと同じ
     見た目(横長フレーム＋見出し＋一文)のカードを並べる。
     画像が無い項目はファイル名のプレースホルダーを表示する。
     ------------------------------------------------------------ */
  function sceneWorkTitle(id) {
    if (!id || typeof WORKS === "undefined") return "";
    const w = WORKS.find((x) => x.id === id);
    return w ? w.title : "";
  }

  function sceneCardHtml(s, index) {
    const media = s.image
      ? `<img class="xscene-card__img" src="${esc(s.image)}" alt="${esc(s.title || s.id)}" loading="lazy" ${IMG_ONERR}>`
      : `<span class="xscene-card__ph">画像を <code>assets/crossover/${esc(s.id)}.jpg</code> に置くと表示されます</span>`;
    const work = sceneWorkTitle(s.work);
    const title = KH_I18N.pick(s, "title") || (s.image ? "(この場面の説明を追記します)" : "");
    const caption = KH_I18N.pick(s, "caption");
    const cap = title
      ? `${work ? `<span class="xscene-card__work">${esc(work)}</span>` : ""}` +
        `<span class="xscene-card__title">${esc(title)}</span>` +
        `${caption ? `<span class="xscene-card__note">${esc(caption)}</span>` : ""}`
      : `<span class="xscene-card__note">${esc(s.id)}</span>`;
    return `
      <figure class="xscene-card reveal${s.image ? "" : " is-empty"}" data-delay="${(index % 3) + 1}">
        <div class="xscene-card__frame">${media}</div>
        <figcaption class="xscene-card__cap">${cap}</figcaption>
      </figure>`;
  }

  function renderScenes() {
    const grid = document.getElementById("crossover-scenes");
    if (!grid || typeof CROSSOVER_SCENES === "undefined") return;
    grid.innerHTML = CROSSOVER_SCENES.map(sceneCardHtml).join("");
  }

  /* 絞り込み(カテゴリ単位。見出しの表示・非表示も連動) */
  function initFilter() {
    const bar = document.getElementById("crossover-filter-bar");
    const grid = document.getElementById("crossover-grid");
    const empty = document.getElementById("crossover-no-result");
    if (!bar || !grid) return;

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;

      bar.querySelectorAll(".filter-btn").forEach((b) => {
        b.classList.toggle("is-active", b === btn);
      });

      const filter = btn.dataset.filter;
      let visible = 0;
      grid.querySelectorAll(".crossover-card, .crossover-group-heading").forEach((el) => {
        const match = filter === "all" || el.dataset.cat === filter;
        el.classList.toggle("is-filtered-out", !match);
        if (match && el.classList.contains("crossover-card")) visible += 1;
      });
      if (empty) empty.style.display = visible === 0 ? "block" : "none";
    });
  }

  /* 現在の絞り込み状態を保ったまま、絞り込み結果の表示/非表示を反映する */
  function applyCurrentFilter() {
    const bar = document.getElementById("crossover-filter-bar");
    const grid = document.getElementById("crossover-grid");
    const empty = document.getElementById("crossover-no-result");
    if (!bar || !grid) return;

    const activeBtn = bar.querySelector(".filter-btn.is-active");
    const filter = activeBtn ? activeBtn.dataset.filter : "all";
    let visible = 0;
    grid.querySelectorAll(".crossover-card, .crossover-group-heading").forEach((el) => {
      const match = filter === "all" || el.dataset.cat === filter;
      el.classList.toggle("is-filtered-out", !match);
      if (match && el.classList.contains("crossover-card")) visible += 1;
    });
    if (empty) empty.style.display = visible === 0 ? "block" : "none";
  }

  document.addEventListener("DOMContentLoaded", () => {
    render();
    renderScenes();
    initFilter();
    if (typeof Effects !== "undefined" && Effects.refreshScrollReveal) {
      Effects.refreshScrollReveal();
    }

    /* 言語切り替え時は一覧を描き直し、絞り込み状態だけ引き継ぐ */
    document.addEventListener("kh-lang-change", () => {
      render();
      renderScenes();
      applyCurrentFilter();
      if (typeof Effects !== "undefined" && Effects.refreshScrollReveal) {
        Effects.refreshScrollReveal();
      }
    });
  });
})();
