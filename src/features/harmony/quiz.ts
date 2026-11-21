import { clean, iv, nm, simplify, type Note } from '../../theory/notes'
import { analyse, chordTones, diatonic, fifthAbove, functionOf, keyNotes, TONICS, tritoneOf } from './theory'

/**
 * Generated questions. Every answer comes with the reasoning, written so it can be rebuilt from the rules.
 */
export type QType =
  | 'interval'
  | 'spell'
  | 'quality'
  | 'diatonic'
  | 'function'
  | 'avoid'
  | 'guide'
  | 'tritone'
  | 'secdom'
  | 'relii'
  | 'subv'
  | 'domscale'
  | 'minor'
  | 'borrow'
  | 'dim'

export interface HQuestion {
  prompt: string
  options: string[]
  answer: string
  /** Shown after answering. Supports **bold** and [[R1]] links. */
  why: string
}

const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)]
const shuffle = <T,>(a: T[]): T[] => {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}
/** Readable spelling: no double accidentals. */
const sp = (n: Note) => nm(Math.abs(n.a) >= 2 ? simplify(n) : n)
const root = () => pick(TONICS)
const N = (s: string): Note => ({ l: 'CDEFGAB'.indexOf(s[0]), a: s[1] === '♭' ? -1 : s[1] === '♯' ? 1 : 0 })
/** Roots whose diminished and half-diminished chords spell without double flats. */
const SHARP_ROOTS = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B'].map(N)
/** Minor keys whose raised 7th has no double sharp. */
const MINOR_KEYS = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A', 'B♭', 'B'].map(N)
/** Major keys whose ♭6 is a plain note (no C♭, F♭, B𝄫). */
const BORROW_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B♭', 'B'].map(N)
const rootFor = (q: string) => (q === '°7' || q === 'm7♭5' || q === 'm7' ? pick(SHARP_ROOTS) : root())

/** Four distinct options with the answer among them. */
function opts(answer: string, wrong: string[]): string[] {
  const out = [answer]
  for (const w of wrong) if (!out.includes(w) && out.length < 4) out.push(w)
  return shuffle(out)
}

const INTERVALS = [
  { name: '♭9', d: 2, s: 1 },
  { name: '9', d: 2, s: 2 },
  { name: '3', d: 3, s: 4 },
  { name: '11', d: 4, s: 5 },
  { name: '♯11', d: 4, s: 6 },
  { name: '5', d: 5, s: 7 },
  { name: '♭13', d: 6, s: 8 },
  { name: '13', d: 6, s: 9 },
  { name: '♭7', d: 7, s: 10 },
  { name: '7', d: 7, s: 11 },
]

const TYPES = ['maj7', '7', 'm7', 'm7♭5', '°7'] as const
const TYPE_WORD: Record<string, string> = { maj7: 'maj7', '7': '7', m7: 'm7', 'm7♭5': 'm7♭5', '°7': 'o7' }
const spell = (r: Note, q: string) => chordTones({ root: r, q }).map((t) => sp(t.n)).join(' ')
const symOf = (r: Note, q: string) => sp(r) + (TYPE_WORD[q] ?? q)

