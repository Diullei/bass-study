import { Navigate, Route, Routes, useParams } from 'react-router'
import { useAppState } from '../../state/AppState'
import { LessonPage } from './LessonPage'
import { lessonPath } from './paths'

/** /method opens the lesson you were on last. */
function Resume() {
  const { currentId } = useAppState()
  return <Navigate to={lessonPath(currentId)} replace />
}

/** Everything under /method. */
export function MethodRoutes() {
  return (
    <Routes>
      <Route index element={<Resume />} />
      <Route path="lesson/:id" element={<LessonPage />} />
      <Route path="*" element={<Resume />} />
    </Routes>
  )
}

/** Old links (/lesson/:id, before the cover existed) still land on the lesson. */
export function LegacyLessonRedirect() {
  const { id = '' } = useParams()
  return <Navigate to={lessonPath(id)} replace />
}
