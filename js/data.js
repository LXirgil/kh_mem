/* ============================================================
   data.js — サイト全体で使うデータ定義
   作品 / ワールド / キャラクター / 用語 / 記憶の欠片 / 物語テキスト
   ここを書き換えるだけで表示内容を差し替えられる
   ============================================================ */

/* ------------------------------------------------------------
   音まわりの設定(BGM に音源ファイルを使うかどうか)
   ------------------------------------------------------------
   既定(bgmSrc: null)では js/audio.js が Web Audio API で
   合成した環境音を BGM に使う。音源ファイル(mp3 など)を
   BGM に使いたい場合だけ、ファイルを assets/audio/ に置き、
   bgmSrc にそのパスを書く。効果音は常に合成音のまま。
   音源の著作権については assets/audio/README.md を参照。
   ------------------------------------------------------------ */
const AUDIO_CONFIG = {
  /* BGM 音源ファイルのパス。null なら合成 BGM を鳴らす。
     例) "assets/audio/bgm.mp3" */
  bgmSrc: null,

  /* BGM の音量(0〜1)。合成 BGM の既定はおよそ 0.1 相当 */
  bgmVolume: 0.28,

  /* ループ再生するか */
  bgmLoop: true,

  /* 音量を上げ切る/絞り切るまでの秒数 */
  fadeInSeconds: 4,
  fadeOutSeconds: 1.2
};

/* ------------------------------------------------------------
   音楽プラットフォーム(THEME_TRACKS の各曲に付けるリンク先)
   ------------------------------------------------------------
   search : 検索 URL のひな型。{q} が曲名+アーティストに置き換わる。
            直リンクではなく検索結果ページなので URL が古くならず、
            公式配信ページへはそこから1タップで辿れる。
   ------------------------------------------------------------ */
const MUSIC_PLATFORMS = [
  { key: "spotify", label: "Spotify",       search: "https://open.spotify.com/search/{q}" },
  { key: "apple",   label: "Apple Music",   search: "https://music.apple.com/jp/search?term={q}" },
  { key: "ytmusic", label: "YouTube Music", search: "https://music.youtube.com/search?q={q}" },
  { key: "youtube", label: "YouTube",       search: "https://www.youtube.com/results?search_query={q}" }
];

/* ------------------------------------------------------------
   MEMORY THEMES ページで紹介する代表曲
   ------------------------------------------------------------
   title   : 曲名(固有名詞。事実として掲載)
   reading : 読みがな・原語
   credit  : 作曲者/アーティスト(最低限これと title・games は常に表示)
   games   : どの作品で流れる曲か
   scene   : どの場面で流れるか(短い説明)
   note    : オリジナルの解説文(このサイトの書き手による感想)
   motifs  : この曲に結びつくキーワード(タグ表示)
   audio   : 試聴用の音源ファイルのパス。null なら再生ボタンは出さず、
             プラットフォームのリンクだけを載せる紹介カードになる。
             例) "assets/audio/dearly-beloved.mp3"
             ★ 置いてよいのは自分が合法的に用意できる音源だけ。
                詳細は assets/audio/README.md を参照。
   query   : プラットフォーム検索に使う語(未指定なら title を使う)
   links   : 直リンクを入れたいときだけ { spotify:"...", apple:"..." } の形で指定。
             書いたプラットフォームだけ検索 URL の代わりに直リンクになる。
   ------------------------------------------------------------ */
const THEME_TRACKS = [
  {
    id: "dearly-beloved",
    title: "Dearly Beloved",
    reading: "ディアリー・ビラヴド",
    credit: "作曲:下村陽子",
    work: null, // 1作に紐付かない、シリーズ全体を象徴する曲
    games: "シリーズ全作(タイトル画面のメインテーマ)",
    scene: "すべての始まり、タイトル画面で静かに流れるメインテーマ。",
    sceneEn: "The main theme that quietly opens every game, playing softly on the title screen — where it all begins.",
    note:
      "作品ごとに編曲を変えながら、20年以上ずっとタイトル画面に置かれ続けている曲。" +
      "ピアノで置かれる最初の数音を聴くだけで、これから始まる旅の気配が戻ってくる。",
    noteEn:
      "A theme that has held its place on the title screen for over twenty years, rearranged anew with every game. " +
      "Just hearing its first few piano notes brings back the feeling of a journey about to begin.",
    motifs: ["メインテーマ", "ピアノ", "タイトル画面"],
    audio: null,
    query: "Dearly Beloved Kingdom Hearts 下村陽子",
    links: {}
  },
  {
    id: "hikari",
    title: "光 / Simple and Clean",
    reading: "ひかり",
    credit: "宇多田ヒカル",
    work: "kh1",
    games: "KINGDOM HEARTS(2002)主題歌",
    scene: "第1作の主題歌。英語版は「Simple and Clean」。",
    sceneEn: "The theme song of the first game; its English version is titled 'Simple and Clean.'",
    note:
      "日常の隙間にある不安と、それでも手を伸ばす気持ちを歌った曲。" +
      "シリーズが「心のつながり」を描く物語であることを、最初に決定づけた一曲。",
    noteEn:
      "A song about the quiet anxieties tucked into everyday life, and the will to reach out despite them. " +
      "The very first track to establish that this series is, at heart, a story about the bonds between hearts.",
    motifs: ["KH I", "主題歌", "宇多田ヒカル"],
    audio: null,
    query: "宇多田ヒカル 光 Simple and Clean",
    links: {}
  },
  {
    id: "passion",
    title: "Passion / Sanctuary",
    reading: "パッション",
    credit: "宇多田ヒカル",
    work: "kh2",
    games: "KINGDOM HEARTS II(2005)主題歌",
    scene: "第2作の主題歌。英語版は「Sanctuary」。",
    sceneEn: "The theme song of the second game; its English version is titled 'Sanctuary.'",
    note:
      "喪失を抱えたまま前へ進む強さを歌った曲。" +
      "ロクサスの夏から始まる II の物語の、影のある明るさによく合っている。",
    noteEn:
      "A song about the strength to move forward while still carrying loss. " +
      "It suits the shadowed brightness of KINGDOM HEARTS II, a story that opens with Roxas's summer.",
    motifs: ["KH II", "主題歌", "宇多田ヒカル"],
    audio: null,
    query: "宇多田ヒカル Passion Sanctuary",
    links: {}
  },
  {
    id: "chikai",
    title: "誓い / Don't Think Twice",
    reading: "ちかい",
    credit: "宇多田ヒカル",
    work: "kh3",
    games: "KINGDOM HEARTS III(2019)主題歌",
    scene: "第3作の主題歌。英語版は「Don't Think Twice」。",
    sceneEn: "The theme song of the third game; its English version is titled 'Don't Think Twice.'",
    note:
      "長い旅の結び目にふさわしい、穏やかで芯のあるバラード。" +
      "「光」から始まった問いに、大人になった声で答えるような曲。",
    noteEn:
      "A calm, resolute ballad befitting the knot at the end of a long journey — " +
      "as if answering, in a voice grown older, the question first raised by Hikari (\"Simple and Clean\").",
    motifs: ["KH III", "主題歌", "宇多田ヒカル"],
    audio: null,
    query: "宇多田ヒカル 誓い Don't Think Twice",
    links: {}
  },
  {
    id: "face-my-fears",
    title: "Face My Fears",
    reading: "フェイス・マイ・フィアーズ",
    credit: "宇多田ヒカル & Skrillex",
    work: "kh3",
    games: "KINGDOM HEARTS III オープニング主題歌",
    scene: "III のオープニングムービーで流れる、疾走感のある一曲。",
    sceneEn: "A driving, high-energy track that plays during KINGDOM HEARTS III's opening movie.",
    note:
      "静かなバラードが多い主題歌の系譜のなかで、ひときわ攻めた音作り。" +
      "恐れと向き合う、というシリーズの核をそのままタイトルにしている。",
    noteEn:
      "A notably bold sound within a lineage of mostly quiet ballads. " +
      "Its title puts the series' core idea — facing your fears — right on the surface.",
    motifs: ["KH III", "オープニング", "宇多田ヒカル"],
    audio: null,
    query: "宇多田ヒカル Skrillex Face My Fears",
    links: {}
  },
  {
    id: "the-other-promise",
    title: "The Other Promise",
    reading: "ジ・アザー・プロミス",
    credit: "作曲:下村陽子",
    work: "kh2",
    games: "KINGDOM HEARTS II FINAL MIX",
    scene: "ファイナルミックスで追加された、ロクサスとの戦いのテーマ。",
    sceneEn: "The battle theme for the fight against Roxas, added in the Final Mix version.",
    note:
      "ロクサスのテーマ「Roxas」を短調で組み直し、ピアノと弦で緊張感を高めたアレンジ。" +
      "戦いの曲でありながら、どこかお別れの音楽のように聞こえる。",
    noteEn:
      "A minor-key rearrangement of Roxas's theme, built up with piano and strings for tension. " +
      "Despite being a battle theme, it somehow sounds like a farewell.",
    motifs: ["ロクサス", "FINAL MIX", "バトル"],
    audio: null,
    query: "The Other Promise Kingdom Hearts 下村陽子",
    links: {}
  },
  {
    id: "destati",
    title: "Dive into the Heart -Destati-",
    reading: "ダイブ・イントゥ・ザ・ハート",
    credit: "作曲:下村陽子",
    work: "kh1",
    games: "KINGDOM HEARTS(2002)",
    scene: "冒頭「ダイブ・トゥ・ザ・ハート」で、足場が浮かび上がる場面の曲。",
    sceneEn: "Plays during the opening Dive to the Heart sequence, as the platform rises into being.",
    note:
      "ラテン語の合唱が重なる荘厳な一曲。" +
      "ステンドグラスの上に降り立ち、最初の選択を迫られるあの緊張感そのもの。",
    noteEn:
      "A majestic piece layered with Latin choir. " +
      "It's the tension of landing on stained glass and facing that first choice, given a melody.",
    motifs: ["KH I", "ダイブ・トゥ・ザ・ハート", "合唱"],
    audio: null,
    query: "Destati Kingdom Hearts 下村陽子",
    links: {}
  },
  {
    id: "sora",
    title: "Sora",
    reading: "ソラ",
    credit: "作曲:下村陽子",
    work: "bbs",
    games: "BIRTH BY SLEEP ほか",
    scene: "主人公ソラを表す、やわらかなピアノの主題。",
    sceneEn: "A gentle piano theme representing the hero, Sora.",
    note:
      "BIRTH BY SLEEP の終幕で、まだ何も知らない少年として初めて描かれるソラに寄り添う曲。" +
      "ヒーローの勇ましさより、まっすぐさと幼さが前に出た旋律。",
    noteEn:
      "A theme that stays close to Sora as he's first shown at the end of BIRTH BY SLEEP — a boy who doesn't yet know anything. " +
      "The melody leads with innocence and honesty rather than heroic bravado.",
    motifs: ["ソラ", "ピアノ", "キャラクターテーマ"],
    audio: null,
    query: "Sora Kingdom Hearts Birth by Sleep 下村陽子",
    links: {}
  },
  {
    id: "vector-to-the-heavens",
    title: "Vector to the Heavens",
    reading: "ベクター・トゥ・ザ・ヘヴンズ",
    credit: "作曲:下村陽子",
    work: "days",
    games: "358/2 DAYS",
    scene: "358/2 DAYS 終盤、シオンとの戦いで流れるテーマ。",
    sceneEn: "Plays during the battle against Xion near the end of 358/2 DAYS.",
    note:
      "「Xion」のメロディに、女声ボーカルと拍の重い伴奏を重ねた曲。" +
      "戦うほどに悲しくなる、DAYS の結末を象徴する一曲。",
    noteEn:
      "Built on Xion's melody, layered with a female vocal and a heavy, driving accompaniment. " +
      "A track that grows sadder the longer the fight goes on, symbolizing how DAYS comes to an end.",
    motifs: ["シオン", "DAYS", "バトル"],
    audio: null,
    query: "Vector to the Heavens Kingdom Hearts 358/2 Days",
    links: {}
  },
  {
    id: "musique-pour-la-tristesse-de-xion",
    title: "Musique pour la tristesse de Xion",
    reading: "ミュージック・プール・ラ・トリステス・ドゥ・シオン",
    credit: "作曲:下村陽子",
    work: "days",
    games: "358/2 DAYS",
    scene: "シオンにまつわる、静かな悲しみのテーマ。",
    sceneEn: "A quiet theme of sorrow, tied to Xion.",
    note:
      "題名はフランス語で「シオンの悲しみのための音楽」。" +
      "シーソルトアイスを分け合った夕暮れが、もう戻らないことを教えてくる曲。",
    noteEn:
      "The title is French for \"Music for Xion's Sorrow.\" " +
      "It's a song that quietly tells you the evenings spent sharing sea-salt ice cream are never coming back.",
    motifs: ["シオン", "DAYS", "夕暮れ"],
    audio: null,
    query: "Musique pour la tristesse de Xion Kingdom Hearts",
    links: {}
  }
];

/* ------------------------------------------------------------
   記憶の欠片(収集要素)の設定
   ------------------------------------------------------------ */
const MEMORY_CONFIG = {
  /* localStorage に保存するときのキー名 */
  storageKey: "kh-memory-progress",

  /* SECRET MEMORY が解放される必要数 */
  unlockThreshold: 8,

  /* 欠片の一覧。id は HTML の data-fragment 属性と対応させる */
  fragments: [
    { id: "f01", page: "TOP",       name: "デスティニーアイランドの潮騒", nameEn: "The Tide of Destiny Islands" },
    { id: "f02", page: "TOP",       name: "パオプの実", nameEn: "Paopu Fruit" },
    { id: "f03", page: "TIMELINE",  name: "扉の在り処", nameEn: "Where the Door Lies" },
    { id: "f04", page: "THEMES",    name: "ダイブ・トゥ・ザ・ハート", nameEn: "Dive to the Heart" },
    { id: "f05", page: "CROSSOVER", name: "縁のはじまり", nameEn: "Where the Bonds Begin" },
    { id: "f06", page: "TOP",       name: "キーブレードの継承", nameEn: "The Keyblade Passed On" },
    { id: "f07", page: "ALBUM",     name: "最初の冒険", nameEn: "The First Adventure" },
    { id: "f08", page: "TIMELINE",  name: "忘却の城の記憶", nameEn: "A Memory of Castle Oblivion" },
    { id: "f09", page: "ALBUM",     name: "失われた名前", nameEn: "A Name Lost" },
    { id: "f10", page: "THEMES",    name: "シーソルトアイスの味", nameEn: "The Taste of Sea-Salt Ice Cream" },
    { id: "f11", page: "ALBUM",     name: "還る場所", nameEn: "A Place to Return To" },
    { id: "f12", page: "SECRET",    name: "こころのかたち", nameEn: "The Shape of a Heart" }
  ]
};

/* ------------------------------------------------------------
   作品データ(年代順)

   hue      : カードの色味(0〜360 の色相)
   emblem   : 画像がないときに表示する SVG 紋章の種類
   image    : パッケージ画像のパス。null なら紋章を表示する
              例) "assets/works/kh1.jpg"
   category : 絞り込み用のカテゴリ
   worlds   : その作品で印象的なワールド
   music    : 主題歌(分かっているものだけ)
   ------------------------------------------------------------ */
