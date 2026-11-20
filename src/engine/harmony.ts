import { FORMS } from '../curriculum/forms'
import type { ChartDef, DevDef } from '../curriculum/types'
import { DOM, isMinorQ, sym, tone, type Chord } from '../theory/chords'
import { makeKey, MAJ_BY_PC, MIN_BY_PC, type Key } from '../theory/keys'
import { clean, iv, mod, nm, pc, type Note } from '../theory/notes'
import { pick, wpick } from '../theory/random'
import { chordFrom, DIA, rnBase, rnGeneric } from '../theory/roman'

/** Markov transition weights between scale degrees (major / minor). */
const TRANS: Record<number, Record<number, number>> = {
  0: { 3: 3, 4: 3, 5: 3, 1: 2, 2: 1 },
  1: { 4: 5, 6: 1, 3: 1 },
  2: { 5: 4, 3: 2 },
  3: { 4: 4, 1: 2, 0: 3 },
  4: { 0: 6, 5: 2 },
  5: { 1: 4, 3: 4, 4: 1 },
  6: { 0: 1 },
}
const TRANSMIN: Record<number, Record<number, number>> = {
  0: { 3: 3, 5: 3, 2: 2, 6: 2, 4: 2, 1: 1 },
  1: { 4: 5 },
  2: { 5: 3, 3: 2, 6: 1 },
  3: { 4: 4, 0: 2, 6: 2, 1: 2 },
  4: { 0: 6, 5: 2 },
  5: { 1: 2, 3: 3, 4: 2, 6: 2 },
  6: { 2: 4, 0: 2 },
}

export type Cadence = 'auth' | 'plagal' | 'half' | 'deceptive'

/** A random functional progression ending in a cadence, optionally reharmonised. */
export function markovChords(K: Key, C: ChartDef, bars: number): Chord[] {
  const tab = K.minor ? TRANSMIN : TRANS
  const list = DIA[K.minor ? 'min' : 'maj'][C.sev ? 'sev' : 'tri']
  const spans: number[] = []
  for (let b = 0; b < bars; b++) {
    const two = b < bars - 1 && (C.perBar === 2 || (C.perBar === 'mix' && b > 0 && Math.random() < 0.35))
    if (two) spans.push(2, 2)
    else spans.push(4)
  }
  const n = spans.length
  const cadT: Cadence =
    C.cad === 'rand' ? pick(['auth', 'plagal', 'half', 'deceptive'] as const) : (C.cad as Cadence) || 'auth'
  const fixed: Record<number, number> = { 0: 0 }
  const cd = cadT === 'plagal' ? [3, 0] : cadT === 'half' ? [4] : cadT === 'deceptive' ? [4, 5] : [4, 0]
  cd.forEach((d, k) => {
    const i = n - cd.length + k
    if (i > 0) fixed[i] = d
  })
  const seq = [0]
  for (let i = 1; i < n; i++) {
    if (fixed[i] != null) {
      seq.push(fixed[i])
      continue
    }
    const w: Record<number, number> = { ...tab[seq[i - 1]] }
    delete w[seq[i - 1]]
    if (fixed[i + 1] != null) {
      for (const k in w) w[k] *= (tab[k] && tab[k][fixed[i + 1]]) || 0.05
      delete w[fixed[i + 1]]
    }
    if (!Object.keys(w).length) w[seq[i - 1] === 0 ? 3 : 0] = 1
    seq.push(+wpick(w))
  }
  let ch = seq.map((d, i) => chordFrom(list[d], K, { deg: d, kind: 'dia', dur: spans[i] }))
  if (C.dev) ch = reharm(K, ch, C.dev, !!C.sev)
  if (C.ext) extend(K, ch)
  if (C.dev && C.dev.inv) invert(ch, C.dev.inv)
  // merge repeated chords
  for (let i = ch.length - 1; i > 0; i--) {
    const a = ch[i - 1]
    const b = ch[i]
    if (sym(a) === sym(b) && a.dur + b.dur <= 4) {
      a.dur += b.dur
      ch.splice(i, 1)
    }
  }
  let t = 0
  ch.forEach((c) => {
    c.start = t
    t += c.dur
  })
  return ch
}

