import type { Lesson } from '../curriculum/types'
import { makeKey, OPEN, type StringName } from '../theory/keys'
import { mod, nm, parseName, parseNote, pc } from '../theory/notes'
import { pick, shuffle, wpick } from '../theory/random'
import { DUR } from '../theory/rhythm'
import { MODE_NAMES } from '../theory/scales'
import { SONGS } from '../curriculum/songs'
import { anyCands, finish, handFinger, lessonKey, newSetOf, positions, strsOf } from './fretboard'
import { phraseRhythm } from './rhythmGen'
import type { BarMark, GenSettings, MusicEvent, Pos, Score } from './types'

/** Sight-reading etude: 4-bar phrases with motifs, sequences and cadences. */
export function genReading(L: Lesson, S: GenSettings): Score {
  const K = lessonKey(L)
  const ps = positions(L, K, strsOf(S))
  const nw = newSetOf(L, ps)
  const P = [...new Set(ps.map((p) => p.m))].sort((a, b) => a - b)
  const bars = S.bars === 'auto' ? L.bars || 8 : +S.bars
  const beats = L.time === 6 ? 3 : L.time
  const rb = phraseRhythm(L, bars)
  const tonic = pc(K.tonic)
  const dom = mod(tonic + 7, 12)
  const nearest = (pcs: number[], i: number) => {
    let best = -1
    let bd = 1e9
    P.forEach((m, j) => {
      if (pcs.includes(mod(m, 12)) && Math.abs(j - i) < bd) {
        bd = Math.abs(j - i)
        best = j
      }
    })
    return best
  }
  let i = P.findIndex((m) => mod(m, 12) === tonic)
  if (i < 0 || Math.random() < 0.3) i = Math.floor(Math.random() * P.length)
  const idxByBar: number[][] = []
  let prevTie = false
  rb.forEach((bar, b) => {
    const ns = bar.filter((e) => !e.rest)
    const ph = b % 4
    const final = b === bars - 1
    const cad = ph === 3 || final
    const prev = rb[b - 2]
    const src =
      ph === 2 &&
      prev &&
      bar.length === prev.length &&
      bar.every((e, k) => e.d === prev[k].d && e.rest === prev[k].rest)
        ? idxByBar[b - 2]
        : null
    const ids: number[] = []
    // sequence: repeat the motif of two bars ago, shifted
    if (src && src.length === ns.length && !prevTie) {
      let ok: number | null = null
      for (const s of shuffle([1, -1, 2, -2, 0]))
        if (src.every((x) => x + s >= 0 && x + s < P.length)) {
          ok = s
          break
        }
      if (ok != null) {
        const shifted = src.map((x) => x + (ok as number))
        ns.forEach((e, k) => (e.m = P[shifted[k]]))
        i = shifted[shifted.length - 1]
        idxByBar.push(shifted)
        prevTie = !!(ns.length && ns[ns.length - 1].tie)
        return
      }
    }
    const target = cad ? nearest(final ? [tonic] : Math.random() < 0.5 ? [tonic] : [dom, tonic], i) : -1
    ns.forEach((e, k) => {
      if (prevTie) prevTie = false
      else {
        const w: Record<number, number> = {}
        P.forEach((m, j) => {
          const d = Math.abs(j - i)
          let x = d === 0 ? 0.5 : d === 1 ? 5 : d === 2 ? 3 : d === 3 ? 1.4 : 0.3
          if (nw.has(m)) x *= 2.6
          if (target >= 0 && Math.sign(j - i) === Math.sign(target - i)) x *= 1.8
          w[j] = x
        })
        i = +wpick(w)
        if (target >= 0 && k === ns.length - 1) i = target
      }
      e.m = P[i]
      ids.push(i)
      prevTie = !!e.tie
    })
    idxByBar.push(ids)
  })
  const evs = rb.flat()
  // ties must keep pitch
  const notes = evs.filter((e) => !e.rest)
  notes.forEach((e, k) => {
    if (k && notes[k - 1].tie) e.m = notes[k - 1].m
  })
  // make sure the new note shows up at least once
  if (nw.size && !notes.some((e) => nw.has(e.m as number)) && notes.length > 3) {
    const k = Math.floor(notes.length / 3)
    if (!notes[k - 1].tie && !notes[k].tie) notes[k].m = [...nw][0]
  }
  finish(evs, K, ps, L.chrom)
  return { K, beats, ts: [L.time, L.time === 6 ? 8 : 4], bars, events: evs, chords: [], swing: L.swing }
}

