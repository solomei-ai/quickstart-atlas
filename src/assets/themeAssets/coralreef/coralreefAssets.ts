import type {ThemeAsset} from "../themeAsset.ts";
import CoralReef1 from './coralreef1.webp'
import CoralReef2 from './coralreef2.webp'
import CoralReef3 from './coralreef3.webp'
import CoralReef4 from './coralreef4.webp'
import CoralReef5 from './coralreef5.webp'
import CoralReef6 from './coralreef6.webp'
import CoralReef7 from './coralreef7.webp'
import CoralReef8 from './coralreef8.webp'
import CoralReef9 from './coralreef9.webp'
import CoralReef10 from './coralreef10.webp'
import CoralReef11 from './coralreef11.webp'
import CoralReef12 from './coralreef12.webp'
import CoralReef13 from './coralreef13.webp'
import CoralReef14 from './coralreef14.webp'
import CoralReef15 from './coralreef15.webp'
import CoralReef16 from './coralreef16.webp'
import CoralReef17 from './coralreef17.webp'
import CoralReef18 from './coralreef18.webp'

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
