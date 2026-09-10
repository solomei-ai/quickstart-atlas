import type {ThemeAsset} from "../themeAsset.ts";
import Mountain1 from './mountain1.png'
import Mountain2 from './mountain2.png'
import Mountain3 from './mountain3.png'
import Mountain4 from './mountain4.png'
import Mountain5 from './mountain5.png'
import Mountain6 from './mountain6.png'
import Mountain7 from './mountain7.png'
import Mountain8 from './mountain8.png'
import Mountain9 from './mountain9.png'
import Mountain10 from './mountain10.png'
import Mountain11 from './mountain11.png'
import Mountain12 from './mountain12.png'
import Mountain13 from './mountain13.png'
import Mountain14 from './mountain14.png'
import Mountain15 from './mountain15.png'
import Mountain16 from './mountain16.png'
import Mountain17 from './mountain17.png'
import Mountain18 from './mountain18.png'
import Mountain19 from './mountain19.png'

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
