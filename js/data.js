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
    note:
      "作品ごとに編曲を変えながら、20年以上ずっとタイトル画面に置かれ続けている曲。" +
      "ピアノで置かれる最初の数音を聴くだけで、これから始まる旅の気配が戻ってくる。",
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
    note:
      "日常の隙間にある不安と、それでも手を伸ばす気持ちを歌った曲。" +
      "シリーズが「心のつながり」を描く物語であることを、最初に決定づけた一曲。",
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
    note:
      "喪失を抱えたまま前へ進む強さを歌った曲。" +
      "ロクサスの夏から始まる II の物語の、影のある明るさによく合っている。",
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
    note:
      "長い旅の結び目にふさわしい、穏やかで芯のあるバラード。" +
      "「光」から始まった問いに、大人になった声で答えるような曲。",
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
    note:
      "静かなバラードが多い主題歌の系譜のなかで、ひときわ攻めた音作り。" +
      "恐れと向き合う、というシリーズの核をそのままタイトルにしている。",
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
    note:
      "ロクサスのテーマ「Roxas」を短調で組み直し、ピアノと弦で緊張感を高めたアレンジ。" +
      "戦いの曲でありながら、どこかお別れの音楽のように聞こえる。",
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
    note:
      "ラテン語の合唱が重なる荘厳な一曲。" +
      "ステンドグラスの上に降り立ち、最初の選択を迫られるあの緊張感そのもの。",
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
    note:
      "BIRTH BY SLEEP の終幕で、まだ何も知らない少年として初めて描かれるソラに寄り添う曲。" +
      "ヒーローの勇ましさより、まっすぐさと幼さが前に出た旋律。",
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
    note:
      "「Xion」のメロディに、女声ボーカルと拍の重い伴奏を重ねた曲。" +
      "戦うほどに悲しくなる、DAYS の結末を象徴する一曲。",
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
    note:
      "題名はフランス語で「シオンの悲しみのための音楽」。" +
      "シーソルトアイスを分け合った夕暮れが、もう戻らないことを教えてくる曲。",
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
    { id: "f01", page: "TOP",     name: "デスティニーアイランドの潮騒" },
    { id: "f02", page: "TOP",     name: "パオプの実" },
    { id: "f03", page: "TOP",     name: "扉の在り処" },
    { id: "f04", page: "TOP",     name: "ダイブ・トゥ・ザ・ハート" },
    { id: "f05", page: "TOP",     name: "呼びかける声" },
    { id: "f06", page: "TOP",     name: "キーブレードの継承" },
    { id: "f07", page: "ALBUM",   name: "最初の冒険" },
    { id: "f08", page: "ALBUM",   name: "忘却の城の記憶" },
    { id: "f09", page: "ALBUM",   name: "失われた名前" },
    { id: "f10", page: "ALBUM",   name: "シーソルトアイスの味" },
    { id: "f11", page: "ALBUM",   name: "還る場所" },
    { id: "f12", page: "SECRET",  name: "こころのかたち" }
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
    detail: [
      "シリーズの原点となる作品です。日常だったはずの島が闇に呑まれ、ソラは見知らぬ世界へと放り出されます。そこで出会ったドナルドとグーフィーとともに、閉ざされた世界の鍵穴をひとつずつ封じていきます。",
      "「心」と「絆」という、シリーズを通して描かれ続けるテーマがここで提示されます。冒険の楽しさと、大切なものを失う痛みが同居する物語構成が特徴です。"
    ],
    keywords: ["キーブレード", "ハートレス", "世界の鍵穴"]
  },
  {
    id: "com",
    short: "CoM",
    year: "2004",
    title: "CHAIN OF MEMORIES",
    subtitle: "積み上げるほど、崩れてゆく",
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
    detail: [
      "「忘却の城」を舞台に、階層を昇るたび記憶が組み替えられていく異色の作品です。カードを用いた戦闘システムが採用され、シリーズの中でも独特の手触りを持ちます。",
      "本作の主題はまさに『記憶』そのものです。思い出は本物なのか、それとも作られたものなのか——このサイトのテーマにも直結する一作です。リク編ではもうひとつの視点から城の物語が語られます。"
    ],
    keywords: ["忘却の城", "ナミネ", "XIII機関"]
  },
  {
    id: "kh2",
    short: "II",
    year: "2005",
    title: "KINGDOM HEARTS II",
    subtitle: "眠りから覚める、もうひとりの物語",
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
    detail: [
      "前作から時を経て描かれる正統続編です。冒頭で描かれるロクサスの数日間が、物語全体に深い影を落としていきます。",
      "アクション性が大きく進化し、シリーズの完成形のひとつとして高く評価されています。物語面ではXIII機関との対立が本格化します。"
    ],
    keywords: ["ロクサス", "ノーバディ", "ドライブフォーム"]
  },
  {
    id: "days",
    short: "Days",
    year: "2009",
    title: "358/2 DAYS",
    subtitle: "存在しないはずの、たしかな日々",
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
    detail: [
      "日付ごとに物語が進行する構成で、淡々とした日常の描写が積み重なっていきます。時計塔の上で三人が分け合ったシーソルトアイスの味が、シリーズ屈指の象徴的な場面として語り継がれています。",
      "「存在しない者たちの物語」でありながら、その日々は確かにあった——という切なさが全編を貫きます。"
    ],
    keywords: ["シーソルトアイス", "時計塔", "シオン"]
  },
  {
    id: "bbs",
    short: "BbS",
    year: "2010",
    title: "BIRTH BY SLEEP",
    subtitle: "すべてが始まる、はるか以前",
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
    detail: [
      "三人の主人公それぞれの視点で同じ時間軸を辿る構成が採られています。三つの物語を通して初めて全体像が見えてくる、緻密なシナリオ設計が特徴です。",
      "アクアが作ったお守り「ウェイファインダー」に込められた、決して失われない繋がりという願いが、後の作品にまで長く響き続けます。"
    ],
    keywords: ["ウェイファインダー", "キーブレード墓場", "ゼアノート"]
  },
  {
    id: "recoded",
    short: "coded",
    year: "2010",
    title: "Re:coded",
    subtitle: "データの海に沈む、傷の記録",
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
    detail: [
      "デジタル空間を舞台とした実験的な作品です。バグとして現れる異常が、物語上の「傷」と重ね合わせて描かれます。",
      "終盤に明かされる内容が、以降の作品の展開を大きく方向づける重要な一作となっています。"
    ],
    keywords: ["データ世界", "バグ", "ジミニーメモ"]
  },
  {
    id: "ddd",
    short: "3D",
    year: "2012",
    title: "DREAM DROP DISTANCE",
    subtitle: "眠りの世界で、二人は落ちてゆく",
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
    detail: [
      "ソラとリクを切り替えながら進行する独特の構成です。「眠り」と「夢」という新しいモチーフが導入されました。",
      "シリーズ全体の時間軸に関わる大きな仕掛けが明かされ、次章への橋渡しとなる作品です。"
    ],
    keywords: ["眠りの世界", "承認試験", "ドリームイーター"]
  },
  {
    id: "unionx",
    short: "χ",
    year: "2013",
    title: "χ SERIES",
    subtitle: "最も古い記憶、最初の争い",
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
    detail: [
      "ブラウザおよびスマートフォン向けに展開された作品群です。長期にわたって配信され、シリーズの根幹に関わる神話的な時代が語られました。",
      "後の作品で語られる出来事の「原因」が、この時代に置かれています。"
    ],
    keywords: ["予言の書", "キーブレード戦争", "マスター・オブ・マスター"]
  },
  {
    id: "fragmentary",
    short: "0.2",
    year: "2017",
    title: "0.2 -A FRAGMENTARY PASSAGE-",
    subtitle: "闇の底で、ひとり歩き続ける",
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
    detail: [
      "短編ながら、最新世代の映像表現でシリーズの世界観を描き直した作品です。深い闇の中に差す一筋の光が印象的に演出されます。",
      "『KINGDOM HEARTS III』へと直接つながる、重要な前哨となる物語です。"
    ],
    keywords: ["闇の世界", "ウェイファインダー", "アクア"]
  },
  {
    id: "kh3",
    short: "III",
    year: "2019",
    title: "KINGDOM HEARTS III",
    subtitle: "長い旅路の、その果てへ",
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
    detail: [
      "シリーズの大きな区切りとなる作品です。歴代作品で積み重ねられてきた伏線が、次々と回収されていきます。",
      "映像表現が飛躍的に向上し、これまで語られてきた世界がより豊かに描かれました。"
    ],
    keywords: ["七人の守護者", "XIII機関", "決着"]
  },
  {
    id: "mom",
    short: "MoM",
    year: "2020",
    title: "MELODY OF MEMORY",
    subtitle: "音とともに辿る、これまでの道",
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
    detail: [
      "リズムアクションという形式で、シリーズの歴史を振り返る構成になっています。楽曲を聴きながら過去の場面が甦る演出が特徴です。",
      "本サイトの企画意図——「記憶を辿る」——に最も近い体験を持つ作品といえます。"
    ],
    keywords: ["下村陽子", "Dearly Beloved", "振り返り"]
  },
  {
    id: "kh4",
    short: "IV",
    year: "NEXT",
    title: "KINGDOM HEARTS IV",
    subtitle: "まだ語られていない、これからの記憶",
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
    detail: [
      "新章「ロストマスター編」の幕開けとなる作品として発表されました。クアドラトゥムという見慣れない街に立つソラの姿が公開されています。",
      "この空白のページこそが、旅がまだ終わっていないことの証しです。続報が出たら、この項目を書き足していきましょう。"
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
  unionx:      { chrono: 1,  era: "シリーズ最古 ―― おとぎ話の時代とキーブレード戦争" },
  bbs:         { chrono: 2,  era: "『KINGDOM HEARTS』の約10年前" },
  fragmentary: { chrono: 3,  era: "BbS の直後 ―― 終盤は『III』の直前へ直結" },
  kh1:         { chrono: 4,  era: "物語の起点" },
  com:         { chrono: 5,  era: "『KINGDOM HEARTS』の直後 ―― 忘却の城" },
  days:        { chrono: 6,  era: "KH1後〜『II』の直前(CoM と並行するロクサスの日々)" },
  kh2:         { chrono: 7,  era: "『358/2 Days』の終わりから" },
  recoded:     { chrono: 8,  era: "『II』の少し後 ―― ジミニーの日誌のデータ世界" },
  ddd:         { chrono: 9,  era: "Re:coded の後、『III』の前 ―― マーク・オブ・マスタリー試験" },
  kh3:         { chrono: 10, era: "DDD の後 ―― ダークシーカー編・完結" },
  mom:         { chrono: 11, era: "『III』の直後 ―― カイリが記憶を辿る" },
  kh4:         { chrono: 12, era: "『III』の後 ―― 新章「ロストマスター編」" }
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
    text: "ソラたちが暮らす南の島。外の世界に憧れた三人がいかだを作っていた場所であり、すべての旅の出発点。"
  },
  {
    name: "トラヴァースタウン",
    en: "TRAVERSE TOWN",
    emblem: "lamp",
    hue: 200,
    image: "assets/worlds/traverse-town.png",
    works: ["kh1", "kh2"],
    text: "世界を失った者たちが流れ着く、夜だけの街。旅のはじまりに訪れる、静かな中継地点。"
  },
  {
    name: "ホロウバスティオン",
    en: "HOLLOW BASTION",
    emblem: "castle",
    hue: 250,
    image: "assets/worlds/hollow-bastion.png",
    works: ["kh1", "kh2", "bbs"],
    text: "闇に侵された巨大な城。かつては光に満ちたレイディアントガーデンと呼ばれる庭園都市だった。"
  },
  {
    name: "忘却の城",
    en: "CASTLE OBLIVION",
    emblem: "castleWhite",
    hue: 265,
    image: "assets/worlds/castle-oblivion.png",
    works: ["com"],
    text: "昇るほどに記憶を失っていく白い城。手にした思い出が、いつの間にか別のものにすり替わっていく。"
  },
  {
    name: "トワイライトタウン",
    en: "TWILIGHT TOWN",
    emblem: "clocktower",
    hue: 28,
    image: "assets/worlds/twilight-town.png",
    works: ["kh2", "days", "ddd", "kh3"],
    text: "いつも夕暮れが続く街。時計塔の上で分け合うシーソルトアイスが、失われた日々の象徴となる。"
  },
  {
    name: "存在しなかった世界",
    en: "THE WORLD THAT NEVER WAS",
    emblem: "moonHeart",
    hue: 280,
    image: "assets/worlds/the-world-that-never-was.png",
    works: ["kh2", "days", "kh3"],
    text: "雨の降りやまない、ノーバディたちの街。空には人工のキングダムハーツが月のように浮かんでいる。"
  },
  {
    name: "旅立ちの地",
    en: "LAND OF DEPARTURE",
    emblem: "gate",
    hue: 180,
    image: "assets/worlds/land-of-departure.png",
    works: ["bbs", "fragmentary"],
    text: "キーブレード使いが修行を積んだ場所。テラ・アクア・ヴェントゥスの三人が旅立った、始まりの地。"
  },
  {
    name: "キーブレード墓場",
    en: "KEYBLADE GRAVEYARD",
    emblem: "graveyard",
    hue: 40,
    image: "assets/worlds/keyblade-graveyard.jpg",
    works: ["bbs", "kh3"],
    text: "無数のキーブレードが刺さったまま風にさらされる荒野。かつての戦争と、来るべき決着の舞台。"
  },

  /* --- ディズニー作品を舞台にしたワールド --- */
  {
    name: "ワンダーランド",
    en: "WONDERLAND",
    emblem: "teacup",
    hue: 300,
    image: "assets/worlds/wonderland.png",
    works: ["kh1"],
    text: "上下も大きさもあべこべな不思議の国。白ウサギを追いかけたアリスが迷い込んだ場所。"
  },
  {
    name: "オリンポスコロシアム",
    en: "OLYMPUS COLISEUM",
    emblem: "column",
    hue: 15,
    image: "assets/worlds/olympus-coliseum.png",
    works: ["kh1", "kh2", "bbs", "kh3"],
    text: "英雄を目指す者たちが戦う闘技場。ヘラクレスとその師フィルのもとで、ソラも力を試す。"
  },
  {
    name: "ディープジャングル",
    en: "DEEP JUNGLE",
    emblem: "jungleLeaf",
    hue: 140,
    image: "assets/worlds/deep-jungle.png",
    works: ["kh1"],
    text: "人の手が入らない深い密林。ターザンとその家族が暮らす、緑に覆われた世界。"
  },
  {
    name: "アグラバー",
    en: "AGRABAH",
    emblem: "genieLamp",
    hue: 42,
    image: "assets/worlds/agrabah.png",
    works: ["kh1", "kh2"],
    text: "砂漠に広がる王国の街。ランプの魔人ジーニーと、泥棒アラジンの物語の舞台。"
  },
  {
    name: "モンストロ",
    en: "MONSTRO",
    emblem: "whaleWave",
    hue: 205,
    image: "assets/worlds/monstro.jpg",
    works: ["kh1"],
    text: "海を漂う巨大な鯨の腹の中。ゼペットとピノキオを探して、ソラたちがその内部に迷い込む。"
  },
  {
    name: "アトランティカ",
    en: "ATLANTICA",
    emblem: "shell",
    hue: 190,
    image: "assets/worlds/atlantica.png",
    works: ["kh1", "kh2"],
    text: "海の底に広がる人魚の王国。アリエルが暮らす、歌と波に満ちた世界。"
  },
  {
    name: "ハロウィンタウン",
    en: "HALLOWEEN TOWN",
    emblem: "pumpkinFace",
    hue: 275,
    image: "assets/worlds/halloween-town.png",
    works: ["kh1", "kh2"],
    text: "かぼちゃの明かりが灯る、不気味で愛らしい街。ジャック・スケリントンが治める「引っかけ祭りの王」の国。"
  },
  {
    name: "ネバーランド",
    en: "NEVERLAND",
    emblem: "sparkle",
    hue: 120,
    image: "assets/worlds/neverland.png",
    works: ["kh1", "com"],
    text: "決して大人にならない島。ピーター・パンとティンカー・ベルが暮らす、妖精の粉が舞う空の世界。"
  },
  {
    name: "ビーストキャッスル",
    en: "BEAST'S CASTLE",
    emblem: "rose",
    hue: 335,
    image: "assets/worlds/beast's-castle.jpg",
    works: ["kh2"],
    text: "呪いをかけられた野獣と、彼を想うベルが暮らす古城。枯れゆく一輪のバラが、呪いの期限を示す。"
  },
  {
    name: "100エーカーの森",
    en: "100 ACRE WOOD",
    emblem: "honeypot",
    hue: 38,
    image: "assets/worlds/100-acre-wood.png",
    works: ["kh1", "kh2", "kh3"],
    text: "絵本の中に広がる、くまのプーさんたちが暮らすのどかな森。ソラの心の奥にひっそりと存在している。"
  },
  {
    name: "ポートロイヤル",
    en: "PORT ROYAL",
    emblem: "anchor",
    hue: 32,
    image: "assets/worlds/port-royal.png",
    works: ["kh2"],
    text: "海賊たちが行き交うカリブの港町。呪われた黄金を巡る、ジャック・スパロウたちの物語の舞台。"
  },
  {
    name: "タイムレスリバー",
    en: "TIMELESS RIVER",
    emblem: "clocktower",
    hue: 220,
    image: "assets/worlds/timeless-river.png",
    works: ["kh2"],
    text: "白黒の時代へと遡った、過去のディズニータウン。若き日のミッキーが活躍する時間を旅する。"
  },
  {
    name: "スペースパラノイド",
    en: "SPACE PARANOIDS",
    emblem: "grid",
    hue: 195,
    image: "assets/worlds/space-paranoids.png",
    works: ["kh2"],
    text: "コンピューターの内部に広がるデジタル空間。プログラムたちが行き交う、光の格子で出来た世界。"
  },
  {
    name: "プライド・ランド",
    en: "PRIDE LANDS",
    emblem: "pawPrint",
    hue: 34,
    image: "assets/worlds/pride-lands.jpg",
    works: ["kh2"],
    text: "広大なサバンナに広がる、百獣の王の国。動物の姿になったソラが、シンバとともに大地を駆ける。"
  },
  {
    name: "ザ・ランド・オブ・ドラゴン",
    en: "LAND OF DRAGONS",
    emblem: "dragonCrest",
    hue: 355,
    image: "assets/worlds/land-of-dragons.jpg",
    works: ["kh2"],
    text: "万里の長城が連なる大地。男装したムーランとともに、フン族の侵攻に立ち向かう。"
  },
  {
    name: "サンフランソウキョウ",
    en: "SAN FRANSOKYO",
    emblem: "circuitTower",
    hue: 8,
    image: "assets/worlds/san-fransokyo.png",
    works: ["kh3"],
    text: "和と洋が入り混じる近未来都市。ヒロとベイマックスが、街を見守るヒーローたちとともに現れる。"
  },
  {
    name: "キングダム・オブ・コロナ",
    en: "KINGDOM OF CORONA",
    emblem: "rapunzelTower",
    hue: 46,
    image: "assets/worlds/kingdom-of-corona.png",
    works: ["kh3"],
    text: "高い塔に幽閉されたラプンツェルが暮らす王国。金色の髪と、無数のランタンの光が印象的な世界。"
  },
  {
    name: "アレンデール",
    en: "ARENDELLE",
    emblem: "snowflake",
    hue: 198,
    image: "assets/worlds/arendelle.png",
    works: ["kh3"],
    text: "氷の力を持つエルサが治める王国。姉妹の絆をめぐる物語が、雪と氷の景色の中で描かれる。"
  },
  {
    name: "ザ・カリビアン",
    en: "THE CARIBBEAN",
    emblem: "shipWheel",
    hue: 26,
    image: "assets/worlds/the-caribbean.png",
    works: ["kh3"],
    text: "呪われた心臓の秘宝を巡る、海賊たちの物語の舞台。ポートロイヤルの物語の続きが描かれる。"
  },
  {
    name: "トイボックス",
    en: "TOY BOX",
    emblem: "toyBlock",
    hue: 4,
    image: "assets/worlds/toy-box.png",
    works: ["kh3"],
    text: "おもちゃたちが自分の意志で動き出す世界。ウッディやバズとともに、迷子のおもちゃを探す。"
  },
  {
    name: "モンストロポリス",
    en: "MONSTROPOLIS",
    emblem: "doorway",
    hue: 165,
    image: "assets/worlds/monstropolis.png",
    works: ["kh3"],
    text: "モンスターたちが暮らす街。無数のドアが、子供部屋と怪物の世界とを繋いでいる。"
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
    detail:
      "シリーズの主人公として、一貫して「他者のために動く」という姿勢を貫きます。強さの源は特別な力ではなく、仲間との繋がりそのものとして描かれます。彼の心の中には、いくつもの他者の記憶が眠っています。"
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
    detail:
      "一度は道を踏み外しながらも、自らの選択の責任を引き受け続ける人物です。「闇に落ちても、心まで奪われるとは限らない」というテーマを体現し、後にはその闇を力として使いこなすようになります。"
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
    detail:
      "物語の中で「帰るべき場所」の象徴として描かれます。心に闇を持たない光の姫君として狙われる立場でありながら、後の作品では自らキーブレードを取り、戦う道を選びます。"
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
    detail: "ゼアノートのノーバディ。心を持たないはずの身でありながら、誰よりも「心とは何か」を求め続けた人物です。"
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
    detail: "機関では古参の一人。実はゼアノートに関わる特別な因縁を持つ人物であることが、後の作品で明かされます。"
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
    detail: "ビーストキャッスルに潜み、野獣の心の闇につけ込もうと画策する場面が印象的なメンバーです。"
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
    detail: "忘却の城でアクセルに消されますが、『III』では新生XIII機関に加わり、やがて自らの過ちと向き合います。"
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
    detail: "言葉少なながら、確かな信念を持って行動する、機関の中でも異色の存在です。"
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
    detail: "直接戦うよりも、情報と幻術で状況を支配することを好む人物として描かれます。"
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
    detail: "ロクサスやアクセルとかつて近しい間柄だったことが、後の物語に重い意味を持たせます。"
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
    detail:
      "心を持たないはずのノーバディでありながら、誰よりも友を想う行動を取り続けます。心が無いという設定への反証として立ち続ける、シリーズ屈指の人気キャラクターです。"
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
    detail: "機関の中では珍しく飄々とした、どこか気の抜けた雰囲気を持つメンバーです。"
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
    detail: "紳士的な物腰の裏で、勝つためにはどんな手段も辞さない冷徹さを併せ持ちます。"
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
    detail: "忘却の城でナミネの力を利用し、機関の頂点に立とうと画策する策謀家です。『III』では新生XIII機関の一員として、キーブレード墓場で再び立ちはだかります。"
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
    detail: "率直で辛辣な物言いを崩さず、忘却の城ではマールーシャの計画に加担します。『III』でも新生XIII機関の一員として、再びソラたちの前に現れます。"
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
    detail:
      "「自分は本物なのか」という問いを抱え続ける人物です。XIII機関で過ごした日々は記録に残りませんが、アクセルとシオンと過ごした時間の重みは、物語全体に響き続けます。"
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
    detail:
      "忘却の城でソラの記憶を作り変えてしまった張本人でありながら、その罪を自覚し、壊した鎖を繋ぎ直そうとします。「記憶」というテーマを最も直接的に担う人物です。"
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
    detail:
      "存在そのものが誰かの記憶の写しであるという、痛切な立場に置かれた人物です。彼女が消えたとき、その記憶もまた消えてしまう——という残酷さが、作品全体の主題と重なります。"
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
    detail: "弟子たちを想う気持ちに嘘はないものの、その頑なさがかえって悲劇を招いてしまう人物です。"
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
    detail:
      "自己犠牲と責任感の象徴として描かれます。果てのない闇のなかでも、テラとヴェントゥスへの想いとウェイファインダーを手放さなかった姿が、強い印象を残します。"
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
    detail:
      "善良でありながら、その真面目さゆえに追い詰められていく人物です。身体を失ったあとも意志だけで戦い続ける姿が、「心の強さ」というテーマを象徴します。"
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
    detail:
      "闇を切り離されたことで壊れかけた心を、ソラに救われた過去を持ちます。ロクサスとよく似た姿をしていることが、シリーズの大きな謎のひとつとして長く語られました。"
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
    detail:
      "「光には必ず影がある」というシリーズの主題を、最も直接的な形で体現した存在です。ヴェントゥスと再び一つになることを求め続けます。"
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
    detail:
      "「心とは何か」を問い続けるという点では主人公と同じ問いに立ちながら、真逆の答えを選び取った人物です。世界の均衡そのものを作り直そうとし、あらゆる時代に自らの分身を配置します。"
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
    detail: "飄々とした態度の裏で、遠い先の物語まで見据えて盤面を組み上げていた人物です。"
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
    detail: "重責を背負い込むあまり、仲間との間に溝を生んでしまう場面が描かれます。"
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
    detail: "冷静沈着で、五人のなかでは最後まで秩序を守ろうとした人物です。"
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
    detail: "マスターを誰より信じていたがゆえに、その不在に耐えきれなかった人物です。"
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
    detail: "マスターから密かに託された役目のために、仲間にも本心を明かせずにいます。"
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
    detail: "来たる戦いを生き延びる者たちを選び、未来そのものを守ろうとした人物です。"
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
    detail: "その長い旅の果てにたどり着いた姿が、XIII機関のシグバールです。"
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
    detail: "好奇心のままに真実へ踏み込んでいく、物語の相棒のような存在です。"
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
    detail: "ぬいぐるみのような見た目で、持ち主の心の状態をそっと気にかけ続けます。"
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
    detail: "のちに時を越えて現れ、老いたゼアノートの計画の駒として動くことになります。"
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
    detail: "「闇の中にこそ真実がある」と説き、あらゆるものを闇へ還そうとする最初の宿敵です。"
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
    detail: "憎しみに飲まれかけながらも、最後には自らの過ちを認め、ソラたちに託して去ります。"
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
    detail: "ディズニー城の王でありながら、危機とみれば自ら城を出て旅立ちます。必要な時にはソラたちのもとへ駆けつけ、キーブレードを手に道を示します。"
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
    detail: "王様の命によりソラの旅に同行し、魔法で仲間を支え続けます。グーフィーとの掛け合いも見どころです。"
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
    detail: "戦いの中でも決して仲間を見捨てない、旅の要となる存在です。その言葉がソラを何度も救います。"
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
    detail: "塔の上からソラたちを見守り、重要な局面で助言と使命を授ける、シリーズの案内役的存在です。"
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
    detail: "シリーズを通して幾度も暗躍する、最も息の長い敵役のひとりです。ドラゴンへと姿を変える力を持ちます。"
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
    detail: "憎めない愛嬌を漂わせつつ、あちこちの世界でトラブルを引き起こす、コミカルな敵役です。"
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
    detail: "青い炎をまとった皮肉屋で、機会があればハートレスや敵対者たちと手を組みます。"
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
    detail: "ハートレスに城を襲われても動じず、光の力でソラたちに道を開きます。"
  }
];

