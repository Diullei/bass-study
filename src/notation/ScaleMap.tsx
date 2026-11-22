import type { ScaleRole } from './ScaleStrip'
import s from './Scale.module.css'

export interface ScaleMapRow {
  /** The chord: "Dm7". */
  label: string
  /** The scale: "D Dorian". */
  sub: string
  /** Pitch class → what that note is over this chord. */
  cells: Record<number, { deg: string; role: ScaleRole; name: string }>
}

export interface ScaleMapProps {
  rows: ScaleMapRow[]
  /** Pitch class of the first column (the key's tonic). */
  origin: number
  /** The row sounding or chosen now. */
  at?: number | null
  onPick?: (i: number) => void
  className?: string
}

/**
 * The scales of a progression on one grid: a column per note, a row per chord. Each cell says what that note
 * is over that chord (its degree, in the pen of its job). Read across a row for the scale; read down a column
 * to see one note change its job from chord to chord. A note that was not in the scale of the chord before is
 * marked with the highlighter: those are the only notes that move.
 */
export function ScaleMap({ rows, origin, at, onPick, className }: ScaleMapProps) {
  const used = Array.from({ length: 12 }, (_, k) => (origin + k) % 12).filter((pc) => rows.some((r) => r.cells[pc]))
  const head = used.map((pc) => {
    const names = [...new Set(rows.map((r) => r.cells[pc]?.name).filter(Boolean))]
    return names.join('/')
  })
  return (
    <div className={`${s.map} ${className ?? ''}`} style={{ gridTemplateColumns: `minmax(64px, auto) repeat(${used.length}, minmax(24px, 1fr))` }} role="table" aria-label="The scale of each chord, note by note">
      <span className={s.mapCorner} />
      {head.map((h, i) => (
        <span key={i} className={`${s.mapHead} ${h.includes('/') ? s.mapHead2 : ''}`}>
          {h}
        </span>
      ))}
      {rows.map((r, i) => {
        const prev = i > 0 ? rows[i - 1].cells : null
        const Tag = onPick ? 'button' : 'span'
        return (
          <div key={i} className={`${s.mapRow} ${at === i ? s.mapRowOn : ''}`} role="row">
            <Tag className={s.mapLabel} {...(onPick ? { type: 'button' as const, onClick: () => onPick(i) } : {})}>
              <b>{r.label}</b>
              <small>{r.sub}</small>
            </Tag>
            {used.map((pc) => {
              const c = r.cells[pc]
              if (!c) return <span key={pc} className={`${s.mapCell} ${prev?.[pc] ? s.mapGone : ''}`} />
              return (
                <span key={pc} className={`${s.mapCell} ${prev && !prev[pc] ? s.mapNew : ''}`} title={`${c.name}: the ${c.deg} of ${r.label}`}>
                  <span className={`${s.pip} ${s[c.role]}`}>{c.deg}</span>
                </span>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
