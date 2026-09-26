/* ============================================================
   memory.js — 記憶の欠片の収集システム
   収集状況を localStorage に保存し、
   一定数を集めると SECRET MEMORY を解放する
   ============================================================ */

const MemorySystem = (() => {
  /* 収集済みの欠片 id を保持する集合 */
  let collected = new Set();

  /* ------------------------------------------------------------
     1. 保存と読み込み
     localStorage が使えない環境でも動くよう try/catch で囲む
     ------------------------------------------------------------ */
  function load() {
    try {
      const raw = localStorage.getItem(MEMORY_CONFIG.storageKey);
      if (!raw) return new Set();

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return new Set();

      /* 定義に存在しない id が保存されていても無視する */
      const validIds = MEMORY_CONFIG.fragments.map((f) => f.id);
      return new Set(parsed.filter((id) => validIds.includes(id)));
    } catch (e) {
      return new Set();
    }
  }

  function save() {
    try {
      localStorage.setItem(
        MEMORY_CONFIG.storageKey,
        JSON.stringify(Array.from(collected))
      );
    } catch (e) {
      /* 保存できなくてもその場の動作は継続する */
    }
  }

  /* ------------------------------------------------------------
     2. 状態の問い合わせ
     ------------------------------------------------------------ */
  function getCount() {
    return collected.size;
  }

  function getTotal() {
    return MEMORY_CONFIG.fragments.length;
  }

  function has(id) {
    return collected.has(id);
  }

  function isUnlocked() {
    return collected.size >= MEMORY_CONFIG.unlockThreshold;
  }

  /* ------------------------------------------------------------
     3. 通知トーストの表示
     ------------------------------------------------------------ */
  function showToast(message, variant = "blue") {
    let area = document.querySelector(".toast-area");

    /* 表示領域が無ければ作る */
    if (!area) {
      area = document.createElement("div");
      area.className = "toast-area";
      document.body.appendChild(area);
    }

    const toast = document.createElement("div");
    toast.className = "toast" + (variant === "gold" ? " toast--gold" : "");
    toast.setAttribute("role", "status");

    /* ひし形のアイコンとメッセージ */
    toast.innerHTML = `
      <svg class="toast__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2 22 12 12 22 2 12Z"/>
      </svg>
      <span></span>
    `;
    /* 文字列は textContent で入れて安全に扱う */
    toast.querySelector("span").textContent = message;

    area.appendChild(toast);

    /* 一定時間後に消す */
    setTimeout(() => {
      toast.classList.add("is-out");
      setTimeout(() => toast.remove(), 500);
    }, variant === "gold" ? 4200 : 2800);
  }

  /* ------------------------------------------------------------
     4. ヘッダーのカウンタ表示を更新する
     ------------------------------------------------------------ */
  function updateCounter(animate = false) {
    const counters = document.querySelectorAll("[data-memory-count]");
    const count = getCount();
    const total = getTotal();

    counters.forEach((el) => {
      el.textContent = `${count} / ${total}`;

      if (animate) {
        const wrapper = el.closest(".memory-counter");
        if (wrapper) {
          wrapper.classList.remove("is-gained");
          /* いったん再描画させてからクラスを付け直し、再生し直す */
          void wrapper.offsetWidth;
          wrapper.classList.add("is-gained");
        }
      }
    });

    /* 進捗バーがあれば一緒に更新する */
    document.querySelectorAll("[data-memory-bar]").forEach((bar) => {
      const percent = (count / total) * 100;
      bar.style.width = percent + "%";
      bar.classList.toggle("is-complete", isUnlocked());
    });

    /* 進捗の数値表示 */
    document.querySelectorAll("[data-memory-value]").forEach((el) => {
      el.textContent = `${count} / ${total}`;
    });

    /* 解放までの残り数 */
    document.querySelectorAll("[data-memory-remaining]").forEach((el) => {
      const remaining = Math.max(MEMORY_CONFIG.unlockThreshold - count, 0);
      el.textContent = String(remaining);
    });

    /* サイドフレームの欠片インジケーター(1個=1菱形) */
    document.querySelectorAll("[data-fragment-dot]").forEach((dot) => {
      dot.classList.toggle("is-collected", collected.has(dot.dataset.fragmentDot));
    });
    document.querySelectorAll(".side-frame__fragments").forEach((wrap) => {
      wrap.classList.toggle("is-complete", isUnlocked());
    });
  }

  /* ------------------------------------------------------------
     5. ナビゲーションの SECRET MEMORY 表示を切り替える
     ------------------------------------------------------------ */
  function updateSecretLinks() {
    const unlocked = isUnlocked();

    document.querySelectorAll("[data-secret-link]").forEach((link) => {
      link.classList.toggle("is-unlocked", unlocked);
      link.classList.toggle("is-locked", !unlocked);
    });

    /* TOP ページの導線カード */
    document.querySelectorAll("[data-secret-gateway]").forEach((card) => {
      card.classList.toggle("gateway--locked", !unlocked);

      const status = card.querySelector("[data-secret-status]");
      if (status) {
        status.textContent = unlocked ? "UNLOCKED" : "LOCKED";
      }
    });
  }

  /* ------------------------------------------------------------
     6. 欠片を獲得する
     ------------------------------------------------------------ */
  function collect(id, element) {
    /* 既に持っている場合は何もしない */
    if (collected.has(id)) return false;

    const fragment = MEMORY_CONFIG.fragments.find((f) => f.id === id);
    if (!fragment) return false;

    /* 解放前だったかどうかを、追加する前に記録しておく */
    const wasUnlocked = isUnlocked();

    collected.add(id);
    save();

    /* 獲得エフェクト:欠片の位置から光を弾けさせる */
    if (element) {
      const rect = element.getBoundingClientRect();
      Effects.burst(rect.left + rect.width / 2, rect.top + rect.height / 2);
      element.classList.add("is-collected");
      /* アニメーションが終わったら完全に隠す */
      setTimeout(() => element.classList.add("is-hidden"), 800);
    }

    AudioEngine.play("collect");
    updateCounter(true);
    updateSecretLinks();

    showToast(KH_I18N.t("memoryLog.foundToast", { name: KH_I18N.pick(fragment, "name") }));

    /* この獲得で条件を満たしたら解放を知らせる */
    if (!wasUnlocked && isUnlocked()) {
      setTimeout(() => {
        AudioEngine.play("unlock");
        showToast(KH_I18N.t("memoryLog.unlockedToast"), "gold");
      }, 1200);
    }

    return true;
  }

  /* ------------------------------------------------------------
     7. ページ上の欠片を初期化する
     data-fragment 属性を持つ要素にクリック処理を割り当てる
     ------------------------------------------------------------ */
  function initFragments() {
    document.querySelectorAll("[data-fragment]").forEach((el) => {
      const id = el.dataset.fragment;

      /* 収集済みなら最初から表示しない */
      if (collected.has(id)) {
        el.classList.add("is-hidden");
        return;
      }

      /* 既に処理済みの要素は飛ばす(モーダル追加時の二重登録を防ぐ) */
      if (el.dataset.fragmentReady === "1") return;
      el.dataset.fragmentReady = "1";

      /* キーボードでも取得できるようにする */
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.setAttribute("aria-label", "記憶の欠片を集める");

      el.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        collect(id, el);
      });

      el.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        collect(id, el);
      });

      el.addEventListener("mouseenter", () => AudioEngine.play("hover"));
    });
  }

  /* ------------------------------------------------------------
     8. 収集記録をすべて消す
     ------------------------------------------------------------ */
  function reset() {
    collected = new Set();
    try {
      localStorage.removeItem(MEMORY_CONFIG.storageKey);
    } catch (e) {
      /* 消せなくても続行する */
    }

    updateCounter();
    updateSecretLinks();
  }

  /* ------------------------------------------------------------
     外部から呼び出す API
     ------------------------------------------------------------ */
  return {
    init() {
      collected = load();
      updateCounter();
      updateSecretLinks();
      initFragments();
    },
    collect,
    /* 後から追加された欠片(モーダル内など)を有効化する */
    refresh: initFragments,
    getCount,
    getTotal,
    has,
    isUnlocked,
    reset,
    showToast,
    get threshold() {
      return MEMORY_CONFIG.unlockThreshold;
    }
  };
})();
