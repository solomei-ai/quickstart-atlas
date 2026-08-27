import {useEffect, useRef} from "react";
import {useLenis} from "lenis/react";
import {useConversationStore} from "../stores/conversationStore.ts";

// Fixed header: 32px top padding + intrinsic logo height. Scrolling a round
// flush to the viewport top would leave it underneath.
export const HEADER_SCROLL_OFFSET = -100;

// The loader fully covers the viewport by this point in its intro, so the
// instant jump to the incoming round's position happens out of sight.
const PRE_SCROLL_DELAY_MS = 2200;

/**
 * Orchestrates scrolling while the loader is up: locks scrolling and
 * pre-positions the viewport where the incoming round will render. Returns
 * refs to attach to the latest round's div and the scroll-room spacer.
 */
export function useLoaderScroll(isLoading: boolean) {
  const lenis = useLenis();
  const isSwitchPending = useConversationStore(state => state.isSwitchPending);
  const latestRoundRef = useRef<HTMLDivElement>(null);
  const scrollRoomRef = useRef<HTMLDivElement>(null);

  // Lock scrolling while the loader is up.
  useEffect(() => {
    if (!lenis) return;
    if (isLoading) lenis.stop(); else lenis.start();
  }, [lenis, isLoading]);

  // Pre-position the viewport while the loader still hides the page: shortly
  // after a round starts, jump instantly to where its content will render, so
  // blocks stream in below an already-settled scroll position instead of the
  // scroll chasing content that keeps reordering.
  useEffect(() => {
    // A conversation switch positions the viewport itself (App scrolls to the
    // tapped round). Suppress this pre-scroll for the whole switch loader window
    // so it can't clobber that target with a jump to the latest round.
    if (!isLoading || !lenis || isSwitchPending) return;
    const timer = window.setTimeout(() => {
      // The new chapter's div normally mounts (still empty) well before the
      // timer fires — its top is exactly where content will appear. If the
      // chapter event hasn't landed yet, the last round ref is stale (it still
      // points at the previous, non-empty round); the spacer then sits exactly
      // where the new round will mount, so target that instead.
      const round = latestRoundRef.current;
      const target = round && round.childElementCount === 0 ? round : scrollRoomRef.current;
      if (target) lenis.scrollTo(target, {offset: HEADER_SCROLL_OFFSET, immediate: true, force: true});
    }, PRE_SCROLL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [lenis, isLoading, isSwitchPending]);

  return {latestRoundRef, scrollRoomRef};
}
