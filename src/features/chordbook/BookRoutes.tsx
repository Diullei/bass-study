import { Navigate, Route, Routes } from 'react-router'
import { BookHome } from './BookHome'
import { ExercisePage } from './ExercisePage'
import { BOOK_PATH } from './paths'

/** Everything under /chord-exercises. */
export function BookRoutes() {
  return (
    <Routes>
      <Route index element={<BookHome />} />
      <Route path=":id" element={<ExercisePage />} />
      <Route path="*" element={<Navigate to={BOOK_PATH} replace />} />
    </Routes>
  )
}
