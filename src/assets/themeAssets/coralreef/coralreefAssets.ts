import type {ThemeAsset} from "../themeAsset.ts";
import CoralReef1 from './coralreef1.png'
import CoralReef2 from './coralreef2.png'
import CoralReef3 from './coralreef3.png'
import CoralReef4 from './coralreef4.png'
import CoralReef5 from './coralreef5.png'
import CoralReef6 from './coralreef6.png'
import CoralReef7 from './coralreef7.png'
import CoralReef8 from './coralreef8.png'
import CoralReef9 from './coralreef9.png'
import CoralReef10 from './coralreef10.png'
import CoralReef11 from './coralreef11.png'
import CoralReef12 from './coralreef12.png'
import CoralReef13 from './coralreef13.png'
import CoralReef14 from './coralreef14.png'
import CoralReef15 from './coralreef15.png'
import CoralReef16 from './coralreef16.png'
import CoralReef17 from './coralreef17.png'
import CoralReef18 from './coralreef18.png'

export const coralReefAssets: ThemeAsset = {
	monstera: [CoralReef1, CoralReef2, CoralReef3, CoralReef4, CoralReef5, CoralReef6],
	broadleaf: [CoralReef7, CoralReef8, CoralReef9, CoralReef10, CoralReef11, CoralReef12],
	bloom: [CoralReef13, CoralReef14, CoralReef15, CoralReef16, CoralReef17, CoralReef18]
}

export const coralReefScatterGroups = [
	{key: 'monstera'},
	{key: 'broadleaf'},
	{key: 'bloom', scale: 0.65},
] as const
