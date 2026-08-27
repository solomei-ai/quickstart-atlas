import {create} from 'zustand';
import type {BackgroundVariant} from '../components/Background/Background';

type BackgroundState = {
	variant: BackgroundVariant;
	setVariant: (variant: BackgroundVariant) => void;
};

// Global background state so any section of the site can switch the
// backdrop (e.g. on scroll into view) without prop-drilling through App.
export const useBackgroundStore = create<BackgroundState>(set => ({
	variant: 'none',
	setVariant: variant => set({variant}),
}));
