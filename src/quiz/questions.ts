import type { Lesson } from '../curriculum/types'
import { lessonKey, newSetOf, positions, strsOf } from '../engine/fretboard'
import type { GenSettings, MusicEvent } from '../engine/types'
import { isMinorQ, Q, QNAME, sym, tone, tones } from '../theory/chords'
import { makeKey, MAJ_BY_PC, MIN_BY_PC, spellPc, type Key } from '../theory/keys'
import { clean, iv, LET, midiOf, mod, nm, octOf, pc, type Note } from '../theory/notes'
import { pick, shuffle } from '../theory/random'
import { chordFrom, DIA, FN, pretty, rnBase, rnGeneric } from '../theory/roman'
import { INTV, MODE_NAMES, scaleNotes, SCNAME, type ScaleName } from '../theory/scales'

export interface Question {
  prompt: string
  /** Optional one-bar staff shown with the question. */
  staff?: { K: Key; events: MusicEvent[] }
  options: string[]
  answer: string
  why: string
}

type QGen = (L: Lesson, S: GenSettings) => Question

const ALLMIN = ['Am', 'Em', 'Bm', 'Dm', 'Gm', 'Cm']

const randRoot = (acc: number): Note => {
  let n: Note = { l: Math.floor(Math.random() * 7), a: 0 }
  if (acc && Math.random() < acc) n = clean({ l: n.l, a: pick([-1, 1]) })
  return n
}
const evAt = (n: Note, o: number, b: number, p: number, d: number): MusicEvent => ({
  b, p, d, n, o, m: midiOf(n, o), cell: b * 100 + p,
})
const placeO = (n: Note, lo: number, hi: number) => {
  for (let o = 1; o < 6; o++) {
    const m = midiOf(n, o)
    if (m >= lo && m <= hi) return o
  }
  return 2
}
/** The correct answer plus k-1 distinct distractors, shuffled. */
const opts = (correct: string, pool: string[], k = 4) =>
  shuffle([correct, ...shuffle([...new Set(pool.filter((x) => x !== correct))]).slice(0, k - 1)])
const keysOf = (L: Lesson, d: string[]) => (L.quiz?.keys || d).map(makeKey)
const qset = (L: Lesson) => (L.quiz?.set || []) as string[]

