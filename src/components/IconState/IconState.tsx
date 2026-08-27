import {createElement, type HTMLAttributes} from 'react';
import {icons, type IconName} from '../Icon/Icon';

import styles from './IconState.module.scss';
import type {Habitat} from "../../types/animals.ts";

export type IconStateVariant = 'filled' | 'outline' | 'dashed';

export type IconStateProps = HTMLAttributes<HTMLDivElement> & {
	readonly icon: IconName;
	readonly state?: IconStateVariant;
	readonly size?: number;
	readonly color?: string;
	readonly strokeWidth?: number;
	readonly iconClassName?: string;
	readonly wrapperClassName?: string;
	readonly theme?: Habitat;
	readonly isReverse?: boolean;
};

const stateClass: Record<IconStateVariant, string> = {
	filled: styles.filled,
	outline: styles.outline,
	dashed: styles.dashed,
};

export function IconState({
	icon,
	state = 'filled',
	size = 24,
	color = 'currentColor',
	strokeWidth = 2,
	iconClassName,
	wrapperClassName,
	theme,
	isReverse,
	...rest
}: IconStateProps) {
	return (
		<div
			data-theme={theme ?? 'light'}
			className={`${styles.wrapper} ${wrapperClassName ?? ''}`}
			aria-label={`${icon} ${state}`}
			role='img'
			style={{width: 'auto', height: size, color}}
			{...rest}
		>
			{createElement(icons[icon], {
				className: `${styles.icon} ${stateClass[state]} ${isReverse ? styles.reverse : ''} ${iconClassName ?? ''}`,
				style: {width: 'auto', height: size, strokeWidth},
			})}
		</div>
	);
}

export default IconState;
