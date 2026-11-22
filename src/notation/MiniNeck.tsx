import { Fretboard } from './Fretboard'

/**
 * A small neck with a root and one other note, `strings` apart and `frets` along (interval = 5 × strings + frets).
 * `down`: the held note is on top and the root is found below it; `frets` is then the move from the note to the root.
 * Only the frets that matter are drawn.
 */
export function MiniNeck({ down, strings, frets, label, className }: { down?: boolean; strings: number; frets: number; label: string; className?: string }) {
  // the root sits where the other note still fits on five strings
  const rootStr = down ? 4 - strings : strings === 4 ? 0 : 1
  const otherStr = down ? 4 : rootStr + strings
  const rootFret = down ? 8 + frets : 8
  const otherFret = down ? 8 : 8 + frets
  let lo = Math.min(rootFret, otherFret)
  let hi = Math.max(rootFret, otherFret)
  // at least three frets, so the picture has a shape
  if (hi - lo < 2) {
    if (hi === lo) lo -= 1
    hi += 1
  }
  return (
    <span className={className} style={className ? undefined : { display: 'block', width: 128 }}>
      <Fretboard
        strings={5}
        from={lo}
        to={hi}
        allNumbers
        dots={[
          { str: rootStr, fret: rootFret, label: 'R', root: true },
          { str: otherStr, fret: otherFret, label, pen: 'pen-green' },
        ]}
      />
    </span>
  )
}
