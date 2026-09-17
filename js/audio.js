/* ============================================================
   audio.js — 効果音・BGM の制御
   効果音は常に Web Audio API で合成する(音源ファイル不要)。
   BGM は既定では合成音だが、js/data.js の AUDIO_CONFIG.bgmSrc に
   パスを書くと、その音源ファイルを BGM として再生する。
   ブラウザの自動再生制限に合わせ、最初のクリック後に開始する
   ============================================================ */

const AudioEngine = (() => {
  /* AudioContext は利用者の操作をきっかけに作る(自動再生制限への対応) */
  let ctx = null;

  /* 音量をまとめて管理するノード */
  let masterGain = null;   // 全体
  let seGain = null;       // 効果音用
  let bgmGain = null;      // BGM 用

  /* BGM を構成するノードを保持しておき、停止時に破棄する(合成BGM用) */
  let bgmNodes = [];

  /* BGM に音源ファイルを使う場合の <audio> 要素と接続ノード */
  let bgmAudioEl = null;
  let bgmSourceNode = null;

  /* 現在の BGM 音量の目標値(ダッキングからの復帰に使う) */
  let bgmTargetGain = 0;

  /* MEMORY THEMES ページで試聴中など、BGM を一時的に絞っているか */
  let bgmDucked = false;

  /* ON / OFF の状態(localStorage に保存して次回も引き継ぐ) */
  const STORAGE_KEY = "kh-audio-enabled";
  let enabled = false;

  /* ------------------------------------------------------------
     初期化:保存された設定を読み込む
     ------------------------------------------------------------ */
  function loadPreference() {
    try {
      /* 初回訪問時は音を鳴らさない(false)のが親切な既定値 */
      return localStorage.getItem(STORAGE_KEY) === "on";
    } catch (e) {
      /* プライベートモードなどで localStorage が使えない場合 */
      return false;
    }
  }

  function savePreference(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value ? "on" : "off");
    } catch (e) {
      /* 保存できなくても動作に支障はないので無視する */
    }
  }

  /* ------------------------------------------------------------
     AudioContext を用意する(必要になった時点で1度だけ)
     ------------------------------------------------------------ */
  function ensureContext() {
    if (ctx) return ctx;

    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null; // 未対応ブラウザ

    ctx = new AC();

    masterGain = ctx.createGain();
    masterGain.gain.value = 0.9;
    masterGain.connect(ctx.destination);

    seGain = ctx.createGain();
    seGain.gain.value = 0.35;
    seGain.connect(masterGain);

    bgmGain = ctx.createGain();
    bgmGain.gain.value = 0; // 無音から始めてゆっくり上げる
    bgmGain.connect(masterGain);

    return ctx;
  }

  /* ------------------------------------------------------------
     単音を鳴らす基本処理
     freq     : 周波数(Hz)
     duration : 長さ(秒)
     type     : 波形の種類
     delay    : 何秒後に鳴らすか
     volume   : 音量
     ------------------------------------------------------------ */
  function playTone(freq, duration, type = "sine", delay = 0, volume = 0.5) {
    if (!enabled || !ctx) return;

    const now = ctx.currentTime + delay;

    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    /* 音量の変化(アタックとリリース)を作る */
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(seGain);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  /* ------------------------------------------------------------
     効果音の種類ごとの定義
     ------------------------------------------------------------ */
  const SOUNDS = {
    /* ホバー時:ごく短く柔らかい音 */
    hover() {
      playTone(1180, 0.14, "sine", 0, 0.16);
    },

    /* クリック時:2音の澄んだ音 */
    click() {
      playTone(880, 0.16, "sine", 0, 0.3);
      playTone(1320, 0.22, "sine", 0.04, 0.22);
    },

    /* 記憶の欠片を獲得:上昇するきらめき */
    collect() {
      const notes = [784, 988, 1175, 1568]; // ソ・シ・レ・ソ
      notes.forEach((f, i) => {
        playTone(f, 0.5, "sine", i * 0.07, 0.3);
      });
    },

    /* SECRET MEMORY 解放:荘厳な和音 */
    unlock() {
      const chord = [392, 523, 659, 784, 1047];
      chord.forEach((f, i) => {
        playTone(f, 1.9, "sine", i * 0.11, 0.26);
      });
      /* 低音を重ねて厚みを出す */
      playTone(196, 2.4, "triangle", 0, 0.2);
    },

    /* ページ遷移:低めのふわりとした音 */
    transition() {
      playTone(523, 0.5, "sine", 0, 0.18);
      playTone(392, 0.7, "sine", 0.06, 0.14);
    },

    /* 物語シーケンスの1文が表示されるとき */
    whisper() {
      playTone(660, 0.7, "sine", 0, 0.1);
      playTone(990, 0.5, "sine", 0.1, 0.06);
    },

    /* モーダルを開く */
    open() {
      playTone(587, 0.3, "sine", 0, 0.2);
      playTone(880, 0.35, "sine", 0.05, 0.15);
    },

    /* モーダルを閉じる */
    close() {
      playTone(660, 0.24, "sine", 0, 0.16);
      playTone(440, 0.3, "sine", 0.04, 0.13);
    }
  };

  /* ------------------------------------------------------------
     BGM の設定を読む(js/data.js の AUDIO_CONFIG)
     bgmSrc が指定されていれば音源ファイル、なければ合成BGM
     ------------------------------------------------------------ */
  function bgmFileConfig() {
    if (typeof AUDIO_CONFIG === "undefined" || !AUDIO_CONFIG) return null;
    if (!AUDIO_CONFIG.bgmSrc) return null;
    return AUDIO_CONFIG;
  }

  /* bgmGain の音量を seconds 秒かけて target まで動かす */
  function fadeBgmGain(target, seconds) {
    const now = ctx.currentTime;
    bgmGain.gain.cancelScheduledValues(now);
    bgmGain.gain.setValueAtTime(bgmGain.gain.value, now);
    bgmGain.gain.linearRampToValueAtTime(target, now + Math.max(0.01, seconds));
  }

  /* ------------------------------------------------------------
     BGM を開始する。設定に応じて音源ファイル/合成を選ぶ
     ------------------------------------------------------------ */
  function startBgm() {
    if (!ctx) return;

    const fileCfg = bgmFileConfig();
    if (fileCfg) {
      startFileBgm(fileCfg);
    } else {
      startSynthBgm();
    }
  }

  /* ------------------------------------------------------------
     音源ファイルを BGM として再生する
     読み込み・再生に失敗したら合成BGMにフォールバックする
     ------------------------------------------------------------ */
  function startFileBgm(cfg) {
    if (bgmAudioEl) return; // すでに再生中

    const el = new Audio();
    el.src = cfg.bgmSrc;
    el.loop = cfg.bgmLoop !== false;
    el.preload = "auto";
    /* 同一オリジンなら影響しないが、CORS 対応サーバーからの配信にも備える */
    el.crossOrigin = "anonymous";
    bgmAudioEl = el;

    try {
      bgmSourceNode = ctx.createMediaElementSource(el);
      bgmSourceNode.connect(bgmGain);
    } catch (e) {
      /* 接続ノードを作れない環境では合成BGMに切り替える */
      teardownFileBgm();
      startSynthBgm();
      return;
    }

    el.addEventListener("error", handleFileBgmError);

    const volume =
      typeof cfg.bgmVolume === "number" ? cfg.bgmVolume : 0.28;
    const fadeIn =
      typeof cfg.fadeInSeconds === "number" ? cfg.fadeInSeconds : 4;

    const played = el.play();
    if (played && typeof played.catch === "function") {
      played.catch(() => handleFileBgmError());
    }

    bgmTargetGain = volume;
    fadeBgmGain(bgmDucked ? 0 : volume, fadeIn);
  }

  /* 音源ファイルの再生に失敗したときの後始末とフォールバック */
  function handleFileBgmError() {
    if (!bgmAudioEl && !bgmSourceNode) return; // 二重呼び出し対策

    const src = (bgmFileConfig() || {}).bgmSrc;
    console.warn(
      "[audio] BGM 音源を再生できませんでした。合成BGMに切り替えます:",
      src
    );

    teardownFileBgm();
    startSynthBgm();
  }

  /* <audio> 要素と接続ノードを破棄する。
     引数を渡さなければモジュール変数が指す現在のものを破棄する */
  function teardownFileBgm(el, node) {
    const targetEl = el || bgmAudioEl;
    const targetNode = node || bgmSourceNode;

    if (targetEl) {
      try {
        targetEl.pause();
        targetEl.removeEventListener("error", handleFileBgmError);
        targetEl.src = "";
      } catch (e) {
        /* すでに破棄済みなら無視 */
      }
    }
    if (targetNode) {
      try {
        targetNode.disconnect();
      } catch (e) {
        /* すでに切断済みなら無視 */
      }
    }

    /* 現在のものを破棄したときだけ参照をクリアする */
    if (!el && targetEl === bgmAudioEl) bgmAudioEl = null;
    if (!node && targetNode === bgmSourceNode) bgmSourceNode = null;
  }

  /* ------------------------------------------------------------
     BGM:持続する環境音を合成する(音源ファイル未指定時)
     複数のオシレーターを少しずつずらして重ね、
     フィルターをゆっくり動かすことで揺らぎを作る
     ------------------------------------------------------------ */
  function startSynthBgm() {
    if (!ctx || bgmNodes.length > 0) return;

    /* 和音の構成音(低めのAマイナー系) */
    const freqs = [110, 164.81, 220, 329.63];

    /* 全体にかけるローパスフィルター */
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 700;
    filter.Q.value = 3;
    filter.connect(bgmGain);

    /* フィルターの開き具合をゆっくり揺らす LFO */
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.045; // 約22秒周期
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 380;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    bgmNodes.push(lfo, lfoGain, filter);

    /* 各音を2つずつ微妙にずらして重ねる(厚みと揺らぎ) */
    freqs.forEach((freq, i) => {
      [0, 0.6].forEach((detune) => {
        const osc = ctx.createOscillator();
        osc.type = i < 2 ? "sine" : "triangle";
        osc.frequency.value = freq;
        osc.detune.value = detune * 12;

        const gain = ctx.createGain();
        gain.gain.value = 0.16 / (i + 1);

        osc.connect(gain);
        gain.connect(filter);
        osc.start();

        bgmNodes.push(osc, gain);
      });
    });

    /* 4秒かけてゆっくり音量を上げる */
    bgmTargetGain = 0.1;
    fadeBgmGain(bgmDucked ? 0 : 0.1, 4);
  }

  /* ------------------------------------------------------------
     BGM を停止する(合成・音源ファイルどちらにも対応)
     ------------------------------------------------------------ */
  function stopBgm() {
    if (!ctx) return;
    if (bgmNodes.length === 0 && !bgmAudioEl) return;

    /* フェードアウトの長さ:音源ファイル時は設定値を尊重する */
    const cfg = bgmFileConfig();
    const fadeOut =
      cfg && typeof cfg.fadeOutSeconds === "number" ? cfg.fadeOutSeconds : 1.2;

    /* 音量を絞ってから停止する */
    fadeBgmGain(0, fadeOut);

    /* 参照を先に手放し、次の toggle で新しく開始できるようにする */
    const nodes = bgmNodes;
    bgmNodes = [];
    const fileEl = bgmAudioEl;
    const fileNode = bgmSourceNode;
    bgmAudioEl = null;
    bgmSourceNode = null;
    bgmTargetGain = 0;

    setTimeout(() => {
      /* 合成BGMのノードを破棄 */
      nodes.forEach((node) => {
        try {
          if (typeof node.stop === "function") node.stop();
          node.disconnect();
        } catch (e) {
          /* すでに停止済みの場合は無視 */
        }
      });
      /* 音源ファイルBGMを破棄 */
      if (fileEl || fileNode) teardownFileBgm(fileEl, fileNode);
    }, Math.round(fadeOut * 1000) + 200);
  }

  /* ------------------------------------------------------------
     外部から呼び出す API
     ------------------------------------------------------------ */
  return {
    /* 現在 ON かどうか */
    isEnabled() {
      return enabled;
    },

    /* 起動時に呼ぶ。保存された設定を反映する */
    init() {
      enabled = loadPreference();
      return enabled;
    },

    /* 音の ON / OFF を切り替える。切り替え後の状態を返す */
    toggle() {
      enabled = !enabled;
      savePreference(enabled);

      if (enabled) {
        ensureContext();
        /* ブラウザによっては停止状態で作られるので再開させる */
        if (ctx && ctx.state === "suspended") ctx.resume();
        startBgm();
        SOUNDS.click();
      } else {
        stopBgm();
      }

      return enabled;
    },

    /* 保存設定が ON だった場合に、最初の操作で音を開始する */
    resumeIfEnabled() {
      if (!enabled) return;
      ensureContext();
      if (ctx && ctx.state === "suspended") ctx.resume();
      startBgm();
    },

    /* 効果音を鳴らす。名前が無ければ何もしない */
    play(name) {
      if (!enabled) return;
      ensureContext();
      if (ctx && ctx.state === "suspended") ctx.resume();
      if (SOUNDS[name]) SOUNDS[name]();
    },

    /* BGM を一時的に絞る(MEMORY THEMES ページでの試聴中など)。
       BGM が鳴っていなくても、以後 startBgm したときに絞った状態から始まる */
    duckBgm() {
      bgmDucked = true;
      if (ctx && bgmGain && (bgmNodes.length > 0 || bgmAudioEl)) {
        fadeBgmGain(0, 0.4);
      }
    },

    /* duckBgm で絞った BGM を元の音量に戻す */
    unduckBgm() {
      bgmDucked = false;
      if (ctx && bgmGain && (bgmNodes.length > 0 || bgmAudioEl)) {
        fadeBgmGain(bgmTargetGain, 0.6);
      }
    }
  };
})();
