import { PenHead } from '../ideas/RoleLegend'
import s from './Pentatonics.module.css'

/** Which pen is which pentatonic. */
export const Legend = ({ items }: { items: { pen: string; text: string }[] }) =>
  items.length > 1 ? (
    <ul className={s.legend} aria-label="What the pens mean">
      {items.map((it) => (
        <li key={it.pen + it.text}>
          <PenHead pen={it.pen} /> {it.text}
        </li>
      ))}
    </ul>
  ) : null
