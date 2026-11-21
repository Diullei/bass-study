import { Q, type Chord } from '../../theory/chords'
import { clean, iv, LET, midiOf, mod, NAT, nm, pc, type Note } from '../../theory/notes'

/**
 * The harmony engine. Everything the course shows as a table is computed here from the seven rules,
 * so a table can always be traced back to the rule that produced it.
 */

// ───────────── chords ─────────────

/** Written quality → quality in theory/chords Q. */
const QALIAS: Record<string, string> = {
  '': '',
  maj7: 'maj7',
  maj9: 'maj9',
  'maj7♯11': 'maj7♯11',
  m: 'm',
  m7: 'm7',
  m9: 'm9',
  m6: 'm6',
  'm(maj7)': 'm(maj7)',
  'm7♭5': 'm7♭5',
  ø: 'm7♭5',
  o7: '°7',
  '°7': '°7',
  '6': '6',
  '7': '7',
  '9': '9',
  '13': '13',
  '7♭9': '7♭9',
  '7♯9': '7♯9',
  '7♯11': '7♯11',
  '9♯11': '7♯11',
  '13♯11': '7♯11',
  '13♭9': '13♭9',
  '7alt': '7alt',
  '7sus4': '7sus4',
  '9sus4': '7sus4',
  '7♭9♭13': '7♭9',
  '7♯9♭13': '7♯9',
}

export interface HChord {
  root: Note
  q: string
  bass?: Note
  sym: string
}

