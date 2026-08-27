import {create} from 'zustand';

type LoadingState = {
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	isGenerating: boolean;
	setIsGenerating: (isGenerating: boolean) => void;
	isTransitioning: boolean;
	setIsTransitioning: (isTransitioning: boolean) => void;
};

// The loader's intro fully covers the viewport by ~2.2s (see useLoaderScroll's
// PRE_SCROLL_DELAY_MS). Hold it at least this long so a fast round or a
// cached story switch never flashes it in and straight back out.
const MIN_LOADING_MS = 1800;

// Global loading state so any section of the site can trigger/read the
// loading indicator without prop-drilling through App.
export const useLoadingStore = create<LoadingState>(set => {
	let startedAt = 0;
	let offTimer: ReturnType<typeof setTimeout> | undefined;

	return {
		isLoading: false,
		setIsLoading: isLoading => {
			if (isLoading) {
				// Starting (or restarting) a load: cancel any pending turn-off and
				// reset the clock so the minimum window is measured from now.
				if (offTimer) {
					clearTimeout(offTimer);
					offTimer = undefined;
				}
				startedAt = Date.now();
				set({isLoading: true});
				return;
			}

			// Turning off: honour the minimum visible duration.
			const remaining = MIN_LOADING_MS - (Date.now() - startedAt);
			if (offTimer) clearTimeout(offTimer);
			if (remaining <= 0) {
				offTimer = undefined;
				set({isLoading: false});
				return;
			}
			offTimer = setTimeout(() => {
				offTimer = undefined;
				set({isLoading: false});
			}, remaining);
		},
		isTransitioning: false,
		setIsTransitioning: (isTransitioning: boolean) => set({isTransitioning}),
		isGenerating: false,
		setIsGenerating: (isGenerating: boolean) => set({isGenerating})
	};
});
