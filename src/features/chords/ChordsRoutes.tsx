import { Navigate, Route, Routes } from 'react-router'
import { ChapterPage } from './ChapterPage'
import { ChordsHome } from './ChordsHome'
import { LawsPage } from './LawsPage'
import { CHORDS_PATH } from './paths'
import { CheckerPage, FinderPage, GeneratorPage, TestsPage } from './ToolPages'

/** Everything under /chords. */
export function ChordsRoutes() {
  return (
    <Routes>
      <Route index element={<ChordsHome />} />
      <Route path="laws" element={<LawsPage />} />
      <Route path="test-progressions" element={<TestsPage />} />
      <Route path="generator" element={<GeneratorPage />} />
      <Route path="finder" element={<FinderPage />} />
      <Route path="checker" element={<CheckerPage />} />
      <Route path=":id" element={<ChapterPage />} />
      <Route path="*" element={<Navigate to={CHORDS_PATH} replace />} />
    </Routes>
  )
}
