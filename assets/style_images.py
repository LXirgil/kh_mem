#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
style_images.py — 画像を「置くだけ」でこのサイトに馴染ませて配線するツール

【毎回やっていた手間】
  1. 画像を探す  2. 正しい名前にリネームする  3. 比率を枠に合わせて切る
  4. 色をサイトの雰囲気に寄せる  5. js/data.js に配線する
  → このうち 2〜5 を 1 コマンドで済ませます(1 の「画像を用意する」だけは
    著作権の都合であなたが行ってください。理由は assets/README.md 参照)。

【使い方】
  1. 加工したい画像を assets/_inbox/ に放り込む。
     ファイル名はゆるくてOK(例 "Sora.png" / "KH1 boxart.jpg" / "destiny islands.webp")。
     どの枠に入れたいかは名前から自動判定します。名前がぶれて判定できない時は
       assets/_inbox/works/ · assets/_inbox/worlds/ · assets/_inbox/characters/
     のいずれかに入れると、その種類として扱います。

  2. まず何がどうなるか確認(まだ書き込まない):
       python assets/style_images.py

  3. 問題なければ実行:
       python assets/style_images.py --apply
     - 加工した画像を assets/works|worlds|characters/ に <スラッグ>.jpg(png) で保存
     - 続けて sync_images.py で js/data.js に配線(js/data.js.bak を自動バックアップ)
     - 元画像は assets/_inbox/_done/ に移動(消しません)

【オプション】
  --apply         実際に保存・配線する(付けなければ確認のみ)
  --strength 0.5  サイト色に寄せる強さ(0=無加工 〜 1=真っ青。既定は種類ごと)
  --no-grade      切り抜き・リサイズだけ行い、色は変えない
  --no-wire       画像の書き出しだけ行い、data.js への配線はしない
  --keep          元画像を _done/ に移動しない
