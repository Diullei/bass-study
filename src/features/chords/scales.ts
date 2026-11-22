/**
 * Chord scales: the scale that fits a chord, chosen the way an improviser chooses it.
 * A chord inside its key takes the key's own notes started on the chord's root (a mode); a chord outside the key
 * takes the scale its symbol and its destination ask for. Every note is then sorted by what it does over the chord:
 * a chord tone, a colour you can hold, or a passing note (a half step above a chord tone, Rule 6 of the harmony course).
 */
import { FAM, parseSym, spell, type ChordSym, type Family } from './voicing'

export type ScaleId =
  | 'ionian' | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'aeolian' | 'locrian'
  | 'melodic' | 'harmonic' | 'lydDom' | 'altered' | 'halfWhole' | 'wholeHalf' | 'phrygDom' | 'locrian2' | 'lydAug' | 'wholeTone' | 'mixoB13'

export const SCALES: Record<ScaleId, { name: string; ivs: number[] }> = {
  ionian: { name: 'Ionian (major)', ivs: [0, 2, 4, 5, 7, 9, 11] },
  dorian: { name: 'Dorian', ivs: [0, 2, 3, 5, 7, 9, 10] },
  phrygian: { name: 'Phrygian', ivs: [0, 1, 3, 5, 7, 8, 10] },
  lydian: { name: 'Lydian', ivs: [0, 2, 4, 6, 7, 9, 11] },
  mixolydian: { name: 'Mixolydian', ivs: [0, 2, 4, 5, 7, 9, 10] },
  aeolian: { name: 'Aeolian (natural minor)', ivs: [0, 2, 3, 5, 7, 8, 10] },
  locrian: { name: 'Locrian', ivs: [0, 1, 3, 5, 6, 8, 10] },
  melodic: { name: 'melodic minor', ivs: [0, 2, 3, 5, 7, 9, 11] },
  harmonic: { name: 'harmonic minor', ivs: [0, 2, 3, 5, 7, 8, 11] },
  lydDom: { name: 'Lydian dominant', ivs: [0, 2, 4, 6, 7, 9, 10] },
  altered: { name: 'altered', ivs: [0, 1, 3, 4, 6, 8, 10] },
  halfWhole: { name: 'half–whole diminished', ivs: [0, 1, 3, 4, 6, 7, 9, 10] },
  wholeHalf: { name: 'whole–half diminished', ivs: [0, 2, 3, 5, 6, 8, 9, 11] },
  phrygDom: { name: 'Mixolydian ♭9 ♭13', ivs: [0, 1, 4, 5, 7, 8, 10] },
  locrian2: { name: 'Locrian ♮2', ivs: [0, 2, 3, 5, 6, 8, 10] },
  lydAug: { name: 'Lydian augmented', ivs: [0, 2, 4, 6, 8, 9, 11] },
  wholeTone: { name: 'whole tone', ivs: [0, 2, 4, 6, 8, 10] },
  mixoB13: { name: 'Mixolydian ♭13', ivs: [0, 2, 4, 5, 7, 8, 10] },
}

/** The notes that make the chord itself, per family (semitones above the root). */
const CORE: Record<Family, number[]> = {
  maj: [0, 4, 7, 11], six: [0, 4, 7, 9], tri: [0, 4, 7], dom: [0, 4, 7, 10], sus: [0, 5, 7, 10], min: [0, 3, 7, 10],
  m6: [0, 3, 7, 9], mtri: [0, 3, 7], mmaj: [0, 3, 7, 11], hdim: [0, 3, 6, 10], dim: [0, 3, 6, 9], dtri: [0, 3, 6],
}
/** The family whose colours a smaller chord borrows (a triad has the colours of its seventh chord). */
const WIDER: Partial<Record<Family, Family>> = { tri: 'maj', six: 'maj', mtri: 'min', m6: 'min', dtri: 'dim' }
/** A name for a scale note that is neither a chord tone nor an allowed colour. */
const PLAIN: Record<number, string> = { 1: '♭9', 2: '9', 3: '♯9', 4: '3', 5: '11', 6: '♯11', 8: '♭13', 9: '13', 10: '♭7', 11: '7' }

