import { useMemo, useState } from 'react'
import { Fretboard, type FretDot } from '../../notation/Fretboard'
import { fingerings } from '../../theory/fingering'
import { Button, Field, FieldGrid, PencilNote, Row, Segmented } from '../../ui'
import { CText } from './CText'
import { useFingers } from './fingers'
import { useClip } from './sound'
import { MAP_NAME, OPEN, pitchName, STRING_NAMES } from './voicing'
import s from './Chords.module.css'

type Kind = 'up' | 'down' | 'reach'
type Mode = Kind | 'mixed'
type Level = 'basic' | 'all'

/** Degree name → half steps above the root, at the height its name asks for. */
const BASIC: [string, number][] = [['♭3', 3], ['3', 4], ['4', 5], ['5', 7], ['6', 9], ['♭7', 10], ['7', 11], ['octave', 12]]
const HIGH: [string, number][] = [['♭9', 13], ['9', 14], ['10 (the 3 an octave up)', 16], ['11', 17], ['♯11', 18], ['♭13', 20], ['13', 21]]

interface Spot {
  str: number
  fret: number
}
interface Question {
  kind: Kind
  /** The note shown: the root (up, reach) or the note you hold (down). */
  start: Spot
  deg: string
  iv: number
  /** The pitch to find. */
  target: number
}

