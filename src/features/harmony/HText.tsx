import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router'
import { LESSONS } from './lessons'
import { harmonyLessonPath, rulePath, WORKSHOP_PATH } from './paths'
import { RULES } from './rules'
import type { HBlock } from './types'
import s from './Harmony.module.css'

/** A link back to a rule; hovering it shows the rule, so you don't have to leave the page to remember it. */
export function RuleRef({ n }: { n: number }) {
  const r = RULES[n - 1]
  if (!r) return <>Rule {n}</>
  return (
    <Link className={s.ruleRef} to={rulePath(n)} data-tip={`Rule ${n}: ${r.short}`} aria-label={`Rule ${n}: ${r.title}`}>
      Rule {n}
    </Link>
  )
}

export function LessonRef({ n }: { n: number }) {
  const L = LESSONS[n - 1]
  if (!L) return <>Lesson {n}</>
  return (
    <Link className={s.lessonRef} to={harmonyLessonPath(L.id)} title={L.title}>
      Lesson {n}
    </Link>
  )
}

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[\[(?:R|L)\d+\]\]|\[\[W\]\])/g

/** Text with **bold**, *italic*, `code`, [[R3]] rule links, [[L4]] lesson links and [[W]] (the workshop). */
export function HText({ text }: { text: string }) {
  const out: ReactNode[] = []
  text.split(TOKEN).forEach((part, i) => {
    if (!part) return
    if (part.startsWith('**')) out.push(<b key={i}><HText text={part.slice(2, -2)} /></b>)
    else if (part.startsWith('`')) out.push(<code key={i} className={s.code}>{part.slice(1, -1)}</code>)
    else if (part.startsWith('[[R')) out.push(<RuleRef key={i} n={+part.slice(3, -2)} />)
    else if (part.startsWith('[[L')) out.push(<LessonRef key={i} n={+part.slice(3, -2)} />)
    else if (part === '[[W]]')
      out.push(
        <Link key={i} className={s.lessonRef} to={WORKSHOP_PATH}>
          chord-scale workshop
        </Link>,
      )
    else if (part.startsWith('*') && part.length > 2) out.push(<i key={i}>{part.slice(1, -1)}</i>)
    else out.push(<Fragment key={i}>{part}</Fragment>)
  })
  return <>{out}</>
}

/** Every rule a piece of content links to (blocks + extra strings). */
export function rulesIn(blocks: HBlock[], extra: string[] = []): number[] {
  const txt = JSON.stringify(blocks) + extra.join(' ')
  const found = new Set<number>()
  for (const m of txt.matchAll(/\[\[R(\d)\]\]/g)) found.add(+m[1])
  // the computed blocks apply rules too
  for (const b of blocks) {
    if (b.t === 'scale' || b.t === 'cstable') found.add(6)
    if (b.t === 'derive') found.add(5)
    if (b.t === 'functions') found.add(4)
  }
  return [...found].sort()
}
