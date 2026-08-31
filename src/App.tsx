// ─────────────────────────────────────────────────────────────────────────────
// The Field Guide — a Callimacus front end, revealed in three stages.
//
// Everything you need is already here. You never write code: you delete
// comment markers, in the order the Quickstart tells you to, and watch the
// page gain a capability at each step.
//
//   STAGE 1  (now)          the styled shell — no Callimacus at all
//   STAGE 2  (part 2 §3)    connect to your project
//   STAGE 3  (part 2 §3)    render the blocks your project composes
// ─────────────────────────────────────────────────────────────────────────────

import styles from './App.module.scss'
import Background from "./components/Background/Background.tsx";
import Header from "./components/Header/Header.tsx";
import Home from "./components/Home/Home.tsx";
import Footer from "./components/Footer/Footer.tsx";

// ── STAGE 2 ── uncomment this block to connect to Callimacus ────────────────
// import {useInitThamyr, useConnection} from '@solomei-ai/thamyr-react';
// import {useThamyrConversation} from "./thamyr/useThamyrConversation.ts";
// import useConnectionEvent from "./hooks/useConnectionEvent.ts";
// import {useSwitchScroll} from "./hooks/useSwitchScroll.ts";
// import Loader from "./components/Loading/Loader.tsx";
// import {AnimatePresence} from "motion/react";
// import {useLoadingStore} from "./stores/loadingStore.ts";
// import TimelineMarker from "./components/TimelineMarker/TimelineMarker.tsx";

// ── STAGE 3 ── uncomment this line to render composed blocks ───────────────
// import Conversation from "./components/Conversation/Conversation.tsx";

function App() {

  // ── STAGE 2 ── uncomment to open the socket and read connection state ────
  // useInitThamyr({
  //   clientId: import.meta.env.VITE_CALLIMACUS_CLIENT_ID as string,
  // });
  //
  // const {status} = useConnection();
  // useConnectionEvent();
  // const {isTransitioning, isLoading, handleSend} = useThamyrConversation();
  // const isGenerating = useLoadingStore(state => state.isGenerating);
  // useSwitchScroll();

  return (
    <>
      <main className={styles.app}>
        <Header />
        <Home />

        {/* ── STAGE 3 ── uncomment to render the round's blocks ──────────── */}
        {/* <Conversation /> */}
      </main>
      <Background />

      {/* ── STAGE 2 ── uncomment for the deep-time rail and the loader ───── */}
      {/* <TimelineMarker/> */}
      {/* <AnimatePresence> */}
      {/*   {isLoading ? <Loader isPlain={isTransitioning} /> : null} */}
      {/* </AnimatePresence> */}

      {/* STAGE 1: the prompt bar is inert — nothing is wired to it yet. */}
      <Footer isSendDisabled />

      {/* ── STAGE 2 ── swap the line above for this one to make it live ──── */}
      {/* <Footer isSendDisabled={status !== 'connected' || isLoading} isLoading={isGenerating} onSend={handleSend} /> */}
    </>
  )
}

export default App
