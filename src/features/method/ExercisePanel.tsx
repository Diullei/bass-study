import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ScorePlayer, type Highlight } from '../../audio/player'
import type { Lesson } from '../../curriculum/types'
import { exerciseKind, generate } from '../../engine'
import { Staff } from '../../notation/Staff'
import { useAppState } from '../../state/AppState'
import { exerciseFlags } from '../../state/settings'
import { Button, Kbd, Paper, PencilNote, PenMessage, Row, SectionTitle, Slider, Tally } from '../../ui'
import styles from './ExercisePanel.module.css'

const TITLES = { song: 'Play the song', chart: 'Chart reading', study: 'Study', reading: 'Sight-reading' }

export interface ExercisePanelProps {
  lesson: Lesson
  tempo: number
  onTempo: (t: number) => void
  message: string
  onMessage: (m: string) => void
}

/** The exercise: play it back, change tempo, get a new one, log clean run-throughs. */
export function ExercisePanel({ lesson: L, tempo, onTempo, message, onMessage }: ExercisePanelProps) {
  const { settings: S, progressOf, addClean } = useAppState()
  const target = L.tempo || 70
  const [nonce, setNonce] = useState(0)
  const score = useMemo(
    () => generate(L, { strings: S.strings, bars: S.bars }),
    // nonce = "new exercise"
    [L, S.strings, S.bars, nonce],
  )
  const [playing, setPlaying] = useState(false)
  const [highlight, setHighlight] = useState<Highlight>({ events: [], chords: [] })
  const player = useRef<ScorePlayer | null>(null)
  if (!player.current) player.current = new ScorePlayer(setHighlight, setPlaying)
  useEffect(() => () => player.current?.stop(), [])

  const playOpts = {
    tempo,
    bass: S.sndBass,
    chords: S.sndChords,
    guide: S.sndGuide,
    click: S.sndClick,
    countIn: S.countIn,
    loop: S.loop,
  }
  const optsRef = useRef(playOpts)
  optsRef.current = playOpts

  const play = useCallback(() => {
    if (score) player.current?.play(score, optsRef.current)
  }, [score])
  const stop = useCallback(() => player.current?.stop(), [])
  const toggle = useCallback(() => (player.current?.playing ? stop() : play()), [play, stop])
  const newExercise = useCallback(() => {
    stop()
    setNonce((n) => n + 1)
    onMessage('')
  }, [stop, onMessage])

  // a new score stops playback
  useEffect(() => stop, [score, stop])

  // tempo changes restart playback at the new tempo
  const firstTempo = useRef(true)
  useEffect(() => {
    if (firstTempo.current) {
      firstTempo.current = false
      return
    }
    if (player.current?.playing) play()
  }, [tempo, play])

  // Space = play/stop, N = new exercise
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/INPUT|SELECT|TEXTAREA|BUTTON/.test((e.target as HTMLElement).tagName)) return
      if (e.code === 'Space') {
        e.preventDefault()
        toggle()
      } else if (e.key === 'n' || e.key === 'N') newExercise()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [toggle, newExercise])

  if (!score) return null
  const kind = exerciseKind(L)
  const p = progressOf(L)

  const onClean = () => {
    if (S.needTempo && tempo < target) {
      if (!L.song) newExercise()
      onMessage(`Nice — but this one doesn't count yet: bring the tempo up to ${target}.`)
      return
    }
    const nowMastered = addClean(L)
    if (!L.song) newExercise()
    onMessage(nowMastered ? 'Lesson mastered! On to the next one.' : L.song ? 'Counted.' : 'Counted. Here is a fresh one.')
  }

  return (
    <>
      <SectionTitle>{TITLES[kind]}</SectionTitle>
      <Row>
        <Button variant="ink" onClick={toggle} aria-pressed={playing}>
          {playing ? '■ Stop' : '▶ Play'}
        </Button>
        <label className={styles.tempo}>
          ♩ =
          <Slider min={40} max={220} step={2} value={tempo} onChange={onTempo} aria-label="Tempo" />
          <span className={styles.bpm}>{tempo}</span>
          <span>(target {target})</span>
        </label>
        <Button variant="pencil" onClick={newExercise} title="N">
          {L.song ? 'Restart' : 'New exercise'}
        </Button>
        <Button onClick={onClean}>✓ I played it clean</Button>
      </Row>
      <PencilNote>
        <span className={styles.status}>
          Clean run-throughs: <Tally count={Math.min(p.clean, S.cleanNeeded)} total={S.cleanNeeded} />
          <b>
            {Math.min(p.clean, S.cleanNeeded)}/{S.cleanNeeded}
          </b>
          {L.song ? `at ♩=${target} or faster` : `· each one on a fresh exercise at ♩=${target} or faster`}
          <span>
            · <Kbd>Space</Kbd> play · <Kbd>N</Kbd> new
          </span>
        </span>
      </PencilNote>
      <PenMessage>{message}</PenMessage>
      <Paper className={styles.sheet} tilt="right">
        <Staff score={score} flags={exerciseFlags(L, S)} highlight={highlight} />
      </Paper>
    </>
  )
}
