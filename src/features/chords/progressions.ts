/** Progressions for the generator and the test page, written in one key and transposed by letter (so spelling stays right). */

const LET = 'CDEFGAB'
const NAT = [0, 2, 4, 5, 7, 9, 11]

export const KEYS = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B']

const parseRoot = (s: string) => {
  const l = LET.indexOf(s[0])
  const a = s[1] === '♭' || s[1] === 'b' ? -1 : s[1] === '♯' || s[1] === '#' ? 1 : 0
  return { l, a, len: a ? 2 : 1 }
}
const pcOf = (r: { l: number; a: number }) => (NAT[r.l] + r.a + 12) % 12

/** Move a chord symbol from key `from` to key `to`: letters shift with the key, accidentals follow. */
export function transpose(sym: string, from: string, to: string): string {
  const F = parseRoot(from)
  const T = parseRoot(to)
  const R = parseRoot(sym)
  const dl = (T.l - F.l + 7) % 7
  const ds = (pcOf(T) - pcOf(F) + 12) % 12
  const l = (R.l + dl) % 7
  let a = ((pcOf(R) + ds - NAT[l]) % 12 + 12) % 12
  if (a > 6) a -= 12
  let root = LET[l] + (a === -1 ? '♭' : a === 1 ? '♯' : '')
  if (Math.abs(a) > 1) root = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'][(pcOf(R) + ds) % 12]
  return root + sym.slice(R.len)
}

export interface Prog {
  id: string
  name: string
  /** Bars split by "|", chords by spaces. */
  bars: string
  /** The key it is written in. */
  key: string
  minor?: boolean
  ch?: number
}

export const PROGS: Prog[] = [
  { id: 'two-five', name: 'II–V–I (major)', bars: 'Dm7 | G7 | Cmaj7 | Cmaj7', key: 'C', ch: 7 },
  { id: 'minor-two-five', name: 'II–V–I (minor)', bars: 'Dm7♭5 | G7 | Cm6 | Cm6', key: 'C', minor: true, ch: 8 },
  { id: 'turnaround', name: 'Turnaround I–VI–II–V', bars: 'Cmaj7 A7 | Dm7 G7 | Cmaj7 A7 | Dm7 G7', key: 'C', ch: 7 },
  { id: 'blues', name: '12-bar blues', bars: 'F7 | B♭7 | F7 | F7 | B♭7 | B♭7 | F7 | F7 | C7 | B♭7 | F7 | C7', key: 'F', ch: 5 },
  { id: 'jazz-blues', name: 'Jazz blues', bars: 'F7 | B♭7 | F7 | Cm7 F7 | B♭7 | B°7 | F7 | D7 | Gm7 | C7 | F7 D7 | Gm7 C7', key: 'F', ch: 23 },
  { id: 'minor-blues', name: 'Minor blues', bars: 'Cm7 | Fm7 | Cm7 | Cm7 | Fm7 | Fm7 | Cm7 | Cm7 | A♭7 | G7 | Cm7 | G7', key: 'C', minor: true, ch: 23 },
  { id: 'rhythm-bridge', name: 'Four dominants (rhythm bridge)', bars: 'D7 | D7 | G7 | G7 | C7 | C7 | F7 | F7', key: 'B♭', ch: 23 },
  { id: 'subv', name: 'II – ♭II – I (tritone sub)', bars: 'Dm7 | D♭7 | Cmaj7 | Cmaj7', key: 'C', ch: 13 },
  { id: 'backdoor', name: 'Backdoor IVm – ♭VII7 – I', bars: 'Fm7 | B♭7 | Cmaj7 | Cmaj7', key: 'C', ch: 23 },
  { id: 'fifths', name: 'Falling fifths through a key', bars: 'Cm7 | F7 | B♭maj7 | E♭maj7 | Am7♭5 | D7 | Gm6 | Gm6', key: 'B♭', ch: 23 },
  // practice progressions of the chapters, from the easiest
  { id: 'one-four', name: 'I – IV', bars: 'Cmaj7 | Fmaj7 | Cmaj7 | Fmaj7', key: 'C' },
  { id: 'cycle-doms', name: 'Four dominants up in fourths', bars: 'C7 | F7 | B♭7 | E♭7', key: 'C' },
  { id: 'one-six-two-five', name: 'I – VI – II – V in the key', bars: 'Cmaj7 Am7 | Dm7 G7 | Cmaj7 Am7 | Dm7 G7', key: 'C' },
  { id: 'three-six-two-five', name: 'III – VI – II – V – I', bars: 'Em7 A7 | Dm7 G7 | Cmaj7 | Cmaj7', key: 'C' },
  { id: 'dim-pass', name: 'I – ♯I° – II – V (passing diminished)', bars: 'Cmaj7 C♯°7 | Dm7 G7 | Cmaj7 C♯°7 | Dm7 G7', key: 'C' },
  { id: 'minor-turn', name: 'Minor turnaround', bars: 'Cm6 Am7♭5 | Dm7♭5 G7 | Cm6 Am7♭5 | Dm7♭5 G7', key: 'C', minor: true },
  { id: 'modal', name: 'Modal vamp, up a half step and back', bars: 'Dm7 | Dm7 | E♭m7 | E♭m7', key: 'D', minor: true },
  { id: 'triads-145', name: 'I – IV – V – I in triads', bars: 'C | F | G | C', key: 'C' },
  { id: 'triads-pop', name: 'I – V – VI – IV in triads', bars: 'C | G | Am | F', key: 'C' },
  { id: 'line-cliche', name: 'Minor line: 8 – 7 – ♭7 – 6', bars: 'Cm | CmMaj7 | Cm7 | Cm6', key: 'C', minor: true },
  { id: 'maj-colours', name: 'One major chord: maj7 and 6', bars: 'Cmaj7 | C6 | Cmaj7 | C6', key: 'C' },
  { id: 'sus', name: 'Vsus – V – I', bars: 'G7sus | G7 | Cmaj7 | Cmaj7', key: 'C' },
  { id: 'bossa', name: 'I – II7 – II – ♭II7 (bossa)', bars: 'Cmaj7 | D7 | Dm7 | D♭7', key: 'C' },
  { id: 'rhythm-a', name: 'Rhythm changes, first four bars', bars: 'Cmaj7 A7 | Dm7 G7 | Em7 A7 | Dm7 G7', key: 'C' },
  { id: 'ladybird', name: 'Major 7ths in a turnaround', bars: 'Cmaj7 E♭maj7 | A♭maj7 D♭maj7 | Cmaj7 E♭maj7 | A♭maj7 D♭maj7', key: 'C' },
  // from the harmony lessons
  { id: 'five-qualities', name: 'One root, five kinds of seventh chord', bars: 'Cmaj7 | C7 | Cm7 | Cm7♭5 | C°7 | C°7', key: 'C' },
  { id: 'diatonic-fifths', name: 'The seven chords of the key, in falling fifths', bars: 'Cmaj7 | Fmaj7 | Bm7♭5 | Em7 | Am7 | Dm7 | G7 | Cmaj7', key: 'C' },
  { id: 'five-one', name: 'V – I, and V – VI (deceptive)', bars: 'G7 | Cmaj7 | G7 | Am7', key: 'C' },
  { id: 'secondary', name: 'A secondary dominant before every chord', bars: 'Cmaj7 A7 | Dm7 B7 | Em7 A7 | Dm7 G7', key: 'C' },
  { id: 'borrowed-iv', name: 'I – IVm6 – I (borrowed from minor)', bars: 'Cmaj7 | Fm6 | Cmaj7 | Fm6', key: 'C' },
  { id: 'dim-walk', name: 'Passing diminished chords, up the key', bars: 'Cmaj7 C♯°7 | Dm7 D♯°7 | Em7 A7 | Dm7 G7', key: 'C' },
  { id: 'bird-blues', name: 'Blues with II–Vs (Bird blues)', bars: 'Fmaj7 | Em7♭5 A7 | Dm7 G7 | Cm7 F7 | B♭7 | B♭m7 E♭7 | Am7 D7 | A♭m7 D♭7 | Gm7 | C7 | Fmaj7 D7 | Gm7 C7', key: 'F' },
  { id: 'thirds', name: 'Key centres a major 3rd apart', bars: 'Cmaj7 | E♭7 | A♭maj7 | B7 | Emaj7 | G7 | Cmaj7 | Cmaj7', key: 'C', ch: 23 },
]

