/**
 * Cut a span inside one bar (in 16ths) into note values that can be written:
 * whole, dotted half, half and quarter on the beat; inside a beat 16ths, 8ths and dotted 8ths.
 * Rests are never dotted.
 */
export function splitSpan(start: number, len: number, rest: boolean): number[] {
  const out: number[] = []
  let p = start
  let r = len
  while (r > 0) {
    let take: number
    if (p === 0 && r >= 16) take = 16
    else if (!rest && p === 0 && r >= 12) take = 12
    else if (p % 8 === 0 && r >= 8) take = 8
    else if (p % 4 === 0 && r >= 4) take = 4
    else {
      take = Math.min(r, 4 - (p % 4))
      // a dotted 8th only from the beat; otherwise split it
      if (take === 3 && (rest || p % 4 !== 0)) take = p % 4 === 1 ? 1 : 2
    }
    out.push(take)
    p += take
    r -= take
  }
  return out
}