const WORKS = [
  {
    id: "kh1",
    short: "I",
    year: "2002",
    title: "KINGDOM HEARTS",
    subtitle: "扉をひらく、最初の記憶",
    subtitleEn: "The first memory, and the door it opens",
    platform: "PlayStation 2",
    category: "main",
    hue: 205,
    emblem: "crown",
    image: "assets/works/kh1.jpg",
    tags: ["シリーズ第1作", "光と闇", "出会い"],
    worlds: ["デスティニーアイランド", "トラヴァースタウン", "ホロウバスティオン"],
    music: "「光」宇多田ヒカル",
    summary:
      "デスティニーアイランドで暮らすソラが、闇に呑まれた世界を旅する物語。キーブレードを手に、離れ離れになったリクとカイリを探します。",
    summaryEn:
      "Sora, who lives on Destiny Islands, journeys through worlds swallowed by darkness. Keyblade in hand, he searches for his scattered friends Riku and Kairi.",
    detail: [
      "シリーズの原点となる作品です。日常だったはずの島が闇に呑まれ、ソラは見知らぬ世界へと放り出されます。そこで出会ったドナルドとグーフィーとともに、閉ざされた世界の鍵穴をひとつずつ封じていきます。",
      "「心」と「絆」という、シリーズを通して描かれ続けるテーマがここで提示されます。冒険の楽しさと、大切なものを失う痛みが同居する物語構成が特徴です。"
    ],
    detailEn: [
      "The series' starting point. An island that should have been ordinary is swallowed by darkness, and Sora is cast out into unfamiliar worlds. Alongside Donald and Goofy, whom he meets along the way, he seals the keyholes of each closed-off world one by one.",
      "The themes of heart and bonds, carried through the entire series, are first introduced here. The story balances the joy of adventure with the pain of losing something precious."
    ],
    keywords: ["キーブレード", "ハートレス", "世界の鍵穴"]
  },
  {
    id: "com",
    short: "CoM",
    year: "2004",
    title: "CHAIN OF MEMORIES",
    subtitle: "積み上げるほど、崩れてゆく",
    subtitleEn: "The higher you climb, the more it crumbles",
    platform: "Game Boy Advance",
    category: "side",
    hue: 265,
    emblem: "card",
    image: "assets/works/com.jpg",
    tags: ["記憶", "カードバトル", "忘却の城"],
    worlds: ["忘却の城"],
    music: null,
    summary:
      "忘却の城を昇るごとに記憶が書き換えられていく物語。ソラが手にするはずだった思い出が、ナミネの力によって少しずつ形を変えていきます。",
    summaryEn:
      "As Sora climbs Castle Oblivion, his memories are rewritten floor by floor. The recollections he should have kept slowly change shape under Naminé's power.",
    detail: [
      "「忘却の城」を舞台に、階層を昇るたび記憶が組み替えられていく異色の作品です。カードを用いた戦闘システムが採用され、シリーズの中でも独特の手触りを持ちます。",
      "本作の主題はまさに『記憶』そのものです。思い出は本物なのか、それとも作られたものなのか——このサイトのテーマにも直結する一作です。リク編ではもうひとつの視点から城の物語が語られます。"
    ],
    detailEn: [
      "Set in Castle Oblivion, this unusual entry rearranges memories with every floor climbed. Its card-based battle system gives it a feel unlike any other game in the series.",
      "Memory itself is this game's central theme — are these memories real, or manufactured? It connects directly to the theme of this very site. Riku's story tells the castle's tale from another angle entirely."
    ],
    keywords: ["忘却の城", "ナミネ", "XIII機関"]
  },
  {
    id: "kh2",
    short: "II",
    year: "2005",
    title: "KINGDOM HEARTS II",
    subtitle: "眠りから覚める、もうひとりの物語",
    subtitleEn: "Another story awakens from sleep",
    platform: "PlayStation 2",
    category: "main",
    hue: 215,
    emblem: "star",
    image: "assets/works/kh2.jpg",
    tags: ["続編", "ロクサス", "再会"],
    worlds: ["トワイライトタウン", "レイディアントガーデン", "存在しなかった世界"],
    music: "「Passion」宇多田ヒカル",
    summary:
      "トワイライトタウンで夏休みを過ごすロクサスの日常から幕を開ける続編。穏やかな日々の裏側で、失われた記憶が静かに動き出します。",
    summaryEn:
      "The sequel opens with Roxas's summer days in Twilight Town. Beneath the calm surface of ordinary life, lost memories quietly begin to stir.",
    detail: [
      "前作から時を経て描かれる正統続編です。冒頭で描かれるロクサスの数日間が、物語全体に深い影を落としていきます。",
      "アクション性が大きく進化し、シリーズの完成形のひとつとして高く評価されています。物語面ではXIII機関との対立が本格化します。"
    ],
    detailEn: [
      "A true sequel picking up well after the first game. The days spent with Roxas at the opening cast a long shadow over the whole story.",
      "The action evolves dramatically, and the game is widely praised as one of the series' finest achievements. On the story side, the conflict with Organization XIII begins in earnest."
    ],
    keywords: ["ロクサス", "ノーバディ", "ドライブフォーム"]
  },
  {
    id: "days",
    short: "Days",
    year: "2009",
    title: "358/2 DAYS",
    subtitle: "存在しないはずの、たしかな日々",
    subtitleEn: "Days that shouldn't exist, yet were real",
    platform: "Nintendo DS",
    category: "side",
    hue: 25,
    emblem: "sun",
    image: "assets/works/days.jpg",
    tags: ["群像劇", "友情", "喪失"],
    worlds: ["存在しなかった世界", "トワイライトタウン"],
    music: null,
    summary:
      "XIII機関に属するロクサスが過ごした、記録に残らない日々の物語。アクセル、シオンと分け合った時間が、やがて大きな別れへと繋がります。",
    summaryEn:
      "The untold days Roxas spent as a member of Organization XIII. The time he shared with Axel and Xion leads, in the end, to a great parting.",
    detail: [
      "日付ごとに物語が進行する構成で、淡々とした日常の描写が積み重なっていきます。時計塔の上で三人が分け合ったシーソルトアイスの味が、シリーズ屈指の象徴的な場面として語り継がれています。",
      "「存在しない者たちの物語」でありながら、その日々は確かにあった——という切なさが全編を貫きます。"
    ],
    detailEn: [
      "The story unfolds day by day, quietly building up a picture of ordinary life. The taste of sea-salt ice cream shared by the three of them atop the clock tower has become one of the series' most iconic images.",
      "It's the story of people who technically don't exist — and yet those days were undeniably real. That ache runs through the whole game."
    ],
    keywords: ["シーソルトアイス", "時計塔", "シオン"]
  },
  {
    id: "bbs",
    short: "BbS",
    year: "2010",
    title: "BIRTH BY SLEEP",
    subtitle: "すべてが始まる、はるか以前",
    subtitleEn: "Long before it all began",
    platform: "PlayStation Portable",
    category: "main",
    hue: 175,
    emblem: "wayfinder",
    image: "assets/works/bbs.jpg",
    tags: ["前日譚", "三人の主人公", "お守り"],
    worlds: ["旅立ちの地", "キーブレード墓場", "レイディアントガーデン"],
    music: null,
    summary:
      "シリーズ第1作より約10年前を描く物語。テラ・アクア・ヴェントゥスの三人がそれぞれの旅路を辿り、やがて交わり、そして離れていきます。",
    summaryEn:
      "Set roughly ten years before the first game, this story follows Terra, Aqua, and Ventus as their separate journeys cross paths — and eventually pull them apart.",
    detail: [
      "三人の主人公それぞれの視点で同じ時間軸を辿る構成が採られています。三つの物語を通して初めて全体像が見えてくる、緻密なシナリオ設計が特徴です。",
      "アクアが作ったお守り「ウェイファインダー」に込められた、決して失われない繋がりという願いが、後の作品にまで長く響き続けます。"
    ],
    detailEn: [
      "The same timeline unfolds three times, once from each protagonist's point of view. Only after playing all three stories does the full picture come into focus — a tightly designed structure.",
      "The wish woven into the Wayfinder charm Aqua makes — a bond that can never truly be lost — echoes on through the games that follow."
    ],
    keywords: ["ウェイファインダー", "キーブレード墓場", "ゼアノート"]
  },
  {
    id: "recoded",
    short: "coded",
    year: "2010",
    title: "Re:coded",
    subtitle: "データの海に沈む、傷の記録",
    subtitleEn: "A record of wounds, sinking into a sea of data",
    platform: "Nintendo DS",
    category: "side",
    hue: 130,
    emblem: "grid",
    image: "assets/works/recoded.jpg",
    tags: ["デジタル世界", "検証", "ジミニーメモ"],
    worlds: [],
    music: null,
    summary:
      "ジミニーの記録をデータ化した世界で起きる異変を追う物語。書かれた文字の隙間から、思わぬ真実が浮かび上がります。",
    summaryEn:
      "A story of strange anomalies inside a digitized version of Jiminy's Journal. Between the lines of written text, an unexpected truth begins to surface.",
    detail: [
      "デジタル空間を舞台とした実験的な作品です。バグとして現れる異常が、物語上の「傷」と重ね合わせて描かれます。",
      "終盤に明かされる内容が、以降の作品の展開を大きく方向づける重要な一作となっています。"
    ],
    detailEn: [
      "An experimental entry set inside a digital space. The anomalies that appear as bugs are framed as wounds within the story itself.",
      "What's revealed near the end shapes the direction of every game that follows, making this a quietly pivotal entry."
    ],
    keywords: ["データ世界", "バグ", "ジミニーメモ"]
  },
  {
    id: "ddd",
    short: "3D",
    year: "2012",
    title: "DREAM DROP DISTANCE",
    subtitle: "眠りの世界で、二人は落ちてゆく",
    subtitleEn: "Two friends fall through a world of sleep",
    platform: "Nintendo 3DS",
    category: "main",
    hue: 285,
    emblem: "moon",
    image: "assets/works/ddd.jpg",
    tags: ["キーブレードマスター承認試験", "夢", "二人旅"],
    worlds: ["眠りに閉ざされた世界", "存在しなかった世界"],
    music: null,
    summary:
      "眠りについたままの世界を巡る、キーブレードマスター承認試験の物語。ソラとリクが交互に落下しながら、それぞれの夢を渡り歩きます。",
    summaryEn:
      "The story of the Mark of Mastery exam, held across worlds locked in sleep. Sora and Riku fall in turn, wandering through each other's dreams.",
    detail: [
      "ソラとリクを切り替えながら進行する独特の構成です。「眠り」と「夢」という新しいモチーフが導入されました。",
      "シリーズ全体の時間軸に関わる大きな仕掛けが明かされ、次章への橋渡しとなる作品です。"
    ],
    detailEn: [
      "A distinctive structure that alternates between Sora and Riku. New motifs of sleep and dreams enter the series here.",
      "A major twist concerning the series' entire timeline is revealed, making this the bridge to the next chapter."
    ],
    keywords: ["眠りの世界", "承認試験", "ドリームイーター"]
  },
  {
    id: "unionx",
    short: "χ",
    year: "2013",
    title: "χ SERIES",
    subtitle: "最も古い記憶、最初の争い",
    subtitleEn: "The oldest memory, the first conflict",
    platform: "Browser / Mobile",
    category: "side",
    hue: 45,
    emblem: "keyhole",
    image: "assets/works/unionx.jpg",
    tags: ["最古の時代", "五つの union", "予言"],
    worlds: [],
    music: null,
    summary:
      "シリーズで最も古い時代を描く物語。光を巡って人々が分かたれ、やがてキーブレード戦争へと向かっていきます。",
    summaryEn:
      "The earliest era in the series' timeline. People are divided over the light, and the world edges ever closer to the Keyblade War.",
    detail: [
      "ブラウザおよびスマートフォン向けに展開された作品群です。長期にわたって配信され、シリーズの根幹に関わる神話的な時代が語られました。",
      "後の作品で語られる出来事の「原因」が、この時代に置かれています。"
    ],
    detailEn: [
      "A group of titles released for browsers and mobile devices. Delivered over a long run, they tell of a mythic era at the very roots of the series.",
      "The root causes of events told in later games are all planted in this era."
    ],
    keywords: ["予言の書", "キーブレード戦争", "マスター・オブ・マスター"]
  },
  {
    id: "fragmentary",
    short: "0.2",
    year: "2017",
    title: "0.2 -A FRAGMENTARY PASSAGE-",
    subtitle: "闇の底で、ひとり歩き続ける",
    subtitleEn: "Walking on alone, at the bottom of darkness",
    platform: "PlayStation 4",
    category: "side",
    hue: 240,
    emblem: "shard",
    image: "assets/works/fragmentary.jpg",
    tags: ["短編", "闇の世界", "アクア"],
    worlds: ["旅立ちの地"],
    music: null,
    summary:
      "闇の世界をひとり彷徨い続けるアクアの物語。長い孤独のなかで、彼女はテラとヴェントゥスとの約束を胸に歩き続けます。",
    summaryEn:
      "Aqua's story of wandering alone through the Realm of Darkness. Through years of solitude, she keeps walking, holding on to her promise to Terra and Ventus.",
    detail: [
      "短編ながら、最新世代の映像表現でシリーズの世界観を描き直した作品です。深い闇の中に差す一筋の光が印象的に演出されます。",
      "『KINGDOM HEARTS III』へと直接つながる、重要な前哨となる物語です。"
    ],
    detailEn: [
      "Though short, this entry redraws the series' world with cutting-edge visuals for its time. A single ray of light piercing deep darkness makes for a striking image throughout.",
      "An important prelude that leads directly into KINGDOM HEARTS III."
    ],
    keywords: ["闇の世界", "ウェイファインダー", "アクア"]
  },
  {
    id: "kh3",
    short: "III",
    year: "2019",
    title: "KINGDOM HEARTS III",
    subtitle: "長い旅路の、その果てへ",
    subtitleEn: "To the end of a long journey",
    platform: "PlayStation 4 / Xbox One",
    category: "main",
    hue: 200,
    emblem: "crown",
    image: "assets/works/kh3.jpg",
    tags: ["完結編", "七人の守護者", "決着"],
    worlds: ["キーブレード墓場"],
    music: "「Face My Fears」「誓い」宇多田ヒカル",
    summary:
      "ダークシーカー編がひとつの結末へと向かう作品。散り散りになった仲間たちが、キーブレード墓場に再び集います。",
    summaryEn:
      "The Dark Seeker Saga heads toward its conclusion. Friends scattered across the years gather once more at the Keyblade Graveyard.",
    detail: [
      "シリーズの大きな区切りとなる作品です。歴代作品で積み重ねられてきた伏線が、次々と回収されていきます。",
      "映像表現が飛躍的に向上し、これまで語られてきた世界がより豊かに描かれました。"
    ],
    detailEn: [
      "A major turning point for the series, where threads laid down across every past game are resolved one after another.",
      "With a dramatic leap in visual fidelity, the worlds told about for so long are rendered richer than ever."
    ],
    keywords: ["七人の守護者", "XIII機関", "決着"]
  },
  {
    id: "mom",
    short: "MoM",
    year: "2020",
    title: "MELODY OF MEMORY",
    subtitle: "音とともに辿る、これまでの道",
    subtitleEn: "Retracing the journey, one melody at a time",
    platform: "Multi Platform",
    category: "side",
    hue: 320,
    emblem: "note",
    image: "assets/works/mom.jpg",
    tags: ["音楽", "総集編", "追憶"],
    worlds: ["これまでのすべてのワールド"],
    music: null,
    summary:
      "下村陽子が手がけてきた楽曲とともに、これまでの旅路を辿り直す物語。音楽そのものが記憶の入口になります。",
    summaryEn:
      "A journey back through the series, set to the music Yoko Shimomura has composed along the way. The music itself becomes a doorway into memory.",
    detail: [
      "リズムアクションという形式で、シリーズの歴史を振り返る構成になっています。楽曲を聴きながら過去の場面が甦る演出が特徴です。",
      "本サイトの企画意図——「記憶を辿る」——に最も近い体験を持つ作品といえます。"
    ],
    detailEn: [
      "Structured as a rhythm-action game, it looks back across the series' entire history. Scenes from the past come alive again as you listen to each track.",
      "In many ways, this game offers the experience closest to this very site's own idea — tracing memory itself."
    ],
    keywords: ["下村陽子", "Dearly Beloved", "振り返り"]
  },
  {
    id: "kh4",
    short: "IV",
    year: "NEXT",
    title: "KINGDOM HEARTS IV",
    subtitle: "まだ語られていない、これからの記憶",
    subtitleEn: "A memory not yet told, still to come",
    platform: "To Be Announced",
    category: "future",
    hue: 50,
    emblem: "keyhole",
    image: "assets/works/kh4.jpg",
    tags: ["新章", "開発中", "これから"],
    worlds: [],
    music: null,
    summary:
      "物語はまだ続いていきます。次に開かれる扉の向こうに、どんな記憶が待っているのかは誰にも分かりません。",
    summaryEn:
      "The story is still going. No one yet knows what memories wait beyond the next door to open.",
    detail: [
      "新章「ロストマスター編」の幕開けとなる作品として発表されました。クアドラトゥムという見慣れない街に立つソラの姿が公開されています。",
      "この空白のページこそが、旅がまだ終わっていないことの証しです。続報が出たら、この項目を書き足していきましょう。"
    ],
    detailEn: [
      "Announced as the opening chapter of a new arc, the Lost Master Arc. Sora has been shown standing in an unfamiliar city called Quadratum.",
      "This blank page is itself proof that the journey isn't over yet — we'll fill it in further as more is revealed."
    ],
    keywords: ["ロストマスター編", "クアドラトゥム", "次の扉"]
  }
];

/* ------------------------------------------------------------
   物語内の時系列(TIMELINE ページで使用)
   key = WORKS の id。chrono = 物語内の古い順、era = その作品が描く時点。
   ※ CoM と 358/2 Days は時期が重なる。0.2 は BbS 直後から始まり
     終盤で KH3 の直前に繋がる、という含みがある。
   ------------------------------------------------------------ */
