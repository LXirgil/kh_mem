# CLAUDE.md

このファイルは、このリポジトリで作業する際にClaude Code(claude.ai/code)へガイダンスを提供するものです。

## プロジェクト概要

このリポジトリは学校の課題(授業でのWebサイト制作)用です。サイトはフレームワークやビルドツールを使わず、
素のHTML/CSS/JavaScriptで構築します(Next.js/React/バンドラー/パッケージマネージャーは使用しません)。
現時点ではツール類が存在しないため、ビルド・lint・テストのコマンドはありません。HTMLファイルを
ブラウザで直接開くか、任意の静的ファイルサーバーでフォルダを配信してプレビューしてください。

## 言語について

ユーザーからの指示により、今後このプロジェクトで作成するファイル(コード内のコメント、ドキュメント、
CLAUDE.mdの更新など)はすべて日本語で記述してください。

## 重要:`agents.md-main/` について

`agents.md-main/` フォルダは、AGENTS.md規格の紹介サイトを複製した無関係なNext.jsプロジェクトであり、
**この課題のWebサイト制作とは一切関係ありません**。テンプレートとして参照したり、編集したり、
その構成・技術スタックをこのプロジェクトのアーキテクチャとして扱ったりしないでください。
勝手な判断での削除禁止！

## 制作物:KINGDOM HEARTS — MEMORY

企画書PDFに基づく体験型Webサイト。キングダムハーツシリーズの世界観から着想を得たオリジナル企画で、
公式サイトの再現ではありません。「記憶の欠片」を集めながらシリーズを辿る構成です。

### プレビュー方法

```
python -m http.server 8000
```
を作業フォルダで実行し、`http://localhost:8000/index.html` を開く。
`file://` で直接開いても概ね動作しますが、ローカルサーバー経由を推奨します。

### ページ構成

| ファイル | 役割 |
| --- | --- |
| `index.html` | TOP。初回のみ全画面イントロ(`#dive-gate` / `js/intro.js`)、ヒーロー、コンセプト、公式トレイラー埋め込み(`#trailer`。YouTube公式動画を1本、興味を引く導入として掲載)、各ページへの導線(「六つの扉」= ALBUM/TIMELINE/THEMES/SUMMER/CROSSOVER/SECRET。ナビと同じ並び)。ヒーローの「記憶を辿りはじめる」は `#gateway`(六つの扉)へのアンカー |
| `album.html` | MEMORY ALBUM。作品年表(絞り込み付き)、ワールド、キャラクター、用語集、詳細モーダル |
| `timeline.html` | TIMELINE。全作品を「発売日順」と「物語内の時系列順」の2表で整理。`js/timeline.js` が `WORKS`＋`KH_ERA` から生成 |
| `music.html` | MEMORY THEMES。代表曲(主題歌・シリーズ音楽)の一覧と、音源を用意した曲の試聴 |
| `roxas.html` | MEMORY OF SUMMER。『KINGDOM HEARTS II FINAL MIX』特集。ロクサスの七日間(夏休み)を入口に作品の魅力を紹介。`js/roxas.js` が `ROXAS_SHOTS` からロクサスの写真スライドショー(自動送り＋前後＋ドット)を組む |
| `crossover.html` | MEMORY CROSSOVER。KHと縁のある作品(FF / すばらしきこのせかい / ディズニー・ピクサー)の一覧。`js/crossover.js` が `CROSSOVERS`＋`CROSSOVER_CATEGORIES` からカードを生成(ジャンル絞り込み付き)。ページ下部に専用セクション「クロスオーバーの、名場面」= `CROSSOVER_SCENES` から SECRET の場面ギャラリーと同じ見た目(横長16:9＋見出し＋一文)のカードを `#crossover-scenes` に描画(画像は `assets/crossover/csNN.*`、無ければファイル名プレースホルダー。特定キャラに絞らない) |
| `secret.html` | SECRET MEMORY。欠片を規定数集めるまで施錠。解放後はシリーズの根幹(`KH_CORE`)とキャラクター相関図(`RELATION_MAP` を `secret.js` がSVG化)、集めた欠片一覧、ページ下部の「記憶に残る、場面」ギャラリー(`SECRET_SCENES`。画像は `assets/scenes/<id>.jpg`、無ければファイル名プレースホルダー)、最後の欠片f12、リセットを表示 |
| `404.html` | 「この記憶は見つからない」テーマの404ページ。ナビには載せない。`python -m http.server` では自動表示されず、GitHub Pages 等のホストで有効 |