const parseRoot = (s: string): [Note, string] | null => {
  const m = s.match(/^([A-G])([♭♯b#]?)(.*)$/)
  if (!m) return null
  const a = m[2] === '♭' || m[2] === 'b' ? -1 : m[2] === '♯' || m[2] === '#' ? 1 : 0
  return [{ l: LET.indexOf(m[1]), a }, m[3]]
}

/** "Dm7", "G7♭9", "Bo7", "F/G", "D♭maj7" … */
export function parseChord(s: string): HChord | null {
  const [main, slash] = s.split('/')
  const r = parseRoot(main)
  if (!r) return null
  const q = QALIAS[r[1]] ?? (r[1].startsWith('maj') ? 'maj7' : r[1].startsWith('m7♭5') ? 'm7♭5' : r[1].startsWith('m') ? 'm7' : r[1].startsWith('7') ? '7' : null)
  if (q == null) return null
  const b = slash ? parseRoot(slash) : null
  return { root: r[0], q, bass: b?.[0], sym: s }
}

export interface Tone {
  n: Note
  /** Semitones above the root. */
  s: number
  /** Degree name: 1, ♭3, 5, ♭7 … */
  name: string
}

const DEG_NAME = (d: number, s: number) => {
  const nat: Record<number, number> = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11, 9: 14, 11: 17, 13: 21 }
  const diff = s - nat[d]
  return (diff === -2 ? '𝄫' : diff === -1 ? '♭' : diff === 1 ? '♯' : '') + d
}

/** The chord's own notes (for 7alt and friends: the bare 1 3 ♭7 skeleton). */
export function chordTones(c: Pick<HChord, 'root' | 'q'>): Tone[] {
  const base = c.q === '7alt' || c.q === '13' || c.q === '9' || c.q === '13♭9' || c.q === '7♭9' || c.q === '7♯9' || c.q === '7♯11' ? '7' : c.q === 'maj9' || c.q === 'maj7♯11' ? 'maj7' : c.q === 'm9' ? 'm7' : c.q
  return Q[base].map(([d, s]) => ({ n: iv(c.root, d, s), s, name: d === 3 && s === 3 ? '♭3' : d === 7 && s === 10 ? '♭7' : d === 7 && s === 9 ? '𝄫7' : DEG_NAME(d, s) }))
}

/** All the notes to sound, extensions included. */
export function soundTones(c: Pick<HChord, 'root' | 'q'>): Note[] {
  return Q[c.q].map(([d, s]) => iv(c.root, d, s))
}

const hasTritone = (pcs: number[]) => pcs.some((a) => pcs.includes(mod(a + 6, 12)))
export const isDominant = (q: string) => {
  const t = chordTones({ root: { l: 0, a: 0 }, q }).map((x) => x.s)
  return t.includes(4) && t.includes(10)
}

// ───────────── scales ─────────────

/** Scale formulas as [degree, semitones]. */
export const SCALES: Record<string, { name: string; f: [number, number][] }> = {
  ionian: { name: 'Ionian (major)', f: [[1, 0], [2, 2], [3, 4], [4, 5], [5, 7], [6, 9], [7, 11]] },
  dorian: { name: 'Dorian', f: [[1, 0], [2, 2], [3, 3], [4, 5], [5, 7], [6, 9], [7, 10]] },
  phrygian: { name: 'Phrygian', f: [[1, 0], [2, 1], [3, 3], [4, 5], [5, 7], [6, 8], [7, 10]] },
  lydian: { name: 'Lydian', f: [[1, 0], [2, 2], [3, 4], [4, 6], [5, 7], [6, 9], [7, 11]] },
  mixolydian: { name: 'Mixolydian', f: [[1, 0], [2, 2], [3, 4], [4, 5], [5, 7], [6, 9], [7, 10]] },
  aeolian: { name: 'Aeolian (natural minor)', f: [[1, 0], [2, 2], [3, 3], [4, 5], [5, 7], [6, 8], [7, 10]] },
  locrian: { name: 'Locrian', f: [[1, 0], [2, 1], [3, 3], [4, 5], [5, 6], [6, 8], [7, 10]] },
  locrian2: { name: 'Locrian ♮2', f: [[1, 0], [2, 2], [3, 3], [4, 5], [5, 6], [6, 8], [7, 10]] },
  mixob13: { name: 'Mixolydian ♭13', f: [[1, 0], [2, 2], [3, 4], [4, 5], [5, 7], [6, 8], [7, 10]] },
  mixob9b13: { name: 'Mixolydian ♭9 ♭13', f: [[1, 0], [2, 1], [3, 4], [4, 5], [5, 7], [6, 8], [7, 10]] },
  lyddom: { name: 'Lydian dominant', f: [[1, 0], [2, 2], [3, 4], [4, 6], [5, 7], [6, 9], [7, 10]] },
  altered: { name: 'Altered', f: [[1, 0], [2, 1], [3, 3], [3, 4], [4, 6], [6, 8], [7, 10]] },
  hw: { name: 'Half-whole diminished', f: [[1, 0], [2, 1], [3, 3], [3, 4], [4, 6], [5, 7], [6, 9], [7, 10]] },
  wholetone: { name: 'Whole tone', f: [[1, 0], [2, 2], [3, 4], [4, 6], [6, 8], [7, 10]] },
  melmin: { name: 'Melodic minor', f: [[1, 0], [2, 2], [3, 3], [4, 5], [5, 7], [6, 9], [7, 11]] },
  harmmin: { name: 'Harmonic minor', f: [[1, 0], [2, 2], [3, 3], [4, 5], [5, 7], [6, 8], [7, 11]] },
  wh: { name: 'Whole-half diminished', f: [[1, 0], [2, 2], [3, 3], [4, 5], [5, 6], [6, 8], [6, 9], [7, 11]] },
}

export const scaleNotes = (root: Note, scale: string): Note[] => SCALES[scale].f.map(([d, s]) => iv(root, d, s))

// ───────────── Rule 6: what each scale note does over a chord ─────────────

export type Role = 'chord' | 'tension' | 'avoid' | 'shift'

export interface NoteRole {
  n: Note
  s: number
  role: Role
  /** "9", "♭13", "11" … or the chord degree. */
  name: string
  /** One plain sentence: why. Contains [[R6]]-style rule links. */
  why: string
}

const TENSION_NAME: Record<number, string> = { 1: '♭9', 2: '9', 3: '♯9', 5: '11', 6: '♯11', 8: '♭13', 9: '13', 11: 'maj7' }

/** Name a non-chord note by its distance from the root. */
export function tensionName(s: number, q: string): string {
  if (s === 3 && !isDominant(q)) return '♭3'
  if (s === 6 && !isDominant(q) && /♭5|°/.test(q)) return '♭5'
  if (s === 9 && q === '°7') return '6'
  if (s === 4 && q === '7sus4') return '3'
  if (s === 10 && /maj|6/.test(q)) return '♭7'
  return TENSION_NAME[s] ?? String(s)
}

/**
 * Apply Rule 6 to every note of a scale over a chord.
 * - half step above a chord tone → avoid (on a dominant, only above the 3rd);
 * - otherwise, on a chord with no tritone, a note that forms a tritone with the 3rd or the ♭7
 *   makes the chord sound like a dominant (Rule 2) → it shifts the chord's job;
 * - otherwise → tension.
 */
export function analyse(c: Pick<HChord, 'root' | 'q'>, scale: Note[]): NoteRole[] {
  const ct = chordTones(c)
  const cps = ct.map((t) => pc(t.n))
  const r = pc(c.root)
  const dom = isDominant(c.q)
  const third = ct.find((t) => t.name === '3' || t.name === '♭3')
  const tri = hasTritone(cps)
  return scale.map((n) => {
    const p = pc(n)
    const s = mod(p - r, 12)
    const own = ct.find((t) => pc(t.n) === p)
    const called = (t: Tone) => (t.name === '1' ? 'the root' : `the ${t.name}`)
    if (own) return { n, s, role: 'chord' as Role, name: own.name, why: `chord tone (${own.name})` }
    const name = tensionName(s, c.q)
    const below = ct.find((t) => pc(t.n) === mod(p - 1, 12))
    if (below) {
      if (!dom || below === third)
        return {
          n,
          s,
          role: 'avoid' as Role,
          name,
          why: `a half step above ${nm(below.n)} (${called(below)}), so it leans into it [[R1]] — avoid note [[R6]]${dom ? '; on a dominant the rub against the 3rd still counts' : ''}`,
        }
      return { n, s, role: 'tension' as Role, name, why: `a half step above ${nm(below.n)} (${called(below)}), but dominants welcome that rub [[R6]]` }
    }
    if (!tri) {
      // a tritone against the 3rd or the ♭7 is the core of a dominant (its two guide tones)
      const partner = ct.find((t) => pc(t.n) === mod(p + 6, 12) && (t === third || t.name === '♭7'))
      if (partner)
        return {
          n,
          s,
          role: 'shift' as Role,
          name,
          why: `no rub, but with ${nm(partner.n)} (${called(partner)}) it forms a tritone, which makes the chord sound like a dominant [[R2]] — a colour that changes the chord's job`,
        }
    }
    return { n, s, role: 'tension' as Role, name, why: `a whole step or more from every chord tone below it, so it adds colour without rubbing` }
  })
}

export const ROLE_PEN: Record<Role, string> = { chord: '', tension: 'pen-green', avoid: 'pen-purple', shift: 'pen-blue' }
export const ROLE_WORD: Record<Role, string> = { chord: 'chord tone', tension: 'tension', avoid: 'avoid note', shift: 'changes the job' }

// ───────────── keys ─────────────

export type Mode = 'major' | 'minor'

/** The seven notes of a key: major, or natural minor. */
export const keyNotes = (tonic: Note, mode: Mode): Note[] => scaleNotes(tonic, mode === 'major' ? 'ionian' : 'aeolian')

export const TONICS: Note[] = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'].map((s) => parseRoot(s)![0])
export const MINOR_TONICS: Note[] = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'].map((s) => parseRoot(s)![0])

const DIA_Q = { major: ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7♭5'], minor: ['m7', 'm7♭5', 'maj7', 'm7', 'm7', 'maj7', '7'] }
const RN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
const RN_Q: Record<string, string> = { maj7: 'maj7', m7: 'm7', '7': '7', 'm7♭5': 'm7♭5' }

/** The seventh chords of a key, built by stacking thirds from each degree. */
export function diatonic(tonic: Note, mode: Mode = 'major') {
  const k = keyNotes(tonic, mode)
  return k.map((root, i) => {
    const q = DIA_Q[mode][i]
    const rn = (mode === 'minor' && [2, 5, 6].includes(i) ? '♭' : '') + RN[i] + RN_Q[q]
    return { root, q, rn, sym: nm(root) + q, notes: [0, 2, 4, 6].map((j) => k[(i + j) % 7]) }
  })
}

export type Func = 'tonic' | 'subdominant' | 'dominant'

/** Rule 4: function from the key's two pulling notes (4th and 7th degree of a major key). */
export function functionOf(tonic: Note, notes: Note[]): { f: Func; four: boolean; seven: boolean } {
  const k = keyNotes(tonic, 'major')
  const ps = notes.map(pc)
  const four = ps.includes(pc(k[3]))
  const seven = ps.includes(pc(k[6]))
  return { f: four && seven ? 'dominant' : four ? 'subdominant' : 'tonic', four, seven }
}

// ───────────── Rule 5: a chord's scale from the key ─────────────

export interface DeriveStep {
  /** The key's note on this letter. */
  key: Note
  /** The chord's note on this letter, if any. */
  chord?: Note
  /** What the scale keeps. */
  out: Note
  changed: boolean
}

/** Start from the chord's root, walk the key's letters, let the chord win where they disagree. */
export function derive(tonic: Note, mode: Mode, c: Pick<HChord, 'root' | 'q'>): { steps: DeriveStep[]; clash: boolean } {
  const k = keyNotes(tonic, mode)
  const ct = chordTones(c)
  const steps: DeriveStep[] = []
  for (let j = 0; j < 7; j++) {
    const l = (c.root.l + j) % 7
    const key = k.find((n) => n.l === l)!
    const chord = ct.find((t) => t.n.l === l)?.n
    const out = chord ?? key
    steps.push({ key, chord, out, changed: !!chord && pc(chord) !== pc(key) })
  }
  const ps = steps.map((s) => pc(s.out))
  return { steps, clash: new Set(ps).size < ps.length }
}

/** Which named scale a 7-note collection is, from its root. */
export function nameScale(root: Note, notes: Note[]): string | null {
  const set = notes.map((n) => mod(pc(n) - pc(root), 12)).sort((a, b) => a - b).join(',')
  for (const [id, sc] of Object.entries(SCALES)) if (sc.f.map(([, s]) => s).sort((a, b) => a - b).join(',') === set) return id
  return null
}

// ───────────── handy moves ─────────────

/** Rule 3 backwards: the root a fifth above, as a dominant 7th. */
export const fifthAbove = (n: Note) => clean(iv(n, 5, 7))
/** The tritone partner (the tritone sub's root), spelled as a ♭5. */
export const tritoneOf = (n: Note) => clean(iv(n, 5, 6))
export const halfAbove = (n: Note) => clean(iv(n, 2, 1))

export const name = nm

// ───────────── voicing (for listening) ─────────────

/** Close-position voicing between E3 and C5, plus the root an octave or two below for the bass. */
export function voice(c: HChord, opts: { rootless?: boolean } = {}): { notes: number[]; bass: number } {
  const ns = soundTones(c).filter((_, i) => i > 0 || !opts.rootless)
  let prev = 51
  const notes = ns
    .map((n) => {
      let m = midiOf(n, 3)
      while (m <= prev) m += 12
      prev = m
      return m
    })
    .map((m) => (m > 79 ? m - 12 : m))
    .sort((a, b) => a - b)
  const b = c.bass ?? c.root
  let bass = midiOf(b, 2)
  while (bass > 40) bass -= 12
  while (bass < 28) bass += 12
  return { notes, bass }
}

/** "B3", "F♯4", "Eb2" → midi. */
export function midiOfName(s: string): number {
  const m = s.match(/^([A-G])([♭♯b#𝄫]?)(-?\d)$/)
  if (!m) throw new Error('bad note ' + s)
  const a = m[2] === '♭' || m[2] === 'b' ? -1 : m[2] === '♯' || m[2] === '#' ? 1 : m[2] === '𝄫' ? -2 : 0
  return 12 * (+m[3] + 1) + NAT[LET.indexOf(m[1])] + a
}

export const asChord = (c: HChord, start = 0, dur = 4): Chord => ({ root: c.root, q: c.q, start, dur })
