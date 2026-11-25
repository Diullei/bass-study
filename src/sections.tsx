import type { ComponentType, ReactElement } from 'react'
import { UNITS } from './curriculum/lessons'
import { MethodRoutes } from './features/method/MethodRoutes'
import { MethodSummary } from './features/method/MethodSummary'
import { METHOD_PATH } from './features/method/paths'
import { IdeaRoutes } from './features/ideas/IdeaRoutes'
import { IdeaSummary } from './features/ideas/IdeaSummary'
import { IDEAS_PATH } from './features/ideas/params'
import { HarmonyRoutes } from './features/harmony/HarmonyRoutes'
import { HarmonySummary } from './features/harmony/HarmonySummary'
import { HARMONY_PATH } from './features/harmony/paths'
import { ChordsRoutes } from './features/chords/ChordsRoutes'
import { ChordsSummary } from './features/chords/ChordsSummary'
import { CHORDS_PATH } from './features/chords/paths'
import { BookRoutes } from './features/chordbook/BookRoutes'
import { BookSummary } from './features/chordbook/BookSummary'
import { EXERCISES } from './features/chordbook/exercises'
import { BOOK_PATH } from './features/chordbook/paths'
import { PENT_PATH } from './features/pentatonics/paths'
import { PentRoutes } from './features/pentatonics/PentRoutes'
import { PentSummary } from './features/pentatonics/PentSummary'

/**
 * A section of the notebook: one feature with its own routes and a line on the contents page.
 * To add a feature: build it in src/features/<name>/ with a <Routes> component, then add it here.
 */
export interface NotebookSection {
  id: string
  title: string
  /** One or two sentences for the contents page. */
  blurb: string
  /** Mount point. The section owns every URL below it. */
  path: string
  /** Renders the section's own <Routes> (paths relative to `path`). */
  routes: ReactElement
  /** Live status on the contents page: progress, a "continue" link. */
  Summary?: ComponentType
  /** Right of the dotted leader, e.g. "18 units". */
  meta?: string
  /** Index-tab colour, a --tab-* token. */
  tab: string
  /** Short name on the index tab. */
  tabLabel: string
}

export const SECTIONS: NotebookSection[] = [
  {
    id: 'method',
    title: 'Bass Method',
    blurb:
      'From the open strings to walking bass: reading, rhythm, scales, chords and jazz harmony, a lesson at a time — with exercises, quizzes and play-along.',
    path: METHOD_PATH,
    routes: <MethodRoutes />,
    Summary: MethodSummary,
    meta: `${UNITS.length} units`,
    tab: 'var(--tab-blue)',
    tabLabel: 'Method',
  },
  {
    id: 'ideas',
    title: 'Idea Builder',
    blurb:
      'Build a bass line the way players think: start from the bare scale and add one layer at a time — targets, rhythm, guide tones, approach notes, motifs, shape and feel — and hear what each one adds.',
    path: IDEAS_PATH,
    routes: <IdeaRoutes />,
    Summary: IdeaSummary,
    meta: '8 layers',
    tab: 'var(--tab-green)',
    tabLabel: 'Ideas',
  },
  {
    id: 'pentatonics',
    title: 'Pentatonics',
    blurb:
      'A class in six parts, from the first five-note shape to weaving pentatonics through chord changes: the altitude ladder of every chord type, the four-note limit, side-slipping, and playing what you sing.',
    path: PENT_PATH,
    routes: <PentRoutes />,
    Summary: PentSummary,
    meta: '20 lessons',
    tab: 'var(--tab-pink)',
    tabLabel: 'Pentatonics',
  },
  {
    id: 'harmony',
    title: 'Functional Jazz Harmony',
    blurb:
      'From intervals to Coltrane changes, in plain language: seven rules that generate everything, and twenty lessons that apply them — with examples to hear, walking bass lines, and questions that come with the reasoning.',
    path: HARMONY_PATH,
    routes: <HarmonyRoutes />,
    Summary: HarmonySummary,
    meta: '20 lessons',
    tab: 'var(--tab-orange)',
    tabLabel: 'Harmony',
  },
  {
    id: 'chords',
    title: 'Chords on Bass',
    blurb:
      'A chord method for 5-string bass, built by translating jazz piano voicing to the fretboard: five laws, shapes you can rebuild instead of memorize, the voice leading drawn on the neck, and play-along for every progression.',
    path: CHORDS_PATH,
    routes: <ChordsRoutes />,
    Summary: ChordsSummary,
    meta: '24 chapters',
    tab: 'var(--tab-purple)',
    tabLabel: 'Chords',
  },
  {
    id: 'chordbook',
    title: 'Chord Exercise Book',
    blurb:
      'The practice book of the chord method: numbered exercises from two notes on one chord to long forms in twelve keys. Each one sets a progression, a voicing, the keys and two tempos, and links back to the chapters it practises.',
    path: BOOK_PATH,
    routes: <BookRoutes />,
    Summary: BookSummary,
    meta: `${EXERCISES.length} exercises`,
    tab: 'var(--tab-teal)',
    tabLabel: 'Exercises',
  },
]
