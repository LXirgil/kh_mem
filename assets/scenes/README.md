# scenes — SECRET MEMORY 下部「記憶に残る、場面」用の画像

`js/data.js` の `SECRET_SCENES` に対応。各シーンの `id` と同じ名前で画像を置きます。

| id | 場面 |
| --- | --- |
| `s01` | 「俺の夏休み……終わっちゃった」(KH II) |
| `s02` | 光の中の、ロクサスとソラ (KH II) |
| `s03` | 「繋がる心が、俺の力だ」(KH I) |
| `s04` | ロクサス、還る (KH III) |
| `s05` | 時計塔の、三人 (358/2 Days) |
| `s06` | 光の守護者、集結 (KH III) |

## 置き方(どちらか)

- **そのまま**: `assets/scenes/s01.jpg`(または .png / .webp)を置いて
  `python assets/sync_images.py --apply`
- **加工して**: `assets/_inbox/scenes/s01.jpg` を置いて
  `python assets/style_images.py --apply`(960x540・16:9 に切り抜き＋サイト配色に色寄せ)

画像が無いスロットは、ファイル名を示すプレースホルダーが表示されます。
シーンの見出し・キャプションは `SECRET_SCENES` を直接編集して変更できます。

画像の著作権はスクウェア・エニックス / ディズニーにあります。自分が合法的に用意できるものだけを置いてください。
