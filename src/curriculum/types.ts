/** Shapes of the curriculum data. */

export type DemoDef =
  | { type: 'pairs'; items: [string, string, string][] }
  | { type: 'intervals'; root: string; list: string[] }
  | { type: 'scale'; key: string }
  | { type: 'chords' | 'romans' | 'guide'; key: string; items: string[] }

export interface QuizDef {
  types: string[]
  n?: number
  set?: string[] | string
  keys?: string[]
  minor?: boolean
  sev?: boolean
  quals?: string[]
}

/** Reharmonisation devices, each a probability in percent. */
export interface DevDef {
  secdom?: number
  iiV?: number
  borrow?: number
  passdim?: number
  tritone?: number
  backdoor?: number
  inv?: number
}

export type ChartPattern =
  | 'roots' | 'root5' | 'rootoct' | 'triad' | 'seventh' | 'walk' | 'guide' | 'twofeel' | 'pedal' | 'scale'

export interface ChartDef {
  prog: 'markov' | 'form' | 'any'
  keys: string[]
  pat: ChartPattern
  win: [number, number]
  sev?: boolean
  cad?: 'auth' | 'rand' | 'plagal' | 'half' | 'deceptive'
  slash?: boolean
  perBar?: number | 'mix'
  dev?: DevDef
  ext?: boolean
  form?: string
  reps?: number
  cycle?: '4th' | 'down2'
}

export type StudyPattern = 'scale' | 'thirds' | 'arp' | 'mode'

export interface LessonDef {
  /** Unit index. */
  u: number
  /** Title. */
  t: string
  /** Lead paragraph. */
  txt: string
  /** Theory facts. */
  th?: string[]
  tag?: string
  tempo?: number
  bars?: number
  /** Rhythm level (see RL). */
  R?: number
  time?: number
  /** Needs a 5-string bass. */
  b?: boolean
  pool?: string[]
  nw?: string[]
  nwAbove?: number
  key?: string
  keys?: string[]
  win?: [number, number]
  open?: boolean
  chrom?: boolean
  swing?: boolean
  song?: string
  study?: StudyPattern[]
  chart?: ChartDef
  noEx?: boolean
  demo?: DemoDef
  quiz?: QuizDef
}

export interface Lesson extends LessonDef {
  i: number
  id: string
  time: number
  R: number
  /** Rhythm cells this lesson introduces. */
  newR: string[]
}

export interface SongDef {
  key: string
  time: number
  win: [number, number]
  title: string
  credit: string
  bars: string[]
  guide?: string[]
  chords?: [number, number, string][]
  b?: boolean
  rnKey?: string
}
