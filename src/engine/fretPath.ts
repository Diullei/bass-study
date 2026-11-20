/** Open strings, sounding MIDI, low to high. */
export const OPEN_4 = [28, 33, 38, 43]
export const OPEN_5 = [23, 28, 33, 38, 43]

/** Anything with a sounding pitch that needs a string and fret. */
export interface Fretted {
  /** Sounding MIDI pitch (E1 = 28). */
  midi: number
  /** String index, 0 = lowest. */
  str: number
  fret: number
}

/** Choose string and fret for each note, keeping the hand in one position where it can. */
export function assignFrets<T extends Fretted>(notes: T[], five: boolean) {
  const open = five ? OPEN_5 : OPEN_4
  let hand = 5
  for (const n of notes) {
    let best: { c: number; si: number; f: number } | null = null
    open.forEach((o, si) => {
      const f = n.midi - o
      if (f < 0 || f > 20) return
      let c = Math.abs(f - hand) + (f === 0 ? 1.5 : 0) + (f > 12 ? 1 : 0) + si * 0.05
      if (f >= hand - 1 && f <= hand + 3) c -= 2
      if (!best || c < best.c) best = { c, si, f }
    })
    const b = (best as { c: number; si: number; f: number } | null) ?? { c: 0, si: 0, f: Math.max(0, n.midi - open[0]) }
    n.str = b.si
    n.fret = b.f
    if (b.f > 0 && (b.f < hand - 1 || b.f > hand + 3)) hand = b.f > hand ? b.f - 2 : b.f
  }
}
