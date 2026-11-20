import { Navigate, Route, Routes } from 'react-router'
import { IdeaBuilderPage } from './IdeaBuilderPage'
import { IDEAS_PATH } from './params'

/** Everything under /ideas. */
export function IdeaRoutes() {
  return (
    <Routes>
      <Route index element={<IdeaBuilderPage />} />
      <Route path="*" element={<Navigate to={IDEAS_PATH} replace />} />
    </Routes>
  )
}
