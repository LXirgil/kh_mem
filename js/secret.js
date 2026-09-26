/* ============================================================
   secret.js — SECRET MEMORY ページの制御
   解放条件を満たしているかで表示を切り替える
   ============================================================ */

(() => {
  /* 初めてこのページを解放したかどうかを記録するキー */
  const SEEN_KEY = "kh-secret-seen";

  /* 画像読み込み失敗時の差し替え(鍵穴プレースホルダー) */
  const SCENE_IMG_FALLBACK =
    "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20160%2090'%3E" +
    "%3Crect%20width='160'%20height='90'%20fill='%23070f21'/%3E" +
    "%3Cpath%20d='M80%2062C71%2054%2063%2048%2063%2040A9%209%200%200%201%2080%2036A9%209%200%200%201%2097%2040C97%2048%2089%2054%2080%2062Z'%20fill='none'%20stroke='%234da6ff'%20stroke-width='3'/%3E" +
    "%3Ccircle%20cx='80'%20cy='43'%20r='4'%20fill='%234da6ff'/%3E%3C/svg%3E";

  function hasSeenBefore() {
    try {
      return localStorage.getItem(SEEN_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function markAsSeen() {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch (e) {
      /* 保存できなくても動作に支障はない */
    }
  }

  /* ------------------------------------------------------------
     集めた欠片の一覧を組み立てる
     ------------------------------------------------------------ */
  function buildShardGrid() {
    return MEMORY_CONFIG.fragments
      .map((fragment) => {
        const owned = MemorySystem.has(fragment.id);
        /* 未取得のものは名前を伏せる */
        const name = owned ? KH_I18N.pick(fragment, "name") : "？？？";

        return `
          <div class="shard-cell ${owned ? "is-owned" : ""}">
            <span class="shard-cell__mark"></span>
            <span class="shard-cell__name">${name}</span>
          </div>
        `;
      })
      .join("");
  }

  /* ------------------------------------------------------------
     キャラクター相関図を SVG として組み立てる
     ------------------------------------------------------------ */
  function relNode(id) {
    return RELATION_MAP.nodes.find((n) => n.id === id);
  }

  /* 矢印の先端(marker)。色ごとに用意する。曲線パスに合わせて orient=auto */
  const RMAP_DEFS =
    '<defs>' +
    '<marker id="rmap-head-gold" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7.5" markerHeight="7.5" orient="auto-start-reverse">' +
    '<path d="M0 0 L10 5 L0 10 z" fill="rgba(230,213,163,0.95)"/></marker>' +
    '<marker id="rmap-head-red" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7.5" markerHeight="7.5" orient="auto-start-reverse">' +
    '<path d="M0 0 L10 5 L0 10 z" fill="rgba(255,128,128,1)"/></marker>' +
    /* どの <image> にも使える円形クリップ(objectBoundingBox = 画像の外接矩形基準) */
    '<clipPath id="rmap-avatar-clip" clipPathUnits="objectBoundingBox">' +
    '<circle cx="0.5" cy="0.5" r="0.5"/></clipPath>' +
    '</defs>';

  /* アバター(顔画像)の半径 */
  const AV_R = 30;

  /* 中心(この座標から離れる向きに線を弧を描かせる) */
  const RMAP_CX = 660;
  const RMAP_CY = 460;

  function buildRelationMap() {
    /* --- 1. 線の上に重ねる「抜き」。顔画像の下に敷き、線がアイコンの
           きわを通っても余白でスッと切れて見えるようにする --- */
    const halos = RELATION_MAP.nodes
      .map(
        (n) =>
          `<circle class="rmap-halo" cx="${n.x}" cy="${n.y}" r="${AV_R + 7}"/>`
      )
      .join("");

    /* --- 2. 線(すべて緩やかな曲線)。矢印つき。ラベルは後で最前面に描く --- */
    const labelParts = [];
    const links = RELATION_MAP.links
      .map((lk) => {
        const a = relNode(lk.from);
        const b = relNode(lk.to);
        if (!a || !b) return "";

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;

        /* 端を顔アイコンの縁ぶんだけ詰める(円なので向きによらず一定) */
        const extA = AV_R + 10;
        const extB = AV_R + 14;
        const x1 = a.x + ux * extA;
        const y1 = a.y + uy * extA;
        const x2 = b.x - ux * extB;
        const y2 = b.y - uy * extB;

        /* 制御点:bow 指定があればその向き・量、無ければ中心から離れる向きに自動 */
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        let nx = -uy; // 線に垂直な方向
        let ny = ux;
        let bow;
        if (typeof lk.bow === "number") {
          bow = lk.bow;
        } else {
          /* 中心を向いていたら反転して、外側へ膨らませる */
          if (nx * (RMAP_CX - mx) + ny * (RMAP_CY - my) > 0) {
            nx = -nx;
            ny = -ny;
          }
          bow = Math.min(len * 0.16, 46);
        }
        const cx = mx + nx * bow;
        const cy = my + ny * bow;

        let markers = "";
        if (lk.type === "origin") markers = ' marker-end="url(#rmap-head-gold)"';
        else if (lk.type === "clash") markers = ' marker-end="url(#rmap-head-red)"';
        else if (lk.type === "axis")
          markers =
            ' marker-start="url(#rmap-head-red)" marker-end="url(#rmap-head-red)"';

        const d =
          "M " + r(x1) + " " + r(y1) +
          " Q " + r(cx) + " " + r(cy) + " " + r(x2) + " " + r(y2);

        const linkLabel = KH_I18N.pick(lk, "label");
        if (linkLabel) {
          /* 曲線の中点(t=0.5)。弧の膨らむ向きへ少しずらして線からも離す */
          const sign = bow >= 0 ? 1 : -1;
          labelParts.push({
            text: linkLabel,
            lx: 0.25 * x1 + 0.5 * cx + 0.25 * x2 + nx * sign * 9,
            ly: 0.25 * y1 + 0.5 * cy + 0.25 * y2 + ny * sign * 9,
            w: linkLabel.length * 12 + 14
          });
        }

        return `<path class="rmap-link rmap-link--${lk.type}" d="${d}"${markers}/>`;
      })
      .join("");

    /* --- 2b. ラベルどうしの重なりをほぐす(縦方向に押し離す) --- */
    const LABEL_H = 22;
    for (let pass = 0; pass < 60; pass += 1) {
      let moved = false;
      for (let i = 0; i < labelParts.length; i += 1) {
        for (let j = i + 1; j < labelParts.length; j += 1) {
          const p = labelParts[i];
          const q = labelParts[j];
          const ox = (p.w + q.w) / 2 + 6 - Math.abs(p.lx - q.lx);
          const oy = LABEL_H + 4 - Math.abs(p.ly - q.ly);
          if (ox > 0 && oy > 0) {
            const push = Math.min(oy / 2, 3);
            if (p.ly <= q.ly) {
              p.ly -= push;
              q.ly += push;
            } else {
              p.ly += push;
              q.ly -= push;
            }
            moved = true;
          }
        }
      }
      if (!moved) break;
    }
    const labelSvg = labelParts
      .map(
        (p) =>
          `<rect class="rmap-label-bg" x="${r(p.lx - p.w / 2)}" y="${r(p.ly - 11)}" width="${p.w}" height="22" rx="5"/>` +
          `<text class="rmap-label" x="${r(p.lx)}" y="${r(p.ly + 1)}">${p.text}</text>`
      )
      .join("");

    /* --- 3. ノード(顔画像の丸アイコン＋下に名前) --- */
    const nodes = RELATION_MAP.nodes
      .map((n) => {
        const cls =
          "rmap-node rmap-node--" + n.side + (n.hub ? " is-hub" : "");
        const label = KH_I18N.pick(n, "label");
        const lw = label.length * 13 + 16;
        const face = n.img
          ? `<image href="${n.img}" x="${n.x - AV_R}" y="${n.y - AV_R}" ` +
            `width="${AV_R * 2}" height="${AV_R * 2}" ` +
            `clip-path="url(#rmap-avatar-clip)" preserveAspectRatio="xMidYMid slice"/>` +
            `<circle class="rmap-node__edge" cx="${n.x}" cy="${n.y}" r="${AV_R}"/>`
          : `<circle class="rmap-node__edge is-blank" cx="${n.x}" cy="${n.y}" r="${AV_R}"/>` +
            `<text class="rmap-node__ini" x="${n.x}" y="${n.y + 1}">${label.slice(0, 1)}</text>`;
        return (
          `<g class="${cls}">` +
          `<circle class="rmap-node__plate" cx="${n.x}" cy="${n.y}" r="${AV_R + 2}"/>` +
          face +
          `<rect class="rmap-node__labelbg" x="${r(n.x - lw / 2)}" y="${n.y + AV_R + 5}" width="${lw}" height="20" rx="10"/>` +
          `<text class="rmap-node__label" x="${n.x}" y="${n.y + AV_R + 19}">${label}</text>` +
          "</g>"
        );
      })
      .join("");

    return `
      <div class="relation-wrap">
        <svg class="relation-map" viewBox="0 0 1320 880" role="img"
             aria-label="キングダムハーツ 主要人物の相関図">
          ${RMAP_DEFS}
          <rect class="rmap-bg" x="0" y="0" width="1320" height="880" rx="16"/>
          <g>${links}</g>
          <g>${halos}</g>
          <g>${nodes}</g>
          <g>${labelSvg}</g>
        </svg>
      </div>
      <div class="relation-legend" aria-hidden="true">
        <span><i class="rl rl--bond"></i>${KH_I18N.t("secret.relations.legend.bond")}</span>
        <span><i class="rl rl--origin"></i>${KH_I18N.t("secret.relations.legend.origin")}</span>
        <span><i class="rl rl--clash"></i>${KH_I18N.t("secret.relations.legend.clash")}</span>
        <span><i class="rl rl--axis"></i>${KH_I18N.t("secret.relations.legend.axis")}</span>
      </div>`;
  }

  /* 座標を短い文字列に(小数1桁) */
  function r(v) {
    return Math.round(v * 10) / 10;
  }

  /* 相関の要点を文章でも添える */
  function buildRelationNotes() {
    const notes = [
      [KH_I18N.t("secret.relations.note1.title"), KH_I18N.t("secret.relations.note1.text")],
      [KH_I18N.t("secret.relations.note2.title"), KH_I18N.t("secret.relations.note2.text")],
      [KH_I18N.t("secret.relations.note3.title"), KH_I18N.t("secret.relations.note3.text")],
      [KH_I18N.t("secret.relations.note4.title"), KH_I18N.t("secret.relations.note4.text")]
    ];
    return (
      '<ul class="relation-notes">' +
      notes
        .map((n) => `<li><strong>${n[0]}</strong><span>${n[1]}</span></li>`)
        .join("") +
      "</ul>"
    );
  }

  /* ------------------------------------------------------------
     「記憶に残る、場面」ギャラリー
     画像は各自で assets/scenes/<id>.jpg に置く。未設置ならファイル名を表示
     ------------------------------------------------------------ */
  function sceneWorkTitle(id) {
    if (typeof WORKS === "undefined") return "";
    const w = WORKS.find((x) => x.id === id);
    return w ? w.title : "";
  }

  function buildSceneGallery() {
    if (typeof SECRET_SCENES === "undefined" || !SECRET_SCENES.length) return "";

    const cards = SECRET_SCENES.map((s, i) => {
      const media = s.image
        ? `<img class="secret-scene__img" src="${s.image}" alt="${s.title || s.id}" loading="lazy"` +
          ` onerror="this.onerror=null;this.src='${SCENE_IMG_FALLBACK}'">`
        : `<span class="secret-scene__ph">画像を <code>assets/scenes/${s.id}.jpg</code> に置くと表示されます</span>`;
      const work = sceneWorkTitle(s.work);
      const title = KH_I18N.pick(s, "title") || (s.image ? "(この場面の説明を追記します)" : "");
      const caption = KH_I18N.pick(s, "caption");
      const cap = title
        ? `
            ${work ? `<span class="secret-scene__work">${work}</span>` : ""}
            <span class="secret-scene__title">${title}</span>
            ${caption ? `<span class="secret-scene__note">${caption}</span>` : ""}`
        : `<span class="secret-scene__note">${s.id}</span>`;
      return `
        <figure class="secret-scene reveal${s.image ? "" : " is-empty"}" data-delay="${(i % 3) + 1}">
          <div class="secret-scene__frame">${media}</div>
          <figcaption class="secret-scene__cap">${cap}</figcaption>
        </figure>`;
    }).join("");

    return `<div class="secret-scenes">${cards}</div>`;
  }

  /* ------------------------------------------------------------
     解放後の中身を描画する
     ------------------------------------------------------------ */
  function renderContent(container) {
    const core = KH_CORE.map(
      (item, index) => `
        <article class="secret-panel reveal" data-delay="${(index % 4) + 1}">
          <span class="secret-panel__label">${item.label}</span>
          <h3 class="secret-panel__title">${KH_I18N.pick(item, "title")}</h3>
          <p class="secret-panel__text">${KH_I18N.pick(item, "text")}</p>
        </article>
      `
    ).join("");

    container.innerHTML = `
      <!-- ページ見出し -->
      <div class="page-head" style="padding-block:0 var(--space-lg);">
        <span class="section-label">Secret Memory</span>
        <h1 class="page-head__title gold-text">SECRET MEMORY</h1>
        <p class="page-head__lead">${KH_I18N.t("secret.unlocked.lead")}</p>
      </div>

      <!-- シリーズの根幹 -->
      <div class="secret-block">
        <div class="reveal">
          <span class="section-label">The Core</span>
          <h2 class="section-title">${KH_I18N.t("secret.core.title")}</h2>
          <p class="section-lead">
            ${KH_I18N.t("secret.core.lead")}
          </p>
        </div>
        ${core}
      </div>

      <hr class="divider">

      <!-- キャラクター相関図 -->
      <div class="secret-block reveal">
        <div>
          <span class="section-label">Relations</span>
          <h2 class="section-title">${KH_I18N.t("secret.relations.title")}</h2>
          <p class="section-lead">
            ${KH_I18N.t("secret.relations.lead")}
          </p>
        </div>
        ${buildRelationMap()}
        ${buildRelationNotes()}
      </div>

      <hr class="divider">

      <!-- 集めた欠片の一覧 -->
      <section class="panel reveal">
        <span class="section-label">Collected Fragments</span>
        <h2 class="section-title" style="font-size:clamp(1.2rem,3vw,1.6rem);">
          ${KH_I18N.t("secret.collected.title")}
        </h2>

        <div class="progress" style="max-width:100%;">
          <div class="progress__head">
            <span>MEMORY FRAGMENTS</span>
            <span class="progress__value" data-memory-value>0 / 12</span>
          </div>
          <div class="progress__track">
            <div class="progress__bar" data-memory-bar></div>
          </div>
        </div>

        <div class="shard-grid">
          ${buildShardGrid()}
        </div>
      </section>

      <hr class="divider">

      <!-- 記憶に残る、場面 -->
      <div class="secret-block reveal">
        <div>
          <span class="section-label">Scenes</span>
          <h2 class="section-title">${KH_I18N.t("secret.scenes.title")}</h2>
          <p class="section-lead">
            ${KH_I18N.t("secret.scenes.lead")}
          </p>
        </div>
        ${buildSceneGallery()}
      </div>

      <!-- 最後の欠片(ここまで辿り着いた人への一片) -->
      <section class="secret-panel reveal" style="text-align:center;">
        <span class="secret-panel__label">The Last Fragment</span>
        <h2 class="secret-panel__title">${KH_I18N.t("secret.last.title")}</h2>
        <p class="secret-panel__text" style="max-width:34em; margin-inline:auto;">
          ${KH_I18N.t("secret.last.text")}
        </p>
        <div style="display:flex; justify-content:center; margin-top:2rem;">
          <div class="fragment" data-fragment="f12">
            <div class="fragment__shard"></div>
          </div>
        </div>
      </section>

      <!-- 記録のリセット -->
      <div class="reset-row">
        <button class="reset-btn" type="button" id="reset-memory">
          ${KH_I18N.t("secret.reset.button")}
        </button>
      </div>
    `;
  }

  /* ------------------------------------------------------------
     リセットボタンの処理
     ------------------------------------------------------------ */
  function initReset() {
    const btn = document.getElementById("reset-memory");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const ok = window.confirm(KH_I18N.t("secret.reset.confirm"));
      if (!ok) return;

      MemorySystem.reset();

      try {
        localStorage.removeItem(SEEN_KEY);
      } catch (e) {
        /* 消せなくても続行する */
      }

      /* 施錠状態に戻すため、ページを読み込み直す */
      window.location.reload();
    });
  }

  /* ------------------------------------------------------------
     起動
     ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    const lock = document.getElementById("secret-lock");
    const content = document.getElementById("secret-content");
    const flash = document.getElementById("secret-flash");

    if (!lock || !content) return;

    /* まだ条件を満たしていない場合は施錠画面のまま */
    if (!MemorySystem.isUnlocked()) {
      content.style.display = "none";
      lock.style.display = "";
      return;
    }

    /* --- ここから解放後の処理 --- */
    lock.style.display = "none";
    content.style.display = "";

    renderContent(content);

    /* 描画後の要素に、演出と欠片の機能を適用する。
       init() は進捗バーの数値反映と欠片の登録をまとめて行う */
    Effects.refreshScrollReveal();
    MemorySystem.init();

    initReset();

    /* 初めて解放したときだけ、特別な演出を行う */
    if (!hasSeenBefore()) {
      markAsSeen();

      if (flash && !Effects.prefersReducedMotion) {
        flash.classList.add("is-firing");
      }

      AudioEngine.play("unlock");

      setTimeout(() => {
        MemorySystem.showToast(KH_I18N.t("secret.toast.unlocked"), "gold");
      }, 900);
    }

    /* 言語切り替え時は解放済みページを描き直す(解放前ロック画面の文言は
       [data-i18n] で main.js 側から処理されるので対象外) */
    document.addEventListener("kh-lang-change", () => {
      renderContent(content);
      Effects.refreshScrollReveal();
      /* 描き直した進捗バー・欠片一覧・記憶の欠片クリック判定をまとめて再適用する */
      MemorySystem.init();
      initReset();
    });
  });
})();
