#!/usr/bin/env bash
# Load the catalogue's knowledge base into THIS project.
#
#     bash load-knowledge.sh
#
# Two things this works around:
#   * `callimacus document create` sends the whole file in one request, and the
#     endpoint answers 500 on a body as large as all 493 documents (~2.5 MB).
#     So it goes in chunks.
#   * the endpoint also fails intermittently on a chunk that succeeds on retry,
#     so each chunk is retried before giving up.
#
# Safe to re-run: documents already present (matched by name) are skipped, so an
# interrupted load resumes where it stopped.
set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
src="$here/knowledge.json"
chunk=${CHUNK:-100}
tries=${TRIES:-4}

tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT

# What is already loaded, so a re-run resumes instead of duplicating. This must
# succeed: treating a failed lookup as "nothing present" would re-submit every
# document and duplicate the whole catalogue, so fail before creating anything.
if ! callimacus document list > "$tmp/existing.json" 2>"$tmp/list.err"; then
  echo "Could not read the project's existing documents — refusing to load," >&2
  echo "because re-submitting would duplicate anything already there." >&2
  sed 's/^/  /' "$tmp/list.err" >&2
  exit 1
fi
if ! python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$tmp/existing.json" 2>/dev/null; then
  echo "Unexpected response from \`callimacus document list\` — refusing to load." >&2
  exit 1
fi

python3 - "$src" "$tmp" "$chunk" <<'PY'
import json, sys, os
src, out, chunk = sys.argv[1], sys.argv[2], int(sys.argv[3])
docs = json.load(open(src))
have = {d.get('name') for d in json.load(open(os.path.join(out, 'existing.json')))}
todo = [d for d in docs if d.get('name') not in have]
for i in range(0, len(todo), chunk):
    with open(os.path.join(out, 'part-%04d.json' % (i // chunk)), 'w') as fh:
        json.dump(todo[i:i+chunk], fh, ensure_ascii=False)
print("%d total, %d already present, %d to load" % (len(docs), len(have & {d['name'] for d in docs}), len(todo)))
PY

shopt -s nullglob
parts=("$tmp"/part-*.json)
if [ ${#parts[@]} -eq 0 ]; then echo "Nothing to do."; exit 0; fi

ok=0
for f in "${parts[@]}"; do
  n=$(python3 -c "import json;print(len(json.load(open('$f'))))")
  attempt=1
  until callimacus document create --file "$f" >/dev/null 2>&1; do
    if [ "$attempt" -ge "$tries" ]; then
      echo "  $(basename "$f"): failed ${tries}x — re-run to resume, or lower the chunk: CHUNK=50 bash load-knowledge.sh" >&2
      exit 1
    fi
    echo "  $(basename "$f"): attempt ${attempt} failed, retrying" >&2
    attempt=$((attempt+1))
    sleep $((attempt * 3))
  done
  ok=$((ok+n)); echo "  ${ok} loaded"
done

echo "Done. ${ok} document(s) loaded this run."
