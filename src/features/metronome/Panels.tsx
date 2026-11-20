import { useState, type ReactNode } from 'react'
import { Button, Checkbox, cx, Segmented, Slider, Stepper } from '../../ui'
import { fmtTime, GROOVES, SUBS, TONES, type Accent } from './engine'
import { useMetronome } from './useMetronome'
import { Dial } from './Dial'
import s from './Metronome.module.css'

/** One line of a panel: a pencil label on the left, the control on the right. */
const Line = ({ label, children, note }: { label: ReactNode; children?: ReactNode; note?: ReactNode }) => (
  <div className={s.line}>
    <span className={s.lineLabel}>{label}</span>
    <span className={s.lineCtl}>{children}</span>
    {note && <span className={s.lineNote}>{note}</span>}
  </div>
)
const Cap = ({ children }: { children: ReactNode }) => <div className={s.cap}>{children}</div>
const Desc = ({ children }: { children: ReactNode }) => <p className={s.desc}>{children}</p>
const Card = ({ children }: { children: ReactNode }) => <div className={s.card}>{children}</div>
const Vol = ({ label, value, max = 1, onChange }: { label: string; value: number; max?: number; onChange: (v: number) => void }) => (
  <Line label={label}>
    <Slider min={0} max={max} step={0.01} value={value} onChange={onChange} aria-label={label} />
  </Line>
)

export function PlayPanel({ onRhythm, onStage }: { onRhythm: () => void; onStage: () => void }) {
  const { S, m } = useMetronome()
  return (
    <>
      <Dial />
      <div className={s.quick}>
        <Button onClick={onRhythm} title="Time signature and accents">
          {S.beats}/{S.note}
        </Button>
        <Button onClick={onStage} title="Big beat number, full screen">
          Stage
        </Button>
        <Button variant="ink" onClick={() => m.tap('bpm')} title="Tap the beat">
          Tap
        </Button>
      </div>
      <Vol label="Volume" value={S.vol} onChange={(v) => m.set('vol', v)} />
    </>
  )
}

const LBL: Record<Accent, string> = { 3: 'acc', 2: 'sub', 1: '', 0: '×' }

export function RhythmPanel() {
  const { S, m } = useMetronome()
  return (
    <>
      <Card>
        <div className={s.tsRow}>
          <Line label="Beats">
            <Stepper label="Beats per bar" value={S.beats} onStep={(d) => m.step('beats', d)} />
          </Line>
          <span className={s.tsBig} aria-label={`${S.beats}/${S.note}`}>
            <span>{S.beats}</span>
            <span>{S.note}</span>
          </span>
          <Line label="Note">
            <Stepper label="Beat note value" value={S.note} onStep={(d) => m.step('note', d)} />
          </Line>
        </div>
        <Cap>Accents — tap: accent → sub-accent → normal → mute</Cap>
        <div className={s.accRow}>
          {S.accents.map((a, i) => (
            <button key={i} type="button" className={cx(s.accBtn, a === 0 && s.mute)} onClick={() => m.cycleAccent(i)} aria-label={`Beat ${i + 1}`}>
              <em>{LBL[a]}</em>
              <i style={{ height: `${{ 3: 80, 2: 53, 1: 26, 0: 0 }[a]}%` }} />
              <small>{i + 1}</small>
            </button>
          ))}
        </div>
        <Cap>Subdivision</Cap>
        <div className={s.subGrid}>
          {SUBS.map((x, i) => (
            <button key={x.n} type="button" className={cx(s.subBtn, i === S.sub && s.on)} onClick={() => m.set('sub', i)} aria-pressed={i === S.sub}>
              <b>{x.s}</b>
              <small>{x.n}</small>
            </button>
          ))}
        </div>
        <Vol label="Subdivision volume" value={S.subVol} onChange={(v) => m.set('subVol', v)} />
      </Card>
      <Card>
        <Checkbox label="Polyrhythm" checked={S.poly} onChange={(v) => m.set('poly', v)} />
        {S.poly && (
          <>
            <Line label="Clicks per bar" note={`against ${S.beats}`}>
              <Stepper label="Polyrhythm clicks" value={S.polyN} onStep={(d) => m.step('polyN', d)} />
            </Line>
            <Vol label="Poly volume" value={S.polyVol} onChange={(v) => m.set('polyVol', v)} />
            <Desc>A second, higher click spread evenly across the bar (e.g. 3 against 4).</Desc>
          </>
        )}
      </Card>
    </>
  )
}

