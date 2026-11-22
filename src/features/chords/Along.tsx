import { useMemo, useRef, useState } from 'react'
import { ShapeMove } from '../../notation/ShapeMove'
import { ChordShape } from '../../notation/ChordShape'
import { BeatGrid, Button, Checkbox, Field, FieldGrid, Select, Slider, cx, type BeatGridRow } from '../../ui'
import { CText } from './CText'
import { useFingers } from './fingers'
import { PATTERN_LIST, PATTERNS, type Pattern, type PatternId } from './patterns'
import { useLefty } from './progress'
import { alongBar, info, midiOfName, parseBars, type PatCue, type ShapeInfo } from './render'
import { degsOf, pensOf, Progression, rootsOf } from './Shapes'
import { useClip } from './sound'
import s from './Chords.module.css'

/** The beat grid of a pattern: one row for the thumb, one for the fingers. */
export function patternRows(p: Pattern): BeatGridRow[] {
  const n = p.bars * 8
  const T: (string | null)[] = Array(n).fill(null)
  const F: (string | null)[] = Array(n).fill(null)
  const acc: number[] = []
  for (const h of p.hits) {
    const w = h.who
    if (w === 'T') T[h.at] = 'R'
    else if (w === 'T5') T[h.at] = '5'
    else if (w === 'all') (T[h.at] = 'R'), (F[h.at] = '●')
    else if (w === 'roll') (T[h.at] = 'R'), (F[h.at] = 'roll')
    else if (w === 'F') F[h.at] = '●'
    else F[h.at] = ['i', 'm', 'r'][w]
    if (h.acc) acc.push(h.at)
  }
  return [
    { label: 'fingers', cells: F, accents: acc },
    { label: 'thumb', cells: T },
  ]
}

/**
 * Play-along: a loop with drums, the roots (as if from a looper) and the shapes in a comping pattern.
 * Switch your part off to play the shapes yourself; switch the roots off to hear the shapes alone.
 */
export function Along({ title, bars: barsText, pattern = 'split', tempo = 90, walk, caption, noProg }: { title: string; bars: string; pattern?: PatternId; tempo?: number; walk?: string; caption?: string; noProg?: boolean }) {
  const bars = useMemo(() => parseBars(barsText), [barsText])
  const W = useMemo(() => (walk ? walk.split('|').map((b) => b.trim().split(/\s+/).map(midiOfName)) : undefined), [walk])
  const flat = useMemo(() => bars.flat().map((c) => info(c.sym, c.shape)), [bars])
  const [pat, setPat] = useState<PatternId>(pattern)
  const [bpm, setBpm] = useState(tempo)
  const [drums, setDrums] = useState(true)
  const [roots, setRoots] = useState(true)
  const [part, setPart] = useState(true)
  const opts = useRef({ pat, bpm, drums, roots, part })
  opts.current = { pat, bpm, drums, roots, part }
  const P = useClip<PatCue>()
  const [lefty] = useLefty()
  const F = useFingers()
  // the loop's fingering, chosen as a round trip (the last chord leads back to the first)
  const loopF = useMemo(() => F.seq(flat, true), [F, flat])
  const start = () =>
    P.live(
      (i) => {
        const o = opts.current
        return alongBar(bars, i, { pattern: o.pat, drums: o.drums, roots: o.roots, part: o.part, walk: W })
      },
      () => opts.current.bpm,
    )
  const cue = P.cue
  const cur = cue ? flat[cue.chord] : null
  const sfCur = cue ? loopF[cue.chord] : null
  const prev = cue ? flat[(cue.chord - 1 + flat.length) % flat.length] : null
  const p = PATTERNS[pat]
  let k = 0
  return (
    <figure className={s.along}>
      <figcaption className={s.shapesHead}>
        <span className={s.shapesTitle}>🎧 {title}</span>
        <Button size="sm" variant={P.playing ? 'ink' : 'default'} onClick={P.playing ? P.stop : start}>
          {P.playing ? '■ Stop' : '▶ Play along (loops)'}
        </Button>
      </figcaption>
      <div className={s.chart}>
        {bars.map((bar, bi) => (
          <div key={bi} className={cx(s.chartBar, cue?.bar === bi && s.chartBarOn)}>
            {bar.map((c) => {
              const idx = k++
              return (
                <span key={idx} className={cx(s.chartSym, cue?.chord === idx && s.chartSymOn)}>
                  {c.sym}
                </span>
              )
            })}
          </div>
        ))}
      </div>
      <FieldGrid>
        <Field label="Pattern">
          <Select value={pat} options={PATTERN_LIST.map((x) => ({ value: x.id, label: x.name }))} onChange={(v) => setPat(v as PatternId)} />
        </Field>
        <Field label={`Tempo ${bpm}`}>
          <Slider min={40} max={200} value={bpm} onChange={setBpm} />
        </Field>
        <Field label="The loop plays">
          <span className={s.toggles}>
            <Checkbox label="drums" checked={drums} onChange={setDrums} />
            <Checkbox label="roots" checked={roots} onChange={setRoots} />
            <Checkbox label="your part" checked={part} onChange={setPart} />
          </span>
        </Field>
      </FieldGrid>
      <p className={s.patHow}>
        <b>{p.name}:</b> {p.how} <span className={s.pencil}>({p.piano})</span>
      </p>
      <BeatGrid rows={patternRows(p)} at={cue ? cue.step : null} />
      {cur && (
        <div className={s.alongNow}>
          {prev && prev !== cur && flat.length > 1 ? (
            <ShapeMove from={{ shape: prev.shape }} to={{ shape: cur.shape, labels: degsOf(cur), pens: pensOf(cur), roots: rootsOf(cur), ...F.props(sfCur) }} lefty={lefty} />
          ) : (
            <ChordShape shape={cur.shape} labels={degsOf(cur)} pens={pensOf(cur)} roots={rootsOf(cur)} lefty={lefty} {...F.props(sfCur)} />
          )}
          <span className={s.alongSym}>
            {cur.sym} <code>{cur.shape}</code>
          </span>
        </div>
      )}
      {!cur && !noProg && uniqueSeq(flat).length > 1 && <Progression items={uniqueSeq(flat).map((I) => ({ I }))} at={null} />}
      {caption && (
        <p className={s.caption}>
          <CText text={caption} />
        </p>
      )}
    </figure>
  )
}

/** The chords of a loop without immediate repeats (a bar of F7 then F7 is one chord). */
function uniqueSeq(xs: ShapeInfo[]) {
  return xs.filter((x, i) => i === 0 || x !== xs[i - 1]).slice(0, 12)
}
