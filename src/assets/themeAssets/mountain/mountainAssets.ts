import type {ThemeAsset} from "../themeAsset.ts";
import Mountain1 from './mountain1.webp'
import Mountain2 from './mountain2.webp'
import Mountain3 from './mountain3.webp'
import Mountain4 from './mountain4.webp'
import Mountain5 from './mountain5.webp'
import Mountain6 from './mountain6.webp'
import Mountain7 from './mountain7.webp'
import Mountain8 from './mountain8.webp'
import Mountain9 from './mountain9.webp'
import Mountain10 from './mountain10.webp'
import Mountain11 from './mountain11.webp'
import Mountain12 from './mountain12.webp'
import Mountain13 from './mountain13.webp'
import Mountain14 from './mountain14.webp'
import Mountain15 from './mountain15.webp'
import Mountain16 from './mountain16.webp'
import Mountain17 from './mountain17.webp'
import Mountain18 from './mountain18.webp'
import Mountain19 from './mountain19.webp'

export const mountainAssets: ThemeAsset = {
	monstera: [Mountain1, Mountain2, Mountain3, Mountain4, Mountain5, Mountain6],
	broadleaf: [Mountain7, Mountain8, Mountain9, Mountain10, Mountain11, Mountain12],
	bloom: [Mountain13, Mountain14, Mountain15, Mountain16, Mountain17, Mountain18, Mountain19]
}

export const mountainScatterGroups = [
	{key: 'monstera'},
	{key: 'broadleaf'},
	{key: 'bloom', scale: 0.65},
] as const
