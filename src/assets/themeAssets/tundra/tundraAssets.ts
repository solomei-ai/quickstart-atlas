import type {ThemeAsset} from "../themeAsset.ts";
import Tundra1 from './tundra1.webp'
import Tundra2 from './tundra2.webp'
import Tundra3 from './tundra3.webp'
import Tundra4 from './tundra4.webp'
import Tundra5 from './tundra5.webp'
import Tundra6 from './tundra6.webp'
import Tundra7 from './tundra7.webp'
import Tundra8 from './tundra8.webp'
import Tundra9 from './tundra9.webp'
import Tundra10 from './tundra10.webp'
import Tundra11 from './tundra11.webp'
import Tundra12 from './tundra12.webp'
import Tundra13 from './tundra13.webp'
import Tundra14 from './tundra14.webp'
import Tundra15 from './tundra15.webp'
import Tundra16 from './tundra16.webp'
import Tundra17 from './tundra17.webp'
import Tundra18 from './tundra18.webp'

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
