#!/usr/bin/env python3
"""Download all haatfurniture.com product images locally and update DB URLs."""
import json, os, sys, urllib.request, urllib.error, hashlib, time, subprocess

UPLOAD_DIR = "/home/barabd/haat-furniture-v2/frontend/storage/uploads"
BACKEND = "/home/barabd/haat-furniture-v2/backend"
PHP = f"{BACKEND}/bin/php-with-mysql"
LOCAL_PREFIX = "/uploads/"

os.makedirs(UPLOAD_DIR, exist_ok=True)

raw = subprocess.check_output([
    PHP, "artisan", "tinker", "--execute",
    r"""
$rows = [];
App\Models\Product::all()->each(function($p) use (&$rows) {
    $rows[] = ['id' => $p->id, 'image' => $p->image, 'gallery' => $p->gallery ?? []];
});
echo json_encode($rows);
"""
], cwd=BACKEND, stderr=subprocess.DEVNULL).decode()

products = json.loads(raw)
print(f"Products: {len(products)}")

url_map = {}
failed = []

def download(url):
    if url in url_map:
        return url_map[url]
    basename = url.rsplit("/", 1)[-1]
    name, ext = os.path.splitext(basename)
    local_name = f"{name}{ext}"
    local_path = os.path.join(UPLOAD_DIR, local_name)

    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        url_map[url] = LOCAL_PREFIX + local_name
        return url_map[url]

    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
            with open(local_path, "wb") as f:
                f.write(data)
            url_map[url] = LOCAL_PREFIX + local_name
            return url_map[url]
        except Exception as e:
            if attempt == 2:
                failed.append((url, str(e)))
                url_map[url] = url  # keep original
                return url
            time.sleep(1)

total = 0
for p in products:
    changed = False
    new_image = p["image"]
    if p["image"] and "haatfurniture.com" in p["image"]:
        new_image = download(p["image"])
        if new_image != p["image"]:
            changed = True

    new_gallery = []
    for g in p["gallery"]:
        if "haatfurniture.com" in g:
            ng = download(g)
            new_gallery.append(ng)
            if ng != g:
                changed = True
        else:
            new_gallery.append(g)

    if changed:
        total += 1
        gallery_json = json.dumps(new_gallery).replace("'", "\\'")
        img_escaped = new_image.replace("'", "\\'")
        cmd = f"App\\Models\\Product::find({p['id']})->update(['image'=>'{img_escaped}','gallery'=>json_decode('{gallery_json}',true)]);"
        subprocess.run([PHP, "artisan", "tinker", "--execute", cmd],
                       cwd=BACKEND, capture_output=True)
    sys.stdout.write(f"\r  Downloaded: {len(url_map)} / Updated products: {total}")
    sys.stdout.flush()

print(f"\nDone. {len(url_map)} images mapped, {total} products updated, {len(failed)} failed.")
if failed:
    for u, e in failed[:10]:
        print(f"  FAIL: {u} — {e}")
