import { RL } from '../theory/rhythm'
import { LESSON_DEFS } from './lessonDefs'
import { SONGS } from './songs'
import type { Lesson } from './types'

export { UNITS } from './units'
export { SONGS } from './songs'
export { FORMS } from './forms'
export type * from './types'

/** Lessons with derived fields (id, defaults, newly introduced rhythms). */
export const LESSONS: Lesson[] = LESSON_DEFS.reduce<Lesson[]>((out, def, i) => {
  const R = def.R || (def.chart ? 2 : def.study ? 6 : 5)
  const prevR = Math.max(0, ...out.filter((P) => !P.chart && !P.song).map((P) => P.R || 0))
  const L: Lesson = {
    ...def,
    i,
    id: def.t.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    time: def.time || 4,
    R,
    newR: !def.chart && !def.song && R > prevR ? RL[R].slice() : [],
  }
  if (L.song) L.b = L.b || SONGS[L.song].b
  if (!L.quiz && (L.nw || L.nwAbove)) L.quiz = { types: ['note'], n: 20 }
  out.push(L)
  return out
}, [])

export const lessonById = (id: string) => LESSONS.find((L) => L.id === id)
