import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import type { Highlight } from '../../audio/player'
import { Staff } from '../../notation/Staff'
import { useAppState } from '../../state/AppState'
import { KEYS, load, store } from '../../state/storage'
import {
  Button,
  Checkbox,
  Disclosure,
  FactList,
  Field,
  FieldGrid,
  Kbd,
  Lead,
  Notebook,
  PageTitle,
  Paper,
  Row,
  Section,
  SectionTitle,
  Select,
  Slider,
  StickyNote,
  UnitLabel,
} from '../../ui'
import { useOfferTempo } from '../metronome/MetronomeTempo'
import { NotebookHeader } from '../shell/NotebookHeader'
import { generateIdea } from './generator'
import { keyName, progressionById, PROGRESSIONS } from './harmony'
import { LayerCard } from './LayerCard'
import type { Feel, Mode } from './model'
import { NoteMargin } from './NoteMargin'
import { newSeed, readParams, writeParams, type IdeaParams } from './params'
import { IdeaPlayer } from './player'
import { RoleLegend } from './RoleLegend'
import { ideaToScore } from './score'
import s from './IdeaBuilderPage.module.css'

interface SoundPrefs {
  drums: boolean
  chords: boolean
  loop: boolean
  octUp: boolean
}
const DEFAULT_SOUND: SoundPrefs = { drums: true, chords: true, loop: true, octUp: false }
const NO_HL: Highlight = { events: [], chords: [] }

