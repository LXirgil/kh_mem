#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
sync_images.py — assets/ に置いた画像を js/data.js に自動で反映するツール

【できること】
  assets/works/ · assets/characters/ · assets/worlds/ に、決まった名前で
  画像ファイルを置いておくと、このスクリプトが js/data.js を書き換えて
  該当する項目の `image: null` を実際のパスに差し替えます。
  「画像を1件ずつ手作業で data.js に書き込む」手間をなくすためのツールです。

【できないこと・やらないこと】
  キングダムハーツの公式キャラクターイラスト・パッケージ画像・
  スクリーンショットを自動で取得(ダウンロード)することは行いません。
  これらはスクウェア・エニックスおよびディズニーの著作物であり、
  取得・複製すること自体がこのプロジェクトの方針(CLAUDE.md/企画書)に反するためです。
  画像そのものは、あなた自身が合法的に用意したもの
  (自分で購入したソフトを自分で撮影した写真、自作イラストなど)を
  assets/ に置いてください。このスクリプトはその「配線」だけを自動化します。

【使い方】
  1. まず期待されるファイル名の一覧を確認する(画像はまだ無くてOK):
       python assets/sync_images.py --list

  2. 画像ファイルを、表示された名前で assets/works・characters・worlds に置く
     (拡張子は .jpg / .jpeg / .png / .webp のいずれか)

  3. 反映される内容を確認する(まだ data.js は書き換えない):
       python assets/sync_images.py

  4. 内容を確認して問題なければ、実際に data.js を書き換える:
       python assets/sync_images.py --apply
     (書き換え前の内容は js/data.js.bak に自動でバックアップされます)
