import { useState } from 'react'
import { midiOf, nm, pc } from '../../theory/notes'
import { Button, cx, FactList, StickyNote } from '../../ui'
import { HText } from './HText'
import { Piano, type KeyMark } from './Piano'
import { useSteps, type Step } from './sound'
import {
  analyse,
  derive,
  diatonic,
  functionOf,
  keyNotes,
  midiOfName,
  nameScale,
  parseChord,
  ROLE_PEN,
  ROLE_WORD,
  SCALES,
  scaleNotes,
  voice,
  type NoteRole,
} from './theory'
import type { Check, HBlock } from './types'
import s from './Harmony.module.css'

// ───────────── sound helpers ─────────────

const names = (x?: string) => (x ? x.trim().split(/\s+/).filter(Boolean) : [])
const segs = (x?: string) => (x == null ? [] : x.split('|').map((p) => p.trim()))

/** A listening item → steps. Chords, notes and bass are split by "|" into steps. */
function itemSteps(it: { notes?: string; bass?: string; chord?: string; beats?: number }): Step[] {
  const C = segs(it.chord)
  const N = segs(it.notes)
  const B = segs(it.bass)
  const n = Math.max(C.length, N.length, B.length, 1)
  const beats = it.beats ?? 2
  const held = B.length === 1 && n > 1
  return Array.from({ length: n }, (_, i) => {
    const c = C[i] ?? (C.length === 1 ? C[0] : '')
    const ch = c ? parseChord(c) : null
    const v = ch ? voice(ch) : null
    const notes = [...(v?.notes ?? []), ...names(N[i]).map(midiOfName)]
    let bass: number | undefined
    if (held) bass = i === 0 ? midiOfName(B[0]) : undefined
    else if (B[i]) bass = midiOfName(B[i])
    else if (v) bass = v.bass
    return { notes: [...new Set(notes)], bass, beats, ...(held && i === 0 ? { bassBeats: beats * n } : {}) }
  })
}

function PlayBtn({ playing, onPlay, onStop, label = '▶ Listen' }: { playing: boolean; onPlay: () => void; onStop: () => void; label?: string }) {
  return (
    <Button size="sm" variant={playing ? 'ink' : 'default'} onClick={playing ? onStop : onPlay}>
      {playing ? '■ Stop' : label}
    </Button>
  )
}

function Listen({ b }: { b: Extract<HBlock, { t: 'listen' }> }) {
  const P = useSteps()
  const [which, setWhich] = useState<number | null>(null)
  const steps = b.items.map(itemSteps)
  const all = steps.flat()
  const starts = steps.map((_, i) => steps.slice(0, i).reduce((a, x) => a + x.length, 0))
  const cur = P.at == null ? null : which != null ? which : starts.reduce((acc, st, i) => (st <= (P.at as number) ? i : acc), 0)
  return (
    <figure className={s.listen}>
      <figcaption>
        🎧 {b.title}
        {b.items.length > 1 && (
          <PlayBtn playing={P.playing && which == null} onPlay={() => (setWhich(null), P.play(all, b.tempo ?? 84))} onStop={P.stop} label="▶ All" />
        )}
      </figcaption>
      <div className={s.listenItems}>
        {b.items.map((it, i) => (
          <button
            key={i}
            type="button"
            className={cx(s.listenItem, cur === i && s.on)}
            onClick={() => (P.playing && which === i ? P.stop() : (setWhich(i), P.play(steps[i], b.tempo ?? 84)))}
          >
            {cur === i ? '■' : '▶'} {it.label}
          </button>
        ))}
      </div>
      {b.caption && <p className={s.caption}><HText text={b.caption} /></p>}
    </figure>
  )
}

// ───────────── chord chart ─────────────

interface Cell {
  sym: string
  bar: number
  arrow?: 'solid' | 'dashed'
  br?: 'start' | 'mid' | 'end'
  rn?: string
}

