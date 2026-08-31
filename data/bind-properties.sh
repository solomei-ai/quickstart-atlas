#!/usr/bin/env bash
# Bind the searchable properties for the Quickstart Atlas catalogue.
#
# Skesis stores your payload verbatim but indexes nothing until you say what is
# searchable. Two objects do that: a SEMANTIC declares a property and what it is
# allowed to do; a MAPPING binds that semantic to a payload path, per kind.
#
# Run this once, after `skesis submit`, from any directory:
#     bash bind-properties.sh
#
# It is idempotent — re-running it is safe.
set -euo pipefail

tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT

# --- the three property shapes this catalogue needs -------------------------
# `embeddable` feeds the vector index (at least one property MUST have it, or
# search returns nothing); `filterable` powers --filter; `sortable` allows
# ordering; `displayable` returns the value to your renderer.
cat > "$tmp/text.json" <<'EOF'
{ "usage": { "embeddable": true, "displayable": true },
  "definition": { "shape": { "kind": "string" } } }
EOF

cat > "$tmp/enum.json" <<'EOF'
{ "usage": { "filterable": true, "displayable": true },
  "definition": { "shape": { "kind": "string" },
    "capabilities": { "enum": { "mode": "open", "allowsExclusion": false } } } }
EOF

cat > "$tmp/number.json" <<'EOF'
{ "usage": { "filterable": true, "sortable": true, "displayable": true },
  "definition": { "shape": { "kind": "number" } } }
EOF

# --- declare the semantics --------------------------------------------------
declare_semantics() {
  for p in name description canopy climate rainfall drySeason; do
    callimacus skesis semantic set "$p" "$tmp/text.json"
  done
  for p in type status habitats habitat category features; do
    callimacus skesis semantic set "$p" "$tmp/enum.json"
  done
  for p in size.minHeightCm size.maxHeightCm weight.minWeightG weight.maxWeightG; do
    callimacus skesis semantic set "$p" "$tmp/number.json"
  done
}

# --- bind each property to its payload path, per kind ----------------------
# Writes are guarded by the mapping revision, and it increments on every write,
# so re-read it before each bind rather than tracking it by hand. --if-match
# takes the NUMBER from the JSON body, not the ETag string the CLI also prints.
bind_kind() {
  local kind=$1; shift
  for p in "$@"; do
    local rev
    rev=$(callimacus skesis mapping show --kind "$kind" \
          | tail -n +2 \
          | python3 -c 'import json,sys; print(json.load(sys.stdin)["rev"])')
    callimacus skesis mapping bind "$p" --kind "$kind" --from "$p" --if-match "$rev"
  done
}

declare_semantics

bind_kind animal name description type status habitats features \
          size.minHeightCm size.maxHeightCm weight.minWeightG weight.maxWeightG

bind_kind habitat name description habitat category features \
          canopy climate rainfall drySeason

# --- re-derive and re-index -------------------------------------------------
# Binding changes what the engine derives, so records already submitted are
# still on their old derivation. Without backfill a newly bound property shows
# up in `capabilities` but filters against nothing.
callimacus skesis backfill
callimacus skesis sweep --watch

echo
echo "Done. Confirm with:"
echo "  callimacus skesis semantic list        # something must be embeddable"
echo "  callimacus skesis capabilities         # the live queryable surface"
