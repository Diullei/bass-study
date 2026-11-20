import type { MusicEvent, Score } from '../engine/types'
import { nm } from '../theory/notes'

/**
 * Hand-drawn bass-clef notation as an SVG string.
 *
 * Every stroke gets a small deterministic wobble so the page looks written by hand,
 * but re-renders of the same score look identical. Styling comes from CSS classes
 * (see styles/notation.css): .ln staff lines, .ink strokes, .inkf fills, .nh noteheads …
 * Notes are wrapped in <g data-e="i"> and chord symbols carry data-c="i" so the player
 * can highlight them.
 */

export interface RenderFlags {
  nStr?: 4 | 5
  /** Force bars per line. */
  bpl?: number
  noTime?: boolean
  noFinal?: boolean
  syms?: boolean
  finger?: boolean
  count?: boolean
  names?: boolean
  tab?: boolean
  rn?: boolean
}

interface REv extends MusicEvent {
  i: number
  acc: number | null
  grp: REv[] | null
  sx: number
  end: number
  up: boolean
}

/** Staff positions (diatonic steps) of key-signature accidentals, by letter. */
const SHARP_POS: Record<number, number> = { 3: 24, 0: 21, 4: 25, 1: 22, 5: 19, 2: 23, 6: 20 }
const FLAT_POS: Record<number, number> = { 6: 20, 2: 23, 5: 19, 1: 22, 4: 18, 0: 21, 3: 17 }

