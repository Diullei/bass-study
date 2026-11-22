import { useMemo } from 'react'
import type { FretBarre, FretHand } from '../../notation/Fretboard'
import { useHandSize, useShowFingers } from '../../state/prefs'
import { fingerings, fingerMoves, fingerSequence, fingeringWords, type Fingering, type FNote, type HandSize } from '../../theory/fingering'
import type { ShapeInfo } from './render'
import { STRING_NAMES } from './voicing'

/** A shape's fingering, ready to draw. */
export interface ShapeFingers {
  f: Fingering
  /** Finger per sounding note. */
  fingers: number[]
  barres: FretBarre[]
  hand: FretHand
  /**
   * The fretted notes and the harmonics do not fit one hand position. Harmonics ring on after the finger lifts and a
   * fretted note does not, so the order is: harmonics first, then the hand moves and frets the rest under them (Law 5).
   */
  split?: boolean
  /** The fingering in words, when it is two hand positions (split). */
  words?: string
}

const notesOf = (I: ShapeInfo): FNote[] => I.a.notes.map((n) => ({ str: n.str, fret: n.fret, harm: n.harmonic }))

/** The bracket under the neck: the frets the hand covers and the fingers at each. */
export function handOf(frets: number[], f: Fingering): FretHand {
  const at: Record<number, string> = {}
  const used = frets.map((fr, i) => ({ fr, k: f.fingers[i] })).filter((x) => x.k > 0)
  for (const { fr } of used) at[fr] = [...new Set(used.filter((x) => x.fr === fr).map((x) => x.k))].sort().join('·')
  const fs = used.map((x) => x.fr)
  return { from: Math.min(...fs), to: Math.max(...fs), at, stretch: f.stretch > 0.93 }
}

function pack(I: ShapeInfo, f: Fingering, split = false): ShapeFingers {
  const harm = new Set(I.a.notes.filter((n) => n.harmonic).map((n) => n.str))
  return {
    f,
    fingers: f.fingers,
    barres: f.barres.map((b) => ({ ...b, harmonic: harm.has(b.from) })),
    hand: handOf(I.a.notes.map((n) => n.fret), f),
    split,
  }
}

/** A harmonic shape whose fretted notes are out of reach of the harmonics: finger the two parts on their own. */
function splitHarmonics(I: ShapeInfo, hand: HandSize): ShapeFingers | null {
  const N = I.a.notes
  if (!N.some((n) => n.harmonic)) return null
  const NA = N.filter((n) => !n.harmonic).map((n) => ({ str: n.str, fret: n.fret }))
  const NB = N.filter((n) => n.harmonic).map((n) => ({ str: n.str, fret: n.fret, harm: true }))
  const a = fingerings(NA, hand)[0]
  const b = fingerings(NB, hand)[0]
  if (!a || !b) return null
  let ia = 0
  let ib = 0
  const fingers = N.map((n) => (n.harmonic ? b.fingers[ib++] : a.fingers[ia++]))
  // the same finger number can serve in both positions, so the two are told apart in words
  const rest = fingeringWords(NA, a, STRING_NAMES)
  return { ...pack(I, { ...b, fingers, barres: [...a.barres, ...b.barres], cost: a.cost + b.cost }, true), words: `harmonics first: ${fingeringWords(NB, b, STRING_NAMES)}. They ring on: move the hand, then ${rest}` }
}

const cache = new Map<string, ShapeFingers | null>()

/** The most comfortable fingering of one shape for this hand, or null when the hand cannot hold it. */
export function fingersOf(I: ShapeInfo, hand: HandSize): ShapeFingers | null {
  const k = I.shape + hand
  if (cache.has(k)) return cache.get(k)!
  const f = fingerings(notesOf(I), hand)[0]
  const out = f ? pack(I, f) : splitHarmonics(I, hand)
  cache.set(k, out)
  return out
}

/** Fingerings of a progression, chosen together so fingers can stay down or slide (Chapter 10). */
export function fingersOfSeq(Is: ShapeInfo[], hand: HandSize, loop = false): (ShapeFingers | null)[] {
  const plain = Is.map((I) => fingerings(notesOf(I), hand).length > 0)
  if (!plain.every(Boolean)) return Is.map((I) => fingersOf(I, hand))
  return fingerSequence(Is.map(notesOf), hand, loop).map((f, i) => (f ? pack(Is[i], f) : null))
}

/** "1 on E‑8 · 3 flat across D and G at fret 9". */
export const fingerText = (I: ShapeInfo, sf: ShapeFingers) => sf.words ?? fingeringWords(notesOf(I), sf.f, STRING_NAMES)

/** What the fingers do from one chord to the next, in words: pivots, guide fingers, the hand's travel. */
export function fingerMoveText(a: { I: ShapeInfo; sf: ShapeFingers }, b: { I: ShapeInfo; sf: ShapeFingers }): string {
  const moves = fingerMoves({ notes: notesOf(a.I), f: a.sf.f }, { notes: notesOf(b.I), f: b.sf.f })
  const out: string[] = []
  for (const m of moves) {
    if (m.kind === 'stays') out.push(`finger ${m.finger} stays on ${STRING_NAMES[m.str!]}‑${m.to} (pivot)`)
    else if (m.kind === 'slides') out.push(`finger ${m.finger} slides ${STRING_NAMES[m.str!]}‑${m.from} → ${STRING_NAMES[m.str!]}‑${m.to} (guide finger)`)
  }
  const d = b.sf.f.pos - a.sf.f.pos
  if (d !== 0 && !out.some((x) => x.includes('stays'))) out.push(`the hand shifts ${Math.abs(d)} fret${Math.abs(d) > 1 ? 's' : ''} ${d > 0 ? 'up' : 'down'}`)
  else if (d === 0) out.push('the hand does not move')
  return out.join(' · ')
}

/** The fingering settings (shown or not, hand size), and helpers bound to them. */
export function useFingers() {
  const [show] = useShowFingers()
  const [hand] = useHandSize()
  return useMemo(
    () => ({
      show,
      hand,
      of: (I: ShapeInfo) => fingersOf(I, hand),
      seq: (Is: ShapeInfo[], loop = false) => fingersOfSeq(Is, hand, loop),
      /** Props for a ChordShape: empty when fingering is switched off. */
      props: (sf: ShapeFingers | null | undefined) => (show && sf ? { fingers: sf.fingers, barres: sf.barres, hand: sf.hand } : {}),
    }),
    [show, hand],
  )
}
