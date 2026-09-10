import type {ThemeAsset} from "../themeAsset.ts";
import Desert1 from './desert1.png'
import Desert2 from './desert2.png'
import Desert3 from './desert3.png'
import Desert4 from './desert4.png'
import Desert5 from './desert5.png'
import Desert6 from './desert6.png'
import Desert7 from './desert7.png'
import Desert8 from './desert8.png'
import Desert9 from './desert9.png'
import Desert10 from './desert10.png'
import Desert11 from './desert11.png'
import Desert12 from './desert12.png'
import Desert13 from './desert13.png'
import Desert14 from './desert14.png'
import Desert15 from './desert15.png'
import Desert16 from './desert16.png'
import Desert17 from './desert17.png'
import Desert18 from './desert18.png'
import Desert19 from './desert19.png'

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
