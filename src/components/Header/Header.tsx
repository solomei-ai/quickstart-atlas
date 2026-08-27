import styles from "./Header.module.scss";
import Logo from "../Logo/Logo.tsx";
import {useScrollDirection} from "../../hooks/useScrollDirection.ts";
import {AnimatePresence, motion} from "motion/react";
import { T } from "../../lib/easings.ts";
import Legend from "../Legend/Legend.tsx";

function Header() {

	const scrollDirection = useScrollDirection();

	const variants = {
		hidden: {opacity: 0, y: '-100%'},
		visible: {opacity: 1, y: 0},
	}

	return(
		<AnimatePresence>
			{
				scrollDirection === 'up' ? (
					<motion.div
						variants={variants}
						initial='hidden'
						animate={'visible'}
						exit={'hidden'}
						transition={T.lightBounce}
						className={styles.container}>
						<div className={styles.mobile}>
							<Logo variant={'full'} size={'md'} />
						</div>
						<div className={styles.desktop}>
							<Logo variant={'full'} size={'lg'} />
						</div>
						<div className={styles.action}>
							<Legend/>
						</div>
					</motion.div>
				) : null
			}
		</AnimatePresence>
	)
}

export default Header;