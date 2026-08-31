import type {ThemeAsset} from "../themeAsset.ts";
import Desert1 from './desert1.webp'
import Desert2 from './desert2.webp'
import Desert3 from './desert3.webp'
import Desert4 from './desert4.webp'
import Desert5 from './desert5.webp'
import Desert6 from './desert6.webp'
import Desert7 from './desert7.webp'
import Desert8 from './desert8.webp'
import Desert9 from './desert9.webp'
import Desert10 from './desert10.webp'
import Desert11 from './desert11.webp'
import Desert12 from './desert12.webp'
import Desert13 from './desert13.webp'
import Desert14 from './desert14.webp'
import Desert15 from './desert15.webp'
import Desert16 from './desert16.webp'
import Desert17 from './desert17.webp'
import Desert18 from './desert18.webp'
import Desert19 from './desert19.webp'

export const desertAssets: ThemeAsset = {
	monstera: [Desert1, Desert2, Desert3, Desert4, Desert5, Desert6],
	broadleaf: [Desert7, Desert8, Desert9, Desert10, Desert11, Desert12],
	bloom: [Desert13, Desert14, Desert15, Desert16, Desert17, Desert18, Desert19]
}

export const desertScatterGroups = [
	{key: 'monstera'},
	{key: 'broadleaf'},
	{key: 'bloom', scale: 0.65},
] as const
