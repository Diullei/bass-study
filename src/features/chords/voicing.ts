/**
 * The shape engine: a chord symbol plus frets on a B-E-A-D-G bass → notes, degrees, checks.
 * Nothing in the method's tables is typed by hand: every note name and degree is computed here,
 * and a shape whose notes do not belong to its chord is an error.
 */

/** Open strings, low to high: B0 E1 A1 D2 G2 (MIDI). Each string is 5 above the last (Law 1). */
export const OPEN = [23, 28, 33, 38, 43]
export const STRING_NAMES = ['B', 'E', 'A', 'D', 'G']
/** Natural harmonics: touch over fret → semitones above the open string. */
export const HARM: Record<number, number> = { 12: 12, 7: 19, 5: 24, 4: 28, 9: 28 }

const LETTERS = 'CDEFGAB'
const NAT: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

export type Family = 'maj' | 'six' | 'tri' | 'dom' | 'sus' | 'min' | 'm6' | 'mtri' | 'mmaj' | 'hdim' | 'dim' | 'dtri'

/**
 * Chord tones plus the tensions that are not avoid notes (harmony course, Rule 6), as semitones → degree.
 * A dominant has no natural 11 (a half step above the 3rd), a major chord neither.
 */
export const FAM: Record<Family, Record<number, string>> = {
  maj: { 0: 'R', 2: '9', 4: '3', 6: '♯11', 7: '5', 8: '♯5', 9: '13', 11: '7' },
  six: { 0: 'R', 2: '9', 4: '3', 7: '5', 9: '6' },
  tri: { 0: 'R', 4: '3', 7: '5' },
  dom: { 0: 'R', 1: '♭9', 2: '9', 3: '♯9', 4: '3', 6: '♯11', 7: '5', 8: '♭13', 9: '13', 10: '♭7' },
  sus: { 0: 'R', 1: '♭9', 2: '9', 5: '4', 7: '5', 9: '13', 10: '♭7' },
  min: { 0: 'R', 2: '9', 3: '♭3', 5: '11', 7: '5', 9: '13', 10: '♭7' },
  m6: { 0: 'R', 2: '9', 3: '♭3', 5: '11', 7: '5', 9: '6' },
  mtri: { 0: 'R', 3: '♭3', 7: '5' },
  mmaj: { 0: 'R', 2: '9', 3: '♭3', 5: '11', 7: '5', 9: '13', 11: '7' },
  hdim: { 0: 'R', 2: '9', 3: '♭3', 5: '11', 6: '♭5', 8: '♭13', 10: '♭7' },
  dim: { 0: 'R', 2: '9', 3: '♭3', 5: '11', 6: '♭5', 8: '♭13', 9: '°7', 11: '7' },
  dtri: { 0: 'R', 3: '♭3', 6: '♭5' },
}

/** Letter steps above the root for each degree (the 3rd is always two letters up). */
const DEG_LETTER: Record<string, number> = { R: 0, '9': 1, '3': 2, '4': 3, '11': 3, '5': 4, '13': 5, '6': 5, '7': 6 }

/** Degree → semitones, for building shapes from degree lists. */
export const DEG: Record<string, number> = {
  R: 0, '♭9': 1, '9': 2, '♯9': 3, '♭3': 3, '3': 4, '4': 5, '11': 5, '♯11': 6, '♭5': 6, '5': 7, '♯5': 8, '♭13': 8,
  '13': 9, '6': 9, '°7': 9, '♭7': 10, '7': 11,
}

export interface ChordSym {
  /** As typed, with ♭ ♯ °. */
  sym: string
  letter: string
  /** Pitch class of the root. */
  root: number
  /** Everything after the root, normalised to b/#/dim. */
  rest: string
  fam: Family
}

/** Normalise typed accidentals: ♭→b, ♯→#, °→dim. */
const norm = (s: string) => s.replace(/♭/g, 'b').replace(/♯/g, '#').replace(/°/g, 'dim').replace(/ø/g, 'm7b5')