const pretty = (k: string) => k.replace(/^([A-G])b/, '$1♭').replace(/^([A-G])#/, '$1♯')
const FEELS: { value: Feel; label: string }[] = [
  { value: 'straight', label: 'Straight 8ths' },
  { value: 'funk', label: 'Funk 16ths' },
  { value: 'swing', label: 'Swing' },
]

/** /ideas — build a bass line one layer of thinking at a time. */
export function IdeaBuilderPage() {
  const [sp, setSp] = useSearchParams()
  const { settings } = useAppState()
  const five = settings.strings === '5'
  const P = useMemo(() => readParams(sp), [sp])
  const update = useCallback((patch: Partial<IdeaParams>) => setSp(writeParams({ ...P, ...patch }), { replace: true }), [P, setSp])

  // a first visit gets its own seed, so the URL always names the idea
  useEffect(() => {
    if (!sp.has('seed')) setSp(writeParams({ ...P, seed: newSeed() }), { replace: true })
    else store(KEYS.ideasLast, sp.toString())
  }, [sp, P, setSp])

  const genKey = JSON.stringify({ ...P, tempo: 0, five })
  const idea = useMemo(() => generateIdea({ ...P, five }), [genKey])
  const map = useMemo(() => ideaToScore(idea, five, P.feel === 'swing'), [idea, five, P.feel])
  const P_ = progressionById(P.prog)
  useOfferTempo(P.tempo)

  // sound
  const [sound, setSound] = useState<SoundPrefs>(() => ({ ...DEFAULT_SOUND, ...load(KEYS.ideasPlay, {}) }))
  useEffect(() => store(KEYS.ideasPlay, sound), [sound])
  const [hl, setHl] = useState<Highlight>(NO_HL)
  const [playing, setPlaying] = useState(false)
  const player = useRef<IdeaPlayer | null>(null)
  useEffect(() => {
    const p = new IdeaPlayer(setHl, setPlaying)
    player.current = p
    return () => p.stop()
  }, [])
  const start = useCallback(
    () => player.current?.play(idea, map, { ...sound, tempo: P.tempo, feel: P.feel }),
    [idea, map, sound, P.tempo, P.feel],
  )
  // while playing, any change is heard straight away
  useEffect(() => {
    if (player.current?.playing) start()
  }, [start])
  const toggle = useCallback(() => (player.current?.playing ? player.current.stop() : start()), [start])
  const fresh = useCallback(() => update({ seed: newSeed() }), [update])

  // the note whose story is shown in the margin
  const [picked, setPicked] = useState<number | null>(null)
  useEffect(() => setPicked(null), [idea])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (/^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(t.tagName) || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.code === 'Space') {
        e.preventDefault()
        toggle()
      } else if (e.key === 'n' || e.key === 'N') fresh()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle, fresh])

  const keyOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i),
    label: `${pretty(keyName(i, P_.minor)).replace(/m$/, '')} ${P_.minor ? 'minor' : 'major'}`,
  }))

  return (
    <Notebook>
      <NotebookHeader section="Idea Builder" aside={<span className={s.seed}>idea #{P.seed}</span>} />
      <main>
        <Section>
          <UnitLabel>Section II · a lab, not a lesson</UnitLabel>
          <PageTitle>Idea Builder</PageTitle>
          <Lead>
            Start with the bare mode, then add the way bass players actually think, one layer at a time. The idea keeps
            its seed, so you hear exactly what each layer adds.
          </Lead>
        </Section>

        <div className={s.grid}>
          <aside className={s.side}>
            <LayerCard layers={P.layers} onChange={(layers) => update({ layers })} />
          </aside>

          <div className={s.work}>
            <FieldGrid>
              <Field label="Progression">
                <Select
                  value={P.prog}
                  options={PROGRESSIONS.map((p) => ({ value: p.id, label: p.name }))}
                  onChange={(prog) => update({ prog })}
                />
              </Field>
              <Field label="Key">
                <Select value={String(P.key)} options={keyOptions} onChange={(v) => update({ key: +v })} />
              </Field>
              <Field label="Times through">
                <Select
                  value={String(P.times)}
                  options={[1, 2, 3].map((n) => ({ value: String(n), label: `${n}× (${n * P_.rn.length} bars)` }))}
                  onChange={(v) => update({ times: +v })}
                />
              </Field>
              <Field label="What to play">
                <Select
                  value={P.mode}
                  options={[
                    { value: 'solo', label: 'Solo line' },
                    { value: 'fills', label: 'Groove + fills' },
                  ]}
                  onChange={(v) => update({ mode: v as Mode })}
                />
              </Field>
              <Field label="Feel">
                <Select value={P.feel} options={FEELS} onChange={(v) => update({ feel: v as Feel })} />
              </Field>
              {P.mode === 'fills' && (
                <>
                  <Field label="Fill every">
                    <Select
                      value={String(P.fillEvery)}
                      options={[1, 2, 4].map((n) => ({ value: String(n), label: `${n} bar${n > 1 ? 's' : ''}` }))}
                      onChange={(v) => update({ fillEvery: +v })}
                    />
                  </Field>
                  <Field label="Fill length">
                    <Select
                      value={String(P.fillBeats)}
                      options={[
                        { value: '1', label: '1 beat' },
                        { value: '2', label: '2 beats' },
                        { value: '4', label: '1 bar' },
                      ]}
                      onChange={(v) => update({ fillBeats: +v })}
                    />
                  </Field>
                </>
              )}
            </FieldGrid>

            <Row className={s.transport}>
              <Button variant="ink" onClick={toggle} aria-pressed={playing}>
                {playing ? '■ Stop' : '▶ Play'}
              </Button>
              <Button onClick={fresh}>New idea</Button>
              <label className={s.slider}>
                <span>
                  ♩ = <b>{P.tempo}</b>
                </span>
                <Slider min={50} max={200} value={P.tempo} onChange={(tempo) => update({ tempo })} aria-label="Tempo" />
              </label>
              <label className={s.slider}>
                <span>
                  busy <b>{Math.round(P.busy * 100)}%</b>
                </span>
                <Slider
                  min={10}
                  max={90}
                  value={Math.round(P.busy * 100)}
                  onChange={(v) => update({ busy: v / 100 })}
                  aria-label="Busyness"
                />
              </label>
            </Row>

            <Paper tape tilt="left" label={`${P_.name} · ${pretty(keyName(P.key, P_.minor))}`}>
              <Staff
                score={map.score}
                flags={{ tab: true, syms: true, nStr: five ? 5 : 4, noFinal: false }}
                highlight={hl}
                picked={picked != null ? map.eventsOf[picked] : undefined}
                onNoteClick={(e) => {
                  const ni = map.noteOf[e]
                  if (ni != null && ni >= 0) setPicked(ni)
                }}
              />
            </Paper>
            <RoleLegend notes={idea.notes} />
            <NoteMargin idea={idea} index={picked} />

            <Section>
              <SectionTitle>What the player was thinking</SectionTitle>
              {P.layers.targets ? (
                <FactList items={idea.log.map((l) => l.text)} />
              ) : (
                <p className={s.empty}>
                  Layer 1 only: every note is a random pick from the mode. No targets, no phrasing, no idea to develop.
                  This is “knowing the modes” without the thinking. Add the next layer.
                </p>
              )}
            </Section>

            <Section>
              <StickyNote title="Practice loop">
                Listen to a layer, play along, then turn the drums off and play the line yourself. Steal phrases you
                like and move them to other keys. <Kbd>Space</Kbd> plays, <Kbd>N</Kbd> gives a new idea.
              </StickyNote>
            </Section>

            <Disclosure summary="Sound">
              <div className={s.checks}>
                <Checkbox label="Drums" checked={sound.drums} onChange={(drums) => setSound({ ...sound, drums })} />
                <Checkbox label="Chords" checked={sound.chords} onChange={(chords) => setSound({ ...sound, chords })} />
                <Checkbox label="Loop" checked={sound.loop} onChange={(loop) => setSound({ ...sound, loop })} />
                <Checkbox
                  label="Bass an octave up (laptop speakers)"
                  checked={sound.octUp}
                  onChange={(octUp) => setSound({ ...sound, octUp })}
                />
              </div>
            </Disclosure>
          </div>
        </div>
      </main>
    </Notebook>
  )
}