各HTMLの `<head>` には共通で favicon(`favicon.svg` = 鍵穴マーク)、`apple-touch-icon.png`(180px)、
`<meta name="theme-color" content="#03060d">`、自ページを指す `<link rel="canonical">`、
OGP/Twitter カードの meta を入れています。`<body>` 直後に「本文へスキップ」リンク(`.skip-link`)、
`<main>` に `id="main"`、`#page-transition` の直後に到着演出用の小さなインライン `<script>`
(`html.kh-arrive` を先出し＋1.5秒の安全策)。**これらもヘッダー/フッターと同様、全ページで揃えること。**
`canonical` は相対(ファイル名のみ)。独自ドメインへ出す場合は絶対URLに直す。

ヘッダーとフッターは各HTMLに直接記述しています(共通化の仕組みは使っていません)。
**ヘッダー/フッターを変更したら、全ページ(`404.html` 含む)に同じ変更を反映してください。**
ナビの並びは TOP / ALBUM / TIMELINE / THEMES / SUMMER / CROSSOVER / SECRET。
ハンバーガーへの切替は `css/layout.css` の `@media (max-width: 1120px)`
(横並びは1121px以上でのみ表示。項目の字間・余白も横並びが収まるよう詰めてある)。
ヘッダーの `.header-tools` には記憶カウンター・音声トグルに加えて、日本語/英語切り替えボタン
(`.lang-toggle` / `data-lang-toggle`。`js/i18n.js`＋`js/main.js` の `initLangToggle()`)が全ページ共通で入っている。
`roxas.html` は共通6本(`data→audio→effects→memory→i18n→main`)＋ `js/roxas.js`(写真スライドショー)。
記憶の欠片(全12個)は配置しない。
`roxas.html` の `<body>` だけ `class="page-summer"` を持ち、トワイライトタウンの夕景に合わせた
暖色(オレンジ)テーマになる。`css/base.css` の青系トークン(`--c-blue*`・`--panel-border`・
`--glow-blue*`)を `css/pages.css` の `body.page-summer{...}` でまとめて上書きし、
それらのトークンを参照している要素(section-label・ボタン・パネルの縁・下線・発光など)は
自動で色が変わる。CSS変数を参照せず直書きの青(`rgba(154,213,255,*)` 等)を使っている
コンポーネント(区切り線・カード背面の光・スライドショーの矢印/ドット等)は
同じブロック内で個別に上書き。背景の光暈・光の粒子(`effects.js` の `initParticles`)・
漂うモチーフ(`initDriftMotifs`)・見出し出現時のスパーク(`maybeSparkle`)・見出しの発光
(`title-focus-summer` keyframes)も `document.body.classList.contains("page-summer")` で
分岐し、このページだけ暖色になる。**他ページに影響しないよう、このテーマは
`body.page-summer` 配下にすべて閉じ込めてある。**

### CSS(役割ごとに4分割・全ページで4枚とも読み込む)

- `css/base.css` — リセット、カラー変数などのデザイントークン、タイポグラフィ。**色や余白の値はここの `:root` に集約**。
  文字の視認性向上のため `--c-text` / `--c-text-dim` / `--panel-bg` / `--panel-border` は標準よりやや明るめに調整済み
  (背景の暗さ自体はコンセプト上あえて維持し、文字側の明度・本文フォントサイズ(17px)を上げて対応している)
- `css/layout.css` — ヘッダー、ナビ、フッター、背景演出レイヤー、ページ遷移、`.reveal`。
  背景最奥の `body::before` で `assets/IMG_4388.png`(KH/ディズニーのアイコン柄)を低 opacity で敷いている
- `css/components.css` — ボタン、パネル、モーダル、記憶の欠片、進捗バー、トースト
- `css/pages.css` — 各ページ固有のセクション

### JavaScript(読み込み順に依存関係あり)

全ページ共通で `data.js → audio.js → effects.js → memory.js → i18n.js → main.js` の順に読み込み、
その後にページ固有のスクリプトを読み込みます。この順序を崩すと動きません。

