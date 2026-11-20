import { iv, mod, nm, NAT, parseName, pc, type Note } from './notes'

export interface Key {
  name: string
  tonic: Note
  /** Scale used for melody/spelling (minor keys use harmonic minor). */
  scale: Note[]
  /** Natural scale (defines the key signature). */
  nat: Note[]
  /** Key signature: letter index → accidental. */
  sig: Record<number, number>
  minor: boolean
  flat: boolean
  label: string
}

export const MAJOR = [0, 2, 4, 5, 7, 9, 11]
export const NATMIN = [0, 2, 3, 5, 7, 8, 10]

export const MAJ_BY_PC = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
export const MIN_BY_PC = ['Cm', 'C#m', 'Dm', 'Ebm', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'Bbm', 'Bm']

/** Build a key from a name like "G", "Bb" or "F#m". */
export function makeKey(name: string): Key {
  const minor = name.length > 1 && name.endsWith('m')
  const t = parseName(minor ? name.slice(0, -1) : name)
  const nat = (minor ? NATMIN : MAJOR).map((s, i) => iv(t, i + 1, s))
  const sig: Record<number, number> = {}
  nat.forEach((n) => {
    if (n.a) sig[n.l] = n.a
  })
  const scale = nat.slice()
  if (minor) scale[6] = iv(scale[6], 1, 1)
  return {
    name,
    tonic: t,
    scale,
    nat,
    sig,
    minor,
    flat: Object.values(sig).some((a) => a < 0),
    label: nm(t) + (minor ? ' minor' : ' major'),
  }
}

export type SpellPref = 'flat' | 'sharp' | undefined

/** Spell a pitch class in the context of a key (scale notes first, then naturals, then ♯/♭). */
export function spellPc(p: number, K: Pick<Key, 'scale' | 'flat'>, pref?: SpellPref): Note {
  const s = K.scale.find((n) => pc(n) === p)
  if (s) return s
  for (let l = 0; l < 7; l++) if (NAT[l] === p) return { l, a: 0 }
  const pr = pref || (K.flat ? 'flat' : 'sharp')
  for (let l = 0; l < 7; l++) {
    const a = mod(p - NAT[l], 12)
    if (pr === 'flat' && a === 11) return { l, a: -1 }
    if (pr !== 'flat' && a === 1) return { l, a: 1 }
  }
  return { l: 0, a: 0 }
}

/** Open-string MIDI numbers (written pitch — an octave above sounding). */
export const OPEN = { B: 35, E: 40, A: 45, D: 50, G: 55 } as const
export type StringName = keyof typeof OPEN
