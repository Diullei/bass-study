import { Link } from 'react-router'
import { EXERCISES, numberOf } from './exercises'
import { exercisePath } from './paths'
import { useBookProgress } from './progress'
import s from '../method/MethodSummary.module.css'

/** The book's line on the contents page. */
export function BookSummary() {
  const { count, next } = useBookProgress()
  const pct = Math.round((count / EXERCISES.length) * 100)
  return (
    <div className={s.summary}>
      <div className={s.progress} role="img" aria-label={`${count} of ${EXERCISES.length} exercises done`}>
        <span className={s.fill} style={{ width: `${pct}%` }} />
      </div>
      <span className={s.count}>
        {count} of {EXERCISES.length} done
      </span>
      <Link className={s.go} to={exercisePath(next.id)}>
        {count ? 'Continue' : 'Start'}: Exercise {numberOf(next)}. {next.title} →
      </Link>
    </div>
  )
}
