import type {ThemeAsset} from "../themeAsset.ts";
import RainForest1 from './rainforest1.webp'
import RainForest2 from './rainforest2.webp'
import RainForest3 from './rainforest3.webp'
import RainForest4 from './rainforest4.webp'
import RainForest5 from './rainforest5.webp'
import RainForest6 from './rainforest6.webp'
import RainForest7 from './rainforest7.webp'
import RainForest8 from './rainforest8.webp'
import RainForest9 from './rainforest9.webp'
import RainForest10 from './rainforest10.webp'
import RainForest11 from './rainforest11.webp'
import RainForest12 from './rainforest12.webp'
import RainForest13 from './rainforest13.webp'
import RainForest14 from './rainforest14.webp'
import RainForest15 from './rainforest15.webp'
import RainForest16 from './rainforest16.webp'
import RainForest17 from './rainforest17.webp'
import RainForest18 from './rainforest18.webp'
import RainForest19 from './rainforest19.webp'

export const rainForestAssets: ThemeAsset = {
	monstera: [RainForest1, RainForest2, RainForest3, RainForest4, RainForest5, RainForest6],
	broadleaf: [RainForest7, RainForest8, RainForest9, RainForest10, RainForest11, RainForest12],
	bloom: [RainForest13, RainForest14, RainForest15, RainForest16, RainForest17, RainForest18, RainForest19]
}

export const rainforestScatterGroups = [
	{key: 'monstera'},
	{key: 'broadleaf'},
	{key: 'bloom', scale: 0.65},
] as const