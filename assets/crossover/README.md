# assets/crossover/ — クロスオーバーの名場面

MEMORY CROSSOVER ページ下部の「クロスオーバーの、名場面」ギャラリー用。
`js/data.js` の `CROSSOVER_SCENES` と対応します。特定のキャラに絞らず、
FF・すばらしきこのせかい・ディズニー勢が交わる場面を10枚ほど。

## 置き方

1. 期待されるファイル名を確認する:

   ```
   python assets/sync_images.py --list
   ```

2. 名場面のスクリーンショット等を下の名前でこのフォルダに置く
   (拡張子は `.jpg` / `.png` / `.webp`。横長=16:9 推奨):

   `cs01.jpg` 〜 `cs10.jpg`

   ※ 拡張子は何でも可。`cs01.png` のように置けば `sync_images.py` が
   その拡張子で `data.js` に配線します。

3. 配線する:

   ```
   python assets/sync_images.py --apply
   ```

   枠(16:9)に合わせて切り抜き＋サイト配色へ色寄せもしたい場合は、
   `assets/_inbox/crossover/` に放り込んで:

   ```
   python assets/style_images.py --apply
   ```

4. 各場面の説明を `js/data.js` の `CROSSOVER_SCENES` に追記する:

   - `work` … その場面が登場する KH 作品(`WORKS` の id。任意。付けると金色タグが出る)
   - `title` … 見出し(短い一言)
   - `caption` … 一文の説明

   `title` と `caption` が空のうちは、フレームにファイル名だけを表示します。

## 素材について

スクリーンショット等はスクウェア・エニックス および ディズニーの著作物です。
**自分が合法的に用意できるものだけ**を置いてください
(プロジェクト全体の方針は `CLAUDE.md` を参照)。授業内での提出にとどめること。
画像が無いカードはファイル名のプレースホルダーを表示します。
