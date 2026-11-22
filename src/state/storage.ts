/** localStorage helpers that never throw (private mode, blocked storage …). */

export function load<T>(key: string, fallback: T): T {
  try {
    const v = JSON.parse(localStorage.getItem(key) || 'null')
    return v == null ? fallback : (v as T)
  } catch {
    return fallback
  }
}

export function store(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable: progress lives for this session only */
  }
}

/** Keys kept compatible with the original single-file app. */
export const KEYS = {
  settings: 'bm2.settings',
  progress: 'bm2.progress',
  current: 'bm2.current',
  metroCompact: 'bm2.metroCompact',
  metroPos: 'bm2.metroPos',
  /** Idea Builder: sound options, and the last idea's URL query. */
  ideasPlay: 'bs.ideas.play',
  ideasLast: 'bs.ideas.last',
  /** Pentatonics class: per-lesson progress, and the last lesson opened. */
  pentProgress: 'bs.pent.progress',
  pentCurrent: 'bs.pent.current',
  /** Jazz harmony course: per-lesson progress, and the last lesson opened. */
  harmonyProgress: 'bs.harmony.progress',
  harmonyCurrent: 'bs.harmony.current',
  /** Chord method: per-chapter progress, the last chapter opened, the left-handed view. */
  chordsProgress: 'bs.chords.progress',
  chordsCurrent: 'bs.chords.current',
  /** Widgets: whether the metronome is open and on which tab; the interval ruler's state and place. */
  metroOpen: 'bm2.metroOpen',
  metroTab: 'bm2.metroTab',
  intervals: 'bs.intervals',
  intervalsPos: 'bs.intervals.pos',
  /** The left-handed view of every neck, for the whole notebook. */
  lefty: 'bs.lefty',
  /** Fingering on chord diagrams: shown or not, and the hand size the fingering engine assumes. */
  fingers: 'bs.fingers',
  hand: 'bs.hand',
  /** How a chord shape is written inside text: 'c' a tiny neck and the frets, 'a' five cells, 'b' one line. */
  shapeStyle: 'bs.shapeStyle',
  /** Backing track for practice: band feel and whether the written line is played. */
  backing: 'bs.backing',
} as const