export const QGEN: Record<string, QGen> = {
  note(L, S) {
    const K = lessonKey(L)
    const ps = positions(L, K, strsOf(S))
    const nw = newSetOf(L, ps)
    let p = pick(ps)
    if (nw.size && Math.random() < 0.5) {
      const c = ps.filter((q) => nw.has(q.m))
      if (c.length) p = pick(c)
    }
    const pref = L.chrom ? pick(['flat', 'sharp'] as const) : undefined
    const n = spellPc(mod(p.m, 12), K, pref)
    const names = new Set<string>()
    ps.forEach((q) => {
      names.add(nm(spellPc(mod(q.m, 12), K)))
      if (L.chrom) names.add(nm(spellPc(mod(q.m, 12), K, 'flat')))
    })
    names.add(nm(n))
    while (names.size < 4) names.add(pick(LET.split('')))
    const ord = (s: string) => LET.indexOf(s[0]) * 3 + (s.includes('♭') ? 0 : s.includes('♯') ? 2 : 1)
    return {
      prompt: 'Name this note.',
      staff: { K, events: [evAt(n, octOf(n, p.m), 0, 0, 4)] },
      options: [...names].sort((a, b) => ord(a) - ord(b)),
      answer: nm(n),
      why: `It is ${nm(n)} — ${p.s} string, ${p.f ? 'fret ' + p.f : 'open'}.`,
    }
  },
  steps() {
    let a: Note, b: Note, s: number
    do {
      a = randRoot(0.2)
      b = iv(a, 2, pick([1, 2]))
      s = mod(pc(b) - pc(a), 12)
    } while (Math.abs(b.a) > 1 || (s !== 1 && s !== 2))
    const o = placeO(a, 43, 55)
    const ma = midiOf(a, o)
    const ob = octOf(b, ma + s)
    return {
      prompt: 'Half step or whole step?',
      staff: { K: makeKey('C'), events: [evAt(a, o, 0, 0, 2), evAt(b, ob, 0, 2, 2)] },
      options: ['Half step', 'Whole step'],
      answer: s === 1 ? 'Half step' : 'Whole step',
      why: `${nm(a)} → ${nm(b)} is ${s} fret${s > 1 ? 's' : ''}.`,
    }
  },
  interval(L) {
    const set = qset(L)
    let a: Note, b: Note, k: string
    do {
      k = pick(set)
      a = randRoot(0.25)
      b = iv(a, INTV[k][0], INTV[k][1])
    } while (Math.abs(b.a) > 1)
    const o = placeO(a, 41, 50)
    const ma = midiOf(a, o)
    const ob = octOf(b, ma + INTV[k][1])
    return {
      prompt: 'Name the interval (lower note first).',
      staff: { K: makeKey('C'), events: [evAt(a, o, 0, 0, 2), evAt(b, ob, 0, 2, 2)] },
      options: set.map((x) => INTV[x][2]),
      answer: INTV[k][2],
      why: `${nm(a)} → ${nm(b)}: ${INTV[k][1]} half steps = ${INTV[k][2]}.`,
    }
  },
  degree(L) {
    const K = pick(keysOf(L, ['C']))
    const d = Math.floor(Math.random() * 7)
    const n = K.scale[d]
    const o = placeO(n, 43, 57)
    return {
      prompt: `In ${K.label}, which scale degree is this note?`,
      staff: { K, events: [evAt(n, o, 0, 0, 4)] },
      options: ['1', '2', '3', '4', '5', '6', '7'],
      answer: String(d + 1),
      why: `${nm(n)} is degree ${d + 1} of ${K.label}.`,
    }
  },
  keysig(L) {
    const K = pick(keysOf(L, ['C']))
    const pool = (
      L.quiz?.minor
        ? ALLMIN.concat(['F#m', 'Fm', 'C#m', 'Bbm'])
        : ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'F', 'Bb', 'Eb', 'Ab', 'Db']
    ).map((x) => makeKey(x).label)
    const n = Object.keys(K.sig).length
    return {
      prompt: `Which ${K.minor ? 'minor' : 'major'} key has this key signature?`,
      staff: { K, events: [{ b: 0, p: 0, d: 4, rest: true, cell: 0 }] },
      options: opts(K.label, pool),
      answer: K.label,
      why: `${n ? n + (K.flat ? ' flat' : ' sharp') + (n > 1 ? 's' : '') : 'No sharps or flats'} → ${K.label}.`,
    }
  },
  triad(L) {
    const map: Record<string, string> = { maj: '', min: 'm', dim: '°', aug: '+' }
    let r: Note, q: string, ns: Note[]
    do {
      r = randRoot(0.3)
      q = map[pick(qset(L))]
      ns = tones({ root: r, q }).map((x) => x.n)
    } while (ns.some((n) => Math.abs(n.a) > 1))
    const o = placeO(r, 40, 48)
    const m0 = midiOf(r, o)
    const ev = ns.map((n, i) => evAt(n, octOf(n, m0 + Q[q][i][1]), 0, i, i === 2 ? 2 : 1))
    return {
      prompt: 'What kind of triad?',
      staff: { K: makeKey('C'), events: ev },
      options: qset(L).map((x) => QNAME[map[x]]),
      answer: QNAME[q],
      why: `${ns.map(nm).join('–')} = ${nm(r)}${q}.`,
    }
  },
  seventh(L) {
    let r: Note, q: string, ns: Note[]
    do {
      r = randRoot(0.3)
      q = pick(qset(L))
      ns = tones({ root: r, q }).map((x) => x.n)
    } while (ns.some((n) => Math.abs(n.a) > 1))
    const o = placeO(r, 38, 45)
    const m0 = midiOf(r, o)
    const ev = ns.map((n, i) => evAt(n, octOf(n, m0 + Q[q][i][1]), 0, i, 1))
    return {
      prompt: 'What kind of seventh chord?',
      staff: { K: makeKey('C'), events: ev },
      options: qset(L).map((x) => QNAME[x]),
      answer: QNAME[q],
      why: `${ns.map(nm).join('–')} = ${nm(r)}${q}.`,
    }
  },
  roman(L) {
    const K = pick(keysOf(L, ['C']))
    const list = DIA[K.minor ? 'min' : 'maj'][L.quiz?.sev || L.chart ? 'sev' : 'tri']
    const d = Math.floor(Math.random() * 7)
    const c = chordFrom(list[d], K)
    return {
      prompt: `In ${K.label}, ${sym(c)} is …`,
      options: list.map(pretty),
      answer: pretty(list[d]),
      why: `${sym(c)} is built on degree ${d + 1} of ${K.label}.`,
    }
  },
  function(L) {
    const K = pick(keysOf(L, ['C']))
    const d = Math.floor(Math.random() * 7)
    const c = chordFrom(DIA.maj.tri[d], K)
    const f = { T: 'Tonic', PD: 'Predominant', D: 'Dominant' }[FN[d]]
    return {
      prompt: `In ${K.label}, what is the function of ${sym(c)} (${pretty(DIA.maj.tri[d])})?`,
      options: ['Tonic', 'Predominant', 'Dominant'],
      answer: f,
      why: `${pretty(DIA.maj.tri[d])} → ${f}.`,
    }
  },
  cadence(L) {
    const K = pick(keysOf(L, ['C']))
    const t = pick(['Authentic', 'Plagal', 'Half', 'Deceptive'] as const)
    const seq = {
      Authentic: [pick(['ii', 'IV']), 'V', 'I'],
      Plagal: [pick(['V', 'vi']), 'IV', 'I'],
      Half: ['I', pick(['ii', 'IV']), 'V'],
      Deceptive: [pick(['ii', 'IV']), 'V', 'vi'],
    }[t]
    return {
      prompt: `In ${K.label}: ${seq.map((r) => sym(chordFrom(r, K))).join(' – ')} (end of phrase). Which cadence?`,
      options: ['Authentic', 'Plagal', 'Half', 'Deceptive'],
      answer: t,
      why: `${seq.join(' – ')} = ${t.toLowerCase()} cadence.`,
    }
  },
  iiVI() {
    const K = makeKey(pick(MAJ_BY_PC))
    const f = (k: Key) => ['ii7', 'V7', 'Imaj7'].map((r) => sym(chordFrom(r, k))).join(' – ')
    const wrong = [
      f(makeKey(MAJ_BY_PC[mod(pc(K.tonic) + 1, 12)])),
      f(makeKey(MAJ_BY_PC[mod(pc(K.tonic) + 5, 12)])),
      ['IImaj7', 'V7', 'Imaj7'].map((r) => sym(chordFrom(r, K))).join(' – '),
      ['V7', 'I7', 'IVmaj7'].map((r) => sym(chordFrom(r, K))).join(' – '),
    ]
    return {
      prompt: `Which is the ii–V–I in ${K.label}?`,
      options: opts(f(K), wrong),
      answer: f(K),
      why: `ii7 – V7 – Imaj7 in ${K.label}: ${f(K)}.`,
    }
  },
  guide(L) {
    const K = makeKey(pick(L.quiz?.keys || ['C', 'F', 'Bb', 'Eb', 'G', 'D', 'A']))
    const list = DIA[K.minor ? 'min' : 'maj'].sev
    const c = chordFrom(pick([list[1], list[4], list[0]]), K)
    const T = tones(c)
    const t3 = tone(c, 3) as Note
    const t5 = tone(c, 5) as Note
    const t7 = tone(c, 7) as Note
    const ans = `${nm(t3)} & ${nm(t7)}`
    const wrong = [
      `${nm(c.root)} & ${nm(t5)}`,
      `${nm(t3)} & ${nm(t5)}`,
      `${nm(c.root)} & ${nm(t7)}`,
      `${nm(clean(iv(t3, 1, isMinorQ(c.q) ? 1 : -1)))} & ${nm(t7)}`,
    ]
    return {
      prompt: `Guide tones (3rd & 7th) of ${sym(c)}?`,
      options: opts(ans, wrong),
      answer: ans,
      why: `${sym(c)} = ${T.map((x) => nm(x.n)).join(' ')} → 3rd ${nm(t3)}, 7th ${nm(t7)}.`,
    }
  },
  chordtone(L) {
    const set = qset(L)
    const lab = pick(set)
    const EXT: Record<string, [number, number]> = {
      '9': [9, 14], '♭9': [9, 13], '♯9': [9, 15], '11': [11, 17], '♯11': [11, 18], '13': [13, 21], '♭13': [13, 20],
    }
    let r: Note, q: string, n: Note | null
    do {
      r = randRoot(0.35)
      if (EXT[lab]) {
        q = lab === '11' ? 'm7' : lab === '♯11' ? pick(['maj7', '7']) : '7'
        n = iv(r, EXT[lab][0], EXT[lab][1])
      } else {
        q = pick(L.quiz?.quals || ['maj7', '7', 'm7', 'm7♭5'])
        n = tone({ root: r, q }, +lab)
      }
    } while (!n || Math.abs(n.a) > 1 || Math.abs(r.a) > 1)
    const nn = n
    const pool = LET.split('')
      .map((l) => ({ l: LET.indexOf(l), a: 0 }))
      .concat([{ l: nn.l, a: nn.a - 1 }, { l: nn.l, a: nn.a + 1 }])
      .filter((x) => Math.abs(x.a) <= 1)
      .map(nm)
    const sfx = /\d$/.test(lab) && !EXT[lab] ? ({ '3': 'rd', '5': 'th', '7': 'th' } as Record<string, string>)[lab] : ''
    return {
      prompt: `What is the ${lab}${sfx} of ${nm(r)}${q}?`,
      options: opts(nm(nn), pool),
      answer: nm(nn),
      why: `${nm(r)}${q}: ${lab} = ${nm(nn)}.`,
    }
  },
  secdom(L) {
    const K = pick(keysOf(L, ['C']))
    const d = pick([1, 2, 3, 4, 5])
    const t = chordFrom(DIA.maj.sev[d], K)
    const V = nm(clean(iv(t.root, 5, 7))) + '7'
    const wrong = [1, 2, 3, 4, 5]
      .filter((x) => x !== d)
      .map((x) => nm(clean(iv(chordFrom(DIA.maj.sev[x], K).root, 5, 7))) + '7')
      .concat([nm(clean(iv(t.root, 2, 1))) + '7', nm(clean(iv(t.root, 5, 7))) + 'm7'])
    return {
      prompt: `In ${K.label}: which chord is V7/${rnBase(pretty(DIA.maj.sev[d]))} — the dominant of ${sym(t)}?`,
      options: opts(V, wrong),
      answer: V,
      why: `A 5th above ${nm(t.root)} is ${V.slice(0, -1)} → ${V}.`,
    }
  },
  relii(L) {
    const K = pick(keysOf(L, ['C']))
    const d = pick([1, 2, 3, 4, 5])
    const t = chordFrom(DIA.maj.sev[d], K)
    const tm = isMinorQ(t.q)
    const ii = nm(clean(iv(t.root, 2, 2))) + (tm ? 'm7♭5' : 'm7')
    const V = nm(clean(iv(t.root, 5, 7))) + '7'
    const ans = `${ii} – ${V}`
    const wrong = [
      `${nm(clean(iv(t.root, 2, 2)))}7 – ${V}`,
      `${nm(clean(iv(t.root, 5, 7)))}m7 – ${nm(clean(iv(t.root, 2, 2)))}7`,
      `${nm(clean(iv(t.root, 6, 9)))}m7 – ${nm(clean(iv(t.root, 2, 2)))}7`,
      `${ii.replace('m7♭5', 'm7').replace(/m7$/, tm ? 'm7' : 'm7♭5')} – ${nm(clean(iv(t.root, 2, 1)))}7`,
    ]
    return {
      prompt: `In ${K.label}: the ii–V leading to ${sym(t)} is …`,
      options: opts(ans, wrong),
      answer: ans,
      why: `Target ${sym(t)} → V7 a 5th above (${V}), its ii a 5th above that (${ii}).`,
    }
  },
  tritone() {
    const r = randRoot(0.4)
    const t = clean(iv(r, 4, 5))
    const sub = nm(clean(iv(t, 2, 1))) + '7'
    const G = nm(r) + '7'
    const wrong = [
      nm(clean(iv(r, 5, 7))) + '7',
      nm(clean(iv(r, 2, 1))) + '7',
      nm(clean(iv(r, 3, 4))) + '7',
      nm(clean(iv(t, 7, 11))) + '7',
    ]
    return {
      prompt: `Tritone substitute of ${G}?`,
      options: opts(sub, wrong),
      answer: sub,
      why: `${G} and ${sub} share the same 3rd/7th tritone; both resolve to ${nm(t)}.`,
    }
  },
  borrow(L) {
    const K = pick(keysOf(L, ['C']))
    const rn = pick(['iv7', '♭VImaj7', '♭VII7', 'iiø7', '♭IIImaj7', 'iv6'])
    const c = chordFrom(rn, K)
    const wrong = ['IVmaj7', 'vi7', 'V7', 'ii7', 'iii7', '♭VI7', '♭II7'].map((r) => sym(chordFrom(r, K)))
    return {
      prompt: `In ${K.label}, the borrowed chord ${pretty(rn)} is …`,
      options: opts(sym(c), wrong),
      answer: sym(c),
      why: `${pretty(rn)} comes from ${nm(K.tonic)} minor: ${sym(c)}.`,
    }
  },
  mode() {
    if (Math.random() < 0.5) {
      const d = Math.floor(Math.random() * 7)
      return {
        prompt: `Which mode starts on degree ${d + 1} of the major scale?`,
        options: MODE_NAMES,
        answer: MODE_NAMES[d],
        why: `Degree ${d + 1} → ${MODE_NAMES[d]}.`,
      }
    }
    const K = makeKey(pick(['C', 'G', 'F', 'D', 'Bb', 'Eb', 'A']))
    const d = 1 + Math.floor(Math.random() * 6)
    const st = K.scale[d]
    return {
      prompt: `${nm(st)} ${MODE_NAMES[d]} uses the notes of which major scale?`,
      options: opts(K.label, ['C', 'G', 'F', 'D', 'Bb', 'Eb', 'A', 'E', 'Ab'].map((x) => makeKey(x).label)),
      answer: K.label,
      why: `${MODE_NAMES[d]} is mode ${d + 1}: ${nm(st)} is degree ${d + 1} of ${K.label}.`,
    }
  },
  chordscale(L) {
    const set = L.quiz?.set as 'basic' | 'adv' | 'sym'
    const K = makeKey(pick(['C', 'F', 'G', 'Bb', 'Eb', 'D']))
    const Km = makeKey(MIN_BY_PC[pc(K.tonic)])
    type Case = [string, ScaleName, Key?, string?]
    const cases: Record<'basic' | 'adv' | 'sym', Case[]> = {
      basic: [
        ['Imaj7', 'ionian'], ['ii7', 'dorian'], ['iii7', 'phrygian'], ['IVmaj7', 'lydian'],
        ['V7', 'mixolydian'], ['vi7', 'aeolian'], ['viiø7', 'locrian'],
      ],
      adv: [
        ['V7alt', 'altered', K, 'resolving to I'],
        ['♭VII7', 'lydDom', K, 'backdoor dominant'],
        ['♭II7', 'lydDom', K, 'tritone sub resolving to I'],
        ['iiø7', 'locNat2', Km, 'ii of a minor key'],
        ['i(maj7)', 'melodic', Km, 'minor tonic'],
        ['V7♭9', 'phrygDom', Km, 'resolving to i'],
      ],
      sym: [
        ['V13♭9', 'hwDim', K, 'dominant with ♭9 and 13'],
        ['♯i°7', 'whDim', K, 'passing diminished'],
        ['V7♯5', 'wholeTone', K, 'augmented dominant'],
      ],
    }
    const [rn, sc, KK, ctx] = pick(cases[set])
    const Kx = KK || K
    const c = chordFrom(rn, Kx)
    const pool = (Object.keys(SCNAME) as ScaleName[]).filter((x) => x !== sc).map((x) => SCNAME[x])
    return {
      prompt: `${sym(c)} — ${pretty(rn)} in ${Kx.label}${ctx ? ' (' + ctx + ')' : ''}. Which scale?`,
      options: opts(SCNAME[sc], pool),
      answer: SCNAME[sc],
      why: `${sym(c)} → ${nm(c.root)} ${SCNAME[sc]}: ${scaleNotes(c.root, sc).map(nm).join(' ')}.`,
    }
  },
  coltrane() {
    const K = makeKey(pick(MAJ_BY_PC))
    const t = K.tonic
    const c1 = clean(iv(t, 6, 8))
    const c2 = clean(iv(t, 3, 4))
    if (Math.random() < 0.5) {
      const ans = `${nm(t)} – ${nm(c1)} – ${nm(c2)}`
      const wrong = [
        `${nm(t)} – ${nm(clean(iv(t, 3, 3)))} – ${nm(clean(iv(t, 5, 6)))}`,
        `${nm(t)} – ${nm(clean(iv(t, 4, 5)))} – ${nm(clean(iv(t, 7, 10)))}`,
        `${nm(t)} – ${nm(clean(iv(t, 5, 7)))} – ${nm(clean(iv(t, 2, 2)))}`,
      ]
      return {
        prompt: `Coltrane cycle: starting from ${nm(t)}, the three key centres (descending major 3rds) are …`,
        options: opts(ans, wrong),
        answer: ans,
        why: `Down a major 3rd twice: ${ans}.`,
      }
    }
    const tgt = pick([c1, c2])
    const V = nm(clean(iv(tgt, 5, 7))) + '7'
    return {
      prompt: `In a Coltrane cycle, which chord leads into ${nm(tgt)}maj7?`,
      options: opts(V, [
        nm(clean(iv(tgt, 2, 1))) + '7',
        nm(clean(iv(tgt, 4, 5))) + '7',
        nm(clean(iv(tgt, 2, 2))) + 'm7',
        nm(clean(iv(tgt, 6, 9))) + '7',
      ]),
      answer: V,
      why: `Each key centre is reached by its own V7: ${V} → ${nm(tgt)}maj7.`,
    }
  },
  analysis(L) {
    const K = pick(keysOf(L, ['C']))
    const kind = pick(['sec', 'ii', 'sub', 'bor', 'pass', 'back'])
    const d = pick([1, 2, 3, 5])
    const t = chordFrom(DIA.maj.sev[d], K)
    const tb = rnBase(pretty(DIA.maj.sev[d]))
    let a: string, b: string, ans: string
    if (kind === 'sec') {
      a = nm(clean(iv(t.root, 5, 7))) + '7'
      b = sym(t)
      ans = 'V7/' + tb
    } else if (kind === 'ii') {
      a = nm(clean(iv(t.root, 2, 2))) + (isMinorQ(t.q) ? 'm7♭5' : 'm7')
      b = nm(clean(iv(t.root, 5, 7))) + '7'
      ans = 'ii7/' + tb + ' (related ii)'
    } else if (kind === 'sub') {
      a = nm(clean(iv(t.root, 2, 1))) + '7'
      b = sym(t)
      ans = 'subV7/' + tb
    } else if (kind === 'bor') {
      const rn = pick(['iv7', '♭VImaj7', '♭IIImaj7', 'iiø7'])
      a = sym(chordFrom(rn, K))
      b = sym(chordFrom('Imaj7', K))
      ans = rn + ' (borrowed)'
    } else if (kind === 'pass') {
      const lo = chordFrom(pick(['Imaj7', 'ii7', 'IVmaj7']), K)
      const r = clean(iv(lo.root, 1, 1))
      a = nm(r) + '°7'
      b = sym({ root: clean(iv(lo.root, 2, 2)), q: 'm7' })
      ans = rnGeneric(K, r, '°7') + ' (passing)'
    } else {
      a = sym(chordFrom('♭VII7', K))
      b = sym(chordFrom('Imaj7', K))
      ans = '♭VII7 (backdoor dominant)'
    }
    const all = [
      'V7/ii', 'V7/iii', 'V7/vi', 'V7/IV', 'V7/V', 'subV7/ii', 'subV7/vi', 'subV7/V', 'ii7/V (related ii)',
      'ii7/vi (related ii)', 'iv7 (borrowed)', '♭VImaj7 (borrowed)', '♭VII7 (backdoor dominant)',
      '♯i°7 (passing)', '♯iv°7 (passing)', 'V7',
    ]
    const A = ans.replace('♭♭', '♭')
    return { prompt: `In ${K.label}: ${a} → ${b}. What is ${a}?`, options: opts(A, all), answer: A, why: `${a} = ${ans}.` }
  },
}

/** A random question of one of the lesson's quiz types (retries generators that fail). */
export function genQuestion(L: Lesson, S: GenSettings): Question {
  const t = pick(L.quiz?.types || ['steps'])
  for (let k = 0; k < 20; k++) {
    try {
      const q = QGEN[t](L, S)
      if (q && q.options.includes(q.answer)) return q
    } catch {
      /* some random draws are impossible; try again */
    }
  }
  return QGEN.steps(L, S)
}