- `js/data.js` — 作品(`WORKS`)、ワールド(`WORLDS`)、キャラクター(`CHARACTERS`)、用語集
  (`GLOSSARY`)、欠片、物語テキスト、`AUDIO_CONFIG`、代表曲(`THEME_TRACKS`)、
  音楽配信サービス(`MUSIC_PLATFORMS`)、縁のある作品(`CROSSOVERS`＋`CROSSOVER_CATEGORIES`)、
  クロスオーバーの名場面ギャラリー(`CROSSOVER_SCENES` = id/work/title/caption/image。CROSSOVER ページ下部)、
  SECRET下部の場面ギャラリー(`SECRET_SCENES` = id/work/title/caption/image)、
  ロクサス写真スライドショー(`ROXAS_SHOTS` = id/caption/image)、
  SECRET用のシリーズの根幹(`KH_CORE`)と
  キャラクター相関図(`RELATION_MAP` = nodes〔x,y座標＋`img`(顔画像 `assets/characters/*.webp`)。
  `img` 省略時は頭文字の丸アイコンにフォールバック〕/links〔type: bond=絆・実線 /
  origin=由来・破線＋金矢印 / clash=敵対・点線＋赤矢印 / axis=主対立・両矢印〕。
  `secret.js` が各ノードを丸くクリップした顔アイコン＋下に名前で SVG 描画)。
  **表示内容の変更はここだけで済む**
  - `WORKS` の各作品には `short`(発売順の略号: I / CoM / II / Days / BbS / coded / 3D /
    χ / 0.2 / III / MoM / IV)がある。ALBUM のキャラ・ワールドカード下部の「登場作品バー」
    (`album.js` の `worksTagsHtml`)は全12作品を発売順で固定表示し、`works` に含む作品だけを
    `category`(main=青 / side=金 / future=淡)で点灯させる。凡例は `album.html` の
    `.appears-legend`、スタイルは `css/pages.css` の `.appears` / `.appears__cell`
  - `WORKS` の `subtitle` / `summary` には英語版(`subtitleEn` / `summaryEn`)を用意してあり、
    `album.js` が `KH_I18N.pick(work, "subtitle")` のように言語に応じて出し分ける
    (`detail` などその他のフィールドに英語版は無く、常に日本語のまま)
- `js/audio.js` — `AudioEngine`。効果音は常にWeb Audio APIで合成。BGMは既定では合成音だが、
  `js/data.js` の `AUDIO_CONFIG.bgmSrc` にパスを書くと音源ファイル(mp3等)を再生する。
  `duckBgm()` / `unduckBgm()` で BGM を一時的に絞れる(THEMES ページの試聴中に使用)
- `js/effects.js` — `Effects`。Canvasの光の粒子、カーソル追従光、スクロール連動、ページ遷移、`burst()`、
  スクロール連動(`initScrollReveal`)は同フレームで可視化した `.reveal` を上から順に時間差表示し、
  `.section-title` / `.page-head__title` を含む塊が現れたら `burst()` で光の粒を弾く。
  `initClickEffects()`(`initAll()` から起動)は `a` / `button` / 各種カード(`.work-card` 等)を
  押すたびに、押した座標へ光の輪(`spawnClickRing`)と小さな粒(`burst()`)を発生させる。
  記憶の欠片(`[data-fragment]`)は `memory.js` 側で獲得時の `burst()` をすでに鳴らしているため対象外。
  背景を漂うKHモチーフ(`.drift-layer` を生成。王冠・キーブレード・鍵穴等のSVGシルエット)、
  左右ガターの装飾フレーム(`.side-frame` を生成。幅1240px未満では非表示。
  右側の欠片12個は `memory.js` の `updateCounter()` が `[data-fragment-dot]` を更新して同期)。
  ページ遷移:退場時に `#page-transition` へ `is-leaving`(鍵穴が閉じる)、
  サイト内リンクからの到着時は `sessionStorage["kh-nav"]` を見て `is-arriving`(鍵穴が開く)。
  暗幕は各ページ head 直後インライン(`html.kh-arrive`)で先出し＋1.5秒の安全策付き
- `js/intro.js` — TOP 専用。初回のみ(`sessionStorage["kh-dive-seen"]`)全画面ゲート
  「ダイブ・トゥ・ザ・ハート」風演出。`#dive-gate` の中身を生成し、触れると本体へ。
  `prefers-reduced-motion` は静止表示。`index.html` の `#dive-gate` インラインに5秒の安全策
- `js/memory.js` — `MemorySystem`。欠片の収集とlocalStorage保存、解放判定
- `js/i18n.js` — `KH_I18N`。日本語/英語の表示切り替え(海外プレイヤー向け)。`localStorage["kh-lang"]`
  に言語設定を保存し、`[data-i18n="キー"]` を持つ要素の中身、`[data-i18n-attr="属性名:キー"]` を
  持つ要素の属性を、辞書(`STRINGS`)に基づいて書き換える。対象は共通UI文言(ヘッダー/フッター/
  ボタン)と各ページの見出し・導入文・作品概要(WORKSの`subtitle`/`summary`)までで、
  キャラクター解説や用語集・楽曲解説など分量の多い個別コンテンツは日本語のまま(この課題のscope外)。
  `KH_I18N.pick(obj, "field")` で `data.js` 側のオブジェクトを言語別に出し分けられる
  (英語版は `fieldEn` という名前で用意する。例:`work.subtitleEn`)。
  言語を切り替えると `kh-lang-change` イベントが発火し、`album.js` など後から描画した
  作品カードの再同期に使われる。**表示テキストを追加・変更したらこのファイルの `STRINGS` を
  必ず更新すること**