const KH_ERA = {
  unionx:      { chrono: 1,  era: "シリーズ最古 ―― おとぎ話の時代とキーブレード戦争", eraEn: "Earliest in the series — the age of fairy tales and the Keyblade War" },
  bbs:         { chrono: 2,  era: "『KINGDOM HEARTS』の約10年前", eraEn: "About ten years before KINGDOM HEARTS" },
  fragmentary: { chrono: 3,  era: "BbS の直後 ―― 終盤は『III』の直前へ直結", eraEn: "Right after BIRTH BY SLEEP — its ending connects directly into the moment before III" },
  kh1:         { chrono: 4,  era: "物語の起点", eraEn: "Where the story begins" },
  com:         { chrono: 5,  era: "『KINGDOM HEARTS』の直後 ―― 忘却の城", eraEn: "Right after KINGDOM HEARTS — Castle Oblivion" },
  days:        { chrono: 6,  era: "KH1後〜『II』の直前(CoM と並行するロクサスの日々)", eraEn: "After KH1, up to just before II (Roxas's days, running parallel to CHAIN OF MEMORIES)" },
  kh2:         { chrono: 7,  era: "『358/2 Days』の終わりから", eraEn: "Picks up from the end of 358/2 DAYS" },
  recoded:     { chrono: 8,  era: "『II』の少し後 ―― ジミニーの日誌のデータ世界", eraEn: "Shortly after II — the digitized world of Jiminy's Journal" },
  ddd:         { chrono: 9,  era: "Re:coded の後、『III』の前 ―― マーク・オブ・マスタリー試験", eraEn: "After Re:coded, before III — the Mark of Mastery exam" },
  kh3:         { chrono: 10, era: "DDD の後 ―― ダークシーカー編・完結", eraEn: "After DDD — the Dark Seeker Saga concludes" },
  mom:         { chrono: 11, era: "『III』の直後 ―― カイリが記憶を辿る", eraEn: "Right after III — Kairi retraces her memories" },
  kh4:         { chrono: 12, era: "『III』の後 ―― 新章「ロストマスター編」", eraEn: "After III — the new Lost Master Arc begins" }
};

/* ------------------------------------------------------------
   ワールド

   works  : そのワールドが登場する主な作品(WORKS の id の配列)。
            カメオ的な再登場まではすべて網羅していない場合がある。
   image  : 風景画像などのパス。null なら emblem に指定した SVG 紋章を表示する
            例) "assets/worlds/destiny-islands.jpg"

   シリーズオリジナルのワールドと、ディズニー作品を舞台にしたワールドの
   両方を、登場する年代順に近い形で掲載している。
   ------------------------------------------------------------ */
const WORLDS = [
  /* --- シリーズオリジナルのワールド --- */
  {
    name: "デスティニーアイランド",
    en: "DESTINY ISLANDS",
    emblem: "island",
    hue: 30,
    image: "assets/worlds/destiny-islands.png",
    works: ["kh1", "kh2", "kh3"],
    text: "ソラたちが暮らす南の島。外の世界に憧れた三人がいかだを作っていた場所であり、すべての旅の出発点。",
    textEn: "The southern island where Sora and his friends live. Dreaming of worlds beyond their own, the three of them built a raft here — the starting point of every journey."
  },
  {
    name: "トラヴァースタウン",
    en: "TRAVERSE TOWN",
    emblem: "lamp",
    hue: 200,
    image: "assets/worlds/traverse-town.png",
    works: ["kh1", "kh2"],
    text: "世界を失った者たちが流れ着く、夜だけの街。旅のはじまりに訪れる、静かな中継地点。",
    textEn: "A town of eternal night where those who have lost their worlds wash ashore. A quiet waypoint visited at the start of the journey."
  },
  {
    name: "ホロウバスティオン",
    en: "HOLLOW BASTION",
    emblem: "castle",
    hue: 250,
    image: "assets/worlds/hollow-bastion.png",
    works: ["kh1", "kh2", "bbs"],
    text: "闇に侵された巨大な城。かつては光に満ちたレイディアントガーデンと呼ばれる庭園都市だった。",
    textEn: "A vast castle overrun by darkness. It was once Radiant Garden, a garden city filled with light."
  },
  {
    name: "忘却の城",
    en: "CASTLE OBLIVION",
    emblem: "castleWhite",
    hue: 265,
    image: "assets/worlds/castle-oblivion.png",
    works: ["com"],
    text: "昇るほどに記憶を失っていく白い城。手にした思い出が、いつの間にか別のものにすり替わっていく。",
    textEn: "A white castle where memories fade the higher you climb. The recollections you carry are quietly swapped for others before you notice."
  },
  {
    name: "トワイライトタウン",
    en: "TWILIGHT TOWN",
    emblem: "clocktower",
    hue: 28,
    image: "assets/worlds/twilight-town.png",
    works: ["kh2", "days", "ddd", "kh3"],
    text: "いつも夕暮れが続く街。時計塔の上で分け合うシーソルトアイスが、失われた日々の象徴となる。",
    textEn: "A town caught in an endless sunset. Sea-salt ice cream shared atop the clock tower becomes a symbol of days now lost."
  },
  {
    name: "存在しなかった世界",
    en: "THE WORLD THAT NEVER WAS",
    emblem: "moonHeart",
    hue: 280,
    image: "assets/worlds/the-world-that-never-was.png",
    works: ["kh2", "days", "kh3"],
    text: "雨の降りやまない、ノーバディたちの街。空には人工のキングダムハーツが月のように浮かんでいる。",
    textEn: "A city of ceaseless rain, home to the Nobodies. An artificial Kingdom Hearts hangs in the sky like a moon."
  },
  {
    name: "旅立ちの地",
    en: "LAND OF DEPARTURE",
    emblem: "gate",
    hue: 180,
    image: "assets/worlds/land-of-departure.png",
    works: ["bbs", "fragmentary"],
    text: "キーブレード使いが修行を積んだ場所。テラ・アクア・ヴェントゥスの三人が旅立った、始まりの地。",
    textEn: "The place where Keyblade wielders once trained — the starting ground from which Terra, Aqua, and Ventus set out."
  },
  {
    name: "キーブレード墓場",
    en: "KEYBLADE GRAVEYARD",
    emblem: "graveyard",
    hue: 40,
    image: "assets/worlds/keyblade-graveyard.jpg",
    works: ["bbs", "kh3"],
    text: "無数のキーブレードが刺さったまま風にさらされる荒野。かつての戦争と、来るべき決着の舞台。",
    textEn: "A windswept wasteland where countless Keyblades still stand planted in the ground — the stage of a war long past, and of the reckoning still to come."
  },

  /* --- ディズニー作品を舞台にしたワールド --- */
  {
    name: "ワンダーランド",
    en: "WONDERLAND",
    emblem: "teacup",
    hue: 300,
    image: "assets/worlds/wonderland.png",
    works: ["kh1"],
    text: "上下も大きさもあべこべな不思議の国。白ウサギを追いかけたアリスが迷い込んだ場所。",
    textEn: "A topsy-turvy wonderland where up, down, and size mean nothing. The place Alice stumbled into while chasing the White Rabbit."
  },
  {
    name: "オリンポスコロシアム",
    en: "OLYMPUS COLISEUM",
    emblem: "column",
    hue: 15,
    image: "assets/worlds/olympus-coliseum.png",
    works: ["kh1", "kh2", "bbs", "kh3"],
    text: "英雄を目指す者たちが戦う闘技場。ヘラクレスとその師フィルのもとで、ソラも力を試す。",
    textEn: "An arena where those who aspire to be heroes do battle. Sora tests his strength here too, under Hercules and his trainer Phil."
  },
  {
    name: "ディープジャングル",
    en: "DEEP JUNGLE",
    emblem: "jungleLeaf",
    hue: 140,
    image: "assets/worlds/deep-jungle.png",
    works: ["kh1"],
    text: "人の手が入らない深い密林。ターザンとその家族が暮らす、緑に覆われた世界。",
    textEn: "A deep jungle untouched by civilization, the green-covered world where Tarzan and his family live."
  },
  {
    name: "アグラバー",
    en: "AGRABAH",
    emblem: "genieLamp",
    hue: 42,
    image: "assets/worlds/agrabah.png",
    works: ["kh1", "kh2"],
    text: "砂漠に広がる王国の街。ランプの魔人ジーニーと、泥棒アラジンの物語の舞台。",
    textEn: "A kingdom city spread across the desert — the stage for the story of the Genie of the lamp and the thief Aladdin."
  },
  {
    name: "モンストロ",
    en: "MONSTRO",
    emblem: "whaleWave",
    hue: 205,
    image: "assets/worlds/monstro.jpg",
    works: ["kh1"],
    text: "海を漂う巨大な鯨の腹の中。ゼペットとピノキオを探して、ソラたちがその内部に迷い込む。",
    textEn: "The belly of a giant whale adrift at sea. Sora and friends wander inside it, searching for Geppetto and Pinocchio."
  },
  {
    name: "アトランティカ",
    en: "ATLANTICA",
    emblem: "shell",
    hue: 190,
    image: "assets/worlds/atlantica.png",
    works: ["kh1", "kh2"],
    text: "海の底に広がる人魚の王国。アリエルが暮らす、歌と波に満ちた世界。",
    textEn: "A mermaid kingdom spread across the ocean floor, the world of song and waves where Ariel lives."
  },
  {
    name: "ハロウィンタウン",
    en: "HALLOWEEN TOWN",
    emblem: "pumpkinFace",
    hue: 275,
    image: "assets/worlds/halloween-town.png",
    works: ["kh1", "kh2"],
    text: "かぼちゃの明かりが灯る、不気味で愛らしい街。ジャック・スケリントンが治める「引っかけ祭りの王」の国。",
    textEn: "An eerie yet endearing town lit by jack-o'-lanterns, ruled by Jack Skellington, the Pumpkin King."
  },
  {
    name: "ネバーランド",
    en: "NEVERLAND",
    emblem: "sparkle",
    hue: 120,
    image: "assets/worlds/neverland.png",
    works: ["kh1", "com"],
    text: "決して大人にならない島。ピーター・パンとティンカー・ベルが暮らす、妖精の粉が舞う空の世界。",
    textEn: "An island where no one ever grows up — a sky-bound world of fairy dust, home to Peter Pan and Tinker Bell."
  },
  {
    name: "ビーストキャッスル",
    en: "BEAST'S CASTLE",
    emblem: "rose",
    hue: 335,
    image: "assets/worlds/beast's-castle.jpg",
    works: ["kh2"],
    text: "呪いをかけられた野獣と、彼を想うベルが暮らす古城。枯れゆく一輪のバラが、呪いの期限を示す。",
    textEn: "An old castle where the cursed Beast and the devoted Belle live. A single wilting rose marks how long the curse has left to run."
  },
  {
    name: "100エーカーの森",
    en: "100 ACRE WOOD",
    emblem: "honeypot",
    hue: 38,
    image: "assets/worlds/100-acre-wood.png",
    works: ["kh1", "kh2", "kh3"],
    text: "絵本の中に広がる、くまのプーさんたちが暮らすのどかな森。ソラの心の奥にひっそりと存在している。",
    textEn: "A peaceful storybook forest where Winnie the Pooh and friends live, tucked quietly away in the depths of Sora's heart."
  },
  {
    name: "ポートロイヤル",
    en: "PORT ROYAL",
    emblem: "anchor",
    hue: 32,
    image: "assets/worlds/port-royal.png",
    works: ["kh2"],
    text: "海賊たちが行き交うカリブの港町。呪われた黄金を巡る、ジャック・スパロウたちの物語の舞台。",
    textEn: "A Caribbean port town where pirates come and go — the stage for Jack Sparrow's story of cursed gold."
  },
  {
    name: "タイムレスリバー",
    en: "TIMELESS RIVER",
    emblem: "clocktower",
    hue: 220,
    image: "assets/worlds/timeless-river.png",
    works: ["kh2"],
    text: "白黒の時代へと遡った、過去のディズニータウン。若き日のミッキーが活躍する時間を旅する。",
    textEn: "A black-and-white Disney town from the past, traveled back to in time — an era where a young Mickey takes the stage."
  },
  {
    name: "スペースパラノイド",
    en: "SPACE PARANOIDS",
    emblem: "grid",
    hue: 195,
    image: "assets/worlds/space-paranoids.png",
    works: ["kh2"],
    text: "コンピューターの内部に広がるデジタル空間。プログラムたちが行き交う、光の格子で出来た世界。",
    textEn: "A digital space inside a computer, a world built of grids of light where programs move about."
  },
  {
    name: "プライド・ランド",
    en: "PRIDE LANDS",
    emblem: "pawPrint",
    hue: 34,
    image: "assets/worlds/pride-lands.jpg",
    works: ["kh2"],
    text: "広大なサバンナに広がる、百獣の王の国。動物の姿になったソラが、シンバとともに大地を駆ける。",
    textEn: "The kingdom of the king of beasts, spread across a vast savanna. Transformed into an animal, Sora runs the land alongside Simba."
  },
  {
    name: "ザ・ランド・オブ・ドラゴン",
    en: "LAND OF DRAGONS",
    emblem: "dragonCrest",
    hue: 355,
    image: "assets/worlds/land-of-dragons.jpg",
    works: ["kh2"],
    text: "万里の長城が連なる大地。男装したムーランとともに、フン族の侵攻に立ち向かう。",
    textEn: "A land traced by the Great Wall, where Sora joins the disguised Mulan to stand against the Huns' invasion."
  },
  {
    name: "サンフランソウキョウ",
    en: "SAN FRANSOKYO",
    emblem: "circuitTower",
    hue: 8,
    image: "assets/worlds/san-fransokyo.png",
    works: ["kh3"],
    text: "和と洋が入り混じる近未来都市。ヒロとベイマックスが、街を見守るヒーローたちとともに現れる。",
    textEn: "A near-future city blending East and West, where Hiro and Baymax appear alongside the heroes watching over the town."
  },
  {
    name: "キングダム・オブ・コロナ",
    en: "KINGDOM OF CORONA",
    emblem: "rapunzelTower",
    hue: 46,
    image: "assets/worlds/kingdom-of-corona.png",
    works: ["kh3"],
    text: "高い塔に幽閉されたラプンツェルが暮らす王国。金色の髪と、無数のランタンの光が印象的な世界。",
    textEn: "A kingdom where Rapunzel lives, shut away in a high tower — a world defined by golden hair and countless floating lanterns."
  },
  {
    name: "アレンデール",
    en: "ARENDELLE",
    emblem: "snowflake",
    hue: 198,
    image: "assets/worlds/arendelle.png",
    works: ["kh3"],
    text: "氷の力を持つエルサが治める王国。姉妹の絆をめぐる物語が、雪と氷の景色の中で描かれる。",
    textEn: "A kingdom ruled by Elsa, who wields the power of ice. A story of sisterly bonds unfolds amid a landscape of snow and ice."
  },
  {
    name: "ザ・カリビアン",
    en: "THE CARIBBEAN",
    emblem: "shipWheel",
    hue: 26,
    image: "assets/worlds/the-caribbean.png",
    works: ["kh3"],
    text: "呪われた心臓の秘宝を巡る、海賊たちの物語の舞台。ポートロイヤルの物語の続きが描かれる。",
    textEn: "The stage for the pirates' tale of a cursed heart — a continuation of the story that began in Port Royal."
  },
  {
    name: "トイボックス",
    en: "TOY BOX",
    emblem: "toyBlock",
    hue: 4,
    image: "assets/worlds/toy-box.png",
    works: ["kh3"],
    text: "おもちゃたちが自分の意志で動き出す世界。ウッディやバズとともに、迷子のおもちゃを探す。",
    textEn: "A world where toys move by their own will. Sora searches for a lost toy alongside Woody and Buzz."
  },
  {
    name: "モンストロポリス",
    en: "MONSTROPOLIS",
    emblem: "doorway",
    hue: 165,
    image: "assets/worlds/monstropolis.png",
    works: ["kh3"],
    text: "モンスターたちが暮らす街。無数のドアが、子供部屋と怪物の世界とを繋いでいる。",
    textEn: "A city where monsters live, connected to children's bedrooms by countless doors."
  }
];

/* ------------------------------------------------------------
   キャラクター

   group  : 一覧をまとめる分類
            guardian(主人公たち) / org13(XIII機関) / related(機関に関わる二人)
            wayfinder(ウェイファインダーの仲間) / companion(王様と旅の仲間)
            villain(敵対者) / disney(ディズニーの仲間たち)
   works  : 主に登場する作品(WORKS の id の配列)。カメオ出演まで
            すべて網羅しているわけではなく、主要な登場作品を示す。
   image  : 立ち絵などの画像パス。null なら紋章、紋章も無ければ
            頭文字を表示する(3段階のフォールバック)
            例) "assets/characters/sora.png"
   ------------------------------------------------------------ */
