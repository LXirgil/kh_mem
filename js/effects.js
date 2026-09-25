/* ============================================================
   effects.js — 視覚演出をまとめて担当する
   光の粒子 / カーソル追従の光 / スクロール連動 / ページ遷移
   ============================================================ */

const Effects = (() => {
  /* OS の「視差効果を減らす」設定を尊重する */
  const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------
     1. 光の粒子(背景の Canvas アニメーション)
     ------------------------------------------------------------ */
  function initParticles() {
    const canvas = document.getElementById("particle-field");
    if (!canvas) return;

    /* MEMORY OF SUMMER だけ、漂う光の粒も夕景の暖色に寄せる */
    const isSummerPage = document.body.classList.contains("page-summer");
    const particleFill = isSummerPage ? "255, 189, 138" : "174, 220, 255";
    const particleGlow = isSummerPage ? "255, 160, 92" : "120, 190, 255";

    const ctx = canvas.getContext("2d");
    let particles = [];
    let width = 0;
    let height = 0;
    let animationId = null;

    /* 画面サイズに合わせて Canvas を設定し、粒子を作り直す */
    function resize() {
      /* 高解像度ディスプレイでもぼやけないよう倍率を掛ける */
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createParticles();
    }

    /* 画面の広さに応じて粒子の数を決める(スマホでは少なく) */
    function createParticles() {
      const density = width < 768 ? 12000 : 7200;
      const count = Math.min(Math.floor((width * height) / density), 180);

      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(createParticle());
      }
    }

    function createParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        /* 大きさと速度に幅を持たせて奥行きを演出する */
        radius: Math.random() * 1.6 + 0.4,
        speedY: -(Math.random() * 0.28 + 0.06),
        speedX: (Math.random() - 0.5) * 0.14,
        /* 明滅の位相と速さ */
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.016 + 0.004,
        baseAlpha: Math.random() * 0.5 + 0.2
      };
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        /* 位置を更新(下から上へゆっくり昇る) */
        p.y += p.speedY;
        p.x += p.speedX;
        p.phase += p.phaseSpeed;

        /* 画面外へ出たら下から出し直す */
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        /* サイン波で明滅させる */
        const alpha = p.baseAlpha * (0.45 + 0.55 * Math.sin(p.phase));

        /* 粒子本体 */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleFill}, ${alpha})`;
        ctx.fill();

        /* 周囲のにじんだ光 */
        const glow = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.radius * 6
        );
        glow.addColorStop(0, `rgba(${particleGlow}, ${alpha * 0.35})`);
        glow.addColorStop(1, `rgba(${particleGlow}, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 6, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    }

    resize();

    /* 動きを減らす設定のときは静止画として1回だけ描く */
    if (prefersReducedMotion) {
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleFill}, ${p.baseAlpha})`;
        ctx.fill();
      });
    } else {
      draw();
    }

    /* リサイズ時は連続実行を避けるため少し待ってから作り直す */
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 220);
    });

    /* 他のタブに移ったら描画を止めて負荷を下げる */
    document.addEventListener("visibilitychange", () => {
      if (prefersReducedMotion) return;

      if (document.hidden) {
        if (animationId) cancelAnimationFrame(animationId);
        animationId = null;
      } else if (!animationId) {
        draw();
      }
    });
  }

  /* ------------------------------------------------------------
     2. カーソル位置に追従する光
     実際のマウス位置を目標に、少しずつ近づける(慣性のある動き)
     ------------------------------------------------------------ */
  function initCursorGlow() {
    const glow = document.getElementById("cursor-glow");
    if (!glow) return;

    /* タッチ操作が主な端末では動かさない */
    if (window.matchMedia("(hover: none)").matches) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    document.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      glow.classList.add("is-active");
    });

    /* 画面外に出たら消す */
    document.addEventListener("mouseleave", () => {
      glow.classList.remove("is-active");
    });

    function follow() {
      /* 目標との差の一部だけ動かすことで、なめらかに遅れて追従する */
      currentX += (targetX - currentX) * 0.09;
      currentY += (targetY - currentY) * 0.09;

      glow.style.transform = `translate(${currentX}px, ${currentY}px)`;
      requestAnimationFrame(follow);
    }

    follow();
  }

  /* ------------------------------------------------------------
     3. スクロール連動アニメーション
     .reveal が画面に入ったら .is-visible を付ける。
     同じフレームでまとめて入ってきた要素は上から順に少しずつ
     遅らせて、カード列がさざ波のように現れるようにする。
     見出しを含む塊が現れたときは、その位置から光の粒を弾けさせる。
     ------------------------------------------------------------ */
  function maybeSparkle(el) {
    if (prefersReducedMotion || typeof el.querySelector !== "function") return;

    const head = el.matches && el.matches(".section-title, .page-head__title")
      ? el
      : el.querySelector(".section-title, .page-head__title");
    if (!head) return;

    const r = head.getBoundingClientRect();
    if (r.width === 0 || r.top < 48 || r.top > window.innerHeight * 0.9) return;

    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const blue = document.body.classList.contains("page-summer")
      ? "255, 157, 92"
      : "154, 213, 255";
    burst(x, y, blue, 7);
    burst(x, y, "230, 213, 163", 4);
  }

  function initScrollReveal() {
    const targets = document.querySelectorAll(".reveal:not(.is-visible)");
    if (targets.length === 0) return;

    /* IntersectionObserver が使えない環境ではすべて表示しておく */
    if (!("IntersectionObserver" in window)) {
      document
        .querySelectorAll(".reveal")
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const shown = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        shown.forEach((entry, i) => {
          const el = entry.target;
          /* data-delay 指定がないものだけ、順番に応じて時間差をつける */
          if (i > 0 && !el.hasAttribute("data-delay")) {
            el.style.transitionDelay = Math.min(i * 0.06, 0.5) + "s";
          }
          el.classList.add("is-visible");
          maybeSparkle(el);
          /* 一度表示したら監視を外す(戻ったときに再生し直さない) */
          observer.unobserve(el);
        });
      },
      {
        /* 少し画面に入った時点で動き出す */
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.08
      }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------
     4. ページ遷移アニメーション
     サイト内リンクをクリックしたら光を広げてから移動する
     ------------------------------------------------------------ */
  function initPageTransition() {
    const overlay = document.getElementById("page-transition");
    if (!overlay) return;

    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");

      /* 外部リンク・ページ内リンク・新しいタブで開くものは対象外 */
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        link.target === "_blank" ||
        link.hasAttribute("download")
      ) {
        return;
      }

      /* 同じページへのリンクなら遷移しない */
      const current = window.location.pathname.split("/").pop() || "index.html";
      if (href === current) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      AudioEngine.play("transition");

      /* 動きを減らす設定のときは即座に移動する */
      if (prefersReducedMotion) {
        window.location.href = href;
        return;
      }

      try {
        sessionStorage.setItem("kh-nav", "1");
      } catch (err) {
        /* 保存できなくても遷移は行う */
      }
      overlay.classList.add("is-leaving");
      setTimeout(() => {
        window.location.href = href;
      }, 520);
    });

    /* サイト内リンクから来たときは、鍵穴が「開く」演出で迎える。
       暗幕は各ページの head 直後インラインで先に不透明化してあるので
       ここではアニメを乗せてから状態を戻すだけ */
    if (!prefersReducedMotion) {
      let fromSite = false;
      try {
        fromSite = sessionStorage.getItem("kh-nav") === "1";
        if (fromSite) sessionStorage.removeItem("kh-nav");
      } catch (err) {
        fromSite = false;
      }
      if (fromSite) {
        overlay.classList.add("is-arriving");
        setTimeout(() => {
          overlay.classList.remove("is-arriving");
          document.documentElement.classList.remove("kh-arrive");
        }, 720);
      } else {
        document.documentElement.classList.remove("kh-arrive");
      }
    }
  }

  /* ------------------------------------------------------------
     5. 指定した座標から光の粒を弾けさせる
     記憶の欠片を獲得したときなどに使う
     ------------------------------------------------------------ */
  function burst(x, y, color = "154, 213, 255", count = 14) {
    if (prefersReducedMotion) return;

    for (let i = 0; i < count; i++) {
      const dot = document.createElement("span");

      /* 中心から放射状に飛ばす方向と距離を決める */
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const distance = 40 + Math.random() * 70;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const size = 3 + Math.random() * 4;

      dot.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(${color}, 0.95);
        box-shadow: 0 0 12px rgba(${color}, 0.9);
        pointer-events: none;
        z-index: 860;
      `;

      document.body.appendChild(dot);

      /* Web Animations API でその場かぎりのアニメーションを実行 */
      const animation = dot.animate(
        [
          { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
          {
            transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`,
            opacity: 0
          }
        ],
        {
          duration: 700 + Math.random() * 450,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)"
        }
      );

      animation.onfinish = () => dot.remove();
    }
  }

  /* ------------------------------------------------------------
     5b. クリックした位置に光の輪を広げる(操作した実感を出す)
     ボタン・カード・リンクなど押せる要素を押したときに発生させる。
     記憶の欠片(data-fragment)は memory.js 側で専用の burst() を
     すでに鳴らしているので、ここでは対象から外して二重に光らせない
     ------------------------------------------------------------ */
  function spawnClickRing(x, y, color) {
    if (prefersReducedMotion) return;

    const ring = document.createElement("span");
    const size = 14;
    ring.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      margin: ${-size / 2}px 0 0 ${-size / 2}px;
      border-radius: 50%;
      border: 1.5px solid rgba(${color}, 0.85);
      box-shadow: 0 0 18px rgba(${color}, 0.5);
      pointer-events: none;
      z-index: 861;
    `;
    document.body.appendChild(ring);

    const animation = ring.animate(
      [
        { transform: "scale(1)", opacity: 0.9 },
        { transform: "scale(8)", opacity: 0 }
      ],
      { duration: 520, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );
    animation.onfinish = () => ring.remove();
  }

  function initClickEffects() {
    if (prefersReducedMotion) return;

    const selector =
      "a, button, .concept-card, .gateway, .work-card, .world-card, " +
      ".character-card, .crossover-card, .xscene-card, .theme-card, " +
      ".secret-scene, .glossary-item";

    document.addEventListener("click", (e) => {
      const target = e.target.closest(selector);
      if (!target || target.closest("[data-fragment]")) return;

      const color = document.body.classList.contains("page-summer")
        ? "255, 176, 112"
        : target.closest(".btn--gold")
        ? "230, 213, 163"
        : "154, 213, 255";

      spawnClickRing(e.clientX, e.clientY, color);
      burst(e.clientX, e.clientY, color, 6);
    });
  }

  /* ------------------------------------------------------------
     6. 背景をゆっくり漂うキングダムハーツのモチーフ
     王冠・交差するキーブレード・鍵穴・パオプの実などのシルエットが
     下から上へ流れていく。奥行きのある動きで画面に引きをつくる
     ------------------------------------------------------------ */
  function initDriftMotifs() {
    /* 動きを減らす設定のときは何も出さない */
    if (prefersReducedMotion) return;

    /* MEMORY OF SUMMER だけ、漂うモチーフも夕景の暖色に寄せる */
    const isSummerPage = document.body.classList.contains("page-summer");

    /* viewBox 0 0 100 100 のシルエット。塗り・線は currentColor で後から着色 */
    const SHAPES = [
      /* 王冠(ソラのペンダント) */
      `<path d="M12 36 31 54 50 22 69 54 88 36 80 78 20 78Z" fill="none"
             stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>
       <circle cx="12" cy="32" r="5" fill="currentColor"/>
       <circle cx="88" cy="32" r="5" fill="currentColor"/>
       <circle cx="50" cy="18" r="5" fill="currentColor"/>`,
      /* 交差するキーブレード */
      `<g fill="none" stroke="currentColor" stroke-width="5"
          stroke-linecap="round" stroke-linejoin="round">
         <path d="M22 84 74 26"/><circle cx="18" cy="88" r="5"/>
         <path d="M74 26h10v10M67 30l9 9"/>
         <path d="M78 84 26 26"/><circle cx="82" cy="88" r="5"/>
         <path d="M26 26H16v10M24 30l-9 9"/>
       </g>`,
      /* 鍵穴 */
      `<circle cx="50" cy="38" r="16" fill="none" stroke="currentColor" stroke-width="6"/>
       <path d="M43 52h14l6 30H37Z" fill="currentColor"/>`,
      /* パオプの実(五角の星) */
      `<path d="M50 10 61 40 92 40 67 59 76 90 50 71 24 90 33 59 8 40 39 40Z"
             fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>`,
      /* ハートに刻まれた鍵穴 */
      `<path d="M50 86C32 70 16 58 16 40A17 17 0 0 1 50 32A17 17 0 0 1 84 40C84 58 68 70 50 86Z"
             fill="none" stroke="currentColor" stroke-width="5"/>
       <circle cx="50" cy="46" r="6" fill="currentColor"/>
       <path d="M46 51h8l3 15H43Z" fill="currentColor"/>`,
      /* 六芒星(ダイブ・トゥ・ザ・ハート風) */
      `<g fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round">
         <path d="M50 12 84 71H16Z"/><path d="M50 88 16 29h68Z"/>
         <circle cx="50" cy="50" r="40" stroke-width="2" opacity="0.5"/>
       </g>`
    ];

    const layer = document.createElement("div");
    layer.className = "drift-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    const count = window.innerWidth < 720 ? 6 : 12;
    let hidden = document.hidden;

    /* 1つ流す。seeded=true なら途中から流れているように見せる */
    function spawn(seeded) {
      const el = document.createElement("div");
      el.className = "drift-motif";

      const size = 30 + Math.random() * 44;
      const gold = Math.random() < 0.24;

      el.style.left = 2 + Math.random() * 92 + "vw";
      el.style.width = size + "px";
      el.style.height = size + "px";
      el.style.color = gold
        ? "rgba(230, 213, 163, 0.9)"
        : isSummerPage
          ? "rgba(255, 157, 92, 0.9)"
          : "rgba(154, 213, 255, 0.9)";
      el.innerHTML =
        `<svg viewBox="0 0 100 100" aria-hidden="true">` +
        SHAPES[(Math.random() * SHAPES.length) | 0] +
        `</svg>`;

      layer.appendChild(el);

      const duration = 24000 + Math.random() * 22000;
      const rise = window.innerHeight + size + 160;
      const driftX = (Math.random() - 0.5) * 160;
      const spin = (Math.random() - 0.5) * 90;
      const peak = (gold ? 0.16 : 0.24) * (0.7 + Math.random() * 0.5);

      const anim = el.animate(
        [
          { transform: "translate3d(0, 24px, 0) rotate(0deg)", opacity: 0 },
          { opacity: peak, offset: 0.14 },
          { opacity: peak, offset: 0.82 },
          {
            transform: `translate3d(${driftX}px, ${-rise}px, 0) rotate(${spin}deg)`,
            opacity: 0
          }
        ],
        {
          duration: duration,
          easing: "linear",
          delay: seeded ? -Math.random() * duration : 0
        }
      );

      anim.onfinish = () => {
        el.remove();
        if (!hidden) spawn(false);
      };
    }

    for (let i = 0; i < count; i++) spawn(true);

    /* タブが非表示の間は増やさず、戻ったら不足分だけ補充する */
    document.addEventListener("visibilitychange", () => {
      hidden = document.hidden;
      if (hidden) return;
      for (let i = layer.childElementCount; i < count; i++) spawn(true);
    });
  }

  /* ------------------------------------------------------------
     7. サイドの装飾フレーム(HUD 風)
     左:縦レール＋目盛り＋ページ名 / 右:記憶の欠片12個の縦一列
     余白が十分にある画面幅でだけ表示する(CSS でも隠す)
     ------------------------------------------------------------ */
  function initSideFrame() {
    if (window.innerWidth < 1240) return;

    /* ファイル名 → 縦組みで出すページ名 */
    const PAGE_LABELS = {
      "index.html": "TOP",
      "album.html": "ALBUM",
      "timeline.html": "TIMELINE",
      "music.html": "THEMES",
      "roxas.html": "SUMMER",
      "crossover.html": "CROSSOVER",
      "secret.html": "SECRET"
    };
    const page = window.location.pathname.split("/").pop() || "index.html";
    const label = PAGE_LABELS[page] || "MEMORY";

    /* レールに沿った目盛り。3・7の位置だけ回転する菱形グリフにする */
    let ticks = "";
    for (let i = 1; i < 10; i++) {
      const cls = i === 3 || i === 7 ? "side-frame__glyph" : "side-frame__tick";
      ticks += `<span class="${cls}" style="top:${i * 10}%"></span>`;
    }

    /* --- 左:レール＋ページ名 --- */
    const left = document.createElement("div");
    left.className = "side-frame side-frame--left";
    left.setAttribute("aria-hidden", "true");
    left.innerHTML =
      `<span class="side-frame__cap"></span>` +
      `<div class="side-frame__rail"><span class="side-frame__spark"></span>${ticks}</div>` +
      `<span class="side-frame__label">${label}</span>` +
      `<span class="side-frame__cap side-frame__cap--filled"></span>`;

    /* --- 右:記憶の欠片 12個 --- */
    const fragments =
      typeof MEMORY_CONFIG !== "undefined" ? MEMORY_CONFIG.fragments : [];
    const dots = fragments
      .map((f) => `<span class="side-frame__dot" data-fragment-dot="${f.id}"></span>`)
      .join("");

    const right = document.createElement("div");
    right.className = "side-frame side-frame--right";
    right.setAttribute("aria-hidden", "true");
    right.innerHTML =
      `<span class="side-frame__cap"></span>` +
      `<div class="side-frame__rail"><span class="side-frame__spark"></span></div>` +
      `<div class="side-frame__fragments">${dots}</div>` +
      `<div class="side-frame__rail"></div>` +
      `<span class="side-frame__cap side-frame__cap--filled"></span>`;

    document.body.appendChild(left);
    document.body.appendChild(right);
  }

  /* ------------------------------------------------------------
     外部から呼び出す API
     ------------------------------------------------------------ */
  return {
    initAll() {
      initParticles();
      initCursorGlow();
      initScrollReveal();
      initPageTransition();
      initDriftMotifs();
      initSideFrame();
      initClickEffects();
    },
    /* ページ内で後から要素を追加したときに再監視する */
    refreshScrollReveal: initScrollReveal,
    burst,
    prefersReducedMotion
  };
})();