const rnd = (n: number) => Math.floor(Math.random() * n)
const pick = <T,>(xs: readonly T[]): T => xs[rnd(xs.length)]
const midi = (p: Spot) => OPEN[p.str] + p.fret
const name = (p: Spot) => `${STRING_NAMES[p.str]}‑${p.fret}`
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`

/** The move from one place to another, in the words of Law 1, with its arithmetic. */
function moveWords(a: Spot, b: Spot) {
  const su = b.str - a.str
  const df = b.fret - a.fret
  const semis = 5 * su + df
  const strings = su === 0 ? 'the same string' : `${plural(Math.abs(su), 'string')} ${su > 0 ? 'up' : 'down'}`
  const frets = df === 0 ? 'same fret' : `${plural(Math.abs(df), 'fret')} ${df > 0 ? 'forward' : 'back'}`
  const sum =
    su === 0
      ? `${df >= 0 ? '+' : '−'}${Math.abs(df)}`
      : `${su > 0 ? '' : '−'}5 × ${Math.abs(su)}${df === 0 ? '' : ` ${df > 0 ? '+' : '−'} ${Math.abs(df)}`}`
  return { su, df, semis, text: `${strings}, ${frets}`, sum: `${sum} = ${semis}` }
}

/** What an interval of n half steps is called (up to two octaves). */
const intervalName = (n: number) => {
  const a = Math.abs(n)
  if (a === 0) return 'the same note'
  if (a === 12) return 'an octave'
  if (a === 24) return 'two octaves'
  return `the ${MAP_NAME[a % 12]}${a > 12 ? ' an octave up' : ''}`
}

/** Every place on the neck (frets 1–20) that sounds a pitch. */
const placesOf = (m: number): Spot[] => OPEN.map((o, str) => ({ str, fret: m - o })).filter((p) => p.fret >= 1 && p.fret <= 20)

function make(mode: Mode, level: Level, hand: 'average' | 'large'): Question {
  const inReach = (a: Spot, b: Spot) => (a.str === b.str ? Math.abs(a.fret - b.fret) <= 4 : fingerings([a, b], hand).length > 0)
  for (let tries = 0; tries < 300; tries++) {
    const kind: Kind = mode === 'mixed' ? pick(['up', 'up', 'down', 'down', 'reach'] as const) : mode
    const degs = kind === 'reach' ? HIGH : level === 'basic' ? BASIC : [...BASIC, ...HIGH]
    const [deg, iv] = pick(degs)
    if (kind === 'down') {
      if (deg === 'octave') continue
      const start = { str: 2 + rnd(3), fret: 5 + rnd(8) }
      const target = midi(start) - iv
      if (!placesOf(target).some((p) => p.str < start.str && inReach(start, p))) continue
      return { kind, start, deg, iv, target }
    }
    const start = { str: rnd(3), fret: 5 + rnd(7) }
    const target = midi(start) + iv
    const reachable = placesOf(target).some((p) => p.str > start.str && inReach(start, p))
    if (kind === 'up' && !reachable) continue
    if (kind === 'reach' && (reachable || !placesOf(target - 12).some((p) => p.str >= start.str && inReach(start, p)))) continue
    return { kind, start, deg, iv, target }
  }
  return { kind: 'up', start: { str: 1, fret: 8 }, deg: '♭7', iv: 10, target: 46 }
}

type Verdict = { ok: boolean; title: string; text: string }

/**
 * Law 1, answered on the neck. A starting note is shown; you click where the asked note is, then check.
 * The feedback names what you actually picked, with the arithmetic, so a wrong answer teaches too.
 */
export function LawOneDrill() {
  const F = useFingers()
  const P = useClip<number>()
  const [mode, setMode] = useState<Mode>('mixed')
  const [level, setLevel] = useState<Level>('basic')
  const [q, setQ] = useState<Question>(() => make('mixed', 'basic', 'average'))
  const [picked, setPicked] = useState<Spot | null>(null)
  const [checked, setChecked] = useState(false)
  const [hints, setHints] = useState(0)
  const [score, setScore] = useState({ right: 0, total: 0 })

  const inReach = (a: Spot, b: Spot) => (a.str === b.str ? Math.abs(a.fret - b.fret) <= 4 : fingerings([a, b], F.hand).length > 0)
  const next = (m = mode, l = level) => {
    setQ(make(m, l, F.hand))
    setPicked(null)
    setChecked(false)
    setHints(0)
  }
  const hear = (a: Spot, b?: Spot) =>
    P.once([{ notes: [{ t: 0, midi: midi(a), dur: 2.4 }, ...(b ? [{ t: 0.9, midi: midi(b), dur: 1.5 }] : [])], cues: [{ t: 0, v: 1 }], beats: 2.6 }], 96)

  const down = q.kind === 'down'
  const short = q.deg.split(' ')[0]
  // the places that answer the question: the asked pitch within reach; for an out-of-reach case, the octave below
  const exact = useMemo(() => placesOf(q.target).filter((p) => (down ? p.str < q.start.str : p.str >= q.start.str) && !(p.str === q.start.str && p.fret === q.start.fret)), [q, down])
  const good = exact.filter((p) => inReach(q.start, p)).sort((a, b) => Math.abs(a.fret - q.start.fret) - Math.abs(b.fret - q.start.fret))
  const lower = q.kind === 'reach' ? placesOf(q.target - 12).filter((p) => p.str >= q.start.str && inReach(q.start, p) && midi(p) !== midi(q.start)) : []
  const answers = q.kind === 'reach' ? lower : good
  const best = answers.slice().sort((a, b) => Math.abs(a.fret - q.start.fret) - Math.abs(b.fret - q.start.fret))[0]

  const verdict: Verdict | null = useMemo(() => {
    if (!checked || !picked) return null
    const mv = moveWords(q.start, picked)
    const pm = midi(picked)
    const you = `You picked ${name(picked)}: ${mv.text}. That is ${mv.sum} half steps: ${down ? (mv.semis < 0 ? `${intervalName(mv.semis)} below your note` : 'not below your note at all') : mv.semis > 0 ? `${intervalName(mv.semis)}` : 'not above the root at all'}.`
    if (answers.some((p) => p.str === picked.str && p.fret === picked.fret))
      return {
        ok: true,
        title: 'Right.',
        text: q.kind === 'reach' ? `${you} The ${short} itself is out of reach from this root, so you took an octave off: the same note, 12 half steps lower. That is fix 2.` : `${you}`,
      }
    if (pm === q.target)
      return {
        ok: false,
        title: 'The right note, in the wrong place.',
        text: `${you} It is the note asked for, but ${plural(Math.abs(mv.df), 'fret')} away from your ${down ? 'finger' : 'root'}: one hand cannot hold both. Look for the same note on another string.`,
      }
    if ((pm - q.target) % 12 === 0)
      return {
        ok: false,
        title: 'The right note name, an octave off.',
        text: `${you} The question asks for the ${short} at ${q.iv} half steps, and yours is ${Math.abs(pm - q.target) / 12 === 1 ? 'one octave' : 'two octaves'} ${pm > q.target ? 'higher' : 'lower'}. An octave is 2 strings and 2 frets.`,
      }
    return { ok: false, title: 'Not yet.', text: you }
  }, [checked, picked, q, answers, down, short])

  const check = () => {
    if (!picked || checked) return
    setChecked(true)
    const ok = answers.some((p) => p.str === picked.str && p.fret === picked.fret)
    setScore((sc) => ({ right: sc.right + (ok ? 1 : 0), total: sc.total + 1 }))
    hear(q.start, picked)
  }

  // the reasoning, step by step
  const reasoning = useMemo(() => {
    const out: string[] = []
    if (q.kind === 'reach') {
      const top = exact.slice().sort((a, b) => Math.abs(a.fret - q.start.fret) - Math.abs(b.fret - q.start.fret))[0]
      const above = 4 - q.start.str
      out.push(`The ${short} is **${q.iv} half steps** above the root.`)
      out.push(
        `The root is on the ${STRING_NAMES[q.start.str]} string, with ${plural(above, 'string')} above it: at most 5 × ${above} = ${5 * above}. That leaves ${q.iv - 5 * above} frets${top ? ` (${name(top)})` : ''}: out of reach.`,
      )
      if (best) {
        const mv = moveWords(q.start, best)
        out.push(`**Take an octave off** (2 strings and 2 frets): ${q.iv} − 12 = ${q.iv - 12}. Split it: ${mv.sum.replace(/ = .*/, '')} = ${q.iv - 12}, so ${mv.text}: **${name(best)}**. Same note, an octave lower.`)
      }
      if (q.start.str > 0) {
        const r2 = { str: q.start.str - 1, fret: q.start.fret + 5 }
        const t2 = placesOf(q.target).find((p) => p.str > r2.str && Math.abs(p.fret - r2.fret) <= 3)
        if (r2.fret <= 17 && t2) out.push(`Or **buy a string**: the same root is at ${name(r2)}, and from there the ${short} is ${moveWords(r2, t2).text} (${name(t2)}).`)
      }
      return out
    }
    if (down) {
      out.push(`Your note is the ${short}, so the root is **${q.iv} half steps below** it.`)
      if (best) {
        const mv = moveWords(q.start, best)
        const sd = -mv.su
        out.push(`Going down, each string takes 5 away and each fret forward gives 1 back: ${q.iv} = 5 × ${sd}${mv.df === 0 ? '' : ` ${mv.df > 0 ? '−' : '+'} ${Math.abs(mv.df)}`}.`)
        out.push(`So the root is ${mv.text}: **${name(best)}** (${pitchName(midi(best))}).`)
      }
    } else {
      out.push(`The ${short} is **${q.iv} half steps** above the root (the table of degrees: ${q.iv > 12 ? `${q.iv - 12} + 12 for the octave` : `count the major scale${short.startsWith('♭') ? ', one less for the ♭' : ''}`}).`)
      if (best) {
        const mv = moveWords(q.start, best)
        out.push(`Split it into fives and ones: ${q.iv} = ${mv.sum.replace(/ = .*/, '')}.`)
        out.push(`So it is ${mv.text}: **${name(best)}** (${pitchName(midi(best))}).`)
      }
    }
    const others = answers.filter((p) => p !== best)
    if (others.length) out.push(`Also within reach: ${others.map((p) => `${name(p)} (${moveWords(q.start, p).text})`).join(', ')}.`)
    return out
  }, [q, best, answers, exact, down, short])

  const lo = Math.max(1, q.start.fret - 4)
  const hi = Math.min(20, q.start.fret + 6)
  const dots: FretDot[] = [down ? { ...q.start, label: short, pen: 'pen-green' } : { ...q.start, label: 'R', root: true }]
  if (checked) {
    for (const p of answers) if (!(picked && p.str === picked.str && p.fret === picked.fret)) dots.push({ ...p, label: down ? 'R' : short === 'octave' ? '8' : q.kind === 'reach' ? MAP_NAME[(q.iv - 12) % 12].split(' ')[0] : short, pen: 'pen-green', root: down })
    if (picked) dots.push({ ...picked, label: verdict?.ok ? (down ? 'R' : '✓') : '✗', pen: verdict?.ok ? 'pen-green' : 'pen-red', root: !!verdict?.ok && down })
  } else if (picked) dots.push({ ...picked, label: '?', pen: 'pen-blue' })

  const ask = down
    ? `Your finger is on **${name(q.start)}**, and that note is the **${short}** of a chord. Click where the **root** is, below it.`
    : q.kind === 'reach'
      ? `The root is at **${name(q.start)}**. You want the **${short}**. Click a place one hand can hold together with the root.`
      : `The root is at **${name(q.start)}**. Click where the **${q.deg}** is, within reach of the root.`

  return (
    <figure className={s.drill}>
      <FieldGrid>
        <Field label="Direction">
          <Segmented
            label="Direction"
            value={mode}
            options={[
              { value: 'mixed', label: 'mixed' },
              { value: 'up', label: 'up from the root' },
              { value: 'down', label: 'down to the root' },
              { value: 'reach', label: 'out of reach' },
            ]}
            onChange={(m) => (setMode(m), next(m, level))}
          />
        </Field>
        <Field label="Degrees">
          <Segmented
            label="Degrees"
            value={level}
            options={[
              { value: 'basic', label: 'inside the octave' },
              { value: 'all', label: 'with 9, 11, 13' },
            ]}
            onChange={(l) => (setLevel(l), next(mode, l))}
          />
        </Field>
      </FieldGrid>
      <p className={s.prompt}>
        <CText text={ask} />
      </p>
      <div className={s.drillNeck}>
        <Fretboard strings={5} from={lo} to={hi} allNumbers dots={dots} onPick={checked ? undefined : (str, fret) => (setPicked({ str, fret }), hear(q.start, { str, fret }))} />
      </div>
      {!checked && hints > 0 && (
        <PencilNote>
          <CText
            text={
              hints === 1
                ? down
                  ? `Hint 1: the ${short} is ${q.iv} half steps above the root, so the root is ${q.iv} half steps **below** your note.`
                  : `Hint 1: the ${short} is ${q.iv} half steps above the root.`
                : q.kind === 'reach'
                  ? `Hint 2: there are only ${plural(4 - q.start.str, 'string')} above this root, worth ${5 * (4 - q.start.str)}. Too many frets are left. An octave off is 12 less: ${q.iv - 12} half steps. Split that into fives and ones.`
                  : `Hint 2: split ${q.iv} into fives (strings) and ones (frets). ${q.iv} is close to ${5 * Math.round(q.iv / 5)}, which is ${plural(Math.round(q.iv / 5), 'string')}${down ? ' down' : ' up'}.`
            }
          />
        </PencilNote>
      )}
      {!checked ? (
        <Row>
          <Button variant="ink" disabled={!picked} onClick={check}>
            Check my answer
          </Button>
          <Button variant="pencil" disabled={hints >= 2} onClick={() => setHints(hints + 1)}>
            {hints === 0 ? 'A hint' : 'One more hint'}
          </Button>
          <Button variant="pencil" onClick={() => hear(q.start)}>
            ▶ Hear the note
          </Button>
          <span className={s.pencil}>
            <CText text={picked ? `your answer: ${name(picked)} (click another place to change it)` : 'click a place on the neck'} />
          </span>
        </Row>
      ) : (
        <>
          <div className={verdict?.ok ? s.drillRight : s.drillWrong}>
            <b>{verdict?.title}</b> <CText text={verdict?.text ?? ''} />
          </div>
          <div className={s.drillWhy}>
            <b>The reasoning</b>
            <ol>
              {reasoning.map((r, i) => (
                <li key={i}>
                  <CText text={r} />
                </li>
              ))}
            </ol>
          </div>
          <Row>
            <Button variant="ink" onClick={() => next()}>
              Next one →
            </Button>
            {best && (
              <Button variant="pencil" onClick={() => hear(q.start, best)}>
                ▶ Hear the answer
              </Button>
            )}
            <span className={s.pencil}>
              {score.right} right out of {score.total}
            </span>
          </Row>
        </>
      )}
    </figure>
  )
}
