import {createPortal} from 'react-dom';
import {AnimatePresence, motion} from 'motion/react';
import styles from './AquariumOpening.module.scss';
import type {AquariumOpeningData} from '../../thamyr/aquariumOpeningFromBlock.ts';
import Icon from '../Icon/Icon.tsx';
import {useTranslation} from '../../i18n/useTranslation.ts';
import {useLoadingStore} from '../../stores/loadingStore.ts';
import {T} from '../../lib/easings.ts';

type AquariumOpeningProps = AquariumOpeningData & {
	/**
	 * Whether this block's round is the newest one. The bar is a single floating
	 * element, so only the newest round may show one: two rounds carrying the
	 * announcement would otherwise put identical pills at identical coordinates.
	 */
	readonly isLatestRound?: boolean;
};

/**
 * The aquarium announcement: a bar fixed over the page, the way the prompt bar is.
 *
 * It is PORTALLED to `document.body` rather than rendered in place. Page content
 * lives in `.app`, which is itself a stacking context at z-index 1 below the
 * background's overlay at 2 (see Background.module.scss). A fixed bar left
 * inside the round would have its own z-index resolved inside that context, so
 * no value could lift it above the overlay — the prompt bar clears it only by
 * being a root-level element too.
 *
 * Every string is the tenant's (see {@link AquariumOpeningData}); only the fallback
 * tag is local, so a block saved without one still reads as an announcement.
 */
function AquariumOpening({tag, title, text, isLatestRound}: AquariumOpeningProps) {
	const {t} = useTranslation();
	// The loader covers the viewport while a round is composing, and the store
	// holds it for a minimum window (MIN_LOADING_MS) — so this is read straight
	// from the store rather than timed here. The bar waits for the loader to go
	// and drops in after it, instead of being revealed underneath it.
	const isLoading = useLoadingStore(state => state.isLoading);

	// Anchored to the top of the viewport, so it enters from above like the
	// header does. Same spring the header and prompt bar use.
	const variants = {
		hidden: {opacity: 0, y: '-140%'},
		visible: {opacity: 1, y: 0},
	};

	return createPortal(
		<AnimatePresence>
			{isLatestRound && !isLoading && (
				<motion.aside
					key={'aquarium-opening'}
					variants={variants}
					initial={'hidden'}
					animate={'visible'}
					exit={'hidden'}
					transition={T.lightBounce}
					className={styles.bar}
					aria-label={t('aquariumOpening.label')}
				>
					{/* Marine themes the whole pill — deep blue with the pale text the
					    theme already pairs it with, so nothing inside needs putting back
					    on another theme. */}
					<div className={styles.pill} data-theme={'Marine'}>
						<div className={styles.inner}>
							<p className={styles.tag}>
								<Icon icon={'Flag'} color={'currentColor'}/>
								{tag || t('aquariumOpening.tag')}
							</p>
							<div className={styles.copy}>
								<p className={styles.title}>{title}</p>
								{text && <p className={styles.text}>{text}</p>}
							</div>
						</div>
					</div>
				</motion.aside>
			)}
		</AnimatePresence>,
		document.body,
	);
}

export default AquariumOpening;
