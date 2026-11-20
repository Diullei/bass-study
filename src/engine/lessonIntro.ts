import type { Lesson } from '../curriculum/types'
import { QNAME, sym, tone, tones, type Chord } from '../theory/chords'
import { makeKey, OPEN, spellPc, type Key } from '../theory/keys'
import { iv, midiOf, mod, nm, octOf, parseName, parseNote, pc, staffWords, type Note } from '../theory/notes'
import { CELLS, RTXT } from '../theory/rhythm'
import { chordFrom, pretty } from '../theory/roman'
import { INTV } from '../theory/scales'
import { handFinger, newSetOf, positions, strsOf } from './fretboard'
import type { GenSettings, Label, MusicEvent, Pos, Score } from './types'

/** A fact line. Strings are plain; objects render `pre` + bold `strong` + `post`. */
export type Fact = string | { pre?: string; strong: string; post?: string }

/** The illustration for a theory lesson (scales, intervals, chords …). */
export function demoScore(L: Lesson, S: GenSettings): Score | null {
  const d = L.demo
  if (!d) return null
  const strs = strsOf(S)
  const ps: Pos[] = []
  strs.forEach((s) => {
    for (let f = 0; f <= 12; f++) ps.push({ s, f, m: OPEN[s] + f })
  })
  const evs: MusicEvent[] = []
  const labels: Label[] = []
  const chords: Chord[] = []
  let b = 0
  const put = (n: Note, m: number, p: number, dd: number) =>
    evs.push({ b, p, d: dd, n, o: octOf(n, m), m, cell: b * 100 + p, cands: ps.filter((q) => q.m === m) })
  const K = makeKey('key' in d ? d.key : 'C')
  if (d.type === 'pairs')
    d.items.forEach(([x, y, lab]) => {
      const A = parseNote(x)
      const B = parseNote(y)
      put(A.n, A.m, 0, 2)
      put(B.n, B.m, 2, 2)
      labels.push({ b, p: 0, text: lab + ' step' })
      b++
    })
  if (d.type === 'intervals') {
    const R = parseNote(d.root)
    d.list.forEach((k) => {
      const n = iv(R.n, INTV[k][0], INTV[k][1])
      put(R.n, R.m, 0, 2)
      put(n, R.m + INTV[k][1], 2, 2)
      labels.push({ b, p: 0, text: INTV[k][2] })
      b++
    })
  }
  if (d.type === 'scale') {
    const sc = K.scale.concat([K.tonic])
    let prev = midiOf(K.tonic, K.tonic.l >= 4 ? 2 : 3) - 1
    if (prev + 1 > 52) prev -= 12
    sc.forEach((n, i) => {
      let mm = midiOf(n, 2)
      while (mm <= prev) mm += 12
      prev = mm
      put(n, mm, i % 4, 1)
      labels.push({ b, p: i % 4, text: String(i + 1) })
      if (i % 4 === 3) b++
    })
    if (evs.length % 4) b++
  }
  if (d.type === 'chords' || d.type === 'romans' || d.type === 'guide')
    d.items.forEach((it) => {
      let c: Chord
      if (d.type === 'chords') {
        const m = it.match(/^([A-G][♭♯b#]?)(.*)$/) as RegExpMatchArray
        c = { root: parseName(m[1]), q: m[2], start: 0, dur: 4 }
      } else c = chordFrom(it, K)
      const T = tones(c)
      let base = midiOf(c.root, 2)
      if (base < 40) base += 12
      if (base > 50) base -= 12
      chords.push({
        start: b * 4, dur: 4, sym: sym(c), rn: d.type === 'chords' ? QNAME[c.q] || '' : pretty(it), root: c.root, q: c.q,
      })
      if (d.type === 'guide') {
        const g3 = tone(c, 3) as Note
        const g7 = tone(c, 7) as Note
        let m3 = midiOf(g3, 3)
        if (m3 > 57) m3 -= 12
        let m7 = midiOf(g7, 3)
        while (m7 <= m3) m7 += 12
        if (m7 > 62) m7 -= 12
        put(c.root, base, 0, 2)
        put(g3, m3, 2, 1)
        put(g7, m7, 3, 1)
      } else {
        const seq = T.filter((x) => [1, 3, 5, 6, 7].includes(x.d))
        seq.forEach((x, i) => put(x.n, base + x.s, i, i === seq.length - 1 ? 4 - i : 1))
      }
      b++
    })
  handFinger(evs)
  return { K, beats: 4, ts: [4, 4], bars: b, events: evs, chords, labels: labels.length ? labels : null }
}

export interface LessonIntro {
  facts: Fact[]
  /** The "new material" paper: a demo, or the new notes and rhythms. */
  paper: Score | null
}

const isReadingLesson = (L: Lesson) => !L.chart && !L.song && !L.noEx && !L.study

/** Facts and the illustration shown at the top of a lesson. */
export function lessonIntro(L: Lesson, S: GenSettings, prevLesson?: Lesson): LessonIntro {
  const facts: Fact[] = [...(L.th || [])]
  const strs = strsOf(S)
  const newPs: Pos[] = []
  let K: Key | null = null
  const posFinger = L.win && L.win[0] > 1 ? L.win[0] : 1

  if (isReadingLesson(L)) {
    K = makeKey(L.keys ? L.keys[0] : L.key || 'C')
    const ps = positions(L, K, strs)
    const nw = newSetOf(L, ps)
    ;[...nw]
      .sort((a, b) => a - b)
      .forEach((m) => {
        const p = ps.find((q) => q.m === m)
        if (p) newPs.push(p)
      })
    const Kk = K
    newPs.forEach((p) => {
      const n = spellPc(mod(p.m, 12), Kk)
      const o = octOf(n, p.m)
      facts.push({
        strong: nm(n),
        post: ` — ${p.s} string, ${p.f === 0 ? 'open' : 'fret ' + p.f}${p.f ? ', finger ' + (p.f - posFinger + 1) : ''}; written on the ${staffWords(n, o)}.`,
      })
    })
    if (L.keys) facts.push(`Keys: ${L.keys.map((k) => makeKey(k).label).join(', ')}.`)
    else if (L.key && L.u >= 6) {
      const sig = Object.keys(K.sig)
      facts.push({
        pre: 'Key: ',
        strong: K.label,
        post: sig.length
          ? ` — ${sig.map((l) => nm({ l: +l, a: Kk.sig[+l] })).join(', ')} in the key signature.`
          : ' — no sharps or flats.',
      })
    }
  }
  L.newR.forEach((c) => {
    if (RTXT[c]) facts.push(RTXT[c])
  })
  if (L.time !== 4 && !L.chart && !L.song && (!prevLesson || prevLesson.time !== L.time))
    facts.push(
      `Time signature ${L.time === 6 ? '6/8: six eighth notes per bar, felt in two' : L.time + '/4: ' + L.time + ' quarter-note beats per bar'}.`,
    )

  let paper: Score | null = null
  if (L.demo) paper = demoScore(L, S)
  else if (newPs.length || L.newR.length) {
    const evs: MusicEvent[] = []
    let b = 0
    newPs.forEach((p) => {
      const n = spellPc(mod(p.m, 12), K as Key)
      evs.push({
        b, p: 0, d: 4, n, o: octOf(n, p.m), m: p.m, s: p.s, f: p.f,
        finger: p.f ? p.f - posFinger + 1 : 0, cell: 'n' + b,
      })
      b++
    })
    const Kd = K || makeKey('C')
    const ps = L.win || L.pool ? positions(L, Kd, strs) : []
    const dp: Pos = newPs[0] || ps.find((p) => mod(p.m, 12) === pc(Kd.tonic)) || ps[0] || { m: 50, s: 'D', f: 0 }
    const n = spellPc(mod(dp.m, 12), Kd)
    const beats = L.time === 6 ? 3 : L.time
    L.newR
      .filter((c) => CELLS[c])
      .forEach((c) => {
        const C = CELLS[c]
        let p = 0
        for (let r = 0; p + C.b <= beats + 1e-6 && r < 4; r++) {
          C.ev.forEach(([d, fl]) => {
            evs.push({
              b, p, d, rest: fl === 'r', tie: fl === 't', trip: fl === '3',
              n, o: octOf(n, dp.m), m: dp.m, s: dp.s, f: dp.f, cell: b * 100 + r,
            })
            p += d
          })
          p = Math.round(p * 1e6) / 1e6
        }
        while (p < beats - 1e-6) {
          evs.push({ b, p, d: 1, n, o: octOf(n, dp.m), m: dp.m, s: dp.s, f: dp.f, cell: b * 100 + 50 + p })
          p++
        }
        b++
      })
    if (evs.length) paper = { K: Kd, beats, ts: [L.time, L.time === 6 ? 8 : 4], bars: b, events: evs, chords: [] }
  }
  return { facts, paper }
}
