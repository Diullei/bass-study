import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { LegacyLessonRedirect } from './features/method/MethodRoutes'
import { Metronome } from './features/metronome/Metronome'
import { Settings } from './features/settings/Settings'
import { MetronomeTempoProvider } from './features/metronome/MetronomeTempo'
import { CoverPage } from './pages/CoverPage'
import { DesignSystemPage } from './pages/DesignSystemPage'
import { SECTIONS } from './sections'
import { AppStateProvider } from './state/AppState'

export function App() {
  return (
    <AppStateProvider>
      <MetronomeTempoProvider>
        {/* BASE_URL is "/bass-study/" on GitHub Pages and "/" in dev */}
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<CoverPage />} />
            {SECTIONS.map((sec) => (
              <Route key={sec.id} path={`${sec.path}/*`} element={sec.routes} />
            ))}
            <Route path="/design-system" element={<DesignSystemPage />} />
            <Route path="/lesson/:id" element={<LegacyLessonRedirect />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {/* one metronome for the whole app: it keeps running as you move between pages */}
          <Metronome />
          {/* the notebook's settings, always one click away */}
          <Settings />
        </BrowserRouter>
      </MetronomeTempoProvider>
    </AppStateProvider>
  )
}
