import { useRef, useState } from 'react'
import { Fretboard, type FretBand } from '../../notation/Fretboard'
import { BeatGrid, Button, FactList, Field, FieldGrid, Segmented, Select, StickyNote, cx } from '../../ui'
import { fingerings } from '../../theory/fingering'
import { handOf } from './fingers'
import { Along, patternRows } from './Along'
import { CText } from './CText'
import { LawOneDrill } from './LawOneDrill'
import { useFingers } from './fingers'
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

// ───────────── Law 1: the reach solver ─────────────

const REACH_ROOTS = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B']
/** Degree → semitones above the root, at the height its name asks for (a 13 is above the octave, a 6 below it). */
const REACH_DEGS: [string, number][] = [
  ['♭3', 3], ['3', 4], ['5', 7], ['6', 9], ['♭7', 10], ['7', 11], ['♭9', 13], ['9', 14], ['♭10 (♭3 up an octave)', 15], ['10 (3 up an octave)', 16], ['11', 17], ['♯11', 18], ['♭13', 20], ['13', 21],
]

interface Place {
  /** Root and target: string, fret. */
  rs: number
  rf: number
  ts: number
  tf: number
  su: number
  df: number
  iv: number
  /** 'ok' within three frets, 'stretch' four, 'far' more. */
  reach: 'ok' | 'stretch' | 'far'
}

function place(rs: number, rf: number, ts: number, iv: number, hand: 'average' | 'large'): Place | null {
  const tf = OPEN[rs] + rf + iv - OPEN[ts]
  if (tf < 0 || tf > 20) return null
  const df = tf - rf
  const fits = tf === 0 || fingerings([{ str: rs, fret: rf }, { str: ts, fret: tf }], hand).length > 0
  return { rs, rf, ts, tf, su: ts - rs, df, iv, reach: !fits ? 'far' : Math.abs(df) >= 4 ? 'stretch' : 'ok' }
}

/**
 * Law 1 when the first answer does not fit: from a root on a string, where can a degree go?
 * It tries the root where it is, the same root on the other strings, and the degree an octave lower,
 * and says which the hand can hold (measured by the fingering model).
 */