- `js/main.js` — 全ページ共通の初期化(ナビ、音声トグル、`initLangToggle` で日本語/英語切り替え
  ボタンを配線、ホバー音、`initBackToTop` で右下の「トップへ戻る」ボタン `.to-top` を body に生成、
  `initHeroParallax` で TOP の `.hero__station`(目覚めの園風の台座)をカーソルに合わせて
  `--px/--py/--px2/--py2` で視差移動)。
  ヘッダーの記憶カウンター(`.memory-counter`)を押すと、欠片12個の一覧を `.modal` で開く
  (`initMemoryLog`。未取得は名前を伏せ、隠れているページ名だけヒント表示。文言は `KH_I18N` 経由)。
  JS描画待ちのコンテナは `css/pages.css` の `:empty::after`(「読み込み中…」)で初期チラつきを抑える。
  データ由来の `<img>` は読み込み失敗時に鍵穴プレースホルダー(data URI)へ差し替わる
  (`album.js` の `IMG_ONERR` ほか各ページ script)
- `js/album.js` / `js/secret.js` / `js/timeline.js` / `js/crossover.js` / `js/roxas.js` — 各ページ固有の処理
  (`timeline.js` は `WORKS`＋`KH_ERA` から発売日順・時系列順の2表を描く。各行に `work.hue` を
  `--hue` として設定し、行番号セルの左端の色帯と、作品名の前に添える short表記バッジ
  〔`.kh-table__badge`〕で作品ごとに色分けする。
  `crossover.js` は `CROSSOVERS` からジャンル別カードを描き、ページ下部で
  `CROSSOVER_SCENES` から名場面ギャラリー(`.xscene-*` = SECRET の `.secret-scene` と同じ見た目)も描く。
  登場作品バーは `album.js` の `worksTagsHtml` と同じ見た目のものを内部に持つ。
  `album.js` の作品詳細モーダルには、YouTube検索へのリンク(直リンクではなく検索リンクなので
  URL切れが起きない。`MUSIC_PLATFORMS` の検索リンクと同じ考え方)を1本添えている)
- `js/music.js` — MEMORY THEMES ページ。`THEME_TRACKS` からカードを生成。各曲の `work`
  (WORKSのid。1作に紐付かない曲は `null`)から作品の `hue` を引いて、カード上端のライン・
  ホバー時の光・作品名バッジ〔`.theme-card__work`〕を色分けする(`work: null` は落ち着いた金色)。
  各カードに `MUSIC_PLATFORMS` からの配信サービスリンクを付け、`audio` がある曲だけ共有の
  `<audio>` 1本で試聴(1曲ずつ再生・シーク)できるようにする

### 記憶の欠片システム(サイトの中核)

- 全12個。`MEMORY_CONFIG.fragments`(`js/data.js`)で定義。`unlockThreshold`(既定8)以上で SECRET MEMORY が解放
- HTML側は `data-fragment="f01"` を持つ要素を置くだけ。クリック処理は `MemorySystem` が自動で割り当てる
- 配置場所(全7ページ中6ページに分散。SUMMER=roxas.htmlはスライドショー体験を
  阻害しないため対象外):
  - TOP = f01・f02(ヒーロー・コンセプト文の余韻)、f06(六つの扉の直前)。計3個
  - ALBUM = f07(見出しの余白)、f09(CHAIN OF MEMORIESの詳細モーダル内)、
    f11(キャラ一覧の下)。計3個
  - TIMELINE = f03(導入文の余韻)、f08(発売日順表・4作目の行)。計2個
  - MEMORY THEMES = f04(導入文の余韻)、f10(最後の曲カードの中)。計2個
  - MEMORY CROSSOVER = f05(導入文の余韻)。計1個
  - SECRET = f12(解放後のページ本体)。計1個
- `js/main.js` の `initMemoryLog()` がヘッダーの記憶カウンターから開くモーダルに、
  `MEMORY_CONFIG.fragments` から自動集計した「ページ別の個数」ヒント(例:
  「TOP 3個 ・ MEMORY ALBUM 3個 ・ …」)を表示する。ページや個数を変更しても
  この文言は自動で追従するため、手動でのメンテナンスは不要
