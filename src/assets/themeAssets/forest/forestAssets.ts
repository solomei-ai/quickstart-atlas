import type {ThemeAsset} from "../themeAsset.ts";
import Forest1 from './forest1.webp'
import Forest2 from './forest2.webp'
import Forest3 from './forest3.webp'
import Forest4 from './forest4.webp'
import Forest5 from './forest5.webp'
import Forest6 from './forest6.webp'
import Forest7 from './forest7.webp'
import Forest8 from './forest8.webp'
import Forest9 from './forest9.webp'
import Forest10 from './forest10.webp'
import Forest11 from './forest11.webp'
import Forest12 from './forest12.webp'
import Forest13 from './forest13.webp'
import Forest14 from './forest14.webp'
import Forest15 from './forest15.webp'
import Forest16 from './forest16.webp'
import Forest17 from './forest17.webp'
import Forest18 from './forest18.webp'

export const forestAssets: ThemeAsset = {
	monstera: [Forest1, Forest2, Forest3, Forest4, Forest5, Forest6],
	broadleaf: [Forest7, Forest8, Forest9, Forest10, Forest11, Forest12],
	bloom: [Forest13, Forest14, Forest15, Forest16, Forest17, Forest18]
}

export const canopyScatterGroups = [
	{key: 'monstera'},
	{key: 'broadleaf'},
	{key: 'bloom', scale: 0.65},
] as const