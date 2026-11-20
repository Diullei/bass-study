import { isMinorQ, type Chord } from './chords'
import { MAJOR, type Key } from './keys'
import { clean, iv, mod, pc, type Note } from './notes'

/** Roman numerals, jazz convention: relative to the tonic's major scale. */
export const RN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
const RNORD = ['VII', 'III', 'II', 'IV', 'VI', 'V', 'I']

/** Turn ASCII accidentals in a numeral into ♭/♯. */
export const pretty = (s: string) => s.replace(/b(?=[IViv])/g, '♭').replace(/#/g, '♯')

export function parseRoman(input: string, K: Pick<Key, 'tonic'>): { root: Note; q: string } {
  let str = pretty(input)
  if (str.includes('/')) {
    const i = str.indexOf('/')
    const t = parseRoman(str.slice(i + 1), K)
    const r = parseRoman(str.slice(0, i), { tonic: t.root })
    return { root: r.root, q: r.q }
  }
  let acc = 0
  while (/^[♭♯]/.test(str)) {
    acc += str[0] === '♭' ? -1 : 1
    str = str.slice(1)
  }
  const num = RNORD.find((R) => str.toUpperCase().startsWith(R))
  if (!num) throw new Error(`Bad roman numeral: ${input}`)
  const lower = str.slice(0, num.length) === num.toLowerCase()
  const d = RN.indexOf(num)
  const suf = str.slice(num.length)
  const base = iv(K.tonic, d + 1, MAJOR[d])
  const root = clean({ l: base.l, a: base.a + acc })
  const M: Record<string, string> = {
    '': lower ? 'm' : '',
    '7': lower ? 'm7' : '7',
    maj7: lower ? 'm(maj7)' : 'maj7',
    'ø7': 'm7♭5',
    '°7': '°7',
    '°': '°',
    '6': lower ? 'm6' : '6',
    '9': lower ? 'm9' : '9',
    '11': 'm11',
    '13': '13',
    '7♭9': '7♭9',
    '7♯9': '7♯9',
    '7alt': '7alt',
    '7sus4': '7sus4',
    '7♯11': '7♯11',
    'maj7♯11': 'maj7♯11',
    maj9: 'maj9',
    '7♯5': '7♯5',
    '13♭9': '13♭9',
    '+': '+',
    '(maj7)': 'm(maj7)',
  }
  return { root, q: M[suf] != null ? M[suf] : lower ? 'm' : '' }
}

/** Generic roman numeral of any chord relative to a key. */
export function rnGeneric(K: Key, root: Note, q: string): string {
  const d = mod(root.l - K.tonic.l, 7)
  const maj = iv(K.tonic, d + 1, MAJOR[d])
  const diff = mod(pc(root) - pc(maj) + 6, 12) - 6
  const pre = diff < 0 ? '♭'.repeat(-diff) : diff > 0 ? '♯'.repeat(diff) : ''
  const SUF: Record<string, string> = {
    '': '', m: '', '°': '°', '+': '+', maj7: 'maj7', '7': '7', m7: '7', 'm7♭5': 'ø7', '°7': '°7',
    'm(maj7)': '(maj7)', '6': '6', m6: '6', maj9: 'maj9', m9: '9', m11: '11', '9': '9', '13': '13',
    '7♭9': '7♭9', '7♯9': '7♯9', '7alt': '7alt', '7♯11': '7♯11', 'maj7♯11': 'maj7♯11', '7sus4': '7sus4',
    '7♯5': '7♯5', '13♭9': '13♭9',
  }
  return pre + (isMinorQ(q) ? RN[d].toLowerCase() : RN[d]) + (SUF[q] != null ? SUF[q] : q)
}

/** The bare numeral of an analysis label: "V7/ii" → "V", "C: ii7" → "ii". */
export const rnBase = (rn?: string) => {
  const m = (rn || '').replace(/^.*: /, '').match(/^[♭♯]*[ivIV]+/)
  return m ? m[0] : ''
}

/** Build a chord from a roman numeral in a key. */
export function chordFrom(rn: string, K: Key, extra?: Partial<Chord>): Chord {
  const c = parseRoman(rn, K)
  return { start: 0, dur: 4, ...c, rn: pretty(rn), ...extra }
}

/** Diatonic chord lists for major and (harmonic) minor keys. */
export const DIA = {
  maj: {
    tri: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    sev: ['Imaj7', 'ii7', 'iii7', 'IVmaj7', 'V7', 'vi7', 'viiø7'],
  },
  min: {
    tri: ['i', 'ii°', '♭III', 'iv', 'V', '♭VI', '♭VII'],
    sev: ['i7', 'iiø7', '♭IIImaj7', 'iv7', 'V7', '♭VImaj7', '♭VII7'],
  },
}

/** Harmonic function of each major-key degree. */
export const FN = ['T', 'PD', 'T', 'PD', 'D', 'T', 'D'] as const
