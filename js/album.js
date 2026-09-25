/* ============================================================
   album.js — MEMORY ALBUM ページの描画と操作
   作品年表 / 絞り込み / ワールド / キャラクター / 用語集 / モーダル
   ============================================================ */

(() => {
  /* ------------------------------------------------------------
     1. 紋章(画像がないときに表示する SVG 図形)
     すべて viewBox="0 0 100 100" で描いている
     ------------------------------------------------------------ */
  const EMBLEMS = {
    /* --- 作品用 --- */

    /* 王冠 */
    crown: `<path d="M50 14 63 42l25-14-8 40H20l-8-40 25 14Z" fill="currentColor" opacity="0.9"/>
            <rect x="20" y="76" width="60" height="8" rx="3" fill="currentColor" opacity="0.7"/>`,

    /* カード(記憶が書き換わる作品) */
    card: `<rect x="26" y="14" width="48" height="68" rx="6" fill="none"
                 stroke="currentColor" stroke-width="4" transform="rotate(-10 50 50)"/>
           <path d="M50 34 62 48 50 62 38 48Z" fill="currentColor" transform="rotate(-10 50 50)"/>`,

    /* きらめく星 */
    star: `<path d="M50 6 58 42l36 8-36 8-8 36-8-36-36-8 36-8Z" fill="currentColor"/>`,

    /* 太陽(夕暮れの象徴) */
    sun: `<circle cx="50" cy="50" r="20" fill="currentColor"/>
          <g stroke="currentColor" stroke-width="5" stroke-linecap="round">
            <path d="M50 8v14M50 78v14M8 50h14M78 50h14"/>
            <path d="M20 20l10 10M70 70l10 10M80 20L70 30M30 70L20 80"/>
          </g>`,

    /* お守り(星形のチャーム) */
    wayfinder: `<path d="M50 10 62 40l32 3-24 22 7 32-27-17-27 17 7-32-24-22 32-3Z"
                      fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>
                <circle cx="50" cy="52" r="8" fill="currentColor"/>`,

    /* 格子(データ世界) */
    grid: `<g fill="currentColor">
             <rect x="16" y="16" width="20" height="20" rx="3"/>
             <rect x="40" y="16" width="20" height="20" rx="3" opacity="0.6"/>
             <rect x="64" y="16" width="20" height="20" rx="3"/>
             <rect x="16" y="40" width="20" height="20" rx="3" opacity="0.6"/>
             <rect x="40" y="40" width="20" height="20" rx="3"/>
             <rect x="64" y="40" width="20" height="20" rx="3" opacity="0.6"/>
             <rect x="16" y="64" width="20" height="20" rx="3"/>
             <rect x="40" y="64" width="20" height="20" rx="3" opacity="0.6"/>
             <rect x="64" y="64" width="20" height="20" rx="3"/>
           </g>`,

    /* 三日月(眠りの世界) */
    moon: `<path d="M62 12a40 40 0 1 0 0 76 42 42 0 0 1 0-76Z" fill="currentColor"/>
           <circle cx="74" cy="30" r="4" fill="currentColor" opacity="0.7"/>`,

    /* 鍵穴 */
    keyhole: `<circle cx="50" cy="38" r="18" fill="none" stroke="currentColor" stroke-width="6"/>
              <path d="M42 56h16l6 30H36Z" fill="currentColor"/>`,

    /* 欠片(菱形) */
    shard: `<path d="M50 8 88 50 50 92 12 50Z" fill="none" stroke="currentColor" stroke-width="5"/>
            <path d="M50 28 70 50 50 72 30 50Z" fill="currentColor" opacity="0.85"/>`,

    /* 音符 */
    note: `<path d="M42 74V22l36-8v52" fill="none" stroke="currentColor" stroke-width="6"
                 stroke-linecap="round" stroke-linejoin="round"/>
           <circle cx="32" cy="74" r="12" fill="currentColor"/>
           <circle cx="68" cy="66" r="12" fill="currentColor"/>`,

    /* --- ワールド用 --- */

    /* 南の島(ヤシの木と波) */
    island: `<path d="M6 78q22-10 44 0t44 0" fill="none" stroke="currentColor"
                   stroke-width="4" stroke-linecap="round" opacity="0.65"/>
             <path d="M20 90q30-16 60 0" fill="none" stroke="currentColor"
                   stroke-width="4" stroke-linecap="round" opacity="0.4"/>
             <path d="M50 76V34" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
             <g fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round">
               <path d="M50 34q-22-14-34 2"/>
               <path d="M50 34q22-14 34 2"/>
               <path d="M50 34q-8-22 -26-24"/>
               <path d="M50 34q8-22 26-24"/>
             </g>
             <path d="M50 26 53 33l7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1Z" fill="currentColor"/>`,

    /* ステンドグラスの足場(ダイブ・トゥ・ザ・ハート) */
    rosette: `<circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="3"/>
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="2" opacity="0.7"/>
              <circle cx="50" cy="50" r="14" fill="currentColor" opacity="0.85"/>
              <g stroke="currentColor" stroke-width="2" opacity="0.55">
                <path d="M50 8v84M8 50h84"/>
                <path d="M20 20 80 80M80 20 20 80"/>
              </g>
              <g fill="currentColor" opacity="0.5">
                <circle cx="50" cy="22" r="4"/><circle cx="50" cy="78" r="4"/>
                <circle cx="22" cy="50" r="4"/><circle cx="78" cy="50" r="4"/>
              </g>`,

    /* 街灯(夜だけの街) */
    lamp: `<path d="M50 88V44" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
           <path d="M34 88h32" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
           <path d="M36 42 50 16l14 26Z" fill="currentColor" opacity="0.9"/>
           <circle cx="50" cy="34" r="5" fill="currentColor"/>
           <g stroke="currentColor" stroke-width="2" opacity="0.45" stroke-linecap="round">
             <path d="M26 50 18 58M74 50l8 8M50 96v-2"/>
           </g>`,

    /* 城(闇に侵された城) */
    castle: `<path d="M18 88V48l10-10 10 10v-8h24v8l10-10 10 10v40Z"
                   fill="currentColor" opacity="0.85"/>
             <g fill="none" stroke="currentColor" stroke-width="3">
               <path d="M28 24 22 40h12Z" fill="currentColor"/>
               <path d="M72 24 66 40h12Z" fill="currentColor"/>
               <path d="M50 12 42 34h16Z" fill="currentColor"/>
             </g>
             <rect x="44" y="66" width="12" height="22" rx="6" fill="#000" opacity="0.55"/>`,

    /* 白い城(忘却の城) */
    castleWhite: `<g fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round">
                    <path d="M24 90V52h52v38Z"/>
                    <path d="M32 52V34h12v18M56 52V34h12v18"/>
                    <path d="M38 34 32 20 26 34M62 34l6-14 6 14"/>
                    <path d="M50 52V16"/>
                  </g>
                  <path d="M50 8 54 18h-8Z" fill="currentColor"/>
                  <rect x="44" y="70" width="12" height="20" rx="6" fill="currentColor" opacity="0.3"/>`,

    /* 時計塔(トワイライトタウン) */
    clocktower: `<path d="M32 92V36h36v56Z" fill="currentColor" opacity="0.85"/>
                 <path d="M50 8 26 36h48Z" fill="currentColor"/>
                 <circle cx="50" cy="56" r="14" fill="#000" opacity="0.45"/>
                 <circle cx="50" cy="56" r="14" fill="none" stroke="currentColor" stroke-width="3"/>
                 <path d="M50 56V46M50 56l8 6" stroke="currentColor" stroke-width="3"
                       stroke-linecap="round"/>`,

    /* 人工の月(存在しなかった世界) */
    moonHeart: `<path d="M50 88C34 74 16 62 16 45a17 17 0 0 1 34-7 17 17 0 0 1 34 7c0 17-18 29-34 43Z"
                      fill="none" stroke="currentColor" stroke-width="4"/>
                <path d="M62 26a26 26 0 1 0 0 46 28 28 0 0 1 0-46Z" fill="currentColor" opacity="0.75"/>
                <g stroke="currentColor" stroke-width="2" opacity="0.4">
                  <path d="M20 16 26 22M80 16l-6 6M12 60l6-2M88 60l-6-2"/>
                </g>`,

    /* 門(旅立ちの地) */
    gate: `<g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round">
             <path d="M24 90V38a26 26 0 0 1 52 0v52"/>
             <path d="M50 90V38"/>
             <path d="M16 90h68"/>
           </g>
           <path d="M50 22 56 34H44Z" fill="currentColor"/>
           <circle cx="50" cy="52" r="6" fill="currentColor" opacity="0.7"/>`,

    /* キーブレード墓場(突き立つ無数の鍵) */
    graveyard: `<path d="M8 84h84" stroke="currentColor" stroke-width="4"
                      stroke-linecap="round" opacity="0.6"/>
                <g stroke="currentColor" stroke-width="4" stroke-linecap="round" fill="none">
                  <path d="M24 84 30 34" /><path d="M26 44h10"/>
                  <path d="M50 84V22" /><path d="M42 34h16"/>
                  <path d="M76 84 70 40" /><path d="M64 50h12"/>
                </g>
                <g fill="currentColor" opacity="0.85">
                  <path d="M30 26 34 34h-8Z"/>
                  <path d="M50 12 56 22H44Z"/>
                  <path d="M70 32 74 40h-8Z"/>
                </g>`,

    /* 闇(渦を巻く暗黒) */
    darkness: `<path d="M50 12a38 38 0 1 1-27 65 30 30 0 1 0 21-51 22 22 0 1 1 15 38"
                     fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
               <circle cx="50" cy="50" r="7" fill="currentColor"/>`,

    /* --- キャラクター用(それぞれの人物像・持ち物ではなく、
           物語のテーマを表す抽象的なモチーフとして描いている) --- */

    /* 五角形の果実(パオプの実。カイリを象徴) */
    starfruit: `<path d="M50 8 61 38 92 40 66 58 76 90 50 70 24 90 34 58 8 40 39 38Z"
                      fill="currentColor"/>`,

    /* 溶けかけたアイスバー(シーソルトアイス。ロクサスを象徴) */
    icebar: `<rect x="34" y="18" width="32" height="46" rx="10" fill="currentColor"/>
              <rect x="46" y="60" width="8" height="26" rx="3" fill="currentColor" opacity="0.85"/>
              <path d="M34 40q16 10 32 0" stroke="#000" stroke-opacity="0.18" stroke-width="3" fill="none"/>`,

    /* 開かれたスケッチブック(絵を描くナミネを象徴) */
    sketchbook: `<path d="M50 26C42 20 26 18 16 22v52c10-4 26-2 34 4Z" fill="currentColor" opacity="0.9"/>
                  <path d="M50 26C58 20 74 18 84 22v52c-10-4-26-2-34 4Z" fill="currentColor" opacity="0.7"/>
                  <path d="M50 26v52" stroke="#000" stroke-opacity="0.25" stroke-width="2"/>`,

    /* ひびの入ったハート(不完全な存在としてのシオンを象徴) */
    crackedHeart: `<path d="M50 86C30 70 14 56 14 38A18 18 0 0 1 50 30
                          A18 18 0 0 1 86 38C86 56 70 70 50 86Z"
                        fill="none" stroke="currentColor" stroke-width="4"/>
                   <path d="M46 32 54 46 44 54 58 70" fill="none" stroke="currentColor"
                         stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,

    /* 揺らめく炎(アクセルを象徴) */
    flame: `<path d="M50 90c-18 0-30-12-30-28 0-14 10-22 14-34 2 8 8 12 8 20
                     0-10 6-16 4-26 14 8 26 24 26 40 0 16-12 28-22 28Z"
                  fill="currentColor"/>`,

    /* しずく(アクアを象徴) */
    droplet: `<path d="M50 12C50 12 22 46 22 64a28 28 0 0 0 56 0C78 46 50 12 50 12Z"
                    fill="currentColor"/>`,

    /* 山なりの盾(テラを象徴) */
    peak: `<path d="M50 14 86 82H14Z" fill="currentColor" opacity="0.9"/>
            <path d="M50 40 70 82H30Z" fill="#000" fill-opacity="0.2"/>`,

    /* 渦を巻く風(ヴェントゥスを象徴) */
    spiral: `<path d="M50 50C50 34 62 26 74 32 84 37 84 52 72 55 62 57 58 48 64 44"
                   fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
              <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" stroke-width="2" opacity="0.4"/>`,

    /* ひび割れた仮面(ヴァニタスを象徴) */
    crackedMask: `<path d="M50 14a36 36 0 1 1 0 72 36 36 0 0 1 0-72Z"
                        fill="currentColor" opacity="0.88"/>
                   <path d="M50 14 40 40 58 52 38 62 50 86" fill="none"
                         stroke="#000" stroke-opacity="0.35" stroke-width="3"
                         stroke-linecap="round" stroke-linejoin="round"/>`,

    /* 落ちる砂時計(時を渡り歩くゼアノートを象徴) */
    hourglass: `<path d="M28 14h44M28 86h44" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
                 <path d="M32 14c0 16 12 22 18 36 6-14 18-20 18-36"
                       fill="none" stroke="currentColor" stroke-width="4"/>
                 <path d="M32 86c0-16 12-22 18-36 6 14 18 20 18 36"
                       fill="none" stroke="currentColor" stroke-width="4"/>`,

    /* 杖(魔法使いドナルドを象徴) */
    wand: `<path d="M24 76 66 34" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
           <path d="M70 20 74 30 84 34 74 38 70 48 66 38 56 34 66 30Z" fill="currentColor"/>`,

    /* 円い盾(盾を構えるグーフィーを象徴) */
    shield: `<path d="M50 12 82 24v26c0 22-14 34-32 38-18-4-32-16-32-38V24Z" fill="currentColor"/>
             <path d="M50 24v52M32 40h36" stroke="#000" stroke-opacity="0.25" stroke-width="3"/>`,

    /* --- ワールド用(ディズニー作品のワールド) --- */

    /* ティーカップ(ワンダーランド) */
    teacup: `<path d="M20 42h50a6 6 0 0 1 6 6c0 12-10 20-22 20H36C24 68 14 60 14 48a6 6 0 0 1 6-6Z"
                   fill="currentColor" opacity="0.9"/>
             <path d="M76 46c8-2 14 2 14 9s-8 11-16 9" fill="none" stroke="currentColor" stroke-width="4"/>
             <ellipse cx="45" cy="42" rx="26" ry="6" fill="currentColor"/>`,

    /* 柱(オリンポスコロシアム) */
    column: `<rect x="38" y="30" width="24" height="50" fill="currentColor"/>
             <rect x="30" y="20" width="40" height="10" rx="2" fill="currentColor"/>
             <rect x="30" y="80" width="40" height="8" rx="2" fill="currentColor"/>
             <g stroke="#000" stroke-opacity="0.2" stroke-width="2">
               <path d="M44 30v50M50 30v50M56 30v50"/>
             </g>`,

    /* 葉(ディープジャングル) */
    jungleLeaf: `<path d="M50 12C30 24 20 46 30 68c6 13 20 20 20 20s14-7 20-20c10-22 0-44-20-56Z" fill="currentColor"/>
                 <path d="M50 20v66" stroke="#000" stroke-opacity="0.25" stroke-width="2"/>`,

    /* 魔法のランプ(アグラバー) */
    genieLamp: `<path d="M20 60c0-10 10-18 22-18h14c14 0 22 6 30 2-4 8-14 10-14 10s10 4 10 12c0 10-12 16-30 16H40C26 82 20 72 20 60Z"
                      fill="currentColor"/>
                <circle cx="30" cy="60" r="4" fill="currentColor" opacity="0.6"/>`,

    /* 鯨と波(モンストロ) */
    whaleWave: `<path d="M10 58q20-18 40 0t40 0" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
                <path d="M55 40c14-6 26 2 30 12-10 4-16 0-20-4 0 6-4 10-10 10-8 0-14-8-10-16Z" fill="currentColor"/>`,

    /* 貝殻(アトランティカ) */
    shell: `<path d="M50 14c18 4 30 20 30 40 0 6-2 12-6 16-2-8-8-14-14-14v14H40V56c-6 0-12 6-14 14-4-4-6-10-6-16
                   0-20 12-36 30-40Z" fill="currentColor"/>`,

    /* かぼちゃの明かり(ハロウィンタウン) */
    pumpkinFace: `<ellipse cx="50" cy="56" rx="34" ry="26" fill="currentColor"/>
                  <path d="M50 30v-14M44 20l6 10 6-10" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                  <g fill="#000" fill-opacity="0.55">
                    <path d="M34 50 42 58 34 62Z"/>
                    <path d="M66 50 58 58 66 62Z"/>
                    <path d="M36 70q14 12 28 0q-4 8-14 8t-14-8Z"/>
                  </g>`,

    /* 妖精の粉のきらめき(ネバーランド) */
    sparkle: `<path d="M50 10 56 42 88 48 56 54 50 86 44 54 12 48 44 42Z" fill="currentColor"/>
              <circle cx="76" cy="20" r="4" fill="currentColor" opacity="0.7"/>
              <circle cx="24" cy="76" r="3" fill="currentColor" opacity="0.6"/>`,

    /* 一輪のバラ(ビーストキャッスル) */
    rose: `<circle cx="50" cy="42" r="18" fill="currentColor"/>
           <circle cx="50" cy="42" r="9" fill="#000" fill-opacity="0.2"/>
           <path d="M50 60v26" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
           <path d="M50 72q-12 0-14-10M50 78q12 0 14-8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,

    /* はちみつの壺(100エーカーの森) */
    honeypot: `<path d="M32 40h36l-4 42a6 6 0 0 1-6 6H42a6 6 0 0 1-6-6Z" fill="currentColor"/>
               <rect x="28" y="32" width="44" height="10" rx="4" fill="currentColor"/>
               <path d="M40 40q10 8 20 0" fill="none" stroke="#000" stroke-opacity="0.25" stroke-width="2"/>`,

    /* 錨(ポートロイヤル) */
    anchor: `<circle cx="50" cy="20" r="7" fill="none" stroke="currentColor" stroke-width="4"/>
             <path d="M50 27v46" stroke="currentColor" stroke-width="5"/>
             <path d="M28 50h44" stroke="currentColor" stroke-width="4"/>
             <path d="M30 50c0 14 8 24 20 26M70 50c0 14-8 24-20 26"
                   fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,

    /* 足あと(プライド・ランド) */
    pawPrint: `<ellipse cx="50" cy="62" rx="20" ry="16" fill="currentColor"/>
               <circle cx="28" cy="38" r="8" fill="currentColor"/>
               <circle cx="46" cy="28" r="8" fill="currentColor"/>
               <circle cx="64" cy="30" r="8" fill="currentColor"/>
               <circle cx="76" cy="44" r="7" fill="currentColor"/>`,

    /* 竜の紋章(ザ・ランド・オブ・ドラゴン) */
    dragonCrest: `<path d="M50 12 66 34 50 30 34 34Z" fill="currentColor"/>
                  <path d="M20 78q30-30 60 0" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
                  <path d="M30 66q20-16 40 0" fill="none" stroke="currentColor" stroke-width="4"
                        stroke-linecap="round" opacity="0.6"/>`,

    /* 電子回路の塔(サンフランソウキョウ) */
    circuitTower: `<rect x="42" y="20" width="16" height="60" rx="4" fill="currentColor"/>
                   <circle cx="50" cy="16" r="6" fill="currentColor"/>
                   <g stroke="currentColor" stroke-width="3" stroke-linecap="round">
                     <path d="M42 40H24M42 56H24M58 40h18M58 56h18"/>
                   </g>`,

    /* 塔(キングダム・オブ・コロナ) */
    rapunzelTower: `<path d="M38 88V38l12-20 12 20v50Z" fill="currentColor"/>
                    <rect x="44" y="46" width="12" height="14" fill="#000" fill-opacity="0.3"/>`,

    /* 雪の結晶(アレンデール) */
    snowflake: `<g stroke="currentColor" stroke-width="4" stroke-linecap="round">
                  <path d="M50 10v80M15 30l70 40M85 30l-70 40"/>
                </g>
                <g stroke="currentColor" stroke-width="3" stroke-linecap="round">
                  <path d="M50 10 42 20M50 10l8 10M50 90l-8-10M50 90l8-10"/>
                </g>`,

    /* 舵輪(ザ・カリビアン) */
    shipWheel: `<circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="5"/>
                <circle cx="50" cy="50" r="8" fill="currentColor"/>
                <g stroke="currentColor" stroke-width="5" stroke-linecap="round">
                  <path d="M50 14v16M50 70v16M14 50h16M70 50h16M25 25l11 11M64 64l11 11M75 25 64 36M36 64 25 75"/>
                </g>`,

    /* 積み木(トイボックス) */
    toyBlock: `<rect x="16" y="50" width="28" height="28" rx="4" fill="currentColor"/>
               <rect x="56" y="50" width="28" height="28" rx="4" fill="currentColor" opacity="0.7"/>
               <path d="M50 14 62 34H38Z" fill="currentColor"/>`,

    /* 扉(モンストロポリス) */
    doorway: `<path d="M30 86V30a20 20 0 0 1 40 0v56Z" fill="currentColor"/>
              <circle cx="60" cy="58" r="3" fill="#000" fill-opacity="0.4"/>`,

    /* 天へ至る塔の連なり(スカラ・アド・カエルム) */
    spireCluster: `<path d="M22 88V50l8-14 8 14v38ZM42 88V38l8-16 8 16v50ZM64 88V48l8-13 8 13v40Z"
                         fill="currentColor" opacity="0.9"/>`,

    /* 昇る朝日(デイブレイクタウン) */
    sunrise: `<circle cx="50" cy="62" r="16" fill="currentColor"/>
              <g stroke="currentColor" stroke-width="4" stroke-linecap="round">
                <path d="M50 30v10M22 62h10M68 62h10M30 42l7 7M70 42l-7 7"/>
              </g>
              <path d="M14 82h72" stroke="currentColor" stroke-width="3" opacity="0.5"/>`
  };

  /* キャラクターの英語名 → 上記モチーフの対応表
     一覧に無いキャラクターは、頭文字の表示にフォールバックする */
  const CHARACTER_SIGILS = {
    /* 主人公たち */
    SORA: "crown",
    RIKU: "moon",
    KAIRI: "starfruit",
    /* XIII機関 / 関わる二人 */
    ROXAS: "icebar",
    "NAMINÉ": "sketchbook",
    XION: "crackedHeart",
    AXEL: "flame",
    /* ウェイファインダーの仲間 */
    AQUA: "droplet",
    TERRA: "peak",
    VENTUS: "spiral",
    VANITAS: "crackedMask",
    XEHANORT: "hourglass",
    /* 王様と旅の仲間 */
    "KING MICKEY": "wayfinder",
    "DONALD DUCK": "wand",
    GOOFY: "shield",
    /* 敵対者 */
    MALEFICENT: "darkness",
    /* ディズニーの仲間たち(ゆかりのワールドの紋章を流用) */
    "JACK SKELLINGTON": "pumpkinFace",
    ARIEL: "shell",
    SIMBA: "pawPrint",
    BEAST: "rose",
    ALADDIN: "genieLamp",
    ELSA: "snowflake",
    "JACK SPARROW": "shipWheel",
    WOODY: "toyBlock",
    "TINKER BELL": "sparkle",
    "WINNIE THE POOH": "honeypot",
    HERCULES: "column"
  };

  /* 紋章を SVG 要素の文字列として組み立てる */
  function emblemSvg(name, className) {
    const inner = EMBLEMS[name] || EMBLEMS.shard;
    return `<svg class="${className}" viewBox="0 0 100 100" aria-hidden="true">${inner}</svg>`;
  }

  /* HTML に埋め込む文字列を安全にする(引用符などを無害化する) */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* 画像の読み込みに失敗したとき、鍵穴プレースホルダーに差し替える(壊れアイコン防止) */
  const IMG_FALLBACK =
    "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20120%20120'%3E" +
    "%3Crect%20width='120'%20height='120'%20fill='%230a1428'/%3E" +
    "%3Cpath%20d='M60%2092C46%2079%2033%2069%2033%2057A13%2013%200%200%201%2060%2051A13%2013%200%200%201%2087%2057C87%2069%2074%2079%2060%2092Z'%20fill='none'%20stroke='%234da6ff'%20stroke-width='4'/%3E" +
    "%3Ccircle%20cx='60'%20cy='61'%20r='6'%20fill='%234da6ff'/%3E" +
    "%3Cpath%20d='M56%2066h8l2%2012H54Z'%20fill='%234da6ff'/%3E%3C/svg%3E";
  const IMG_ONERR = `onerror="this.onerror=null;this.src='${IMG_FALLBACK}'"`;

  /* WORKS の id 配列を「登場作品バー」に変換する。
     全12作品を発売順に固定で並べ、登場する作品だけを点灯させる。
     並び順が常に同じなので、カードを縦に見比べれば登場パターンが一目で分かる。
     例) ["kh1","kh2"] → I と II のセルだけ is-in、残りは淡色 */
  function worksTagsHtml(workIds) {
    const ids = new Set(workIds || []);
    const cells = WORKS.map((w) => {
      const inIt = ids.has(w.id);
      const cat = w.category || "side";
      const state = inIt ? "登場" : "未登場";
      const title = `${w.short} ― ${w.title}（${w.year}）${inIt ? "" : "・" + state}`;
      return (
        `<span class="appears__cell${inIt ? " is-in" : ""}" data-cat="${cat}"` +
        ` title="${escapeHtml(title)}">${escapeHtml(w.short)}</span>`
      );
    }).join("");
    const names = WORKS.filter((w) => ids.has(w.id))
      .map((w) => w.title)
      .join(" / ");
    return (
      `<div class="appears" role="img" aria-label="登場作品: ${escapeHtml(names || "―")}">` +
      cells +
      `</div>`
    );
  }

  /* ------------------------------------------------------------
     2. 作品年表を描画する
     ------------------------------------------------------------ */
  function renderWorks() {
    const timeline = document.getElementById("timeline");
    if (!timeline) return;

    WORKS.forEach((work, index) => {
      /* --- 年表の1項目 --- */
      const item = document.createElement("div");
      item.className = "timeline__item reveal";
      item.dataset.category = work.category;

      /* --- 作品カード ---
         見出しを含むため button 要素は使えない。
         article に role="button" を与えて押せる要素として扱う --- */
      const card = document.createElement("article");
      card.className = "work-card";
      card.style.setProperty("--hue", work.hue);
      card.dataset.workId = work.id;
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", `${work.title} の詳細を見る`);

      /* パッケージ画像があればそれを、無ければ紋章を表示する */
      const visual = work.image
        ? `<img class="work-card__image" src="${escapeHtml(work.image)}"
                alt="${escapeHtml(work.title)} のパッケージ" loading="lazy" ${IMG_ONERR}>`
        : emblemSvg(work.emblem, "work-card__emblem");

      const tagsHtml = work.tags
        .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
        .join("");

      card.innerHTML = `
        <div class="work-card__visual">
          ${visual}
        </div>
        <div class="work-card__body">
          <p class="work-card__year">${escapeHtml(work.year)}</p>
          <h3 class="work-card__title">${escapeHtml(work.title)}</h3>
          <p class="work-card__subtitle">${escapeHtml(KH_I18N.pick(work, "subtitle"))}</p>
          <p class="work-card__desc">${escapeHtml(KH_I18N.pick(work, "summary"))}</p>
          <div class="work-card__tags">${tagsHtml}</div>
        </div>
      `;

      item.appendChild(card);
      timeline.appendChild(item);
    });
  }

  /* ------------------------------------------------------------
     3. 絞り込み
     ------------------------------------------------------------ */
  function initFilter() {
    const bar = document.getElementById("filter-bar");
    const timeline = document.getElementById("timeline");
    const noResult = document.getElementById("no-result");
    if (!bar || !timeline) return;

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;

      /* 押されたボタンだけを選択状態にする */
      bar.querySelectorAll(".filter-btn").forEach((b) => {
        b.classList.toggle("is-active", b === btn);
      });

      const filter = btn.dataset.filter;
      let visibleCount = 0;

      timeline.querySelectorAll(".timeline__item").forEach((item) => {
        const match = filter === "all" || item.dataset.category === filter;
        item.classList.toggle("is-filtered-out", !match);
        if (match) visibleCount++;
      });

      if (noResult) {
        noResult.style.display = visibleCount === 0 ? "block" : "none";
      }
    });
  }

  /* キャラクター一覧の絞り込み(グループ単位。見出しの表示・非表示も連動させる) */
  function initCharacterFilter() {
    const bar = document.getElementById("character-filter-bar");
    const grid = document.getElementById("character-grid");
    if (!bar || !grid) return;

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;

      bar.querySelectorAll(".filter-btn").forEach((b) => {
        b.classList.toggle("is-active", b === btn);
      });

      const filter = btn.dataset.filter;

      grid.querySelectorAll(".character-card").forEach((card) => {
        const match = filter === "all" || card.dataset.group === filter;
        card.classList.toggle("is-filtered-out", !match);
      });

      grid.querySelectorAll(".character-group-heading").forEach((heading) => {
        const match = filter === "all" || heading.dataset.group === filter;
        heading.classList.toggle("is-filtered-out", !match);
      });
    });
  }

  /* ------------------------------------------------------------
     4. ワールド一覧を描画する
     ------------------------------------------------------------ */
  function renderWorlds() {
    const grid = document.getElementById("world-grid");
    if (!grid) return;

    WORLDS.forEach((world, index) => {
      const card = document.createElement("article");
      card.className = "world-card reveal";
      card.dataset.delay = String((index % 4) + 1);
      card.style.setProperty("--hue", world.hue);

      // ゲーム内のワールド名タイトルカードのスクリーンショット(.jpg)は
      // 元から画面いっぱいに絵柄があるので、ロゴ画像(.png)のような
      // 余白付きcontain表示にすると黒帯や縁が目立ってしまう。
      // 拡張子で見分けて、写真タイプはカード全面に敷き詰める表示にする
      const isPhoto = /\.jpe?g($|\?)/i.test(world.image || "");
      const visual = world.image
        ? `<img class="world-card__image${isPhoto ? " world-card__image--photo" : ""}"
                src="${escapeHtml(world.image)}"
                alt="${escapeHtml(world.name)} の風景" loading="lazy" ${IMG_ONERR}>`
        : emblemSvg(world.emblem, "world-card__emblem");

      card.innerHTML = `
        <div class="world-card__visual${isPhoto ? " world-card__visual--photo" : ""}">
          ${visual}
        </div>
        <div class="world-card__body">
          <p class="world-card__en">${escapeHtml(world.en)}</p>
          <h3 class="world-card__name">${escapeHtml(world.name)}</h3>
          <p class="world-card__text">${escapeHtml(world.text)}</p>
          <div class="world-card__tags">${worksTagsHtml(world.works)}</div>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  /* キャラクターの group フィールド → 見出しラベル・絞り込みボタンの表示名 */
  const CHARACTER_GROUPS = [
    { key: "guardian", label: "主人公たち" },
    { key: "org13", label: "XIII機関" },
    { key: "related", label: "機関に関わる二人" },
    { key: "wayfinder", label: "ウェイファインダーの仲間" },
    { key: "chi", label: "χの世代 ― 予知者とダンデライオン" },
    { key: "darkroad", label: "Dark Road ― ゼアノートの過去" },
    { key: "origin-other", label: "その他の重要人物" },
    { key: "companion", label: "王様と旅の仲間" },
    { key: "villain", label: "敵対者" },
    { key: "disney", label: "ディズニーの仲間たち" }
  ];

  /* ------------------------------------------------------------
     5. キャラクター一覧を描画する(グループごとに見出しを挟む)
     ------------------------------------------------------------ */
  function renderCharacters() {
    const grid = document.getElementById("character-grid");
    if (!grid) return;

    let cardIndex = 0;

    CHARACTER_GROUPS.forEach((group) => {
      const members = CHARACTERS.filter((c) => c.group === group.key);
      if (!members.length) return;

      /* グループの見出し(グリッド全幅) */
      const heading = document.createElement("h3");
      heading.className = "character-group-heading reveal";
      heading.dataset.group = group.key;
      heading.textContent = group.label;
      grid.appendChild(heading);

      members.forEach((chara) => {
        /* 作品カードと同様、見出しを含むため article + role="button" にする */
        const card = document.createElement("article");
        card.className = "character-card reveal";
        card.dataset.delay = String((cardIndex % 4) + 1);
        card.dataset.group = chara.group;
        card.style.setProperty("--hue", chara.hue);
        card.dataset.characterIndex = String(CHARACTERS.indexOf(chara));
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", `${chara.name} の詳細を見る`);
        cardIndex++;

        /* 画像があればそれを、なければテーマを表す紋章を、
           紋章も無ければ頭文字を表示する(3段階のフォールバック) */
        const sigil = CHARACTER_SIGILS[chara.en];
        const face = chara.image
          ? `<img class="character-card__image" src="${escapeHtml(chara.image)}"
                  alt="${escapeHtml(chara.name)}" loading="lazy" ${IMG_ONERR}>`
          : sigil
          ? emblemSvg(sigil, "character-card__sigil")
          : `<span class="character-card__initial">${escapeHtml(chara.initial)}</span>`;

        card.innerHTML = `
          <div class="character-card__aura">${face}</div>
          <h3 class="character-card__name">${escapeHtml(chara.name)}</h3>
          <p class="character-card__en">${escapeHtml(chara.en)}</p>
          <p class="character-card__role">${escapeHtml(chara.role)}</p>
          <div class="character-card__tags">${worksTagsHtml(chara.works)}</div>
        `;

        grid.appendChild(card);
      });
    });
  }

  /* ------------------------------------------------------------
     6. 用語集を描画する
     ------------------------------------------------------------ */
  function renderGlossary() {
    const list = document.getElementById("glossary-list");
    if (!list) return;

    GLOSSARY.forEach((entry, index) => {
      const item = document.createElement("div");
      item.className = "glossary-item reveal";
      item.dataset.delay = String((index % 4) + 1);

      item.innerHTML = `
        <div class="glossary-item__head">
          <h3 class="glossary-item__term">${escapeHtml(entry.term)}</h3>
          <span class="glossary-item__en">${escapeHtml(entry.en)}</span>
        </div>
        <p class="glossary-item__text">${escapeHtml(entry.text)}</p>
      `;

      list.appendChild(item);
    });
  }

  /* ------------------------------------------------------------
     7. 詳細モーダル
     ------------------------------------------------------------ */
  const Modal = (() => {
    const modal = document.getElementById("detail-modal");
    const dialog = document.getElementById("modal-dialog");
    const content = document.getElementById("modal-content");
    const closeBtn = document.getElementById("modal-close");

    /* モーダルを開く前にフォーカスしていた要素(閉じたときに戻す) */
    let lastFocused = null;

    function open(html) {
      if (!modal) return;

      lastFocused = document.activeElement;

      content.innerHTML = html;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");

      document.body.style.overflow = "hidden";
      dialog.scrollTop = 0;

      AudioEngine.play("open");

      /* モーダル内に追加された記憶の欠片を有効化する */
      MemorySystem.refresh();

      closeBtn.focus();
    }

    function close() {
      if (!modal || !modal.classList.contains("is-open")) return;

      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";

      AudioEngine.play("close");

      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }

    if (modal) {
      closeBtn.addEventListener("click", close);

      /* 背景(ダイアログの外側)をクリックしたら閉じる */
      modal.addEventListener("click", (e) => {
        if (e.target === modal) close();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });
    }

    return { open, close };
  })();

  /* ------------------------------------------------------------
     8. モーダルの中身を組み立てる
     ------------------------------------------------------------ */

  /* 作品の詳細 */
  function buildWorkDetail(work) {
    const paragraphs = work.detail
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("");

    const keywords = work.keywords
      .map((k) => `<span class="tag tag--gold">${escapeHtml(k)}</span>`)
      .join("");

    const worlds = work.worlds
      .map((w) => `<span class="tag">${escapeHtml(w)}</span>`)
      .join("");

    /* 主題歌が分かっている作品だけ表示する */
    const musicBlock = work.music
      ? `<h3 class="modal__section-title">主題歌</h3>
         <p class="modal__music">${escapeHtml(work.music)}</p>`
      : "";

    /* CHAIN OF MEMORIES の詳細にだけ記憶の欠片を隠しておく */
    const secretShard =
      work.id === "com"
        ? `<div class="modal__shard">
             <div class="fragment" data-fragment="f09">
               <div class="fragment__shard"></div>
             </div>
           </div>`
        : "";

    /* 公式PVをYouTubeで探すリンク(直リンクではなく検索リンクなので URL が古くならない) */
    const trailerQuery = encodeURIComponent(work.title + " Kingdom Hearts trailer");
    const trailerLink = `
      <div class="theme-card__links">
        <a class="theme-card__link" href="https://www.youtube.com/results?search_query=${trailerQuery}"
           target="_blank" rel="noopener noreferrer">
          ▶ ${escapeHtml(KH_I18N.t("album.trailer.link"))}
        </a>
      </div>`;

    return `
      <span class="modal__label">${escapeHtml(work.year)} — ${escapeHtml(work.platform)}</span>
      <h2 class="modal__title" id="modal-title">${escapeHtml(work.title)}</h2>
      <p class="modal__subtitle">${escapeHtml(KH_I18N.pick(work, "subtitle"))}</p>

      <div class="modal__meta">
        ${work.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
      </div>

      <div class="modal__body">
        ${paragraphs}
      </div>

      <h3 class="modal__section-title">主なワールド</h3>
      <div class="modal__meta">${worlds}</div>

      ${musicBlock}

      <h3 class="modal__section-title">記憶のキーワード</h3>
      <div class="modal__meta">${keywords}</div>

      ${trailerLink}

      ${secretShard}
    `;
  }

  /* キャラクターの詳細 */
  function buildCharacterDetail(chara) {
    return `
      <span class="modal__label">${escapeHtml(chara.en)}</span>
      <h2 class="modal__title" id="modal-title">${escapeHtml(chara.name)}</h2>

      <div class="modal__body">
        <p>${escapeHtml(chara.role)}</p>
        <p>${escapeHtml(chara.detail)}</p>
      </div>

      <div class="modal__tags">${worksTagsHtml(chara.works)}</div>
    `;
  }

  /* ------------------------------------------------------------
     9. カードのクリックとモーダルを結びつける
     ------------------------------------------------------------ */
  function initCardEvents() {
    /* クリックとキーボード操作の両方で開けるようにする共通処理 */
    function makeOpenable(card, getHtml) {
      function open() {
        const html = getHtml(card);
        if (html) Modal.open(html);
      }

      card.addEventListener("click", open);

      /* role="button" の要素は Enter / Space の処理を自分で書く必要がある */
      card.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        open();
      });

      card.addEventListener("mouseenter", () => AudioEngine.play("hover"));
    }

    document.querySelectorAll(".work-card").forEach((card) => {
      makeOpenable(card, (el) => {
        const work = WORKS.find((w) => w.id === el.dataset.workId);
        return work ? buildWorkDetail(work) : null;
      });
    });

    document.querySelectorAll(".character-card").forEach((card) => {
      makeOpenable(card, (el) => {
        const chara = CHARACTERS[Number(el.dataset.characterIndex)];
        return chara ? buildCharacterDetail(chara) : null;
      });
    });
  }

  /* ------------------------------------------------------------
     10. ページ内の見出しへ移動するサブナビ
     ------------------------------------------------------------ */
  function initSectionNav() {
    const nav = document.getElementById("section-nav");
    if (!nav) return;

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("mouseenter", () => AudioEngine.play("hover"));
      link.addEventListener("click", () => AudioEngine.play("click"));
    });
  }

  /* ------------------------------------------------------------
     11. 起動
     main.js より後に読み込まれるため、
     描画したあとで演出と欠片を再登録する
     ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    renderWorks();
    renderWorlds();
    renderCharacters();
    renderGlossary();

    initFilter();
    initCharacterFilter();
    initCardEvents();
    initSectionNav();

    /* 後から作った要素にもスクロール演出と欠片の機能を適用する */
    Effects.refreshScrollReveal();
    MemorySystem.refresh();

    /* 言語切り替え時、すでに描画済みの作品カードの副題/概要だけ差し替える
       (カード自体を作り直すと欠片の再登録などが複雑になるため) */
    document.addEventListener("kh-lang-change", () => {
      document.querySelectorAll(".work-card").forEach((card) => {
        const work = WORKS.find((w) => w.id === card.dataset.workId);
        if (!work) return;
        const subtitleEl = card.querySelector(".work-card__subtitle");
        const descEl = card.querySelector(".work-card__desc");
        if (subtitleEl) subtitleEl.textContent = KH_I18N.pick(work, "subtitle");
        if (descEl) descEl.textContent = KH_I18N.pick(work, "summary");
      });
    });
  });
})();
