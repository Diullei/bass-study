import { useEffect, useRef } from 'react'
import styles from './Fretboard.module.css'

export interface VoiceChord {
  /** Chord symbol over the column. */
  label: string
  /** Sounding pitches, low to high (MIDI). */
  midis: number[]
  /** Note names, low to high. */
  names: string[]
  /** Degrees, low to high (shown small under the names). */
  degs?: string[]
}

export interface VoiceLinesProps {
  chords: VoiceChord[]
  /** The column sounding now (red pen). */
  at?: number | null
  /** The column to keep in view when the drawing is wider than its box: it scrolls sideways to follow it. Default: `at`. */
  focus?: number | null
  /** Join the bottom voice too (off when it is the root line, which jumps by design). */
  bass?: boolean
  className?: string
}

/**
 * Voice leading drawn as lines: each voice of a progression, from chord to chord, at its pitch.
 * A flat line is a held note (a common tone), a short step marked ½ is a half-step pull, the top line is the melody.
 * Voices are paired from the top down, because the ear follows the top.
 */
export function VoiceLines({ chords, at = null, focus, bass = false, className }: VoiceLinesProps) {
  const svg = useRef<SVGSVGElement>(null)
  const seen = at ?? focus ?? null
  // a long progression is wider than its box: follow the column, sideways only (the page itself must not jump)
  useEffect(() => {
    const el = svg.current
    if (seen == null || !el || !chords.length) return
    let box = el.parentElement
    while (box && !(box.scrollWidth > box.clientWidth + 1 && /auto|scroll/.test(getComputedStyle(box).overflowX))) box = box.parentElement
    if (!box) return
    const r = el.getBoundingClientRect()
    const b = box.getBoundingClientRect()
    // the middle of the column, measured inside the scrolling box
    const mid = r.left - b.left + box.scrollLeft + ((seen + 0.5) / chords.length) * r.width
    const view = box.clientWidth
    // leave it alone while the column sits comfortably inside the view; otherwise bring it to a third from the left
    if (mid > box.scrollLeft + view * 0.2 && mid < box.scrollLeft + view * 0.75) return
    box.scrollTo({ left: Math.max(0, mid - view / 3), behavior: 'smooth' })
  }, [seen, chords.length])
  const all = chords.flatMap((c) => c.midis)
  if (!all.length) return null
  const lo = Math.min(...all)
  const hi = Math.max(...all)
  const colW = 92
  const left = 12
  const unit = 5.2
  const top = 34
  const H = top + (hi - lo) * unit + 40
  const W = left + chords.length * colW
  const x = (i: number) => left + i * colW + colW / 2
  const y = (m: number) => top + (hi - m) * unit
  const maxV = Math.max(...chords.map((c) => c.midis.length))
  // voice v counted from the top (0 = top voice)
  const voice = (c: VoiceChord, v: number) => (v < c.midis.length ? c.midis.length - 1 - v : -1)
  return (
    <svg ref={svg} className={`${styles.lines} ${className ?? ''}`} viewBox={`0 0 ${W} ${H}`} width={W * 1.15} role="img" aria-label="Voice leading">
      {chords.map((c, i) => (
        <g key={i} className={at === i ? styles.linesNow : undefined}>
          {at === i && <rect className={styles.linesCol} x={x(i) - colW / 2 + 4} y={2} width={colW - 8} height={H - 4} rx={8} />}
          <text className={styles.linesSym} x={x(i)} y={18} textAnchor="middle">
            {c.label}
          </text>
        </g>
      ))}
      {Array.from({ length: maxV }, (_, v) =>
        chords.slice(1).map((c, k) => {
          const p = chords[k]
          const a = voice(p, v)
          const b = voice(c, v)
          if (a < 0 || b < 0) return null
          if (!bass && v === maxV - 1 && maxV > 2 && a === 0 && b === 0) return null
          const d = c.midis[b] - p.midis[a]
          const cls = d === 0 ? styles.lineHeld : Math.abs(d) <= 2 ? styles.lineStep : styles.lineLeap
          const y1 = y(p.midis[a])
          const y2 = y(c.midis[b])
          return (
            <g key={`${v}-${k}`} className={`${cls} ${v === 0 ? styles.lineTop : ''}`}>
              <line x1={x(k) + 16} y1={y1} x2={x(k + 1) - 16} y2={y2} />
              {Math.abs(d) === 1 && (
                <text x={(x(k) + x(k + 1)) / 2} y={(y1 + y2) / 2 - 5} textAnchor="middle">
                  ½
                </text>
              )}
            </g>
          )
        }),
      )}
      {chords.map((c, i) =>
        c.midis.map((m, j) => (
          <g key={`${i}-${j}`} className={styles.linesNote}>
            <text x={x(i)} y={y(m) + 4} textAnchor="middle">
              {c.names[j]}
            </text>
            {c.degs?.[j] && (
              <text className={styles.linesDeg} x={x(i) + 15} y={y(m) + 4}>
                {c.degs[j]}
              </text>
            )}
          </g>
        )),
      )}
    </svg>
  )
}