/** Apply jazz reharmonisation devices to a diatonic progression. */
function reharm(K: Key, input: Chord[], D: DevDef, sev: boolean): Chord[] {
  let ch = input
  const R = () => Math.random() * 100
  const isTonic = (c: Chord) => pc(c.root) === pc(K.tonic) && !/°|♭5/.test(c.q)
  const BOR: Record<number, string> = {
    3: sev ? 'iv7' : 'iv',
    5: sev ? '♭VImaj7' : '♭VI',
    1: sev ? 'iiø7' : 'ii°',
    2: sev ? '♭IIImaj7' : '♭III',
  }
  // backdoor dominants and borrowed chords
  if (!K.minor)
    for (let i = 1; i < ch.length - 1; i++) {
      const c = ch[i]
      if (c.kind !== 'dia') continue
      if (D.backdoor && c.deg === 4 && isTonic(ch[i + 1]) && R() < D.backdoor) {
        const nb = chordFrom(sev ? '♭VII7' : '♭VII', K, { kind: 'bor', dur: c.dur })
        if (c.dur >= 4 && R() < 60) {
          const iv7 = chordFrom(sev ? 'iv7' : 'iv', K, { kind: 'bor', dur: 2 })
          nb.dur = 2
          ch.splice(i, 1, iv7, nb)
          i++
        } else ch[i] = nb
        continue
      }
      if (D.borrow && c.deg != null && BOR[c.deg] && R() < D.borrow)
        ch[i] = chordFrom(BOR[c.deg], K, { kind: 'bor', deg: c.deg, dur: c.dur })
    }
  // secondary dominants + related ii (backwards so chains resolve)
  let res: Chord[] = []
  for (let i = ch.length - 1; i >= 0; i--) {
    const c = ch[i]
    const nx = res[0]
    if (
      i > 0 && nx && D.secdom && !/°|♭5|\+/.test(nx.q) && !isTonic(nx) &&
      (nx.chain || 0) < 2 && c.kind !== 'bor' && R() < D.secdom
    ) {
      const tb = rnBase(nx.rn) || rnGeneric(K, nx.root, nx.q).replace(/[^♭♯ivIV]/g, '')
      const tMin = isMinorQ(nx.q)
      const V: Chord = {
        root: clean(iv(nx.root, 5, 7)), q: sev ? '7' : '', kind: 'sec', chain: (nx.chain || 0) + 1,
        rn: 'V' + (sev ? '7' : '') + '/' + tb, start: 0, dur: c.dur,
      }
      if (c.dur >= 4 && D.iiV && R() < D.iiV) {
        const ii: Chord = {
          root: clean(iv(nx.root, 2, 2)),
          q: tMin ? (sev ? 'm7♭5' : '°') : sev ? 'm7' : 'm',
          kind: 'ii', start: 0, dur: 2,
          rn: (tMin ? (sev ? 'iiø7' : 'ii°') : sev ? 'ii7' : 'ii') + '/' + tb,
        }
        V.dur = 2
        res.unshift(ii, V)
      } else res.unshift(V)
      continue
    }
    if (nx && D.iiV && isTonic(nx) && c.kind === 'dia' && c.deg === 4 && c.dur >= 4 && R() < D.iiV) {
      res.unshift(chordFrom(sev ? 'ii7' : 'ii', K, { kind: 'dia', deg: 1, dur: 2 }), { ...c, dur: 2 })
      continue
    }
    res.unshift(c)
  }
  ch = res
  // diminished passing chords
  if (D.passdim) {
    res = []
    for (let i = 0; i < ch.length; i++) {
      const c = ch[i]
      const nx = ch[i + 1]
      if (nx && i < ch.length - 1 && c.dur >= 4 && mod(pc(nx.root) - pc(c.root), 12) === 2 && R() < D.passdim) {
        const r = clean(iv(c.root, 1, 1))
        res.push({ ...c, dur: 2 }, {
          root: r, q: sev ? '°7' : '°', kind: 'pass', start: 0, dur: 2, rn: rnGeneric(K, r, sev ? '°7' : '°'),
        })
        continue
      }
      res.push(c)
    }
    ch = res
  }
  // tritone substitutions
  if (D.tritone)
    for (let i = 1; i < ch.length - 1; i++) {
      const c = ch[i]
      const nx = ch[i + 1]
      if (DOM.has(c.q) && mod(pc(nx.root) - pc(c.root), 12) === 5 && R() < D.tritone) {
        const tb = rnBase(nx.rn) || 'x'
        ch[i] = {
          root: clean(iv(nx.root, 2, 1)), q: '7', kind: 'sub', start: 0, dur: c.dur,
          rn: isTonic(nx) ? '♭II7' : 'subV7/' + tb,
        }
      }
    }
  return ch
}