const GEN: Record<QType, () => HQuestion> = {
  interval() {
    const r = root()
    const I = pick(INTERVALS)
    const ans = iv(r, I.d, I.s)
    const wrong = INTERVALS.filter((x) => x !== I).map((x) => sp(iv(r, x.d, x.s)))
    return {
      prompt: `What is the ${I.name} of ${sp(r)}?`,
      options: opts(sp(ans), shuffle(wrong)),
      answer: sp(ans),
      why: `The ${I.name} is ${I.s} half steps above the root (${I.s} frets on one string). From ${sp(r)}: **${sp(ans)}**. ${I.d === 2 || I.d === 4 || I.d === 6 ? `It is the ${I.d}th of the scale counted from the top of the chord stack (${I.name} = ${I.d}).` : ''}`,
    }
  },
  spell() {
    const q = pick(TYPES)
    const r = rootFor(q)
    const ans = spell(r, q)
    const ts = chordTones({ root: r, q })
    const wrong = [1, 2, 3].map((k) => ts.map((t, i) => sp(i === k ? { l: t.n.l, a: t.n.a + (k === 1 ? (t.s === 4 ? -1 : 1) : k === 2 ? (t.s === 7 ? -1 : 1) : t.s === 11 ? -1 : 1) } : t.n)).join(' '))
    return {
      prompt: `Spell ${symOf(r, q)}.`,
      options: opts(ans, wrong),
      answer: ans,
      why: `${symOf(r, q)} = ${ts.map((t) => t.name).join(' ')} → **${ans}**. Every other letter: the chord is stacked in thirds.`,
    }
  },
  quality() {
    const q = pick(TYPES)
    const r = rootFor(q)
    const ts = chordTones({ root: r, q })
    const third = ts[1].s === 4 ? 'major 3rd (4 half steps)' : 'minor 3rd (3 half steps)'
    const sev = ts[3].s === 11 ? 'major 7th' : ts[3].s === 10 ? 'minor 7th' : 'diminished 7th'
    return {
      prompt: `${spell(r, q)} — which chord is this?`,
      options: opts(symOf(r, q), TYPES.filter((x) => x !== q).map((x) => symOf(r, x))),
      answer: symOf(r, q),
      why: `Look at the two switches: a ${third} and a ${sev}${ts[2].s === 6 ? ', with a ♭5' : ''}. That is **${symOf(r, q)}**.`,
    }
  },
  diatonic() {
    const k = root()
    const D = diatonic(k)
    const i = pick([1, 2, 3, 4, 5, 6])
    const c = D[i]
    const kn = keyNotes(k, 'major').map(sp)
    return {
      prompt: `In ${sp(k)} major, what is ${c.rn}?`,
      options: opts(sp(c.root) + c.q, shuffle(D.filter((_, j) => j !== i).map((x) => sp(x.root) + x.q))),
      answer: sp(c.root) + c.q,
      why: `${sp(k)} major = ${kn.join(' ')}. Degree ${i + 1} is ${sp(c.root)}; stack thirds from it with key notes only: ${c.notes.map(sp).join(' ')} → **${sp(c.root)}${c.q}**.`,
    }
  },
  function() {
    const k = root()
    const D = diatonic(k)
    const c = pick(D)
    const kn = keyNotes(k, 'major')
    const f = functionOf(k, c.notes)
    const ans = f.f[0].toUpperCase() + f.f.slice(1)
    return {
      prompt: `In ${sp(k)} major, what is the function of ${sp(c.root)}${c.q}?`,
      options: ['Tonic', 'Subdominant', 'Dominant'],
      answer: ans,
      why: `The pulling notes of ${sp(k)} are ${sp(kn[3])} (4th) and ${sp(kn[6])} (7th) [[R4]]. ${sp(c.root)}${c.q} = ${c.notes.map(sp).join(' ')}: ${f.four ? 'has' : 'no'} ${sp(kn[3])}, ${f.seven ? 'has' : 'no'} ${sp(kn[6])} → **${f.f}**.`,
    }
  },
  avoid() {
    const k = root()
    const D = diatonic(k)
    const i = pick([0, 2, 4, 5, 6])
    const c = D[i]
    const sc = keyNotes(k, 'major')
    const scale = [...Array(7).keys()].map((j) => sc[(i + j) % 7])
    const A = analyse(c, scale)
    const av = pick(A.filter((x) => x.role === 'avoid'))
    const others = A.filter((x) => x.role !== 'avoid').map((x) => sp(x.n))
    return {
      prompt: `In ${sp(k)} major, which scale note is an avoid note on ${sp(c.root)}${c.q}?`,
      options: opts(sp(av.n), shuffle(others)),
      answer: sp(av.n),
      why: `The scale is ${scale.map(sp).join(' ')} [[R5]]. **${sp(av.n)}** is ${av.why}.`,
    }
  },
  guide() {
    const q = pick(['maj7', '7', 'm7', 'm7♭5'])
    const r = rootFor(q)
    const ts = chordTones({ root: r, q })
    const ans = `${sp(ts[1].n)} and ${sp(ts[3].n)}`
    return {
      prompt: `What are the guide tones of ${symOf(r, q)}?`,
      options: opts(ans, [`${sp(ts[0].n)} and ${sp(ts[3].n)}`, `${sp(ts[1].n)} and ${sp(ts[2].n)}`, `${sp(ts[0].n)} and ${sp(ts[2].n)}`]),
      answer: ans,
      why: `Guide tones are the 3rd and the 7th: they decide the type. ${symOf(r, q)} = ${ts.map((t) => `${sp(t.n)} (${t.name})`).join(', ')}.`,
    }
  },
  tritone() {
    const r = root()
    const ts = chordTones({ root: r, q: '7' })
    const tgt = clean(iv(r, 4, 5))
    const ans = `${sp(ts[1].n)} and ${sp(ts[3].n)}`
    return {
      prompt: `Which two notes make the tritone of ${sp(r)}7?`,
      options: opts(ans, [`${sp(ts[0].n)} and ${sp(ts[2].n)}`, `${sp(ts[1].n)} and ${sp(ts[2].n)}`, `${sp(ts[0].n)} and ${sp(ts[3].n)}`]),
      answer: ans,
      why: `The 3rd and the ♭7 are 6 half steps apart. ${sp(ts[1].n)} goes up a half step, ${sp(ts[3].n)} goes down a half step: they land on the root and 3rd of **${sp(tgt)}** [[R2]].`,
    }
  },
  secdom() {
    if (Math.random() < 0.5) {
      const k = root()
      const D = diatonic(k)
      const i = pick([1, 2, 3, 4, 5])
      const t = D[i]
      const v = fifthAbove(t.root)
      const ans = sp(v) + '7'
      return {
        prompt: `In ${sp(k)} major, what is V7/${t.rn.replace(/m7♭5|m7|maj7|7/, '')}?`,
        options: opts(ans, [sp(clean(iv(t.root, 4, 5))) + '7', sp(tritoneOf(v)) + '7', sp(clean(iv(t.root, 2, 2))) + '7']),
        answer: ans,
        why: `The target is ${sp(t.root)}${t.q}. Go up a fifth from ${sp(t.root)} to ${sp(v)} and make it a dominant [[R3]]: **${ans}** resolves down a fifth into ${sp(t.root)}.`,
      }
    }
    const r = root()
    const v = fifthAbove(r)
    const ans = sp(v) + '7'
    return {
      prompt: `Which dominant 7th resolves into ${sp(r)}?`,
      options: opts(ans, [sp(clean(iv(r, 4, 5))) + '7', sp(tritoneOf(r)) + '7', sp(clean(iv(r, 2, 2))) + '7']),
      answer: ans,
      why: `Up a fifth from ${sp(r)} is ${sp(v)}; its tritone (${chordTones({ root: v, q: '7' }).filter((_, i) => i % 2).map((x) => sp(x.n)).join('–')}) resolves into ${sp(r)} [[R2]] [[R3]].`,
    }
  },
  relii() {
    const r = root()
    const minor = Math.random() < 0.5
    const tgt = clean(iv(r, 4, 5))
    const ii = fifthAbove(r)
    const ans = sp(ii) + (minor ? 'm7♭5' : 'm7')
    return {
      prompt: `What is the related II of ${sp(r)}7 going to ${sp(tgt)}${minor ? 'm' : 'maj7'}?`,
      options: opts(ans, [sp(ii) + (minor ? 'm7' : 'm7♭5'), sp(tgt) + 'm7', sp(clean(iv(r, 2, 2))) + 'm7']),
      answer: ans,
      why: `The related II is a fifth above the V, so the roots keep falling [[R3]]: ${sp(ii)} → ${sp(r)} → ${sp(tgt)}. The target is ${minor ? 'minor, so use the II of a minor key: m7♭5' : 'major, so use m7'}.`,
    }
  },
  subv() {
    const r = root()
    const s = tritoneOf(r)
    const ts = chordTones({ root: r, q: '7' })
    const ss = chordTones({ root: s, q: '7' })
    const ans = sp(s) + '7'
    return {
      prompt: `What is the tritone substitute of ${sp(r)}7?`,
      options: opts(ans, [sp(fifthAbove(r)) + '7', sp(clean(iv(r, 2, 1))) + '7', sp(clean(iv(r, 4, 5))) + '7']),
      answer: ans,
      why: `${sp(r)}7 has ${sp(ts[1].n)}–${sp(ts[3].n)}; ${ans} has ${sp(ss[1].n)}–${sp(ss[3].n)}: the same two keys [[R7]]. The tritone sub is always 6 half steps away.`,
    }
  },
  domscale() {
    const r = root()
    const tgt = sp(clean(iv(r, 4, 5)))
    const cases = [
      { p: `${sp(r)}7 going to ${tgt}maj7`, a: 'Mixolydian', w: `The target's major key gives the natural 9 and 13 [[R5]].` },
      { p: `${sp(r)}7 going to ${tgt}m7`, a: 'Mixolydian ♭9 ♭13', w: `The target's minor key gives the ♭9 and ♭13 [[R5]].` },
      { p: `${sp(r)}7 as a tritone sub (resolving down a half step)`, a: 'Lydian dominant', w: `Far from the key: natural 9 and 13 don't rub, the ♯11 is the root of the chord it replaced.` },
      { p: `${sp(r)}7sus4`, a: 'Mixolydian', w: `The 4 is a chord tone; the scale is Mixolydian, with the 3 to avoid [[R6]].` },
    ]
    const c = pick(cases)
    return {
      prompt: `Which scale fits ${c.p}?`,
      options: opts(c.a, shuffle(['Mixolydian', 'Mixolydian ♭9 ♭13', 'Lydian dominant', 'Altered', 'Dorian'])),
      answer: c.a,
      why: c.w,
    }
  },
  minor() {
    const k = pick(MINOR_KEYS)
    const ii = iv(k, 2, 2)
    const v = iv(k, 5, 7)
    const ans = `${sp(ii)}m7♭5 – ${sp(v)}7♭9 – ${sp(k)}m6`
    return {
      prompt: `Write a minor II–V–I in ${sp(k)} minor.`,
      options: opts(ans, [`${sp(ii)}m7 – ${sp(v)}7 – ${sp(k)}maj7`, `${sp(ii)}m7♭5 – ${sp(v)}m7 – ${sp(k)}m6`, `${sp(v)}m7♭5 – ${sp(ii)}7♭9 – ${sp(k)}m6`]),
      answer: ans,
      why: `${sp(k)} natural minor gives ${sp(ii)}m7♭5 on degree 2. V must have the raised 7th (${sp(iv(k, 7, 11))}) to get a tritone [[R2]]: ${sp(v)}7♭9. Home with the raised 6th has no avoid note [[R6]]: ${sp(k)}m6.`,
    }
  },
  borrow() {
    const k = pick(BORROW_KEYS)
    if (Math.random() < 0.5) {
      const iv4 = iv(k, 4, 5)
      const b7 = iv(k, 7, 10)
      const ans = `${sp(iv4)}m7 – ${sp(b7)}7 – ${sp(k)}maj7`
      return {
        prompt: `Write a backdoor II–V into ${sp(k)}maj7.`,
        options: opts(ans, [`${sp(clean(iv(k, 2, 2)))}m7 – ${sp(clean(iv(k, 5, 7)))}7 – ${sp(k)}maj7`, `${sp(iv4)}maj7 – ${sp(b7)}7 – ${sp(k)}maj7`, `${sp(iv4)}m7 – ${sp(clean(iv(k, 2, 1)))}7 – ${sp(k)}maj7`]),
        answer: ans,
        why: `Borrow IVm7 and ♭VII7 from ${sp(k)} minor. Both contain ${sp(iv(k, 6, 8))}, the ♭6, which pulls down into the 5th [[R1]].`,
      }
    }
    const b6 = iv(k, 6, 8)
    return {
      prompt: `Which note gives the borrowed (subdominant minor) chords of ${sp(k)} major their colour?`,
      options: opts(sp(b6), [sp(clean(iv(k, 7, 11))), sp(clean(iv(k, 4, 5))), sp(clean(iv(k, 3, 3)))]),
      answer: sp(b6),
      why: `The ♭6 of ${sp(k)} is ${sp(b6)}. It pulls down a half step into ${sp(iv(k, 5, 7))} [[R1]]: the mirror image of the 7th pulling up into the root.`,
    }
  },
  dim() {
    const d = pick(SHARP_ROOTS)
    const dom = iv(d, 6, 8)
    const ans = `${sp(dom)}7♭9`
    const tgt = clean(iv(dom, 4, 5))
    return {
      prompt: `${sp(d)}o7 used as a passing chord is a rootless version of which chord?`,
      options: opts(ans, [`${sp(d)}7♭9`, `${sp(clean(iv(d, 5, 7)))}7♭9`, `${sp(clean(iv(d, 2, 1)))}7♭9`]),
      answer: ans,
      why: `The root is a major 3rd below the dim7's bass: ${sp(dom)}. ${sp(dom)}7♭9 = ${scaleNotesOf(dom)}; take off ${sp(dom)} and you have ${sp(d)}o7 [[R7]]. It resolves to ${sp(tgt)} [[R3]].`,
    }
  },
}

const scaleNotesOf = (r: Note) => [iv(r, 1, 0), iv(r, 3, 4), iv(r, 5, 7), iv(r, 7, 10), iv(r, 2, 1)].map(sp).join(' ')

export function genHQuestion(types: QType[]): HQuestion {
  return GEN[pick(types)]()
}

