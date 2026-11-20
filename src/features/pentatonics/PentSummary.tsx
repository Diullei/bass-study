import { Link } from 'react-router'
import { KEYS, load } from '../../state/storage'
import { lessonById, LESSONS } from './lessons'
import { PENT_PATH, pentLessonPath } from './paths'
import { usePentProgress } from './progress'
import s from '../method/MethodSummary.module.css'

/** The class's line on the contents page. */
export function PentSummary() {
  const { learned } = usePentProgress()
  const done = LESSONS.filter((L) => learned(L.id)).length
  const cur = lessonById(load<string>(KEYS.pentCurrent, ''))
  const pct = Math.round((done / LESSONS.length) * 100)
  return (
    <div className={s.summary}>
      <div className={s.progress} role="img" aria-label={`${done} of ${LESSONS.length} lessons learned`}>
        <span className={s.fill} style={{ width: `${pct}%` }} />
      </div>
      <span className={s.count}>
        {done} of {LESSONS.length} learned
      </span>
      <Link className={s.go} to={cur ? pentLessonPath(cur.id) : PENT_PATH}>
        {cur ? `Continue: ${LESSONS.indexOf(cur) + 1}. ${cur.title}` : 'Open the class'} →
      </Link>
    </div>
  )
}
