import { useEffect, useRef, useState } from 'react'
import { cx } from '../../ui'
import { GROOVES, metronome, SUBS, tempoName, type Accent } from './engine'
import { useMetronome } from './useMetronome'
import s from './Metronome.module.css'

const FILL: Record<Accent, number> = { 3: 100, 2: 66, 1: 33, 0: 0 }

/** The metronome's "screen", written on paper: tempo, metre, the beats of the bar, a pendulum. */
export function Display() {
  const { S, live, m } = useMetronome()
  const showBlocks = S.visual === 'both' || S.visual === 'blocks'
  const showPend = S.visual === 'both' || S.visual === 'pendulum'
  const info = !live.playing
    ? 'Ready'
    : live.counting
      ? `Count-in ${live.countLeft}`
      : S.barCounter
        ? `Bar ${live.bar + 1} · ${(live.beat ?? 0) + 1}`
        : String((live.beat ?? 0) + 1)
  return (
    <div className={s.display}>
      <div className={s.readout}>
        <div>
          <span className={s.bigBpm}>{S.bpm}</span>
          <span className={s.unit}>bpm</span>
          <div className={s.tname}>{tempoName(S.bpm)}</div>
        </div>
        <div className={s.meter} title="Time signature">
          <span>{S.beats}</span>
          <span>{S.note}</span>
        </div>
        <div className={s.subd} title={SUBS[S.sub].n}>
          <span className={s.subSym}>{SUBS[S.sub].s}</span>
          {S.drums && <span className={s.groove}>{GROOVES[S.drumPat]?.n}</span>}
        </div>
      </div>
      {showBlocks && (
        <div className={s.beats}>
          {S.accents.map((a, i) => (
            <button
              key={i}
              type="button"
              className={cx(s.blk, live.beat === i && !live.muted && s.cur, live.beat === i && live.lvl === 3 && s.curAcc, a === 0 && s.mute)}
              onClick={() => m.cycleAccent(i)}
              title="Tap: accent → sub-accent → normal → mute"
              aria-label={`Beat ${i + 1}: ${['muted', 'normal', 'sub-accent', 'accent'][a]}`}
            >
              <i style={{ height: `${FILL[a]}%` }} />
            </button>
          ))}
        </div>
      )}
      {showPend && <Pendulum />}
      {S.poly && (
        <div className={s.poly} aria-label={`${S.polyN} against ${S.beats}`}>
          {Array.from({ length: S.polyN }, (_, i) => (
            <b key={i} className={live.polyIdx === i ? s.polyOn : undefined} />
          ))}
        </div>
      )}
      <div className={s.info}>
        <span>{info}</span>
        <span className={s.status}>{live.status}</span>
        <Clock />
      </div>
    </div>
  )
}

/** A dot swinging along a ruled line, in time. */
function Pendulum() {
  const dot = useRef<HTMLElement>(null)
  useEffect(() => {
    let raf = 0
    const go = () => {
      if (dot.current) dot.current.style.left = `${metronome.pendulum() * 94}%`
      raf = requestAnimationFrame(go)
    }
    raf = requestAnimationFrame(go)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div className={s.pend} aria-hidden>
      <i ref={dot} />
    </div>
  )
}

function Clock() {
  const fmt = () => {
    const d = new Date()
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }
  const [t, setT] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 5000)
    return () => clearInterval(id)
  }, [])
  return <span className={s.clock}>{t}</span>
}
