import type { Lesson } from '../curriculum/types'
import { genChart } from './chart'
import { genReading, genSong, genStudy } from './reading'
import type { GenSettings, Score } from './types'

export type * from './types'
export { lessonIntro, type Fact } from './lessonIntro'

/** A fresh exercise for a lesson, or null when the lesson has none. */
export function generate(L: Lesson, S: GenSettings): Score | null {
  if (L.noEx) return null
  if (L.song) return genSong(L, S)
  if (L.chart) return genChart(L, S)
  if (L.study) return genStudy(L, S)
  return genReading(L, S)
}

export type ExerciseKind = 'song' | 'chart' | 'study' | 'reading'
export const exerciseKind = (L: Lesson): ExerciseKind =>
  L.song ? 'song' : L.chart ? 'chart' : L.study ? 'study' : 'reading'
