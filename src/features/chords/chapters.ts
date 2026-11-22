import { CHAPTERS_1 } from './chapters1'
import { CHAPTERS_2 } from './chapters2'
import type { Chapter } from './types'

export const PARTS = ['Setup', 'Two notes', 'Three notes', 'Colour', 'Other piano systems', 'Playing music', 'Tone lab']
/** Weeks of the practice plan for each part. */
export const PART_WEEKS = ['week 1', 'weeks 2–5', 'weeks 6–13', 'weeks 14–25', 'weeks 26–33', 'weeks 34–40', 'use from week 1']

export const CHAPTERS: Chapter[] = [...CHAPTERS_1, ...CHAPTERS_2]

export const chapterById = (id: string) => CHAPTERS.find((c) => c.id === id)
