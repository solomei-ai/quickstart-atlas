#!/usr/bin/env bash
# Upload the catalogue's illustrations into THIS project, then point the records
# at them.
#
# Media is project-scoped: an asset lives at {project}/media/uploads/{handle},
# so a URL minted by another project resolves nowhere here. Records must
# reference assets this project owns — which is what this script arranges.
#
#     bash upload-images.sh
#
# Re-running is safe: it skips any record whose imageUrl is already a URL.
set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
map="$here/.image-urls.tsv"
: > "$map"

upload_dir() {                      # $1 = animals|habitats
  local kind=$1 count=0
  for f in "$here/images/$kind"/*.webp; do
    [ -e "$f" ] || continue
    local base url out
    base=$(basename "$f" .webp)
    # the CLI prints the durable CDN url; take it from combined output so a
    # transient failure is visible rather than silently empty
    out=$(callimacus document upload "$f" 2>&1) || true
    url=$(printf '%s' "$out" | grep -oE 'https://[^ )"]+/media/uploads/[A-Za-z0-9_-]+' | head -1)
    if [ -n "$url" ]; then
      printf '%s\t%s\t%s\n' "$kind" "$base" "$url" >> "$map"
    else
      echo "  upload failed: $kind/$base — re-run to retry" >&2
    fi
    count=$((count+1))
    [ $((count % 50)) -eq 0 ] && echo "  $kind: $count uploaded"
    sleep 0.3                        # pace it; bursts get throttled
  done
}

echo "Uploading illustrations (this takes a few minutes)…"
upload_dir animals
upload_dir habitats

python3 - "$here" "$map" <<'PY'
import json, os, sys
here, mapfile = sys.argv[1], sys.argv[2]
urls = {}
for line in open(mapfile):
    kind, base, url = line.rstrip('\n').split('\t')
    urls[(kind, base)] = url

for kind, fname in (('animals', 'animals.json'), ('habitats', 'habitats.json')):
    path = os.path.join(here, fname)
    recs = json.load(open(path))
    hit = miss = 0
    for r in recs:
        cur = str(r.get('imageUrl') or '')
        if cur.startswith('http'):          # already uploaded
            continue
        base = os.path.basename(cur).rsplit('.', 1)[0]
        url = urls.get((kind, base))
        if url:
            r['imageUrl'] = url; hit += 1
        else:
            miss += 1
    json.dump(recs, open(path, 'w'), ensure_ascii=False, indent=1)
    print(f"{fname}: {hit} imageUrl set" + (f", {miss} still missing (re-run)" if miss else ""))
PY

echo
echo "Now submit the records:"
echo "  callimacus skesis submit --file animals.json  --kind animal  --locale en --id-field slug"
echo "  callimacus skesis submit --file habitats.json --kind habitat --locale en --id-field slug"