"""

import argparse
import os
import re
import shutil
import sys
import unicodedata

# Windows のコンソール(cp932)でも文字化け・クラッシュしないよう、標準出力を UTF-8 にする
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_JS = os.path.join(ROOT, "js", "data.js")
IMAGE_EXTS = (".jpg", ".jpeg", ".png", ".webp")

# 各カテゴリの、data.js 側の配列名 / assets 側のフォルダ名 / 識別に使うフィールド
CATEGORIES = [
    {"array": "WORKS",               "folder": "works",      "key_field": "id"},
    {"array": "WORLDS",              "folder": "worlds",     "key_field": "en"},
    {"array": "CHARACTERS",          "folder": "characters", "key_field": "en"},
    {"array": "SECRET_SCENES",       "folder": "scenes",     "key_field": "id"},
    {"array": "ROXAS_SHOTS",         "folder": "roxas",      "key_field": "id"},
    {"array": "CROSSOVER_SCENES",     "folder": "crossover", "key_field": "id"},
]


def slugify(text):
    """英語名をファイル名向けのスラッグに変換する(例: "THE WORLD THAT NEVER WAS" -> "the-world-that-never-was")"""
    # アクセント記号を落とす(例: NAMINÉ -> NAMINE)
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text


def find_matching_array(src, array_name):
    """`const ARRAY_NAME = [ ... ];` の中身の開始・終了位置(中身の [ の直後 と対応する ] )を返す"""
    m = re.search(r"const\s+" + re.escape(array_name) + r"\s*=\s*\[", src)
    if not m:
        raise ValueError(f"{array_name} が js/data.js 内に見つかりませんでした")
    depth = 1
    i = m.end()  # 最初の '[' の直後
    start = i
    while depth > 0:
        if src[i] == "[":
            depth += 1
        elif src[i] == "]":
            depth -= 1
        i += 1
    end = i - 1  # 対応する ']' の位置
    return start, end


def split_top_level_objects(body):
    """配列の中身の文字列から、トップレベルの { ... } オブジェクトごとの (start, end) を列挙する"""
    objects = []
    depth = 0
    start = None
    for i, ch in enumerate(body):
        if ch == "{":
            if depth == 0:
                start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and start is not None:
                objects.append((start, i + 1))
                start = None
    return objects


def find_assets_dir_image(folder, slug):
    """assets/<folder>/ の中から、指定スラッグに一致する画像ファイルを探す(拡張子は問わない)"""
    d = os.path.join(ROOT, "assets", folder)
    if not os.path.isdir(d):
        return None
    for fn in sorted(os.listdir(d)):
        name, ext = os.path.splitext(fn)
        if name.lower() == slug and ext.lower() in IMAGE_EXTS:
            return fn
    return None


def process(apply_changes, list_only):
    with open(DATA_JS, encoding="utf-8") as f:
        src = f.read()

    report_matched = []      # (category, name, filename) 実際に反映した/反映できるもの
    report_already = []      # 既に同じ画像が設定済みだったもの
    report_missing = []      # 画像ファイルが見つからなかったもの(期待ファイル名を表示)

    # 後ろから置換すると、前方のオフセットが崩れないので都合が良い
    edits = []  # (abs_start, abs_end, new_text)

    for cat in CATEGORIES:
        arr_start, arr_end = find_matching_array(src, cat["array"])
        body = src[arr_start:arr_end]

        for obj_start, obj_end in split_top_level_objects(body):
            obj_text = body[obj_start:obj_end]

            key_m = re.search(cat["key_field"] + r'\s*:\s*"([^"]*)"', obj_text)
            if not key_m:
                continue
            key_value = key_m.group(1)
            slug = key_value if cat["key_field"] == "id" else slugify(key_value)

            found_fn = find_assets_dir_image(cat["folder"], slug)
            expected = f"assets/{cat['folder']}/{slug}.(jpg|png|webp)"

            if list_only:
                report_missing.append((cat["array"], key_value, expected, found_fn))
                continue

            image_m = re.search(r'image\s*:\s*(null|"[^"]*")', obj_text)
            if not image_m:
                continue  # image フィールドを持たない項目(用語集など)はスキップ

            current_value = image_m.group(1)

            if not found_fn:
                if current_value == "null":
                    report_missing.append((cat["array"], key_value, expected, None))
                continue

            new_path = f"assets/{cat['folder']}/{found_fn}"
            new_value = f'"{new_path}"'

            if current_value == new_value:
                report_already.append((cat["array"], key_value, new_path))
                continue

            # obj_text 内での image フィールドの絶対位置に置換範囲を変換する
            abs_start = arr_start + obj_start + image_m.start(1)
            abs_end = arr_start + obj_start + image_m.end(1)
            edits.append((abs_start, abs_end, new_value))
            report_matched.append((cat["array"], key_value, new_path))

    if list_only:
        print("=== assets/ に置くべきファイル名の一覧 ===\n")
        for array_name, key_value, expected, found_fn in report_missing:
            mark = "済" if found_fn else "  "
            print(f"[{mark}] {array_name:<10} {key_value:<28} -> {expected}")
        print(f"\n合計 {len(report_missing)} 件([済] は既に画像ファイルが見つかっているもの)")
        return

    print("=== 反映される画像 ===")
    if report_matched:
        for array_name, key_value, path in report_matched:
            print(f"  {array_name:<10} {key_value:<28} -> {path}")
    else:
        print("  (なし)")

    print("\n=== 既に反映済み ===")
    if report_already:
        for array_name, key_value, path in report_already:
            print(f"  {array_name:<10} {key_value:<28} -> {path}")
    else:
        print("  (なし)")

    print("\n=== 画像が見つからなかった項目(assets/ に用意すると反映されます) ===")
    if report_missing:
        for array_name, key_value, expected, _ in report_missing:
            print(f"  {array_name:<10} {key_value:<28} 期待するファイル名: {expected}")
    else:
        print("  (なし。すべて反映済みです)")

    if not apply_changes:
        print("\n※ これはドライラン(確認のみ)です。実際に js/data.js を書き換えるには")
        print("   python assets/sync_images.py --apply を実行してください。")
        return

    if not edits:
        print("\n変更点はありませんでした。js/data.js は書き換えていません。")
        return

    # バックアップを作成してから書き換える
    backup_path = DATA_JS + ".bak"
    shutil.copyfile(DATA_JS, backup_path)

    new_src = src
    for abs_start, abs_end, new_value in sorted(edits, key=lambda e: e[0], reverse=True):
        new_src = new_src[:abs_start] + new_value + new_src[abs_end:]

    with open(DATA_JS, "w", encoding="utf-8") as f:
        f.write(new_src)

    print(f"\n{len(edits)} 件を js/data.js に反映しました。")
    print(f"変更前の内容は {os.path.relpath(backup_path, ROOT)} に保存されています。")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--apply", action="store_true", help="実際に js/data.js を書き換える(指定しない場合は確認のみ)")
    parser.add_argument("--list", action="store_true", help="assets/ に置くべきファイル名の一覧だけを表示する")
    args = parser.parse_args()

    if not os.path.isfile(DATA_JS):
        print(f"js/data.js が見つかりません: {DATA_JS}", file=sys.stderr)
        sys.exit(1)

    process(apply_changes=args.apply, list_only=args.list)


if __name__ == "__main__":
    main()
