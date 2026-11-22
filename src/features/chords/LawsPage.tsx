import { useEffect } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { Button, IndexEntry, IndexList, Lead, Notebook, PageTitle, Section, SectionTitle, Select, UnitLabel } from '../../ui'
import { NotebookHeader } from '../shell/NotebookHeader'
import { Blocks, CheckList } from './Blocks'
import { CHAPTERS } from './chapters'
import { ChordsQuiz } from './ChordsQuiz'
import { CText, linksIn } from './CText'
import { LAWS } from './laws'
import { chapterPath, lawPath, LAWS_PATH } from './paths'
import type { QType } from './quiz'
import s from './Chords.module.css'

/** Which chapters lean on each law, read from the chapters themselves. */
export const CHAPTERS_BY_LAW: Record<number, number[]> = Object.fromEntries(
  LAWS.map((l) => [l.n, CHAPTERS.map((c, i) => ({ c, i })).filter(({ c }) => linksIn(c).laws.includes(l.n)).map(({ i }) => i + 1)]),
)

/** The quiz of each law's page. */
const LAW_QUIZ: Record<number, QType[]> = {
  1: ['map', 'where', 'mapDown', 'below', 'fifthBelow'],
  2: ['mud', 'register'],
  3: ['shapeDeg', 'nameShape'],
  4: ['form', 'pair', 'shapeDeg'],
  5: ['rootless', 'fifthBelow', 'below'],
}

/** /chords/laws — the five laws, one line each; every law has its own page. */
export function LawsPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
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
        </Section>
        <Section>
          <IndexList>
            {LAWS.map((l) => (
              <IndexEntry key={l.n} number={`L${l.n}`} title={<Link to={lawPath(l.n)}>{l.title}</Link>} meta={`${CHAPTERS_BY_LAW[l.n].length} chapters`}>
                <p>{l.short}</p>
              </IndexEntry>
            ))}
          </IndexList>
        </Section>
      </main>
    </Notebook>
  )
}

/** /chords/laws/:n — one law: the idea, the logic, examples, questions, its quiz. Every law link lands here. */
export function LawPage() {
  const { n = '' } = useParams()
  const navigate = useNavigate()
  const law = LAWS.find((l) => String(l.n) === n)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [n])
  if (!law) return <Navigate to={LAWS_PATH} replace />
  const prev = LAWS[law.n - 2]
  const next = LAWS[law.n]
  return (
    <Notebook>
      <NotebookHeader section="Chords">
        <Button icon size="sm" title="Previous law" disabled={!prev} onClick={() => prev && navigate(lawPath(prev.n))}>
          ◀
        </Button>
        <Select className={s.picker} aria-label="Law" value={String(law.n)} options={LAWS.map((l) => ({ value: String(l.n), label: `Law ${l.n}. ${l.title}` }))} onChange={(v) => navigate(lawPath(+v))} />
        <Button icon size="sm" title="Next law" disabled={!next} onClick={() => next && navigate(lawPath(next.n))}>
          ▶
        </Button>
      </NotebookHeader>
      <main key={law.n}>
        <Section>
          <UnitLabel>
            <Link to={LAWS_PATH}>The five laws</Link> · Law {law.n}
          </UnitLabel>
          <PageTitle number={`${law.n}.`}>{law.title}</PageTitle>
          <p className={s.lawShort}>{law.short}</p>
          <Blocks blocks={law.blocks} />
        </Section>
        <Section>
          <SectionTitle>Try it</SectionTitle>
          <CheckList items={law.tries} />
        </Section>
        <Section>
          <SectionTitle>Quiz on Law {law.n}</SectionTitle>
          <ChordsQuiz id={`law-${law.n}`} types={LAW_QUIZ[law.n]} />
        </Section>
        {CHAPTERS_BY_LAW[law.n].length > 0 && (
          <Section>
            <p className={s.backlinks}>
              Where it comes back:{' '}
              {CHAPTERS_BY_LAW[law.n].map((k) => (
                <Link key={k} className={s.chRef} to={chapterPath(CHAPTERS[k - 1].id)} title={CHAPTERS[k - 1].title}>
                  {k}. {CHAPTERS[k - 1].title}
                </Link>
              ))}
            </p>
          </Section>
        )}
        <Section>
          <div className={s.lawNav}>
            {prev ? <Link to={lawPath(prev.n)}>← Law {prev.n}. {prev.title}</Link> : <Link to={LAWS_PATH}>← The five laws</Link>}
            {next ? <Link to={lawPath(next.n)}>Law {next.n}. {next.title} →</Link> : <Link to={chapterPath(CHAPTERS[0].id)}>Chapter 1. {CHAPTERS[0].title} →</Link>}
          </div>
        </Section>
      </main>
    </Notebook>
  )
}
