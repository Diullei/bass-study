import type { Lesson } from '../curriculum/types'
import { isMinorQ, sym, tone, tones } from '../theory/chords'
import { makeKey, OPEN, type Key } from '../theory/keys'
import { clean, iv, midiOf, mod, octOf, pc, type Note } from '../theory/notes'
import { pick, wpick } from '../theory/random'
import { cellsFor } from '../theory/rhythm'
import { rnGeneric } from '../theory/roman'
import { chordScaleOf, scaleNotes } from '../theory/scales'
import { anyCands, handFinger, strsOf } from './fretboard'
import { formChords, markovChords } from './harmony'
import { oneBar } from './rhythmGen'
import type { GenSettings, MusicEvent, Pos, Score } from './types'

interface Placed {
  n: Note
  m: number
}

/** Chart reading: a chord progression plus a generated bass line in the chosen style. */
export function genChart(L: Lesson, S: GenSettings): Score {
  const C = L.chart!
  const strs = strsOf(S)
  const beats = 4
  let K: Key
  let chords
  if (C.prog === 'markov') {
    K = makeKey(pick(C.keys))
    const bars = S.bars === 'auto' ? L.bars || 8 : +S.bars
    chords = markovChords(K, C, bars)
  } else ({ K, chords } = formChords(C))
  // analysis helpers
  chords.forEach((c, i) => {
    const nx = chords[i + 1] || chords[0]
    c.toMinor = isMinorQ(nx.q) && mod(pc(nx.root) - pc(c.root), 12) === 5
    c.ck = c.key || K
    if (!c.rn) c.rn = rnGeneric(c.ck, c.root, c.q)
  })
  if (C.pat === 'pedal') chords.forEach((c) => (c.bass = iv((c.ck as Key).tonic, 5, 7)))
  const total = chords.reduce((s, c) => Math.max(s, c.start + c.dur), 0)
  const bars = Math.ceil(total / beats)

  // positions in the window
  const ps: Pos[] = []
  const [a, b] = C.win
  strs.forEach((s) => {
    for (let f = a; f <= b; f++) ps.push({ s, f, m: OPEN[s] + f })
  })
  const lo = Math.min(...ps.map((p) => p.m))
  const hi = Math.max(...ps.map((p) => p.m))
  const mid = lo + 9
  /** Place a note in the window, nearest to `ref` (optionally only above/below it). */
  const place = (n: Note, ref: number, dir?: number): Placed => {
    let best: number | null = null
    let bd = 1e9
    for (let o = 0; o < 7; o++) {
      const m = midiOf(n, o)
      if (m < lo || m > hi) continue
      let d = Math.abs(m - ref)
      if (dir && dir > 0 && m <= ref) d += 24
      if (dir && dir < 0 && m >= ref) d += 24
      if (d < bd) {
        bd = d
        best = m
      }
    }
    if (best == null) best = midiOf(n, octOf(n, lo + 6))
    return { n: clean(n), m: best }
  }

  const evs: MusicEvent[] = []
  const pat = C.slash ? 'slash' : C.pat
  // segments: chord pieces inside one bar
  const segs: { c: (typeof chords)[number]; ci: number; start: number; dur: number; first: boolean }[] = []
  chords.forEach((c, ci) => {
    let s = c.start
    while (s < c.start + c.dur) {
      const be = (Math.floor(s / beats) + 1) * beats
      const e = Math.min(be, c.start + c.dur)
      segs.push({ c, ci, start: s, dur: e - s, first: s === c.start })
      s = e
    }
  })
  let ref = mid
  let planned: Placed | null = null
  const push = (seg: (typeof segs)[number], p: number, d: number, r: Placed) => {
    const abs = seg.start + p
    evs.push({
      b: Math.floor(abs / beats), p: abs % beats, d, n: r.n, m: r.m, ci: seg.ci,
      cell: Math.floor(abs / beats) * 100 + Math.floor(abs % beats),
    })
    ref = r.m
  }

  if (pat === 'roots' || pat === 'root5' || pat === 'rootoct') {
    // rhythmic patterns: rhythm first, then pitches from the chord
    const rb: MusicEvent[][] = []
    const twoish = chords.some((c) => c.dur < beats)
    for (let bb = 0; bb < bars; bb++) {
      const cells = cellsFor(L).filter((c) => !twoish || !['w', 'wr', 'hd'].includes(c))
      const bar = oneBar(cells, beats, false, { first: bb === 0, final: bb === bars - 1 })
      bar.forEach((e) => {
        e.b = bb
        e.cell = bb * 100 + ((e.cell as number) || 0)
      })
      rb.push(bar)
    }
    let k = 0
    let lastC = -1
    let prevE: MusicEvent | null = null
    rb.flat().forEach((e) => {
      const abs = e.b * beats + e.p
      const ci = chords.findIndex((c) => abs >= c.start - 1e-6 && abs < c.start + c.dur - 1e-6)
      const c = chords[ci]
      e.ci = ci
      if (ci !== lastC) {
        k = 0
        lastC = ci
      }
      if (!e.rest) {
        if (prevE && prevE.tie) {
          e.n = prevE.n
          e.m = prevE.m
        } else {
          const R0 = c.bass || c.root
          let r: Placed
          if (pat === 'roots') r = place(R0, k === 0 ? ref * 0.6 + mid * 0.4 : ref)
          else if (pat === 'root5') r = k % 2 === 0 ? place(R0, ref) : place(tone(c, 5) || c.root, ref)
          else {
            const base = k === 0 ? place(R0, ref * 0.5 + mid * 0.5) : place(R0, ref)
            if (k > 0 && Math.random() < 0.35) {
              const up = base.m + 12 <= hi ? base.m + 12 : base.m - 12
              r = up >= lo && up <= hi ? { n: base.n, m: up } : base
            } else r = base
          }
          e.n = r.n
          e.m = r.m
          ref = r.m
        }
        k++
        prevE = e
      }
      evs.push(e)
    })
  } else {
    segs.forEach((sg, si) => {
      const c = sg.c
      const T = tones(c)
      const R0 = c.bass || c.root
      const nxs = segs[si + 1]
      const last = si === segs.length - 1
      const scN = scaleNotes(c.root, chordScaleOf(c, c.ck))
      const firstNote = (): Placed => {
        if (planned && pc(planned.n) === pc(R0) && sg.first) {
          const r = planned
          planned = null
          return r
        }
        planned = null
        if (sg.first || pat === 'pedal') return place(R0, ref)
        return place(pick([T[0].n, T[1].n, tone(c, 5) || T[0].n]), ref)
      }
      if (pat === 'slash') {
        for (let p = 0; p < sg.dur; p++) push(sg, p, 1, place(R0, p === 0 ? ref * 0.6 + mid * 0.4 : ref))
        return
      }
      if (last) {
        push(sg, 0, sg.dur, place(R0, ref))
        return
      }
      const f = firstNote()
      const nxC = nxs.c
      const nxTarget = nxs.first
        ? nxC.bass || nxC.root
        : pick([nxC.root, tone(nxC, 3) || nxC.root, tone(nxC, 5) || nxC.root])
      /** A chromatic, scale or dominant approach note into the next target. */
      const approach = (fromM: number): Placed => {
        const tg = place(nxTarget, fromM)
        const opts: (Placed & { w: number })[] = []
        const add = (n: Note, m: number, w: number) => {
          if (m >= lo && m <= hi && m !== fromM && m !== tg.m) opts.push({ n: clean(n), m, w })
        }
        add(iv(nxTarget, 7, 11), tg.m - 1, 3)
        add(iv(nxTarget, 2, 1), tg.m + 1, 2)
        scN.forEach((s) => {
          const d = mod(pc(s) - pc(nxTarget), 12)
          if (d === 2) add(s, tg.m + 2, 1.5)
          if (d === 10) add(s, tg.m - 2, 1.5)
        })
        add(iv(nxTarget, 5, 7), tg.m + 7, 0.8)
        add(iv(nxTarget, 5, 7), tg.m - 5, 0.8)
        planned = tg
        return opts.length ? opts[+wpick(Object.fromEntries(opts.map((o, i) => [i, o.w])))] : tg
      }
      if (pat === 'pedal') {
        for (let p = 0; p < sg.dur; p++) push(sg, p, 1, p === 0 ? f : { n: f.n, m: f.m })
        return
      }
      if (pat === 'twofeel') {
        push(sg, 0, Math.min(2, sg.dur), f)
        if (sg.dur >= 4) {
          const r = Math.random() < 0.5 ? place(tone(c, 5) || c.root, f.m) : approach(f.m)
          push(sg, 2, 2, r)
        }
        return
      }
      if (pat === 'triad' || pat === 'seventh') {
        const ord = pat === 'triad' ? [0, 1, 2, 1] : [0, 1, 2, 3]
        const tt = T.filter((x) => [1, 3, 5, 6, 7].includes(x.d))
          .sort((x, y) => x.d - y.d)
          .map((x) => x.n)
        let m = f.m
        push(sg, 0, 1, f)
        for (let p = 1; p < sg.dur; p++) {
          const n = tt[ord[p % 4] % tt.length]
          const r = place(n, m, ord[p % 4] > ord[(p - 1) % 4] ? 1 : -1)
          push(sg, p, 1, r)
          m = r.m
        }
        return
      }
      if (pat === 'guide') {
        push(sg, 0, 1, f)
        const g3 = tone(c, 3) || tone(c, 4) || c.root
        const g7 = tone(c, 7) || tone(c, 6) || tone(c, 5) || c.root
        const r3 = place(g3, f.m)
        push(sg, 1, 1, r3)
        if (sg.dur >= 4) {
          const r7 = place(g7, r3.m)
          push(sg, 2, 1, r7)
          push(sg, 3, 1, approach(r7.m))
        }
        return
      }
      if (pat === 'scale') {
        const n8 = sg.dur * 2
        const up = f.m + 12 <= hi
        let m = f.m
        push(sg, 0, 0.5, f)
        const idx = up ? (n8 === 8 ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 4]) : n8 === 8 ? [6, 5, 4, 3, 2, 1, 0] : [6, 4, 2]
        const sc = scN.length ? scN : T.map((x) => x.n)
        idx.slice(0, n8 - 1).forEach((j, k) => {
          const r = place(sc[j % sc.length], m, up ? 1 : -1)
          push(sg, (k + 1) * 0.5, 0.5, r)
          m = r.m
        })
        return
      }
      // walk
      if (sg.dur >= 4) {
        push(sg, 0, 1, f)
        const ap = approach(f.m)
        const dir = Math.sign(ap.m - f.m) || (f.m < mid ? 1 : -1)
        const pool: Placed[] = []
        scN.forEach((n) => {
          for (let o = 0; o < 7; o++) {
            const m = midiOf(n, o)
            if (m >= lo && m <= hi) pool.push({ n: clean(n), m })
          }
        })
        pool.sort((x, y) => x.m - y.m)
        const ct = new Set(T.map((x) => pc(x.n)))
        const nextIn = (m: number, d: number, ex: number[]): Placed | null => {
          const cs = (d > 0 ? pool.filter((p) => p.m > m) : pool.filter((p) => p.m < m).reverse())
            .filter((p) => !ex.includes(p.m))
            .slice(0, 3)
          if (!cs.length) return null
          const chordTone = cs.find((p) => ct.has(pc(p.n)) && Math.abs(p.m - m) <= 5)
          return Math.random() < 0.6 && chordTone ? chordTone : cs[0]
        }
        const n2 = nextIn(f.m, dir, [ap.m]) || nextIn(f.m, -dir, [ap.m]) || f
        const between = pool.filter((p) => p.m > Math.min(n2.m, ap.m) && p.m < Math.max(n2.m, ap.m))
        let n3 = between.length
          ? between[Math.floor(between.length / 2)]
          : nextIn(n2.m, Math.sign(ap.m - n2.m) || dir, [ap.m, n2.m]) || n2
        if (n3.m === n2.m) n3 = nextIn(n2.m, -Math.sign(ap.m - n2.m) || dir, [ap.m, n2.m]) || n3
        push(sg, 1, 1, n2)
        push(sg, 2, 1, n3)
        push(sg, 3, 1, ap)
      } else {
        push(sg, 0, 1, f)
        if (sg.dur >= 2) push(sg, 1, 1, approach(f.m))
      }
    })
  }
  evs.sort((x, y) => x.b - y.b || x.p - y.p)
  evs.forEach((e) => {
    if (e.rest || !e.n) return
    const m = e.m as number
    e.o = octOf(e.n, m)
    e.cands = ps.filter((p) => p.m === m)
    if (!e.cands.length) e.cands = anyCands(m, strs)
  })
  handFinger(evs)
  chords.forEach((c) => (c.sym = sym(c)))
  return { K, beats, ts: [4, 4], bars, events: evs, chords, slash: !!C.slash, analysis: true }
}
