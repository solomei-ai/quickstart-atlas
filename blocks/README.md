# Blocks

One file per block the Quickstart adds, in the order the guide adds them.
Save one with `callimacus block save --file blocks/<name>.json`; every save takes
effect on the next round, nothing to restart.

| File | Block | What it shows |
|---|---|---|
| `answer.json` | `immersiveText` | the written answer |
| `comparison.json` | `comparativeCard` | two animals side by side, under a generated title |
| `ranking.json` | `RankedList` | three to five animals on a scale |
| `profile.json` | `animalDetail` | one animal in depth |
| `habitat.json` | `HabitatCard` | one habitat as a card |
| `spread.json` | `ThemedSection` | a magazine-style spread of the animals of a place, each with a caption |
| `aquarium-opening.json` | `aquariumOpening` | a floating banner announcing the new Atlas Aquarium |
| `follow-ups.json` | `relQuestions` | three follow-up questions |
| `discovery-feed.json` | `discoveryFeed` | the animals on the entrance map (part 5) |

Each carries a `description`: that is what Thamyr reads to decide whether the
block fits the question. Change the description and you change when it appears.

## `aquarium-opening.json`

The one block here that does not leave its selection to Thamyr, and the only one
with nothing to retrieve or generate. Its `condition` names the `marine_wildlife`
receptor label, so it appears on questions about the animals of the sea and
nowhere else — the receptor decides, not the block description. `priority: 0`
puts it at the head of the round.

Its whole content is a single `static` item, so the announcement's wording lives
on the tenant: edit the `value` and `callimacus block save --file blocks/aquarium-opening.json`
changes what the banner says, with no frontend deploy and no LLM call. There is
one announcement and it does not depend on the question, so there is nothing
here worth generating per round.

The frontend renders it as a bar fixed over the page rather than a block in the
round — see `src/components/AquariumOpening`.

## `pinned/`

The same four blocks again, with one difference: their `condition` names the
`marine_wildlife` receptor label from part 4 instead of leaving the choice to
Thamyr. Save them together with `aquarium-opening.json`, right after creating the
label and before asking anything, and a question about the animals of the sea
gets the same round every time — banner, animal, habitat, spread, follow-ups, in
priority order.

Pin the **whole** round, not one block of it. Once a label matches, the round is
owned by your rules and only the blocks pinned to that label appear in it: with
just `aquarium-opening.json` saved, a reef question returns the banner and
nothing else. Nothing errors — the round simply comes back thinner than you expected.

Pinning does not take a block away from Thamyr. These same keys stay available to
Cognitive Flow for every question no label fits, which is why a savanna question
still gets the habitat card and the spread.
