import {useEffect} from "react";
import {useLenis} from "lenis/react";
import {useConversationStore} from "../stores/conversationStore.ts";
import {useLoadingStore} from "../stores/loadingStore.ts";
import {HEADER_SCROLL_OFFSET} from "./useLoaderScroll.ts";

/**
 * Lands a conversation switch. Once the switched-in story's chapters have
 * rendered, jumps the viewport to the tapped round — still behind the loader —
 * then disarms the switch and drops the loader to reveal it.
 */
export function useSwitchScroll() {
  const lenis = useLenis();
  const chapters = useConversationStore(state => state.chapters);
  const isSwitchPending = useConversationStore(state => state.isSwitchPending);
  const switchTargetChapterId = useConversationStore(state => state.switchTargetChapterId);
  const endSwitch = useConversationStore(state => state.endSwitch);
  const setIsLoading = useLoadingStore(state => state.setIsLoading);
  const setIsTransitioning = useLoadingStore(state => state.setIsTransitioning);

  useEffect(() => {
    if (!isSwitchPending || !lenis || chapters.length === 0) return;
    const frame = requestAnimationFrame(() => {
      lenis.resize();
      const target = switchTargetChapterId && document.getElementById(`round-${switchTargetChapterId}`);
      if (target) lenis.scrollTo(target, {offset: HEADER_SCROLL_OFFSET, immediate: true, force: true});
      endSwitch();
      setIsLoading(false);
      setIsTransitioning(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [isSwitchPending, switchTargetChapterId, chapters, lenis, endSwitch, setIsLoading, setIsTransitioning]);
}