function ReachBlock({ root = 'C', string = 1, degree = '13' }: { root?: string; string?: number; degree?: string }) {
  const [r, setR] = useState(root)
  const [rs, setRs] = useState(string)
  const [deg, setDeg] = useState(degree)
  const F = useFingers()
  const P = useClip<string>()
  const pc = REACH_ROOTS.indexOf(r)
  const iv = REACH_DEGS.find((d) => d[0] === deg)?.[1] ?? 21
  // the root on the chosen string, between frets 1 and 12
  const fretOn = (s: number, midi: number) => midi - OPEN[s]
  let rf = (pc - (OPEN[rs] % 12) + 12) % 12
  if (rf === 0) rf = 12
  const rootMidi = OPEN[rs] + rf
  const say = (p: Place) => `${p.su} string${p.su > 1 ? 's' : ''} up, ${p.df === 0 ? 'same fret' : `${Math.abs(p.df)} fret${Math.abs(p.df) > 1 ? 's' : ''} ${p.df > 0 ? 'forward' : 'back'}`}`
  const math = (p: Place) => `5 × ${p.su}${p.df === 0 ? '' : ` ${p.df > 0 ? '+' : '−'} ${Math.abs(p.df)}`} = ${p.iv}`
  const allOn = (s: number, f: number, interval: number) =>
    [1, 2, 3, 4].map((su) => (s + su <= 4 ? place(s, f, s + su, interval, F.hand) : null)).filter((x): x is Place => !!x)
  // 1. from the root as it is
  const here = allOn(rs, rf, iv)
  const hereOk = here.filter((p) => p.reach !== 'far')
  // 2. the same root pitch on the other strings ("buy a string")
  const moved = [0, 1, 2]
    .filter((s) => s !== rs && fretOn(s, rootMidi) >= 1 && fretOn(s, rootMidi) <= 17)
    .flatMap((s) => allOn(s, fretOn(s, rootMidi), iv))
    .filter((p) => p.reach !== 'far')
  // 3. the degree an octave lower (the same note name)
  const lower = iv > 12 ? [...allOn(rs, rf, iv - 12), ...[0, 1, 2].filter((s) => s !== rs && fretOn(s, rootMidi) >= 1 && fretOn(s, rootMidi) <= 17).flatMap((s) => allOn(s, fretOn(s, rootMidi), iv - 12))].filter((p) => p.reach !== 'far') : []
  // easiest first
  const easy = (a: Place, b: Place) => Math.abs(a.df) - Math.abs(b.df)
  hereOk.sort(easy)
  moved.sort(easy)
  lower.sort(easy)
  const best = here.slice().sort((a, b) => Math.abs(a.df) - Math.abs(b.df))[0]
  const hear = (p: Place) =>
    P.once([{ notes: [{ t: 0, midi: OPEN[p.rs] + p.rf, dur: 2.6 }, { t: 1, midi: OPEN[p.ts] + p.tf, dur: 1.6 }], cues: [{ t: 0, v: `${p.rs}${p.rf}${p.ts}${p.tf}` }], beats: 3 }], 90)
  const Card = ({ p, label }: { p: Place; label: string }) => {
    const toks = ['x', 'x', 'x', 'x', 'x']
    toks[p.rs] = String(p.rf)
    toks[p.ts] = String(p.tf)
    const f = p.tf > 0 ? fingerings([{ str: p.rs, fret: p.rf }, { str: p.ts, fret: p.tf }], F.hand)[0] : null
    const fp = F.show && f ? { fingers: f.fingers, barres: f.barres, hand: handOf([p.rf, p.tf], f) } : {}
    return (
      <figure className={s.card}>
        <button type="button" className={s.cardHead} onClick={() => hear(p)}>
          <b className={s.cardSym}>
            {STRING_NAMES[p.rs]}‑{p.rf} → {STRING_NAMES[p.ts]}‑{p.tf}
          </b>
          <span className={s.cardPlay}>▶</span>
        </button>
        <ChordShape shape={toks.join('-')} labels={['R', label]} pens={[undefined, 'pen-green']} roots={[true]} {...fp} />
        <figcaption>
          <span className={s.notes}>
            {say(p)}: {math(p)}
          </span>
          {p.reach === 'stretch' && <span className={s.stretch}>a stretch</span>}
        </figcaption>
      </figure>
    )
  }
  const short = deg.split(' ')[0]
  const lowName = iv > 12 ? ({ 13: '♭2 (♭9)', 14: '2 (9)', 15: '♭3', 16: '3', 17: '4 (11)', 18: '♯4 (♯11)', 20: '♭6 (♭13)', 21: '6 (13)' } as Record<number, string>)[iv] : ''
  return (
    <figure className={s.shapes}>
      <FieldGrid>
        <Field label="Root">
          <Select value={r} options={REACH_ROOTS.map((x) => ({ value: x, label: x }))} onChange={setR} />
        </Field>
        <Field label="Root on the">
          <Segmented label="Root string" value={rs} options={[0, 1, 2].map((x) => ({ value: x, label: `${STRING_NAMES[x]} string` }))} onChange={setRs} />
        </Field>
        <Field label="You want the">
          <Select value={deg} options={REACH_DEGS.map(([d, n]) => ({ value: d, label: `${d} · ${n} semitones` }))} onChange={setDeg} />
        </Field>
      </FieldGrid>
      <p className={s.para}>
        The root {r} is at <b>{STRING_NAMES[rs]}‑{rf}</b>, with {4 - rs} string{4 - rs > 1 ? 's' : ''} above it. The {short} is <b>{iv} semitones</b> up.{' '}
        {hereOk.length > 0 ? (
          <>It fits as it is:</>
        ) : best ? (
          <>
            The most the strings give is 5 × {best.su} = {5 * best.su}, which leaves <b>{best.df > 0 ? '+' : '−'}{Math.abs(best.df)} frets</b> ({STRING_NAMES[best.ts]}‑{best.tf}): out of reach for one hand. Law 1 has three ways out.
          </>
        ) : (
          <>There is no string above the root that holds it. Law 1 has three ways out.</>
        )}
      </p>
      {hereOk.length > 0 && (
        <div className={s.cards}>
          {hereOk.map((p, i) => (
            <Card key={i} p={p} label={short} />
          ))}
        </div>
      )}
      {moved.length > 0 && (
        <>
          <h4 className={s.h}>{hereOk.length ? 'Also: ' : '1. '}buy a string: the same {r}, one string lower and five frets higher</h4>
          <p className={s.caption}>The root keeps its pitch, but now there is one more string above it, worth 5 semitones: five frets fewer to reach.</p>
          <div className={s.cards}>
            {moved.map((p, i) => (
              <Card key={i} p={p} label={short} />
            ))}
          </div>
        </>
      )}
      {lower.length > 0 && (
        <>
          <h4 className={s.h}>{hereOk.length ? 'Also: ' : '2. '}take an octave off: the {lowName} is the same note, 12 semitones lower</h4>
          <p className={s.caption}>An octave is 12 = 5 + 5 + 2: two strings and two frets. Taking it off turns {iv} into {iv - 12}. The colour is the same note; it only sits lower, so check it against the clear zones (Law 2).</p>
          <div className={s.cards}>
            {lower.map((p, i) => (
              <Card key={i} p={p} label={lowName.split(' ')[0]} />
            ))}
          </div>
        </>
      )}
      {hereOk.length === 0 && (
        <>
          <h4 className={s.h}>3. split it in time</h4>
          <p className={s.caption}>
            <CText text={`Play the root, let it ring, and move the hand to ${best ? `${STRING_NAMES[best.ts]}‑${best.tf}` : 'the note'}: the ear joins the two ([[Law5]]). Tapping the high note with the plucking hand works too, but it is a special effect, not a grip.`} />
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
  const F = useFingers()
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
          <ChordShape shape={shape} labels={degsOf(I)} pens={pensOf(I)} roots={rootsOf(I)} lefty={lefty} {...F.props(F.of(I))} />
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
    case 'reach':
      return <ReachBlock root={b.root} string={b.string} degree={b.degree} />
    case 'drill':
      return <LawOneDrill />
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
