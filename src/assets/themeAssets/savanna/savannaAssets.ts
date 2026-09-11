import type {ThemeAsset} from "../themeAsset.ts";
import Savanna1 from './savanna1.webp'
import Savanna2 from './savanna2.webp'
import Savanna3 from './savanna3.webp'
import Savanna4 from './savanna4.webp'
import Savanna5 from './savanna5.webp'
import Savanna6 from './savanna6.webp'
import Savanna7 from './savanna7.webp'
import Savanna8 from './savanna8.webp'
import Savanna9 from './savanna9.webp'
import Savanna10 from './savanna10.webp'
import Savanna11 from './savanna11.webp'
import Savanna12 from './savanna12.webp'
import Savanna13 from './savanna13.webp'
import Savanna14 from './savanna14.webp'
import Savanna15 from './savanna15.webp'
import Savanna16 from './savanna16.webp'
import Savanna17 from './savanna17.webp'
import Savanna18 from './savanna18.webp'
import Savanna19 from './savanna19.webp'

export const savannaAssets: ThemeAsset = {
	monstera: [Savanna1, Savanna2, Savanna3, Savanna4, Savanna5, Savanna6],
	broadleaf: [Savanna7, Savanna8, Savanna9, Savanna10, Savanna11, Savanna12],
	bloom: [Savanna13, Savanna14, Savanna15, Savanna16, Savanna17, Savanna18, Savanna19]
}

export const savannaScatterGroups = [
	{key: 'monstera'},
	{key: 'broadleaf'},
	{key: 'bloom', scale: 0.65},
] as const