/** Add extensions/alterations to 7th chords. */
function extend(K: Key, ch: Chord[]) {
  ch.forEach((c, i) => {
    const nx = ch[i + 1] || ch[0]
    if (c.q === 'maj7') c.q = pick(['maj9', '6', 'maj7', 'maj9'])
    else if (c.q === 'm7' && c.kind === 'dia' && !/iii/.test(c.rn || '')) c.q = pick(['m9', 'm7', 'm11'])
    else if (c.q === '7') {
      c.q = isMinorQ(nx.q) ? pick(['7♭9', '7alt', '7♭9']) : pick(['9', '13', '7♯11', '7alt', '13'])
      if (c.kind === 'sub') c.q = pick(['7', '7♯11', '9'])
    }
    if (c.rn && c.kind !== 'sec' && c.kind !== 'ii') c.rn = rnGeneric(K, c.root, c.q)
  })
}

/** Turn some chords into slash chords that make a smoother bass line. */
function invert(ch: Chord[], p: number) {
  let prev = ch[0].root
  const dist = (a: Note, b: Note) => {
    const d = mod(pc(b) - pc(a), 12)
    return Math.min(d, 12 - d)
  }
  for (let i = 1; i < ch.length - 1; i++) {
    const c = ch[i]
    const nx = ch[i + 1]
    if (Math.random() * 100 < p) {
      const opts: { n: Note; b: number }[] = [{ n: c.root, b: -0.5 }]
      ;[3, 5].forEach((d) => {
        const t = tone(c, d)
        if (t) opts.push({ n: t, b: 0 })
      })
      const s7 = tone(c, 7)
      if (s7 && c.q !== '°7') opts.push({ n: s7, b: 0.5 })
      let best: { n: Note; b: number } | null = null
      let bs = 1e9
      opts.forEach((o) => {
        let sc = dist(prev, o.n) + dist(o.n, nx.root) + o.b
        if (dist(prev, o.n) === 0) sc += 3
        if (sc < bs) {
          bs = sc
          best = o
        }
      })
      const bb = best as { n: Note; b: number } | null
      if (bb && pc(bb.n) !== pc(c.root)) c.bass = clean(bb.n)
    }
    prev = c.bass || c.root
  }
}

/** A jazz form, possibly repeated through a cycle of keys. */
export function formChords(C: ChartDef): { K: Key; chords: Chord[] } {
  let form = C.form || 'iiVI'
  if (C.prog === 'any')
    form = pick(['iiVI', 'blues', 'jazzblues', 'autumn', 'rhythm', 'extdom', 'backdoor', 'turn', 'chrom', 'coltrane', 'tritturn'])
  const minorForm = /min|autumn|modal/.test(form)
  let kn = pick(C.keys)
  if (minorForm && !kn.endsWith('m')) kn = MIN_BY_PC[mod(pc(makeKey(kn).tonic) - 3, 12)]
  if (!minorForm && kn.endsWith('m')) kn = kn.slice(0, -1)
  const reps = C.reps || 1
  const out: Chord[] = []
  let t = 0
  const first = kn
  for (let r = 0; r < reps; r++) {
    const K = makeKey(kn)
    const F = FORMS[form]
    const str = typeof F === 'function' ? F() : F
    str
      .trim()
      .split(/\s+/)
      .forEach((tok, k) => {
        const [rn, d] = tok.split(':')
        const c = chordFrom(rn, K, { dur: +d, start: t, key: K, kind: 'form' })
        if (reps > 1 && k === 0) c.rn = nm(K.tonic) + (K.minor ? 'm' : '') + ': ' + c.rn
        out.push(c)
        t += +d
      })
    const step = C.cycle === '4th' ? 5 : C.cycle === 'down2' ? -2 : -4
    const p = mod(pc(K.tonic) + step, 12)
    kn = K.minor ? MIN_BY_PC[p] : MAJ_BY_PC[p]
  }
  return { K: reps > 1 ? makeKey('C') : makeKey(first), chords: out }
}