function parseChart(chords: string, rn?: string): { cells: Cell[]; bars: number } {
  const cells: Cell[] = []
  let open = false
  const bars = chords.split('|')
  bars.forEach((bar, bi) =>
    bar
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .forEach((tok) => {
        let t = tok
        const c: Cell = { sym: '', bar: bi }
        if (t.startsWith('[')) {
          t = t.slice(1)
          c.br = 'start'
          open = true
        } else if (open) c.br = 'mid'
        for (;;) {
          if (t.endsWith('~>')) (c.arrow = 'dashed'), (t = t.slice(0, -2))
          else if (t.endsWith('>')) (c.arrow = 'solid'), (t = t.slice(0, -1))
          else if (t.endsWith(']')) (c.br = c.br === 'start' ? 'start' : 'end'), (open = false), (t = t.slice(0, -1))
          else break
        }
        c.sym = t
        cells.push(c)
      }),
  )
  const R = names(rn)
  cells.forEach((c, i) => (c.rn = R[i] && R[i] !== '.' ? R[i] : undefined))
  return { cells, bars: bars.length }
}

function Chart({ b }: { b: Extract<HBlock, { t: 'chart' }> }) {
  const P = useSteps()
  const { cells, bars } = parseChart(b.chords, b.rn)
  const walk = segs(b.walk).map(names)
  const steps: Step[] = []
  for (let bar = 0; bar < bars; bar++) {
    const inBar = cells.filter((c) => c.bar === bar)
    const beats = 4 / inBar.length
    inBar.forEach((c, k) => {
      const ch = parseChord(c.sym)
      const v = ch ? voice(ch) : { notes: [], bass: undefined }
      const w = walk[bar]?.slice(k * beats, (k + 1) * beats).map(midiOfName)
      steps.push({ notes: v.notes, bass: v.bass, walk: w && w.length ? w : undefined, beats })
    })
  }
  return (
    <figure className={s.chartFig}>
      <figcaption>
        <span>{b.title}</span>
        <PlayBtn playing={P.playing} onPlay={() => P.play(steps, b.tempo ?? 100)} onStop={P.stop} label={b.walk ? '▶ Listen (with walking bass)' : '▶ Listen'} />
      </figcaption>
      <div className={s.chart}>
        {Array.from({ length: bars }, (_, bar) => (
          <div key={bar} className={s.bar}>
            {cells
              .map((c, i) => ({ c, i }))
              .filter(({ c }) => c.bar === bar)
              .map(({ c, i }) => (
                <div key={i} className={cx(s.cell, c.br && s.br, c.br && s['br_' + c.br], P.at === i && s.on)}>
                  <span className={s.sym}>
                    {c.sym}
                    {c.arrow && <span className={s.arrow}>{c.arrow === 'solid' ? '→' : '⇢'}</span>}
                  </span>
                  {c.rn && <span className={s.rn}>{c.rn}</span>}
                </div>
              ))}
          </div>
        ))}
      </div>
      {b.caption && <p className={s.caption}><HText text={b.caption} /></p>}
    </figure>
  )
}

// ───────────── chord + scale on a keyboard ─────────────

/** The scale laid out upward from the chord root, every note marked by its role. */
function scaleMarks(chord: string, scale: string) {
  const c = parseChord(chord)!
  const notes = scaleNotes(c.root, scale)
  const A = analyse(c, notes)
  let base = midiOf(c.root, 4)
  while (base >= 60) base -= 12
  while (base < 48) base += 12
  let prev = base - 1
  const midis = notes.map((n) => {
    let m = midiOf(n, 3)
    while (m <= prev) m += 12
    prev = m
    return m
  })
  const marks: KeyMark[] = A.map((a, i) => ({ midi: midis[i], label: a.name, pen: ROLE_PEN[a.role], root: i === 0 }))
  return { c, A, marks, midis, from: base - (((base % 12) + 12) % 12) }
}

