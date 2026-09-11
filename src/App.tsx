// ─────────────────────────────────────────────────────────────────────────────
// The Field Guide — a Callimacus front end, revealed in three stages.
//
// Everything you need is already here. You never write code: you delete
// comment markers, in the order the Quickstart tells you to, and watch the
// page gain a capability at each step.
//
//   STAGE 1  (done)          the styled shell — no Callimacus at all
//   STAGE 2  (done)          connect to your project
//   STAGE 3  (done)          render the blocks your project composes
// ─────────────────────────────────────────────────────────────────────────────

import styles from './App.module.scss'
import Background from "./components/Background/Background.tsx";
import Header from "./components/Header/Header.tsx";
import Home from "./components/Home/Home.tsx";
import Footer from "./components/Footer/Footer.tsx";

// ── STAGE 2 ── connected to Callimacus ─────────────────────────────────────
import {useInitThamyr, useConnection} from '@solomei-ai/thamyr-react';
import {useThamyrConversation} from "./thamyr/useThamyrConversation.ts";
import useConnectionEvent from "./hooks/useConnectionEvent.ts";
import {useSwitchScroll} from "./hooks/useSwitchScroll.ts";
import Loader from "./components/Loading/Loader.tsx";
import {AnimatePresence} from "motion/react";
import {useLoadingStore} from "./stores/loadingStore.ts";
import TimelineMarker from "./components/TimelineMarker/TimelineMarker.tsx";

// ── STAGE 3 ── composed blocks ─────────────────────────────────────────────
import Conversation from "./components/Conversation/Conversation.tsx";

function App() {

  // ── STAGE 2 ── the socket is open and connection state is readable ───────
  useInitThamyr({
    clientId: import.meta.env.VITE_CALLIMACUS_CLIENT_ID as string,
  });

  const {status} = useConnection();
  useConnectionEvent();
  const {isTransitioning, isLoading, handleSend} = useThamyrConversation();
  const isGenerating = useLoadingStore(state => state.isGenerating);
  useSwitchScroll();

  return (
    <>
      <main className={styles.app}>
        <Header />
        <Home />

        {/* ── STAGE 3 ── the round's blocks ──────────────────────────────── */}
        <Conversation />
      </main>
      <Background />

      {/* ── STAGE 2 ── the deep-time rail and the loader ─────────────────── */}
      <TimelineMarker />
      <AnimatePresence>
        {isLoading ? <Loader isPlain={isTransitioning} /> : null}
      </AnimatePresence>

      {/* ── STAGE 2 ── the prompt bar is live ────────────────────────────── */}
      <Footer isSendDisabled={status !== 'connected' || isLoading} isLoading={isGenerating} onSend={handleSend} />
    </>
  )
}

export default App