const CHARACTERS = [
  /* ================= 主人公たち ================= */
  {
    initial: "S",
    name: "ソラ",
    en: "SORA",
    hue: 205,
    image: "assets/characters/sora.webp",
    group: "guardian",
    works: ["kh1", "com", "kh2", "ddd", "kh3", "mom", "kh4"],
    role: "キーブレードを継いだ少年。まっすぐな心を武器に、失った友を探し続ける主人公。",
    roleEn: "The boy who inherited the Keyblade. Armed with an unwavering heart, he never stops searching for the friends he's lost.",
    detail:
      "シリーズの主人公として、一貫して「他者のために動く」という姿勢を貫きます。強さの源は特別な力ではなく、仲間との繋がりそのものとして描かれます。彼の心の中には、いくつもの他者の記憶が眠っています。",
    detailEn:
      "As the series' protagonist, Sora consistently acts for the sake of others. His strength comes not from any special power but from the bonds he shares with his friends. Within his heart sleep the memories of many others."
  },
  {
    initial: "R",
    name: "リク",
    en: "RIKU",
    hue: 250,
    image: "assets/characters/riku.webp",
    group: "guardian",
    works: ["kh1", "com", "kh2", "ddd", "kh3", "mom"],
    role: "ソラの親友。外の世界に憧れ、力を求めて闇に触れた末に、自らの過ちと向き合い続ける。",
    roleEn: "Sora's best friend. Drawn to the world beyond his island and to power itself, he touches darkness — and spends the rest of his journey confronting that choice.",
    detail:
      "一度は道を踏み外しながらも、自らの選択の責任を引き受け続ける人物です。「闇に落ちても、心まで奪われるとは限らない」というテーマを体現し、後にはその闇を力として使いこなすようになります。",
    detailEn:
      "Though he once strayed from the path, Riku takes full responsibility for what he chose. He embodies the idea that falling into darkness doesn't mean losing your heart, and later learns to wield that very darkness as strength."
  },
  {
    initial: "K",
    name: "カイリ",
    en: "KAIRI",
    hue: 330,
    image: "assets/characters/kairi.webp",
    group: "guardian",
    works: ["kh1", "com", "kh2", "kh3", "mom"],
    role: "ソラとリクの帰る場所であり続ける少女。七人の光の姫君のひとり。",
    roleEn: "The girl who remains the place Sora and Riku always return to. One of the Seven Princesses of Heart.",
    detail:
      "物語の中で「帰るべき場所」の象徴として描かれます。心に闇を持たない光の姫君として狙われる立場でありながら、後の作品では自らキーブレードを取り、戦う道を選びます。",
    detailEn:
      "Kairi is portrayed throughout the story as a symbol of home. Though targeted as a Princess of Heart untouched by darkness, she later takes up a Keyblade of her own and chooses to fight."
  },

  /* ================= XIII機関(番号順) ================= */
  {
    initial: "X",
    name: "ゼムナス",
    en: "XEMNAS",
    hue: 210,
    image: "assets/characters/xemnas.webp",
    group: "org13",
    works: ["com", "kh2", "kh3"],
    role: "XIII機関の首領。「超越者」と呼ばれ、機関を率いてキングダムハーツの完成を目指す。",
    roleEn: "Leader of Organization XIII, known as the Superior. He commands the Organization in its pursuit of completing Kingdom Hearts.",
    detail: "ゼアノートのノーバディ。心を持たないはずの身でありながら、誰よりも「心とは何か」を求め続けた人物です。",
    detailEn: "Xehanort's Nobody. Though he should have no heart at all, he pursues the question of what a heart truly is more relentlessly than anyone."
  },
  {
    initial: "X",
    name: "シグバール",
    en: "XIGBAR",
    hue: 275,
    image: "assets/characters/xigbar.webp",
    group: "org13",
    works: ["kh2", "kh3"],
    role: "二丁の弓銃を操る狙撃手。飄々とした態度の裏に、シリーズ最大級の秘密を隠している。",
    roleEn: "A sharpshooter who wields twin arrowguns. Behind his easygoing manner lies one of the series' biggest secrets.",
    detail: "機関では古参の一人。実はゼアノートに関わる特別な因縁を持つ人物であることが、後の作品で明かされます。",
    detailEn: "One of the Organization's veteran members. Later games reveal he shares a special, deep connection with Xehanort."
  },
  {
    initial: "X",
    name: "ザルディン",
    en: "XALDIN",
    hue: 150,
    image: "assets/characters/xaldin.webp",
    group: "org13",
    works: ["kh2"],
    role: "六本の槍を操る「旋風の槍使い」。冷静沈着で、獲物を追い詰める手腕に長ける。",
    roleEn: "The 'Whirlwind Lancer,' who wields six spears. Calm and calculating, he excels at cornering his prey.",
    detail: "ビーストキャッスルに潜み、野獣の心の闇につけ込もうと画策する場面が印象的なメンバーです。",
    detailEn: "A memorable member who lurks in Beast's Castle, scheming to exploit the darkness in the Beast's heart."
  },
  {
    initial: "V",
    name: "ヴィクセン",
    en: "VEXEN",
    hue: 195,
    image: "assets/characters/vexen.webp",
    group: "org13",
    works: ["com", "kh3"],
    role: "機関の研究者。「氷の学究」の異名を持ち、レプリカやノーバディの研究を進める。",
    roleEn: "A researcher for the Organization known as the 'Studious One,' who advances the study of replicas and Nobodies.",
    detail: "忘却の城でアクセルに消されますが、『III』では新生XIII機関に加わり、やがて自らの過ちと向き合います。",
    detailEn: "Erased by Axel in Castle Oblivion, he later joins the reborn Organization XIII in KINGDOM HEARTS III and eventually confronts his own mistakes."
  },
  {
    initial: "L",
    name: "レクセウス",
    en: "LEXAEUS",
    hue: 25,
    image: "assets/characters/lexaeus.webp",
    group: "org13",
    works: ["com", "kh2"],
    role: "巨大な戦斧を振るう、寡黙で力強い「静かなる豪傑」。",
    roleEn: "A quiet, powerful 'Silent Hero' who wields a massive battle axe.",
    detail: "言葉少なながら、確かな信念を持って行動する、機関の中でも異色の存在です。",
    detailEn: "A man of few words but firm conviction — an unusual presence even among the Organization."
  },
  {
    initial: "Z",
    name: "ゼクシオン",
    en: "ZEXION",
    hue: 260,
    image: "assets/characters/zexion.webp",
    group: "org13",
    works: ["com", "kh2"],
    role: "一冊の本(幻書)を武器に幻惑を操る、「策謀家」と呼ばれる知恵者。",
    roleEn: "A scholarly 'Cloaked Schemer' who wields illusions through a single tome, the Lexicon.",
    detail: "直接戦うよりも、情報と幻術で状況を支配することを好む人物として描かれます。",
    detailEn: "Portrayed as someone who prefers to control a situation through information and illusion rather than direct combat."
  },
  {
    initial: "S",
    name: "サイクス",
    en: "SAÏX",
    hue: 230,
    image: "assets/characters/saix.webp",
    group: "org13",
    works: ["kh2", "kh3"],
    role: "機関の実質的な副官。「月に舞う魔人」と呼ばれ、月の光を浴びて怒りを力に変える。",
    roleEn: "The Organization's de facto second-in-command, the 'Luna Diviner,' who channels moonlight into rage-fueled power.",
    detail: "ロクサスやアクセルとかつて近しい間柄だったことが、後の物語に重い意味を持たせます。",
    detailEn: "His past closeness with Roxas and Axel gives later chapters of the story real emotional weight."
  },
  {
    initial: "A",
    name: "アクセル",
    en: "AXEL",
    hue: 12,
    image: "assets/characters/axel.webp",
    group: "org13",
    works: ["com", "kh2", "days", "ddd", "kh3", "mom"],
    role: "炎を操るXIII機関のメンバー。「心に刻んどけよ」が口癖の、飄々とした青年。",
    roleEn: "A fire-wielding member of Organization XIII, a breezy young man whose catchphrase is 'Got it memorized?'",
    detail:
      "心を持たないはずのノーバディでありながら、誰よりも友を想う行動を取り続けます。心が無いという設定への反証として立ち続ける、シリーズ屈指の人気キャラクターです。",
    detailEn:
      "Though he's a Nobody who shouldn't have a heart, he keeps acting out of care for his friends more than anyone. One of the series' most beloved characters, he stands as living proof against the idea that Nobodies have no hearts."
  },
  {
    initial: "D",
    name: "デミックス",
    en: "DEMYX",
    hue: 185,
    image: "assets/characters/demyx.webp",
    group: "org13",
    works: ["kh2", "kh3"],
    role: "水を操るシタール奏者。「調べの夜想曲」と呼ばれるが、戦意はいたって低い。",
    roleEn: "A sitar-playing 'Melodious Nocturne' who wields water — though his will to fight is famously low.",
    detail: "機関の中では珍しく飄々とした、どこか気の抜けた雰囲気を持つメンバーです。",
    detailEn: "A rare member of the Organization with an easygoing, almost slack demeanor."
  },
  {
    initial: "L",
    name: "ルクソード",
    en: "LUXORD",
    hue: 45,
    image: "assets/characters/luxord.webp",
    group: "org13",
    works: ["kh2", "kh3"],
    role: "時間とカードを操る「運命の賭博師」。あらゆる勝負を意のままに操ろうとする。",
    roleEn: "The 'Gambler of Fate,' who manipulates time and cards, always trying to bend every contest to his will.",
    detail: "紳士的な物腰の裏で、勝つためにはどんな手段も辞さない冷徹さを併せ持ちます。",
    detailEn: "Behind his gentlemanly manner lies a coldness willing to use any means necessary to win."
  },
  {
    initial: "M",
    name: "マールーシャ",
    en: "MARLUXIA",
    hue: 340,
    image: "assets/characters/marluxia.webp",
    group: "org13",
    works: ["com", "kh3"],
    role: "巨大な鎌を操る「優雅な暗殺者」。花の力を使い、機関内部で野心を燃やす。",
    roleEn: "The 'Graceful Assassin,' who wields a giant scythe and the power of flowers, burning with ambition inside the Organization.",
    detail: "忘却の城でナミネの力を利用し、機関の頂点に立とうと画策する策謀家です。『III』では新生XIII機関の一員として、キーブレード墓場で再び立ちはだかります。",
    detailEn: "A schemer who exploits Naminé's power in Castle Oblivion in his bid to seize control of the Organization. In KINGDOM HEARTS III he returns as a member of the reborn Organization XIII, standing in Sora's way once more at the Keyblade Graveyard."
  },
  {
    initial: "L",
    name: "ラクシーヌ",
    en: "LARXENE",
    hue: 55,
    image: "assets/characters/larxene.webp",
    group: "org13",
    works: ["com", "kh3"],
    role: "雷を操る、機関唯一の女性メンバー。「獰猛なニンフ」と呼ばれる冷酷な性格。",
    roleEn: "The Organization's only female member, the 'Savage Nymph,' who wields lightning with a cold, cruel streak.",
    detail: "率直で辛辣な物言いを崩さず、忘却の城ではマールーシャの計画に加担します。『III』でも新生XIII機関の一員として、再びソラたちの前に現れます。",
    detailEn: "Blunt and sharp-tongued, she aids Marluxia's scheme in Castle Oblivion. She too returns as a member of the reborn Organization XIII in KINGDOM HEARTS III."
  },
  {
    initial: "R",
    name: "ロクサス",
    en: "ROXAS",
    hue: 40,
    image: "assets/characters/roxas.webp",
    group: "org13",
    works: ["com", "kh2", "days", "ddd", "kh3", "mom"],
    role: "ソラのノーバディとして生まれた少年。存在しないはずの日々のなかで、自分だけの記憶を手に入れる。",
    roleEn: "A boy born as Sora's Nobody, who gains memories all his own during days that shouldn't exist.",
    detail:
      "「自分は本物なのか」という問いを抱え続ける人物です。XIII機関で過ごした日々は記録に残りませんが、アクセルとシオンと過ごした時間の重みは、物語全体に響き続けます。",
    detailEn:
      "Roxas carries the question of whether he's real with him always. His days in Organization XIII go unrecorded, but the weight of the time he spent with Axel and Xion echoes through the entire story."
  },

  /* ================= 機関に関わる二人 ================= */
  {
    initial: "N",
    name: "ナミネ",
    en: "NAMINÉ",
    hue: 195,
    image: "assets/characters/namine.webp",
    group: "related",
    works: ["com", "kh2", "days"],
    role: "カイリのノーバディ。人の記憶を書き換え、繋ぎ直す力を持つ少女。",
    roleEn: "Kairi's Nobody, a girl with the power to rewrite and reconnect people's memories.",
    detail:
      "忘却の城でソラの記憶を作り変えてしまった張本人でありながら、その罪を自覚し、壊した鎖を繋ぎ直そうとします。「記憶」というテーマを最も直接的に担う人物です。",
    detailEn:
      "Though she's the one who rewrote Sora's memories in Castle Oblivion, she comes to recognize that wrongdoing and tries to mend the chain of memory she broke. She carries the series' theme of memory most directly."
  },
  {
    initial: "X",
    name: "シオン",
    en: "XION",
    hue: 220,
    image: "assets/characters/xion.webp",
    group: "related",
    works: ["days", "kh3"],
    role: "ソラの記憶から作られたレプリカ。ロクサス、アクセルとともに短い日々を過ごす。",
    roleEn: "A replica made from Sora's memories, who spends a short span of days alongside Roxas and Axel.",
    detail:
      "存在そのものが誰かの記憶の写しであるという、痛切な立場に置かれた人物です。彼女が消えたとき、その記憶もまた消えてしまう——という残酷さが、作品全体の主題と重なります。",
    detailEn:
      "Her very existence is a copy of someone else's memory — a painfully fragile position. The cruelty of her own memory vanishing along with her echoes the story's central theme."
  },

  /* ================= ウェイファインダーの仲間 ================= */
  {
    initial: "E",
    name: "エラクゥス",
    en: "MASTER ERAQUS",
    hue: 215,
    image: "assets/characters/master-eraqus.webp",
    group: "wayfinder",
    works: ["bbs", "kh3"],
    role: "テラ・アクア・ヴェントゥスの師であるキーブレードマスター。闇を強く恐れ、排除しようとする。",
    roleEn: "The Keyblade Master who trains Terra, Aqua, and Ventus. He fears darkness deeply and seeks to eliminate it wherever he finds it.",
    detail: "弟子たちを想う気持ちに嘘はないものの、その頑なさがかえって悲劇を招いてしまう人物です。",
    detailEn: "His care for his students is genuine, but his rigidity ends up inviting tragedy."
  },
  {
    initial: "A",
    name: "アクア",
    en: "AQUA",
    hue: 190,
    image: "assets/characters/aqua.webp",
    group: "wayfinder",
    works: ["bbs", "fragmentary", "kh3", "mom"],
    role: "キーブレードマスターの称号を得た女性。仲間を救うため闇の世界へ身を投じる。",
    roleEn: "A woman who earns the title of Keyblade Master and throws herself into the Realm of Darkness to save her friends.",
    detail:
      "自己犠牲と責任感の象徴として描かれます。果てのない闇のなかでも、テラとヴェントゥスへの想いとウェイファインダーを手放さなかった姿が、強い印象を残します。",
    detailEn:
      "A symbol of self-sacrifice and responsibility. Even in endless darkness, she never lets go of her thoughts of Terra and Ventus, or of her Wayfinder — an image that leaves a lasting impression."
  },
  {
    initial: "T",
    name: "テラ",
    en: "TERRA",
    hue: 32,
    image: "assets/characters/terra.webp",
    group: "wayfinder",
    works: ["bbs", "kh3", "mom"],
    role: "力を求めるあまり闇に隙を突かれた青年。身体を奪われてなお、心だけで抗い続ける。",
    roleEn: "A young man whose hunger for power leaves an opening for darkness to exploit. Even after his body is taken from him, he keeps resisting through will alone.",
    detail:
      "善良でありながら、その真面目さゆえに追い詰められていく人物です。身体を失ったあとも意志だけで戦い続ける姿が、「心の強さ」というテーマを象徴します。",
    detailEn:
      "Good-hearted but driven into a corner by his own seriousness, Terra embodies the theme of strength of heart by continuing to fight with nothing but his will after losing his body."
  },
  {
    initial: "V",
    name: "ヴェントゥス",
    en: "VENTUS",
    hue: 100,
    image: "assets/characters/ventus.webp",
    group: "wayfinder",
    works: ["bbs", "kh3", "mom"],
    role: "心を二つに裂かれた少年。眠りについた心は、ソラの中に預けられている。",
    roleEn: "A boy whose heart was split in two; the sleeping half of it is entrusted within Sora.",
    detail:
      "闇を切り離されたことで壊れかけた心を、ソラに救われた過去を持ちます。ロクサスとよく似た姿をしていることが、シリーズの大きな謎のひとつとして長く語られました。",
    detailEn:
      "He was once saved by Sora after darkness nearly broke his fractured heart. His striking resemblance to Roxas was one of the series' great long-running mysteries."
  },
  {
    initial: "V",
    name: "ヴァニタス",
    en: "VANITAS",
    hue: 350,
    image: "assets/characters/vanitas.webp",
    group: "wayfinder",
    works: ["bbs", "kh3", "mom"],
    role: "ヴェントゥスから切り離された闇そのもの。負の感情からアンヴァースを生み出す。",
    roleEn: "The darkness split away from Ventus himself, who creates the Unversed out of negative emotion.",
    detail:
      "「光には必ず影がある」というシリーズの主題を、最も直接的な形で体現した存在です。ヴェントゥスと再び一つになることを求め続けます。",
    detailEn:
      "The most direct embodiment of the series' theme that light always casts a shadow. He continually seeks to become one with Ventus again."
  },
  {
    initial: "X",
    name: "ゼアノート",
    en: "XEHANORT",
    hue: 275,
    image: "assets/characters/xehanort.webp",
    group: "wayfinder",
    works: ["bbs", "ddd", "kh3", "mom"],
    role: "永い時間をかけて計画を進める老練なキーブレード使い。シリーズ最大の対立軸。",
    roleEn: "A veteran Keyblade wielder advancing his plans across a vast span of time — the series' greatest antagonist.",
    detail:
      "「心とは何か」を問い続けるという点では主人公と同じ問いに立ちながら、真逆の答えを選び取った人物です。世界の均衡そのものを作り直そうとし、あらゆる時代に自らの分身を配置します。",
    detailEn:
      "He asks the same question as the hero — what is a heart? — yet arrives at the opposite answer. Seeking to remake the very balance of the worlds, he places versions of himself throughout every era."
  },

  /* ================= χの世代 ― 予知者とダンデライオン ================= */
  {
    initial: "M",
    name: "マスター・オブ・マスター",
    en: "MASTER OF MASTERS",
    hue: 45,
    image: "assets/characters/master-of-masters.webp",
    group: "chi",
    works: ["unionx"],
    role: "予知者たちの師。未来を見通す「未来を見る目」を持ち、すべてを見越して役目と黒い箱を弟子に託した張本人。",
    roleEn: "Master to the Foretellers. Armed with the precognitive Eyes That See the Future, he foresaw everything and entrusted his disciples with their roles and a set of black boxes.",
    detail: "飄々とした態度の裏で、遠い先の物語まで見据えて盤面を組み上げていた人物です。",
    detailEn: "Behind his breezy manner, he was setting the board for a story stretching far into the distant future."
  },
  {
    initial: "I",
    name: "イラ",
    en: "IRA",
    hue: 40,
    image: "assets/characters/ira.webp",
    group: "chi",
    works: ["unionx"],
    role: "ウニコルニス・ユニオンを率いる予知者。責任感が強く、次のマスターに指名される。",
    roleEn: "The Foreteller who leads the Unicornis Union. Strongly responsible, he is named the next Master.",
    detail: "重責を背負い込むあまり、仲間との間に溝を生んでしまう場面が描かれます。",
    detailEn: "His willingness to shoulder heavy burdens ends up driving a wedge between him and his friends."
  },
  {
    initial: "I",
    name: "インヴィ",
    en: "INVI",
    hue: 220,
    image: "assets/characters/invi.webp",
    group: "chi",
    works: ["unionx"],
    role: "アングイス・ユニオンを率いる予知者。掟を重んじ、仲間たちの調停役を担う。",
    roleEn: "The Foreteller who leads the Anguis Union. She values the rules and serves as mediator among her friends.",
    detail: "冷静沈着で、五人のなかでは最後まで秩序を守ろうとした人物です。",
    detailEn: "Calm and composed, she is the one among the five who holds onto order the longest."
  },
  {
    initial: "A",
    name: "アセッド",
    en: "ACED",
    hue: 28,
    image: "assets/characters/aced.webp",
    group: "chi",
    works: ["unionx"],
    role: "ウルスス・ユニオンを率いる予知者。直情的な性格から、イラと衝突して道を踏み外していく。",
    roleEn: "The Foreteller who leads the Ursus Union. His hot-blooded nature puts him at odds with Ira and sends him off the rails.",
    detail: "マスターを誰より信じていたがゆえに、その不在に耐えきれなかった人物です。",
    detailEn: "Because he believed in the Master more than anyone, he couldn't bear the Master's absence."
  },
  {
    initial: "G",
    name: "グウラ",
    en: "GULA",
    hue: 90,
    image: "assets/characters/gula.webp",
    group: "chi",
    works: ["unionx"],
    role: "レオパルドス・ユニオンを率いる予知者。冷静沈着だが、裏切り者を探すという秘密の任を負う。",
    roleEn: "The Foreteller who leads the Leopardus Union. Calm and composed, he secretly carries the task of hunting a traitor.",
    detail: "マスターから密かに託された役目のために、仲間にも本心を明かせずにいます。",
    detailEn: "Because of the mission the Master quietly entrusted to him, he can't reveal his true feelings even to his friends."
  },
  {
    initial: "A",
    name: "アヴァ",
    en: "AVA",
    hue: 325,
    image: "assets/characters/ava.webp",
    group: "chi",
    works: ["unionx"],
    role: "ウルペウス・ユニオンを率いる予知者。「ダンデライオン」を集め、次代へ光を繋ぐ役目を担う。",
    roleEn: "The Foreteller who leads the Vulpes Union. She gathers the Dandelions, tasked with carrying the light into the next generation.",
    detail: "来たる戦いを生き延びる者たちを選び、未来そのものを守ろうとした人物です。",
    detailEn: "She chooses who will survive the coming battle, trying to protect the future itself."
  },
  {
    initial: "L",
    name: "ルシュ",
    en: "LUXU",
    hue: 275,
    image: "assets/characters/luxu.webp",
    group: "chi",
    works: ["unionx", "kh3"],
    role: "マスターの6人目の弟子。黒い箱を託され、器を乗り換えながら幾世代も計画を見届ける。",
    roleEn: "The Master's sixth disciple, entrusted with a black box. He passes through vessel after vessel across generations, watching the plan unfold.",
    detail: "その長い旅の果てにたどり着いた姿が、XIII機関のシグバールです。",
    detailEn: "The form he finally arrives at, at the end of that long journey, is Xigbar of Organization XIII."
  },
  {
    initial: "E",
    name: "エフェメラ",
    en: "EPHEMER",
    hue: 200,
    image: "assets/characters/ephemer.webp",
    group: "chi",
    works: ["unionx"],
    role: "主人公と出会うキーブレード使いの少年。世界の裏側を知ろうとし、のちにダンデライオンを率いる存在となる。",
    roleEn: "A boy Keyblade wielder who meets the hero. Curious about the world behind the scenes, he later comes to lead the Dandelions.",
    detail: "好奇心のままに真実へ踏み込んでいく、物語の相棒のような存在です。",
    detailEn: "A companion-like presence in the story, following his curiosity straight into the truth."
  },
  {
    initial: "C",
    name: "チリシィ",
    en: "CHIRITHY",
    hue: 60,
    image: "assets/characters/chirithy.webp",
    group: "chi",
    works: ["unionx"],
    role: "マスターが生み出した使い魔。キーブレード使いに寄り添い導く、スピリットの姿をした相棒。",
    roleEn: "A familiar created by the Master — a spirit-shaped companion who stays close to Keyblade wielders and guides them.",
    detail: "ぬいぐるみのような見た目で、持ち主の心の状態をそっと気にかけ続けます。",
    detailEn: "Plush-toy in appearance, it quietly watches over the state of its owner's heart."
  },

  /* ================= Dark Road ― ゼアノートの過去 ================= */
  {
    initial: "X",
    name: "ヤング・ゼアノート",
    en: "YOUNG XEHANORT",
    hue: 270,
    image: "assets/characters/young-xehanort.webp",
    group: "darkroad",
    works: ["ddd", "kh3"],
    role: "学び舎で剣を学ぶ少年時代のゼアノート。外の世界と「本当の力」に強く惹かれていく。",
    roleEn: "Xehanort as a boy, studying the sword at his academy. He is drawn ever more strongly to the world outside and to what he calls true power.",
    detail: "のちに時を越えて現れ、老いたゼアノートの計画の駒として動くことになります。",
    detailEn: "He later appears across time, moved like a piece in the aged Xehanort's plan."
  },

  /* ================= その他の重要人物 ================= */
  {
    initial: "A",
    name: "闇の探求者アンセム",
    en: "ANSEM, SEEKER OF DARKNESS",
    hue: 25,
    image: "assets/characters/ansem-seeker-of-darkness.webp",
    group: "origin-other",
    works: ["kh1", "com", "kh2", "kh3"],
    role: "ゼアノートのハートレス。賢者アンセムの名を騙り、世界の心を求めてソラの前に立ちはだかる。",
    roleEn: "Xehanort's Heartless. He steals the name of Ansem the Wise and stands in Sora's way, seeking the world's heart.",
    detail: "「闇の中にこそ真実がある」と説き、あらゆるものを闇へ還そうとする最初の宿敵です。",
    detailEn: "Preaching that truth lies only in darkness, he is the first great rival, seeking to return everything to darkness."
  },
  {
    initial: "A",
    name: "賢者アンセム(ディズ)",
    en: "ANSEM THE WISE",
    hue: 208,
    image: "assets/characters/ansem-the-wise.webp",
    group: "origin-other",
    works: ["com", "kh2", "days", "kh3"],
    role: "レイディアントガーデンを治めた賢者。弟子に裏切られ、「ディズ」と名乗って機関への復讐に囚われる。",
    roleEn: "The sage who once ruled Radiant Garden. Betrayed by his own apprentice, he takes the name DiZ and becomes consumed by his quest for revenge against the Organization.",
    detail: "憎しみに飲まれかけながらも、最後には自らの過ちを認め、ソラたちに託して去ります。",
    detailEn: "Though nearly swallowed by hatred, he ultimately admits his own mistakes, entrusts his cause to Sora and friends, and departs."
  },

  /* ================= 王様と旅の仲間 ================= */
  {
    initial: "M",
    name: "ミッキー(王様)",
    en: "KING MICKEY",
    hue: 46,
    image: "assets/characters/king-mickey.webp",
    group: "companion",
    works: ["kh1", "com", "kh2", "bbs", "ddd", "kh3"],
    role: "ディズニー城を治める王様。作中では皆から「王様」と呼ばれる。自身もキーブレードの使い手で、陰から世界の均衡を守り続けている。",
    roleEn: "The king who rules Disney Castle, known to everyone simply as 'the King.' A Keyblade wielder in his own right, he quietly protects the balance of the worlds from the shadows.",
    detail: "ディズニー城の王でありながら、危機とみれば自ら城を出て旅立ちます。必要な時にはソラたちのもとへ駆けつけ、キーブレードを手に道を示します。",
    detailEn: "Despite being king of Disney Castle, he leaves it himself the moment crisis strikes. He rushes to Sora's side whenever needed, Keyblade in hand, to show the way."
  },
  {
    initial: "D",
    name: "ドナルド",
    en: "DONALD DUCK",
    hue: 210,
    image: "assets/characters/donald-duck.webp",
    group: "companion",
    works: ["kh1", "com", "kh2", "kh3"],
    role: "ディズニー城の宮廷魔法使い。癇癪持ちだが、誰よりも仲間思いな相棒。",
    roleEn: "The court mage of Disney Castle. Short-tempered, but a companion who cares for his friends more than anyone.",
    detail: "王様の命によりソラの旅に同行し、魔法で仲間を支え続けます。グーフィーとの掛け合いも見どころです。",
    detailEn: "Ordered by the King to accompany Sora on his journey, he supports his friends with magic throughout. His banter with Goofy is one of the journey's highlights."
  },
  {
    initial: "G",
    name: "グーフィー",
    en: "GOOFY",
    hue: 118,
    image: "assets/characters/goofy.webp",
    group: "companion",
    works: ["kh1", "com", "kh2", "kh3"],
    role: "ディズニー城の親衛隊長。盾を構え、明るくおおらかにソラたちを見守る。",
    roleEn: "Captain of the Royal Knights of Disney Castle. Shield in hand, he watches over Sora and friends with warmth and good cheer.",
    detail: "戦いの中でも決して仲間を見捨てない、旅の要となる存在です。その言葉がソラを何度も救います。",
    detailEn: "He never abandons a friend, even in battle — the anchor of the whole journey. His words save Sora more than once."
  },
  {
    initial: "Y",
    name: "イェン・シッド",
    en: "MASTER YEN SID",
    hue: 245,
    image: "assets/characters/master-yen-sid.webp",
    group: "companion",
    works: ["bbs", "kh2", "ddd", "kh3"],
    role: "かつてのキーブレードマスターであり、ミッキーの師でもある老魔法使い。",
    roleEn: "An old sorcerer, once a Keyblade Master and mentor to King Mickey.",
    detail: "塔の上からソラたちを見守り、重要な局面で助言と使命を授ける、シリーズの案内役的存在です。",
    detailEn: "Watching over Sora and friends from atop his tower, he offers guidance and assigns missions at crucial moments — the series' guiding figure."
  },

  /* ================= 敵対者 ================= */
  {
    initial: "M",
    name: "マレフィセント",
    en: "MALEFICENT",
    hue: 152,
    image: "assets/characters/maleficent.webp",
    group: "villain",
    works: ["kh1", "kh2", "kh3"],
    role: "闇の力を求めて世界を渡り歩く魔女。『眠れる森の美女』出身。",
    roleEn: "A witch who travels between worlds seeking the power of darkness, originally from Sleeping Beauty.",
    detail: "シリーズを通して幾度も暗躍する、最も息の長い敵役のひとりです。ドラゴンへと姿を変える力を持ちます。",
    detailEn: "One of the series' longest-running villains, scheming in the shadows time and again. She holds the power to transform into a dragon."
  },
  {
    initial: "P",
    name: "ピート",
    en: "PETE",
    hue: 26,
    image: "assets/characters/pete.webp",
    group: "villain",
    works: ["kh2", "bbs", "kh3"],
    role: "ミッキーの宿敵を自称する大男。マレフィセントの手先として動き回る。",
    roleEn: "A large man who calls himself Mickey's archenemy, acting as Maleficent's henchman.",
    detail: "憎めない愛嬌を漂わせつつ、あちこちの世界でトラブルを引き起こす、コミカルな敵役です。",
    detailEn: "A comical villain with an oddly likable charm, causing trouble across one world after another."
  },
  {
    initial: "H",
    name: "ハデス",
    en: "HADES",
    hue: 262,
    image: "assets/characters/hades.webp",
    group: "villain",
    works: ["kh1", "kh2", "kh3"],
    role: "オリンポスコロシアムを治める冥界の神。ヘラクレスの失脚を狙い続ける。",
    roleEn: "The god of the Underworld who rules Olympus Coliseum, forever scheming to bring down Hercules.",
    detail: "青い炎をまとった皮肉屋で、機会があればハートレスや敵対者たちと手を組みます。",
    detailEn: "A sarcastic figure wreathed in blue flame, ready to team up with Heartless or other villains whenever it suits him."
  },

  /* ================= ディズニーの仲間たち ================= */
  {
    initial: "M",
    name: "ミニー(女王)",
    en: "QUEEN MINNIE",
    hue: 330,
    image: "assets/characters/queen-minnie.webp",
    group: "disney",
    works: ["kh2"],
    role: "王様の留守を預かるディズニー城の女王。気品と芯の強さで城を守る。",
    roleEn: "The Queen of Disney Castle, who watches over it in the King's absence with grace and quiet strength.",
    detail: "ハートレスに城を襲われても動じず、光の力でソラたちに道を開きます。",
    detailEn: "Unshaken even when Heartless assail the castle, she opens the way for Sora and friends with the power of light."
  }
];