/* ------------------------------------------------------------
   用語集(この世界を読み解くための言葉)
   ------------------------------------------------------------ */
const GLOSSARY = [
  {
    term: "キーブレード",
    en: "KEYBLADE",
    text: "鍵の形をした武器。世界の鍵穴を開閉でき、心の強さに応じて選ばれた者にしか扱えない。"
  },
  {
    term: "ハートレス",
    en: "HEARTLESS",
    text: "心を闇に呑まれた者から生まれる存在。他者の心を求めて、世界から世界へと現れる。"
  },
  {
    term: "ノーバディ",
    en: "NOBODY",
    text: "心を失った者の身体と意志が残ったもの。心が無いはずなのに、なぜか感情のように振る舞う。"
  },
  {
    term: "アンヴァース",
    en: "UNVERSED",
    text: "ヴァニタスの負の感情から生まれる存在。彼の心の乱れがそのまま形になったもの。"
  },
  {
    term: "XIII機関",
    en: "ORGANIZATION XIII",
    text: "黒いコートをまとったノーバディたちの集団。それぞれが心を取り戻すことを目的に動く。"
  },
  {
    term: "ウェイファインダー",
    en: "WAYFINDER",
    text: "アクアが作った星形のお守り。離れていても必ず出会えるという、南の島の言い伝えに由来する。"
  },
  {
    term: "パオプの実",
    en: "PAOPU FRUIT",
    text: "星の形をした果実。二人で分け合うと運命が結ばれ、どんなに離れても繋がり続けるとされる。"
  },
  {
    term: "シーソルトアイス",
    en: "SEA-SALT ICE CREAM",
    text: "しょっぱいのに甘いアイス。時計塔の上で分け合った日々の象徴として、幾度も描かれる。"
  },
  {
    term: "キングダムハーツ",
    en: "KINGDOM HEARTS",
    text: "すべての心が行き着く場所。求める者によって、その姿も意味も変わっていく。"
  },
  {
    term: "Dearly Beloved",
    en: "MAIN THEME",
    text: "下村陽子によるシリーズの主題曲。作品ごとに姿を変えながら、必ずタイトル画面で流れ続けている。"
  },
  {
    term: "プリンセス・オブ・ハート",
    en: "PRINCESS OF HEART",
    text: "心に闇をまったく持たない七人の乙女。カイリもそのひとりであり、世界の均衡を左右する存在として狙われる。"
  },
  {
    term: "レプリカ",
    en: "REPLICA",
    text: "人工的に作られた身体に、誰かの記憶や力を移し替えた存在。シオンもまた、この技術によって生まれた。"
  },
  {
    term: "ドリームイーター",
    en: "DREAM EATER",
    text: "眠りの世界に棲む生き物。悪夢を食べる「スピリット」と、悪夢そのものである「ナイトメア」に分かれる。"
  },
  {
    term: "χ(キー)ブレード",
    en: "χ-BLADE",
    text: "すべての力の源となる特別なキーブレード。太古の戦争で20の欠片(7つの光と13の闇)に砕けたとされ、7つの光の心と13の闇の器がぶつかり合うことで再び現れる。"
  },
  {
    term: "キーブレード戦争",
    en: "KEYBLADE WAR",
    text: "χブレードを巡って起きた、最も古い時代の大戦。この戦いの果てに、世界は光と闇に分かたれた。"
  },
  {
    term: "予言の書",
    en: "BOOK OF PROPHECIES",
    text: "マスター・オブ・マスターが記した、来るべき未来を綴った書物。5人の予知者にそれぞれ託された。"
  },
  {
    term: "光の守護者",
    en: "GUARDIANS OF LIGHT",
    text: "闇の探求者に対抗するため集められた、光の側に立つキーブレード使いたち。王様やソラたちもこれに数えられる。"
  },
  {
    term: "闇の探求者",
    en: "SEEKERS OF DARKNESS",
    text: "ゼアノートのもとに集められた、闇の力を求める者たち。χブレードの完成を目論む。"
  },
  {
    term: "ルクス",
    en: "LUX",
    text: "χの時代における「光」の呼び名。ユニオンに分かれたキーブレード使いたちが、闇を払うために集め続けている。"
  },
  {
    term: "マスター・オブ・マスター",
    en: "MASTER OF MASTERS",
    text: "最も古い時代に生きたとされる謎の人物。5人の予知者たちの師であり、すべての始まりに深く関わる。"
  },
  {
    term: "予知者",
    en: "FORETELLERS",
    text: "マスター・オブ・マスターから予言の書を託された5人の弟子。それぞれ動物の仮面をつけ、ユニオンを率いる。"
  },
  {
    term: "マーク・オブ・マスタリー",
    en: "MARK OF MASTERY",
    text: "キーブレードマスターの資格を得るための試験。『BbS』ではテラとアクアが挑み(アクアが合格)、『3D』ではソラとリクが挑む。この試験を境に物語が大きく動き出す。"
  }
];

