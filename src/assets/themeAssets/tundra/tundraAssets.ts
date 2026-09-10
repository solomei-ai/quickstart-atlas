import type {ThemeAsset} from "../themeAsset.ts";
import Tundra1 from './tundra1.png'
import Tundra2 from './tundra2.png'
import Tundra3 from './tundra3.png'
import Tundra4 from './tundra4.png'
import Tundra5 from './tundra5.png'
import Tundra6 from './tundra6.png'
import Tundra7 from './tundra7.png'
import Tundra8 from './tundra8.png'
import Tundra9 from './tundra9.png'
import Tundra10 from './tundra10.png'
import Tundra11 from './tundra11.png'
import Tundra12 from './tundra12.png'
import Tundra13 from './tundra13.png'
import Tundra14 from './tundra14.png'
import Tundra15 from './tundra15.png'
import Tundra16 from './tundra16.png'
import Tundra17 from './tundra17.png'
import Tundra18 from './tundra18.png'

export const tundraAssets: ThemeAsset = {
	monstera: [Tundra1, Tundra2, Tundra3, Tundra4, Tundra5, Tundra6],
	broadleaf: [Tundra7, Tundra8, Tundra9, Tundra10, Tundra11, Tundra12],
	bloom: [Tundra13, Tundra14, Tundra15, Tundra16, Tundra17, Tundra18]
}

export const tundraScatterGroups = [
	{key: 'monstera'},
	{key: 'broadleaf'},
	{key: 'bloom', scale: 0.65},
] as const
