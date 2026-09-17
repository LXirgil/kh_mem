/* ============================================================
   roxas.js — MEMORY OF SUMMER のロクサス写真スライドショー
   js/data.js の ROXAS_SHOTS からスライドを組み立て、
   自動送り + 前後ボタン + ドットで切り替える。
   画像が無いコマはファイル名のプレースホルダーを表示する。
   ============================================================ */

(() => {
  const INTERVAL = 5200; // 自動送りの間隔(ms)

  /* 画像読み込み失敗時の差し替え */
  const IMG_FALLBACK =
    "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20160%2090'%3E" +
    "%3Crect%20width='160'%20height='90'%20fill='%23070f21'/%3E" +
    "%3Cpath%20d='M80%2062C71%2054%2063%2048%2063%2040A9%209%200%200%201%2080%2036A9%209%200%200%201%2097%2040C97%2048%2089%2054%2080%2062Z'%20fill='none'%20stroke='%234da6ff'%20stroke-width='3'/%3E" +
    "%3Ccircle%20cx='80'%20cy='43'%20r='4'%20fill='%234da6ff'/%3E%3C/svg%3E";

  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function build() {
    const root = document.getElementById("roxas-slideshow");
    if (!root || typeof ROXAS_SHOTS === "undefined" || !ROXAS_SHOTS.length) return;

    const slides = ROXAS_SHOTS.map((shot, i) => {
      const media = shot.image
        ? `<img class="roxas-slide__img" src="${esc(shot.image)}" alt="ロクサス ${i + 1}" loading="lazy"` +
          ` onerror="this.onerror=null;this.src='${IMG_FALLBACK}'">`
        : `<span class="roxas-slide__ph">画像を <code>assets/roxas/${shot.id}.jpg</code> に置くと表示されます</span>`;
      const cap = shot.caption
        ? `<figcaption class="roxas-slide__cap">${esc(shot.caption)}</figcaption>`
        : "";
      return (
        `<figure class="roxas-slide${i === 0 ? " is-active" : ""}"${shot.image ? "" : ' data-empty'}` +
        ` role="group" aria-roledescription="スライド" aria-label="${i + 1} / ${ROXAS_SHOTS.length}">` +
        `<div class="roxas-slide__frame">${media}</div>${cap}</figure>`
      );
    }).join("");

    const dots = ROXAS_SHOTS.map(
      (_, i) =>
        `<button class="roxas-dot${i === 0 ? " is-active" : ""}" type="button" ` +
        `aria-label="${i + 1}枚目へ" data-go="${i}"></button>`
    ).join("");

    root.innerHTML = `
      <div class="roxas-slides">${slides}</div>
      <button class="roxas-nav roxas-nav--prev" type="button" aria-label="前の写真">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>
      </button>
      <button class="roxas-nav roxas-nav--next" type="button" aria-label="次の写真">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
      </button>
      <div class="roxas-dots" role="tablist" aria-label="写真の切り替え">${dots}</div>
    `;

    const slideEls = Array.from(root.querySelectorAll(".roxas-slide"));
    const dotEls = Array.from(root.querySelectorAll(".roxas-dot"));
    let index = 0;
    let timer = null;

    function show(n) {
      index = (n + slideEls.length) % slideEls.length;
      slideEls.forEach((el, i) => el.classList.toggle("is-active", i === index));
      dotEls.forEach((el, i) => el.classList.toggle("is-active", i === index));
    }
    function next() { show(index + 1); }
    function prev() { show(index - 1); }

    const reduced =
      typeof Effects !== "undefined" && Effects.prefersReducedMotion;

    function start() {
      if (reduced || timer) return;
      timer = window.setInterval(next, INTERVAL);
    }
    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }
    function bump(fn) {
      return () => {
        fn();
        stop();
        start();
      };
    }

    root.querySelector(".roxas-nav--next").addEventListener("click", bump(next));
    root.querySelector(".roxas-nav--prev").addEventListener("click", bump(prev));
    dotEls.forEach((d) =>
      d.addEventListener("click", bump(() => show(Number(d.dataset.go))))
    );

    /* ホバー・フォーカス中は自動送りを止める */
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);

    /* 画面外・非表示タブでは動かさない */
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    start();
  }

  document.addEventListener("DOMContentLoaded", () => {
    build();
    if (typeof Effects !== "undefined" && Effects.refreshScrollReveal) {
      Effects.refreshScrollReveal();
    }
  });
})();
