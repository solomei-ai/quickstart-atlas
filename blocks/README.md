# Blocks

One file per block the Quickstart adds, in the order the guide adds them.
Save one with `callimacus block save --file blocks/<name>.json`; every save takes
effect on the next round, nothing to restart.

| File | Block | What it shows |
|---|---|---|
| `answer.json` | `immersiveText` | the written answer |
| `comparison.json` | `comparativeCard` | two animals side by side |
| `ranking.json` | `RankedList` | three to five animals on a scale |
| `profile.json` | `animalDetail` | one animal in depth |
| `habitat.json` | `HabitatCard` | one habitat as a card |
| `grid.json` | `animalsGrid` | a grid of animals sharing a place or trait |
| `follow-ups.json` | `relQuestions` | three follow-up questions |
| `discovery-feed.json` | `discoveryFeed` | the animals on the entrance map (part 5) |

Each carries a `description`: that is what Thamyr reads to decide whether the
block fits the question. Change the description and you change when it appears.
