# _inbox — 画像を「置くだけ」の場所

ここに画像を放り込んで、プロジェクトフォルダで次を実行するだけです。

```
python assets/style_images.py          # まず確認(何も書き換えない)
python assets/style_images.py --apply  # 実行:加工して配置し、data.js に配線
```

`--apply` で起きること:

1. 画像を枠の比率に中央切り抜き＋リサイズ
   - 作品(WORKS) … 900×562(16:10)
   - ワールド(WORLDS) … 1024×576(16:9。表示自体は4:3枠に全体を収める`contain`なので、
     この比率のまま置いても上下左右に少し余白が出るだけで問題ありません)
   - キャラクター(CHARACTERS) … 640×640(正円表示。透過PNGはそのまま透過を保持)
   - SECRET下部の場面(SECRET_SCENES)/ ロクサスのスライドショー(ROXAS_SHOTS)/
     CROSSOVER下部の名場面(CROSSOVER_SCENES) … いずれも 960×540(16:9)
2. サイトの配色(ダークネイビー〜ブルー、css/base.css の :root)に色を寄せる
3. `assets/<フォルダ>/<スラッグ>.jpg`(透過は .png)で保存
   (フォルダは works / worlds / characters / scenes / roxas / crossover)
4. `js/data.js` に配線(`js/data.js.bak` を自動バックアップ)
5. 元画像は `assets/_inbox/_done/` に移動(消しません)

## ファイル名のつけ方

名前から「どの項目か」を自動判定します。ゆるくてOK:

- `Sora.png` / `sora.jpg` → キャラクターのソラ
- `KH1.png` / `kh1-boxart.jpg` → 作品 KINGDOM HEARTS
- `destiny islands.webp` → ワールド DESTINY ISLANDS
- `s01.jpg` → SECRET場面 / `r01.jpg` → ロクサス写真 / `cs01.jpg` → CROSSOVER場面
  (これら id 形式のものは、そのままでは判定できないため下記の種類フォルダに入れてください)

判定できないと言われたら:

- 正しい名前の一覧を見る … `python assets/sync_images.py --list`
- または種類フォルダに入れて明示する …
  `_inbox/works/` `_inbox/worlds/` `_inbox/characters/`
  `_inbox/scenes/` `_inbox/roxas/` `_inbox/crossover/`

## よく使うオプション

| 付けるもの | 効果 |
| --- | --- |
| `--strength 0.3` | 色を寄せる強さを手動指定(0=無加工 〜 1=真っ青) |
| `--no-grade` | 色は変えず、切り抜き・リサイズだけ |
| `--no-wire` | 画像の書き出しだけ(data.js は触らない) |
| `--keep` | 元画像を `_done/` に移動しない |

## 注意

公式画像(キャラ絵・パッケージ・スクショ)の著作権はスクウェア・エニックス／
ディズニーにあります。**自分が合法的に用意できる画像だけ**をここに置いてください
(詳しくは `assets/README.md`)。このツールは色を変えるだけで、権利関係は変わりません。
