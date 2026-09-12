# Quickstart Atlas

The front-end starter for the [Callimacus quickstart](https://docs.callimacus.ai/quickstart/1-load-the-catalogue): a natural-history site, animals and the places they live, built on an empty Callimacus project one step at a time.

Everything you need ships in this repository:

- `data/` — 495 animals, 19 habitats, 493 knowledge documents, an illustration for every record, and `skesis.config.json`, the file that says which properties are searchable.
- `blocks/` — one JSON file per block the guide adds, and `blocks/pinned/` for part 4.
- `config/` — the intent schema, use intent, landing, voice and guardrails for parts 5 and 6.
- `src/` — the real Atlas front end, already wired to your project through `VITE_CALLIMACUS_CLIENT_ID`.

## Load the catalogue

Requires the [Callimacus CLI](https://docs.callimacus.ai/callimacus-cli/2-installation) 3.0 or newer, logged in against your project, on Node 26 or newer.

```bash
callimacus skesis init --dir data     # confirms the committed configuration
callimacus skesis up --dir data       # applies it, uploads the images, submits the records, waits until searchable
callimacus skesis status              # searchable (rev N)
bash data/load-knowledge.sh           # the 493 documents, in chunks the API accepts
```

## Run the front end

```bash
npm install
echo 'VITE_CALLIMACUS_CLIENT_ID=cal-pk-…' > .env   # your project's public Client ID
npm run dev
```

Then follow the guide from [part 3](https://docs.callimacus.ai/quickstart/3-build-the-experience): every block, receptor and agent setting is done in the Callimacus Studio or the CLI, and the page picks it up on the next question. No application code changes are needed.
