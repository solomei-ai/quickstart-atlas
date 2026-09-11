import type {ThemeAsset} from "../themeAsset.ts";
import River1 from './river1.png'
import River2 from './river2.png'
import River3 from './river3.png'
import River4 from './river4.png'
import River5 from './river5.png'
import River6 from './river6.png'
import River7 from './river7.png'
import River8 from './river8.png'
import River9 from './river9.png'
import River10 from './river10.png'
import River11 from './river11.png'
import River12 from './river12.png'
import River13 from './river13.png'
import River14 from './river14.png'
import River15 from './river15.png'
import River16 from './river16.png'
import River17 from './river17.png'
import River18 from './river18.png'

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
