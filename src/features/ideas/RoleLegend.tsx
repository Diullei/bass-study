import { ROLES, type IdeaNote, type Role } from './model'
import s from './IdeaBuilderPage.module.css'

/** One notehead in a pen, drawn with the same classes as the staff. */
export const PenHead = ({ pen }: { pen: string }) => (
  <svg className="score" viewBox="0 0 22 16" style={{ width: 22, height: 16, display: 'inline-block' }} aria-hidden>
    <g className={pen}>
      <ellipse className="nh f" cx="11" cy="8" rx="5.8" ry="4.3" transform="rotate(-22 11 8)" />
    </g>
  </svg>
)

const ORDER: Role[] = ['target', 'groove', 'guide', 'scale', 'pass', 'arp', 'approach', 'enclosure', 'motif', 'tension', 'ghost']

/** Which pen means what — only for the roles in this idea. */
export function RoleLegend({ notes }: { notes: IdeaNote[] }) {
  const present = new Set(notes.map((n) => n.role))
  const seed = notes.some((n) => n.seed)
  const items = ORDER.filter((r) => present.has(r))
  return (
    <ul className={s.legend} aria-label="What the pens mean">
      {items.map((r) => (
        <li key={r}>
          <PenHead pen={ROLES[r].pen} /> {ROLES[r].name}
        </li>
      ))}
      {seed && !present.has('motif') && (
        <li>
          <PenHead pen="pen-marker" /> seed motif
        </li>
      )}
    </ul>
  )
}
