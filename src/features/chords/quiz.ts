import { analyse, BANDS, bandsOf, HARM, LIMITS, MAP_NAME, OPEN, pitchName, spell, STRING_NAMES, type Band } from './voicing'

/** Question types of the chord method's quizzes. Generated fresh every time, always with the reasoning. */
export type QType =
  | 'map' // strings up + frets → which degree (Law 1)
  | 'where' // a degree → how many strings up and which fret offset
  | 'register' // a string and fret → which register band
  | 'shapeDeg' // a shape over a root → the degree of its top note
  | 'nameShape' // a shape over a root → the chord name
  | 'form' // a shell → form A, B or C
  | 'pair' // a guide-tone pair → its two dominants (tritone sub)
  | 'trade' // a tension over G7 → what it becomes over D♭7
  | 'rootless' // a rootless voicing → the chord a third up
  | 'triad' // an upper-structure triad over a dominant → the colours it adds
  | 'harmonic' // a harmonic on a string → its note
  | 'mud' // two placements of an interval → which is clear
  | 'colour' // a dominant going to major or minor → which colours (Rule 5)
  | 'quartal' // a fourths barre over a root → its degrees
  | 'sus' // a sus chord → the triad a whole step below
  | 'fifthBelow' // where is the low 5th for the thumb
  | 'mapDown' // strings down + frets → how far below (Law 1 backwards)
  | 'below' // a chord tone held in a shape → where is the root

export const QTYPES: QType[] = [
  'map', 'where', 'register', 'shapeDeg', 'nameShape', 'form', 'pair', 'trade', 'rootless', 'triad', 'harmonic', 'mud', 'colour', 'quartal', 'sus', 'fifthBelow', 'mapDown', 'below',
]

export interface CQuestion {
  prompt: string
  options: string[]
  answer: string
  why: string
}

const rnd = (n: number) => Math.floor(Math.random() * n)
const pick = <T,>(xs: readonly T[]): T => xs[rnd(xs.length)]
const shuffle = <T,>(xs: T[]) => xs.map((x) => [Math.random(), x] as const).sort((a, b) => a[0] - b[0]).map((x) => x[1])
/** Answer plus distinct distractors, shuffled. */
function opts(answer: string, pool: string[], n = 4) {
  const others = shuffle([...new Set(pool.filter((x) => x !== answer))]).slice(0, n - 1)
  return shuffle([answer, ...others])
}

/** Root names that spell cleanly in every chord used here. */
const ROOTS = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B']
const pcName = (pc: number) => ROOTS[((pc % 12) + 12) % 12]
/** A note spelled as a degree of a chord on root pc (F♯ as the 3 of D, G♭ as the ♭7 of A♭). */
const nameIn = (rootPc: number, deg: string, pc: number) => spell(pcName(rootPc)[0], deg, ((pc % 12) + 12) % 12)
const fretWords = (f: number) => (f === 0 ? 'same fret' : `${Math.abs(f)} fret${Math.abs(f) > 1 ? 's' : ''} ${f > 0 ? 'forward' : 'back'}`)
const ivName = (iv: number) => (iv === 12 ? 'octave' : iv === 15 ? 'minor 10th (♭3)' : iv === 16 ? 'major 10th (3)' : MAP_NAME[iv % 12])

/** Slide a shape so its frets stay between 1 and 15; returns the shape and the shift. */
function slide(shape: string, d: number) {
  return shape
    .split('-')
    .map((t) => (t === 'x' ? 'x' : String(+t + d)))
    .join('-')
}
function randomSlide(shape: string) {
  const fs = shape.split('-').filter((t) => t !== 'x').map(Number)
  const lo = Math.min(...fs)
  const hi = Math.max(...fs)
  const ds: number[] = []
  for (let d = 1 - lo; d <= 15 - hi; d++) ds.push(d)
  return pick(ds)
}

