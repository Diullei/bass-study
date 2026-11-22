import { useRef, useState } from 'react'
import { Fretboard, type FretBand } from '../../notation/Fretboard'
import { BeatGrid, Button, FactList, Segmented, StickyNote, cx } from '../../ui'
import { Along, patternRows } from './Along'
import { CText } from './CText'
import { PATTERNS, type PatternId } from './patterns'
import { useLefty } from './progress'
import { info, patternNotes, type ShapeInfo } from './render'
import { degsOf, PenKey, pensOf, rootsOf, ShapesBlock } from './Shapes'
import { useClip } from './sound'
import { ChordShape } from '../../notation/ChordShape'
import type { Check } from '../harmony/types'
import type { CBlock } from './types'
import { BANDS, HARM, LIMITS, MAP_NAME, OPEN, pitchName, STRING_NAMES } from './voicing'
import s from './Chords.module.css'

// ───────────── Chapter 1: the map ─────────────

const ROOT = 36 // C2 at E‑8
const TOP = 48 // C3 at G‑5: the note you hold, for the map backwards

/**
 * The interval map, computed from Law 1. Every cell is 5 × strings + frets; click it to hear it.
 * `down` runs it backwards: from the note you hold, how far below each place is. Read a cell as
 * "if my note is the ♭7, the root is here".
 */