export function DrumsPanel() {
  const { S, m } = useMetronome()
  return (
    <Card>
      <Checkbox label="Drums" checked={S.drums} onChange={(v) => m.set('drums', v)} />
      <Checkbox label="Click with the drums" checked={S.clickWithDrums} onChange={(v) => m.set('clickWithDrums', v)} />
      <Vol label="Drum volume" max={1.5} value={S.drumVol} onChange={(v) => m.set('drumVol', v)} />
      <Cap>Groove</Cap>
      <div className={s.grooves}>
        {GROOVES.map((g, i) => (
          <button key={g.n} type="button" className={cx(s.subBtn, S.drums && i === S.drumPat && s.on)} onClick={() => m.pickGroove(i)}>
            {g.n}
          </button>
        ))}
      </div>
      <Cap>Fill</Cap>
      <Segmented
        label="Fill"
        value={S.fill}
        onChange={(v) => m.set('fill', v)}
        options={[
          { value: 0, label: 'Off' },
          { value: 2, label: 'Every 2' },
          { value: 4, label: 'Every 4' },
          { value: 8, label: 'Every 8' },
        ]}
      />
      <Desc>The drums follow the tempo trainer, wait for the count-in and rest in gap-trainer bars. Shuffle and Jazz swing have a triplet feel.</Desc>
    </Card>
  )
}

export function PracticePanel() {
  const { S, live, m } = useMetronome()
  const a = m.approxSec()
  return (
    <>
      <Card>
        <Cap>Practice mode</Cap>
        <Segmented
          label="Practice mode"
          value={S.mode}
          onChange={(v) => m.set('mode', v)}
          options={[
            { value: 'off', label: 'Off' },
            { value: 'automator', label: 'Speed up' },
            { value: 'warmup', label: 'Up & down' },
          ]}
        />
        <Desc>
          {S.mode === 'automator'
            ? 'Starts at the start tempo and steps towards the target, then stays there.'
            : S.mode === 'warmup'
              ? 'Goes from start to target and back down again, in a loop.'
              : 'A plain metronome at the tempo on the wheel.'}
        </Desc>
        {S.mode !== 'off' && (
          <>
            <Segmented
              label="Change tempo"
              value={S.autoBy}
              onChange={(v) => m.set('autoBy', v)}
              options={[
                { value: 'bar', label: 'By bars' },
                { value: 'time', label: 'By time' },
              ]}
            />
            {S.autoBy === 'bar' ? (
              <Line label="Every" note="bars">
                <Stepper label="Bars per change" value={S.every} onStep={(d) => m.step('every', d)} />
              </Line>
            ) : (
              <Line label="Every">
                <Stepper label="Time per change" value={fmtTime(S.everySec)} onStep={(d) => m.step('everySec', d)} />
              </Line>
            )}
            <Line label="Change by" note="bpm">
              <Stepper label="Tempo step" value={S.inc} onStep={(d) => m.step('inc', d)} />
            </Line>
            <Line label="Start tempo" note={<Button size="sm" onClick={() => m.tap('start')}>tap</Button>}>
              <Stepper label="Start tempo" value={S.start} onStep={(d) => m.step('start', d)} />
            </Line>
            <Line label="Target tempo" note={<Button size="sm" onClick={() => m.tap('target')}>tap</Button>}>
              <Stepper label="Target tempo" value={S.target} onStep={(d) => m.step('target', d)} />
            </Line>
            <p className={s.approx}>
              {S.start === S.target
                ? 'Start and target are the same.'
                : S.mode === 'warmup'
                  ? `About ${fmtTime(a * 2)} per round trip.`
                  : `About ${fmtTime(a)} to reach ${S.target} bpm.`}
            </p>
            <Checkbox label="Flash when the tempo changes" checked={S.flashTempo} onChange={(v) => m.set('flashTempo', v)} />
          </>
        )}
      </Card>
      <Card>
        <Checkbox label="Gap trainer (silent bars)" checked={S.gap} onChange={(v) => m.set('gap', v)} />
        {S.gap && (
          <>
            <Line label="Play" note="bars">
              <Stepper label="Bars with click" value={S.gapPlay} onStep={(d) => m.step('gapPlay', d)} />
            </Line>
            <Line label="Silent" note="bars">
              <Stepper label="Silent bars" value={S.gapMute} onStep={(d) => m.step('gapMute', d)} />
            </Line>
            <Desc>The click drops out for the silent bars. Keep the pulse yourself and check that you land on “1” when it comes back.</Desc>
          </>
        )}
      </Card>
      <Card>
        <Line label="Count-in" note="bars">
          <Stepper label="Count-in bars" value={S.countIn} onStep={(d) => m.step('countIn', d)} />
        </Line>
      </Card>
      <Button variant="ink" className={s.wide} onClick={() => m.toggle()}>
        {live.playing ? '■ Stop' : '▶ Start'}
      </Button>
    </>
  )
}