export function renderScore(D: Score, F: RenderFlags, width: number): { svg: string; height: number } {
  const W = Math.max(260, width || 800)
  const K = D.K
  const nStr = F.nStr || 5
  const strs = nStr === 4 ? ['E', 'A', 'D', 'G'] : ['B', 'E', 'A', 'D', 'G']
  const beats = D.beats
  const ts = D.ts || [beats, 4]
  const marks = D.marks || []
  const sharp = Object.values(K.sig).some((a) => a > 0)
  const sigOrd = (sharp ? [3, 0, 4, 1, 5, 2, 6] : [6, 2, 5, 1, 4, 0, 3]).filter((l) => K.sig[l])
  const leftW = 44 + sigOrd.length * 9 + (F.noTime ? 6 : sigOrd.length ? 30 : 24)

  const evs: REv[] = D.events.map((e, i) => ({ ...e, i, acc: null, grp: null, sx: 0, end: 0, up: true }))
  const byBar: REv[][] = Array.from({ length: D.bars }, () => [])
  evs.forEach((e) => byBar[e.b]?.push(e))
  // accidentals: shown when different from the key signature or an earlier note in the bar
  byBar.forEach((ev) => {
    const mem: Record<string, number> = {}
    ev.forEach((e) => {
      if (e.rest || D.slash || !e.n) return
      const k = e.n.l + '_' + e.o
      const cur = mem[k] != null ? mem[k] : K.sig[e.n.l] || 0
      if (e.n.a !== cur) {
        e.acc = e.n.a
        mem[k] = e.n.a
      }
    })
  })

  const need = Math.max(
    ...byBar.map((ev) => 40 + ev.reduce((s, e) => s + (e.d >= 2 ? 30 : e.d >= 1 ? 26 : e.d >= 0.5 ? 22 : 19) + (e.acc != null ? 11 : 0), 0)),
  )
  const bpl = F.bpl || Math.max(1, Math.min(4, Math.floor((W - leftW - 6) / Math.max(need, 110))))
  const barW = (W - leftW - 6) / bpl
  const lines = Math.ceil(D.bars / bpl)

  // vertical layout of one system
  const L: Record<string, number> = {}
  let y = 0
  if (D.title) {
    L.ttl = y + 24
    y += 40
  }
  const hasSym = !!(F.syms && D.chords && D.chords.length)
  if (hasSym) {
    L.sym = y + 18
    y += 26
  }
  if (marks.some((m) => m && m.volta)) {
    L.volta = y + 20
    y += 24
  }
  if (F.finger && !D.slash) {
    L.fing = y + 12
    y += 10
  }
  L.top = y + 30
  L.yB = L.top + 40
  y = L.yB + 28
  if (F.count) {
    L.cnt = y + 4
    y += 17
  }
  if (F.names && !D.slash) {
    L.nam = y + 4
    y += 17
  }
  if (F.tab && !D.slash) {
    L.tab = y + 10
    y = L.tab + (nStr - 1) * 9 + 10
  }
  if ((F.rn && hasSym) || D.labels) {
    L.rn = y + 14
    y += 22
  }
  const lineH = y + (L.rn != null ? 20 : 10)
  const H = lines * lineH

  /** y of a diatonic staff step (18 = bottom line G2 of bass clef). */
  const ys = (ds: number) => L.yB - (ds - 18) * 5
  const P: string[] = []
  const f1 = (v: number) => (+v).toFixed(1)
  const jr = (i: number) => {
    const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453
    return x - Math.floor(x)
  }
  const jit = (i: number, a: number) => (jr(i) - 0.5) * 2 * a
  const line = (x1: number, y1: number, x2: number, y2: number) =>
    P.push(`<line class="ln" x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}"/>`)
  const hand = (x1: number, y1: number, x2: number, y2: number, sd: number, w = 1.5) => {
    const mx = (x1 + x2) / 2 + jit(sd + 1, 0.8)
    const my = (y1 + y2) / 2 + jit(sd + 2, 0.8)
    P.push(
      `<path class="ink" stroke-width="${w}" d="M${f1(x1 + jit(sd + 3, 0.5))},${f1(y1 + jit(sd + 4, 0.5))} Q${f1(mx)},${f1(my)} ${f1(x2 + jit(sd + 5, 0.5))},${f1(y2 + jit(sd + 6, 0.5))}"/>`,
    )
  }
  const dot = (x: number, yy: number, r = 1.9) => P.push(`<circle class="inkf" cx="${f1(x)}" cy="${f1(yy)}" r="${r}"/>`)
  const accid = (a: number, x: number, yy: number, sd: number) => {
    const j = (k: number) => jit(sd + k, 0.5)
    if (a >= 1) {
      hand(x - 2 + j(1), yy - 10, x - 2.6, yy + 10, sd + 10, 1.3)
      hand(x + 2.4, yy - 11.5, x + 1.8, yy + 8.5, sd + 20, 1.3)
      hand(x - 5, yy - 2, x + 5.5, yy - 5, sd + 30, 2.6)
      hand(x - 5.5, yy + 5, x + 5, yy + 2, sd + 40, 2.6)
      if (a === 2) accid(1, x - 9, yy, sd + 99)
    } else if (a <= -1) {
      P.push(
        `<path class="ink" stroke-width="1.5" d="M${f1(x - 3 + j(1))},${f1(yy - 14)} L${f1(x - 3.4)},${f1(yy + 5)} C${f1(x + 6)},${f1(yy - 0.5 + j(2))} ${f1(x + 4.5)},${f1(yy - 7.5)} ${f1(x - 3.2)},${f1(yy - 2)}"/>`,
      )
      if (a === -2) accid(-1, x - 8, yy, sd + 99)
    } else
      P.push(
        `<path class="ink" stroke-width="1.4" d="M${f1(x - 3 + j(1))},${f1(yy - 12)} L${f1(x - 3)},${f1(yy + 4)} L${f1(x + 3.2)},${f1(yy + 2)} M${f1(x + 3 + j(2))},${f1(yy + 12)} L${f1(x + 3)},${f1(yy - 4)} L${f1(x - 3.2)},${f1(yy - 2)}"/>`,
      )
  }
  const bx = (b: number) => leftW + (b % bpl) * barW
  const by = (b: number) => Math.floor(b / bpl) * lineH

  // horizontal note positions: proportional-ish spacing inside each bar
  const X: Record<number, number> = {}
  byBar.forEach((ev, b) => {
    const m = marks[b] || {}
    const padL = 16 + (m.start ? 12 : 0)
    const inner = barW - 28 - (m.start ? 12 : 0) - (m.end ? 10 : 0)
    if (D.slash) {
      ev.forEach((e) => (X[e.i] = bx(b) + padL + (e.p / beats) * inner))
      return
    }
    const wt = (e: REv) => 0.55 + Math.sqrt(e.d) * 0.75 + (e.acc != null ? 0.35 : 0)
    const tot = ev.reduce((s, e) => s + wt(e), 0) || 1
    let c = 0
    ev.forEach((e) => {
      X[e.i] = bx(b) + padL + ((c + (e.acc != null ? 0.35 : 0)) / tot) * inner
      c += wt(e)
    })
  })
  const xAtBeat = (b: number, p: number) => {
    const ev = byBar[b] || []
    const pts: [number, number][] = ev.map((e) => [e.p, X[e.i]])
    if (!pts.length || pts[0][0] > 0) pts.unshift([0, bx(b) + 16])
    pts.push([beats, bx(b) + barW - 8])
    for (let i = 0; i < pts.length - 1; i++)
      if (p >= pts[i][0] - 1e-6 && p <= pts[i + 1][0] + 1e-6) {
        const [p0, x0] = pts[i]
        const [p1, x1] = pts[i + 1]
        return x0 + ((p - p0) / (p1 - p0 || 1)) * (x1 - x0)
      }
    return pts[0][1]
  }

  if (D.title) {
    P.push(`<text class="ttl" x="${W / 2}" y="${L.ttl}" text-anchor="middle">${esc(D.title)}</text>`)
    if (D.credit) P.push(`<text class="sm" x="${W - 8}" y="${L.ttl + 16}" text-anchor="end">${esc(D.credit)}</text>`)
  }

  // systems: staff, clef, key signature, time signature, tab staff
  for (let li = 0; li < lines; li++) {
    const oy = li * lineH
    const xEnd = leftW + Math.min(bpl, D.bars - li * bpl) * barW
    P.push(`<g transform="translate(0 ${oy})">`)
    for (let i = 0; i < 5; i++) line(4, L.top + i * 10, xEnd, L.top + i * 10)
    line(4, L.top, 4, L.yB)
    const fy = L.top + 10
    const cj = (k: number) => +f1(jit(li * 31 + k, 0.7))
    P.push(
      `<path class="ink" stroke-width="2.4" d="M${9 + cj(1)},${fy + cj(2)} C8,${fy - 12} 26,${fy - 15 + cj(3)} 27,${fy + 2} C28,${fy + 14} 18,${fy + 22} 6,${fy + 29 + cj(4)}"/><circle class="inkf" cx="10" cy="${fy}" r="3.4"/><circle class="inkf" cx="${33 + cj(5)}" cy="${fy - 5}" r="1.9"/><circle class="inkf" cx="33" cy="${fy + 5 + cj(6)}" r="1.9"/>`,
    )
    sigOrd.forEach((l, i) => accid(sharp ? 1 : -1, 47 + i * 9, ys((sharp ? SHARP_POS : FLAT_POS)[l]), li * 97 + i * 13))
    if (li === 0 && !F.noTime) {
      const tx = 44 + sigOrd.length * 9 + (sigOrd.length ? 9 : 3)
      P.push(
        `<text class="tsig" x="${tx}" y="${L.top + 19}">${ts[0]}</text><text class="tsig" x="${tx}" y="${L.top + 39}">${ts[1]}</text>`,
      )
      if (D.swing) P.push(`<text class="swing" x="${tx - 30}" y="${L.top - 16}">Swing ♪♪ = ♪³♪</text>`)
    }
    if (L.tab != null) {
      for (let i = 0; i < nStr; i++) line(4, L.tab + i * 9, xEnd, L.tab + i * 9)
      line(4, L.tab, 4, L.tab + (nStr - 1) * 9)
      const mid = L.tab + (nStr - 1) * 4.5
      ;['T', 'A', 'B'].forEach((c, i) => P.push(`<text class="tabl" x="11" y="${mid - 8 + i * 9 + 3}">${c}</text>`))
    }
    P.push('</g>')
  }

  // bar lines, repeats, voltas
  for (let b = 0; b < D.bars; b++) {
    const x2 = bx(b) + barW
    const x1 = bx(b)
    const oy = by(b)
    const last = b === D.bars - 1
    const m = marks[b] || {}
    const seg = (y1: number, y2: number, withDots: boolean) => {
      const sd = b * 53 + y1
      if (m.end) {
        hand(x2 - 6, oy + y1, x2 - 6, oy + y2, sd)
        hand(x2 - 1.5, oy + y1, x2 - 1.5, oy + y2, sd + 7, 3.4)
        if (withDots) {
          dot(x2 - 11, oy + ys(21), 2.1)
          dot(x2 - 11, oy + ys(23), 2.1)
        }
      } else if (last && !F.noFinal) {
        hand(x2 - 6, oy + y1, x2 - 6, oy + y2, sd)
        hand(x2 - 1.5, oy + y1, x2 - 1.5, oy + y2, sd + 7, 3.4)
      } else hand(x2, oy + y1 - 1, x2, oy + y2 + 1, sd, 1.4)
      if (m.start) {
        hand(x1 + 2, oy + y1, x1 + 2, oy + y2, sd + 11, 3.4)
        hand(x1 + 6.5, oy + y1, x1 + 6.5, oy + y2, sd + 13)
        if (withDots) {
          dot(x1 + 11.5, oy + ys(21), 2.1)
          dot(x1 + 11.5, oy + ys(23), 2.1)
        }
      }
    }
    seg(L.top, L.yB, true)
    if (L.tab != null) seg(L.tab, L.tab + (nStr - 1) * 9, false)
    if (m.volta && L.volta != null) {
      const pv = marks[b - 1] || {}
      const nxv = marks[b + 1] || {}
      const ys0 = oy + L.volta
      const xs = x1 + 2
      const xe = x2 - 4
      hand(xs, ys0, xe, ys0, b * 7 + 500, 1.3)
      if (pv.volta !== m.volta) {
        hand(xs, ys0, xs, ys0 + 8, b * 7 + 510, 1.3)
        P.push(`<text class="volta" x="${xs + 5}" y="${ys0 - 4}">${m.volta}.</text>`)
      }
      if (nxv.volta !== m.volta && m.volta === 1) hand(xe, ys0, xe, ys0 + 8, b * 7 + 520, 1.3)
    }
  }

  // chord symbols + roman-numeral analysis
  if (hasSym)
    D.chords.forEach((c, i) => {
      const b = Math.floor(c.start / beats + 1e-6)
      const p = c.start - b * beats
      if (b >= D.bars) return
      const x = xAtBeat(b, p) - 6
      const room = (Math.min(c.dur, beats - p) / beats) * (barW - 24) - 4
      const s = c.sym || c.label || ''
      const fs = Math.max(11, Math.min(20, room / (s.length * 0.58)))
      P.push(
        `<text x="${f1(x)}" y="${by(b) + L.sym}" class="csym" data-c="${i}" style="font-size:${f1(fs)}px" transform="rotate(${f1(jit(i * 7, 2))} ${f1(x)} ${by(b) + L.sym})">${esc(s)}</text>`,
      )
      if (L.rn != null && c.rn) {
        const fr = Math.max(10, Math.min(14, room / (c.rn.length * 0.5)))
        P.push(`<text class="rn" x="${f1(x)}" y="${by(b) + L.rn}" style="font-size:${f1(fr)}px">${esc(c.rn)}</text>`)
      }
    })
  if (D.labels && L.rn != null)
    D.labels.forEach((lb) =>
      P.push(`<text class="rn" x="${f1(xAtBeat(lb.b, lb.p) - 6)}" y="${by(lb.b) + L.rn}">${esc(lb.text)}</text>`),
    )

  // counting ("1 + 2 +")
  if (L.cnt != null)
    byBar.forEach((ev, b) => {
      const comp = ts[1] === 8
      const lab = (p: number) => {
        if (comp) return String(Math.round(p * 2) + 1)
        const fr = p - Math.floor(p)
        const bt = String(Math.floor(p + 1e-6) + 1)
        if (fr < 1e-6) return bt
        if (Math.abs(fr - 0.5) < 1e-6) return '+'
        if (Math.abs(fr - 0.25) < 1e-6) return 'e'
        if (Math.abs(fr - 0.75) < 1e-6) return 'a'
        if (Math.abs(fr - 1 / 3) < 1e-3) return 'trip'
        return 'let'
      }
      const starts = ev.map((e) => e.p)
      ev.forEach((e) => {
        const t = lab(e.p)
        P.push(`<text class="sm" x="${f1(X[e.i])}" y="${by(b) + L.cnt + 8}" text-anchor="middle">${e.rest ? '(' + t + ')' : t}</text>`)
      })
      const step = comp ? 0.5 : 1
      for (let p = 0; p < beats - 1e-6; p += step)
        if (!starts.some((s) => Math.abs(s - p) < 1e-6))
          P.push(
            `<text class="sm faint" x="${f1(xAtBeat(b, p))}" y="${by(b) + L.cnt + 8}" text-anchor="middle">(${lab(p)})</text>`,
          )
    })

  // beam groups
  const groups: REv[][] = []
  let g: REv[] | null = null
  evs.forEach((e, k) => {
    const prev = evs[k - 1]
    if (!D.slash && !e.rest && e.d < 1 && prev && g && !prev.rest && prev.d < 1 && prev.cell === e.cell && prev.b === e.b)
      g.push(e)
    else {
      g = !D.slash && !e.rest && e.d < 1 ? [e] : null
      if (g) groups.push(g)
    }
  })
  groups.forEach((gr) => gr.forEach((e) => (e.grp = gr.length > 1 ? gr : null)))

  // notes and rests
  evs.forEach((e) => {
    const b = e.b
    const oy = by(b)
    const x = X[e.i]
    const sd = e.i * 31
    P.push(`<g data-e="${e.i}"${e.cls ? ` class="${esc(e.cls)}"` : ''} transform="translate(0 ${oy})">`)
    if (D.slash) {
      const yy = ys(22)
      hand(x - 4, yy + 8, x + 4, yy - 8, sd, 3.2)
      P.push('</g>')
      return
    }
    if (e.rest || !e.n) {
      if (e.d >= beats - 1e-6 && e.d >= 2) {
        const cx = bx(b) + barW / 2
        P.push(`<rect class="inkf" x="${f1(cx - 6)}" y="${ys(24)}" width="12" height="5.5" rx="1"/>`)
      } else if (e.d === 2) P.push(`<rect class="inkf" x="${f1(x - 6)}" y="${ys(22) - 5.5}" width="12" height="5.5" rx="1"/>`)
      else if (e.d >= 1) {
        const m = ys(22)
        P.push(
          `<path class="ink" stroke-width="2.3" d="M${f1(x - 1)},${m - 12} L${f1(x + 4)},${m - 6} Q${f1(x - 1)},${m - 2} ${f1(x - 1)},${m} L${f1(x + 4)},${m + 5} Q${f1(x - 4)},${m + 3} ${f1(x)},${m + 11}"/>`,
        )
        if (e.d === 1.5) dot(x + 9, ys(23))
      } else {
        const y0 = ys(23)
        dot(x - 3, y0 - 1, 2.3)
        P.push(`<path class="ink" stroke-width="1.5" d="M${f1(x - 3)},${f1(y0 + 1)} Q${f1(x + 1)},${f1(y0 + 2)} ${f1(x + 4)},${f1(y0 - 2)} L${f1(x - 1)},${f1(y0 + 13)}"/>`)
        if (e.d <= 0.25) {
          dot(x - 4.5, y0 + 5, 2.1)
          P.push(`<path class="ink" stroke-width="1.5" d="M${f1(x - 4.5)},${f1(y0 + 7)} Q${f1(x - 0.5)},${f1(y0 + 8)} ${f1(x + 2)},${f1(y0 + 4)}"/>`)
        }
      }
      P.push('</g>')
      return
    }
    const ds = e.n.l + 7 * (e.o as number)
    const yy = ys(ds)
    for (let d = 16; d >= ds; d -= 2) hand(x - 9, ys(d), x + 9, ys(d), sd + d, 1.3)
    for (let d = 28; d <= ds; d += 2) hand(x - 9, ys(d), x + 9, ys(d), sd + d, 1.3)
    if (e.acc != null) accid(e.acc, x - 15, yy, sd + 7)
    const hx = x + jit(sd + 3, 0.5)
    const hy = yy + jit(sd + 5, 0.4)
    const rx = (e.d >= 4 ? 6.9 : 5.8) + jit(sd + 7, 0.35)
    P.push(
      `<ellipse class="nh ${e.d >= 2 ? 'o' : 'f'}" cx="${f1(hx)}" cy="${f1(hy)}" rx="${f1(rx)}" ry="${f1(4.3 + jit(sd + 9, 0.3))}" transform="rotate(${f1(-22 + jit(sd + 11, 6))} ${f1(hx)} ${f1(hy)})"/>`,
    )
    if ([3, 1.5, 0.75].includes(e.d)) dot(hx + 10, ds % 2 === 0 ? hy - 4 : hy)
    if (e.d < 4) {
      let up: boolean
      let end: number
      if (e.grp) {
        const gys = e.grp.map((q) => ys((q.n as { l: number }).l + 7 * (q.o as number)))
        const avg = e.grp.reduce((s, q) => s + (q.n as { l: number }).l + 7 * (q.o as number), 0) / e.grp.length
        up = avg < 22
        end = up ? Math.min(...gys) - 30 : Math.max(...gys) + 30
      } else {
        up = ds < 22
        end = up ? hy - 33 - jit(sd + 13, 2) : hy + 33 + jit(sd + 13, 2)
      }
      const sx = up ? hx + rx - 0.7 : hx - rx + 0.7
      e.sx = sx
      e.end = end
      e.up = up
      hand(sx, hy + (up ? -1 : 1), sx + jit(sd + 15, 0.6), end, sd + 19, 1.5)
      if (!e.grp && e.d < 1) {
        const s = up ? 1 : -1
        P.push(`<path class="ink" stroke-width="1.8" d="M${f1(sx)},${f1(end)} C${f1(sx + 1)},${f1(end + 7 * s)} ${f1(sx + 9)},${f1(end + 9 * s)} ${f1(sx + 7)},${f1(end + 20 * s)}"/>`)
        if (e.d <= 0.25)
          P.push(`<path class="ink" stroke-width="1.8" d="M${f1(sx)},${f1(end + 7 * s)} C${f1(sx + 1)},${f1(end + 14 * s)} ${f1(sx + 9)},${f1(end + 16 * s)} ${f1(sx + 7)},${f1(end + 27 * s)}"/>`)
      }
    }
    if (L.fing != null && e.finger != null) P.push(`<text class="fing" x="${f1(x)}" y="${L.fing}" text-anchor="middle">${e.finger}</text>`)
    if (L.nam != null) P.push(`<text class="sm" x="${f1(x)}" y="${L.nam + 8}" text-anchor="middle">${nm(e.n)}</text>`)
    if (L.tab != null && e.s) {
      const si = strs.indexOf(e.s)
      if (si >= 0) {
        const ty = L.tab + (nStr - 1 - si) * 9
        const w = (e.f as number) > 9 ? 15 : 9
        P.push(
          `<rect class="tabbg" x="${f1(x - w / 2)}" y="${ty - 6}" width="${w}" height="12"/><text class="fret" x="${f1(x)}" y="${ty + 4}" text-anchor="middle">${e.f}</text>`,
        )
      }
    }
    P.push('</g>')
  })

  // beams
  groups.forEach((gr, gi) => {
    if (gr.length < 2) return
    const a = gr[0]
    const z = gr[gr.length - 1]
    const oy = by(a.b)
    const up = a.up
    const y0 = oy + a.end
    hand(a.sx, y0, z.sx, y0, 900 + gi * 17, 4.6)
    const y2 = y0 + (up ? 7 : -7)
    for (let k = 0; k < gr.length - 1; k++)
      if (gr[k].d <= 0.25 && gr[k + 1].d <= 0.25) hand(gr[k].sx, y2, gr[k + 1].sx, y2, 950 + gi * 17 + k, 4.2)
    gr.forEach((q, k) => {
      if (q.d <= 0.25 && !(gr[k - 1] && gr[k - 1].d <= 0.25) && !(gr[k + 1] && gr[k + 1].d <= 0.25)) {
        const dir = k === gr.length - 1 ? -1 : 1
        hand(q.sx, y2, q.sx + 8 * dir, y2, 990 + gi + k, 4.2)
      }
    })
    if (gr.every((q) => q.trip))
      P.push(`<text class="tuplet" x="${f1((a.sx + z.sx) / 2)}" y="${f1(up ? y0 - 6 : y0 + 16)}" text-anchor="middle">3</text>`)
  })

  // ties
  evs.forEach((e, k) => {
    if (!e.tie || e.rest || !e.n) return
    const nx = evs[k + 1]
    if (!nx || nx.rest) return
    const oy = by(e.b)
    const ds = e.n.l + 7 * (e.o as number)
    const yy = ys(ds)
    const s = ds >= 22 ? -1 : 1
    const x1 = X[e.i] + 6
    const x2 = nx.b === e.b ? X[nx.i] - 6 : bx(e.b) + barW - 4
    P.push(
      `<path class="ink" stroke-width="1.6" d="M${f1(x1)},${f1(oy + yy + 6 * s)} Q${f1((x1 + x2) / 2)},${f1(oy + yy + 16 * s)} ${f1(x2)},${f1(oy + yy + 6 * s)}"/>`,
    )
  })

  return {
    svg: `<svg class="score" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${P.join('')}</svg>`,
    height: H,
  }
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string)
