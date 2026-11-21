import type { Mode } from './theory'

/**
 * A piece of a lesson or rule page. Text supports **bold**, `code`, rule links [[R1]]…[[R7]]
 * and lesson links [[L1]]…[[L20]].
 */
export type HBlock =
  | { t: 'p'; text: string }
  /** A small heading inside the page: "The logic", "Example" … */
  | { t: 'h'; text: string }
  | { t: 'list'; items: string[] }
  | { t: 'tip'; title: string; text: string }
  | { t: 'table'; head: string[]; rows: string[][]; caption?: string }
  /** Lines in a fixed-width font, for voice-leading ladders. */
  | { t: 'code'; lines: string[]; caption?: string }
  /**
   * Things to hear, one after another. `notes` like "B3 F4", `bass` like "G2".
   * Each item is a button; "play all" plays them in order.
   */
  | { t: 'listen'; title: string; items: { label: string; notes?: string; bass?: string; chord?: string; beats?: number }[]; caption?: string; tempo?: number }
  /**
   * A chord chart. Bars split by "|", chords by spaces. Marks on a chord: "[" starts a II–V bracket, "]" ends it,
   * ">" a solid arrow (V resolves down a fifth), "~>" a dashed arrow (subV resolves down a half step).
   * `rn` gives one numeral per chord. `walk` gives a walking bass, four notes per bar.
   */
  | { t: 'chart'; title: string; chords: string; rn?: string; walk?: string; tempo?: number; caption?: string }
  /** A chord with its scale on a keyboard, every note labelled by Rule 6. */
  | { t: 'scale'; chord: string; scale: string; caption?: string }
  /** A table of chord scales, computed by Rule 6. */
  | { t: 'cstable'; rows: [chord: string, scale: string, use?: string][]; caption?: string }
  /** Rule 5 step by step: a chord's scale from the key. */
  | { t: 'derive'; key: string; mode?: Mode; chord: string }
  /** Rule 4 on the seven chords of a key. */
  | { t: 'functions'; key: string }

/** A question with its answer and, more important, the reasoning. */
export interface Check {
  q: string
  a: string
  why: string
}