export type Role = 'root' | 'guide' | 'fifth' | 'colour' | 'pass'

export interface ScaleNote {
  /** Semitones above the chord's root. */
  iv: number
  pc: number
  /** Degree over the chord: R, 9, ♭3, 11 … */
  deg: string
  name: string
  role: Role
  /** Half steps up to the next note of the scale. */
  step: number
}

export interface ChordScale {
  id: ScaleId
  /** "D Dorian". */
  title: string
  /** One line: why this scale. */
  why: string
  notes: ScaleNote[]
  /** Pitch class → its note, for drawing. */
  at: Record<number, ScaleNote>
}

/** What the chord before and after, and the key, tell about a chord. */
export interface ScaleContext {
  /** Tonic of the major key the progression lives in (pitch class), if any. */
  key?: number
  /** The progression is in the relative minor of `key` (it has that minor chord and its own ii or V). */
  minor?: boolean
  next?: string
  /** Pitch classes the scale must hold: the notes the shape itself plays. */
  must?: number[]
  /** Use this scale, whatever the context says (a lesson that is about one scale). */
  force?: ScaleId
}

const has = (c: ChordSym, ...t: string[]) => t.some((x) => c.rest.includes(x))
const KEY_NAME = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B']
const ROMAN = ['I', '', 'II', '', 'III', 'IV', '', 'V', '', 'VI', '', 'VII']
const MODE: Record<number, ScaleId> = { 0: 'ionian', 2: 'dorian', 4: 'phrygian', 5: 'lydian', 7: 'mixolydian', 9: 'aeolian', 11: 'locrian' }
const majorish = (f: Family) => f === 'maj' || f === 'six' || f === 'tri'
const minorish = (f: Family) => f === 'min' || f === 'mtri' || f === 'm6'

/** Is this chord one of the key's own seventh chords? → the degree (semitones above the tonic), else null. */
function diatonic(c: ChordSym, key: number): number | null {
  const d = (c.root - key + 12) % 12
  const plainDom = c.fam === 'dom' && !has(c, 'b9', '#9', '#11', 'b5', '#5', 'b13', 'alt')
  const ok =
    ((d === 0 || d === 5) && majorish(c.fam) && !has(c, '#5') && (d === 5 || !has(c, '#11'))) ||
    ((d === 2 || d === 4 || d === 9) && minorish(c.fam) && (d === 2 || c.fam !== 'm6')) ||
    (d === 7 && (plainDom || c.fam === 'sus' || c.fam === 'tri')) ||
    (d === 11 && (c.fam === 'hdim' || c.fam === 'dtri'))
  return ok ? d : null
}

/** The major key that most chords of a progression belong to (pitch class), or undefined when none fits. */
export function keyOf(syms: string[]): number | undefined {
  const cs = syms.map((x) => parseSym(x))
  let best: number | undefined
  let top = 0
  for (let k = 0; k < 12; k++) {
    let sc = 0
    cs.forEach((c, i) => {
      const d = diatonic(c, k)
      if (d == null) return
      sc += 1
      // a chord with a 7th says more than a triad; the tonic, and a V going home, say most
      if (d === 0 && majorish(c.fam)) sc += 0.6
      if (d === 9 && i === cs.length - 1) sc += 0.3
      if (d === 7 && c.fam === 'dom') sc += 0.5
      if (i === cs.length - 1 && d === 0) sc += 0.5
    })
    if (sc > top) [top, best] = [sc, k]
  }
  // a row of dominants only (a blues) has no major key: each one keeps its own dominant scale
  if (best == null || cs.length < 2 || top < 2) return undefined
  const k = best
  return cs.some((c) => c.fam !== 'dom' && diatonic(c, k) != null) ? k : undefined
}

/** Does the progression sit in the relative minor of this key? (its minor chord, with the ii or the V that points to it) */
export function isMinorKey(syms: string[], key: number): boolean {
  const cs = syms.map((x) => parseSym(x))
  const at = (d: number) => cs.filter((c) => (c.root - key + 12) % 12 === d)
  return at(9).some((c) => minorish(c.fam)) && (at(11).some((c) => c.fam === 'hdim') || at(4).some((c) => c.fam === 'dom')) && !at(0).some((c) => majorish(c.fam))
}

