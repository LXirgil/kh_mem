#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
trim_black.py — 画像の外周の黒枠(レターボックス/ピラーボックス)を削って、
                シーン部分だけを残す。

ファイル名・パスは変えないので、data.js の再配線は不要。
元画像は <dir>/_original/ にバックアップしてから上書きする。

使い方(作業フォルダから):
  python assets/trim_black.py                 # assets/roxas を確認(ドライラン)
  python assets/trim_black.py --apply         # 実際に切り詰める
  python assets/trim_black.py --dir assets/scenes --apply
  python assets/trim_black.py --threshold 40  # 黒と見なす明るさの上限(既定 32)
"""

import argparse
import os
import shutil
import sys

for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

try:
    from PIL import Image
except ImportError:
    print("Pillow が必要です。  pip install Pillow", file=sys.stderr)
    sys.exit(1)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_EXTS = (".jpg", ".jpeg", ".png", ".webp")


def content_box(im, thr):
    """全体が「暗い」行・列を外周から削った、中身の (left, top, right, bottom) を返す"""
    rgb = im.convert("RGB")
    w, h = rgb.size
    px = rgb.load()
    xs = range(0, w, max(1, w // 160))
    ys = range(0, h, max(1, h // 160))

    def row_dark(y):
        return max(max(px[x, y]) for x in xs) <= thr

    def col_dark(x):
        return max(max(px[x, y]) for y in ys) <= thr

    top = 0
    while top < h - 1 and row_dark(top):
        top += 1
    bottom = h - 1
    while bottom > top and row_dark(bottom):
        bottom -= 1
    left = 0
    while left < w - 1 and col_dark(left):
        left += 1
    right = w - 1
    while right > left and col_dark(right):
        right -= 1
    return left, top, right + 1, bottom + 1


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dir", default="assets/roxas", help="対象フォルダ(既定 assets/roxas)")
    ap.add_argument("--threshold", type=int, default=32, help="黒と見なす明るさの上限 0-255(既定 32)")
    ap.add_argument("--apply", action="store_true", help="実際に上書きする(既定は確認のみ)")
    args = ap.parse_args()

    folder = os.path.join(ROOT, args.dir) if not os.path.isabs(args.dir) else args.dir
    if not os.path.isdir(folder):
        print(f"フォルダが見つかりません: {folder}", file=sys.stderr)
        sys.exit(1)

    backup = os.path.join(folder, "_original")
    targets = [
        f for f in sorted(os.listdir(folder))
        if os.path.splitext(f)[1].lower() in IMG_EXTS
    ]
    if not targets:
        print("画像がありません。")
        return

    changed = 0
    for name in targets:
        path = os.path.join(folder, name)
        im = Image.open(path)
        w, h = im.size
        l, t, r, b = content_box(im, args.threshold)
        cw, ch = r - l, b - t
        # ほぼ変化なし(数px)や、検出が破綻して極端に小さい場合はスキップ
        if (l, t, r, b) == (0, 0, w, h) or cw < w * 0.4 or ch < h * 0.4:
            print(f"  {name:14} {w}x{h}  枠なし(スキップ)")
            continue

        print(f"  {name:14} {w}x{h} -> {cw}x{ch}   削り T{t} B{h - b} L{l} R{w - r}")
        changed += 1
        if not args.apply:
            continue

        os.makedirs(backup, exist_ok=True)
        if not os.path.exists(os.path.join(backup, name)):
            shutil.copy2(path, os.path.join(backup, name))

        out = im.crop((l, t, r, b))
        ext = os.path.splitext(name)[1].lower()
        if ext in (".jpg", ".jpeg"):
            out.convert("RGB").save(path, "JPEG", quality=88, optimize=True, progressive=True)
        elif ext == ".webp":
            out.save(path, "WEBP", quality=90, method=6)
        else:
            out.save(path, "PNG", optimize=True)

    if not args.apply:
        print(f"\n※ 確認のみ。{changed} 枚に黒枠あり。実行するには --apply を付けてください。")
    else:
        print(f"\n{changed} 枚を切り詰めました。元画像は {os.path.relpath(backup, ROOT)} にあります。")


if __name__ == "__main__":
    main()
