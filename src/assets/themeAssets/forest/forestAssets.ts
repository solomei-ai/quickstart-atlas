import type {ThemeAsset} from "../themeAsset.ts";
import Forest1 from './forest1.png'
import Forest2 from './forest2.png'
import Forest3 from './forest3.png'
import Forest4 from './forest4.png'
import Forest5 from './forest5.png'
import Forest6 from './forest6.png'
import Forest7 from './forest7.png'
import Forest8 from './forest8.png'
import Forest9 from './forest9.png'
import Forest10 from './forest10.png'
import Forest11 from './forest11.png'
import Forest12 from './forest12.png'
import Forest13 from './forest13.png'
import Forest14 from './forest14.png'
import Forest15 from './forest15.png'
import Forest16 from './forest16.png'
import Forest17 from './forest17.png'
import Forest18 from './forest18.png'

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