import { Link } from 'react-router'
import { KEYS, load } from '../../state/storage'
import { progressionById } from './harmony'
import { LAYERS } from './model'
import { IDEAS_PATH, readParams } from './params'
import s from '../method/MethodSummary.module.css'

/** The Idea Builder's line on the contents page: pick up the last idea. */
export function IdeaSummary() {
  const last = load<string>(KEYS.ideasLast, '')
  if (!last)
    return (
      <div className={s.summary}>
        <Link className={s.go} to={IDEAS_PATH}>
          Build your first idea →
        </Link>
      </div>
    )
  const P = readParams(new URLSearchParams(last))
  const on = LAYERS.filter((L) => P.layers[L.id]).length
  return (
    <div className={s.summary}>
      <span className={s.count}>
        last: idea #{P.seed} · {progressionById(P.prog).name} · {on} of {LAYERS.length} layers
      </span>
      <Link className={s.go} to={`${IDEAS_PATH}?${last}`}>
        Pick it up →
      </Link>
    </div>
  )
}