export function RoleList({ A }: { A: NoteRole[] }) {
  return (
    <ul className={s.roles}>
      {A.filter((a) => a.role !== 'chord').map((a, i) => (
        <li key={i} className={ROLE_PEN[a.role]}>
          <b className={s.roleNote}>
            {nm(a.n)} <small>({a.name})</small>
          </b>{' '}
          <span className={s.roleWord}>{ROLE_WORD[a.role]}:</span> <HText text={a.why} />
        </li>
      ))}
    </ul>
  )
}

export const RoleKey = () => (
  <ul className={s.roleKey} aria-label="What the pens mean">
    <li>
      <i className={s.swatch} /> chord tone
    </li>
    <li className="pen-green">
      <i className={s.swatch} /> tension
    </li>
    <li className="pen-purple">
      <i className={s.swatch} /> avoid note
    </li>
    <li className="pen-blue">
      <i className={s.swatch} /> changes the job
    </li>
  </ul>
)

export function ScaleView({ chord, scale, caption }: { chord: string; scale: string; caption?: string }) {
  const P = useSteps()
  const { c, A, marks, midis, from } = scaleMarks(chord, scale)
  const v = voice(c)
  const chordStep: Step = { notes: v.notes, bass: v.bass, beats: 2 }
  const steps: Step[] = [chordStep, ...midis.map((m) => ({ notes: [m], bass: undefined, beats: 0.5 })), { notes: [midis[0] + 12], beats: 1 }]
  const tensionSteps: Step[] = A.flatMap((a, i) => (a.role === 'chord' ? [] : [{ notes: [...v.notes, midis[i] + 12], bass: v.bass, beats: 2.5 }]))
  const tensionIdx = A.map((a, i) => (a.role === 'chord' ? -1 : i)).filter((i) => i >= 0)
  const active = P.at == null || P.at === 0 ? [] : [P.at - 1 < midis.length ? P.at - 1 : 0]
  const [mode, setMode] = useState<'scale' | 'tens'>('scale')
  return (
    <figure className={s.scaleFig}>
      <figcaption>
        <span>
          <b>{chord}</b> · {SCALES[scale].name}
        </span>
        <PlayBtn playing={P.playing && mode === 'scale'} onPlay={() => (setMode('scale'), P.play(steps, 110))} onStop={P.stop} label="▶ Chord, then scale" />
        <PlayBtn playing={P.playing && mode === 'tens'} onPlay={() => (setMode('tens'), P.play(tensionSteps, 70))} onStop={P.stop} label="▶ Hold each other note" />
      </figcaption>
      <Piano from={from} marks={marks} active={P.at == null ? [] : mode === 'scale' ? active : [tensionIdx[P.at]]} />
      <RoleKey />
      <RoleList A={A} />
      {caption && <p className={s.caption}><HText text={caption} /></p>}
    </figure>
  )
}

