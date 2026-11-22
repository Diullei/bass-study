import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ChordShape } from '../../notation/ChordShape'
import { LessonRef, RuleRef } from '../harmony/HText'
import { CHAPTERS } from './chapters'
import { useFingers } from './fingers'
import { LAWS } from './laws'
import { chapterPath, CHECK_PATH, FIND_PATH, GEN_PATH, lawPath, TESTS_PATH } from './paths'
import { useLefty } from './progress'
import { info, penOf } from './render'
import { useClip } from './sound'
import { shapeBar } from './render'
import s from './Chords.module.css'

/** A link to a law; hovering shows it, so you don't lose your place. */
export function LawRef({ n }: { n: number }) {
  const L = LAWS[n - 1]
  if (!L) return <>Law {n}</>
  return (
    <Link className={s.lawRef} to={lawPath(n)} data-tip={`Law ${n}: ${L.short}`} aria-label={`Law ${n}: ${L.title}`}>
      Law {n}
    </Link>
  )
}

export function ChapterRef({ n }: { n: number }) {
  const C = CHAPTERS[n - 1]
  if (!C) return <>Chapter {n}</>
  return (
    <Link className={s.chRef} to={chapterPath(C.id)} title={C.title}>
      Chapter {n}
    </Link>
  )
}

/** An inline shape: the frets in mono; hover shows the diagram, click plays it. */
export function ShapeChip({ sym, shape }: { sym: string; shape: string }) {
  const P = useClip<number>()
  const [lefty] = useLefty()
  const I = info(sym, shape)
  const F = useFingers()
  const play = () => (P.playing ? P.stop() : P.once([shapeBar(I, 'roll', 3, 0, true)], 80))
  return (
    <button type="button" className={s.chip} onClick={play} aria-label={`${sym} ${shape}, play`}>
      <code>{shape}</code>
      <span className={s.chipPop} aria-hidden>
        <b>{sym}</b>
        <ChordShape
          shape={shape}
          labels={I.a.notes.map((n) => n.deg)}
          pens={I.a.notes.map((n) => penOf(n.deg))}
          roots={I.a.notes.map((n) => n.deg === 'R')}
          lefty={lefty}
          {...F.props(F.of(I))}
        />
        <small>{I.a.notes.map((n) => n.name).join(' ')} · click to hear</small>
      </span>
    </button>
  )
}

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[\[(?:Law\d|Ch\d+|R\d|HL\d+|TP|GEN|FIND|CHECK)\]\]|\{[A-G][^:{}\s]*:[xh0-9-]+\})/g

const TOOLS: Record<string, [string, string]> = {
  TP: [TESTS_PATH, 'the four test progressions'],
  GEN: [GEN_PATH, 'progression generator'],
  FIND: [FIND_PATH, 'voicing finder'],
  CHECK: [CHECK_PATH, 'shape checker'],
}

/** Rich text of the chord method (see types.ts for the tokens). */
export function CText({ text }: { text: string }) {
  const out: ReactNode[] = []
  text.split(TOKEN).forEach((part, i) => {
    if (!part) return
    if (part.startsWith('**')) out.push(<b key={i}><CText text={part.slice(2, -2)} /></b>)
    else if (part.startsWith('`')) out.push(<code key={i} className={s.code}>{part.slice(1, -1)}</code>)
    else if (part.startsWith('[[Law')) out.push(<LawRef key={i} n={+part.slice(5, -2)} />)
    else if (part.startsWith('[[Ch')) out.push(<ChapterRef key={i} n={+part.slice(4, -2)} />)
    else if (part.startsWith('[[R')) out.push(<RuleRef key={i} n={+part.slice(3, -2)} />)
    else if (part.startsWith('[[HL')) out.push(<LessonRef key={i} n={+part.slice(4, -2)} />)
    else if (part.startsWith('[[')) {
      const [to, label] = TOOLS[part.slice(2, -2)]
      out.push(
        <Link key={i} className={s.chRef} to={to}>
          {label}
        </Link>,
      )
    } else if (part.startsWith('{')) {
      const k = part.indexOf(':')
      out.push(<ShapeChip key={i} sym={part.slice(1, k)} shape={part.slice(k + 1, -1)} />)
    } else if (part.startsWith('*') && part.length > 2) out.push(<i key={i}>{part.slice(1, -1)}</i>)
    else out.push(<Fragment key={i}>{part}</Fragment>)
  })
  return <>{out}</>
}

/** Every law and chapter a chapter leans on, read from its text. */
export function linksIn(x: unknown): { laws: number[]; rules: number[]; chapters: number[] } {
  const txt = JSON.stringify(x)
  const grab = (re: RegExp) => [...new Set([...txt.matchAll(re)].map((m) => +m[1]))].sort((a, b) => a - b)
  return { laws: grab(/\[\[Law(\d)\]\]/g), rules: grab(/\[\[R(\d)\]\]/g), chapters: grab(/\[\[Ch(\d+)\]\]/g) }
}
