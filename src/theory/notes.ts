/**
 * Spelled notes. A note is a letter index (0 = C … 6 = B) plus an accidental
 * (-2 = 𝄫, -1 = ♭, 0 = ♮, 1 = ♯, 2 = 𝄪). Spelling matters: F♯ and G♭ are different notes on paper.
 */
export interface Note {
  l: number
  a: number
}

export const LET = 'CDEFGAB'
export const NAT = [0, 2, 4, 5, 7, 9, 11]

export const mod = (n: number, m: number) => ((n % m) + m) % m

/** Pitch class 0–11. */
export const pc = (n: Note) => mod(NAT[n.l] + n.a, 12)

export const accTxt = (a: number) => ['𝄫', '♭', '', '♯', '𝄪'][a + 2] ?? ''

/** Display name, e.g. "F♯". */
export const nm = (n: Note) => LET[n.l] + accTxt(n.a)

/** The note `deg` scale steps above `n` (1 = unison) that is `semi` half steps away. */
export function iv(n: Note, deg: number, semi: number): Note {
  const l = mod(n.l + deg - 1, 7)
  let a = mod(pc(n) + semi - NAT[l], 12)
  if (a > 6) a -= 12
  return { l, a }
}

export const midiOf = (n: Note, o: number) => 12 * (o + 1) + NAT[n.l] + n.a
export const octOf = (n: Note, m: number) => Math.round((m - NAT[n.l] - n.a) / 12) - 1

/** Respell with the fewest accidentals. */
export function simplify(n: Note): Note {
  const p = pc(n)
  let b = n
  for (let l = 0; l < 7; l++) {
    let a = mod(p - NAT[l], 12)
    if (a > 6) a -= 12
    if (Math.abs(a) < Math.abs(b.a)) b = { l, a }
  }
  return b
}

/** Respell double accidentals and E♯/B♯/F♭/C♭ as plain notes. */
export const clean = (n: Note): Note =>
  Math.abs(n.a) >= 2 ||
  (n.a === 1 && (n.l === 2 || n.l === 6)) ||
  (n.a === -1 && (n.l === 3 || n.l === 0))
    ? simplify(n)
    : n

/** Parse "F#", "Bb", "B♭" … into a note. */
export const parseName = (s: string): Note => ({
  l: LET.indexOf(s[0]),
  a: s.includes('#') || s.includes('♯') ? 1 : s.length > 1 && (s[1] === 'b' || s[1] === '♭') ? -1 : 0,
})

export interface ParsedPitch {
  n: Note
  o: number
  m: number
}

/** Parse scientific pitch like "F#3" or "Bb2". */
export function parseNote(t: string): ParsedPitch {
  const m = t.match(/^([A-G])(#|b)?(-?\d)$/)
  if (!m) throw new Error(`Bad note: ${t}`)
  const n = { l: LET.indexOf(m[1]), a: m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0 }
  const o = +m[3]
  return { n, o, m: midiOf(n, o) }
}

/** Describe where a written note sits on the bass clef. */
export function staffWords(n: Note, o: number): string {
  const ds = n.l + 7 * o
  const ord = ['1st', '2nd', '3rd', '4th', '5th']
  if (ds >= 18 && ds <= 26) return ds % 2 === 0 ? ord[(ds - 18) / 2] + ' line' : ord[(ds - 19) / 2] + ' space'
  if (ds === 17) return 'space below the staff'
  if (ds === 27) return 'space above the staff'
  if (ds < 17) {
    const k = Math.floor((18 - ds) / 2)
    return ds % 2 === 0 ? `${ord[k - 1]} ledger line below` : `space below the ${ord[k - 1]} ledger line`
  }
  const k = Math.floor((ds - 26) / 2)
  return ds % 2 === 0 ? `${ord[k - 1]} ledger line above` : `space above the ${ord[k - 1]} ledger line`
}
