import { Link } from 'react-router'
import { useAppState } from '../../state/AppState'
import styles from './MethodSummary.module.css'
import { lessonPath } from './paths'

/** The method's line on the contents page: progress and where to pick up. */
export function MethodSummary() {
  const { lessons, mastered, currentId } = useAppState()
  const done = lessons.filter(mastered).length
  const current = lessons.find((L) => L.id === currentId) ?? lessons[0]
  const k = lessons.indexOf(current)
  const fresh = done === 0 && k === 0
  const pct = Math.round((done / lessons.length) * 100)

  return (
    <div className={styles.summary}>
      <div className={styles.progress} role="img" aria-label={`${done} of ${lessons.length} lessons mastered`}>
        <span className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.count}>
        {done} of {lessons.length} mastered
      </span>
      <Link className={styles.go} to={lessonPath(current.id)}>
        {fresh ? 'Start at lesson 1' : `Continue: ${k + 1}. ${current.t}`} →
      </Link>
    </div>
  )
}
