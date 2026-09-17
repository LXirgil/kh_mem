# roxas — MEMORY OF SUMMER のロクサス写真スライドショー用

`js/data.js` の `ROXAS_SHOTS` に対応。id と同じ名前で画像を置きます。

`r01` 〜 `r06`(コマ数を増減したいときは `ROXAS_SHOTS` の配列を編集)

## 置き方(どちらか)

- そのまま: `assets/roxas/r01.jpg`(.png / .webp 可)を置いて
  `python assets/sync_images.py --apply`
- 加工して: `assets/_inbox/roxas/r01.jpg` を置いて
  `python assets/style_images.py --apply`(960x540・16:9 に切り抜き＋サイト配色に色寄せ)

画像が無いコマはファイル名のプレースホルダーを表示。
各コマの説明文は `ROXAS_SHOTS` の `caption` に書くと画像の下に出ます(任意)。

公式画像の著作権はスクウェア・エニックス / ディズニーにあります。自分が合法的に用意できるものだけを置いてください。
