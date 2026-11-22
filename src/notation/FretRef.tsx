import { Fragment, type ReactNode } from 'react'
import { bassTone, audioContext } from '../audio/synth'
import { Fretboard } from './Fretboard'
import styles from './Fretboard.module.css'

const NAMES = ['B', 'E', 'A', 'D', 'G']
const OPEN = [23, 28, 33, 38, 43]
const PITCH = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B']

export interface FretRefProps {
  /** The string, by name: B, E, A, D or G. */
  string: string
  fret: number
  /** Not clickable and without the pop-up: for use inside a button or a heading. */
  inert?: boolean
}

/**
 * A place on the neck named inside a sentence: the string on a small label, then the fret.
 * Hover (or focus) shows where it is and which note it sounds; click plays it.
 * One spelling for the whole notebook; in text it is written E‑8 (see `fretRefs`).
 */
export function FretRef({ string, fret, inert }: FretRefProps) {
  const str = NAMES.indexOf(string.toUpperCase())
  const midi = OPEN[str] + fret
  const pitch = PITCH[midi % 12] + (Math.floor(midi / 12) - 1)
  const label = (
    <>
      <span className={styles.frString}>{string}</span>
      <span className={styles.frFret}>{fret}</span>
    </>
  )
  if (inert)
    return (
      <span className={styles.fretRef} title={`${string} string, fret ${fret}: ${pitch}`}>
        {label}
      </span>
    )
  const play = () => {
    const AC = audioContext()
    if (AC) bassTone(AC, AC.destination, AC.currentTime + 0.02, midi, 1.2)
  }
  const from = fret <= 2 ? 0 : fret - 1
  return (
    <button type="button" className={styles.fretRef} onClick={play} aria-label={`${string} string, fret ${fret}: ${pitch}. Play`}>
      {label}
      <span className={styles.frPop} aria-hidden>
        <Fretboard strings={5} from={from} to={Math.max(fret + 1, (from || 1) + 2)} allNumbers dots={[{ str, fret, label: PITCH[midi % 12], pen: 'pen-green' }]} />
        <small>
          {string} string, fret {fret} · sounds {pitch} · click to hear
        </small>
      </span>
    </button>
  )
}

/** How a place is written in text: the string's letter, a non-breaking hyphen, the fret (E‑8). */
const IN_TEXT = /(?<![A-Za-z0-9♭♯‑-])([BEADG])‑(\d{1,2})(?![\d‑])/g

/** Plain text → the same text with every E‑8 turned into a FretRef. */
export function fretRefs(text: string, inert = false): ReactNode {
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(IN_TEXT)) {
    if (m.index > last) out.push(<Fragment key={last}>{text.slice(last, m.index)}</Fragment>)
    out.push(<FretRef key={`r${m.index}`} string={m[1]} fret={+m[2]} inert={inert} />)
    last = m.index + m[0].length
  }
  if (!out.length) return text
  if (last < text.length) out.push(<Fragment key={last}>{text.slice(last)}</Fragment>)
  return out
}