export const progById = (id: string) => PROGS.find((p) => p.id === id)

/** The progression's bars in another key, as chord symbols. */
export function progIn(p: Prog, key: string): string[][] {
  return p.bars.split('|').map((b) =>
    b
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((s) => transpose(s, p.key, key)),
  )
}

/**
 * Appendix B: the four test progressions, with the baseline shells of the method.
 * They come back at the end of every part, each time with the new layer.
 */
export const TESTS: { id: string; name: string; bars: string; note: string }[] = [
  { id: 't1', name: '1. II–V–I in C', bars: 'Dm7:x-10-x-10-10 | G7:x-x-10-9-10 | Cmaj7:x-8-x-9-9 | Cmaj7:x-8-x-9-9', note: 'Form A, B, A: the roots cross the strings, the upper pair barely moves.' },
  { id: 't2', name: '2. II–V–I in B♭', bars: 'Cm7:13-x-x-13-15 | F7:x-13-x-13-14 | B♭maj7:11-x-x-12-14 | B♭maj7:11-x-x-12-14', note: 'Form C, A, C: the B string keeps the hand high.' },
  { id: 't3', name: '3. Minor II–V–I in C minor', bars: 'Dm7♭5:x-10-11-10-10 | G7:x-x-10-9-10 | Cm6:x-8-x-7-8 | Cm6:x-8-x-7-8', note: 'The ♭5 fills the skipped string of the half-diminished chord.' },
  {
    id: 't4',
    name: '4. Blues in F',
    bars: 'F7:6-x-x-7-8 | B♭7:x-6-x-6-7 | F7:6-x-x-7-8 | F7:6-x-x-7-8 | B♭7:x-6-x-6-7 | B♭7:x-6-x-6-7 | F7:6-x-x-7-8 | F7:6-x-x-7-8 | C7:x-8-x-8-9 | B♭7:x-6-x-6-7 | F7:6-x-x-7-8 | C7:x-8-x-8-9',
    note: 'One hand position, frets 6 to 9.',
  },
]
