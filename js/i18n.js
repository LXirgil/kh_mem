/* ============================================================
   i18n.js — 日本語 / 英語 表示切り替え
   ------------------------------------------------------------
   キングダムハーツは海外でも人気の高いシリーズのため、
   ヘッダーの切り替えボタンで英語表示に対応する。

   対象は「サイト共通のUI文言」と「各ページの見出し・導入文」、
   および作品(WORKS)の副題・概要(subtitle / summary)まで。
   キャラクター個別の解説・用語集・楽曲解説・作品の詳細本文
   (WORKS の detail)など分量の多い個別コンテンツは、この課題の
   scope外として日本語のまま表示する(英語版が無いだけで、
   情報が消えるわけではない)。

   使い方:
     <span data-i18n="common.cta.explore">記憶を辿りはじめる</span>
   のように data-i18n="キー" を付けておくと、KH_I18N が現在の
   言語設定に応じて中身を差し替える(値に "<" を含む場合は
   innerHTML、それ以外は textContent を書き換える)。

   属性を訳したい場合は
     <button data-i18n-attr="aria-label:common.audio.on">
   のように "属性名:キー" を指定する(カンマ区切りで複数可)。

   WORKS など data.js 側のオブジェクトを言語に応じて出し分けたい
   ときは KH_I18N.pick(work, "subtitle") のように呼ぶ
   (英語版フィールドは "subtitleEn" のように En を付けて用意する)。
   ============================================================ */
