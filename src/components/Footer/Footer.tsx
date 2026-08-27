import styles from './Footer.module.scss';
import PromptBar from "../PromptBar/PromptBar.tsx";
import {useState} from "react";
import IntentTab from "../IntentTab/IntentTab.tsx";
import {AnimatePresence, motion} from "motion/react";
import {T} from "../../lib/easings.ts";
import {useMapAnimalsStore} from "../../stores/mapAnimalsStore.ts";

type FooterProps = {
	readonly isVisible?: boolean;
	readonly isLoading?: boolean;
	readonly isSendDisabled?: boolean;
	readonly onSend?: (text: string) => void;
};

function Footer({isVisible = true, isLoading, isSendDisabled, onSend}: FooterProps) {

	const [isIntentTabOpen, setIsIntentTabOpen] = useState(false);
	const intent = useMapAnimalsStore(state => state.intent);

	function toggleIntentTab() {
		setIsIntentTabOpen(prev => !prev);
	}

	const variants = {
		hidden: {opacity: 0, y: '100%'},
		visible: {opacity: 1, y: 0},
	}

	return(
		<AnimatePresence>
			<motion.div
				variants={variants}
				transition={T.lightBounce}
				initial='hidden'
				animate={isVisible ? 'visible' : 'hidden'}
				className={styles.container}>
				<AnimatePresence>
					{
						isIntentTabOpen ? (
							<IntentTab
								text={intent}
								onClose={() => toggleIntentTab()}
							/>)
							: null
					}
				</AnimatePresence>
				<PromptBar
					onIntentPress={() => toggleIntentTab()}
					onSend={onSend}
					isDisabled={isSendDisabled}
					isLoading={isLoading}
				/>
			</motion.div>
		</AnimatePresence>
	)
}

export default Footer;