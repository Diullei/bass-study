import { Fretboard, type FretDot } from '../../notation/Fretboard'
import { mod, pc } from '../../theory/notes'
import type { PentSet } from './model'

const OPEN = { 4: [28, 33, 38, 43], 5: [23, 28, 33, 38, 43] }

/** Every note of a pentatonic on the neck, labelled by `label` (interval over a chord, or scale degree). */
export function NeckShape({ set, strings, from = 0, to = 15, label }: { set: PentSet; strings: 4 | 5; from?: number; to?: number; label: (midi: number) => string }) {
  const dots: FretDot[] = []
  OPEN[strings].forEach((o, str) => {
    for (let f = from; f <= to; f++) {
      const m = o + f
      if (set.pcs.includes(mod(m, 12))) dots.push({ str, fret: f, label: label(m), pen: set.pen, root: mod(m, 12) === pc(set.root) })
    }
  })
  return <Fretboard strings={strings} from={from} to={to} dots={dots} />
}