"""

import argparse
import os
import re
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from PIL import Image, ImageOps, ImageEnhance
except ImportError:
    print("Pillow が必要です。  pip install Pillow  を実行してください。", file=sys.stderr)
    sys.exit(1)

import sync_images
from sync_images import slugify, find_matching_array, split_top_level_objects, ROOT, DATA_JS

INBOX = os.path.join(ROOT, "assets", "_inbox")
DONE = os.path.join(INBOX, "_done")
SRC_EXTS = (".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff")

# 種類ごとの: data.js の配列名 / 保存先フォルダ / 識別フィールド /
#             書き出しサイズ(枠の比率)/ サイト色に寄せる既定の強さ
CATS = [
    {"array": "WORKS",         "folder": "works",      "key_field": "id", "size": (900, 562),  "strength": 0.55},
    {"array": "WORLDS",        "folder": "worlds",     "key_field": "en", "size": (1024, 576), "strength": 0.58},
    {"array": "CHARACTERS",    "folder": "characters", "key_field": "en", "size": (640, 640),  "strength": 0.42},
    {"array": "SECRET_SCENES", "folder": "scenes",     "key_field": "id", "size": (960, 540),  "strength": 0.5},
    {"array": "ROXAS_SHOTS",   "folder": "roxas",      "key_field": "id", "size": (960, 540),  "strength": 0.42},
    {"array": "CROSSOVER_SCENES",     "folder": "crossover", "key_field": "id", "size": (960, 540), "strength": 0.42},
]

# このサイトのカラートークン(css/base.css の :root より)
SHADOW = (9, 18, 40)      # --c-night 寄りの暗部
MIDTONE = (38, 96, 165)   # --c-blue-dim 寄りの中間
HIGHLIGHT = (238, 244, 255)  # --c-white 寄りの明部
VOID = (3, 6, 13)         # --c-void(周辺減光の色)


# ------------------------------------------------------------
# 色加工
# ------------------------------------------------------------
def _lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def _duotone_luts(shadow, mid, high, mid_pos=0.5):
    """輝度 0..255 を shadow→mid→high のグラデーションに写す 3 本の LUT"""
    lut_r, lut_g, lut_b = [], [], []
    for i in range(256):
        t = i / 255
        if t <= mid_pos:
            col = _lerp(shadow, mid, t / mid_pos if mid_pos else 0.0)
        else:
            col = _lerp(mid, high, (t - mid_pos) / (1 - mid_pos))
        lut_r.append(col[0])
        lut_g.append(col[1])
        lut_b.append(col[2])
    return lut_r, lut_g, lut_b


_LUT_R, _LUT_G, _LUT_B = _duotone_luts(SHADOW, MIDTONE, HIGHLIGHT)


def grade(rgb, strength):
    """RGB 画像をサイトの青系トーンに寄せる。strength=0 で無変化、1 で完全なデュオトーン"""
    gray = ImageOps.grayscale(rgb)
    gray = ImageOps.autocontrast(gray, cutoff=1)
    duo = Image.merge("RGB", (gray.point(_LUT_R), gray.point(_LUT_G), gray.point(_LUT_B)))
    out = Image.blend(rgb, duo, max(0.0, min(1.0, strength)))
    # 寄せた後に軽く整える(彩度を少し落として発色を上品に、コントラストを少し立てる)
    out = ImageEnhance.Color(out).enhance(0.90)
    out = ImageEnhance.Contrast(out).enhance(1.07)
    out = ImageEnhance.Brightness(out).enhance(0.97)
    return out


def vignette(rgb, amount=0.30):
    """四隅を --c-void へ落として、パネルに沈むような見た目にする"""
    grad = Image.radial_gradient("L").resize(rgb.size)  # 中心 0 → 隅 255
    mask = grad.point(lambda v: round(255 - v * amount))
    return Image.composite(rgb, Image.new("RGB", rgb.size, VOID), mask)


def crop_to(im, tw, th):
    """中央基準で目標比率に切り抜き、目標サイズへリサイズ"""
    target = tw / th
    w, h = im.size
    if w / h > target:
        nw = round(h * target)
        x = (w - nw) // 2
        im = im.crop((x, 0, x + nw, h))
    else:
        nh = round(w / target)
        y = (h - nh) // 2
        im = im.crop((0, y, w, y + nh))
    return im.resize((tw, th), Image.LANCZOS)


def fit_to(im, tw, th, margin=0.94):
    """切り抜かず、全体が収まるように縮小して中央へ。余白は透過。
       縦長のキャラ立ち絵などで頭や足が見切れるのを防ぐ"""
    base = im.convert("RGBA")
    inner = ImageOps.contain(base, (round(tw * margin), round(th * margin)), Image.LANCZOS)
    canvas = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    canvas.paste(inner, ((tw - inner.width) // 2, (th - inner.height) // 2), inner)
    return canvas


def process_one(path, cat, strength, do_grade, fit=False):
    im = ImageOps.exif_transpose(Image.open(path))
    has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)

    if fit:
        im = fit_to(im, *cat["size"])
        rgb = im.convert("RGB")
        alpha = im.getchannel("A")
        if do_grade:
            rgb = grade(rgb, strength)
        rgb.putalpha(alpha)
        return rgb, ".png"

    im = im.convert("RGBA" if has_alpha else "RGB")
    im = crop_to(im, *cat["size"])

    if has_alpha:
        rgb = im.convert("RGB")
        alpha = im.getchannel("A")
    else:
        rgb = im
        alpha = None

    if do_grade:
        rgb = grade(rgb, strength)
        if not has_alpha:
            rgb = vignette(rgb)

    if has_alpha:
        rgb.putalpha(alpha)
        return rgb, ".png"
    return rgb, ".jpg"


# ------------------------------------------------------------
# 名前 → 種類/スラッグ の判定
# ------------------------------------------------------------
def known_targets():
    """data.js を読み、{スラッグ: cat} の対応表を作る"""
    with open(DATA_JS, encoding="utf-8") as f:
        src = f.read()
    table = {}
    for cat in CATS:
        a, b = find_matching_array(src, cat["array"])
        body = src[a:b]
        for s, e in split_top_level_objects(body):
            t = body[s:e]
            m = re.search(cat["key_field"] + r'\s*:\s*"([^"]*)"', t)
            if not m:
                continue
            kv = m.group(1)
            slug = kv if cat["key_field"] == "id" else slugify(kv)
            table.setdefault(slug, cat)
    return table


def iter_inbox():
    """(ファイルパス, 種類ヒント or None) を列挙"""
    if not os.path.isdir(INBOX):
        return
    for entry in sorted(os.listdir(INBOX)):
        full = os.path.join(INBOX, entry)
        if entry.startswith("_"):
            continue
        if os.path.isfile(full) and os.path.splitext(entry)[1].lower() in SRC_EXTS:
            yield full, None
        elif os.path.isdir(full) and entry.lower() in {c["folder"] for c in CATS}:
            hint = entry.lower()
            for sub in sorted(os.listdir(full)):
                p = os.path.join(full, sub)
                if os.path.isfile(p) and os.path.splitext(sub)[1].lower() in SRC_EXTS:
                    yield p, hint


def resolve(path, hint, table):
    """このファイルの (cat, slug) を決める。決まらなければ (None, 説明)"""
    base = os.path.splitext(os.path.basename(path))[0]
    slug = slugify(base)
    if not slug:
        return None, "ファイル名から名前を作れませんでした"

    if hint:
        cat = next(c for c in CATS if c["folder"] == hint)
        if slug in table and table[slug]["folder"] != hint:
            return None, f"名前『{slug}』は {table[slug]['folder']} の項目です({hint}/ から出してください)"
        if slug not in table:
            return None, f"{hint} に『{slug}』という項目が data.js にありません"
        return cat, slug

    if slug in table:
        return table[slug], slug

    # 部分一致で救済(例 "kh1-boxart" → "kh1")
    hits = [k for k in table if k and (slug.startswith(k + "-") or slug.endswith("-" + k) or ("-" + k + "-") in slug)]
    if len(hits) == 1:
        return table[hits[0]], hits[0]
    return None, f"『{slug}』に一致する作品/ワールド/キャラが特定できません"


# ------------------------------------------------------------
# メイン
# ------------------------------------------------------------
def run(apply_changes, strength_override, do_grade, do_wire, keep, fit):
    if not os.path.isdir(INBOX):
        os.makedirs(INBOX, exist_ok=True)
        print(f"assets/_inbox/ を作りました。ここに画像を入れてから、もう一度実行してください。")
        return

    table = known_targets()
    jobs = []
    skips = []
    for path, hint in iter_inbox():
        cat, info = resolve(path, hint, table)
        if cat is None:
            skips.append((path, info))
            continue
        slug = info
        strength = strength_override if strength_override is not None else cat["strength"]
        jobs.append((path, cat, slug, strength))

    rel = lambda p: os.path.relpath(p, ROOT).replace(os.sep, "/")

    print("=== 加工して配置する画像 ===")
    if jobs:
        for path, cat, slug, strength in jobs:
            tag = "無加工" if not do_grade else f"色寄せ {strength:.2f}"
            mode = "全体を収める" if fit else "中央切り抜き"
            print(f"  {rel(path):<40} -> assets/{cat['folder']}/{slug}.(jpg/png)   [{cat['size'][0]}x{cat['size'][1]}, {mode}, {tag}]")
    else:
        print("  (なし)")

    if skips:
        print("\n=== 判定できずスキップ ===")
        for path, why in skips:
            print(f"  {rel(path):<40} … {why}")
        print("  ※ ファイル名を作品IDやワールド英名に近づけるか、_inbox/works などのサブフォルダに入れてください。")
        print("     置くべき名前の一覧:  python assets/sync_images.py --list")

    if not jobs:
        return

    if not apply_changes:
        print("\n※ これは確認のみです。実際に処理するには --apply を付けてください。")
        return

    os.makedirs(DONE, exist_ok=True)
    written = 0
    for path, cat, slug, strength in jobs:
        img, ext = process_one(path, cat, strength, do_grade, fit)
        folder = os.path.join(ROOT, "assets", cat["folder"])
        os.makedirs(folder, exist_ok=True)
        # 同じスラッグの旧ファイル(別拡張子含む)を片付ける
        for old in os.listdir(folder):
            on, oe = os.path.splitext(old)
            if on.lower() == slug and oe.lower() in sync_images.IMAGE_EXTS:
                os.remove(os.path.join(folder, old))
        dest = os.path.join(folder, slug + ext)
        if ext == ".jpg":
            img.save(dest, "JPEG", quality=82, optimize=True, progressive=True)
        else:
            img.save(dest, "PNG", optimize=True)
        written += 1
        print(f"  書き出し: {rel(dest)}")
        if not keep:
            shutil.move(path, os.path.join(DONE, os.path.basename(path)))

    print(f"\n{written} 枚を書き出しました。")

    if do_wire:
        print("\n--- js/data.js へ配線(sync_images.py) ---")
        sync_images.process(apply_changes=True, list_only=False)
    else:
        print("配線は行っていません。python assets/sync_images.py --apply で反映できます。")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--apply", action="store_true", help="実際に保存・配線する(既定は確認のみ)")
    p.add_argument("--strength", type=float, default=None, help="サイト色に寄せる強さ 0〜1(既定は種類ごと)")
    p.add_argument("--no-grade", action="store_true", help="色を変えず、切り抜き・リサイズのみ")
    p.add_argument("--no-wire", action="store_true", help="data.js への配線をしない")
    p.add_argument("--keep", action="store_true", help="元画像を _inbox/_done/ に移動しない")
    p.add_argument("--fit", action="store_true",
                   help="切り抜かず全体を枠に収める(縦長の立ち絵で頭・足が見切れる時に使う。余白は透過)")
    args = p.parse_args()

    if not os.path.isfile(DATA_JS):
        print(f"js/data.js が見つかりません: {DATA_JS}", file=sys.stderr)
        sys.exit(1)

    run(
        apply_changes=args.apply,
        strength_override=args.strength,
        do_grade=not args.no_grade,
        do_wire=not args.no_wire,
        keep=args.keep,
        fit=args.fit,
    )


if __name__ == "__main__":
    main()
