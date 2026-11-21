import { Link } from 'react-router'
import { KEYS, load } from '../../state/storage'
import { lessonById, LESSONS } from './lessons'
import { harmonyLessonPath, RULES_PATH } from './paths'
import { useHarmonyProgress } from './progress'
import s from '../method/MethodSummary.module.css'

/** The course's line on the contents page. */
export function HarmonySummary() {
  const { learned } = useHarmonyProgress()
  const done = LESSONS.filter((L) => learned(L.id)).length
  const cur = lessonById(load<string>(KEYS.harmonyCurrent, ''))
  const pct = Math.round((done / LESSONS.length) * 100)
  return (
    <div className={s.summary}>
      <div className={s.progress} role="img" aria-label={`${done} of ${LESSONS.length} lessons learned`}>
        <span className={s.fill} style={{ width: `${pct}%` }} />
      </div>
      <span className={s.count}>
        {done} of {LESSONS.length} learned
      </span>
      <Link className={s.go} to={cur ? harmonyLessonPath(cur.id) : RULES_PATH}>
        {cur ? `Continue: ${LESSONS.indexOf(cur) + 1}. ${cur.title}` : 'Start with the seven rules'} →
      </Link>
    </div>
  )
}