/* ------------------------------------------------------------
   用語集(この世界を読み解くための言葉)
   ------------------------------------------------------------ */
const GLOSSARY = [
  {
    term: "キーブレード",
    en: "KEYBLADE",
    text: "鍵の形をした武器。世界の鍵穴を開閉でき、心の強さに応じて選ばれた者にしか扱えない。",
    textEn: "A key-shaped weapon that can open and close the keyholes of worlds. Only those chosen for the strength of their heart can wield one."
  },
  {
    term: "ハートレス",
    en: "HEARTLESS",
    text: "心を闇に呑まれた者から生まれる存在。他者の心を求めて、世界から世界へと現れる。",
    textEn: "Beings born when a person's heart is swallowed by darkness. They appear across world after world, hungering for other hearts."
  },
  {
    term: "ノーバディ",
    en: "NOBODY",
    text: "心を失った者の身体と意志が残ったもの。心が無いはずなのに、なぜか感情のように振る舞う。",
    textEn: "What remains of a person's body and will after their heart is lost. Though they should have no heart, they somehow behave as if they still feel."
  },
  {
    term: "アンヴァース",
    en: "UNVERSED",
    text: "ヴァニタスの負の感情から生まれる存在。彼の心の乱れがそのまま形になったもの。",
    textEn: "Beings born from Vanitas's negative emotions — the turmoil of his heart given physical form."
  },
  {
    term: "XIII機関",
    en: "ORGANIZATION XIII",
    text: "黒いコートをまとったノーバディたちの集団。それぞれが心を取り戻すことを目的に動く。",
    textEn: "A group of Nobodies in black coats, each acting toward the goal of regaining a heart of their own."
  },
  {
    term: "ウェイファインダー",
    en: "WAYFINDER",
    text: "アクアが作った星形のお守り。離れていても必ず出会えるという、南の島の言い伝えに由来する。",
    textEn: "A star-shaped charm made by Aqua, based on an island legend that those who share one will always find their way back to each other, however far apart."
  },
  {
    term: "パオプの実",
    en: "PAOPU FRUIT",
    text: "星の形をした果実。二人で分け合うと運命が結ばれ、どんなに離れても繋がり続けるとされる。",
    textEn: "A star-shaped fruit said to bind the fates of two people who share it, keeping them connected no matter how far apart they drift."
  },
  {
    term: "シーソルトアイス",
    en: "SEA-SALT ICE CREAM",
    text: "しょっぱいのに甘いアイス。時計塔の上で分け合った日々の象徴として、幾度も描かれる。",
    textEn: "An ice cream that's salty yet sweet. It appears again and again as a symbol of the days shared atop the clock tower."
  },
  {
    term: "キングダムハーツ",
    en: "KINGDOM HEARTS",
    text: "すべての心が行き着く場所。求める者によって、その姿も意味も変わっていく。",
    textEn: "The place all hearts ultimately lead to. Its form and meaning shift depending on who seeks it."
  },
  {
    term: "Dearly Beloved",
    en: "MAIN THEME",
    text: "下村陽子によるシリーズの主題曲。作品ごとに姿を変えながら、必ずタイトル画面で流れ続けている。",
    textEn: "The series' main theme, composed by Yoko Shimomura. Its arrangement changes from game to game, but it always plays on the title screen."
  },
  {
    term: "プリンセス・オブ・ハート",
    en: "PRINCESS OF HEART",
    text: "心に闇をまったく持たない七人の乙女。カイリもそのひとりであり、世界の均衡を左右する存在として狙われる。",
    textEn: "Seven maidens whose hearts contain no darkness at all. Kairi is one of them, and as beings who can tip the balance of the worlds, they are constantly targeted."
  },
  {
    term: "レプリカ",
    en: "REPLICA",
    text: "人工的に作られた身体に、誰かの記憶や力を移し替えた存在。シオンもまた、この技術によって生まれた。",
    textEn: "A being whose artificially made body carries someone else's memories or power. Xion, too, was born through this technology."
  },
  {
    term: "ドリームイーター",
    en: "DREAM EATER",
    text: "眠りの世界に棲む生き物。悪夢を食べる「スピリット」と、悪夢そのものである「ナイトメア」に分かれる。",
    textEn: "Creatures that inhabit the realm of sleep, divided into Spirits, which devour nightmares, and Nightmares, which are nightmares themselves."
  },
  {
    term: "χ(キー)ブレード",
    en: "χ-BLADE",
    text: "すべての力の源となる特別なキーブレード。太古の戦争で20の欠片(7つの光と13の闇)に砕けたとされ、7つの光の心と13の闇の器がぶつかり合うことで再び現れる。",
    textEn: "A singular Keyblade said to be the source of all power. Legend holds it shattered into twenty pieces — seven of light and thirteen of darkness — during an ancient war, reappearing whenever seven hearts of pure light clash with thirteen vessels of darkness."
  },
  {
    term: "キーブレード戦争",
    en: "KEYBLADE WAR",
    text: "χブレードを巡って起きた、最も古い時代の大戦。この戦いの果てに、世界は光と闇に分かたれた。",
    textEn: "The great war of the earliest era, fought over the χ-blade. In its aftermath, the world was split into light and darkness."
  },
  {
    term: "予言の書",
    en: "BOOK OF PROPHECIES",
    text: "マスター・オブ・マスターが記した、来るべき未来を綴った書物。5人の予知者にそれぞれ託された。",
    textEn: "A book written by the Master of Masters, recording a future yet to come. A copy was entrusted to each of the five Foretellers."
  },
  {
    term: "光の守護者",
    en: "GUARDIANS OF LIGHT",
    text: "闇の探求者に対抗するため集められた、光の側に立つキーブレード使いたち。王様やソラたちもこれに数えられる。",
    textEn: "Keyblade wielders who stand on the side of light, gathered to oppose the Seekers of Darkness. King Mickey and Sora are counted among them."
  },
  {
    term: "闇の探求者",
    en: "SEEKERS OF DARKNESS",
    text: "ゼアノートのもとに集められた、闇の力を求める者たち。χブレードの完成を目論む。",
    textEn: "Those gathered under Xehanort who seek the power of darkness, plotting to complete the χ-blade."
  },
  {
    term: "ルクス",
    en: "LUX",
    text: "χの時代における「光」の呼び名。ユニオンに分かれたキーブレード使いたちが、闇を払うために集め続けている。",
    textEn: "The name given to light in the age of χ. Keyblade wielders divided into Unions continue gathering it to drive back the darkness."
  },
  {
    term: "マスター・オブ・マスター",
    en: "MASTER OF MASTERS",
    text: "最も古い時代に生きたとされる謎の人物。5人の予知者たちの師であり、すべての始まりに深く関わる。",
    textEn: "A mysterious figure said to have lived in the earliest era — master to the five Foretellers, and deeply involved in how it all began."
  },
  {
    term: "予知者",
    en: "FORETELLERS",
    text: "マスター・オブ・マスターから予言の書を託された5人の弟子。それぞれ動物の仮面をつけ、ユニオンを率いる。",
    textEn: "The five disciples entrusted with the Book of Prophecies by the Master of Masters. Each wears an animal mask and leads their own Union."
  },
  {
    term: "マーク・オブ・マスタリー",
    en: "MARK OF MASTERY",
    text: "キーブレードマスターの資格を得るための試験。『BbS』ではテラとアクアが挑み(アクアが合格)、『3D』ではソラとリクが挑む。この試験を境に物語が大きく動き出す。",
    textEn: "The exam taken to earn the rank of Keyblade Master. Terra and Aqua sit it in BIRTH BY SLEEP (Aqua passes), and Sora and Riku sit it in DREAM DROP DISTANCE. The story pivots sharply around this exam each time."
  }
];