- 保存キーは `kh-memory-progress`。音声設定は `kh-audio-enabled`、解放済み記録は `kh-secret-seen`
- **モーダルやカード一覧など後からDOMに追加した欠片は `MemorySystem.refresh()` を呼ばないと有効になりません**
  (`js/timeline.js`・`js/music.js` は表・カードを組み立てた直後にこれを呼んでいる)

### 素材についての方針

ビジュアルは基本的に CSS・インラインSVG・Canvas で生成しています
(例外:背景の最奥に `assets/IMG_4388.png` のアイコン柄を `body::before` でごく薄く敷いている。
明るさは `css/layout.css` の `opacity` で調整)。
音は、効果音を Web Audio API で合成し、BGM も既定では合成音です。
公式のロゴ・キャラクターイラスト・パッケージ画像・スクリーンショット・楽曲は
スクウェア・エニックスおよびディズニーの著作物なので、リポジトリには含めません。
TOP の公式トレイラー(`#trailer`)も同じ方針で、動画ファイルはリポジトリに含めず
YouTube(`youtube-nocookie.com`)の公式アップロードを `<iframe>` で参照しているだけ。
差し替える場合は Web検索等で公式チャンネルのアップロードであることを確認してから
`index.html` の `src`(動画ID)と `title`、`js/i18n.js` の `top.trailer.caption` を書き換える。

「キングダムハーツらしさ」は以下で表現しています(いずれも自由に使える情報・
オリジナルの図形):

- 実在の固有名詞 — キャラクター名、ワールド名、作品名、用語、主題歌名
- オリジナル制作のSVGモチーフ — 鍵穴、ハート、交差するキーブレード、
  ダイブ・トゥ・ザ・ハート風のステンドグラス、各ワールドの紋章

#### ユーザーが素材を追加できる仕組み(任意)

- 画像:`assets/works/`・`assets/characters/`・`assets/worlds/`・`assets/scenes/`(SECRET下部の
  場面ギャラリー)・`assets/roxas/`(SUMMER のスライドショー)・`assets/crossover/`(CROSSOVER 下部の
  名場面ギャラリー)にファイルを置き、`js/data.js` の
  各項目の `image` にパスを書くと表示される(`null` のままならSVG表示 / scenes・roxas は
  ファイル名プレースホルダー)。詳しくは `assets/README.md` を参照。
  `sync_images.py` / `style_images.py` の対象カテゴリは WORKS・WORLDS・CHARACTERS・SECRET_SCENES・ROXAS_SHOTS・CROSSOVER_SCENES(`assets/crossover/`)。
  - `assets/style_images.py` … `assets/_inbox/` に画像を放り込んで
    `python assets/style_images.py --apply` すると、枠の比率に切り抜き→
    サイト配色(`css/base.css` の `:root`)へ色寄せ→正しい名前で保存→`data.js` 配線
    まで一括で行う(Pillow 使用。`--no-grade` で色寄せなし)。詳細は `assets/_inbox/README.md`。
  - `assets/sync_images.py` … 画像→`data.js` の「配線だけ」を行う下位ツール
    (`style_images.py` が内部で呼ぶ)。Windows コンソールでも動くよう標準出力は UTF-8 固定。
- BGM音源:ファイルを `assets/audio/` に置き、`js/data.js` の `AUDIO_CONFIG.bgmSrc` に
  パスを書くと、合成BGMの代わりにその音源をループ再生する(`null` のままなら合成BGM)。
  再生に失敗した場合は自動で合成BGMに戻る。詳しくは `assets/audio/README.md` を参照。
- THEMES ページ:既定は「曲の紹介 + 各配信サービスへのリンク」ページ。各カードには
  `MUSIC_PLATFORMS`(`js/data.js`)の検索 URL から Spotify / Apple Music / YouTube 等の
  リンクが自動生成される(`query` が検索語。`links` に直リンクを書けばそれを優先)。
  試聴音源を持たせたい曲だけ `assets/audio/` に音源を置き `THEME_TRACKS` の `audio` に
  パスを書くと、そのカードに再生ボタンが増える。

音源・画像とも、著作権の扱いは同じです。市販曲・ゲーム収録曲・サントラ音源・公式画像には
権利者が存在します。**自作・自分で権利処理した素材・ライセンスフリー素材など、
自分が合法的に用意できるものだけ**を置いてください。授業内での提出にとどめ、
Web上に公開する場合は取り扱いに注意してください。

### 動作確認

Node.jsは未インストールのためlint/テストは使えません。構文の崩れは目視か、
ブラウザの開発者ツールのコンソールで確認してください。

指示がない限り、勝手な削除・レイアウトの調整などを実行しないこと