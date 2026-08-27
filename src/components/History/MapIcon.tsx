import styles from './History.module.scss';
import type {InteractionType} from "./history.ts";
import {Icon, type IconName} from "../Icon/Icon.tsx";

type MapIconProps = {
	readonly interaction: InteractionType;
	readonly hasInteractionIcon?: boolean;
}

function MapIcon({ interaction, hasInteractionIcon = false }: MapIconProps) {

	function returnIcon(): IconName {
		switch (interaction.target) {
			case "map":
				return "Map";
			case "animals":
				return "Animals";
			case "habitat":
				return "Habitat";
			case "related":
				return "QuestionMark";
			case "search":
				return "MagnifyingGlass"
			case "tags":
				return "Tag";
			case "size":
				return "Human";
				default:
					return "QuestionMark";
		}
	}

	function returnVariant() :'light' | 'dark' {
		switch (interaction.target) {
			case 'search':
				return 'light';
			default:
				return 'dark';
		}
	}

	const shouldRenderInteractionIcon = hasInteractionIcon && interaction.interactionType === 'click' && interaction.target !== 'search';

	return(
		<div
			className={`${styles.mapIconContainer} ${styles[returnVariant()]}`}>
			<Icon icon={returnIcon()} size={22} color={'currentColor'} />
			{
				shouldRenderInteractionIcon ? (
					<div className={styles.interactionContainer}>
						<Icon size={13} icon={"MouseClick"} color={"currentColor"} />
					</div>
				) : null
			}
		</div>
	)
}

export default MapIcon;