/* ------------------------------------------------------------
   MEMORY CROSSOVER ― キングダムハーツと縁のある作品
   crossover.js が CROSSOVER_CATEGORIES ごとに一覧を描く。
   works は「その作品の要素が登場する KINGDOM HEARTS タイトル」(WORKS の id)。
   ------------------------------------------------------------ */
const CROSSOVER_CATEGORIES = [
  { key: "ff", label: "ファイナルファンタジー", labelEn: "FINAL FANTASY" },
  { key: "twewy", label: "すばらしきこのせかい", labelEn: "The World Ends with You" },
  { key: "disney", label: "ディズニー / ピクサー(ワールド)", labelEn: "Disney / Pixar (Worlds)" },
  { key: "disney-extra", label: "ディズニー(短編・楽曲・召喚など)", labelEn: "Disney (Shorts, Music, Summons, etc.)" }
];

const CROSSOVERS = [
  /* ===================== ファイナルファンタジー ===================== */
  {
    cat: "ff",
    title: "ファイナルファンタジーVII",
    origin: "スクウェア / 1997年",
    works: ["kh1", "com", "kh2", "bbs"],
    guests: "クラウド、セフィロス、ティファ、エアリス、シド、ユフィ、ザックス(BbS)",
    stage: "ホロウバスティオン(レイディアントガーデン)、オリンポスコロシアム、トラヴァースタウン",
    note: "KH に登場するFFキャラの中心。ホロウバスティオン(レイディアントガーデン)復興委員会の面々として、世界の再建に力を貸す。クラウドとセフィロスの因縁も描かれる。",
    noteEn: "The core of FINAL FANTASY characters in KH. They lend their strength to rebuilding the world as members of the Hollow Bastion (Radiant Garden) Restoration Committee. The old rivalry between Cloud and Sephiroth is also portrayed."
  },
  {
    cat: "ff",
    title: "ファイナルファンタジーVIII",
    origin: "スクウェア / 1999年",
    works: ["kh1", "com", "kh2", "days"],
    guests: "レオン(スコール)、セルフィ、サイファー、フウ、ライ",
    stage: "トラヴァースタウン、ホロウバスティオン、トワイライトタウン",
    note: "「レオン」と名を変えたスコールがソラの最初の導き手のひとり。トワイライトタウンのサイファーたちも FFVIII 出身。",
    noteEn: "Squall, now going by the name Leon, is one of Sora's earliest guides. Seifer and his gang in Twilight Town also hail from FFVIII."
  },
  {
    cat: "ff",
    title: "ファイナルファンタジーX",
    origin: "スクウェア / 2001年",
    works: ["kh1", "kh2"],
    guests: "ティーダ、ワッカ、アーロン",
    stage: "デスティニーアイランド(子供時代)、オリンポスコロシアム、冥界",
    note: "デスティニーアイランドで遊ぶ少年たちがFFX出身。KHIIではアーロンが仲間として冥界の戦いに加わる。",
    noteEn: "The boys playing on Destiny Islands come from FFX. In KINGDOM HEARTS II, Auron joins as an ally in the battle in the Underworld."
  },
  {
    cat: "ff",
    title: "ファイナルファンタジーVI",
    origin: "スクウェア / 1994年",
    works: ["kh2"],
    guests: "セッツァー",
    stage: "トワイライトタウン(ストラグル)",
    note: "トワイライトタウンの闘技会「ストラグル」の現チャンピオンとして登場する。",
    noteEn: "Appears as the reigning champion of the Struggle tournament in Twilight Town."
  },
  {
    cat: "ff",
    title: "ファイナルファンタジーIX",
    origin: "スクウェア / 2000年",
    works: ["kh2"],
    guests: "ビビ",
    stage: "トワイライトタウン",
    note: "ロクサスの日常パートで、ストラグルの対戦相手として姿を見せる。",
    noteEn: "Appears as a Struggle opponent during Roxas's story."
  },
  {
    cat: "ff",
    title: "モーグリとチョコボ",
    origin: "ファイナルファンタジーシリーズの看板キャラ",
    works: ["kh1", "com", "kh2", "days", "recoded", "ddd", "kh3"],
    guests: "モーグリ(アイテム合成・ショップ)、チョコボ(カメオ)",
    stage: "各作品のショップ / 合成メニュー",
    note: "FFではおなじみのマスコット。KHでは「モーグリのアイテム合成」を一貫して担当する。",
    noteEn: "Familiar mascots from the FINAL FANTASY series. In KH, the Moogles consistently run item synthesis."
  },

  /* ===================== すばらしきこのせかい ===================== */
  {
    cat: "twewy",
    title: "すばらしきこのせかい",
    origin: "スクウェア・エニックス / 2007年(ニンテンドーDS)",
    works: ["ddd"],
    guests: "ネク、シキ、ヨシュア、ビイト、ライム",
    stage: "トラヴァースタウン(『Dream Drop Distance』)",
    note: "同じスクウェア・エニックス開発の縁で共演。トラヴァースタウンに迷い込んだ『すばこの』の面々が、ソラやリクと行動を共にする。",
    noteEn: "A crossover born from shared development by Square Enix. Lost in Traverse Town, the cast of The World Ends with You joins forces with Sora and Riku."
  },

  /* ===================== ディズニー / ピクサー(ワールド) ===================== */
  {
    cat: "disney",
    title: "ふしぎの国のアリス",
    origin: "ディズニー / 1951年",
    works: ["kh1", "com"],
    guests: "アリス(七人の光の姫君)、チェシャ猫、ハートの女王、白ウサギ",
    stage: "ワンダーランド",
    note: "アリスは心に闇を持たない「光の姫君」のひとりとして狙われる。",
    noteEn: "Alice is targeted as one of the Princesses of Heart, whose hearts hold no darkness."
  },
  {
    cat: "disney",
    title: "ヘラクレス",
    origin: "ディズニー / 1997年",
    works: ["kh1", "com", "kh2", "bbs", "kh3"],
    guests: "ヘラクレス、フィル、ハデス、メグ、ゼウス",
    stage: "オリンポスコロシアム / オリンポス",
    note: "闘技会を通じて「本当の英雄とは何か」を問う、シリーズ皆勤に近いワールド。",
    noteEn: "A world that appears in nearly every installment, asking through its tournaments what it truly means to be a hero."
  },
  {
    cat: "disney",
    title: "ターザン",
    origin: "ディズニー / 1999年",
    works: ["kh1"],
    guests: "ターザン、ジェーン、クレイトン",
    stage: "ディープジャングル",
    note: "権利上の都合で、以降の作品には登場しない一作限りのワールド。",
    noteEn: "A one-time-only world due to licensing constraints, never appearing in later games."
  },
  {
    cat: "disney",
    title: "ピノキオ",
    origin: "ディズニー / 1940年",
    works: ["kh1", "com"],
    guests: "ピノキオ、ゼペット、ジミニー・クリケット",
    stage: "モンストロ(クジラの体内)",
    note: "ジミニー・クリケットはソラの旅の記録係として全編に同行する。",
    noteEn: "Jiminy Cricket accompanies Sora throughout the whole series as the keeper of his journal."
  },
  {
    cat: "disney",
    title: "ピーター・パン",
    origin: "ディズニー / 1953年",
    works: ["kh1", "com"],
    guests: "ピーター・パン、ティンカー・ベル、フック船長、ウェンディ",
    stage: "ネバーランド(空飛ぶ海賊船)",
    note: "ティンカー・ベルは以降の作品で召喚・回復役として力を貸す。",
    noteEn: "Tinker Bell lends her strength in later games as a summon and healer."
  },
  {
    cat: "disney",
    title: "リトル・マーメイド",
    origin: "ディズニー / 1989年",
    works: ["kh1", "kh2"],
    guests: "アリエル、トリトン王、アースラ、セバスチャン、フランダー",
    stage: "アトランティカ",
    note: "KHIIでは歌とダンスで物語が進む、シリーズでも異色のミュージカル形式のワールド。",
    noteEn: "In KINGDOM HEARTS II, the story unfolds through song and dance — a musical world unlike any other in the series."
  },
  {
    cat: "disney",
    title: "ナイトメアー・ビフォア・クリスマス",
    origin: "ディズニー / 1993年",
    works: ["kh1", "kh2"],
    guests: "ジャック・スケリントン、サリー、ウギー・ブギー、サンタクロース",
    stage: "ハロウィンタウン",
    note: "ジャックは召喚魔法としてもソラを助ける。KHIIではクリスマスタウンも登場。",
    noteEn: "Jack also helps Sora as a summon. Christmas Town appears alongside it in KINGDOM HEARTS II."
  },
  {
    cat: "disney",
    title: "くまのプーさん",
    origin: "ディズニー / 1977年ほか",
    works: ["kh1", "com", "kh2", "kh3"],
    guests: "プー、ティガー、ピグレット、ラビット、オウル、イーヨー、ルー",
    stage: "100エーカーの森(絵本の中)",
    note: "戦闘のない箸休めのワールド。破れた絵本のページと「忘れないこと」をめぐる小さな物語が語られる。",
    noteEn: "A battle-free world offering a breather, telling a small story about torn storybook pages and the act of not forgetting."
  },
  {
    cat: "disney",
    title: "アラジン",
    origin: "ディズニー / 1992年",
    works: ["kh1", "com", "kh2"],
    guests: "アラジン、ジャスミン(光の姫君)、ジーニー、ジャファー、カーペット、アブー",
    stage: "アグラバー",
    note: "ジャスミンは光の姫君のひとり。ジーニーは召喚魔法としても登場する。",
    noteEn: "Jasmine is one of the Princesses of Heart. Genie also appears as a summon."
  },
  {
    cat: "disney",
    title: "美女と野獣",
    origin: "ディズニー / 1991年",
    works: ["kh2", "kh3"],
    guests: "野獣、ベル(光の姫君)、ルミエール、コグスワース、ポット夫人、ガストン",
    stage: "ビーストキャッスル",
    note: "「闇に呑まれかけた心が、絆で引き戻される」というシリーズの主題を体現するワールド。",
    noteEn: "A world that embodies the series' theme of a heart nearly swallowed by darkness being pulled back by a bond."
  },
  {
    cat: "disney",
    title: "ムーラン",
    origin: "ディズニー / 1998年",
    works: ["kh2"],
    guests: "ムーラン、ムーシュー、リー・シャン、シャン・ユー",
    stage: "ランド・オブ・ドラゴン",
    note: "ムーシューは召喚魔法としても参戦。正体を隠して戦うムーランの物語が描かれる。",
    noteEn: "Mushu also joins as a summon. The story follows Mulan fighting while hiding her true identity."
  },
  {
    cat: "disney",
    title: "ライオン・キング",
    origin: "ディズニー / 1994年",
    works: ["kh2"],
    guests: "シンバ、ナラ、ラフィキ、スカー、ティモン、プンバァ",
    stage: "プライドランド",
    note: "ソラ・ドナルド・グーフィーが獅子・鳥・亀の姿になる。倒したスカーが心の影として蘇る場面も。",
    noteEn: "Sora, Donald, and Goofy transform into a lion, a bird, and a turtle. Scar even returns as a shadow of the heart after being defeated."
  },
  {
    cat: "disney",
    title: "パイレーツ・オブ・カリビアン",
    origin: "ディズニー / 2003年〜(実写映画)",
    works: ["kh2", "kh3"],
    guests: "ジャック・スパロウ、ウィル・ターナー、エリザベス・スワン、バルボッサ、デイヴィ・ジョーンズ",
    stage: "ポート・ロイヤル / ザ・カリビアン",
    note: "実写映画を原作とする珍しいワールド。KHIIIでは海洋アクションと船戦が楽しめる。",
    noteEn: "A rare world based on a live-action film. KINGDOM HEARTS III lets you enjoy full naval action and ship battles here."
  },
  {
    cat: "disney",
    title: "トロン / トロン:レガシー",
    origin: "ディズニー / 1982年・2010年",
    works: ["kh2", "ddd", "kh3"],
    guests: "トロン、サーク、マスターコントロールプログラム、クルー、ラインズラー",
    stage: "スペースパラノイド / ザ・グリッド(電脳世界)",
    note: "コンピュータの中の世界。KHIIIの「ザ・グリッド」は続編『トロン:レガシー』が下敷き。",
    noteEn: "A world inside a computer. The Grid in KINGDOM HEARTS III is based on the sequel film, TRON: Legacy."
  },
  {
    cat: "disney",
    title: "リロ・アンド・スティッチ",
    origin: "ディズニー / 2002年",
    works: ["bbs", "kh2"],
    guests: "スティッチ、ジャンバ、ガントゥ",
    stage: "ディープスペース(『Birth by Sleep』)",
    note: "スティッチはKHIIで召喚として活躍。BbS では、地球へ逃げる前の実験体626号として登場する。",
    noteEn: "Stitch serves as a summon in KINGDOM HEARTS II. In BIRTH BY SLEEP, he appears as Experiment 626, before his escape to Earth."
  },
  {
    cat: "disney",
    title: "白雪姫",
    origin: "ディズニー / 1937年",
    works: ["bbs"],
    guests: "白雪姫(光の姫君)、女王、7人のこびと",
    stage: "ドワーフウッドランド(『Birth by Sleep』)",
    note: "史上初の長編アニメーション。KHでは白雪姫が光の姫君のひとりとして描かれる。",
    noteEn: "The first-ever feature-length animated film. In KH, Snow White is portrayed as one of the Princesses of Heart."
  },
  {
    cat: "disney",
    title: "シンデレラ",
    origin: "ディズニー / 1950年",
    works: ["bbs"],
    guests: "シンデレラ(光の姫君)、フェアリーゴッドマザー、ジャックとガス、トレメイン夫人",
    stage: "キャッスル・オブ・ドリーム(『Birth by Sleep』)",
    note: "アクアが見守る「夢を諦めない心」の物語。ガラスの靴のモチーフが印象的。",
    noteEn: "A story about never giving up on your dreams, watched over by Aqua. The glass slipper motif leaves a strong impression."
  },
  {
    cat: "disney",
    title: "眠れる森の美女",
    origin: "ディズニー / 1959年",
    works: ["bbs"],
    guests: "オーロラ姫(光の姫君)、マレフィセント、3人の妖精、フィリップ王子",
    stage: "エンチャンテッド・ドミニオン(『Birth by Sleep』)",
    note: "シリーズ最大級のディズニーヴィラン・マレフィセントの出身作。",
    noteEn: "The original film of Maleficent, one of the series' greatest Disney villains."
  },
  {
    cat: "disney",
    title: "ファンタジア",
    origin: "ディズニー / 1940年",
    works: ["ddd"],
    guests: "魔法使いの弟子ミッキー、チェルナボーグ、ほうき",
    stage: "シンフォニー・オブ・ソーサリー(『Dream Drop Distance』)",
    note: "音楽で綴られる名作。短編「魔法使いの弟子」はKHのミッキー像の原点でもある。",
    noteEn: "A masterpiece told through music. The short The Sorcerer's Apprentice is also the origin of Mickey's image within KH."
  },
  {
    cat: "disney",
    title: "ノートルダムの鐘",
    origin: "ディズニー / 1996年",
    works: ["ddd"],
    guests: "カジモド、エスメラルダ、フロロー、フィーバス",
    stage: "ラ・シテ・デ・クロシュ(『Dream Drop Distance』)",
    note: "「見た目や出自で心は決まらない」というテーマがKHの問いと重なる。",
    noteEn: "Its theme — that appearance or origin doesn't determine one's heart — overlaps with KH's own central question."
  },
  {
    cat: "disney",
    title: "アナと雪の女王",
    origin: "ディズニー / 2013年",
    works: ["kh3"],
    guests: "エルサ、アナ、オラフ、クリストフ、マシュマロウ",
    stage: "アレンデール",
    note: "「Let It Go」の場面を再現した氷の演出が見どころ。",
    noteEn: "A highlight is the icy set-piece recreating the Let It Go scene."
  },
  {
    cat: "disney",
    title: "塔の上のラプンツェル",
    origin: "ディズニー / 2010年",
    works: ["kh3"],
    guests: "ラプンツェル、フリン・ライダー、パスカル、マキシマス、ゴーテル",
    stage: "キングダム・オブ・コロナ",
    note: "森を抜けて灯りを見に行く道行きを、ソラたちが一緒に歩く。",
    noteEn: "Sora and friends walk alongside Rapunzel on her journey through the forest to see the floating lights."
  },
  {
    cat: "disney",
    title: "ベイマックス",
    origin: "ディズニー / 2014年(原作はマーベル・コミック)",
    works: ["kh3"],
    guests: "ヒロ、ベイマックス、ゴーゴー、ワサビ、ハニーレモン、フレッド",
    stage: "サンフランソウキョウ",
    note: "喪失と再生の物語。データ世界のヒロと、闇に触れたベイマックスをめぐる展開が描かれる。",
    noteEn: "A story of loss and recovery, following Hiro inside a digital world and Baymax after he's touched by darkness."
  },
  {
    cat: "disney",
    title: "トイ・ストーリー",
    origin: "ピクサー / 1995年〜",
    works: ["kh3"],
    guests: "ウッディ、バズ・ライトイヤー、レックス、ハム、リトル・グリーン・メン",
    stage: "トイ・ボックス",
    note: "ピクサー作品として初のワールド。おもちゃサイズのソラたちが店内を冒険する。",
    noteEn: "The first-ever Pixar world in the series. Shrunk to toy size, Sora and friends adventure through the store."
  },
  {
    cat: "disney",
    title: "モンスターズ・インク",
    origin: "ピクサー / 2001年",
    works: ["kh3"],
    guests: "サリー、マイク、ブー、ランドール",
    stage: "モンストロポリス",
    note: "「悲鳴より笑い」という原作の主題が、そのままステージギミックになっている。",
    noteEn: "The film's own theme — laughter over screams — becomes the stage's central gameplay gimmick."
  },

  /* ===================== ディズニー(短編・楽曲・召喚など) ===================== */
  {
    cat: "disney-extra",
    title: "蒸気船ウィリー / 白黒短編",
    origin: "ディズニー / 1928年",
    works: ["kh2"],
    guests: "往年の姿のミッキー、ピート、ほうき",
    stage: "タイムレスリバー",
    note: "モノクロ・サイレント時代のディズニーを再現した、過去のディズニーキャッスル。",
    noteEn: "A past incarnation of Disney Castle, recreating the black-and-white, silent era of early Disney."
  },
  {
    cat: "disney-extra",
    title: "王様の剣",
    origin: "ディズニー / 1963年",
    works: ["kh1", "com", "kh2", "bbs"],
    guests: "魔法使いマーリン、ふくろうのアルキメデス",
    stage: "トラヴァースタウン / ホロウバスティオン",
    note: "マーリン先生はソラに魔法を教える師。プーさんの絵本を預かっているのも彼。",
    noteEn: "Merlin is the teacher who instructs Sora in magic — and he's also the one keeping Winnie the Pooh's storybook safe."
  },
  {
    cat: "disney-extra",
    title: "101匹わんちゃん",
    origin: "ディズニー / 1961年",
    works: ["kh1"],
    guests: "ポンゴとパディータ、99匹の子犬",
    stage: "トラヴァースタウンの家(子犬集め)",
    note: "各ワールドに散らばった子犬を集める収集要素として登場する。",
    noteEn: "Appears as a collection element, gathering puppies scattered across the various worlds."
  },
  {
    cat: "disney-extra",
    title: "ダンボ / バンビ ほか",
    origin: "ディズニー / 1941年・1942年ほか",
    works: ["kh1"],
    guests: "ダンボ、バンビ、ムーシュー、チキンリトル(BbS)ほか",
    stage: "サモンチャーム(召喚魔法)",
    note: "欠片や思い出の品を通して呼び出され、一時的にソラと共に戦う。",
    noteEn: "Summoned through fragments or keepsakes, they fight alongside Sora for a time."
  },
  {
    cat: "disney-extra",
    title: "ミッキーと仲間たちの短編 / ディズニーキャッスル",
    origin: "ディズニー(ミッキー・マウス 短編シリーズほか)",
    works: ["kh1", "com", "kh2", "days", "recoded", "ddd", "kh3", "mom"],
    guests: "ミッキー、ドナルド、グーフィー、ミニー、デイジー、プルート、チップとデール、スクルージ",
    stage: "ディズニーキャッスル(シリーズの拠点)",
    note: "彼ら自身が物語の狂言回し。ドナルドとグーフィーはソラの旅の相棒を務める。",
    noteEn: "They themselves serve as the story's comic relief and guides. Donald and Goofy serve as Sora's traveling companions."
  }
];

