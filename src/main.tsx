import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initIntent } from '@solomei-ai/intent'
import 'lenis/dist/lenis.css'
import './styles/main.scss'
import App from './App.tsx'
import { I18nProvider } from './i18n/I18nProvider.tsx'
import SmoothScroll from './components/SmoothScroll/SmoothScroll.tsx'

// Client-only intent tracker: captures consented interaction events and ships
// them to Callimacus. Uses the same tenant client ID as Thamyr, and is
// the app's only Intent touch point — there is no per-component instrumentation.
// Add `debug: true` to log every captured event to the console.
initIntent({
  clientId: import.meta.env.VITE_CALLIMACUS_CLIENT_ID as string,
  // Hard-coded for the demo. A real integration must not do this: capture is
  // only lawful once the visitor has agreed, so pass the answer your consent
  // banner (or CMP) actually collected, and re-init if they change it.
  consent: true,
  geo: false,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <SmoothScroll>
        <App />
      </SmoothScroll>
    </I18nProvider>
  </StrictMode>,
)