function choose(c: ChordSym, ctx: ScaleContext): [ScaleId, string] {
  const d = ctx.key != null ? diatonic(c, ctx.key) : null
  if (d != null && ctx.key != null) {
    const K = KEY_NAME[ctx.key]
    const rn = minorish(c.fam) || c.fam === 'hdim' || c.fam === 'dtri' ? ROMAN[d].toLowerCase() : ROMAN[d]
    const m = KEY_NAME[(ctx.key + 9) % 12]
    if (ctx.minor && d === 11) return [MODE[d], `ii of ${m} minor: the ${m} natural minor scale started on its 2nd note`]
    if (ctx.minor && d === 9) return [MODE[d], `i of ${m} minor: the natural minor scale (the same notes as ${K} major)`]
    return [MODE[d], d === 0 ? `${rn} of ${K} major: the key's own scale` : `${rn} of ${K} major: the ${K} major scale started on its ${['', '', '2nd', '', '3rd', '4th', '', '5th', '', '6th', '', '7th'][d]} note`]
  }
  const nx = ctx.next ? parseSym(ctx.next) : null
  const up4 = nx ? (nx.root - c.root + 12) % 12 === 5 : false
  const downHalf = nx ? (c.root - nx.root + 12) % 12 === 1 : false
  switch (c.fam) {
    case 'maj':
    case 'six':
    case 'tri':
      if (has(c, '#5')) return ['lydAug', 'the ♯5 in the symbol: Lydian with a raised 5th']
      if (has(c, '#11', 'b5')) return ['lydian', 'the ♯11 in the symbol']
      if (ctx.key != null) return ['lydian', 'a major chord from outside the key: Lydian has no passing note, the ♯11 replaces the 4th']
      return ['ionian', 'the usual choice for a major chord; raise the 4th (Lydian) to remove the passing note']
    case 'dom': {
      const b9 = has(c, 'b9')
      const s9 = has(c, '#9')
      const alt5 = has(c, 'b13', '#5', 'b5', 'alt')
      if (has(c, 'alt') || ((b9 || s9) && alt5)) return ['altered', 'altered 9ths with an altered 5th: every colour is bent, all pull to the next chord']
      if ((b9 || s9) && has(c, '13')) return ['halfWhole', 'an altered 9th with a natural 13: the diminished sound']
      if (s9) return ['halfWhole', 'the ♯9 in the symbol with a natural 5th']
      if (b9) return nx && minorish(nx.fam) ? ['phrygDom', 'a ♭9 going to a minor chord: the ♭9 and ♭13 are notes of the key it is going to'] : ['halfWhole', 'a ♭9 with a natural 13: the diminished sound']
      if (has(c, '#11')) return ['lydDom', 'the ♯11 in the symbol']
      if (has(c, '#5')) return ['wholeTone', 'the ♯5 in the symbol: all whole steps']
      if (has(c, 'b13')) return ['mixoB13', 'the ♭13 in the symbol']
      if (up4 && nx && (minorish(nx.fam) || nx.fam === 'hdim' || nx.fam === 'mmaj')) return ['phrygDom', `it resolves to a minor chord: ♭9 and ♭13 are notes of the key it is going to`]
      if (up4) return ['mixolydian', 'it resolves down a fifth to a major sound: the plain dominant scale']
      if (downHalf) return ['lydDom', 'it slides down a half step (a tritone substitute): the ♯11 is the root of the dominant it replaces']
      if (ctx.key != null) return ['lydDom', 'a dominant from outside the key that does not resolve down a fifth: the ♯11 removes the passing note']
      return ['mixolydian', 'the usual choice for a dominant chord']
    }
    case 'sus':
      return has(c, 'b9') ? ['phrygian', 'sus with a ♭9: the Phrygian sound'] : ['mixolydian', 'a sus chord: the dominant scale, with the 4th as a chord tone']
    case 'min':
    case 'mtri':
      return ['dorian', ctx.key != null ? 'a minor chord from outside the key: Dorian, its 13 can be held' : 'the usual choice for a minor 7th chord: its 13 can be held']
    case 'm6':
    case 'mmaj':
      return ['melodic', 'a minor chord with a major 6th or 7th: the minor scale with both raised']
    case 'hdim':
      return has(c, '9') ? ['locrian2', 'the 9 in the symbol: Locrian with a raised 2nd'] : ['locrian', 'the usual choice for a half-diminished chord (raise the 2nd for a 9 you can hold)']
    case 'dim':
    case 'dtri':
      return ['wholeHalf', 'a diminished chord: whole step, half step, all the way up']
  }
}

