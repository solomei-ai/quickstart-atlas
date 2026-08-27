import {Activity} from 'react';
import BlockRenderer from '../../thamyr/BlockRenderer.tsx';
import {useConversationChapters} from '../../thamyr/useThamyrConversation.ts';
import {useLoaderScroll} from '../../hooks/useLoaderScroll.ts';
import {useLoadingStore} from '../../stores/loadingStore.ts';
import styles from './Conversation.module.scss';

/**
 * Renders the conversation's rounds, one container per chapter. Stays out of the
 * document until there is more than the opening chapter to show (or a round is
 * on its way in), so the home view isn't padded by an empty results section.
 */
function Conversation() {
	const {orderedChapters, lastSuggestedQuestionsId} = useConversationChapters();
	const isLoading = useLoadingStore(state => state.isLoading);
	// Owns the scroll refs because it owns the nodes they attach to: the last
	// round and the trailing spacer the pre-scroll needs room from.
	const {latestRoundRef, scrollRoomRef} = useLoaderScroll(isLoading);

	if (orderedChapters.length <= 1 && !isLoading) return null;

	return (
		<section className={styles.results}>
			{orderedChapters.map((chapter, i) => (
				<div
					key={chapter.id || `chapter-${i}`}
					id={`round-${chapter.id}`}
					className={styles.round}
					ref={i === orderedChapters.length - 1 ? latestRoundRef : undefined}
				>
					{chapter.blocks.map((block, blockIndex) => (
						<BlockRenderer
							key={block.id || `block-${blockIndex}`}
							block={block}
							isLatestRelatedQuestions={block.id === lastSuggestedQuestionsId && !isLoading}
						/>
					))}
				</div>
			))}
			<Activity mode={isLoading ? 'visible' : 'hidden'}>
				<div ref={scrollRoomRef} className={styles.scrollRoom} aria-hidden />
			</Activity>
		</section>
	);
}

export default Conversation;
