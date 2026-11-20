import { useCallback, useEffect, useMemo, useState } from 'react'
import { Staff } from '../../notation/Staff'
import { useAppState } from '../../state/AppState'
import { Button, Checkbox, Field, FieldGrid, Kbd, Paper, PencilNote, Row, Select, Slider } from '../../ui'
import { buildDrill, choicesOf, isProgression, pentLabel, rootLabel, type DrillSpec } from './drills'
import { Legend } from './Legend'
import { lineToScore } from './score'
import { BAND_FEELS } from '../../audio/band'
import { useOfferTempo } from '../metronome/MetronomeTempo'
import { useBacking, usePlayer, type Backing } from './usePlayer'
import s from './Pentatonics.module.css'

const newSeed = () => Math.floor(Math.random() * 1e6)

/** Things that come out the same every time: no "new" button. */
const fixedShape = (spec: DrillSpec) => spec.type === 'scale' || spec.type === 'sequence'

interface Props {
  drills: { name: string; spec: DrillSpec }[]
  root: number
  choice?: number
  tempo: number
  /** Space / N shortcuts (only one panel per page). */
  keys?: boolean
}

/** The practice of a lesson: a generated line in any key, playable, with a new one on demand. */
export function DrillPanel({ drills, root: root0, choice: choice0 = 0, tempo: tempo0, keys }: Props) {
  const { settings } = useAppState()
  const five = settings.strings === '5'
  const [di, setDi] = useState(0)
  const [root, setRoot] = useState(root0)
  const [choice, setChoice] = useState(choice0)
  const [seed, setSeed] = useState(newSeed)
  const [tempo, setTempo] = useState(tempo0)
  const spec = drills[Math.min(di, drills.length - 1)].spec
  const choices = choicesOf(spec)
  const line = useMemo(() => buildDrill(spec, { root, five, seed, choice }), [spec, root, five, seed, choice])
  const score = useMemo(() => lineToScore(line, five), [line, five])
  const { playing, highlight, play, stop } = usePlayer()
  const [backing, setBacking] = useBacking()
  // the page's main drill offers its tempo to the metronome
  useOfferTempo(keys ? tempo : null)
  const start = useCallback(() => play(score, { tempo, loop: true, backing }), [play, score, tempo, backing])
  const toggle = useCallback(() => (playing ? stop() : start()), [playing, stop, start])
  const fresh = useCallback(() => setSeed(newSeed()), [])

  // a change while playing is heard straight away
  useEffect(() => {
    if (playing) start()
  }, [score, tempo, backing])

  useEffect(() => {
    if (!keys) return
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (/^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(t.tagName) || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.code === 'Space') {
        e.preventDefault()
        toggle()
      } else if ((e.key === 'n' || e.key === 'N') && !fixedShape(spec)) fresh()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [keys, toggle, fresh, spec])

  return (
    <div className={s.drill}>
      <FieldGrid>
        {drills.length > 1 && (
          <Field label="Exercise">
            <Select value={String(di)} options={drills.map((d, i) => ({ value: String(i), label: d.name }))} onChange={(v) => setDi(+v)} />
          </Field>
        )}
        <Field label={isProgression(spec) ? 'Key' : 'Chord'}>
          <Select
            value={String(root)}
            options={Array.from({ length: 12 }, (_, i) => ({ value: String(i), label: rootLabel(spec, i) }))}
            onChange={(v) => setRoot(+v)}
          />
        </Field>
        {choices.length > 1 && (
          <Field label="Pentatonic">
            <Select
              value={String(Math.min(choice, choices.length - 1))}
              options={choices.map((r, i) => ({ value: String(i), label: pentLabel(spec, root, r) }))}
              onChange={(v) => setChoice(+v)}
            />
          </Field>
        )}
      </FieldGrid>
      <Row className={s.transport}>
        <Button variant="ink" onClick={toggle} aria-pressed={playing}>
          {playing ? '■ Stop' : '▶ Play'}
        </Button>
        {!fixedShape(spec) && <Button onClick={fresh}>New line</Button>}
        <Button variant="pencil" size="sm" onClick={() => setRoot(Math.floor(Math.random() * 12))}>
          Random key
        </Button>
        <label className={s.slider}>
          <span>
            ♩ = <b>{tempo}</b>
          </span>
          <Slider min={40} max={200} value={tempo} onChange={setTempo} aria-label="Tempo" />
        </label>
      </Row>
      <Paper tape tilt="left">
        <Staff score={score} flags={{ tab: true, syms: true, nStr: five ? 5 : 4 }} highlight={highlight} />
      </Paper>
      <Legend items={line.legend} />
      <BackingControls backing={backing} onChange={setBacking} />
      {keys && (
        <PencilNote>
          <Kbd>Space</Kbd> plays and stops{fixedShape(spec) ? '' : <>, <Kbd>N</Kbd> writes a new line</>}. It loops: play along, then play it alone.
        </PencilNote>
      )}
    </div>
  )
}

/** Click or band, and the line on or off (so you play it yourself over the band). */
export function BackingControls({ backing, onChange }: { backing: Backing; onChange: (b: Partial<Backing>) => void }) {
  return (
    <Row className={s.backing}>
      <label className={s.slider}>
        <span>Backing</span>
        <Select
          value={backing.band}
          options={[{ value: 'click', label: 'Click only' }, ...BAND_FEELS.map((f) => ({ value: f.value, label: `Band · ${f.label}` }))]}
          onChange={(v) => onChange({ band: v as Backing['band'] })}
        />
      </label>
      <Checkbox label="Play the written line (untick to play it yourself)" checked={backing.line} onChange={(line) => onChange({ line })} />
    </Row>
  )
}

/** A fixed example from the lesson text, with a play button. */
export function Example({ title, spec, root, seed, choice = 0, tempo }: { title: string; spec: DrillSpec; root: number; seed: number; choice?: number; tempo: number }) {
  const { settings } = useAppState()
  const five = settings.strings === '5'
  const line = useMemo(() => buildDrill(spec, { root, five, seed, choice }), [spec, root, five, seed, choice])
  const score = useMemo(() => lineToScore(line, five), [line, five])
  const { playing, highlight, play, stop } = usePlayer()
  const [backing] = useBacking()
  return (
    <figure className={s.example}>
      <figcaption>
        <Button size="sm" variant={playing ? 'ink' : 'default'} onClick={() => (playing ? stop() : play(score, { tempo, loop: false, backing: { ...backing, line: true } }))}>
          {playing ? '■' : '▶'}
        </Button>
        <span>{title}</span>
      </figcaption>
      <Paper tilt="right">
        <Staff score={score} flags={{ tab: true, syms: true, nStr: five ? 5 : 4 }} highlight={highlight} />
      </Paper>
      <Legend items={line.legend} />
    </figure>
  )
}
