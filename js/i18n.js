/* ============================================================
   i18n.js — 日本語 / 英語 表示切り替え
   ------------------------------------------------------------
   キングダムハーツは海外でも人気の高いシリーズのため、
   ヘッダーの切り替えボタンで英語表示に対応する。

   対象は「サイト共通のUI文言」「各ページの手書き本文」に加えて、
   data.js側のほぼ全コンテンツ(WORKS/CHARACTERS/WORLDS/GLOSSARY/
   THEME_TRACKS/CROSSOVERS/CROSSOVER_SCENES/SECRET_SCENES/
   ROXAS_SHOTS/KH_CORE/KH_ERA/RELATION_MAP)まで英訳している。
   固有名詞・短いラベルの羅列(tags/keywords/worlds/music、
   CROSSOVERSのtitle/origin/guests/stageなど)は英字表記のままで
   通じるため日本語表記を維持している。

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
    "album.legend.main": { ja: "本編に登場", en: "Appears in a main title" },
    "album.legend.side": { ja: "外伝に登場", en: "Appears in a side title" },
    "album.legend.none": { ja: "未登場。", en: "Doesn't appear." },
    "album.legend.worlds.pre": {
      ja: "各カード下の<strong>バーは全12作品(発売順で固定)</strong>のうち、そのワールドが登場する作品を示します。",
      en: "The bar under each card <strong>always lists all 12 titles, in release order</strong>, and lights up the ones that world appears in."
    },
    "album.legend.worlds.post": {
      ja: "記号にカーソルを合わせると作品名が出ます(I=KH / CoM / II / Days / BbS / coded / 3D / χ / 0.2 / III / MoM / IV)。",
      en: "Hover over a mark to see the title's name (I=KH / CoM / II / Days / BbS / coded / 3D / χ / 0.2 / III / MoM / IV)."
    },
    "album.legend.characters.pre": {
      ja: "各カード下の<strong>バーは全12作品(発売順で固定)</strong>のうち、その人物が登場する作品を示します。",
      en: "The bar under each card <strong>always lists all 12 titles, in release order</strong>, and lights up the ones that character appears in."
    },
    "album.legend.characters.none": { ja: "未登場。カメオ出演までは網羅していません。", en: "Doesn't appear. Cameo appearances aren't fully covered." },
    "album.charFilter.guardian": { ja: "主人公たち", en: "The Guardians" },
    "album.charFilter.org13": { ja: "XIII機関", en: "Organization XIII" },
    "album.charFilter.wayfinder": { ja: "ウェイファインダー", en: "Wayfinder" },
    "album.charFilter.chi": { ja: "χの世代", en: "Age of χ" },
    "album.charFilter.other": { ja: "その他", en: "Other" },
    "album.charFilter.companion": { ja: "王様と仲間", en: "King & Friends" },
    "album.charFilter.villain": { ja: "敵対者", en: "Villains" },
    "album.charFilter.disney": { ja: "ディズニー", en: "Disney" },
    "album.noResult": { ja: "該当する記憶が見つかりませんでした。", en: "No matching memories found." },
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
    "timeline.yearTbd": { ja: "発売未定", en: "TBA" },
    "timeline.notes.title": { ja: "読むときの注意", en: "How to read this" },
    "timeline.detail.title": { ja: "各作品をくわしく", en: "More about each title" },
    "timeline.detail.lead": {
      ja: "年表・あらすじ・キーワードは MEMORY ALBUM に、シリーズの根幹と相関図は SECRET MEMORY にあります。",
      en: "Timelines, synopses, and keywords live in MEMORY ALBUM; the series' core mythology and relationship map live in SECRET MEMORY."
    },
    "timeline.cta.album": { ja: "MEMORY ALBUM へ", en: "To MEMORY ALBUM" },
    "timeline.notes.item1": {
      ja: "<strong>CHAIN OF MEMORIES と 358/2 DAYS は同じ時期の出来事。</strong>片方はソラ、もう片方はロクサスの視点で、並行して進みます。",
      en: "<strong>CHAIN OF MEMORIES and 358/2 DAYS take place during the same period.</strong> One follows Sora's perspective, the other Roxas's, running in parallel."
    },
    "timeline.notes.item2": {
      ja: "<strong>0.2 -A FRAGMENTARY PASSAGE- は BbS の直後から始まり</strong>、終盤でそのまま『III』の直前へと繋がります。表では便宜上 BbS の次に置いています。",
      en: "<strong>0.2 -A FRAGMENTARY PASSAGE- begins right after BIRTH BY SLEEP</strong>, and its ending connects directly into the moment before III. For convenience, the table places it right after BbS."
    },
    "timeline.notes.item3": {
      ja: "<strong>χ SERIES は複数タイトルの総称</strong>です ――<code>χ[chi]</code>(2013・ブラウザ)、<code>Unchained χ</code>／<code>Union χ[Cross]</code>(スマホ)、そしてマスター・ゼアノートの若き日を描く <code>Dark Road</code>。",
      en: "<strong>χ SERIES is an umbrella term for several titles</strong> — <code>χ[chi]</code> (2013, browser), <code>Unchained χ</code> / <code>Union χ[Cross]</code> (mobile), and <code>Dark Road</code>, which depicts a young Master Xehanort."
    },
    "timeline.notes.item4": {
      ja: "<strong>多くはHDコレクションに収録</strong>されています ――『1.5 ReMIX』『2.5 ReMIX』『2.8 Final Chapter Prologue』(のちに『1.5＋2.5 ReMIX』へ統合)。『III』は単体(のちに追加DLC『Re Mind』)。",
      en: "<strong>Most titles are collected in HD releases</strong> — 1.5 ReMIX, 2.5 ReMIX, and 2.8 Final Chapter Prologue (later combined into 1.5+2.5 ReMIX). III stands alone (later given the Re Mind DLC)."
    },

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
    "roxas.omen.lead": { ja: "けれど、七日間のあいだ、小さな綻びが少しずつ増えていきます。", en: "But over those seven days, small cracks begin to show, one by one." },
    "roxas.omen.item1": { ja: "白くて、音のない化け物が、なぜかロクサスだけを狙って現れる。", en: "A white, silent creature appears, seemingly hunting Roxas alone." },
    "roxas.omen.item2": { ja: "ときどき、街の時間がぴたりと止まる。", en: "Sometimes, time in the town stops dead." },
    "roxas.omen.item3": { ja: "見たこともない少年と、赤い髪の男が出てくる夢を、毎晩見る。", en: "Every night, he dreams of a boy he's never seen, and a man with red hair." },
    "roxas.omen.item4": { ja: "誰かが「ロクサス」と、自分の名前を呼んでいる気がする。", en: "He feels like someone is calling his name — Roxas." },
    "roxas.omen.closing": {
      ja: "プレイヤーはこの七日間、シリーズの主人公ソラをまだ動かせません。『KINGDOM HEARTS II』は、<strong>名前も知らない少年の、平凡で、少しずつ歪んでいく夏</strong>から静かに幕を開けます。",
      en: "For these seven days, the player still can't control Sora, the series' hero. KINGDOM HEARTS II quietly opens with <strong>the ordinary, slowly warping summer of a boy whose name you don't yet know</strong>."
    },
    "roxas.quote.lead": {
      ja: "七日目の終わり。すべてを知ったロクサスは、眠りについた少年ソラのカプセルの前に立ち、静かにこう呟きます。",
      en: "At the end of the seventh day, having learned everything, Roxas stands before the pod holding the sleeping Sora and quietly murmurs:"
    },
    "roxas.quote.text": { ja: "「俺の夏休み――　終わっちゃった」", en: "\"My summer vacation... is over.\"" },
    "roxas.quote.commentary": {
      ja: "電撃オンラインはこの一言を <strong>「シリーズ屈指の名言」</strong> と評し、「『キングダム ハーツ』はよく“ストーリーが泣ける”と言われるが、その要因のひとつは間違いなくこのロクサスの夏休み」と書いています。このとき流れているのは、彼のためだけに書かれたテーマ曲<strong>「Roxas」</strong>。美しくも哀愁の漂うトワイライトタウンの音楽と、シナリオと、この曲が一体になって——プレイヤーの涙腺を容赦なく刺激する、と。",
      en: "Dengeki Online calls this line <strong>\"one of the series' finest lines,\"</strong> writing that KINGDOM HEARTS is often praised for its tear-jerking story, and Roxas's summer is undoubtedly one of the reasons why. Playing at that moment is a theme written just for him: <strong>\"Roxas.\"</strong> Together, the beautiful, wistful music of Twilight Town, the scenario, and this track mercilessly go straight for the player's tear ducts."
    },
    "roxas.spoiler": { ja: "ここから先は、ロクサスの七日間の「正体」に触れます", en: "From here on, this page discusses the truth behind Roxas's seven days" },
    "roxas.truth.lead": {
      ja: "ロクサスが歩いた街も、隣で笑っていた仲間も、積み重ねてきたはずの思い出も、すべては数日ぶんだけ用意された <strong>仮想のトワイライトタウン</strong> でした。",
      en: "The town Roxas walked through, the friends laughing beside him, the memories he thought he'd built up — all of it was a <strong>simulated Twilight Town</strong>, prepared for just a few days."
    },
    "roxas.truth.p1": {
      ja: "作ったのは、賢者アンセム——通称 <strong>ディズ</strong>。目的は、長い眠りについた主人公ソラを目覚めさせることでした。そのためには、ソラから分かたれて生まれた存在であるロクサスが、ソラのもとへ「還る」必要があった。ディズは、ロクサスを留めておくための箱として、この偽物の夏を用意したのです。",
      en: "It was built by Ansem the Wise — known as <strong>DiZ</strong>. His goal was to wake Sora, the hero, from his long sleep. For that, Roxas, a being split off from Sora, needed to \"return\" to him. DiZ prepared this false summer as a box to keep Roxas contained until then."
    },
    "roxas.truth.p2": {
      ja: "ロクサスは <strong>ノーバディ</strong>——心を失った者から生まれた、本来は心を持たないはずの存在です。それでも彼は、消えていく間際に、悔しさや寂しさや、名前を呼びたい誰かへの想いのような感情を見せます。「心が無い」という設定そのものへの、静かな反証として。",
      en: "Roxas is a <strong>Nobody</strong> — born from someone who lost their heart, and by definition someone who shouldn't have a heart of his own. And yet, as he fades away, he shows frustration, loneliness, something like longing for someone whose name he wants to call — a quiet rebuttal to the very premise that he has no heart at all."
    },
    "roxas.truth.p3": {
      ja: "その先で目を覚ましたソラの物語は、書き換えられた記憶(『Re:Chain of Memories』)を辿り直し、XIII機関との対立の中心へと進んでいきます。ロクサスの七日間は、その長い旅の、いちばん静かな入口です。",
      en: "From there, the story of Sora waking up retraces his rewritten memories (in Re:Chain of Memories) and moves toward the center of the conflict with Organization XIII. Roxas's seven days are the quietest entrance into that long journey."
    },
    "roxas.appeal.lead": {
      ja: "ロクサスの夏はプロローグにすぎません。その扉の向こうには、シリーズでも屈指の完成度と言われる本編が広がっています。",
      en: "Roxas's summer is only a prologue. Beyond that door lies a full game often called one of the most polished entries in the entire series."
    },
    "roxas.appeal.card1.title": { ja: "物語のスケール", en: "The scale of the story" },
    "roxas.appeal.card1.text": {
      ja: "ダークシーカー編の折り返し地点。書き換えられた記憶、XIII機関、ノーバディ、そしてロクサスとシオン——後の全作品へ伸びる伏線が、ここでいっきに動き出します。",
      en: "The midpoint of the Dark Seeker Saga. Rewritten memories, Organization XIII, Nobodies, and Roxas and Xion — threads that stretch into every later game all start moving at once here."
    },
    "roxas.appeal.card2.title": { ja: "進化したアクション", en: "Evolved action" },
    "roxas.appeal.card2.text": {
      ja: "状況に応じて発動する「リアクションコマンド」、仲間の力で姿を変える「ドライブフォーム」。爽快さと戦略性を両立したバトルは、電撃オンライン評で「いま遊んでもシリーズ全体でトップクラスの完成度」。",
      en: "Context-sensitive Reaction Commands, and Drive Forms that let Sora transform using his allies' strength. Combat that balances exhilaration with strategy — Dengeki Online called it \"top-tier polish for the whole series, even played today.\""
    },
    "roxas.appeal.card3.title": { ja: "追加された手応え", en: "What Final Mix adds" },
    "roxas.appeal.card3.text": {
      ja: "新ダンジョン「追憶の洞」、XIII機関の影(アブセント・シルエット)やデータ戦、新フォーム「リミットフォーム」、追加カットシーン。そして——ムービー主体だったロクサスとの戦いが、「The Other Promise」を背負う本格的なボス戦として遊べるように。高難度のクリティカルモードも本作から。",
      en: "A new dungeon, the Cavern of Remembrance; Absent Silhouettes and data battles tied to Organization XIII; a new Limit Form; extra cutscenes. And the once cutscene-only battle with Roxas becomes a full boss fight set to \"The Other Promise.\" The high-difficulty Critical Mode also debuts here."
    },
    "roxas.appeal.card4.title": { ja: "泣きの半分は音楽", en: "Half the tears come from the music" },
    "roxas.appeal.card4.text": {
      ja: "下村陽子によるスコア。ロクサスのテーマ「Roxas」、その短調アレンジ「The Other Promise」、宇多田ヒカルの主題歌「Passion(英題 Sanctuary)」。哀愁のトワイライトタウンBGM群も含め、この作品の“泣ける”をかたちづくっています。",
      en: "A score by Yoko Shimomura: Roxas's theme \"Roxas,\" its minor-key arrangement \"The Other Promise,\" and Hikaru Utada's theme song \"Passion\" (\"Sanctuary\" in English). Together with the wistful Twilight Town BGM, they shape everything that makes this game so tear-jerking."
    },
    "roxas.more.item1": {
      ja: "<strong>遊ぶなら:</strong>『KINGDOM HEARTS HD 1.5＋2.5 リミックス』に『II FINAL MIX』が収録されています(PS4 ほか)。同じ集の映像作品『358/2 Days』では、ロクサスがXIII機関で過ごした日々が描かれ、「『II FINAL MIX』では語られなかった重要なキャラクターが登場し、ロクサスにより感情移入できる」(電撃オンライン)。",
      en: "<strong>To play it:</strong> II FINAL MIX is included in KINGDOM HEARTS HD 1.5+2.5 ReMIX (PS4 and others). The same collection's cinematic, 358/2 DAYS, depicts the days Roxas spent in Organization XIII — Dengeki Online notes it introduces an important character left untold in II FINAL MIX, making it easier to empathize with Roxas."
    },
    "roxas.more.item2.label": { ja: "このサイトで:", en: "On this site:" },
    "roxas.closing.line1": { ja: "偽物の夏だったとしても、", en: "Even if it was a fake summer," },
    "roxas.closing.line2": {
      ja: "時計塔の上で分け合った あの味は、たしかにそこにあった。",
      en: "the taste they shared atop the clock tower was, without question, real."
    },

    /* ---------- MEMORY CROSSOVER ---------- */
    "crossover.head.title": { ja: "MEMORY CROSSOVER", en: "MEMORY CROSSOVER" },
    "crossover.head.lead": { ja: "キングダムハーツと縁のある作品たち", en: "The works connected to KINGDOM HEARTS" },
    "crossover.intro.lead": {
      ja: "キングダムハーツは、<strong>スクウェア・エニックスのゲーム</strong>と<strong>ディズニー / ピクサーの物語</strong>が交わって生まれたシリーズです。ファイナルファンタジーの英雄たち、『すばらしきこのせかい』の少年少女、そして数多くのディズニー作品が、ひとつの「記憶」の中で出会います。ここでは、その顔ぶれを作品ごとに一覧にしました。",
      en: "KINGDOM HEARTS was born where <strong>Square Enix games</strong> meet <strong>Disney and Pixar stories</strong>. Heroes from FINAL FANTASY, the teens of The World Ends with You, and countless Disney works all meet within a single memory. Here, that cast is listed work by work."
    },
    "crossover.legend.pre": {
      ja: "各カード下の<strong>バーは全12作品(発売順で固定)</strong>のうち、その作品の要素が登場する KINGDOM HEARTS タイトルを示します。",
      en: "The bar under each card <strong>always lists all 12 titles, in release order</strong>, and lights up the KINGDOM HEARTS titles that feature elements of that work."
    },
    "crossover.legend.post": { ja: "記号にカーソルを合わせると作品名が出ます。", en: "Hover over a mark to see the title's name." },
    "crossover.filter.ff": { ja: "ファイナルファンタジー", en: "FINAL FANTASY" },
    "crossover.filter.twewy": { ja: "すばらしきこのせかい", en: "The World Ends with You" },
    "crossover.filter.disney": { ja: "ディズニー / ピクサー", en: "Disney / Pixar" },
    "crossover.filter.disneyExtra": { ja: "短編・楽曲・召喚", en: "Shorts, music, summons" },
    "crossover.noResult": { ja: "該当する作品がありません。", en: "No matching works found." },
    "crossover.notes.title": { ja: "見るときの注意", en: "Before you look" },
    "crossover.notes.item1": {
      ja: "<strong>「登場する場所」はワールド名(またはメニュー機能)</strong>です。同じ作品が複数のキングダムハーツ作品にまたがって登場することもあります。",
      en: "<strong>\"Where it appears\" names a world (or a menu feature).</strong> The same work sometimes appears across multiple KINGDOM HEARTS titles."
    },
    "crossover.notes.item2": {
      ja: "<strong>ファイナルファンタジー勢は「レイディアントガーデン復興委員会」</strong>として一括りに動く場面が多く、出身タイトルはFFVII・FFVIII・FFXなどに分かれています。",
      en: "<strong>The FINAL FANTASY cast often act together as the Radiant Garden Restoration Committee,</strong> though individually they come from FFVII, FFVIII, FFX, and others."
    },
    "crossover.notes.item3": {
      ja: "<strong>権利や制作の都合で一作限りのワールドもあります</strong>(『ターザン』のディープジャングルなど)。",
      en: "<strong>Some worlds appear only once</strong> due to licensing or production reasons (Deep Jungle from Tarzan, for example)."
    },
    "crossover.notes.item4": {
      ja: "固有名詞はすべて各シリーズの実在のもの。イラストやロゴなどの画像素材は権利者(スクウェア・エニックス / ディズニー)に帰属するため、このサイトには含めていません。",
      en: "All proper nouns belong to their respective real series. Illustrations, logos, and other image assets belong to their rights holders (Square Enix / Disney) and are not included on this site."
    },
    "crossover.scenes.title": { ja: "クロスオーバーの、名場面", en: "Memorable crossover scenes" },
    "crossover.characters.title": { ja: "キャラクターをくわしく", en: "More about the characters" },
    "crossover.characters.lead": {
      ja: "個々のキャラクターの紹介は MEMORY ALBUM に、シリーズ全体の流れは TIMELINE にあります。",
      en: "Individual character profiles live in MEMORY ALBUM; the flow of the whole series lives in TIMELINE."
    },
    "crossover.cta.album": { ja: "MEMORY ALBUM へ", en: "To MEMORY ALBUM" },
    "crossover.card.stageLabel": { ja: "登場する場所", en: "Where it appears" },
    "crossover.card.guestsLabel": { ja: "おもな顔ぶれ", en: "Featured cast" },

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

    /* ---------- SECRET MEMORY(解放後のページ本体。secret.js が生成) ---------- */
    "secret.unlocked.lead": { ja: "閉ざされていた記録が、いま開かれました", en: "The sealed record has now been opened" },
    "secret.core.title": { ja: "キングダムハーツの、根幹", en: "The core of KINGDOM HEARTS" },
    "secret.core.lead": {
      ja: "ここまで辿り着いた人に、この長い物語の芯を四つだけ。",
      en: "For those who've made it this far — four ideas at the heart of this long story."
    },
    "secret.relations.title": { ja: "こころの、相関図", en: "A map of hearts" },
    "secret.relations.lead": {
      ja: "「誰が誰の“もう一人の自分”なのか」——この繋がりこそ、シリーズの背骨です。(図は横にスクロールできます)",
      en: "Who is whose \"other self\"? These connections are the series' backbone. (The diagram scrolls horizontally.)"
    },
    "secret.relations.legend.bond": { ja: "相互の絆・協力", en: "Mutual bond / cooperation" },
    "secret.relations.legend.origin": { ja: "生まれた・由来する / 心が宿る(矢印の向き)", en: "Born from / originates from — or a heart residing within (arrow direction)" },
    "secret.relations.legend.clash": { ja: "敵対・干渉", en: "Conflict / interference" },
    "secret.relations.legend.axis": { ja: "物語の主対立", en: "The story's central conflict" },
    "secret.relations.note1.title": { ja: "心を失うと、二つに分かれる", en: "Lose your heart, and you split in two" },
    "secret.relations.note1.text": {
      ja: "ゼアノートは ハートレス「アンセム」と ノーバディ「ゼムナス」に分かれた。ソラのノーバディが ロクサス、カイリのノーバディが ナミネ。",
      en: "Xehanort split into the Heartless Ansem and the Nobody Xemnas. Sora's Nobody is Roxas; Kairi's Nobody is Naminé."
    },
    "secret.relations.note2.title": { ja: "心と、姿", en: "Hearts and forms" },
    "secret.relations.note2.text": {
      ja: "ヴェントゥスの心はソラの中で眠り、その影響でロクサスはヴェントゥスと同じ姿で生まれた。シオンはソラの記憶から作られたレプリカ。ヴァニタスはヴェントゥスから切り離された闇。",
      en: "Ventus's heart sleeps within Sora, and under its influence Roxas was born wearing Ventus's own face. Xion is a replica made from Sora's memories. Vanitas is the darkness split away from Ventus."
    },
    "secret.relations.note3.title": { ja: "絆で結ばれた者たち", en: "Those bound by connection" },
    "secret.relations.note3.text": {
      ja: "ソラ・リク・カイリ / テラ・アクア・ヴェントゥス(師エラクゥスのもとで修行) / ロクサス・アクセル・シオン。ソラの旅にはドナルドとグーフィー、そして王様ミッキーが並ぶ。",
      en: "Sora, Riku, and Kairi. Terra, Aqua, and Ventus, trained under Master Eraqus. Roxas, Axel, and Xion. Donald, Goofy, and King Mickey walk alongside Sora on his journey."
    },
    "secret.relations.note4.title": { ja: "対立の軸", en: "The central conflict" },
    "secret.relations.note4.text": {
      ja: "ソラたち「光の守護者」と、ゼアノート。ゼアノートはテラの身体を奪い、アンセムとしてリクに憑依し、あらゆる時代に自らの分身を配した。",
      en: "Sora and the other Guardians of Light, against Xehanort. Xehanort steals Terra's body, possesses Riku as Ansem, and places copies of himself throughout every era."
    },
    "secret.collected.title": { ja: "集めた記憶の欠片", en: "Memory fragments collected" },
    "secret.scenes.title": { ja: "記憶に残る、場面", en: "Scenes worth remembering" },
    "secret.scenes.lead": {
      ja: "長い旅のなかで、とりわけ胸に残っている場面を並べました。",
      en: "A selection of scenes from this long journey that leave a lasting impression."
    },
    "secret.last.title": { ja: "最後のひとかけら", en: "The last fragment" },
    "secret.last.text": {
      ja: "旅の終わりに、ひとつだけ欠片を残しておきました。これを受け取れば、あなたの記憶は満ちることになります。",
      en: "One fragment was saved for the end of the journey. Take it, and your memory will be complete."
    },
    "secret.reset.button": { ja: "収集記録をリセットする", en: "Reset collection progress" },
    "secret.reset.confirm": {
      ja: "集めた記憶の欠片をすべて消去します。よろしいですか?",
      en: "This will erase every memory fragment you've collected. Are you sure?"
    },
    "secret.toast.unlocked": { ja: "隠された記録が開かれました", en: "The hidden record has been unlocked" },

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