/* ------------------------------------------------------------
   MEMORY CROSSOVER ― キングダムハーツと縁のある作品
   crossover.js が CROSSOVER_CATEGORIES ごとに一覧を描く。
   works は「その作品の要素が登場する KINGDOM HEARTS タイトル」(WORKS の id)。
   ------------------------------------------------------------ */
const CROSSOVER_CATEGORIES = [
  { key: "ff", label: "ファイナルファンタジー" },
  { key: "twewy", label: "すばらしきこのせかい" },
  { key: "disney", label: "ディズニー / ピクサー(ワールド)" },
  { key: "disney-extra", label: "ディズニー(短編・楽曲・召喚など)" }
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
    note: "KH に登場するFFキャラの中心。ホロウバスティオン(レイディアントガーデン)復興委員会の面々として、世界の再建に力を貸す。クラウドとセフィロスの因縁も描かれる。"
  },
  {
    cat: "ff",
    title: "ファイナルファンタジーVIII",
    origin: "スクウェア / 1999年",
    works: ["kh1", "com", "kh2", "days"],
    guests: "レオン(スコール)、セルフィ、サイファー、フウ、ライ",
    stage: "トラヴァースタウン、ホロウバスティオン、トワイライトタウン",
    note: "「レオン」と名を変えたスコールがソラの最初の導き手のひとり。トワイライトタウンのサイファーたちも FFVIII 出身。"
  },
  {
    cat: "ff",
    title: "ファイナルファンタジーX",
    origin: "スクウェア / 2001年",
    works: ["kh1", "kh2"],
    guests: "ティーダ、ワッカ、アーロン",
    stage: "デスティニーアイランド(子供時代)、オリンポスコロシアム、冥界",
    note: "デスティニーアイランドで遊ぶ少年たちがFFX出身。KHIIではアーロンが仲間として冥界の戦いに加わる。"
  },
  {
    cat: "ff",
    title: "ファイナルファンタジーVI",
    origin: "スクウェア / 1994年",
    works: ["kh2"],
    guests: "セッツァー",
    stage: "トワイライトタウン(ストラグル)",
    note: "トワイライトタウンの闘技会「ストラグル」の現チャンピオンとして登場する。"
  },
  {
    cat: "ff",
    title: "ファイナルファンタジーIX",
    origin: "スクウェア / 2000年",
    works: ["kh2"],
    guests: "ビビ",
    stage: "トワイライトタウン",
    note: "ロクサスの日常パートで、ストラグルの対戦相手として姿を見せる。"
  },
  {
    cat: "ff",
    title: "モーグリとチョコボ",
    origin: "ファイナルファンタジーシリーズの看板キャラ",
    works: ["kh1", "com", "kh2", "days", "recoded", "ddd", "kh3"],
    guests: "モーグリ(アイテム合成・ショップ)、チョコボ(カメオ)",
    stage: "各作品のショップ / 合成メニュー",
    note: "FFではおなじみのマスコット。KHでは「モーグリのアイテム合成」を一貫して担当する。"
  },

  /* ===================== すばらしきこのせかい ===================== */
  {
    cat: "twewy",
    title: "すばらしきこのせかい",
    origin: "スクウェア・エニックス / 2007年(ニンテンドーDS)",
    works: ["ddd"],
    guests: "ネク、シキ、ヨシュア、ビイト、ライム",
    stage: "トラヴァースタウン(『Dream Drop Distance』)",
    note: "同じスクウェア・エニックス開発の縁で共演。トラヴァースタウンに迷い込んだ『すばこの』の面々が、ソラやリクと行動を共にする。"
  },

  /* ===================== ディズニー / ピクサー(ワールド) ===================== */
  {
    cat: "disney",
    title: "ふしぎの国のアリス",
    origin: "ディズニー / 1951年",
    works: ["kh1", "com"],
    guests: "アリス(七人の光の姫君)、チェシャ猫、ハートの女王、白ウサギ",
    stage: "ワンダーランド",
    note: "アリスは心に闇を持たない「光の姫君」のひとりとして狙われる。"
  },
  {
    cat: "disney",
    title: "ヘラクレス",
    origin: "ディズニー / 1997年",
    works: ["kh1", "com", "kh2", "bbs", "kh3"],
    guests: "ヘラクレス、フィル、ハデス、メグ、ゼウス",
    stage: "オリンポスコロシアム / オリンポス",
    note: "闘技会を通じて「本当の英雄とは何か」を問う、シリーズ皆勤に近いワールド。"
  },
  {
    cat: "disney",
    title: "ターザン",
    origin: "ディズニー / 1999年",
    works: ["kh1"],
    guests: "ターザン、ジェーン、クレイトン",
    stage: "ディープジャングル",
    note: "権利上の都合で、以降の作品には登場しない一作限りのワールド。"
  },
  {
    cat: "disney",
    title: "ピノキオ",
    origin: "ディズニー / 1940年",
    works: ["kh1", "com"],
    guests: "ピノキオ、ゼペット、ジミニー・クリケット",
    stage: "モンストロ(クジラの体内)",
    note: "ジミニー・クリケットはソラの旅の記録係として全編に同行する。"
  },
  {
    cat: "disney",
    title: "ピーター・パン",
    origin: "ディズニー / 1953年",
    works: ["kh1", "com"],
    guests: "ピーター・パン、ティンカー・ベル、フック船長、ウェンディ",
    stage: "ネバーランド(空飛ぶ海賊船)",
    note: "ティンカー・ベルは以降の作品で召喚・回復役として力を貸す。"
  },
  {
    cat: "disney",
    title: "リトル・マーメイド",
    origin: "ディズニー / 1989年",
    works: ["kh1", "kh2"],
    guests: "アリエル、トリトン王、アースラ、セバスチャン、フランダー",
    stage: "アトランティカ",
    note: "KHIIでは歌とダンスで物語が進む、シリーズでも異色のミュージカル形式のワールド。"
  },
  {
    cat: "disney",
    title: "ナイトメアー・ビフォア・クリスマス",
    origin: "ディズニー / 1993年",
    works: ["kh1", "kh2"],
    guests: "ジャック・スケリントン、サリー、ウギー・ブギー、サンタクロース",
    stage: "ハロウィンタウン",
    note: "ジャックは召喚魔法としてもソラを助ける。KHIIではクリスマスタウンも登場。"
  },
  {
    cat: "disney",
    title: "くまのプーさん",
    origin: "ディズニー / 1977年ほか",
    works: ["kh1", "com", "kh2", "kh3"],
    guests: "プー、ティガー、ピグレット、ラビット、オウル、イーヨー、ルー",
    stage: "100エーカーの森(絵本の中)",
    note: "戦闘のない箸休めのワールド。破れた絵本のページと「忘れないこと」をめぐる小さな物語が語られる。"
  },
  {
    cat: "disney",
    title: "アラジン",
    origin: "ディズニー / 1992年",
    works: ["kh1", "com", "kh2"],
    guests: "アラジン、ジャスミン(光の姫君)、ジーニー、ジャファー、カーペット、アブー",
    stage: "アグラバー",
    note: "ジャスミンは光の姫君のひとり。ジーニーは召喚魔法としても登場する。"
  },
  {
    cat: "disney",
    title: "美女と野獣",
    origin: "ディズニー / 1991年",
    works: ["kh2", "kh3"],
    guests: "野獣、ベル(光の姫君)、ルミエール、コグスワース、ポット夫人、ガストン",
    stage: "ビーストキャッスル",
    note: "「闇に呑まれかけた心が、絆で引き戻される」というシリーズの主題を体現するワールド。"
  },
  {
    cat: "disney",
    title: "ムーラン",
    origin: "ディズニー / 1998年",
    works: ["kh2"],
    guests: "ムーラン、ムーシュー、リー・シャン、シャン・ユー",
    stage: "ランド・オブ・ドラゴン",
    note: "ムーシューは召喚魔法としても参戦。正体を隠して戦うムーランの物語が描かれる。"
  },
  {
    cat: "disney",
    title: "ライオン・キング",
    origin: "ディズニー / 1994年",
    works: ["kh2"],
    guests: "シンバ、ナラ、ラフィキ、スカー、ティモン、プンバァ",
    stage: "プライドランド",
    note: "ソラ・ドナルド・グーフィーが獅子・鳥・亀の姿になる。倒したスカーが心の影として蘇る場面も。"
  },
  {
    cat: "disney",
    title: "パイレーツ・オブ・カリビアン",
    origin: "ディズニー / 2003年〜(実写映画)",
    works: ["kh2", "kh3"],
    guests: "ジャック・スパロウ、ウィル・ターナー、エリザベス・スワン、バルボッサ、デイヴィ・ジョーンズ",
    stage: "ポート・ロイヤル / ザ・カリビアン",
    note: "実写映画を原作とする珍しいワールド。KHIIIでは海洋アクションと船戦が楽しめる。"
  },
  {
    cat: "disney",
    title: "トロン / トロン:レガシー",
    origin: "ディズニー / 1982年・2010年",
    works: ["kh2", "ddd", "kh3"],
    guests: "トロン、サーク、マスターコントロールプログラム、クルー、ラインズラー",
    stage: "スペースパラノイド / ザ・グリッド(電脳世界)",
    note: "コンピュータの中の世界。KHIIIの「ザ・グリッド」は続編『トロン:レガシー』が下敷き。"
  },
  {
    cat: "disney",
    title: "リロ・アンド・スティッチ",
    origin: "ディズニー / 2002年",
    works: ["bbs", "kh2"],
    guests: "スティッチ、ジャンバ、ガントゥ",
    stage: "ディープスペース(『Birth by Sleep』)",
    note: "スティッチはKHIIで召喚として活躍。BbS では、地球へ逃げる前の実験体626号として登場する。"
  },
  {
    cat: "disney",
    title: "白雪姫",
    origin: "ディズニー / 1937年",
    works: ["bbs"],
    guests: "白雪姫(光の姫君)、女王、7人のこびと",
    stage: "ドワーフウッドランド(『Birth by Sleep』)",
    note: "史上初の長編アニメーション。KHでは白雪姫が光の姫君のひとりとして描かれる。"
  },
  {
    cat: "disney",
    title: "シンデレラ",
    origin: "ディズニー / 1950年",
    works: ["bbs"],
    guests: "シンデレラ(光の姫君)、フェアリーゴッドマザー、ジャックとガス、トレメイン夫人",
    stage: "キャッスル・オブ・ドリーム(『Birth by Sleep』)",
    note: "アクアが見守る「夢を諦めない心」の物語。ガラスの靴のモチーフが印象的。"
  },
  {
    cat: "disney",
    title: "眠れる森の美女",
    origin: "ディズニー / 1959年",
    works: ["bbs"],
    guests: "オーロラ姫(光の姫君)、マレフィセント、3人の妖精、フィリップ王子",
    stage: "エンチャンテッド・ドミニオン(『Birth by Sleep』)",
    note: "シリーズ最大級のディズニーヴィラン・マレフィセントの出身作。"
  },
  {
    cat: "disney",
    title: "ファンタジア",
    origin: "ディズニー / 1940年",
    works: ["ddd"],
    guests: "魔法使いの弟子ミッキー、チェルナボーグ、ほうき",
    stage: "シンフォニー・オブ・ソーサリー(『Dream Drop Distance』)",
    note: "音楽で綴られる名作。短編「魔法使いの弟子」はKHのミッキー像の原点でもある。"
  },
  {
    cat: "disney",
    title: "ノートルダムの鐘",
    origin: "ディズニー / 1996年",
    works: ["ddd"],
    guests: "カジモド、エスメラルダ、フロロー、フィーバス",
    stage: "ラ・シテ・デ・クロシュ(『Dream Drop Distance』)",
    note: "「見た目や出自で心は決まらない」というテーマがKHの問いと重なる。"
  },
  {
    cat: "disney",
    title: "アナと雪の女王",
    origin: "ディズニー / 2013年",
    works: ["kh3"],
    guests: "エルサ、アナ、オラフ、クリストフ、マシュマロウ",
    stage: "アレンデール",
    note: "「Let It Go」の場面を再現した氷の演出が見どころ。"
  },
  {
    cat: "disney",
    title: "塔の上のラプンツェル",
    origin: "ディズニー / 2010年",
    works: ["kh3"],
    guests: "ラプンツェル、フリン・ライダー、パスカル、マキシマス、ゴーテル",
    stage: "キングダム・オブ・コロナ",
    note: "森を抜けて灯りを見に行く道行きを、ソラたちが一緒に歩く。"
  },
  {
    cat: "disney",
    title: "ベイマックス",
    origin: "ディズニー / 2014年(原作はマーベル・コミック)",
    works: ["kh3"],
    guests: "ヒロ、ベイマックス、ゴーゴー、ワサビ、ハニーレモン、フレッド",
    stage: "サンフランソウキョウ",
    note: "喪失と再生の物語。データ世界のヒロと、闇に触れたベイマックスをめぐる展開が描かれる。"
  },
  {
    cat: "disney",
    title: "トイ・ストーリー",
    origin: "ピクサー / 1995年〜",
    works: ["kh3"],
    guests: "ウッディ、バズ・ライトイヤー、レックス、ハム、リトル・グリーン・メン",
    stage: "トイ・ボックス",
    note: "ピクサー作品として初のワールド。おもちゃサイズのソラたちが店内を冒険する。"
  },
  {
    cat: "disney",
    title: "モンスターズ・インク",
    origin: "ピクサー / 2001年",
    works: ["kh3"],
    guests: "サリー、マイク、ブー、ランドール",
    stage: "モンストロポリス",
    note: "「悲鳴より笑い」という原作の主題が、そのままステージギミックになっている。"
  },

  /* ===================== ディズニー(短編・楽曲・召喚など) ===================== */
  {
    cat: "disney-extra",
    title: "蒸気船ウィリー / 白黒短編",
    origin: "ディズニー / 1928年",
    works: ["kh2"],
    guests: "往年の姿のミッキー、ピート、ほうき",
    stage: "タイムレスリバー",
    note: "モノクロ・サイレント時代のディズニーを再現した、過去のディズニーキャッスル。"
  },
  {
    cat: "disney-extra",
    title: "王様の剣",
    origin: "ディズニー / 1963年",
    works: ["kh1", "com", "kh2", "bbs"],
    guests: "魔法使いマーリン、ふくろうのアルキメデス",
    stage: "トラヴァースタウン / ホロウバスティオン",
    note: "マーリン先生はソラに魔法を教える師。プーさんの絵本を預かっているのも彼。"
  },
  {
    cat: "disney-extra",
    title: "101匹わんちゃん",
    origin: "ディズニー / 1961年",
    works: ["kh1"],
    guests: "ポンゴとパディータ、99匹の子犬",
    stage: "トラヴァースタウンの家(子犬集め)",
    note: "各ワールドに散らばった子犬を集める収集要素として登場する。"
  },
  {
    cat: "disney-extra",
    title: "ダンボ / バンビ ほか",
    origin: "ディズニー / 1941年・1942年ほか",
    works: ["kh1"],
    guests: "ダンボ、バンビ、ムーシュー、チキンリトル(BbS)ほか",
    stage: "サモンチャーム(召喚魔法)",
    note: "欠片や思い出の品を通して呼び出され、一時的にソラと共に戦う。"
  },
  {
    cat: "disney-extra",
    title: "ミッキーと仲間たちの短編 / ディズニーキャッスル",
    origin: "ディズニー(ミッキー・マウス 短編シリーズほか)",
    works: ["kh1", "com", "kh2", "days", "recoded", "ddd", "kh3", "mom"],
    guests: "ミッキー、ドナルド、グーフィー、ミニー、デイジー、プルート、チップとデール、スクルージ",
    stage: "ディズニーキャッスル(シリーズの拠点)",
    note: "彼ら自身が物語の狂言回し。ドナルドとグーフィーはソラの旅の相棒を務める。"
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
    caption: "レイディアントガーデンで背中を合わせるレオン(FFVIII)とクラウド(FFVII)。別々の物語の剣士が、同じ世界の再建に力を貸す。",
    image: "assets/crossover/cs01.jpg"
  },
  {
    id: "cs02",
    work: "kh2",
    title: "断ち切れない「影」、セフィロス",
    caption: "片翼を広げ、正宗を提げて現れる裏ボス。クラウドが越えられずにいる過去そのものが、ソラの前に立ちはだかる。",
    image: "assets/crossover/cs02.jpg"
  },
  {
    id: "cs03",
    work: "kh2",
    title: "「僕も約束するよ」",
    caption: "100エーカーの森で、プーとピグレットに囲まれて座るソラ。忘れないこと——ただそれだけを、静かに誓う場面。",
    image: "assets/crossover/cs03.jpg"
  },
  {
    id: "cs04",
    work: "kh2",
    title: "ポートロイヤルの夜、ジャック・スパロウと",
    caption: "呪われた金貨をめぐる海賊たちの騒動に巻き込まれるソラ。掴みどころのない船長の隣で、思わず「まさか!」と声が出る。",
    image: "assets/crossover/cs04.jpg"
  },
  {
    id: "cs05",
    work: "kh2",
    title: "冥界の戦いに、アーロンが加わる",
    caption: "ヘラクレス、そしてFFXの剣豪アーロンと肩を並べるソラ。ディズニーとファイナルファンタジーの英雄が、同じ戦列に立つ。",
    image: "assets/crossover/cs05.jpg"
  },
  {
    id: "cs06",
    work: "kh2",
    title: "「シャン隊長!」ザ・ランド・オブ・ドラゴンにて",
    caption: "男装して戦うムーランと、隊を率いるリー・シャン。フン族の侵攻を前に、ソラたちも大陸の戦に加わる。",
    image: "assets/crossover/cs06.jpg"
  },
  {
    id: "cs07",
    work: "kh2",
    title: "王様が、隣に立つ",
    caption: "存在しなかった世界。ディズニー城の王ミッキーが自らキーブレードを抜き、ソラ・ドナルド・グーフィーと並んで最後の戦いへ向かう。",
    image: "assets/crossover/cs07.jpg"
  },
  {
    id: "cs08",
    work: "kh3",
    title: "トイ・ボックスで、記念の一枚",
    caption: "おもちゃサイズになったソラが、ウッディやバズと一緒にガミフォンで自撮り。ピクサー作品として初めて描かれたワールド。",
    image: "assets/crossover/cs08.jpg"
  },
  {
    id: "cs09",
    work: "kh3",
    title: "アレンデールの雪山、エルサとともに",
    caption: "自らの氷の力を恐れ、心を閉ざしていたエルサ。姉妹の絆を取り戻す物語の傍らを、ソラとグーフィーが歩く。",
    image: "assets/crossover/cs09.jpg"
  },
  {
    id: "cs10",
    work: "kh3",
    title: "サンフランソウキョウ、ベイマックスと",
    caption: "和と洋が入り混じる橋の上で向き合うソラたちとヒロ、ベイマックス。喪失を越えて街を守るヒーローたちの物語。",
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
    text:
      "キングダムハーツが一貫して描いてきたのは、心と心のつながりです。強さも、光も闇も、すべては心から生まれます。世界と世界は「キーブレード」で繋がり、その奥にある大きな心の集積が「キングダムハーツ」と呼ばれます。求める者によって、その姿も意味も変わります。"
  },
  {
    label: "CORE 02",
    title: "光と闇、そしてその狭間",
    text:
      "心を闇に呑まれた者からは「ハートレス」が生まれ、あとに残された身体と意志は「ノーバディ」になります。心を失うと、人は二つに分かれてしまう——これがシリーズの基本ルールです。どちらかに振り切らず、境界を歩ける者こそが物語の鍵を握ります。"
  },
  {
    label: "CORE 03",
    title: "キーブレードと、受け継ぐということ",
    text:
      "キーブレードは血筋や才能ではなく、心の強さで選ばれた者に受け継がれます。主人公ソラの強さの源は特別な力ではなく、仲間とのつながりそのものです。だから彼の心の中には、いくつもの他者の記憶と存在が宿っています。"
  },
  {
    label: "CORE 04",
    title: "ダークシーカー編という一本の線",
    text:
      "第1作から『III』までを貫く大きな筋が「ダークシーカー編」です。ゼアノートは、7人の「光の守護者」と13人の「闇の探求者」をぶつけ合わせて特別なキーブレード「χブレード」を再現し、世界を作り直そうとしました。あらゆる時代に自らの分身を配し、テラの身体まで奪って計画を進める彼を、ソラたち光の守護者がキーブレード墓場で退けるまでの物語です。"
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
    caption: "ロクサスの七日間の果て。眠るソラを納めた白い花の前に立ち、消えていく自分の夏を静かに見送る。",
    image: "assets/scenes/s01.webp"
  },
  {
    id: "s02",
    work: "kh2",
    title: "光の中の、ロクサスとソラ",
    caption: "二本のキーブレードを地に突き立て、消える前のロクサスがソラに問いをぶつける——「なんで、お前なんだよ」。",
    image: "assets/scenes/s02.jpg"
  },
  {
    id: "s03",
    work: "kh1",
    title: "「繋がる心が、俺の力だ」",
    caption: "ホロウバスティオンでリクと刃を交わすソラ。特別な力ではなく、仲間との絆こそが強さなのだと言い切る。",
    image: "assets/scenes/s03.jpg"
  },
  {
    id: "s04",
    work: "kh3",
    title: "ロクサス、還る",
    caption: "キーブレード墓場に戻ってきたロクサス。アクセル、シオンとふたたび並び立つ——「それは繋がりだ」。",
    image: "assets/scenes/s04.jpg"
  },
  {
    id: "s05",
    work: "days",
    title: "時計塔の、三人",
    caption: "アクセル、ロクサス、シオン。トワイライトタウンの夕暮れとアイスクリームだけが、記録に残らない日々を繋いでいた。",
    image: "assets/scenes/s05.jpg"
  },
  {
    id: "s06",
    work: "kh3",
    title: "光の守護者、集結",
    caption: "キーブレード墓場。リク、王様、ドナルド、グーフィーに見守られ、ソラが光をひとつに束ねて掲げる。",
    image: "assets/scenes/s06.jpg"
  }
];

