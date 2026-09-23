/* ============================================================
   main.js — 全ページ共通の初期化処理
   ナビゲーション / 音声切り替え / ホバー音 / 各機能の起動
   ============================================================ */

(() => {
  /* ------------------------------------------------------------
     1. 現在のページをナビゲーションに反映する
     ------------------------------------------------------------ */
  function markCurrentPage() {
    const current = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-link").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === current) {
        link.classList.add("is-current");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ------------------------------------------------------------
     2. スマートフォン用のメニュー開閉
     ------------------------------------------------------------ */
  function initNavToggle() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".global-nav");
    if (!toggle || !nav) return;

    function closeNav() {
      toggle.classList.remove("is-open");
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    toggle.addEventListener("click", () => {
      const willOpen = !toggle.classList.contains("is-open");

      toggle.classList.toggle("is-open", willOpen);
      nav.classList.toggle("is-open", willOpen);
      toggle.setAttribute("aria-expanded", String(willOpen));

      /* メニューを開いている間は背面をスクロールさせない */
      document.body.style.overflow = willOpen ? "hidden" : "";

      AudioEngine.play("click");
    });

    /* メニュー内のリンクを押したら閉じる */
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    /* 暗幕(ナビの余白)を押しても閉じる。リンク自体は上の処理に任せる */
    nav.addEventListener("click", (e) => {
      if (e.target === nav) closeNav();
    });

    /* Escape キーでも閉じられるようにする */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav();
      }
    });

    /* ハンバーガーを出す幅より広くなったら、開いたままにせず必ず閉じる
       (開いた状態でウィンドウを広げると body のスクロールが固まるのを防ぐ) */
    const mq = window.matchMedia("(max-width: 1120px)");
    const onChange = () => {
      if (!mq.matches) closeNav();
    };
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
    } else if (typeof mq.addListener === "function") {
      mq.addListener(onChange);
    }
  }

  /* ------------------------------------------------------------
     3. 音声の ON / OFF ボタン
     ------------------------------------------------------------ */
  function initAudioToggle() {
    const enabled = AudioEngine.init();

    const buttons = document.querySelectorAll(".audio-toggle");

    function syncButtons(state) {
      buttons.forEach((btn) => {
        btn.classList.toggle("is-on", state);
        btn.setAttribute("aria-pressed", String(state));
        btn.setAttribute(
          "aria-label",
          state ? "音声をオフにする" : "音声をオンにする"
        );
      });
    }

    syncButtons(enabled);

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const state = AudioEngine.toggle();
        syncButtons(state);
      });
    });

    /* 前回 ON にしていた場合、最初の操作で音を復帰させる */
    if (enabled) {
      const resume = () => {
        AudioEngine.resumeIfEnabled();
        document.removeEventListener("click", resume);
        document.removeEventListener("keydown", resume);
      };
      document.addEventListener("click", resume);
      document.addEventListener("keydown", resume);
    }
  }

  /* ------------------------------------------------------------
     4. ホバー音・クリック音を共通で割り当てる
     ------------------------------------------------------------ */
  function initInteractionSounds() {
    /* 音を鳴らしたい要素をまとめて選ぶ */
    const selector =
      ".btn, .nav-link, .gateway, .work-card, .character-card, " +
      ".filter-btn, .concept-card, .audio-toggle, .footer-nav a";

    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener("mouseenter", () => AudioEngine.play("hover"));
    });

    /* ボタン類のクリック音(ページ遷移リンクは遷移音が鳴るので除外) */
    document.querySelectorAll("button.btn, .filter-btn").forEach((el) => {
      el.addEventListener("click", () => AudioEngine.play("click"));
    });
  }

  /* ------------------------------------------------------------
     5. スクロール量に応じてヘッダーの見た目を変える
     ------------------------------------------------------------ */
  function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    function update() {
      /* 少しでもスクロールしたら背景を濃くする */
      const scrolled = window.scrollY > 40;
      header.style.background = scrolled
        ? "rgba(3, 6, 13, 0.9)"
        : "linear-gradient(180deg, rgba(3,6,13,0.92), rgba(3,6,13,0.6) 70%, transparent)";
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ------------------------------------------------------------
     5b. 「トップへ戻る」ボタン
     長いページで一定量スクロールしたら右下に現れる
     ------------------------------------------------------------ */
  function initBackToTop() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "to-top";
    btn.setAttribute("aria-label", "ページの先頭へ戻る");
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 19V6M6 12l6-6 6 6"/></svg>';
    document.body.appendChild(btn);

    const smooth = !(Effects && Effects.prefersReducedMotion);
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
      if (typeof AudioEngine !== "undefined") AudioEngine.play("click");
    });

    function update() {
      btn.classList.toggle("is-visible", window.scrollY > 640);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ------------------------------------------------------------
     5c. TOP ヒーローの視差(カーソルに合わせて台座が奥行きで動く)
     TOP 以外・タッチ端末・動きを減らす設定では何もしない
     ------------------------------------------------------------ */
  function initHeroParallax() {
    const hero = document.querySelector(".hero");
    if (!hero || !hero.querySelector(".hero__station")) return;
    if (typeof Effects !== "undefined" && Effects.prefersReducedMotion) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = null;

    function loop() {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      hero.style.setProperty("--px", (cx * -28).toFixed(1) + "px");
      hero.style.setProperty("--py", (cy * -28).toFixed(1) + "px");
      hero.style.setProperty("--px2", (cx * 16).toFixed(1) + "px");
      hero.style.setProperty("--py2", (cy * 16).toFixed(1) + "px");

      if (Math.abs(tx - cx) > 0.0004 || Math.abs(ty - cy) > 0.0004) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }
    function kick() {
      if (!raf) raf = requestAnimationFrame(loop);
    }

    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      kick();
    });
    hero.addEventListener("mouseleave", () => {
      tx = 0;
      ty = 0;
      kick();
    });
  }

  /* ------------------------------------------------------------
     6. 記憶の欠片の確認ビュー
     ヘッダーの「◈ n / 12」を押すと、12個の一覧をモーダルで開く。
     未取得の欠片は名前を伏せ、隠れているページだけをヒントに出す
     ------------------------------------------------------------ */
  function initMemoryLog() {
    const counter = document.querySelector(".memory-counter");
    if (!counter || typeof MEMORY_CONFIG === "undefined") return;

    const PAGE_HINT = {
      TOP: "TOP",
      ALBUM: "MEMORY ALBUM",
      TIMELINE: "TIMELINE",
      THEMES: "MEMORY THEMES",
      CROSSOVER: "MEMORY CROSSOVER",
      SECRET: "SECRET MEMORY"
    };

    /* ページごとの欠片の総数(例:「TOP 3個」)を、fragments のデータから毎回集計する */
    function pageCountSummary() {
      const counts = {};
      const order = [];
      MEMORY_CONFIG.fragments.forEach((f) => {
        if (!(f.page in counts)) {
          counts[f.page] = 0;
          order.push(f.page);
        }
        counts[f.page] += 1;
      });
      return order
        .map((page) => (PAGE_HINT[page] || page) + " " + counts[page] + "個")
        .join(" ・ ");
    }

    /* モーダルの器(既存の .modal コンポーネントの見た目を流用) */
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "memory-log-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "memory-log-title");
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML =
      '<div class="modal__dialog">' +
      '  <button class="modal__close" type="button" aria-label="閉じる">' +
      '    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>' +
      "  </button>" +
      '  <div id="memory-log-body"></div>' +
      "</div>";
    document.body.appendChild(modal);

    const body = modal.querySelector("#memory-log-body");
    const closeBtn = modal.querySelector(".modal__close");
    let lastFocused = null;

    function render() {
      const count = MemorySystem.getCount();
      const total = MemorySystem.getTotal();
      const remaining = Math.max(MemorySystem.threshold - count, 0);
      const unlocked = MemorySystem.isUnlocked();

      const status = unlocked
        ? "SECRET MEMORY は解放されています"
        : "SECRET MEMORY 解放まで あと " + remaining + " 個";

      const rows = MEMORY_CONFIG.fragments
        .map((f) => {
          const found = MemorySystem.has(f.id);
          const cls =
            "memory-log__item" +
            (found ? " is-found" : "") +
            (found && unlocked ? " is-gold" : "");
          const name = found ? f.name : "？ ？ ？ ？ ？";
          const page = PAGE_HINT[f.page] || f.page;
          return (
            '<li class="' + cls + '">' +
            '<span class="memory-log__mark"></span>' +
            '<span class="memory-log__name">' + name + "</span>" +
            '<span class="memory-log__page">' + page + "</span>" +
            "</li>"
          );
        })
        .join("");

      body.innerHTML =
        '<span class="modal__label">Memory Fragments</span>' +
        '<h2 class="modal__title" id="memory-log-title">記憶の欠片</h2>' +
        '<p class="modal__subtitle">' + count + " / " + total + " ―― " + status + "</p>" +
        '<ul class="memory-log__list">' + rows + "</ul>" +
        '<p class="memory-log__note">' + pageCountSummary() + "<br>" +
        "作品やキャラクターの詳細を開いた先にも、まだ見ぬ光があるかもしれません。</p>";
    }

    function open() {
      lastFocused = document.activeElement;
      render();
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      AudioEngine.play("open");
      closeBtn.focus();
    }

    function close() {
      if (!modal.classList.contains("is-open")) return;
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      AudioEngine.play("close");
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    }

    /* カウンターを押せる要素にする */
    counter.setAttribute("role", "button");
    counter.setAttribute("tabindex", "0");
    counter.setAttribute("aria-haspopup", "dialog");
    counter.setAttribute("title", "集めた記憶の欠片を確認する");

    counter.addEventListener("click", open);
    counter.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
    counter.addEventListener("mouseenter", () => AudioEngine.play("hover"));

    closeBtn.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });
  }

  /* ------------------------------------------------------------
     7. 起動
     ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    markCurrentPage();
    initNavToggle();
    initAudioToggle();
    initHeaderScroll();
    initBackToTop();
    initHeroParallax();

    Effects.initAll();
    MemorySystem.init();
    initMemoryLog();

    /* 音の割り当ては、他の初期化で要素が揃ってから行う */
    initInteractionSounds();
  });
})();
