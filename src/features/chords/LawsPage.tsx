import { useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { Lead, Notebook, PageTitle, Section, SectionTitle, UnitLabel } from '../../ui'
import { NotebookHeader } from '../shell/NotebookHeader'
import { Blocks, CheckList } from './Blocks'
import { CHAPTERS } from './chapters'
import { ChordsQuiz } from './ChordsQuiz'
import { CText, linksIn } from './CText'
import { LAWS } from './laws'
import { chapterPath } from './paths'
import s from './Chords.module.css'

/** Which chapters lean on each law, read from the chapters themselves. */
export const CHAPTERS_BY_LAW: Record<number, number[]> = Object.fromEntries(
  LAWS.map((l) => [l.n, CHAPTERS.map((c, i) => ({ c, i })).filter(({ c }) => linksIn(c).laws.includes(l.n)).map(({ i }) => i + 1)]),
)

/** /chords/laws — the five laws, with examples; every law link lands here. */
export function LawsPage() {
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const el = document.getElementById(hash.slice(1))
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [hash])
  return (
    <Notebook>
      <NotebookHeader section="Chords" />
      <main>
        <Section>
          <UnitLabel>The engine</UnitLabel>
          <PageTitle>Five laws of chords on bass</PageTitle>
          <Lead>
            <CText text="The harmony course has seven rules about **notes** ([[R1]] to [[R7]]). These five laws are about the **instrument**. When a shape slips your mind, rebuild it from them: that rebuilding is the practice." />
          </Lead>
          <ol className={s.lawIndex}>
            {LAWS.map((l) => (
              <li key={l.n}>
                <a href={`#law-${l.n}`}>
                  <b>{l.title}.</b> {l.short}
                </a>
              </li>
            ))}
          </ol>
        </Section>
        {LAWS.map((l) => (
          <Section key={l.n} id={`law-${l.n}`} className={s.law}>
            <UnitLabel>Law {l.n}</UnitLabel>
            <PageTitle number={`${l.n}.`}>{l.title}</PageTitle>
            <p className={s.lawShort}>{l.short}</p>
            <Blocks blocks={l.blocks} />
            <SectionTitle>Try it</SectionTitle>
            <CheckList items={l.tries} />
            {CHAPTERS_BY_LAW[l.n].length > 0 && (
              <p className={s.backlinks}>
                Where it comes back:{' '}
                {CHAPTERS_BY_LAW[l.n].map((n) => (
                  <Link key={n} className={s.chRef} to={chapterPath(CHAPTERS[n - 1].id)} title={CHAPTERS[n - 1].title}>
                    {n}. {CHAPTERS[n - 1].title}
                  </Link>
                ))}
              </p>
            )}
          </Section>
        ))}
        <Section>
          <SectionTitle>Quiz on the laws</SectionTitle>
          <ChordsQuiz id="laws" types={['map', 'where', 'mapDown', 'below', 'register', 'mud', 'shapeDeg', 'fifthBelow']} />
        </Section>
      </main>
    </Notebook>
  )
}
