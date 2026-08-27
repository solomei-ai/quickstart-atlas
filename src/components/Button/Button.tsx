import {type ButtonHTMLAttributes} from 'react';
import Icon, {type IconName} from '../Icon/Icon';

import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'outline' | 'fill' | 'outline-muted';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	readonly variant?: ButtonVariant;
	/** Optional icon rendered before the label. */
	readonly icon?: IconName;
	readonly iconSize?: number;
};

function Button({variant = 'primary', icon, iconSize, children, className, ...rest}: ButtonProps) {
	return (
		<button className={`${styles.button} ${styles[variant]} ${className ?? ''}`} {...rest}>
			{icon && (
				// currentColor so the icon inherits the button's (themeable) text colour.
				<Icon icon={icon} size={iconSize ?? 14} color='currentColor' fill='currentColor'/>
			)}
			{children}
		</button>
	);
}

export default Button;