/* ------------------------------------------------------------
   MEMORY CROSSOVER ― クロスオーバーの名場面ギャラリー(ページ下部)
   crossover.js が #crossover-scenes にカードを並べる。
   特定のキャラに絞らず、FF・すばこの・ディズニー勢が関わる「場面」を10枚ほど並べる。

   名場面はユーザーが自分で選ぶ:
   画像を assets/crossover/<id>.(jpg|png|webp) に置く →
   `python assets/sync_images.py --apply` で image に配線される
   (枠に合わせて整形もしたいなら assets/_inbox/crossover/ に入れて style_images.py)。
   その画像を見て work(WORKS の id・任意)/ title / caption をここに追記する。
   title と caption が空のうちは、ファイル名だけのプレースホルダーを表示。
   ------------------------------------------------------------ */
const CROSSOVER_SCENES = [
  {
    id: "cs01",
    work: "kh2",
    title: "肩を並べる、FFの英雄たち",
    titleEn: "Side by side, heroes of FINAL FANTASY",
    caption: "レイディアントガーデンで背中を合わせるレオン(FFVIII)とクラウド(FFVII)。別々の物語の剣士が、同じ世界の再建に力を貸す。",
    captionEn: "Leon (FFVIII) and Cloud (FFVII) stand back to back in Radiant Garden. Swordsmen from separate stories lend their strength to rebuilding the same world.",
    image: "assets/crossover/cs01.jpg"
  },
  {
    id: "cs02",
    work: "kh2",
    title: "断ち切れない「影」、セフィロス",
    titleEn: "A shadow that won't let go: Sephiroth",
    caption: "片翼を広げ、正宗を提げて現れる裏ボス。クラウドが越えられずにいる過去そのものが、ソラの前に立ちはだかる。",
    captionEn: "A hidden boss who appears with one wing spread and the Masamune in hand. The very past Cloud can't move beyond stands in Sora's way.",
    image: "assets/crossover/cs02.jpg"
  },
  {
    id: "cs03",
    work: "kh2",
    title: "「僕も約束するよ」",
    titleEn: "'I promise too'",
    caption: "100エーカーの森で、プーとピグレットに囲まれて座るソラ。忘れないこと——ただそれだけを、静かに誓う場面。",
    captionEn: "Sora sits surrounded by Pooh and Piglet in the 100 Acre Wood, quietly vowing to remember — nothing more, nothing less.",
    image: "assets/crossover/cs03.jpg"
  },
  {
    id: "cs04",
    work: "kh2",
    title: "ポートロイヤルの夜、ジャック・スパロウと",
    titleEn: "A night in Port Royal, with Jack Sparrow",
    caption: "呪われた金貨をめぐる海賊たちの騒動に巻き込まれるソラ。掴みどころのない船長の隣で、思わず「まさか!」と声が出る。",
    captionEn: "Sora gets swept up in the pirates' chaos over cursed gold. Beside the ever-elusive captain, he can't help blurting out, 'No way!'",
    image: "assets/crossover/cs04.jpg"
  },
  {
    id: "cs05",
    work: "kh2",
    title: "冥界の戦いに、アーロンが加わる",
    titleEn: "Auron joins the battle in the Underworld",
    caption: "ヘラクレス、そしてFFXの剣豪アーロンと肩を並べるソラ。ディズニーとファイナルファンタジーの英雄が、同じ戦列に立つ。",
    captionEn: "Sora stands alongside Hercules and Auron, the swordsman of FFX. Heroes of Disney and FINAL FANTASY take their place in the same battle line.",
    image: "assets/crossover/cs05.jpg"
  },
  {
    id: "cs06",
    work: "kh2",
    title: "「シャン隊長!」ザ・ランド・オブ・ドラゴンにて",
    titleEn: "'Captain Shang!' — In the Land of Dragons",
    caption: "男装して戦うムーランと、隊を率いるリー・シャン。フン族の侵攻を前に、ソラたちも大陸の戦に加わる。",
    captionEn: "Mulan fights in disguise, alongside Li Shang, who leads the troops. Facing the Huns' invasion, Sora and friends join the battle for the continent.",
    image: "assets/crossover/cs06.jpg"
  },
  {
    id: "cs07",
    work: "kh2",
    title: "王様が、隣に立つ",
    titleEn: "The King, standing beside them",
    caption: "存在しなかった世界。ディズニー城の王ミッキーが自らキーブレードを抜き、ソラ・ドナルド・グーフィーと並んで最後の戦いへ向かう。",
    captionEn: "In The World That Never Was, King Mickey of Disney Castle draws his own Keyblade, standing alongside Sora, Donald, and Goofy as they head into the final battle.",
    image: "assets/crossover/cs07.jpg"
  },
  {
    id: "cs08",
    work: "kh3",
    title: "トイ・ボックスで、記念の一枚",
    titleEn: "A keepsake photo in Toy Box",
    caption: "おもちゃサイズになったソラが、ウッディやバズと一緒にガミフォンで自撮り。ピクサー作品として初めて描かれたワールド。",
    captionEn: "Shrunk to toy size, Sora takes a selfie with Woody and Buzz on a Gummiphone — the first world in the series drawn from a Pixar film.",
    image: "assets/crossover/cs08.jpg"
  },
  {
    id: "cs09",
    work: "kh3",
    title: "アレンデールの雪山、エルサとともに",
    titleEn: "The snowy mountains of Arendelle, with Elsa",
    caption: "自らの氷の力を恐れ、心を閉ざしていたエルサ。姉妹の絆を取り戻す物語の傍らを、ソラとグーフィーが歩く。",
    captionEn: "Elsa, once afraid of her own icy power and closed off from others — Sora and Goofy walk alongside her story of restoring a sisterly bond.",
    image: "assets/crossover/cs09.jpg"
  },
  {
    id: "cs10",
    work: "kh3",
    title: "サンフランソウキョウ、ベイマックスと",
    titleEn: "San Fransokyo, with Baymax",
    caption: "和と洋が入り混じる橋の上で向き合うソラたちとヒロ、ベイマックス。喪失を越えて街を守るヒーローたちの物語。",
    captionEn: "Sora and friends meet Hiro and Baymax on a bridge blending East and West — a story of heroes protecting their city after loss.",
    image: "assets/crossover/cs10.jpg"
  }
];

