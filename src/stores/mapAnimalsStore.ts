import {create} from 'zustand';
import type {Animal} from '../types/animals.ts';

type MapAnimalsState = {
	mapAnimals: Animal[];
	setMapAnimals: (mapAnimals: Animal[]) => void;
	// The `discoveryFeed` block that seeds the map also carries an `intent`
	// string (what the visitor seems to gravitate toward), surfaced in IntentTab.
	intent: string;
	setIntent: (intent: string) => void;
};

// Global store for the animals rendered on the world map so any section of the
// site can read/populate them without prop-drilling through App.
export const useMapAnimalsStore = create<MapAnimalsState>(set => ({
	mapAnimals: [],
	setMapAnimals: mapAnimals => set({mapAnimals}),
	intent: '',
	setIntent: intent => set({intent}),
}));
