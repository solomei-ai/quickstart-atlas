import type { Block } from '@solomei-ai/thamyr-react';
import TextResponse from "../components/TextResponse/TextResponse.tsx";
import AnimalCardList from "../components/AnimalscardList/AnimalCardList.tsx";
import AnimalProfile from "../components/AnimalProfile/AnimalProfile.tsx";
import HabitatCard from "../components/HabitatCard/HabitatCard.tsx";
import RelatedQuestions from "../components/RelatedQuestions/RelatedQuestions.tsx";
import { animalsGridFromBlock } from "./animalsGridFromBlock.ts";
import { animalFromSkesisHit, habitatFromSkesisHit } from "./animalFromSkesis.ts";
import { normalizeType, skesisAnimalHits, skesisHabitatHits, asFact, asFacts, type Fact } from "./blockData.ts";

/**
 * Resolve a Thamyr block to its content node. One case per block type the tenant
 * can emit; a block whose data is empty or errored (and any unknown type) returns
 * `null` so {@link BlockRenderer} omits it entirely — no wrapper, no layout gap.
 */
function renderBlockContent(block: Block, isLatestRelatedQuestions?: boolean) {
	switch (normalizeType(block.type)) {
		case 'demosthenesResponse': {
			const data = block.data as { title?: string; text?: string };
			return <TextResponse title={data.title ?? ''} text={data.text ?? ''} />;
		}
		case 'animalsGrid': {
			const props = animalsGridFromBlock(block.data);
			return props ? <AnimalCardList {...props} /> : null;
		}
		case 'animalDetail': {
			const data = block.data as { animal?: unknown; curiosity?: unknown; definition?: unknown };
			// The retrieved record may be a habitat (the engine ignores the `kinds`
			// filter); habitats have their own block, so only render an animal here.
			const hit = skesisAnimalHits(data.animal)[0];
			if (!hit) return null;
			const curiosities = [asFact(data.curiosity), asFact(data.definition)]
				.filter((fact): fact is Fact => fact !== undefined);
			return <AnimalProfile animal={animalFromSkesisHit(hit)} curiosities={curiosities} />;
		}
		case 'relQuestions': {
			const questions = asFacts((block.data as { questions?: unknown })?.questions);
			if (questions.length === 0) return null;
			// Kept mounted even when no longer the latest round so its
			// AnimatePresence survives to play the exit animation; visibility
			// (and thus enter/exit) is driven by the `visible` prop.
			return <RelatedQuestions questions={questions} visible={isLatestRelatedQuestions} />;
		}
		case 'HabitatCard': {
			// The slot may include animals (the engine ignores `kinds`) — keep only
			// the habitat records and render the best match.
			const hit = skesisHabitatHits((block.data as { habitat?: unknown }).habitat)[0];
			if (!hit) return null;
			return <HabitatCard habitat={habitatFromSkesisHit(hit)} />;
		}
		default:
			return null;
	}
}

/**
 * Wraps a block's resolved content in its `data-block` container. When the block
 * resolves to nothing (empty/errored data or an unknown type) it renders `null`
 * so the container is never emitted — otherwise an empty `<div>` would still
 * count as a flex item in `.round` and add a gap.
 */
export function BlockRenderer({ block, isLatestRelatedQuestions }: { block: Block; isLatestRelatedQuestions?: boolean }) {
	const content = renderBlockContent(block, isLatestRelatedQuestions);
	if (content === null) return null;
	return <div data-block={block.type}>{content}</div>;
}

export default BlockRenderer;