/* ------------------------------------------------------------
   SECRET MEMORY で明かす「シリーズの根幹」
   解放した人にだけ見せる、キングダムハーツという物語の芯
   ------------------------------------------------------------ */
const KH_CORE = [
  {
    label: "CORE 01",
    title: "すべての中心は「こころ」",
    titleEn: "At the center of everything: the heart",
    text:
      "キングダムハーツが一貫して描いてきたのは、心と心のつながりです。強さも、光も闇も、すべては心から生まれます。世界と世界は「キーブレード」で繋がり、その奥にある大きな心の集積が「キングダムハーツ」と呼ばれます。求める者によって、その姿も意味も変わります。",
    textEn:
      "What KINGDOM HEARTS has consistently portrayed is the connection between hearts. Strength, light, and darkness — all of it is born from the heart. World is linked to world by the Keyblade, and the vast collection of hearts that lies beyond them is called Kingdom Hearts. Its form and meaning shift depending on who seeks it."
  },
  {
    label: "CORE 02",
    title: "光と闇、そしてその狭間",
    titleEn: "Light, darkness, and the space between",
    text:
      "心を闇に呑まれた者からは「ハートレス」が生まれ、あとに残された身体と意志は「ノーバディ」になります。心を失うと、人は二つに分かれてしまう——これがシリーズの基本ルールです。どちらかに振り切らず、境界を歩ける者こそが物語の鍵を握ります。",
    textEn:
      "When a heart is swallowed by darkness, a Heartless is born; the body and will left behind become a Nobody. Losing your heart splits a person in two — that's the series' fundamental rule. It's those who can walk the line between the two, without tipping fully to either side, who hold the key to the story."
  },
  {
    label: "CORE 03",
    title: "キーブレードと、受け継ぐということ",
    titleEn: "The Keyblade, and what it means to inherit it",
    text:
      "キーブレードは血筋や才能ではなく、心の強さで選ばれた者に受け継がれます。主人公ソラの強さの源は特別な力ではなく、仲間とのつながりそのものです。だから彼の心の中には、いくつもの他者の記憶と存在が宿っています。",
    textEn:
      "The Keyblade passes not by bloodline or talent, but to those chosen for the strength of their heart. The hero Sora's strength comes not from any special power, but from his bonds with others — which is why his heart carries the memories and presence of so many people besides himself."
  },
  {
    label: "CORE 04",
    title: "ダークシーカー編という一本の線",
    titleEn: "The Dark Seeker Saga: one continuous thread",
    text:
      "第1作から『III』までを貫く大きな筋が「ダークシーカー編」です。ゼアノートは、7人の「光の守護者」と13人の「闇の探求者」をぶつけ合わせて特別なキーブレード「χブレード」を再現し、世界を作り直そうとしました。あらゆる時代に自らの分身を配し、テラの身体まで奪って計画を進める彼を、ソラたち光の守護者がキーブレード墓場で退けるまでの物語です。",
    textEn:
      "The great thread running from the first game through KINGDOM HEARTS III is the Dark Seeker Saga. Xehanort sought to recreate the singular Keyblade known as the χ-blade by pitting seven Guardians of Light against thirteen Seekers of Darkness, hoping to remake the worlds themselves. It's the story of his plan — carried out across every era through copies of himself, even by stealing Terra's own body — and of how Sora and the other Guardians of Light finally turn him back at the Keyblade Graveyard."
  }
];

/* ------------------------------------------------------------
   SECRET MEMORY 下部「記憶に残る、場面」ギャラリー
   secret.js が描く。名シーンはユーザーが自分で選ぶ:
   画像を assets/scenes/<id>.(jpg|png|webp) に置く → その画像を見て
   work(WORKS の id)/ title / caption をここに追記する。
   title と caption が空のうちは、ファイル名だけのプレースホルダーを表示。
   ------------------------------------------------------------ */
const SECRET_SCENES = [
  {
    id: "s01",
    work: "kh2",
    title: "「俺の夏休み……終わっちゃった」",
    titleEn: "'My summer vacation... is over'",
    caption: "ロクサスの七日間の果て。眠るソラを納めた白い花の前に立ち、消えていく自分の夏を静かに見送る。",
    captionEn: "At the end of Roxas's seven days, he stands before the white flower pod holding the sleeping Sora, quietly watching his own summer fade away.",
    image: "assets/scenes/s01.webp"
  },
  {
    id: "s02",
    work: "kh2",
    title: "光の中の、ロクサスとソラ",
    titleEn: "Roxas and Sora, within the light",
    caption: "二本のキーブレードを地に突き立て、消える前のロクサスがソラに問いをぶつける——「なんで、お前なんだよ」。",
    captionEn: "Planting two Keyblades in the ground, Roxas, moments from disappearing, throws a question at Sora: 'Why does it have to be you?'",
    image: "assets/scenes/s02.jpg"
  },
  {
    id: "s03",
    work: "kh1",
    title: "「繋がる心が、俺の力だ」",
    titleEn: "'The hearts I've connected with — that's my power'",
    caption: "ホロウバスティオンでリクと刃を交わすソラ。特別な力ではなく、仲間との絆こそが強さなのだと言い切る。",
    captionEn: "Crossing blades with Riku in Hollow Bastion, Sora declares that his strength comes not from any special power, but from his bonds with his friends.",
    image: "assets/scenes/s03.jpg"
  },
  {
    id: "s04",
    work: "kh3",
    title: "ロクサス、還る",
    titleEn: "Roxas returns",
    caption: "キーブレード墓場に戻ってきたロクサス。アクセル、シオンとふたたび並び立つ——「それは繋がりだ」。",
    captionEn: "Roxas comes back at the Keyblade Graveyard, standing once more alongside Axel and Xion: 'That's a connection.'",
    image: "assets/scenes/s04.jpg"
  },
  {
    id: "s05",
    work: "days",
    title: "時計塔の、三人",
    titleEn: "The three of them, on the clock tower",
    caption: "アクセル、ロクサス、シオン。トワイライトタウンの夕暮れとアイスクリームだけが、記録に残らない日々を繋いでいた。",
    captionEn: "Axel, Roxas, and Xion. Only the sunset over Twilight Town and their ice cream held together the days that were never recorded.",
    image: "assets/scenes/s05.jpg"
  },
  {
    id: "s06",
    work: "kh3",
    title: "光の守護者、集結",
    titleEn: "The Guardians of Light, gathered",
    caption: "キーブレード墓場。リク、王様、ドナルド、グーフィーに見守られ、ソラが光をひとつに束ねて掲げる。",
    captionEn: "At the Keyblade Graveyard, watched over by Riku, King Mickey, Donald, and Goofy, Sora gathers the light into one and raises it high.",
    image: "assets/scenes/s06.jpg"
  }
];

/* ------------------------------------------------------------
   MEMORY OF SUMMER(roxas.html)のロクサス写真スライドショー
   roxas.js が回す。画像は assets/roxas/<id>.(jpg|png|webp) に置く
   (未設置ならファイル名のプレースホルダーを表示)。caption は任意。
   ------------------------------------------------------------ */
const ROXAS_SHOTS = [
  {
    id: "r01",
    caption: "トワイライトタウンの仲間——ハイネ、ピンス、オレット。「切符 買いに行こっ!」海へ行くはずだった、夏休みの計画。",
    captionEn: "Friends in Twilight Town — Hayner, Pence, and Olette. 'Let's go buy the tickets!' A summer plan that was supposed to take them to the sea.",
    image: "assets/roxas/r01.jpg"
  },
  {
    id: "r02",
    caption: "駅の時計塔から夕日を眺めて、シーソルトアイスをかじる。四人の、いつもの場所。",
    captionEn: "Watching the sunset from the station clock tower, biting into sea-salt ice cream — the four of them's usual spot.",
    image: "assets/roxas/r02.jpg"
  },
  {
    id: "r03",
    caption: "森の奥、宙に浮かぶ透き通った文字。「意味が欲しいか?」——問いだけが、彼を追ってくる。",
    captionEn: "Deep in the woods, translucent letters float in the air. 'Do you want a meaning?' — only the question keeps following him.",
    image: "assets/roxas/r03.jpg"
  },
  {
    id: "r04",
    caption: "空中に「ROXAS」の名が結ばれる。自分の名前すら、誰かに与えられたものだった。",
    captionEn: "The name ROXAS forms in midair. Even his own name turns out to be something given to him by someone else.",
    image: "assets/roxas/r04.jpg"
  },
  {
    id: "r05",
    caption: "自分の部屋で、ストラグルの青いトロフィーを手に。「まだ あと一つ、夢を——」穏やかな時間が、もう長くないことを知らずに。",
    captionEn: "In his room, holding the blue Struggle trophy. 'Just one more wish...' — not yet knowing that these calm days won't last much longer.",
    image: "assets/roxas/r05.jpg"
  },
  {
    id: "r06",
    caption: "路地裏の「いつもの場所」。何気ない集合、他愛のない話。この夏がまるごと作りものだと、まだ誰も気づかない。",
    captionEn: "The usual spot in the back alley. An ordinary gathering, idle conversation. No one yet realizes that this whole summer is a fabrication.",
    image: "assets/roxas/r06.png"
  }
];

/* ------------------------------------------------------------
   キャラクター相関図(SECRET MEMORY に掲載)
   secret.js が SVG(顔画像の丸アイコン)に描く。座標は viewBox 0 0 1320 880 上の位置。
   side  : light(青リング) / dark(金リング)。hub は中心的な人物(太リング＋発光)
   img   : 顔画像のパス(省略時は頭文字アイコン)
   links : type =
     bond   … 相互の絆・協力(矢印なしの実線)
     origin … 「A から生まれた/由来する/心が受け継がれた」(A→B の破線・金の矢印)
     clash  … 敵対・干渉(A→B の点線・赤の矢印)
     axis   … 物語の主対立(両向き矢印・強調)
   関係の性質は公式作品・日本語版設定に基づく(ノーバディ/ハートレス/レプリカ 等)
   ------------------------------------------------------------ */
const RELATION_MAP = {
  /* viewBox は 0 0 1320 880。4つの島(ウェイファインダー / デスティニー組 /
     ノーバディ・七日間 / ゼアノートの分身)に分け、島をまたぐ長い線は
     大きな bow を与えて外周を回す。link.bow … 弧の張り出し量(＋/−で向き。
     省略時は中心 RMAP_CX,CY から離れる向きに自動で軽く湾曲) */
  nodes: [
    /* --- ウェイファインダー(左) --- */
    { id: "terra",    label: "テラ",         labelEn: "Terra",         side: "light", x: 140,  y: 95,  img: "assets/characters/terra.webp" },
    { id: "eraqus",   label: "エラクゥス",   labelEn: "Master Eraqus", side: "light", x: 330,  y: 215, img: "assets/characters/master-eraqus.webp" },
    { id: "aqua",     label: "アクア",       labelEn: "Aqua",          side: "light", x: 150,  y: 340, img: "assets/characters/aqua.webp" },
    { id: "ventus",   label: "ヴェントゥス", labelEn: "Ventus",        side: "light", x: 330,  y: 470, img: "assets/characters/ventus.webp" },
    { id: "vanitas",  label: "ヴァニタス",   labelEn: "Vanitas",       side: "dark",  x: 300,  y: 660, img: "assets/characters/vanitas.webp" },
    /* --- デスティニー組(中央) --- */
    { id: "riku",     label: "リク",         labelEn: "Riku",         side: "light", x: 560,  y: 150, img: "assets/characters/riku.webp" },
    { id: "mickey",   label: "王様",         labelEn: "King Mickey",  side: "light", x: 460,  y: 330, img: "assets/characters/king-mickey.webp" },
    { id: "sora",     label: "ソラ",         labelEn: "Sora",         side: "light", x: 660,  y: 470, hub: true, img: "assets/characters/sora.webp" },
    { id: "kairi",    label: "カイリ",       labelEn: "Kairi",        side: "light", x: 520,  y: 690, img: "assets/characters/kairi.webp" },
    { id: "donald",   label: "旅の仲間",     labelEn: "Companions",   side: "light", x: 730,  y: 690, img: "assets/characters/donald-duck.webp" },
    /* --- ノーバディ・七日間(中央右) --- */
    { id: "roxas",    label: "ロクサス",     labelEn: "Roxas",  side: "light", x: 900,  y: 380, img: "assets/characters/roxas.webp" },
    { id: "axel",     label: "アクセル",     labelEn: "Axel",   side: "light", x: 1020, y: 320, img: "assets/characters/axel.webp" },
    { id: "xion",     label: "シオン",       labelEn: "Xion",   side: "light", x: 1000, y: 600, img: "assets/characters/xion.webp" },
    { id: "namine",   label: "ナミネ",       labelEn: "Naminé", side: "light", x: 870,  y: 610, img: "assets/characters/namine.webp" },
    /* --- ゼアノートの分身(右) --- */
    { id: "ansem",    label: "アンセム",     labelEn: "Ansem",     side: "dark",  x: 1250, y: 160, img: "assets/characters/ansem-seeker-of-darkness.webp" },
    { id: "xehanort", label: "ゼアノート",   labelEn: "Xehanort",  side: "dark",  x: 1260, y: 470, hub: true, img: "assets/characters/xehanort.webp" },
    { id: "xigbar",   label: "シグバール",   labelEn: "Xigbar",    side: "dark",  x: 1070, y: 715, img: "assets/characters/xigbar.webp" },
    { id: "xemnas",   label: "ゼムナス",     labelEn: "Xemnas",    side: "dark",  x: 1250, y: 785, img: "assets/characters/xemnas.webp" }
  ],
  links: [
    /* ウェイファインダーと師 */
    { from: "eraqus", to: "terra",  type: "bond", label: "師と弟子", labelEn: "Master & student" },
    { from: "terra",  to: "aqua",   type: "bond", label: "同門の友", labelEn: "Fellow disciples" },
    { from: "aqua",   to: "ventus", type: "bond", label: "ウェイファインダー", labelEn: "Wayfinder" },
    { from: "terra",  to: "ventus", type: "bond", label: "兄弟弟子", labelEn: "Brothers in training", bow: -40 },
    /* 主人公と仲間 */
    { from: "sora",   to: "riku",   type: "bond", label: "親友", labelEn: "Best friends" },
    { from: "sora",   to: "kairi",  type: "bond", label: "帰る場所", labelEn: "Home to return to" },
    { from: "sora",   to: "donald", type: "bond", label: "旅の仲間", labelEn: "Traveling companion" },
    { from: "mickey", to: "sora",   type: "bond", label: "導く", labelEn: "Guides" },
    { from: "mickey", to: "riku",   type: "bond", label: "闇の中で共闘", labelEn: "Fought together in darkness" },
    /* 夏の三人 */
    { from: "roxas",  to: "axel",   type: "bond", label: "親友", labelEn: "Best friends" },
    { from: "axel",   to: "xion",   type: "bond", label: "仲間", labelEn: "Friends" },
    { from: "roxas",  to: "xion",   type: "bond", label: "三人の夏", labelEn: "Their summer together", bow: 70 },
    { from: "namine", to: "sora",   type: "bond", label: "記憶を繋ぎ直す", labelEn: "Reconnects memory" },
    /* 生まれた/由来する(破線・金・矢印) */
    { from: "sora",     to: "roxas",  type: "origin", label: "ノーバディ", labelEn: "Nobody" },
    { from: "kairi",    to: "namine", type: "origin", label: "ノーバディ", labelEn: "Nobody", bow: -50 },
    { from: "xehanort", to: "xemnas", type: "origin", label: "ノーバディ", labelEn: "Nobody" },
    { from: "xehanort", to: "ansem",  type: "origin", label: "ハートレス", labelEn: "Heartless" },
    { from: "ventus",   to: "vanitas",type: "origin", label: "切り離された闇", labelEn: "Darkness split away" },
    { from: "ventus",   to: "roxas",  type: "origin", label: "姿を与える", labelEn: "Gives form", bow: -45 },
    { from: "sora",     to: "xion",   type: "origin", label: "記憶のレプリカ", labelEn: "Memory replica", bow: -30 },
    { from: "ventus",   to: "sora",   type: "origin", label: "心が宿る", labelEn: "A heart resides within", bow: 30 },
    /* 敵対・干渉(点線・赤・矢印) */
    { from: "xehanort", to: "terra",  type: "clash", label: "身体を奪う", labelEn: "Steals his body", bow: 450 },
    { from: "ansem",    to: "riku",   type: "clash", label: "憑依する", labelEn: "Possesses", bow: -90 },
    { from: "xehanort", to: "xigbar", type: "bond",  label: "古き協力者", labelEn: "Old ally" },
    /* 物語の主対立 */
    { from: "sora",     to: "xehanort", type: "axis", label: "対立の主軸", labelEn: "The story's central conflict", bow: 0 }
  ]
};
