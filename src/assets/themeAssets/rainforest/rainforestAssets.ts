import type {ThemeAsset} from "../themeAsset.ts";
import RainForest1 from './rainforest1.png'
import RainForest2 from './rainforest2.png'
import RainForest3 from './rainforest3.png'
import RainForest4 from './rainforest4.png'
import RainForest5 from './rainforest5.png'
import RainForest6 from './rainforest6.png'
import RainForest7 from './rainforest7.png'
import RainForest8 from './rainforest8.png'
import RainForest9 from './rainforest9.png'
import RainForest10 from './rainforest10.png'
import RainForest11 from './rainforest11.png'
import RainForest12 from './rainforest12.png'
import RainForest13 from './rainforest13.png'
import RainForest14 from './rainforest14.png'
import RainForest15 from './rainforest15.png'
import RainForest16 from './rainforest16.png'
import RainForest17 from './rainforest17.png'
import RainForest18 from './rainforest18.png'
import RainForest19 from './rainforest19.png'

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