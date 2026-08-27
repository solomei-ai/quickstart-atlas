import {IconState, type IconStateProps, type IconStateVariant} from '../IconState/IconState';
import {type IconName} from '../Icon/Icon';
import type {AnimalClassification, AnimalStatus, Habitat} from '../../types/animals';

export type AnimalIconProps = Omit<IconStateProps, 'icon' | 'state'> & {
	readonly classification: AnimalClassification;
	readonly status: AnimalStatus;
	readonly animalHabitat?: Habitat;
	readonly isReverse?: boolean;
};

/** Each classification maps to its icon; amphibians reuse the reptile icon. */
export const classificationIcon: Record<AnimalClassification, IconName> = {
	Mammal: 'Mammal',
	Bird: 'Bird',
	Reptile: 'Reptile',
	Amphibian: 'Reptile',
	Fish: 'Fish',
	Crustacean: 'Crustacean',
	Invertebrates: 'Invertebrates',
};

export const statusState: Record<AnimalStatus, IconStateVariant> = {
	living: 'filled',
	endangered: 'outline',
	extinct: 'dashed',
};

export function AnimalIcon({classification, status, animalHabitat, isReverse, ...rest}: AnimalIconProps) {
	return (
		<IconState
			icon={classificationIcon[classification]}
			state={statusState[status]}
			strokeWidth={5}
			theme={animalHabitat}
			isReverse={isReverse}
			{...rest}
		/>
	);
}

export default AnimalIcon;