export function SetlistPanel() {
  const { S, m } = useMetronome()
  const [name, setName] = useState('')
  return (
    <>
      <Card>
        <Cap>Save the current settings</Cap>
        <form
          className={s.saveRow}
          onSubmit={(e) => {
            e.preventDefault()
            m.savePreset(name)
            setName('')
          }}
        >
          <input className={s.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Major scale, 16ths" maxLength={40} aria-label="Preset name" />
          <Button type="submit" size="sm">
            Save
          </Button>
        </form>
      </Card>
      <Card>
        {!S.setlist.length ? (
          <Desc>No saved presets yet.</Desc>
        ) : (
          <ol className={s.setlist}>
            {S.setlist.map((p, i) => (
              <li key={i}>
                <span className={s.setName}>
                  <b>{p.name}</b>
                  <small>
                    {p.bpm} bpm · {p.beats}/{p.note} · {SUBS[p.sub]?.n}
                    {p.poly ? ` · poly ${p.polyN}` : ''}
                    {p.drums ? ` · ${GROOVES[p.drumPat ?? 0]?.n}` : ''}
                  </small>
                </span>
                <Button size="sm" onClick={() => m.loadPreset(i)}>
                  Load
                </Button>
                <Button icon size="sm" variant="ghost" title="Delete" onClick={() => m.deletePreset(i)}>
                  ×
                </Button>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </>
  )
}

export function SettingsPanel() {
  const { S, m } = useMetronome()
  const [armed, setArmed] = useState(false)
  return (
    <>
      <Card>
        <Line label="Sound" note={<Button size="sm" icon title="Hear it" onClick={() => m.preview()}>▶</Button>}>
          <Stepper label="Click sound" value={TONES[S.tone]} onStep={(d) => m.step('tone', d)} />
        </Line>
        <Vol label="Volume" value={S.vol} onChange={(v) => m.set('vol', v)} />
        <Checkbox label="Vibrate (Android)" checked={S.vibrate} onChange={(v) => m.set('vibrate', v)} />
        <Checkbox label="Flash the screen on beats" checked={S.flash} onChange={(v) => m.set('flash', v)} />
        <Checkbox label="Keep the screen awake while playing" checked={S.wake} onChange={(v) => m.set('wake', v)} />
      </Card>
      <Card>
        <Cap>Show</Cap>
        <Segmented
          label="Visual"
          value={S.visual}
          onChange={(v) => m.set('visual', v)}
          options={[
            { value: 'both', label: 'Both' },
            { value: 'blocks', label: 'Beats' },
            { value: 'pendulum', label: 'Pendulum' },
            { value: 'off', label: 'Neither' },
          ]}
        />
        <Checkbox label="Bar counter" checked={S.barCounter} onChange={(v) => m.set('barCounter', v)} />
      </Card>
      <Card>
        <Cap>Tempo means</Cap>
        <Segmented
          label="Tempo calculation"
          value={S.tempoCalc}
          onChange={(v) => m.set('tempoCalc', v)}
          options={[
            { value: 'bpm', label: 'Beats / min' },
            { value: 'qpm', label: 'Quarter notes / min' },
          ]}
        />
        <Desc>Only matters when the beat is not a quarter note (6/8, 7/8 …).</Desc>
      </Card>
      <Button
        variant="pencil"
        className={s.wide}
        onClick={() => {
          if (!armed) return setArmed(true)
          m.reset()
          setArmed(false)
        }}
        onBlur={() => setArmed(false)}
      >
        {armed ? 'Click again to reset everything (setlist is kept)' : 'Reset all settings'}
      </Button>
    </>
  )
}
