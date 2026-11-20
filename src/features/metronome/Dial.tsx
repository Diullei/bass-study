import { useRef, useState, type PointerEvent } from 'react'
import { cx, Stepper } from '../../ui'
import { useMetronome } from './useMetronome'
import s from './Metronome.module.css'

const TICKS = Array.from({ length: 48 }, (_, i) => i)

/** A hand-drawn tempo wheel: drag around it to change the tempo; the big button plays. */
export function Dial() {
  const { S, live, m } = useMetronome()
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef<{ a: number; acc: number } | null>(null)
  const [rot, setRot] = useState(0)
  const angle = (e: PointerEvent) => {
    const r = (ref.current as HTMLDivElement).getBoundingClientRect()
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI
  }
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { a: angle(e), acc: 0 }
  }
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const d0 = drag.current
    if (!d0) return
    const a = angle(e)
    let d = a - d0.a
    if (d > 180) d -= 360
    if (d < -180) d += 360
    d0.a = a
    d0.acc += d
    setRot((r) => r + d)
    const st = Math.trunc(d0.acc / 6)
    if (st) {
      d0.acc -= st * 6
      m.step('bpm', st)
    }
  }
  const up = () => (drag.current = null)
  return (
    <div className={s.dialWrap}>
      <Stepper value={S.bpm} label="Tempo" size="lg" onStep={(d) => m.step('bpm', d)} className={s.dialStepper} />
      <div ref={ref} className={s.dial} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <svg viewBox="0 0 200 200" className={s.ring} style={{ transform: `rotate(${rot}deg)` }} aria-hidden>
          <path className={s.ringLine} d="M100 8 C152 6 194 48 192 101 C190 152 150 193 99 192 C47 191 7 151 9 99 C11 48 50 9 100 8 Z" />
          {TICKS.map((i) => {
            const a = (i / TICKS.length) * Math.PI * 2
            const r1 = i % 4 === 0 ? 76 : 82
            return <line key={i} className={s.tickLine} x1={100 + Math.cos(a) * r1} y1={100 + Math.sin(a) * r1} x2={100 + Math.cos(a) * 88} y2={100 + Math.sin(a) * 88} />
          })}
        </svg>
        <button type="button" className={cx(s.play, live.playing && s.playing)} onClick={() => m.toggle()} aria-label={live.playing ? 'Stop' : 'Play'}>
          {live.playing ? '■' : '▶'}
        </button>
      </div>
      <p className={s.hint}>Drag around the wheel to change the tempo · ← → keys too</p>
    </div>
  )
}
