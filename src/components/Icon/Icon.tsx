import {createElement, type HTMLAttributes, type ComponentType, type SVGProps} from 'react';
import Bird from '../../assets/icons/bird.svg?react';
import Crustacean from '../../assets/icons/crustacean.svg?react';
import Fish from '../../assets/icons/fish.svg?react';
import Invertebrates from '../../assets/icons/invertebrate.svg?react';
import Mammal from '../../assets/icons/mammal.svg?react';
import Paw from '../../assets/icons/paw.svg?react';
import Plus from '../../assets/icons/plus.svg?react';
import Reptile from '../../assets/icons/reptile.svg?react';
import Send from '../../assets/icons/send.svg?react';
import Human from '../../assets/icons/human.svg?react';
import Hand from '../../assets/icons/hand.svg?react';
import Logo from '../../assets/icons/logo.svg?react';
import Flag from '../../assets/icons/flag.svg?react';
import PawOutline from '../../assets/icons/paw-outline.svg?react';
import MagnifyingGlass from '../../assets/icons/mignifiying-glass.svg?react';
import Journey from '../../assets/icons/journey.svg?react';
import Wind from '../../assets/icons/wind.svg?react';
import Animals from '../../assets/icons/animals.svg?react';
import MouseClick from '../../assets/icons/click.svg?react';
import Habitat from '../../assets/icons/habitat.svg?react';
import Map from '../../assets/icons/map.svg?react';
import QuestionMark from '../../assets/icons/related.svg?react';
import GeoLocation from '../../assets/icons/start.svg?react';
import Tag from '../../assets/icons/tag.svg?react';
import North from '../../assets/icons/north.svg?react';
import South from '../../assets/icons/south.svg?react';
import East from '../../assets/icons/east.svg?react';
import West from '../../assets/icons/west.svg?react';
import NLetter from '../../assets/icons/north-mobile.svg?react';
import SLetter from '../../assets/icons/south-mobile.svg?react';
import ELetter from '../../assets/icons/west-mobile.svg?react';
import WLetter from '../../assets/icons/east-mobile.svg?react';
import List from '../../assets/icons/list.svg?react';
import ChevronLeft from '../../assets/icons/chevron-left.svg?react';
import ArrowRight from '../../assets/icons/arrow-right.svg?react';

import BearL from '../../assets/paws/bear_l.svg?react';
import BearR from '../../assets/paws/bear_r.svg?react';
import ChameleonL from '../../assets/paws/chameleon_l.svg?react';
import ChameleonR from '../../assets/paws/chameleon_r.svg?react';
import CougarL from '../../assets/paws/cougar_l.svg?react';
import CougarR from '../../assets/paws/cougar_r.svg?react';
import CrocodileL from '../../assets/paws/crocodile_l.svg?react';
import CrocodileR from '../../assets/paws/crocodile_r.svg?react';
import DuikerL from '../../assets/paws/duiker_l.svg?react';
import DuikerR from '../../assets/paws/duiker_r.svg?react';
import EagleL from '../../assets/paws/eagle_l.svg?react';
import EagleR from '../../assets/paws/eagle_r.svg?react';
import EchidnaL from '../../assets/paws/echidna_l.svg?react';
import EchidnaR from '../../assets/paws/echidna_r.svg?react';
import ElephantL from '../../assets/paws/elephant_l.svg?react';
import ElephantR from '../../assets/paws/elephant_r.svg?react';
import GeckoL from '../../assets/paws/gecko_l.svg?react';
import GeckoR from '../../assets/paws/gecko_r.svg?react';
import GooseL from '../../assets/paws/goose_l.svg?react';
import GooseR from '../../assets/paws/goose_r.svg?react';
import HeronL from '../../assets/paws/heron_l.svg?react';
import HeronR from '../../assets/paws/heron_r.svg?react';
import HippoL from '../../assets/paws/hippo_l.svg?react';
import HippoR from '../../assets/paws/hippo_r.svg?react';
import IguanaL from '../../assets/paws/iguana_l.svg?react';
import IguanaR from '../../assets/paws/iguana_r.svg?react';
import KoalaL from '../../assets/paws/koala_l.svg?react';
import KoalaR from '../../assets/paws/koala_r.svg?react';
import LeopardL from '../../assets/paws/leopard_l.svg?react';
import LeopardR from '../../assets/paws/leopard_r.svg?react';
import LizardL from '../../assets/paws/lizard_l.svg?react';
import LizardR from '../../assets/paws/lizard_r.svg?react';
import LlamaL from '../../assets/paws/llama_l.svg?react';
import LlamaR from '../../assets/paws/llama_r.svg?react';
import OkapiL from '../../assets/paws/okapi_l.svg?react';
import OkapiR from '../../assets/paws/okapi_r.svg?react';
import OwlL from '../../assets/paws/owl_l.svg?react';
import OwlR from '../../assets/paws/owl_r.svg?react';
import RhinoL from '../../assets/paws/rhino_l.svg?react';
import RhinoR from '../../assets/paws/rhino_r.svg?react';
import SnipeL from '../../assets/paws/snipe_l.svg?react';
import SnipeR from '../../assets/paws/snipe_r.svg?react';
import SwanL from '../../assets/paws/swan_l.svg?react';
import SwanR from '../../assets/paws/swan_r.svg?react';
import TapirL from '../../assets/paws/tapir_l.svg?react';
import TapirR from '../../assets/paws/tapir_r.svg?react';
import TigerL from '../../assets/paws/tiger_l.svg?react';
import TigerR from '../../assets/paws/tiger_r.svg?react';
import TurtleL from '../../assets/paws/turtle_l.svg?react';
import TurtleR from '../../assets/paws/turtle_r.svg?react';
import WoodcockL from '../../assets/paws/woodcock_l.svg?react';
import WoodcockR from '../../assets/paws/woodcock_r.svg?react';
import Bbc from '../../assets/icons/bbc.svg?react';
import NationalGeo from '../../assets/icons/national_geographic.svg?react';
import Discovery from '../../assets/icons/discovery.svg?react';

