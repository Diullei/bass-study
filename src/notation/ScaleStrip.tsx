import s from './Scale.module.css'

export type ScaleRole = 'root' | 'guide' | 'fifth' | 'colour' | 'pass'

export interface ScaleStripNote {
  name: string
  /** Degree over the chord: R, 9, ♭3 … */
  deg: string
  role: ScaleRole
  /** Half steps up to the next note. */
  step: number
}

export interface ScaleStripProps {
  notes: ScaleStripNote[]
  /** Index of the note sounding now (red pen). */
  active?: number | null
  className?: string
}

const STEP: Record<number, string> = { 1: '½', 2: '', 3: '1½' }

/**
 * A scale as a row of notes, root to root: the note over its degree in the chord, in the pen of its job
 * (root filled, 3rd and 7th green, 5th ink, colours blue, passing notes dashed pencil).
 * The gaps are to scale: a half step is a tight gap marked ½, a whole step is a wide one.
 */
export function ScaleStrip({ notes, active, className }: ScaleStripProps) {
  return (
    <span className={`${s.strip} ${className ?? ''}`} role="img" aria-label={`Scale: ${notes.map((n) => `${n.name} (${n.deg})`).join(', ')}`}>
      {notes.map((n, i) => (
        <span key={i} className={s.stripItem}>
          <span className={`${s.cell} ${s[n.role]} ${active === i ? s.on : ''}`}>
            <b>{n.name}</b>
            <i>{n.deg}</i>
          </span>
          {i < notes.length - 1 || n.step ? (
            <span className={`${s.gap} ${s[`gap${Math.min(n.step, 3)}`]}`} aria-hidden>
              {STEP[n.step] ?? ''}
            </span>
          ) : null}
        </span>
      ))}
      <span className={`${s.cell} ${s.again} ${active === notes.length ? s.on : ''}`} aria-hidden>
        <b>{notes[0].name}</b>
        <i>8</i>
      </span>
    </span>
  )
}
