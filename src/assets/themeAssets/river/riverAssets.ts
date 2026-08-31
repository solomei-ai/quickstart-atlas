import type {ThemeAsset} from "../themeAsset.ts";
import River1 from './river1.webp'
import River2 from './river2.webp'
import River3 from './river3.webp'
import River4 from './river4.webp'
import River5 from './river5.webp'
import River6 from './river6.webp'
import River7 from './river7.webp'
import River8 from './river8.webp'
import River9 from './river9.webp'
import River10 from './river10.webp'
import River11 from './river11.webp'
import River12 from './river12.webp'
import River13 from './river13.webp'
import River14 from './river14.webp'
import River15 from './river15.webp'
import River16 from './river16.webp'
import River17 from './river17.webp'
import River18 from './river18.webp'

export const riverAssets: ThemeAsset = {
	monstera: [River1, River2, River3, River4, River5, River6],
	broadleaf: [River7, River8, River9, River10, River11, River12],
	bloom: [River13, River14, River15, River16, River17, River18]
}

export const riverScatterGroups = [
	{key: 'monstera'},
	{key: 'broadleaf'},
	{key: 'bloom', scale: 0.65},
] as const