/** The scale for one chord. With a context (key, next chord) the choice follows the progression. */
export function chordScale(sym: string, ctx: ScaleContext = {}): ChordScale {
  const c = parseSym(sym)
  let [id, why] = ctx.force ? [ctx.force, 'the scale this lesson is about'] : choose(c, ctx)
  const core = CORE[c.fam]
  // the shape plays a note the usual scale does not have (a 9 on a half-diminished chord …): take the first scale that holds it
  const need = (ctx.must ?? []).map((pc) => (pc - c.root + 12) % 12)
  const holds = (x: ScaleId) => need.every((iv) => SCALES[x].ivs.includes(iv))
  if (!ctx.force && !holds(id)) {
    const alt = (Object.keys(SCALES) as ScaleId[]).find((x) => holds(x) && core.every((iv) => SCALES[x].ivs.includes(iv)))
    if (alt) [id, why] = [alt, 'chosen for the colours this shape plays']
  }
  const S = SCALES[id]
  const colours = { ...(WIDER[c.fam] ? FAM[WIDER[c.fam]!] : {}), ...(c.fam === 'm6' ? FAM.mmaj : {}), ...FAM[c.fam] }
  // a scale without the chord's own 5th or 3rd names its notes from the scale's side (♯5, ♭5)
  const notes: ScaleNote[] = S.ivs.map((iv, i) => {
    const isCore = core.includes(iv)
    let deg = isCore || colours[iv] ? (colours[iv] ?? PLAIN[iv]) : PLAIN[iv]
    if (iv === 0) deg = 'R'
    if (iv === 3 && core.includes(4)) deg = '♯9'
    if (iv === 5 && c.fam === 'sus') deg = '4'
    if (iv === 4 && id === 'altered') deg = '3'
    if (iv === 6 && id === 'altered') deg = '♭5'
    if (iv === 8 && id === 'altered') deg = '♭13'
    // the 3rd (or the 4th of a sus chord) and the 6th or 7th name the chord; the 5th, plain or bent, only fills it
    const role: Role = iv === 0 ? 'root' : isCore ? (iv >= 6 && iv <= 8 ? 'fifth' : 'guide') : colours[iv] ? 'colour' : 'pass'
    const pc = (c.root + iv) % 12
    return { iv, pc, deg, name: spell(c.letter, deg, pc), role, step: (S.ivs[(i + 1) % S.ivs.length] - iv + 12) % 12 || 12 }
  })
  // an altered or diminished dominant has no passing note: every note is a colour
  if (id === 'altered' || id === 'halfWhole') notes.forEach((n) => n.role === 'pass' && (n.role = 'colour'))
  const at: Record<number, ScaleNote> = {}
  notes.forEach((n) => (at[n.pc] = n))
  return { id, title: `${spell(c.letter, 'R', c.root)} ${S.name}`, why, notes, at }
}

/** The scales of a progression: one key for all, each chord sees the next one (the last sees the first when it loops). */
export function progressionScales(syms: string[]): { key?: number; keyName?: string; scales: ChordScale[] } {
  const key = keyOf(syms)
  const minor = key != null && isMinorKey(syms, key)
  const keyName = key == null ? undefined : minor ? `${KEY_NAME[(key + 9) % 12]} minor` : `${KEY_NAME[key]} major`
  return { key, keyName, scales: syms.map((x, i) => chordScale(x, { key, minor, next: syms[i + 1] ?? syms[0] })) }
}