const KH_I18N = (function () {
  const STORAGE_KEY = "kh-lang";

  /* ------------------------------------------------------------
     辞書:ja / en のペアをキーごとに定義する
     ------------------------------------------------------------ */
  const STRINGS = {
    /* ---------- 共通(ヘッダー・フッター・モーダルなど) ---------- */
    "common.nav.label": { ja: "メインナビゲーション", en: "Main navigation" },
    "common.skipLink": { ja: "本文へスキップ", en: "Skip to main content" },
    "common.audio.on": { ja: "音声をオフにする", en: "Turn sound off" },
    "common.audio.off": { ja: "音声をオンにする", en: "Turn sound on" },
    "common.lang.toEn": { ja: "英語表示にする", en: "Switch to Japanese" },
    "common.memoryCounter.title": { ja: "集めた記憶の欠片を確認する", en: "View collected memory fragments" },
    "common.navToggle": { ja: "メニューを開く", en: "Open menu" },
    "common.footer.tagline": { ja: "記憶を辿る、光と闇の旅", en: "A journey through light and darkness, in search of memory" },
    "common.footer.copyright": {
      ja: "非公式ファンサイト / Web Design Practice Work — HTML・CSS・JavaScript",
      en: "Unofficial fan site / Web design practice work — HTML, CSS, JavaScript"
    },
    "common.footerNav.label": { ja: "フッターナビゲーション", en: "Footer navigation" },
    "common.toTop": { ja: "ページの先頭へ戻る", en: "Back to top" },
    "common.close": { ja: "閉じる", en: "Close" },

    /* ---------- 記憶の欠片ログ(main.js が生成するモーダル) ---------- */
    "memoryLog.label": { ja: "Memory Fragments", en: "Memory Fragments" },
    "memoryLog.title": { ja: "記憶の欠片", en: "Memory Fragments" },
    "memoryLog.unlocked": { ja: "SECRET MEMORY は解放されています", en: "SECRET MEMORY is unlocked" },
    "memoryLog.remaining": { ja: "SECRET MEMORY 解放まで あと {n} 個", en: "{n} more to unlock SECRET MEMORY" },
    "memoryLog.hiddenName": { ja: "？ ？ ？ ？ ？", en: "? ? ? ? ?" },
    "memoryLog.note": {
      ja: "作品やキャラクターの詳細を開いた先にも、まだ見ぬ光があるかもしれません。",
      en: "More light may be waiting inside the works and character details you haven't opened yet."
    },
    "memoryLog.pageUnit": { ja: "個", en: "" },

    /* ---------- TOP(index.html) ---------- */
    "top.hero.eyebrow": { ja: "AN INTERACTIVE TRIBUTE", en: "AN INTERACTIVE TRIBUTE" },
    "top.hero.lead": { ja: "記憶を辿る、光と闇の旅へ", en: "A journey through light and darkness, in search of memory" },
    "top.hero.cta.explore": { ja: "記憶を辿りはじめる", en: "Begin the journey" },
    "top.hero.cta.album": { ja: "アルバムを見る", en: "View the album" },
    "top.concept.label": { ja: "Concept", en: "Concept" },
    "top.concept.title": { ja: "読むサイトではなく、<br>辿るサイトへ。", en: "Not a site you read —<br>a site you walk through." },
    "top.concept.lead": {
      ja: "このサイトは、キングダムハーツシリーズの世界観から着想を得たオリジナルの体験型Webサイトです。情報をただ並べるのではなく、訪れた人が自分の手で光を見つけ、記憶を集めながらシリーズの歩みを辿っていく——そんな体験そのものを設計しました。",
      en: "This site is an original, interactive tribute inspired by the world of the KINGDOM HEARTS series. Rather than simply listing information, it's designed as an experience: you find the light yourself, collect memories, and trace the series' journey at your own pace."
    },
    "top.concept.card1.title": { ja: "こころ", en: "Heart" },
    "top.concept.card1.text": {
      ja: "シリーズが一貫して描いてきたのは「心のつながり」でした。そのテーマを、画面に触れたときの反応や光の揺らぎとして表現しています。",
      en: "The bond between hearts is the theme the series has explored from the very beginning — expressed here through gentle light and motion whenever you touch the screen."
    },
    "top.concept.card2.title": { ja: "記憶", en: "Memory" },
    "top.concept.card2.text": {
      ja: "サイトの各所には「記憶の欠片」が隠されています。集めた記録はブラウザに保存され、次に訪れたときも引き継がれます。",
      en: "Fragments of memory are hidden throughout the site. Your progress is saved in your browser, so it carries over the next time you visit."
    },
    "top.concept.card3.title": { ja: "光と闇", en: "Light & Dark" },
    "top.concept.card3.text": {
      ja: "深い闇を背景に、青白い光だけを頼りに進む構成です。余白と暗さを活かすことで、ひとつひとつの光が意味を持ちます。",
      en: "Set against deep darkness, the whole site is guided only by pale blue light. Generous negative space gives every point of light its own meaning."
    },
    "top.statement.line1": { ja: "記憶は 薄れても、", en: "Even as memories fade," },
    "top.statement.line2": { ja: "つながりは 消えない。", en: "the bonds they leave never disappear." },
    "top.trailer.label": { ja: "Play It", en: "Play It" },
    "top.trailer.title": { ja: "映像で見る、記憶の始まり。", en: "See where the memory begins." },
    "top.trailer.lead": {
      ja: "シリーズを知らない人にも雰囲気が伝わるように、スクウェア・エニックス公式のトレイラー映像を1本だけ埋め込んでいます。ほかの作品の映像も見たい場合は MEMORY ALBUM の各作品からYouTubeで探せます。",
      en: "For anyone new to the series, here's one official trailer from Square Enix to set the mood. You can search YouTube for other games' trailers from each work's page in MEMORY ALBUM."
    },
    "top.trailer.caption": {
      ja: "KINGDOM HEARTS III — Opening Movie Trailer(Square Enix 公式)",
      en: "KINGDOM HEARTS III — Opening Movie Trailer (Official / Square Enix)"
    },
    "top.gateway.label": { ja: "Explore", en: "Explore" },
    "top.gateway.title": { ja: "六つの扉", en: "Six Doors" },
    "top.gateway.lead": {
      ja: "それぞれの扉が、異なる記憶へと通じています。順に辿っても、気になるところから開いても構いません。",
      en: "Each door leads to a different memory. Follow them in order, or open whichever one calls to you first."
    },
    "top.gateway.album.text": {
      ja: "シリーズ各作品を年代順に辿る記録の間。作品とキャラクターの記憶がここに収められています。",
      en: "A hall of records tracing every work in chronological order — the memories of each game and character are kept here."
    },
    "top.gateway.timeline.text": {
      ja: "全作品を「発売日順」と「物語内の時系列順」の2つの表で整理。ずれた時間軸を見渡せます。",
      en: "All titles organized into two tables — by release date and by in-story chronology — so you can see how the timelines diverge."
    },
    "top.gateway.music.text": {
      ja: "シリーズを彩ってきた代表曲の紹介。曲名・作曲・流れる場面を辿り、各配信サービスへ。",
      en: "A tour of the songs that have colored the series — title, composer, and scene — with links out to streaming services."
    },
    "top.gateway.summer.text": {
      ja: "『KINGDOM HEARTS II FINAL MIX』特集。ロクサスの七日間から、作品の魅力を辿ります。",
      en: "A feature on KINGDOM HEARTS II FINAL MIX, exploring the game's appeal through Roxas's seven days of summer."
    },
    "top.gateway.crossover.text": {
      ja: "ファイナルファンタジー、すばらしきこのせかい、ディズニー——KHと縁のある作品の一覧。",
      en: "FINAL FANTASY, The World Ends with You, Disney — a list of the works connected to KINGDOM HEARTS."
    },
    "top.gateway.secret.text.pre": {
      ja: "記憶の欠片をあと",
      en: "A hidden record, waiting to open once you collect "
    },
    "top.gateway.secret.text.post": {
      ja: "個集めると開かれる、隠された記録。まだ語られていない言葉が眠っています。",
      en: " more memory fragments. Words yet untold are waiting inside."
    },
    "top.collect.title": { ja: "記憶の欠片を集める", en: "Collect the memory fragments" },
    "top.collect.lead.pre": {
      ja: "サイトのあちこちに、青白く光る小さな欠片が隠れています。見つけてクリックすると集めることができ、",
      en: "Small, pale-blue fragments are hidden throughout the site. Find and click them to collect — gather "
    },
    "top.collect.lead.post": {
      ja: "個以上集めると SECRET MEMORY が開かれます。",
      en: " or more to unlock SECRET MEMORY."
    },

    /* ---------- ALBUM ---------- */
    "album.head.title": { ja: "MEMORY ALBUM", en: "MEMORY ALBUM" },
    "album.head.lead": { ja: "年代順に辿る、シリーズの記憶", en: "The series' memory, traced in chronological order" },
    "album.intro.title": { ja: "キングダムハーツとは", en: "What is KINGDOM HEARTS?" },
    "album.worlds.title": { ja: "記憶に残るワールド", en: "Worlds worth remembering" },
    "album.characters.title": { ja: "記憶に刻まれた者たち", en: "Those etched into memory" },
    "album.glossary.title": { ja: "この世界を読み解く言葉", en: "Words to understand this world" },
    "album.intro.lead": {
      ja: "スクウェア・エニックスとディズニーが共同で手がける、アクションRPGシリーズです。2002年に第1作が発売されて以来、20年以上にわたって物語が紡がれてきました。年表を開く前に、まずはシリーズの成り立ちを簡単にご紹介します。",
      en: "An action RPG series co-created by Square Enix and Disney. Since the first game released in 2002, the story has grown for over twenty years. Before opening the timeline, here's a quick look at how the series came to be."
    },
    "album.intro.card1.title": { ja: "ふたつの世界の交差", en: "Where two worlds cross" },
    "album.intro.card1.text": {
      ja: "ディズニー映画の数々のワールドと、シリーズオリジナルのキャラクターたちが同じ物語の中で出会う、他に類を見ないクロスオーバー作品です。",
      en: "A crossover unlike any other, where the many worlds of Disney films meet the series' original characters in a single, shared story."
    },
    "album.intro.card2.title": { ja: "「心」を巡る物語", en: "A story about the heart" },
    "album.intro.card2.text": {
      ja: "主人公ソラを中心に、「心」「光」「闇」というテーマが繰り返し描かれます。1作ごとに完結する物語でありながら、全体を貫く大きな筋があるのが特徴です。",
      en: "Centered on the hero Sora, the themes of heart, light, and darkness recur throughout. Each game tells a complete story of its own, yet all of them are threaded together by one larger arc."
    },
    "album.intro.card3.title": { ja: "キーブレードと使い手", en: "The Keyblade and its wielders" },
    "album.intro.card3.text": {
      ja: "「キーブレード」と呼ばれる鍵の形をした武器を手にした者たちが、光と闇のバランスを守るために世界を巡る——それがシリーズの中心的な設定です。",
      en: "Wielders of a key-shaped weapon called the Keyblade travel between worlds to protect the balance of light and darkness — the central premise of the whole series."
    },
    "album.intro.lead2": {
      ja: "ここから先は、そんなシリーズの歩みを年代順に、そしてワールドやキャラクターの単位で辿っていきます。",
      en: "From here, we'll trace the series' history in chronological order, and then by world and by character."
    },
    "album.worlds.lead": {
      ja: "キーブレードが開いてきた、数々のワールドたち。シリーズオリジナルの舞台から、キーブレードで繋がるディズニーの世界まで、それぞれの場所に固有の記憶が刻まれています。",
      en: "The many worlds the Keyblade has opened. From the series' original settings to the Disney worlds it connects to, each place holds memories of its own."
    },
    "album.characters.lead": {
      ja: "長い物語を歩いてきた者たち。王様や旅の仲間、そしてキーブレードで繋がったディズニーの仲間たちも含めて紹介しています。カードを選ぶと、詳しい記録が開きます。",
      en: "Those who have walked this long story — kings, traveling companions, and the Disney friends connected through the Keyblade. Select a card to open its full record."
    },
    "album.glossary.lead": {
      ja: "シリーズを通して繰り返し登場する言葉たち。意味を知ってから物語を辿り直すと、見える景色が変わります。",
      en: "Terms that recur throughout the series. Knowing what they mean changes how the story looks when you trace it again."
    },
    "album.progress.pre": { ja: "あと", en: "" },
    "album.progress.post": { ja: "個の欠片で SECRET MEMORY が開かれます。", en: "more fragments will unlock SECRET MEMORY." },
    "album.cta.secret": { ja: "SECRET MEMORY へ", en: "To SECRET MEMORY" },
    "album.trailer.link": { ja: "YouTubeで公式PVを探す", en: "Find the official trailer on YouTube" },

    /* ---------- TIMELINE ---------- */
    "timeline.head.title": { ja: "TIMELINE", en: "TIMELINE" },
    "timeline.head.lead": { ja: "発売日順と、物語の時系列順", en: "By release date, and by in-story chronology" },
    "timeline.intro.lead": {
      ja: "キングダムハーツは、<strong>発売された順番</strong>と<strong>物語の中で起きた順番</strong>が大きくずれています。作品ごとに時代を行き来しながら、少しずつ全体像が見えてくる構成です。初めて追うなら発売日順が基本。物語のつながりを整理したいときは時系列順が役に立ちます。",
      en: "In KINGDOM HEARTS, <strong>release order</strong> and <strong>in-story order</strong> diverge sharply. Each game jumps to a different point in time, and the full picture only comes together gradually. Release order is the natural way to experience it for the first time; chronological order helps once you want to untangle how the story connects."
    },
    "timeline.release.title": { ja: "発売日順", en: "By release date" },
    "timeline.release.lead": {
      ja: "真相が段階的に明かされていく、シリーズが想定している“出会う順番”です。",
      en: "The order the series intends you to meet it in, with the truth revealed step by step."
    },
    "timeline.chrono.title": { ja: "物語内の時系列順", en: "In-story chronology" },
    "timeline.chrono.lead": {
      ja: "作中の出来事を古い順に並べ替えたものです(番号は時系列上の順番)。",
      en: "The events of the story, reordered from earliest to latest (the number is its place in that chronology)."
    },
    "timeline.th.release": { ja: "発売", en: "Release" },
    "timeline.th.title": { ja: "タイトル", en: "Title" },
    "timeline.th.platform": { ja: "機種", en: "Platform" },
    "timeline.th.scene": { ja: "物語のどこを描くか", en: "Where it falls in the story" },
    "timeline.th.order": { ja: "順", en: "#" },
    "timeline.notes.title": { ja: "読むときの注意", en: "How to read this" },
    "timeline.detail.title": { ja: "各作品をくわしく", en: "More about each title" },
    "timeline.detail.lead": {
      ja: "年表・あらすじ・キーワードは MEMORY ALBUM に、シリーズの根幹と相関図は SECRET MEMORY にあります。",
      en: "Timelines, synopses, and keywords live in MEMORY ALBUM; the series' core mythology and relationship map live in SECRET MEMORY."
    },
    "timeline.cta.album": { ja: "MEMORY ALBUM へ", en: "To MEMORY ALBUM" },

    /* ---------- MEMORY THEMES(music.html) ---------- */
    "music.head.title": { ja: "MEMORY THEMES", en: "MEMORY THEMES" },
    "music.head.lead": { ja: "旅の記憶に、いつも音楽が鳴っていた", en: "There was always music playing in the memory of that journey" },
    "music.list.title": { ja: "こんな曲があります", en: "Songs featured here" },
    "music.list.lead": {
      ja: "宇多田ヒカルによる主題歌と、下村陽子によるシリーズ音楽から、特に語られることの多い曲を選びました。<strong>曲名・作曲/歌・どの作品で流れる曲か</strong>は事実として掲載し、場面のあとに続く解説はこのサイトの書き手による感想です。各カードから Spotify・Apple Music・YouTube などで曲を探せます。",
      en: "A selection of frequently discussed songs, drawn from Hikaru Utada's theme songs and Yoko Shimomura's series music. <strong>Title, composer/artist, and which game it plays in</strong> are presented as fact; the commentary after each scene description is this site's own writing. Each card links out to Spotify, Apple Music, YouTube, and more."
    },
    "music.back.title": { ja: "記憶の間へ戻る", en: "Return to the hall of memory" },
    "music.back.lead": {
      ja: "曲名や場面で気になる作品があれば、年表からその記憶を辿ってみてください。",
      en: "If a song or scene catches your interest, trace that memory from the timeline."
    },
    "music.cta.album": { ja: "MEMORY ALBUM へ", en: "To MEMORY ALBUM" },

    /* ---------- MEMORY OF SUMMER(roxas.html) ---------- */
    "roxas.head.title": { ja: "MEMORY OF SUMMER", en: "MEMORY OF SUMMER" },
    "roxas.head.lead": { ja: "ロクサスの、七日間", en: "Roxas's seven days" },
    "roxas.intro.title": { ja: "夏休み、あと七日。", en: "Seven days of summer left." },
    "roxas.intro.lead": {
      ja: "トワイライトタウン。陽が沈みきらない、ずっと夕方のままの街。そこで暮らす少年 <strong>ロクサス</strong> の夏休みは、あと七日で終わります。仲間のハイネ、ピンス、オレットと落書きを消して回り、時計塔のてっぺんで <strong>シーソルトアイス</strong> を分け合う——どこにでもある、最後の一週間のはずでした。",
      en: "Twilight Town: a town stuck forever in an unfinished sunset. A boy named <strong>Roxas</strong> lives there, with seven days of summer left. He and his friends Hayner, Pence, and Olette spend their days erasing graffiti and sharing <strong>sea-salt ice cream</strong> atop the clock tower — an ordinary last week, or so it should have been."
    },
    "roxas.slides.title": { ja: "七日間の、ロクサス。", en: "Roxas, over seven days." },
    "roxas.slides.lead": {
      ja: "トワイライトタウンで過ごした、ありふれた——そして少しずつ歪んでいく日々の断片。",
      en: "Fragments of ordinary days in Twilight Town — days that slowly begin to warp."
    },
    "roxas.quote.title": { ja: "シリーズ屈指の、ひとこと。", en: "One of the series' most memorable lines." },
    "roxas.reality.title": { ja: "その夏は、実在しない。", en: "That summer never really happened." },
    "roxas.legacy.title": { ja: "七日間の、その先にあるもの。", en: "What lies beyond those seven days." },
    "roxas.more.title": { ja: "もっと辿るなら", en: "Want to explore more?" },
    "roxas.cta.music": { ja: "MEMORY THEMES へ", en: "To MEMORY THEMES" },
    "roxas.cta.album": { ja: "MEMORY ALBUM へ", en: "To MEMORY ALBUM" },

    /* ---------- MEMORY CROSSOVER ---------- */
    "crossover.head.title": { ja: "MEMORY CROSSOVER", en: "MEMORY CROSSOVER" },
    "crossover.head.lead": { ja: "キングダムハーツと縁のある作品たち", en: "The works connected to KINGDOM HEARTS" },
    "crossover.intro.lead": {
      ja: "キングダムハーツは、<strong>スクウェア・エニックスのゲーム</strong>と<strong>ディズニー / ピクサーの物語</strong>が交わって生まれたシリーズです。ファイナルファンタジーの英雄たち、『すばらしきこのせかい』の少年少女、そして数多くのディズニー作品が、ひとつの「記憶」の中で出会います。ここでは、その顔ぶれを作品ごとに一覧にしました。",
      en: "KINGDOM HEARTS was born where <strong>Square Enix games</strong> meet <strong>Disney and Pixar stories</strong>. Heroes from FINAL FANTASY, the teens of The World Ends with You, and countless Disney works all meet within a single memory. Here, that cast is listed work by work."
    },
    "crossover.notes.title": { ja: "見るときの注意", en: "Before you look" },
    "crossover.scenes.title": { ja: "クロスオーバーの、名場面", en: "Memorable crossover scenes" },
    "crossover.characters.title": { ja: "キャラクターをくわしく", en: "More about the characters" },
    "crossover.characters.lead": {
      ja: "個々のキャラクターの紹介は MEMORY ALBUM に、シリーズ全体の流れは TIMELINE にあります。",
      en: "Individual character profiles live in MEMORY ALBUM; the flow of the whole series lives in TIMELINE."
    },
    "crossover.cta.album": { ja: "MEMORY ALBUM へ", en: "To MEMORY ALBUM" },

    /* ---------- SECRET MEMORY(未解放時の施錠画面) ---------- */
    "secret.lock.text": {
      ja: "この記録はまだ閉ざされています。<br>サイトの各所に隠された記憶の欠片を集めることで、扉が開かれます。",
      en: "This record is still sealed.<br>Collect the memory fragments hidden throughout the site to open the door."
    },
    "secret.lock.hint.pre": { ja: "解放まで、あと", en: "" },
    "secret.lock.hint.post": {
      ja: "個。<br>欠片は TOP・MEMORY ALBUM の各ページに隠されています。作品やキャラクターの詳細を開いた先にも、まだ見ぬ光があるかもしれません。",
      en: "more to unlock.<br>Fragments are hidden across TOP and MEMORY ALBUM. More light may be waiting inside the works and character details you haven't opened yet."
    },
    "secret.lock.cta": { ja: "MEMORY ALBUM を探す", en: "Search MEMORY ALBUM" },

    /* ---------- 404 ---------- */
    "404.title": { ja: "この記憶は 見つからない", en: "This memory can't be found" },
    "404.text": {
      ja: "アドレスが間違っているか、そのページはもう存在しないか——<br>あるいは、まだ誰にも思い出されていないのかもしれません。",
      en: "The address may be wrong, or the page may no longer exist —<br>or perhaps it simply hasn't been remembered by anyone yet."
    },
    "404.cta.home": { ja: "TOP へ戻る", en: "Back to TOP" },
    "404.cta.album": { ja: "MEMORY ALBUM を開く", en: "Open MEMORY ALBUM" }
  };

  /* ------------------------------------------------------------
     現在の言語(既定は日本語)
     ------------------------------------------------------------ */
  function currentLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "ja";
    } catch (err) {
      return "ja";
    }
  }

  /* {n} のようなプレースホルダーを差し込む */
  function format(str, vars) {
    if (!vars) return str;
    return Object.keys(vars).reduce(
      (acc, key) => acc.split("{" + key + "}").join(String(vars[key])),
      str
    );
  }

  function t(key, vars) {
    const entry = STRINGS[key];
    if (!entry) return null;
    const lang = currentLang();
    const value = lang === "en" && entry.en != null ? entry.en : entry.ja;
    return format(value, vars);
  }

  /* WORKS など data.js のオブジェクトを言語に応じて出し分ける。
     英語版フィールド(field + "En")が無い場合は日本語のまま返す */
  function pick(obj, field) {
    if (!obj) return "";
    if (currentLang() === "en" && obj[field + "En"]) return obj[field + "En"];
    return obj[field];
  }

  function applyTo(root) {
    const scope = root || document;
    const lang = currentLang();
    document.documentElement.lang = lang;
    if (document.body) document.body.classList.toggle("lang-en", lang === "en");

    scope.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = t(el.getAttribute("data-i18n"));
      if (value == null) return;
      if (value.indexOf("<") !== -1) el.innerHTML = value;
      else el.textContent = value;
    });

    scope.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.getAttribute("data-i18n-attr")
        .split(",")
        .forEach((pair) => {
          const idx = pair.indexOf(":");
          if (idx === -1) return;
          const attr = pair.slice(0, idx).trim();
          const key = pair.slice(idx + 1).trim();
          const value = t(key);
          if (value != null) el.setAttribute(attr, value);
        });
    });
  }

  function setLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (err) {
      /* 保存できなくても表示切り替え自体は行う */
    }
    applyTo(document);
    document.dispatchEvent(new CustomEvent("kh-lang-change", { detail: { lang: lang } }));
  }

  function toggle() {
    setLang(currentLang() === "en" ? "ja" : "en");
    if (typeof AudioEngine !== "undefined") AudioEngine.play("click");
  }

  document.addEventListener("DOMContentLoaded", () => applyTo(document));

  return {
    t,
    apply: applyTo,
    setLang,
    toggle,
    lang: currentLang,
    pick
  };
})();
