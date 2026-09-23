/* ============================================================
   music.js — MEMORY THEMES ページの描画と試聴プレイヤー
   js/data.js の THEME_TRACKS を一覧表示し、
   audio が設定された曲だけ試聴できるようにする
   ============================================================ */

(() => {
  /* ------------------------------------------------------------
     0. 小さなユーティリティ
     ------------------------------------------------------------ */

  /* HTML に埋め込む文字列を無害化する(album.js と同じ方針) */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* 秒数を m:ss 形式にする */
  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ":" + String(s).padStart(2, "0");
  }

  /* ------------------------------------------------------------
     1. 再生アイコン(SVG 文字列)
     ------------------------------------------------------------ */
  const ICON_PLAY = `
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7Z"/>
    </svg>`;

  const ICON_PAUSE = `
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1"/>
      <rect x="14" y="5" width="4" height="14" rx="1"/>
    </svg>`;

  /* ------------------------------------------------------------
     2. 共有の <audio>。曲を切り替えながら1つだけ使う
     ------------------------------------------------------------ */
  const player = new Audio();
  player.preload = "none";

  /* いま再生(または一時停止)しているカードの状態 */
  let activeId = null;
  let cardsById = {};

  /* ------------------------------------------------------------
     3a. 各プラットフォームのリンク行を組み立てる
     links に直リンクがあればそれを、無ければ検索 URL を使う
     ------------------------------------------------------------ */
  function buildPlatformLinks(track) {
    if (typeof MUSIC_PLATFORMS === "undefined") return "";

    const q = encodeURIComponent(track.query || track.title);

    const items = MUSIC_PLATFORMS.map((p) => {
      const direct = track.links && track.links[p.key];
      const href = direct || p.search.replace("{q}", q);
      /* 検索リンクのときだけ端に虫めがねを添える */
      const suffix = direct ? "" : ` <span aria-hidden="true">⌕</span>`;
      return `<a class="theme-card__link" href="${escapeHtml(href)}"
                 target="_blank" rel="noopener noreferrer">${escapeHtml(p.label)}${suffix}</a>`;
    }).join("");

    return `
      <div class="theme-card__links" role="group"
           aria-label="${escapeHtml(track.title)} を各プラットフォームで聴く・探す">
        <span class="theme-card__links-label">聴く / 探す</span>
        ${items}
      </div>`;
  }

  /* ------------------------------------------------------------
     3b. カードを1枚組み立てる
     ------------------------------------------------------------ */
  function buildCard(track, index) {
    const hasAudio = !!track.audio;

    /* 曲がどの作品のものかで、カードにその作品の色をひとつまみ添える。
       1作に紐付かない曲(Dearly Beloved)は落ち着いた金色(--hueの既定値42)で扱う */
    const work =
      track.work && typeof WORKS !== "undefined"
        ? WORKS.find((w) => w.id === track.work)
        : null;

    const article = document.createElement("article");
    article.className = "theme-card reveal";
    article.dataset.delay = String((index % 5) + 1);
    article.dataset.trackId = track.id;
    if (work) article.style.setProperty("--hue", work.hue);

    const workBadge = `<span class="theme-card__work"${work ? "" : ' data-series="1"'}
      title="${work ? escapeHtml(work.title) : "シリーズ全作に共通するテーマ"}">${
      escapeHtml(work ? work.short : "SERIES")
    }</span>`;

    const motifs = (track.motifs || [])
      .map((m) => `<span class="tag">${escapeHtml(m)}</span>`)
      .join("");

    /* 音源が設定されている曲だけ、試聴プレイヤーを足す */
    const playerHtml = hasAudio
      ? `<div class="theme-card__player">
           <button class="theme-card__play" type="button"
                   aria-pressed="false" aria-label="${escapeHtml(track.title)} を再生">
             <span class="theme-card__play-icon">${ICON_PLAY}</span>
           </button>
           <button class="theme-card__seek" type="button"
                   aria-label="再生位置を変更">
             <span class="theme-card__seek-fill"></span>
           </button>
           <span class="theme-card__time">0:00</span>
         </div>`
      : "";

    /* 最後の曲のカードにだけ記憶の欠片を隠しておく */
    const isLastTrack =
      typeof THEME_TRACKS !== "undefined" &&
      THEME_TRACKS[THEME_TRACKS.length - 1] === track;
    const secretShard = isLastTrack
      ? `<div class="theme-card__shard">
           <div class="fragment" data-fragment="f10">
             <div class="fragment__shard"></div>
           </div>
         </div>`
      : "";

    article.innerHTML = `
      <div class="theme-card__head">
        <span class="theme-card__index">${String(index + 1).padStart(2, "0")}</span>
        <div class="theme-card__titles">
          <div class="theme-card__title-row">
            <h3 class="theme-card__title">${escapeHtml(track.title)}</h3>
            ${workBadge}
          </div>
          <p class="theme-card__reading">${escapeHtml(track.reading || "")}</p>
        </div>
      </div>

      <dl class="theme-card__meta">
        <div><dt>作曲・歌</dt><dd>${escapeHtml(track.credit || "")}</dd></div>
        <div><dt>登場作品</dt><dd>${escapeHtml(track.games || "")}</dd></div>
        <div><dt>場面</dt><dd>${escapeHtml(track.scene || "")}</dd></div>
      </dl>

      <p class="theme-card__note">${escapeHtml(track.note || "")}</p>

      <div class="theme-card__tags">${motifs}</div>

      ${buildPlatformLinks(track)}
      ${playerHtml}
      ${secretShard}
    `;

    return article;
  }

  /* ------------------------------------------------------------
     4. カードの表示を「停止状態」に戻す
     ------------------------------------------------------------ */
  function resetCardUI(id) {
    const card = cardsById[id];
    if (!card) return;

    const btn = card.querySelector(".theme-card__play");
    const icon = card.querySelector(".theme-card__play-icon");
    const fill = card.querySelector(".theme-card__seek-fill");
    const time = card.querySelector(".theme-card__time");

    card.classList.remove("is-playing");
    if (btn) {
      btn.setAttribute("aria-pressed", "false");
    }
    if (icon) icon.innerHTML = ICON_PLAY;
    if (fill) fill.style.width = "0%";
    if (time) time.textContent = "0:00";
  }

  /* ------------------------------------------------------------
     5. 指定した曲を再生する
     ------------------------------------------------------------ */
  function playTrack(track) {
    const card = cardsById[track.id];

    /* 別の曲が鳴っていたら、その見た目を戻す */
    if (activeId && activeId !== track.id) {
      resetCardUI(activeId);
    }

    activeId = track.id;

    /* すでに同じ曲を読み込み済みなら、続きから再生する */
    if (player.src !== new URL(track.audio, document.baseURI).href) {
      player.src = track.audio;
    }

    const done = player.play();
    if (done && typeof done.catch === "function") {
      done.catch(() => {
        MemorySystem.showToast("この音源を再生できませんでした");
        resetCardUI(track.id);
        activeId = null;
      });
    }

    /* BGM が鳴っていれば一時的に絞る */
    AudioEngine.duckBgm();

    if (card) {
      card.classList.add("is-playing");
      const btn = card.querySelector(".theme-card__play");
      const icon = card.querySelector(".theme-card__play-icon");
      if (btn) btn.setAttribute("aria-pressed", "true");
      if (icon) icon.innerHTML = ICON_PAUSE;
    }
  }

  /* 一時停止(曲は保持したまま) */
  function pauseTrack() {
    player.pause();

    const card = activeId ? cardsById[activeId] : null;
    if (card) {
      card.classList.remove("is-playing");
      const btn = card.querySelector(".theme-card__play");
      const icon = card.querySelector(".theme-card__play-icon");
      if (btn) btn.setAttribute("aria-pressed", "false");
      if (icon) icon.innerHTML = ICON_PLAY;
    }

    AudioEngine.unduckBgm();
  }

  /* ------------------------------------------------------------
     6. カードのボタン操作をつなぐ
     ------------------------------------------------------------ */
  function wireCard(track) {
    const card = cardsById[track.id];
    if (!card) return;

    /* プラットフォームのリンクにホバー音を添える(全カード共通) */
    card.querySelectorAll(".theme-card__link").forEach((a) => {
      a.addEventListener("mouseenter", () => AudioEngine.play("hover"));
    });

    /* ここから下は、音源が設定されていて試聴プレイヤーがあるカードだけ */
    if (!track.audio) return;

    const playBtn = card.querySelector(".theme-card__play");
    const seekBtn = card.querySelector(".theme-card__seek");

    playBtn.addEventListener("click", () => {
      const isCurrent = activeId === track.id;
      if (isCurrent && !player.paused) {
        pauseTrack();
      } else {
        playTrack(track);
      }
    });

    playBtn.addEventListener("mouseenter", () => AudioEngine.play("hover"));

    /* シークバーのクリックで再生位置を移動する */
    seekBtn.addEventListener("click", (e) => {
      if (activeId !== track.id || !isFinite(player.duration)) return;
      const rect = seekBtn.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      player.currentTime = Math.max(0, Math.min(1, ratio)) * player.duration;
    });

    /* 左右キーで 5 秒ずつ移動する */
    seekBtn.addEventListener("keydown", (e) => {
      if (activeId !== track.id || !isFinite(player.duration)) return;
      if (e.key === "ArrowRight") {
        player.currentTime = Math.min(player.duration, player.currentTime + 5);
      } else if (e.key === "ArrowLeft") {
        player.currentTime = Math.max(0, player.currentTime - 5);
      }
    });
  }

  /* ------------------------------------------------------------
     7. <audio> 側のイベント
     ------------------------------------------------------------ */
  function initPlayerEvents() {
    player.addEventListener("timeupdate", () => {
      if (!activeId) return;
      const card = cardsById[activeId];
      if (!card) return;

      const fill = card.querySelector(".theme-card__seek-fill");
      const time = card.querySelector(".theme-card__time");
      const ratio = player.duration ? player.currentTime / player.duration : 0;

      if (fill) fill.style.width = (ratio * 100).toFixed(1) + "%";
      if (time) time.textContent = formatTime(player.currentTime);
    });

    player.addEventListener("ended", () => {
      if (activeId) resetCardUI(activeId);
      activeId = null;
      AudioEngine.unduckBgm();
    });

    player.addEventListener("error", () => {
      if (!activeId) return;
      MemorySystem.showToast("この音源を再生できませんでした");
      resetCardUI(activeId);
      activeId = null;
      AudioEngine.unduckBgm();
    });

    /* 別ページへ移動するときは音を止める */
    window.addEventListener("pagehide", () => player.pause());
  }

  /* ------------------------------------------------------------
     8. 起動
     ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("theme-grid");
    if (!grid || typeof THEME_TRACKS === "undefined") return;

    THEME_TRACKS.forEach((track, index) => {
      const card = buildCard(track, index);
      cardsById[track.id] = card;
      grid.appendChild(card);
      wireCard(track);
    });

    initPlayerEvents();

    /* 後から作った .reveal 要素にスクロール演出を適用する
       (Effects は data.js などと同じく先に読み込まれている前提) */
    Effects.refreshScrollReveal();
    /* カードの中に紛れ込ませた記憶の欠片(f04/f10)を有効化する */
    if (typeof MemorySystem !== "undefined") MemorySystem.refresh();
  });
})();
