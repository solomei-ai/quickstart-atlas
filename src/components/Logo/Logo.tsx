import Icon from '../Icon/Icon';
import styles from './Logo.module.scss';

type LogoSize = 'sm' | 'md' | 'lg';

// Pixel size of the logo mark per step. Mirrors the font-size scale used for
// the wordmark so the icon and name stay visually balanced.
const iconSize: Record<LogoSize, number> = {
	sm: 24,
	md: 28,
	lg: 46,
};

type LogoProps = {
	// 'mark' renders the logo icon alone; 'full' adds the wordmark beside it.
	readonly variant?: 'mark' | 'full';
	readonly size?: LogoSize;
	readonly className?: string;
};

function Logo({variant = 'mark', size = 'md', className}: LogoProps) {
	return (
		<div className={`${styles.logo} ${styles[`size-${size}`]} ${className ?? ''}`}>
			<Icon icon='Logo' size={iconSize[size]} />
			{variant === 'full' && <h2 className={styles.name}>Atlas</h2>}
		</div>
	);
}

export default Logo;
