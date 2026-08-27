import styles from './Home.module.scss';
import Icon from "../Icon/Icon.tsx";
import Ship from '../../assets/map/ship.png'
import Shells from '../../assets/map/shells.png'

const ICON_SIZE = 60
const MOBILE_ICON_SIZE = 18

function MapOverlay() {
	return (
		<div className={styles.mapOverlay}>
			<div className={styles.north}>
				<Icon className={styles.desktop} icon={'North'} size={ICON_SIZE}/>
				<Icon className={styles.mobile} icon={'NLetter'} size={MOBILE_ICON_SIZE}/>
			</div>
			<div className={styles.south}>
				<Icon className={styles.desktop} icon={'South'} size={ICON_SIZE}/>
				<Icon className={styles.mobile} icon={'SLetter'} size={MOBILE_ICON_SIZE}/>
			</div>
			<div className={styles.east}>
				<Icon className={styles.desktop} icon={'East'} size={ICON_SIZE}/>
				<Icon className={styles.mobile} icon={'ELetter'} size={MOBILE_ICON_SIZE}/>
			</div>
			<div className={styles.west}>
				<Icon className={styles.desktop} icon={'West'} size={ICON_SIZE}/>
				<Icon className={styles.mobile} icon={'WLetter'} size={MOBILE_ICON_SIZE}/>
			</div>
			<div className={styles.ship}>
				<img src={Ship} className={styles.sticker} />
			</div>
			<div className={styles.shells}>
				<img src={Shells} className={styles.sticker} />
			</div>
		</div>
	)
}

export default MapOverlay;