function CsTable({ b }: { b: Extract<HBlock, { t: 'cstable' }> }) {
  const P = useSteps()
  const [row, setRow] = useState<number | null>(null)
  const rows = b.rows.map(([chord, scale, use]) => {
    const c = parseChord(chord)!
    const A = analyse(c, scaleNotes(c.root, scale))
    const list = (r: string) =>
      A.filter((a) => a.role === r)
        .map((a) => `${a.name} (${nm(a.n)})`)
        .join(', ') || '—'
    return { chord, scale, use, c, A, tens: list('tension'), avoid: list('avoid'), shift: list('shift') }
  })
  const hear = (i: number) => {
    const { c, scale } = rows[i]
    const v = voice(c)
    const notes = scaleNotes(c.root, scale)
    let prev = 59
    const ms = notes.map((n) => {
      let m = midiOf(n, 4)
      while (m <= prev) m += 12
      prev = m
      return m
    })
    setRow(i)
    P.play([{ notes: v.notes, bass: v.bass, beats: 2 }, ...ms.map((m) => ({ notes: [m], beats: 0.5 })), { notes: [ms[0] + 12], beats: 1 }], 110)
  }
  const anyShift = rows.some((r) => r.shift !== '—')
  return (
    <figure className={s.tableFig}>
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Chord</th>
              <th>Scale</th>
              <th className="pen-green">Tensions</th>
              <th className="pen-purple">Avoid</th>
              {anyShift && <th className="pen-blue">Changes the job</th>}
              {rows.some((r) => r.use) && <th>When</th>}
              <th aria-label="Listen" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={cx(P.playing && row === i && s.rowOn)}>
                <td><b>{r.chord}</b></td>
                <td>{SCALES[r.scale].name}</td>
                <td className="pen-green">{r.tens}</td>
                <td className="pen-purple">{r.avoid}</td>
                {anyShift && <td className="pen-blue">{r.shift}</td>}
                {rows.some((x) => x.use) && <td className={s.use}>{r.use ? <HText text={r.use} /> : ''}</td>}
                <td>
                  <button type="button" className={s.mini} title={`Hear ${r.chord} and its scale`} onClick={() => (P.playing && row === i ? P.stop() : hear(i))}>
                    {P.playing && row === i ? '■' : '▶'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={s.caption}>
        <HText text={b.caption ?? 'Computed live from [[R5]] and [[R6]]: no row is typed in. If yours differs, find the note and ask the half-step question.'} />
      </p>
    </figure>
  )
}

// ───────────── Rule 5, step by step ─────────────

export function DeriveView({ keyName, mode = 'major', chord }: { keyName: string; mode?: 'major' | 'minor'; chord: string }) {
  const c = parseChord(chord)!
  const tonic = parseChord(keyName)!.root
  const { steps, clash } = derive(tonic, mode, c)
  const out = steps.map((x) => x.out)
  const sc = nameScale(c.root, out)
  const changed = steps.filter((x) => x.changed)
  const A = analyse(c, out)
  return (
    <figure className={s.derive}>
      <figcaption>
        <b>{chord}</b> in {keyName} {mode}: its scale by <HText text="[[R5]]" />
      </figcaption>
      <div className={s.tableWrap}>
        <table className={s.table}>
          <tbody>
            <tr>
              <th>1. The key, from {nm(c.root)}</th>
              {steps.map((x, i) => (
                <td key={i}>{nm(x.key)}</td>
              ))}
            </tr>
            <tr>
              <th>2. The chord's notes</th>
              {steps.map((x, i) => (
                <td key={i} className={s.ct}>{x.chord ? nm(x.chord) : ''}</td>
              ))}
            </tr>
            <tr>
              <th>3. Where they disagree, the chord wins</th>
              {steps.map((x, i) => (
                <td key={i} className={cx(x.changed && s.changed)}>
                  <b>{nm(x.out)}</b>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.caption}>
        {changed.length === 0 ? (
          <>Nothing to change: every chord note is already in the key. </>
        ) : (
          <>
            Changed: {changed.map((x) => `${nm(x.key)} → ${nm(x.out)}`).join(', ')}. Everything else stays.{' '}
          </>
        )}
        {clash ? (
          <>
            <b>Two notes land on the same key</b> ({out.filter((n, i) => out.findIndex((m) => pc(m) === pc(n)) !== i).map(nm).join(', ')}): this chord is too far from the key for
            Rule 5 alone, so you choose a colour (see <HText text="[[L10]]" />).
          </>
        ) : (
          <>
            Result: <b>{out.map(nm).join(' ')}</b>
            {sc ? ` = ${SCALES[sc].name}` : ''}.
          </>
        )}
      </p>
      {!clash && (
        <>
          <p className={s.caption}>
            <HText text="4. Now [[R6]] sorts the notes that are not in the chord:" />
          </p>
          <RoleList A={A} />
        </>
      )}
    </figure>
  )
}

// ───────────── Rule 4 on a key ─────────────

function Functions({ keyName }: { keyName: string }) {
  const tonic = parseChord(keyName)!.root
  const k = keyNotes(tonic, 'major')
  const four = pc(k[3])
  const seven = pc(k[6])
  return (
    <figure className={s.tableFig}>
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Chord</th>
              <th>Notes</th>
              <th>has {nm(k[3])}?</th>
              <th>has {nm(k[6])}?</th>
              <th>Function</th>
            </tr>
          </thead>
          <tbody>
            {diatonic(tonic).map((c) => {
              const f = functionOf(tonic, c.notes)
              return (
                <tr key={c.rn}>
                  <td>
                    <b>{c.sym}</b> <small className={s.rnSmall}>{c.rn}</small>
                  </td>
                  <td>
                    {c.notes.map((n, i) => (
                      <span key={i} className={cx(s.nt, pc(n) === four && s.ntFour, pc(n) === seven && s.ntSeven)}>
                        {nm(n)}
                      </span>
                    ))}
                  </td>
                  <td>{f.four ? '✓' : ''}</td>
                  <td>{f.seven ? '✓' : ''}</td>
                  <td className={s['f_' + f.f]}>{f.f}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className={s.caption}>
        <HText text={`Computed with [[R4]]: ${nm(k[3])} alone means "away", ${nm(k[3])} with ${nm(k[6])} means "go home".`} />
      </p>
    </figure>
  )
}

// ───────────── checks ─────────────

export function CheckList({ items }: { items: Check[] }) {
  return (
    <ol className={s.checks}>
      {items.map((c, i) => (
        <CheckItem key={i} c={c} />
      ))}
    </ol>
  )
}

function CheckItem({ c }: { c: Check }) {
  const [open, setOpen] = useState(false)
  return (
    <li>
      <span className={s.q}>
        <HText text={c.q} />
      </span>
      {open ? (
        <div className={s.answer}>
          <b>
            <HText text={c.a} />
          </b>
          <span className={s.whyLine}>
            Why: <HText text={c.why} />
          </span>
        </div>
      ) : (
        <Button size="sm" variant="pencil" onClick={() => setOpen(true)}>
          Work it out, then show the answer
        </Button>
      )}
    </li>
  )
}

// ───────────── the dispatcher ─────────────

export function BlockView({ b }: { b: HBlock }) {
  switch (b.t) {
    case 'p':
      return (
        <p className={s.para}>
          <HText text={b.text} />
        </p>
      )
    case 'h':
      return (
        <h4 className={s.h}>
          <HText text={b.text} />
        </h4>
      )
    case 'list':
      return <FactList items={b.items.map((x, i) => <HText key={i} text={x} />)} />
    case 'tip':
      return (
        <StickyNote title={b.title}>
          <HText text={b.text} />
        </StickyNote>
      )
    case 'table':
      return (
        <figure className={s.tableFig}>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  {b.head.map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((x, j) => (
                      <td key={j}>
                        <HText text={x} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {b.caption && (
            <p className={s.caption}>
              <HText text={b.caption} />
            </p>
          )}
        </figure>
      )
    case 'code':
      return (
        <figure className={s.codeFig}>
          {b.caption && <figcaption>{b.caption}</figcaption>}
          <pre className={s.pre}>{b.lines.join('\n')}</pre>
        </figure>
      )
    case 'listen':
      return <Listen b={b} />
    case 'chart':
      return <Chart b={b} />
    case 'scale':
      return <ScaleView chord={b.chord} scale={b.scale} caption={b.caption} />
    case 'cstable':
      return <CsTable b={b} />
    case 'derive':
      return <DeriveView keyName={b.key} mode={b.mode} chord={b.chord} />
    case 'functions':
      return <Functions keyName={b.key} />
  }
}

