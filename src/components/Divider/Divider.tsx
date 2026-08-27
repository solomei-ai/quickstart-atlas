import DividerSvg from '../../assets/assets/divider.svg?react';

import styles from './Divider.module.scss';

type DividerProps = {
	readonly direction?: 'horizontal' | 'vertical';
	readonly className?: string;
};

function Divider({direction = 'horizontal', className}: DividerProps) {
	return (
		<DividerSvg
			className={`${styles[direction]} ${className ?? ''}`}
			// Stretch the artwork independently on each axis so the divider fills
			// the full width (horizontal) or height (vertical) of its container.
			preserveAspectRatio='none'
			role='separator'
			aria-orientation={direction}
		/>
	);
}

export default Divider;
