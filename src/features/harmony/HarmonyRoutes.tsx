import { Navigate, Route, Routes } from 'react-router'
import { HarmonyHome } from './HarmonyHome'
import { HarmonyLessonPage } from './HarmonyLessonPage'
import { HARMONY_PATH } from './paths'
import { RulesPage } from './RulesPage'
import { CheatSheetPage, WorkshopPage } from './ToolPages'

/** Everything under /harmony. */
export function HarmonyRoutes() {
  return (
    <Routes>
      <Route index element={<HarmonyHome />} />
      <Route path="rules" element={<RulesPage />} />
      <Route path="workshop" element={<WorkshopPage />} />
      <Route path="cheat-sheet" element={<CheatSheetPage />} />
      <Route path=":id" element={<HarmonyLessonPage />} />
      <Route path="*" element={<Navigate to={HARMONY_PATH} replace />} />
    </Routes>
  )
}