import styles from './Icon.module.scss';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const icons = {
	Bird,
	Crustacean,
	Fish,
	Invertebrates,
	Mammal,
	Paw,
	Plus,
	Reptile,
	Send,
	Human,
	Hand,
	Logo,
	Flag,
	PawOutline,
	Journey,
	MagnifyingGlass,
	Wind,
	Animals,
	MouseClick,
	Habitat,
	Map,
	QuestionMark,
	GeoLocation,
	Tag,
	ChevronLeft,
	BearL,
	BearR,
	ChameleonL,
	ChameleonR,
	CougarL,
	CougarR,
	CrocodileL,
	CrocodileR,
	DuikerL,
	DuikerR,
	EagleL,
	EagleR,
	EchidnaL,
	EchidnaR,
	ElephantL,
	ElephantR,
	GeckoL,
	GeckoR,
	GooseL,
	GooseR,
	HeronL,
	HeronR,
	HippoL,
	HippoR,
	IguanaL,
	IguanaR,
	KoalaL,
	KoalaR,
	LeopardL,
	LeopardR,
	LizardL,
	LizardR,
	LlamaL,
	LlamaR,
	OkapiL,
	OkapiR,
	OwlL,
	OwlR,
	RhinoL,
	RhinoR,
	SnipeL,
	SnipeR,
	SwanL,
	SwanR,
	TapirL,
	TapirR,
	TigerL,
	TigerR,
	TurtleL,
	TurtleR,
	WoodcockL,
	WoodcockR,
	Bbc,
	NationalGeo,
	Discovery,
	North,
	South,
	East,
	West,
	NLetter,
	SLetter,
	ELetter,
	WLetter,
	ArrowRight,
	List
} satisfies Record<string, IconComponent>;

export type IconName = keyof typeof icons;

// Every animal in src/assets/paws that has both a left (_l) and right (_r) paw.
export const PAW_ANIMALS = [
	'Bear',
	'Chameleon',
	'Cougar',
	'Crocodile',
	'Duiker',
	'Eagle',
	'Echidna',
	'Elephant',
	'Gecko',
	'Goose',
	'Heron',
	'Hippo',
	'Iguana',
	'Koala',
	'Leopard',
	'Lizard',
	'Llama',
	'Okapi',
	'Owl',
	'Rhino',
	'Snipe',
	'Swan',
	'Tapir',
	'Tiger',
	'Turtle',
	'Woodcock',
] as const;

export type PawAnimal = (typeof PAW_ANIMALS)[number];

// Returns the left and right paw IconNames for a given animal.
export function getPawIcons(animal: PawAnimal): {left: IconName; right: IconName} {
	return {left: `${animal}L`, right: `${animal}R`};
}

export type IconProps = HTMLAttributes<HTMLDivElement> & {
	readonly icon: IconName;
	readonly iconClassName?: string;
	readonly wrapperClassName?: string;
	readonly size?: number;
	readonly fill?: string;
	readonly color?: string;
};

export function Icon({icon, iconClassName, wrapperClassName, size = 16, fill, color = '#262626', ...rest}: IconProps) {
	return (
		<div
			className={`${styles.wrapper} ${wrapperClassName ?? ''}`}
			aria-label={icon}
			role='img'
			style={{width: size, height: size, color}}
			{...rest}
		>
			{createElement(icons[icon], {
				className: `${styles.icon} ${iconClassName ?? ''}`,
				style: {width: size, height: size},
				...(fill ? {fill} : {}),
			})}
		</div>
	);
}

export default Icon;
