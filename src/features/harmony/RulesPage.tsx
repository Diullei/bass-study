import { useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { Lead, Notebook, PageTitle, Section, SectionTitle, UnitLabel } from '../../ui'
import { NotebookHeader } from '../shell/NotebookHeader'
import { BlockView, CheckList } from './Blocks'
import { rulesIn } from './HText'
import { LESSONS } from './lessons'
import { harmonyLessonPath } from './paths'
import { RULES } from './rules'
import s from './Harmony.module.css'

/** Which lessons use each rule, worked out from the lessons themselves. */
export const LESSONS_BY_RULE: Record<number, number[]> = Object.fromEntries(
  RULES.map((r) => [r.n, LESSONS.map((L, i) => ({ L, i })).filter(({ L }) => rulesIn(L.blocks, [...L.practice, ...L.check.map((c) => c.why + c.a)]).includes(r.n)).map(({ i }) => i + 1)]),
)

/** /harmony/rules — the seven rules, with examples; every rule link in the course lands here. */
export function RulesPage() {
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return window.scrollTo(0, 0)
    const el = document.getElementById(hash.slice(1))
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [hash])
  return (
    <Notebook>
      <NotebookHeader section="Jazz Harmony" />
      <main>
        <Section>
          <UnitLabel>The engine</UnitLabel>
          <PageTitle>Seven rules that generate everything</PageTitle>
          <Lead>
            Every fact in the course comes from these seven rules. When something looks like it needs memorizing, come back here: the
            table is only the output, the rule is the thing to understand.
          </Lead>
          <ol className={s.ruleIndex}>
            {RULES.map((r) => (
              <li key={r.n}>
                <a href={`#rule-${r.n}`}>
                  <b>{r.title}.</b> {r.short}
                </a>
              </li>
            ))}
          </ol>
        </Section>
        {RULES.map((r) => (
          <Section key={r.n} id={`rule-${r.n}`} className={s.rule}>
            <UnitLabel>Rule {r.n}</UnitLabel>
            <PageTitle number={`${r.n}.`}>{r.title}</PageTitle>
            <p className={s.ruleShort}>{r.short}</p>
            <div className={s.blocks}>
              {r.blocks.map((b, i) => (
                <BlockView key={i} b={b} />
              ))}
            </div>
            <SectionTitle>Try it</SectionTitle>
            <CheckList items={r.tries} />
            {LESSONS_BY_RULE[r.n].length > 0 && (
              <p className={s.backlinks}>
                Where it comes back:{' '}
                {LESSONS_BY_RULE[r.n].map((n) => (
                  <Link key={n} className={s.lessonRef} to={harmonyLessonPath(LESSONS[n - 1].id)} title={LESSONS[n - 1].title}>
                    {n}. {LESSONS[n - 1].title}
                  </Link>
                ))}
              </p>
            )}
          </Section>
        ))}
      </main>
    </Notebook>
  )
}