/** Studies: scales, thirds, arpeggios, modes. */
export function genStudy(L: Lesson, S: GenSettings): Score {
  const K = lessonKey(L)
  const ps = positions(L, K, strsOf(S))
  const P = [...new Set(ps.map((p) => p.m))].sort((a, b) => a - b)
  const pat = pick(L.study || ['scale'])
  const beats = 4
  const eighth = (L.R || 6) >= 6
  let t0 = P.findIndex((m) => mod(m, 12) === pc(K.tonic))
  if (t0 < 0) t0 = 0
  const seq: number[] = []
  let label: string | null = null
  if (pat === 'scale') {
    for (let j = t0; j < P.length; j++) seq.push(j)
    for (let j = P.length - 2; j >= t0; j--) seq.push(j)
  } else if (pat === 'thirds') {
    for (let j = t0; j + 2 < P.length; j++) seq.push(j, j + 2)
    for (let j = P.length - 1; j - 2 >= t0; j--) seq.push(j, j - 2)
    seq.push(t0)
  } else if (pat === 'arp') {
    for (let j = t0; j + 4 < P.length && j < t0 + 7; j++) seq.push(j, j + 2, j + 4, j + 2)
    seq.push(t0)
  } else {
    const d = Math.floor(Math.random() * 7)
    let s = P.findIndex((m) => mod(m, 12) === pc(K.scale[d]))
    if (s < 0) s = 0
    if (s + 7 >= P.length) s = Math.max(0, P.findIndex((m, j) => j >= 0 && mod(m, 12) === pc(K.scale[d])))
    const top = Math.min(P.length - 1, s + 7)
    for (let j = s; j <= top; j++) seq.push(j)
    for (let j = top - 1; j >= s; j--) seq.push(j)
    label = nm(K.scale[d]) + ' ' + MODE_NAMES[d]
  }
  const evs: MusicEvent[] = []
  let b = 0
  let p = 0
  const body = seq.slice(0, -1)
  const last = seq[seq.length - 1]
  body.forEach((j) => {
    evs.push({ b, p, d: eighth ? 0.5 : 1, m: P[j], cell: b * 100 + Math.floor(p) })
    p += eighth ? 0.5 : 1
    if (p >= beats) {
      p = 0
      b++
    }
  })
  if (p > 0) {
    evs.push({ b, p, d: beats - p, m: P[last], cell: b * 100 + 9 })
    b++
  } else {
    evs.push({ b, p: 0, d: 4, m: P[last], cell: b * 100 })
    b++
  }
  // a dotted half at beat 2 is split into half + quarter (no dotted halves mid-bar)
  evs.slice().forEach((e) => {
    if (e.d === 3) {
      e.d = 2
      evs.push({ ...e, p: e.p + 2, d: 1, cell: (e.cell as number) + 1 })
    }
  })
  evs.sort((x, y) => x.b - y.b || x.p - y.p)
  finish(evs, K, ps, false)
  return {
    K,
    beats,
    ts: [4, 4],
    bars: b,
    events: evs,
    chords: label ? [{ root: K.tonic, q: '', start: 0, dur: b * 4, label, sym: label, noPlay: true, rn: '' }] : [],
  }
}

/** Parse song bars ("R: D3:q E3:q :R"). */
export function parseBars(bars: string[]): { ev: MusicEvent[]; marks: BarMark[] } {
  const ev: MusicEvent[] = []
  const marks: BarMark[] = []
  bars.forEach((s, b) => {
    const tk = s.trim().split(/\s+/)
    const mk: BarMark = {}
    if (tk[0] === 'R:') {
      mk.start = true
      tk.shift()
    }
    if (tk[0] === '1.' || tk[0] === '2.') {
      mk.volta = +tk[0][0]
      tk.shift()
    }
    if (tk[tk.length - 1] === ':R') {
      mk.end = true
      tk.pop()
    }
    let p = 0
    tk.forEach((t) => {
      const [x, dd] = t.split(':')
      const tie = dd.endsWith('~')
      const d = DUR[dd.replace('~', '')]
      const e: MusicEvent = { b, p, d, tie, cell: b * 100 + Math.floor(p + 1e-6) }
      if (x === 'r') e.rest = true
      else Object.assign(e, parseNote(x))
      ev.push(e)
      p += d
    })
    marks[b] = mk
  })
  return { ev, marks }
}

export function genSong(L: Lesson, S: GenSettings): Score {
  const G = SONGS[L.song as string]
  const K = makeKey(G.key)
  const strs = strsOf(S)
  const { ev, marks } = parseBars(G.bars)
  const ps: Pos[] = []
  strs.forEach((s: StringName) => {
    for (let f = G.win[0]; f <= G.win[1]; f++) ps.push({ s, f, m: OPEN[s] + f })
    if (G.win[0] > 0) ps.push({ s, f: 0, m: OPEN[s] })
  })
  ev.forEach((e) => {
    if (e.rest) return
    e.cands = ps.filter((p) => p.m === e.m)
    if (!e.cands.length) e.cands = anyCands(e.m as number, strs)
  })
  handFinger(ev)
  const beats = G.time
  const chords = (G.chords || []).map(([b, p, s], k, arr) => {
    const nx = arr[k + 1]
    const st = b * beats + p
    const en = nx ? nx[0] * beats + nx[1] : G.bars.length * beats
    const m = s.match(/^([A-G][♭♯#b]?)(.*)$/) as RegExpMatchArray
    return { start: st, dur: en - st, root: parseName(m[1]), q: m[2] || '', label: s }
  })
  const guide = G.guide ? parseBars(G.guide).ev : null
  return {
    K,
    beats,
    ts: [G.time, 4],
    bars: G.bars.length,
    events: ev,
    chords,
    marks,
    guide,
    title: G.title,
    credit: G.credit,
  }
}