function family(rest: string): Family {
  if (rest === '') return 'tri'
  if (rest === 'm') return 'mtri'
  if (rest === 'dim') return 'dtri'
  if (rest.startsWith('maj')) return 'maj'
  if (rest.startsWith('6')) return 'six'
  if (rest.startsWith('mMaj')) return 'mmaj'
  if (rest.startsWith('m7b5')) return 'hdim'
  if (rest.startsWith('dim')) return 'dim'
  if (rest.startsWith('m6')) return 'm6'
  if (rest.startsWith('m')) return 'min'
  if (rest.includes('sus')) return 'sus'
  if (/^(7|9|11|13)/.test(rest)) return 'dom'
  throw new Error('unknown chord quality: ' + rest)
}

/** Parse "B♭maj7", "C♯°7", "G7♯9♭13", "Dm7♭5" … Throws on an unknown symbol. */
export function parseSym(sym: string): ChordSym {
  const m = norm(sym.trim()).match(/^([A-G])([b#]?)(.*)$/)
  if (!m) throw new Error('bad chord ' + sym)
  const [, letter, acc, rest] = m
  return { sym, letter, root: (NAT[letter] + (acc === 'b' ? -1 : acc === '#' ? 1 : 0) + 12) % 12, rest, fam: family(rest) }
}

export const isDominant = (c: ChordSym) => c.fam === 'dom'

/** Spell a pitch class from its degree: the letter comes from the degree, the accidental is what is left over. */
export function spell(letter: string, deg: string, pc: number): string {
  const base = deg.replace(/[♭♯°]/g, '')
  const L = LETTERS[(LETTERS.indexOf(letter) + (DEG_LETTER[base] ?? 0)) % 7]
  const diff = ((((pc - NAT[L] + 6) % 12) + 12) % 12) - 6
  if (Math.abs(diff) > 1) {
    for (const L2 of LETTERS)
      for (const [a, s] of [[0, ''], [-1, '♭'], [1, '♯']] as const) if ((NAT[L2] + a + 12) % 12 === pc) return L2 + s
  }
  return L + (diff === -1 ? '♭' : diff === 1 ? '♯' : '')
}

/** Spell the root itself ("B♭", "C♯"). */
export const rootName = (c: ChordSym) => spell(c.letter, 'R', c.root)

/** Pretty print a typed symbol: b → ♭, # → ♯. */
export const pretty = (s: string) => s.replace(/b(?=\d|5|9|1)/g, '♭').replace(/#/g, '♯').replace(/^([A-G])b/, '$1♭')

// ───────────── shapes ─────────────

export interface ShapeNote {
  /** String index, 0 = B … 4 = G. */
  str: number
  /** Fret, or the harmonic's fret for a harmonic. 0 = open. */
  fret: number
  harmonic: boolean
  midi: number
}

/** "x-8-x-9-9", "x-8-h7-h7-h7" → notes, low string to high. Throws if it is not five tokens. */
export function parseShape(shape: string): ShapeNote[] {
  const toks = shape.trim().split('-')
  if (toks.length !== 5) throw new Error(`${shape}: need 5 strings`)
  const out: ShapeNote[] = []
  toks.forEach((t, str) => {
    if (t === 'x') return
    if (t.startsWith('h')) {
      const f = +t.slice(1)
      if (!(f in HARM)) throw new Error(`${shape}: no harmonic over fret ${f}`)
      out.push({ str, fret: f, harmonic: true, midi: OPEN[str] + HARM[f] })
    } else {
      const f = +t
      if (!Number.isInteger(f) || f < 0) throw new Error(`${shape}: bad fret ${t}`)
      out.push({ str, fret: f, harmonic: false, midi: OPEN[str] + f })
    }
  })
  return out
}

export const shapeOf = (frets: (number | null)[]) => frets.map((f) => (f == null ? 'x' : String(f))).join('-')

export interface VNote extends ShapeNote {
  pc: number
  /** Degree label in this chord, "?" if the note does not belong. */
  deg: string
  name: string
}

/** Lowest pitch at which each interval (semitones) between two neighbours is clear: the low interval limits. */
export const LIMITS: Record<number, number> = { 1: 52, 2: 51, 3: 48, 4: 47, 5: 45, 6: 35, 7: 37, 8: 41, 9: 41, 10: 41, 11: 41 }

export interface Analysis {
  chord: ChordSym
  notes: VNote[]
  /** Fretted span (open strings and harmonics excluded). */
  span: number
  stretch: boolean
  /** Lowest and highest fretted fret. */
  lo: number
  hi: number
  errors: string[]
  /** Mud and order warnings: things to listen for, not mistakes. */
  warnings: string[]
  /** Neighbour pairs below their clear floor (index of the lower note). */
  mud: { at: number; interval: number; inner: boolean }[]
}

const REQ: [string, number][] = [['b9', 1], ['#9', 3], ['#11', 6], ['b13', 8], ['b5', 6], ['#5', 8]]

/** Compute and check one shape for one chord (the method's build step, live). */
export function analyse(sym: string, shape: string): Analysis {
  const chord = parseSym(sym)
  const errors: string[] = []
  const warnings: string[] = []
  let raw: ShapeNote[] = []
  try {
    raw = parseShape(shape)
  } catch (e) {
    errors.push((e as Error).message)
  }
  if (raw.length < 2) errors.push('fewer than 2 notes')
  const fretted = raw.filter((n) => !n.harmonic && n.fret > 0).map((n) => n.fret)
  raw.filter((n) => !n.harmonic && n.fret > 20).forEach((n) => errors.push(`fret ${n.fret} is too high`))
  const lo = fretted.length ? Math.min(...fretted) : 0
  const hi = fretted.length ? Math.max(...fretted) : 0
  const span = hi - lo
  let stretch = false
  if (span >= 5 || (span === 4 && lo < 5)) errors.push(`a span of ${span} frets${span === 4 ? ' below fret 5' : ''} is not playable`)
  else if (span === 4) stretch = true
  const table = FAM[chord.fam]
  const notes: VNote[] = raw.map((n) => {
    const pc = (n.midi - chord.root + 120) % 12
    let deg = table[pc]
    if (deg == null) {
      errors.push(`${STRING_NAMES[n.str]} string: a note ${pc} semitones above the root is not in ${sym}`)
      return { ...n, pc: n.midi % 12, deg: '?', name: '?' }
    }
    if (chord.fam === 'min' && pc === 9 && !chord.rest.includes('13')) deg = '6'
    return { ...n, pc: n.midi % 12, deg, name: spell(chord.letter, deg, n.midi % 12) }
  })
  const pcs = new Set(notes.map((n) => (n.midi - chord.root + 120) % 12))
  for (const [tok, need] of REQ) if (chord.rest.includes(tok) && !pcs.has(need)) warnings.push(`the symbol says ${pretty(tok)} but the shape has none`)
  const ps = notes.map((n) => n.midi)
  if (ps.some((p, i) => i && p < ps[i - 1])) warnings.push('the notes do not rise from string to string')
  const mud: Analysis['mud'] = []
  const plain = notes.filter((n) => !n.harmonic)
  plain.forEach((a, i) => {
    const b = plain[i + 1]
    if (!b) return
    const iv = b.midi - a.midi
    if (LIMITS[iv] != null && a.midi < LIMITS[iv]) {
      const rootLow = (a.midi - chord.root + 120) % 12 === 0
      if (rootLow && iv >= 8) return
      mud.push({ at: notes.indexOf(a), interval: iv, inner: !rootLow })
      warnings.push(`${a.deg}–${b.deg} (${IV_NAME[iv]}) sits below its clear floor`)
    }
  })
  return { chord, notes, span, stretch, lo, hi, errors, warnings, mud }
}

export const IV_NAME: Record<number, string> = {
  1: 'minor 2nd', 2: 'major 2nd', 3: 'minor 3rd', 4: 'major 3rd', 5: 'fourth', 6: 'tritone', 7: 'fifth',
  8: 'minor 6th', 9: 'major 6th', 10: 'minor 7th', 11: 'major 7th',
}

// ───────────── clear zones around one note (Law 2) ─────────────

/**
 * Two notes together: clear (true), mud (false), or the same pitch (null). The same rule as the checker:
 * the lower note must be at or above the floor of the interval; an octave or more is always clear,
 * and a low root under a 6th or 7th passes.
 */
export function clearPair(a: number, b: number, root: number): boolean | null {
  const lo = Math.min(a, b)
  const iv = Math.abs(a - b)
  if (iv === 0) return null
  if (iv >= 12) return true
  if ((lo - root + 120) % 12 === 0 && iv >= 8) return true
  return lo >= LIMITS[iv]
}

/** The neck around one held note, string by string: runs of frets where a second note is clear with it, or mud. */
export function zonesAround(midi: number, root: number, strings = 5, last = 24): { str: number; from: number; to: number; clear: boolean }[] {
  const out: { str: number; from: number; to: number; clear: boolean }[] = []
  for (let str = 0; str < strings; str++) {
    let run: (typeof out)[number] | null = null
    for (let f = 1; f <= last; f++) {
      const c = clearPair(midi, OPEN[str] + f, root)
      if (c === null) {
        run = null
        continue
      }
      if (run && run.clear === c) run.to = f
      else out.push((run = { str, from: f, to: f, clear: c }))
    }
  }
  return out
}

const FAMILY: [string, number[]][] = [['2nds', [1, 2]], ['3rds', [3, 4]], ['a 4th', [5]], ['a tritone', [6]], ['a 5th', [7]], ['6ths', [8, 9]], ['7ths', [10, 11]]]

/** In words: which intervals above a held note are mud at its height, and which are clear. */
export function zoneWords(midi: number, root: number): { mud: string[]; clear: string[] } {
  const mud: string[] = []
  const clear: string[] = []
  FAMILY.forEach(([name, ivs]) => {
    const ok = ivs.map((iv) => clearPair(midi, midi + iv, root) === true)
    if (ok.every(Boolean)) clear.push(name)
    else if (ok.some(Boolean)) {
      // the major one passes first: its floor is a half step lower
      mud.push(`the ${IV_NAME[ivs[0]]}`)
      clear.push(`the ${IV_NAME[ivs[1]]}`)
    } else mud.push(name)
  })
  return { mud, clear }
}

// ───────────── registers (Chapter 1) ─────────────

export type Band = 'bass' | 'chord' | 'melody'
/** Bass B0–F2, chord F2–A3, melody E3 up. The bands overlap at the edges, as on a piano. */
export const BANDS: Record<Band, [number, number]> = { bass: [23, 41], chord: [41, 57], melody: [52, 76] }
export const bandsOf = (midi: number) => (Object.keys(BANDS) as Band[]).filter((b) => midi >= BANDS[b][0] && midi <= BANDS[b][1])

const SHARP = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B']
/** Scientific pitch name of a MIDI number ("E3"). */
export const pitchName = (m: number) => SHARP[m % 12] + (Math.floor(m / 12) - 1)

/** Interval in semitones from strings up and frets (Law 1). */
export const lawOne = (strings: number, frets: number) => 5 * strings + frets

/** The degree name of an interval in a neutral (dominant-ish) reading, for the map. */
export const MAP_NAME: Record<number, string> = {
  0: 'R', 1: '♭9', 2: '9', 3: '♭3', 4: '3', 5: '4 (11)', 6: '♭5 (♯11)', 7: '5', 8: '♭6 (♭13)', 9: '6 (13)', 10: '♭7', 11: '7',
}

/** Midi notes of a shape, low to high (open strings ring, harmonics included). */
export const midisOf = (shape: string) => parseShape(shape).map((n) => n.midi)