function MapBlock({ down = false }: { down?: boolean }) {
  const P = useClip<string>()
  const [pick, setPick] = useState<[number, number] | null>(down ? [2, 0] : [3, 1])
  // fret moves, in the order a player reads them across the neck
  const offs = down ? [2, 1, 0, -1, -2, -3] : [-2, -1, 0, 1, 2, 3]
  const ivOf = (su: number, f: number) => (down ? 5 * su - f : 5 * su + f)
  const hear = (su: number, f: number) => {
    setPick([su, f])
    const iv = ivOf(su, f)
    const notes = down
      ? [{ t: 0, midi: TOP, dur: 2.6 }, { t: 1, midi: TOP - iv, dur: 1.6 }]
      : [{ t: 0, midi: ROOT, dur: 2.6 }, { t: 1, midi: ROOT + iv, dur: 1.6 }]
    P.once([{ notes, cues: [{ t: 0, v: `${su},${f}` }], beats: 3 }], 90)
  }
  const name = (iv: number) => (iv === 12 ? 'octave' : iv === 15 ? '♭3 (minor 10th)' : iv === 16 ? '3 (major 10th)' : MAP_NAME[((iv % 12) + 12) % 12])
  const fw = (f: number) => (f === 0 ? 'same fret' : `${f > 0 ? '+' : '−'}${Math.abs(f)} fret${Math.abs(f) > 1 ? 's' : ''}`)
  const words = (f: number) => (f === 0 ? 'at the same fret' : `and ${Math.abs(f)} fret${Math.abs(f) > 1 ? 's' : ''} ${f > 0 ? 'forward' : 'back'}`)
  return (
    <figure className={s.tableFig}>
      <div className={s.tableWrap}>
        <table className={cx(s.table, s.mapTable)}>
          <thead>
            <tr>
              <th>{down ? 'Strings down' : 'Strings up'}</th>
              {offs.map((f) => (
                <th key={f}>{fw(f)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((su) => (
              <tr key={su}>
                <th>{su}</th>
                {offs.map((f) => {
                  const iv = ivOf(su, f)
                  const on = pick?.[0] === su && pick?.[1] === f
                  return (
                    <td key={f}>
                      <button
                        type="button"
                        className={cx(s.mapCell, on && s.mapOn)}
                        onClick={() => hear(su, f)}
                        title={down ? `${5 * su} ${f > 0 ? '−' : '+'} ${Math.abs(f)} = ${iv} semitones below` : `${5 * su} ${f >= 0 ? '+' : '−'} ${Math.abs(f)} = ${iv} semitones`}
                      >
                        {name(iv)}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pick && (
        <>
          <div className={s.mapBoard}>
            {down ? (
              <Fretboard
                strings={5}
                from={1}
                to={9}
                allNumbers
                dots={[
                  { str: 4, fret: 5, label: name(ivOf(pick[0], pick[1])).split(' ')[0], pen: 'pen-green' },
                  { str: 4 - pick[0], fret: 5 + pick[1], label: 'R', root: true, active: P.playing },
                ]}
              />
            ) : (
              <Fretboard
                strings={5}
                from={5}
                to={12}
                allNumbers
                dots={[
                  { str: 1, fret: 8, label: 'R', root: true },
                  { str: 1 + pick[0], fret: 8 + pick[1], label: name(ivOf(pick[0], pick[1])).split(' ')[0], pen: 'pen-green', active: P.playing },
                ]}
              />
            )}
          </div>
          <p className={s.caption}>
            {down ? (
              <>
                From your note, C at G‑5: {pick[0]} string{pick[0] > 1 ? 's' : ''} down {words(pick[1])} is 5 × {pick[0]}{pick[1] === 0 ? '' : ` ${pick[1] > 0 ? '−' : '+'} ${Math.abs(pick[1])}`} ={' '}
                <b>{ivOf(pick[0], pick[1])} semitones below</b>. So if your note is the {name(ivOf(pick[0], pick[1]))}, the root is there. Click any cell to hear your note, then the
                root.
              </>
            ) : (
              <>
                From C at E‑8: {pick[0]} string{pick[0] > 1 ? 's' : ''} up {words(pick[1])} is 5 × {pick[0]}{pick[1] === 0 ? '' : ` ${pick[1] > 0 ? '+' : '−'} ${Math.abs(pick[1])}`} ={' '}
                <b>{ivOf(pick[0], pick[1])} semitones</b>: the {name(ivOf(pick[0], pick[1]))}. Click any cell to hear it.
              </>
            )}
          </p>
        </>
      )}
    </figure>
  )
}

// ───────────── Chapter 1: clear zones ─────────────

const ZONES: [string, number[]][] = [
  ['2nds', [1, 2]],
  ['3rds', [3, 4]],
  ['4ths', [5]],
  ['5ths', [7]],
  ['6ths and 7ths', [8, 9, 10, 11]],
]

/** The clear zones: each interval's lowest clear pitch, converted to frets (fret = limit − open string). */
function ZonesBlock() {
  const cell = (limit: number, str: number) => {
    const f = limit - OPEN[str]
    return f < 0 ? 'anywhere' : f > 20 ? '–' : `fret ${f}`
  }
  return (
    <figure className={s.tableFig}>
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Interval between neighbours</th>
              <th>Lowest clear pitch</th>
              {STRING_NAMES.map((n) => (
                <th key={n}>{n} string</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ZONES.map(([label, ivs]) => {
              const limit = Math.min(...ivs.map((i) => LIMITS[i]))
              return (
                <tr key={label}>
                  <th>{label}</th>
                  <td>{pitchName(limit)}</td>
                  {STRING_NAMES.map((_, i) => (
                    <td key={i}>{cell(limit, i)}</td>
                  ))}
                </tr>
              )
            })}
            <tr>
              <th>tritone, 10ths, wider than an octave</th>
              <td colSpan={6}>anywhere</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.caption}>
        <CText text="Computed: the lower note of the pair should be at or above this fret. For 2nds the major 2nd's limit is shown (a minor 2nd needs one more fret), for 3rds the major 3rd's (a minor 3rd needs one more). Treat them as warnings, not walls ([[Law2]])." />
      </p>
    </figure>
  )
}

// ───────────── Chapter 1: registers ─────────────

/** The neck shaded by register: each band is a range of pitch, so it runs diagonally across the strings. */
function RegistersBlock() {
  const [lefty] = useLefty()
  // one stretch per string and region: bass, chord, chord-and-melody (the overlap), melody
  const regions: [string, number, number][] = [
    ['band-bass', BANDS.bass[0], BANDS.chord[0] - 1],
    ['band-chord', BANDS.chord[0], BANDS.melody[0] - 1],
    ['band-both', BANDS.melody[0], BANDS.chord[1]],
    ['band-melody', BANDS.chord[1] + 1, BANDS.melody[1]],
  ]
  const bands: FretBand[] = []
  regions.forEach(([cls, lo, hi]) =>
    OPEN.forEach((o, str) => {
      const from = Math.max(1, lo - o)
      const to = Math.min(20, hi - o)
      if (to >= from) bands.push({ str, from, to, cls })
    }),
  )
  return (
    <figure className={s.tableFig}>
      <div className={s.wide}>
        <Fretboard strings={5} from={0} to={20} dots={[]} bands={bands} lefty={lefty} allNumbers />
      </div>
      <ul className={s.penKey}>
        <li>
          <span className={cx(s.sw, s.swBass)} /> bass band, B0–F2: roots
        </li>
        <li>
          <span className={cx(s.sw, s.swChord)} /> chord band, F2–A3: 3rds, 7ths, colours
        </li>
        <li>
          <span className={cx(s.sw, s.swBoth)} /> both chord and melody, E3–A3
        </li>
        <li>
          <span className={cx(s.sw, s.swMelody)} /> melody band, E3 up: the top voice
        </li>
      </ul>
      <p className={s.caption}>
        <CText text="Computed from the pitch limits: fret = limit − open string. The same pitch sits five frets higher on each lower string ([[Law1]]), so every band is a diagonal. The bands overlap a little at the edges, as on a piano." />
      </p>
    </figure>
  )
}

// ───────────── Chapter 22: harmonics ─────────────

function HarmonicsBlock() {
  const P = useClip<string>()
  const hear = (str: number, f: number) =>
    P.once([{ notes: [{ t: 0, midi: OPEN[str] + HARM[f], dur: 3, harm: true }], cues: [{ t: 0, v: `${str}-${f}` }], beats: 3 }], 80)
  const frets = [12, 7, 5, 4]
  const what: Record<number, string> = { 12: 'one octave up', 7: 'an octave and a fifth up', 5: 'two octaves up', 4: 'two octaves and a major 3rd (a little flat)' }
  return (
    <figure className={s.tableFig}>
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Touch over fret</th>
              <th>Sounds</th>
              {STRING_NAMES.map((n) => (
                <th key={n}>{n}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {frets.map((f) => (
              <tr key={f}>
                <th>{f}</th>
                <td>{what[f]}</td>
                {OPEN.map((o, str) => (
                  <td key={str}>
                    <button type="button" className={cx(s.mapCell, P.cue === `${str}-${f}` && s.mapOn)} onClick={() => hear(str, f)}>
                      {pitchName(o + HARM[f])}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={s.caption}>Computed from the open strings. Click a note to hear the harmonic.</p>
    </figure>
  )
}

// ───────────── patterns ─────────────

/** One shape in several plucking patterns: the beat grid, and a loop to hear it. */
function PatternsBlock({ chord, shape, ids, caption }: { chord: string; shape: string; ids: PatternId[]; caption?: string }) {
  const [id, setId] = useState<PatternId>(ids[0])
  const P = useClip<number>()
  const [lefty] = useLefty()
  const I = info(chord, shape)
  const idRef = useRef(id)
  idRef.current = id
  const play = () =>
    P.live(
      (i) => {
        const p = PATTERNS[idRef.current]
        const { notes, at } = patternNotes([{ s: I, index: 0 }], p, i % p.bars, true)
        return { notes, beats: 4, drums: null, cues: Array.from({ length: 8 }, (_, k) => ({ t: at(k), v: (i % p.bars) * 8 + k })) }
      },
      () => (PATTERNS[idRef.current].feel === 'ballad' ? 66 : 92),
    )
  const p = PATTERNS[id]
  return (
    <figure className={s.patterns}>
      <figcaption className={s.shapesHead}>
        <span className={s.shapesTitle}>
          {chord} <code>{shape}</code>
        </span>
        <Button size="sm" variant={P.playing ? 'ink' : 'default'} onClick={P.playing ? P.stop : play}>
          {P.playing ? '■ Stop' : '▶ Loop it'}
        </Button>
      </figcaption>
      <Segmented label="Pattern" value={id} options={ids.map((x) => ({ value: x, label: PATTERNS[x].name }))} onChange={setId} />
      <div className={s.patRow}>
        <div className={s.patShape}>
          <ChordShape shape={shape} labels={degsOf(I)} pens={pensOf(I)} roots={rootsOf(I)} lefty={lefty} />
          {I.thumb == null && <span className={s.pencil}>no root in the grip: the thumb plays it on a lower string</span>}
        </div>
        <div className={s.patGrid}>
          <p className={s.patHow}>
            <b>{p.name}:</b> {p.how} <span className={s.pencil}>Piano: {p.piano}.</span>
          </p>
          <BeatGrid rows={patternRows(p)} at={P.cue} />
        </div>
      </div>
      {caption && (
        <p className={s.caption}>
          <CText text={caption} />
        </p>
      )}
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
        <CText text={c.q} />
      </span>
      {open ? (
        <div className={s.answer}>
          <b>
            <CText text={c.a} />
          </b>
          <span className={s.whyLine}>
            Why: <CText text={c.why} />
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

export function BlockView({ b }: { b: CBlock }) {
  switch (b.t) {
    case 'p':
      return (
        <p className={s.para}>
          <CText text={b.text} />
        </p>
      )
    case 'h':
      return (
        <h4 className={s.h}>
          <CText text={b.text} />
        </h4>
      )
    case 'list':
      return <FactList items={b.items.map((x, i) => <CText key={i} text={x} />)} />
    case 'steps':
      return (
        <ol className={s.steps}>
          {b.items.map((x, i) => (
            <li key={i}>
              <CText text={x} />
            </li>
          ))}
        </ol>
      )
    case 'tip':
      return (
        <StickyNote title={<CText text={b.title} />}>
          <CText text={b.text} />
        </StickyNote>
      )
    case 'big':
      return (
        <p className={s.big}>
          <CText text={b.text} />
        </p>
      )
    case 'table':
      return (
        <figure className={s.tableFig}>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  {b.head.map((h, i) => (
                    <th key={i}>
                      <CText text={h} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((x, j) => (
                      <td key={j}>
                        <CText text={x} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {b.caption && (
            <p className={s.caption}>
              <CText text={b.caption} />
            </p>
          )}
        </figure>
      )
    case 'shapes':
      return <ShapesBlock {...b} />
    case 'map':
      return <MapBlock down={b.down} />
    case 'zones':
      return <ZonesBlock />
    case 'registers':
      return <RegistersBlock />
    case 'harmonics':
      return <HarmonicsBlock />
    case 'patterns':
      return <PatternsBlock chord={b.chord} shape={b.shape} ids={b.ids} caption={b.caption} />
    case 'along':
      return <Along title={b.title} bars={b.bars} pattern={b.pattern} tempo={b.tempo} walk={b.walk} caption={b.caption} />
  }
}

/** Blocks with the pen key shown once, before the first diagram. */
export function Blocks({ blocks }: { blocks: CBlock[] }) {
  const first = blocks.findIndex((b) => b.t === 'shapes' || b.t === 'along' || b.t === 'patterns')
  return (
    <div className={s.blocks}>
      {blocks.map((b, i) => (
        <div key={i} className={s.blockSlot}>
          {i === first && <PenKey />}
          <BlockView b={b} />
        </div>
      ))}
    </div>
  )
}

export type { ShapeInfo }
