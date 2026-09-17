/* ============================================================
   intro.js — TOP の初回イントロ「ダイブ・トゥ・ザ・ハート」風ゲート
   セッション中に一度だけ、全画面でステンドグラスの足場がせり上がり、
   触れるとサイト本体へ溶けていく。図形はすべてオリジナルの SVG。
   ============================================================ */

(() => {
  const SEEN_KEY = "kh-dive-seen";
  const gate = document.getElementById("dive-gate");
  if (!gate) return;

  let seen = false;
  try {
    seen = sessionStorage.getItem(SEEN_KEY) === "1";
  } catch (e) {
    /* localStorage 不可でも続行 */
  }
  if (seen) {
    gate.hidden = true;
    document.documentElement.classList.remove("dive-open");
    return;
  }

  const reduced =
    typeof Effects !== "undefined"
      ? Effects.prefersReducedMotion
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- ステンドグラスの足場を組み立てる --- */
  const C = 180;
  const R = 168;
  const WEDGES = 12;
  const pt = (deg, r) => {
    const a = (deg * Math.PI) / 180;
    return `${(C + r * Math.cos(a)).toFixed(1)} ${(C + r * Math.sin(a)).toFixed(1)}`;
  };

  let wedges = "";
  for (let i = 0; i < WEDGES; i += 1) {
    const a0 = -90 + i * (360 / WEDGES);
    const a1 = a0 + 360 / WEDGES;
    const fill = i % 2 === 0 ? "url(#dg-blue)" : "url(#dg-gold)";
    wedges +=
      `<path class="dive-wedge" style="--i:${i}" fill="${fill}" ` +
      `d="M ${C} ${C} L ${pt(a0, R)} A ${R} ${R} 0 0 1 ${pt(a1, R)} Z"/>`;
  }

  gate.innerHTML = `
    <button class="dive-gate__skip" type="button">スキップ &rsaquo;</button>

    <div class="dive-gate__stage" role="button" tabindex="0"
         aria-label="扉に触れて、記憶の世界へ入る">
      <svg class="dive-plat" viewBox="0 0 360 360" aria-hidden="true">
        <defs>
          <radialGradient id="dg-blue" cx="50%" cy="45%" r="70%">
            <stop offset="0%"  stop-color="rgba(154,213,255,0.28)"/>
            <stop offset="60%" stop-color="rgba(77,166,255,0.16)"/>
            <stop offset="100%" stop-color="rgba(20,58,107,0.30)"/>
          </radialGradient>
          <radialGradient id="dg-gold" cx="50%" cy="45%" r="70%">
            <stop offset="0%"  stop-color="rgba(230,213,163,0.26)"/>
            <stop offset="60%" stop-color="rgba(179,154,99,0.14)"/>
            <stop offset="100%" stop-color="rgba(60,48,24,0.28)"/>
          </radialGradient>
        </defs>

        <g class="dive-plat__rot">
          <circle class="dive-ring" cx="180" cy="180" r="176" fill="none"
                  stroke="rgba(154,213,255,0.25)" stroke-width="1"/>
          ${wedges}
          <circle class="dive-ring" cx="180" cy="180" r="168" fill="none"
                  stroke="rgba(154,213,255,0.55)" stroke-width="1.4"/>
          <circle class="dive-ring" cx="180" cy="180" r="120" fill="none"
                  stroke="rgba(230,213,163,0.4)" stroke-width="1" stroke-dasharray="2 8"/>
          <circle class="dive-ring" cx="180" cy="180" r="70" fill="none"
                  stroke="rgba(154,213,255,0.5)" stroke-width="1.4"/>
        </g>

        <!-- 交差するキーブレードの光 -->
        <g class="dive-blades" fill="none" stroke="rgba(238,244,255,0.9)"
           stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M96 300 264 96"/>
          <path d="M264 300 96 96"/>
          <circle cx="90" cy="306" r="7"/>
          <circle cx="270" cy="306" r="7"/>
        </g>

        <!-- 中央のハートと鍵穴 -->
        <g class="dive-core">
          <path d="M180 244 C150 216 122 196 122 168 A28 28 0 0 1 180 156
                   A28 28 0 0 1 238 168 C238 196 210 216 180 244Z"
                fill="rgba(3,6,13,0.7)" stroke="rgba(154,213,255,0.9)" stroke-width="4"/>
          <circle cx="180" cy="180" r="12" fill="rgba(154,213,255,0.95)"/>
          <path d="M173 190h14l5 22H168Z" fill="rgba(154,213,255,0.95)"/>
        </g>
      </svg>

      <span class="dive-gate__pulse" aria-hidden="true"></span>
    </div>

    <div class="dive-gate__text">
      <span class="dive-gate__eyebrow">KINGDOM HEARTS — MEMORY</span>
      <p class="dive-gate__title">ようこそ、記憶の世界へ</p>
      <button class="dive-gate__enter" type="button">
        扉に触れる
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6"/>
        </svg>
      </button>
    </div>
  `;

  if (reduced) gate.classList.add("is-reduced");

  const stage = gate.querySelector(".dive-gate__stage");
  const enterBtn = gate.querySelector(".dive-gate__enter");
  const skipBtn = gate.querySelector(".dive-gate__skip");

  let done = false;
  function finish(dive) {
    if (done) return;
    done = true;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch (e) {
      /* 保存できなくても支障なし */
    }

    if (dive && !reduced) {
      gate.classList.add("is-diving");
      if (typeof AudioEngine !== "undefined") AudioEngine.play("transition");
      if (typeof Effects !== "undefined" && Effects.burst) {
        Effects.burst(window.innerWidth / 2, window.innerHeight / 2, "154, 213, 255", 22);
      }
    }

    const delay = dive && !reduced ? 760 : 220;
    window.setTimeout(() => {
      gate.hidden = true;
      document.documentElement.classList.remove("dive-open");
    }, delay);
  }

  stage.addEventListener("click", () => finish(true));
  enterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    finish(true);
  });
  skipBtn.addEventListener("click", () => finish(false));
  stage.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      finish(true);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (!done && e.key === "Escape") finish(false);
  });

  /* 演出が一段落したらボタンにフォーカスを移す */
  window.setTimeout(
    () => {
      if (!done) enterBtn.focus({ preventScroll: true });
    },
    reduced ? 100 : 2600
  );
})();