/** Shells by form, written on C (or F for form B, G for form C): [quality, shape, form]. */
const SHELLS: [string, string, 'A' | 'B' | 'C', number][] = [
  ['maj7', 'x-8-x-9-9', 'A', 0], ['7', 'x-8-x-8-9', 'A', 0], ['m7', 'x-8-x-8-8', 'A', 0], ['mMaj7', 'x-8-x-9-8', 'A', 0], ['6', 'x-8-x-7-9', 'A', 0], ['m6', 'x-8-x-7-8', 'A', 0],
  ['maj7', 'x-x-8-7-9', 'B', 5], ['7', 'x-x-8-7-8', 'B', 5], ['m7', 'x-x-8-6-8', 'B', 5], ['m6', 'x-x-8-6-7', 'B', 5], ['6', 'x-x-8-7-7', 'B', 5],
  ['maj7', '8-x-x-9-11', 'C', 7], ['7', '8-x-x-9-10', 'C', 7], ['m7', '8-x-x-8-10', 'C', 7], ['6', '8-x-x-9-9', 'C', 7], ['m6', '8-x-x-8-9', 'C', 7],
]
const QUAL_SHOW: Record<string, string> = { maj7: 'maj7', '7': '7', m7: 'm7', mMaj7: 'm(maj7)', '6': '6', m6: 'm6' }

function shell() {
  const [q, sh, form, base] = pick(SHELLS)
  const d = randomSlide(sh)
  const shape = slide(sh, d)
  const root = pcName(base + d)
  return { q, shape, form, root, sym: root + q }
}

