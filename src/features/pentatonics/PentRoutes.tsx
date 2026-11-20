import { Navigate, Route, Routes } from 'react-router'
import { ClassPage } from './ClassPage'
import { MapPage } from './MapPage'
import { PentLessonPage } from './PentLessonPage'
import { PENT_PATH } from './paths'

/** Everything under /pentatonics. */
export function PentRoutes() {
  return (
    <Routes>
      <Route index element={<ClassPage />} />
      <Route path="map" element={<MapPage />} />
      <Route path=":id" element={<PentLessonPage />} />
      <Route path="*" element={<Navigate to={PENT_PATH} replace />} />
    </Routes>
  )
}
