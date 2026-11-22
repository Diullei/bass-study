import { Fretboard, type FretBand, type FretBarre, type FretDot, type FretHand } from './Fretboard'

export interface ChordShapeProps {
  /** Frets low string to high, e.g. "x-8-x-9-9"; "0" open, "h7" a harmonic over fret 7. */
  shape: string
  /** One label per sounding note, low to high (a degree like "3" or "♭7"). */
  labels?: string[]
  /** One pen class per sounding note (see notation.css). */
  pens?: (string | undefined)[]
  /** Which sounding notes are roots (drawn filled). */
  roots?: boolean[]
  /** Indexes of the sounding notes playing now (red pen). */
  active?: number[]
  /** Fretting-hand finger per sounding note (0 or missing = none), a tag on each dot. */
  fingers?: number[]
  /** Flat fingers (barres) to draw across the strings. */
  barres?: FretBarre[]
  /** The hand position marker under the neck. */
  hand?: FretHand
  /** Shaded stretches behind the shape (e.g. the clear zones around one note). */
  bands?: FretBand[]
  /** Make the notes clickable: called with the index of the sounding note. */
  onNote?: (i: number) => void
  /** Sounding notes in a wrong place (a red ring and a "!" tag). */
  warn?: number[]
  /** The selected sounding note (a dashed halo). */
  picked?: number | null
  /**
   * Helper notes around the shape, by pitch class (0 = C): every free place of the window whose note is in the map
   * gets a small dot. Used for the chord scale.
   */
  fill?: Record<number, { label: string; pen?: string; root?: boolean; dashed?: boolean }>
  /** Mirror for a left-handed player. */
  lefty?: boolean
  /** At least this many frets in the window (default 4). */
  minFrets?: number
  className?: string
}

const OPEN = [23, 28, 33, 38, 43]

/** Fret tokens → sounding notes: { str, fret, harmonic }. */
export function shapeDots(shape: string) {
  const out: { str: number; fret: number; harmonic: boolean }[] = []
  shape.split('-').forEach((t, str) => {
    if (t === 'x' || t === '') return
    if (t.startsWith('h')) out.push({ str, fret: +t.slice(1), harmonic: true })
    else out.push({ str, fret: +t, harmonic: false })
  })
  return out
}

/**
 * A chord shape on a short piece of the neck: the window fits the shape, muted strings get an ×,
 * harmonics are diamonds over the fret wire. Every fret of the window is numbered, so a shape can be found at once.
 */
export function ChordShape({ shape, labels, pens, roots, active = [], fingers, barres, hand, bands, onNote, picked, warn, fill, lefty, minFrets = 4, className }: ChordShapeProps) {
  const toks = shape.split('-')
  const strings = toks.length === 4 ? 4 : 5
  const notes = shapeDots(shape)
  const frets = notes.filter((n) => n.fret > 0).map((n) => n.fret)
  const hasOpen = notes.some((n) => !n.harmonic && n.fret === 0)
  const lo = frets.length ? Math.min(...frets) : 1
  const hi = frets.length ? Math.max(...frets) : 4
  let from = hasOpen || lo <= 2 ? 0 : lo - 1
  let to = Math.max(hi + 1, (from || 1) + minFrets - 1)
  // a scale needs five frets: the strings are five half steps apart, so four frets leave one pitch out between each pair
  if (fill)
    while (to - from + 1 < 5) {
      if (from > 1) from--
      else to++
    }
  const muted = toks.map((t, i) => (t === 'x' ? i : -1)).filter((i) => i >= 0)
  const dots: FretDot[] = notes.map((n, i) => ({
    str: n.str,
    fret: n.fret,
    harmonic: n.harmonic,
    label: labels?.[i] ?? '',
    pen: pens?.[i],
    root: roots?.[i],
    active: active.includes(i),
    finger: fingers?.[i] || undefined,
    picked: picked === i,
    warn: warn?.includes(i),
  }))
  if (fill && strings === 5) {
    const taken = new Set(notes.map((n) => `${n.str}:${n.fret}`))
    for (let str = 0; str < 5; str++)
      for (let f = from === 0 ? 0 : from; f <= to; f++) {
        const g = fill[(OPEN[str] + f) % 12]
        if (g && !taken.has(`${str}:${f}`)) dots.push({ str, fret: f, label: g.label, pen: g.pen, root: g.root, dashed: g.dashed, ghost: true })
      }
  }
  return <Fretboard strings={strings} from={from} to={to} dots={dots} muted={muted} bands={bands} onDot={onNote} barres={barres} hand={hand} lefty={lefty} allNumbers className={className} />
}