const GEN: Record<Exclude<QType, 'mapDown' | 'below'>, () => CQuestion> = {
  map() {
    const su = 1 + rnd(4)
    const f = pick([-2, -1, 0, 1, 2, 3])
    const iv = 5 * su + f
    const pool: string[] = []
    for (let a = 1; a <= 4; a++) for (const b of [-2, -1, 0, 1, 2, 3]) pool.push(ivName(5 * a + b))
    return {
      prompt: `From a root: ${su} string${su > 1 ? 's' : ''} up, ${fretWords(f)}. Which degree is it?`,
      options: opts(ivName(iv), pool),
      answer: ivName(iv),
      why: `Law 1: 5 × ${su} ${f >= 0 ? '+' : '−'} ${Math.abs(f)} = ${iv} semitones${iv > 12 ? ` (${iv - 12} above the octave)` : ''}: the ${ivName(iv)}.`,
    }
  },
  where() {
    const cells: [number, number][] = []
    for (let a = 1; a <= 4; a++) for (const b of [-1, 0, 1, 2]) cells.push([a, b])
    const [su, f] = pick(cells)
    const iv = 5 * su + f
    const say = (a: number, b: number) => `${a} string${a > 1 ? 's' : ''} up, ${fretWords(b)}`
    const ans = say(su, f)
    return {
      prompt: `Where is the ${ivName(iv)} (${iv} semitones above the root) under the hand?`,
      options: opts(ans, cells.filter(([a, b]) => ivName(5 * a + b) !== ivName(iv)).map(([a, b]) => say(a, b))),
      answer: ans,
      why: `Split ${iv} into fives and ones: ${iv} = 5 × ${su} ${f >= 0 ? '+' : '−'} ${Math.abs(f)} (Law 1).`,
    }
  },
  register() {
    let str = 0
    let fret = 0
    let bands: Band[] = []
    do {
      str = rnd(5)
      fret = rnd(18)
      bands = bandsOf(OPEN[str] + fret)
    } while (bands.length !== 1)
    const m = OPEN[str] + fret
    const label = { bass: 'bass band (roots)', chord: 'chord band (3rds, 7ths, colours)', melody: 'melody band (top voice)' }
    return {
      prompt: `Fret ${fret} on the ${STRING_NAMES[str]} string: which register is it in?`,
      options: Object.values(label),
      answer: label[bands[0]],
      why: `${STRING_NAMES[str]} open is ${pitchName(OPEN[str])}, so fret ${fret} is ${pitchName(m)}. The bands are pitch ranges: bass ${pitchName(BANDS.bass[0])}–${pitchName(BANDS.bass[1])}, chord ${pitchName(BANDS.chord[0])}–${pitchName(BANDS.chord[1])}, melody from ${pitchName(BANDS.melody[0])}. A register is a diagonal, not a fret range.`,
    }
  },
  shapeDeg() {
    const { shape, sym } = shell()
    const a = analyse(sym, shape)
    const top = a.notes[a.notes.length - 1]
    const pool = ['R', '3', '♭3', '5', '6', '♭7', '7', '9']
    const fr = shape.split('-')
    const rootStr = fr.findIndex((t) => t !== 'x')
    const topStr = fr.length - 1 - [...fr].reverse().findIndex((t) => t !== 'x')
    const su = topStr - rootStr
    const df = +fr[topStr] - +fr[rootStr]
    return {
      prompt: `${sym} as \`${shape}\`: which degree is the top note?`,
      options: opts(top.deg, pool),
      answer: top.deg,
      why: `The top note is ${su} strings above the root, ${fretWords(df)}: 5 × ${su} ${df >= 0 ? '+' : '−'} ${Math.abs(df)} = ${5 * su + df} semitones, the ${top.deg} (${top.name}).`,
    }
  },
  nameShape() {
    const { shape, root, q } = shell()
    const a = analyse(root + q, shape)
    const ans = root + QUAL_SHOW[q]
    return {
      prompt: `The bottom note of \`${shape}\` is the root, ${root}. Which chord is it?`,
      options: opts(ans, Object.values(QUAL_SHOW).map((x) => root + x)),
      answer: ans,
      why: `Above ${root} the notes are ${a.notes.slice(1).map((n) => `${n.name} (${n.deg})`).join(' and ')}. The 3rd says major or minor, the 7th (or 6th) says which type ([[Law3]]).`,
    }
  },
  form() {
    const { shape, form, sym } = shell()
    const desc = { A: 'A: R – 7 – 3, one string skipped', B: 'B: R – 3 – 7 on three neighbours', C: 'C: R – 3 – 7, two strings skipped' }
    return {
      prompt: `${sym} as \`${shape}\`: which shell form?`,
      options: Object.values(desc),
      answer: desc[form],
      why: `Count the skipped strings between the root and the upper pair, and check which of the 3rd and 7th is lower. ${form === 'A' ? 'Form A puts the 7th below the 3rd.' : form === 'B' ? 'Form B uses three neighbouring strings: thick, it needs height.' : 'Form C has its root on the B string, so the hand sits high ([[Ch9]]).'}`,
    }
  },
  pair() {
    const n = 4 + rnd(10)
    const low = (OPEN[3] + n) % 12
    const r1 = low - 4
    const r2 = low - 10
    const ans = `${pcName(r1)}7 and ${pcName(r2)}7`
    const pool = [ans, `${pcName(r1)}7 and ${pcName(r1 + 7)}7`, `${pcName(r2)}7 and ${pcName(r2 + 5)}7`, `${pcName(r1 + 1)}7 and ${pcName(r2 + 1)}7`, `${pcName(r1 - 1)}7 and ${pcName(r2 - 1)}7`]
    return {
      prompt: `The pair \`x-x-x-${n}-${n + 1}\` is a tritone. Which two dominant chords own it?`,
      options: opts(ans, pool),
      answer: ans,
      why: `As the 3 and ♭7 of ${pcName(r1)}7 the notes are ${nameIn(r1, '3', low)} and ${nameIn(r1, '♭7', low + 6)}; as the ♭7 and 3 of ${pcName(r2)}7 they are ${nameIn(r2, '♭7', low)} and ${nameIn(r2, '3', low + 6)}. Two roots a tritone apart: the tritone sub ([[R7]]).`,
    }
  },
  trade() {
    const T: [string, string][] = [['13', '♯9'], ['♯9', '13'], ['♭13', '9'], ['9', '♭13'], ['5', '♭9'], ['♭9', '5'], ['3', '♭7'], ['♭7', '3']]
    const [a, b] = pick(T)
    const r = rnd(12)
    return {
      prompt: `A note is the ${a} of ${pcName(r)}7. What is it over ${pcName(r + 6)}7?`,
      options: opts(b, ['13', '♯9', '♭13', '9', '5', '♭9', '3', '♭7', '♯11']),
      answer: b,
      why: `${pcName(r + 6)} is a tritone (6 semitones) above ${pcName(r)}, so every degree shifts by 6: the ${a} becomes the ${b}. The 3 and ♭7 swap, which is why the same shape serves both chords ([[R7]]).`,
    }
  },
  rootless() {
    const kinds: [string, string, number, string][] = [
      ['m9', '♭3 5 ♭7 9', 3, 'maj7'],
      ['maj9', '3 5 7 9', 4, 'm7'],
      ['9', '3 5 ♭7 9', 4, 'm7♭5'],
    ]
    const [q, degs, up, res] = pick(kinds)
    const r = rnd(12)
    const ans = pcName(r + up) + res
    const pool = ['maj7', 'm7', '7', 'm7♭5', '6'].flatMap((x) => [pcName(r + up) + x, pcName(r + 7) + x])
    return {
      prompt: `${pcName(r)}${q} without its root (${degs}) spells which simpler chord?`,
      options: opts(ans, pool),
      answer: ans,
      why: `Drop the root and stack the rest from the 3rd: ${degs} of ${pcName(r)} are the root, 3rd, 5th and 7th of ${ans}. A rootless voicing is a chord built on the 3rd ([[Ch12]]).`,
    }
  },
  triad() {
    const r = rnd(12)
    const sym = `${pcName(r)}7`
    const good: [number, string][] = [[2, '9 ♯11 13'], [3, '♯9 5 ♭7'], [6, '♭7 ♭9 ♯11'], [8, '♭13 R ♯9'], [9, '13 ♭9 3']]
    const bad = [1, 4, 5, 7, 10, 11]
    const [up] = pick(good)
    const ans = `${pcName(r + up)} major`
    const deg = (x: number) => (({ 0: 'R', 1: '♭9', 2: '9', 3: '♯9', 4: '3', 5: '11', 6: '♯11', 7: '5', 8: '♭13', 9: '13', 10: '♭7', 11: '7' }) as Record<number, string>)[x % 12]
    const notes = [0, 4, 7].map((i) => deg(up + i))
    return {
      prompt: `Which major triad can sit over ${sym} as an upper structure?`,
      options: opts(ans, bad.map((b) => `${pcName(r + b)} major`)),
      answer: ans,
      why: `Its notes are the ${notes.join(', ')} of ${sym}: no 11 (a half step above the 3rd) and no major 7 (it fights the ♭7). That is the test of [[Ch17]], from [[R6]].`,
    }
  },
  harmonic() {
    const str = rnd(5)
    const f = pick([12, 7, 5])
    const m = OPEN[str] + HARM[f]
    const ans = pitchName(m).replace(/\d+$/, '')
    const pool = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B']
    const what: Record<number, string> = { 12: 'the open string an octave up', 7: 'a fifth above the open string (an octave and a fifth)', 5: 'the open string two octaves up' }
    return {
      prompt: `The natural harmonic over fret ${f} of the ${STRING_NAMES[str]} string: which note?`,
      options: opts(ans, pool),
      answer: ans,
      why: `Over fret ${f} sounds ${what[f]}: ${pitchName(m)}. At 12 and 7 a harmonic has the same note name as the fretted note; at 5 it gives the open string's note, two octaves up.`,
    }
  },
  mud() {
    const iv = pick([3, 4, 7, 10])
    const limit = LIMITS[iv]
    const spots: [number, number][] = []
    for (let str = 0; str < 4; str++) for (let f = 1; f <= 15; f++) spots.push([str, f])
    const clear = shuffle(spots.filter(([s, f]) => OPEN[s] + f >= limit + 1))[0]
    const muddy = shuffle(spots.filter(([s, f]) => OPEN[s] + f <= limit - 4)).slice(0, 3)
    const say = ([s, f]: [number, number]) => `lower note at ${STRING_NAMES[s]}‑${f}`
    const name = { 3: 'minor 3rd', 4: 'major 3rd', 7: 'fifth', 10: 'minor 7th' }[iv]
    return {
      prompt: `A ${name} between two neighbours. Which placement sounds clear?`,
      options: shuffle([say(clear), ...muddy.map(say)]),
      answer: say(clear),
      why: `A ${name} is clear when its lower note is at ${pitchName(limit)} or above ([[Law2]]). ${STRING_NAMES[clear[0]]}‑${clear[1]} is ${pitchName(OPEN[clear[0]] + clear[1])}; the others are lower.`,
    }
  },
  colour() {
    const r = rnd(12)
    const to = pick(['major', 'minor', 'not down a fifth'] as const)
    const target = to === 'not down a fifth' ? `${pcName(r + 2)}maj7 (it is a ♭VII7)` : `${pcName(r + 5)}${to === 'major' ? 'maj7' : 'm6'}`
    const ans = to === 'major' ? '9 and 13' : to === 'minor' ? '♭9 and ♭13' : '9 and ♯11'
    return {
      prompt: `${pcName(r)}7 goes to ${target}. Which pair of colours does the destination suggest?`,
      options: shuffle(['9 and 13', '♭9 and ♭13', '9 and ♯11', '♯9 and 13']),
      answer: ans,
      why:
        to === 'major'
          ? `Take the colours from the key you are going to ([[R5]]): in ${pcName(r + 5)} major the 9 and 13 of ${pcName(r)}7 are natural.`
          : to === 'minor'
            ? `In ${pcName(r + 5)} minor the 9 and 13 of ${pcName(r)}7 are flattened, so the key gives ♭9 and ♭13 ([[R5]]).`
            : 'A dominant that does not fall a fifth has no resolution to pull towards, so it floats: Lydian dominant, 9 and ♯11 ([[Ch14]]).',
    }
  },
  quartal() {
    const n = 5 + rnd(9)
    const low = (OPEN[2] + n) % 12
    const rel: [number, string, string][] = [
      [low - 5, 'm11', '11 ♭7 ♭3'],
      [low, '7sus', 'R 4 ♭7'],
      [low - 4, 'maj13', '3 13 9'],
      [low + 1, 'maj13', '7 3 13'],
    ]
    const [r, q, ans] = pick(rel)
    return {
      prompt: `The fourths barre \`x-x-${n}-${n}-${n}\` (${pcName(low)} ${pcName(low + 5)} ${pcName(low + 10)}) over a ${pcName(r)} root: which degrees?`,
      options: shuffle(rel.map((x) => x[2])),
      answer: ans,
      why: `Measure each note from ${pcName(r)}: they are the ${ans}, so the chord is ${pcName(r)}${q}. One barre, four roots, four chords ([[Ch16]], [[R7]]).`,
    }
  },
  sus() {
    const r = rnd(12)
    const kinds: [string, string][] = [
      ['9sus', 'a major triad'],
      ['13sus', 'a maj7 chord'],
      ['7sus♭9', 'a minor triad'],
    ]
    const [q, what] = pick(kinds)
    const wb = pcName(r - 2)
    const ans = `${wb} ${what.replace(/^an? /, '')}`
    const pool = kinds.flatMap(([, w]) => [`${wb} ${w.replace(/^an? /, '')}`, `${pcName(r + 2)} ${w.replace(/^an? /, '')}`, `${pcName(r + 5)} ${w.replace(/^an? /, '')}`])
    return {
      prompt: `To get ${pcName(r)}${q}, which chord do you play over the ${pcName(r)} root?`,
      options: opts(ans, pool),
      answer: ans,
      why: `The chord a whole step below the root gives the ♭7, 9 and 4 (and the 13 with its 7th).${q === '7sus♭9' ? ' Minor, so its 3rd is the ♭9.' : ''} ([[Ch15]], [[R7]])`,
    }
  },
  fifthBelow() {
    const str = 1 + rnd(2)
    const f = 3 + rnd(10)
    const root = pcName(OPEN[str] + f)
    const lower = STRING_NAMES[str - 1]
    const ans = `${lower} string, fret ${f}`
    return {
      prompt: `The thumb plays ${root} at ${STRING_NAMES[str]}‑${f}. Where is the 5th below it, for the bossa's beat 3?`,
      options: shuffle([ans, `${lower} string, fret ${f + 2}`, `${STRING_NAMES[str + 1]} string, fret ${f + 2}`, `${STRING_NAMES[str + 1]} string, fret ${f}`]),
      answer: ans,
      why: `One string down is 5 semitones down ([[Law1]]): a perfect 4th below, which is the 5th of the chord an octave lower. Same fret, no hand movement ([[Ch20]]).`,
    }
  },
}