/* ------------------------------------------------------------
   MEMORY OF SUMMER(roxas.html)のロクサス写真スライドショー
   roxas.js が回す。画像は assets/roxas/<id>.(jpg|png|webp) に置く
   (未設置ならファイル名のプレースホルダーを表示)。caption は任意。
   ------------------------------------------------------------ */
const ROXAS_SHOTS = [
  { id: "r01", caption: "トワイライトタウンの仲間——ハイネ、ピンス、オレット。「切符 買いに行こっ!」海へ行くはずだった、夏休みの計画。", image: "assets/roxas/r01.jpg" },
  { id: "r02", caption: "駅の時計塔から夕日を眺めて、シーソルトアイスをかじる。四人の、いつもの場所。", image: "assets/roxas/r02.jpg" },
  { id: "r03", caption: "森の奥、宙に浮かぶ透き通った文字。「意味が欲しいか?」——問いだけが、彼を追ってくる。", image: "assets/roxas/r03.jpg" },
  { id: "r04", caption: "空中に「ROXAS」の名が結ばれる。自分の名前すら、誰かに与えられたものだった。", image: "assets/roxas/r04.jpg" },
  { id: "r05", caption: "自分の部屋で、ストラグルの青いトロフィーを手に。「まだ あと一つ、夢を——」穏やかな時間が、もう長くないことを知らずに。", image: "assets/roxas/r05.jpg" },
  { id: "r06", caption: "路地裏の「いつもの場所」。何気ない集合、他愛のない話。この夏がまるごと作りものだと、まだ誰も気づかない。", image: "assets/roxas/r06.png" }
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
    { id: "terra",    label: "テラ",         side: "light", x: 140,  y: 95,  img: "assets/characters/terra.webp" },
    { id: "eraqus",   label: "エラクゥス",   side: "light", x: 330,  y: 215, img: "assets/characters/master-eraqus.webp" },
    { id: "aqua",     label: "アクア",       side: "light", x: 150,  y: 340, img: "assets/characters/aqua.webp" },
    { id: "ventus",   label: "ヴェントゥス", side: "light", x: 330,  y: 470, img: "assets/characters/ventus.webp" },
    { id: "vanitas",  label: "ヴァニタス",   side: "dark",  x: 300,  y: 660, img: "assets/characters/vanitas.webp" },
    /* --- デスティニー組(中央) --- */
    { id: "riku",     label: "リク",         side: "light", x: 560,  y: 150, img: "assets/characters/riku.webp" },
    { id: "mickey",   label: "王様",         side: "light", x: 460,  y: 330, img: "assets/characters/king-mickey.webp" },
    { id: "sora",     label: "ソラ",         side: "light", x: 660,  y: 470, hub: true, img: "assets/characters/sora.webp" },
    { id: "kairi",    label: "カイリ",       side: "light", x: 520,  y: 690, img: "assets/characters/kairi.webp" },
    { id: "donald",   label: "旅の仲間",     side: "light", x: 730,  y: 690, img: "assets/characters/donald-duck.webp" },
    /* --- ノーバディ・七日間(中央右) --- */
    { id: "roxas",    label: "ロクサス",     side: "light", x: 900,  y: 380, img: "assets/characters/roxas.webp" },
    { id: "axel",     label: "アクセル",     side: "light", x: 1020, y: 320, img: "assets/characters/axel.webp" },
    { id: "xion",     label: "シオン",       side: "light", x: 1000, y: 600, img: "assets/characters/xion.webp" },
    { id: "namine",   label: "ナミネ",       side: "light", x: 870,  y: 610, img: "assets/characters/namine.webp" },
    /* --- ゼアノートの分身(右) --- */
    { id: "ansem",    label: "アンセム",     side: "dark",  x: 1250, y: 160, img: "assets/characters/ansem-seeker-of-darkness.webp" },
    { id: "xehanort", label: "ゼアノート",   side: "dark",  x: 1260, y: 470, hub: true, img: "assets/characters/xehanort.webp" },
    { id: "xigbar",   label: "シグバール",   side: "dark",  x: 1070, y: 715, img: "assets/characters/xigbar.webp" },
    { id: "xemnas",   label: "ゼムナス",     side: "dark",  x: 1250, y: 785, img: "assets/characters/xemnas.webp" }
  ],
  links: [
    /* ウェイファインダーと師 */
    { from: "eraqus", to: "terra",  type: "bond", label: "師と弟子" },
    { from: "terra",  to: "aqua",   type: "bond", label: "同門の友" },
    { from: "aqua",   to: "ventus", type: "bond", label: "ウェイファインダー" },
    { from: "terra",  to: "ventus", type: "bond", label: "兄弟弟子", bow: -40 },
    /* 主人公と仲間 */
    { from: "sora",   to: "riku",   type: "bond", label: "親友" },
    { from: "sora",   to: "kairi",  type: "bond", label: "帰る場所" },
    { from: "sora",   to: "donald", type: "bond", label: "旅の仲間" },
    { from: "mickey", to: "sora",   type: "bond", label: "導く" },
    { from: "mickey", to: "riku",   type: "bond", label: "闇の中で共闘" },
    /* 夏の三人 */
    { from: "roxas",  to: "axel",   type: "bond", label: "親友" },
    { from: "axel",   to: "xion",   type: "bond", label: "仲間" },
    { from: "roxas",  to: "xion",   type: "bond", label: "三人の夏", bow: 70 },
    { from: "namine", to: "sora",   type: "bond", label: "記憶を繋ぎ直す" },
    /* 生まれた/由来する(破線・金・矢印) */
    { from: "sora",     to: "roxas",  type: "origin", label: "ノーバディ" },
    { from: "kairi",    to: "namine", type: "origin", label: "ノーバディ", bow: -50 },
    { from: "xehanort", to: "xemnas", type: "origin", label: "ノーバディ" },
    { from: "xehanort", to: "ansem",  type: "origin", label: "ハートレス" },
    { from: "ventus",   to: "vanitas",type: "origin", label: "切り離された闇" },
    { from: "ventus",   to: "roxas",  type: "origin", label: "姿を与える", bow: -45 },
    { from: "sora",     to: "xion",   type: "origin", label: "記憶のレプリカ", bow: -30 },
    { from: "ventus",   to: "sora",   type: "origin", label: "心が宿る", bow: 30 },
    /* 敵対・干渉(点線・赤・矢印) */
    { from: "xehanort", to: "terra",  type: "clash", label: "身体を奪う", bow: 450 },
    { from: "ansem",    to: "riku",   type: "clash", label: "憑依する", bow: -90 },
    { from: "xehanort", to: "xigbar", type: "bond",  label: "古き協力者" },
    /* 物語の主対立 */
    { from: "sora",     to: "xehanort", type: "axis", label: "対立の主軸", bow: 0 }
  ]
};
