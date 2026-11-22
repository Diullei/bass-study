import { Link } from 'react-router'
import { KEYS, load } from '../../state/storage'
import { chapterById, CHAPTERS } from './chapters'
import { chapterPath, LAWS_PATH } from './paths'
import { useChordsProgress } from './progress'
import s from '../method/MethodSummary.module.css'

/** The method's line on the contents page. */
export function ChordsSummary() {
  const { learned } = useChordsProgress()
  const done = CHAPTERS.filter((c) => learned(c.id)).length
  const cur = chapterById(load<string>(KEYS.chordsCurrent, ''))
  const pct = Math.round((done / CHAPTERS.length) * 100)
  return (
    <div className={s.summary}>
      <div className={s.progress} role="img" aria-label={`${done} of ${CHAPTERS.length} chapters ready`}>
        <span className={s.fill} style={{ width: `${pct}%` }} />
      </div>
      <span className={s.count}>
        {done} of {CHAPTERS.length} ready
      </span>
      <Link className={s.go} to={cur ? chapterPath(cur.id) : LAWS_PATH}>
        {cur ? `Continue: ${CHAPTERS.indexOf(cur) + 1}. ${cur.title}` : 'Start with the five laws'} →
      </Link>
    </div>
  )
}