const GEN_BACK: Record<'mapDown' | 'below', () => CQuestion> = {
  mapDown() {
    const su = 1 + rnd(4)
    const f = pick([2, 1, 0, -1, -2, -3])
    const iv = 5 * su - f
    const pool: string[] = []
    for (let a = 1; a <= 4; a++) for (const b of [2, 1, 0, -1, -2, -3]) pool.push(ivName(5 * a - b))
    return {
      prompt: `From the note you hold: ${su} string${su > 1 ? 's' : ''} down, ${fretWords(f)}. If that is the root, which degree is your note?`,
      options: opts(ivName(iv), pool),
      answer: ivName(iv),
      why: `Law 1 backwards: each string down is 5 semitones down, each fret forward gives one back. 5 × ${su}${f === 0 ? '' : ` ${f > 0 ? '−' : '+'} ${Math.abs(f)}`} = ${iv} semitones below, so your note is the ${ivName(iv)} of that root.`,
    }
  },
  below() {
    const { shape, sym } = shell()
    const a = analyse(sym, shape)
    const root = a.notes[0]
    const held = pick(a.notes.slice(1))
    const sd = held.str - root.str
    const d = root.fret - held.fret
    const iv = held.midi - root.midi
    const say = (x: number, y: number) => `${x} string${x > 1 ? 's' : ''} down, ${fretWords(y)}`
    const ans = say(sd, d)
    const pool: string[] = []
    for (const x of [sd - 1, sd, sd + 1]) for (const y of [d - 2, d - 1, d, d + 1, d + 2]) if (x >= 1 && x <= 4) pool.push(say(x, y))
    return {
      prompt: `${sym} as \`${shape}\`: your finger is on the ${held.deg} (${held.name}) at ${STRING_NAMES[held.str]}‑${held.fret}. Where is the root?`,
      options: opts(ans, pool),
      answer: ans,
      why: `The ${held.deg} is ${iv} semitones above the root. Split it into fives and ones: ${iv} = 5 × ${sd}${d === 0 ? '' : ` ${d > 0 ? '−' : '+'} ${Math.abs(d)}`}. So the root is ${sd} string${sd > 1 ? 's' : ''} down, ${fretWords(d)}: ${STRING_NAMES[root.str]}‑${root.fret} (${root.name}). [[Law1]] backwards.`,
    }
  },
}

export function genCQuestion(types: QType[]): CQuestion {
  const t = pick(types.length ? types : QTYPES)
  return t === 'mapDown' || t === 'below' ? GEN_BACK[t]() : GEN[t]()
}

/** Kept for spelling checks in tests. */
export const _spell = spell
