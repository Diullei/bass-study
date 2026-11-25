import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { RuleRef } from '../harmony/HText'
import { KEYS, store } from '../../state/storage'
import { Button, Lead, Notebook, PageTitle, Section, SectionTitle, Select, StickyNote, UnitLabel, type OptionGroup } from '../../ui'
import { NotebookHeader } from '../shell/NotebookHeader'
import { Blocks, BlockView, CheckList } from './Blocks'
import { Link } from 'react-router'
import { exercisesFor, numberOf } from '../chordbook/exercises'
import { exercisePath } from '../chordbook/paths'
import { useBookProgress } from '../chordbook/progress'
import B from '../chordbook/Book.module.css'
import { Practice } from './Practice'
import { chapterById, CHAPTERS, PARTS } from './chapters'
import { ChordsQuiz } from './ChordsQuiz'
import { CText, LawRef, linksIn } from './CText'
import { chapterPath, CHORDS_PATH } from './paths'
import { PASS, useChordsProgress } from './progress'
import type { Chapter } from './types'
import s from './Chords.module.css'

/** /chords/:id — one chapter. */
export function ChapterPage() {
  const { id = '' } = useParams()
  const C = chapterById(id)
  useEffect(() => {
    if (C) store(KEYS.chordsCurrent, C.id)
  }, [C])
  if (!C) return <Navigate to={CHORDS_PATH} replace />
  return <ChapterView key={C.id} C={C} />
}

function ChapterView({ C }: { C: Chapter }) {
  const navigate = useNavigate()
  const { all, update, learned } = useChordsProgress()
  const k = CHAPTERS.indexOf(C)
  const prev = CHAPTERS[k - 1]
  const next = CHAPTERS[k + 1]
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const links = linksIn(C)
  const book = useBookProgress()
  const exercises = exercisesFor(C.id)
  const groups: OptionGroup[] = PARTS.map((p, pi) => ({
    label: `Part ${pi} · ${p}`,
    options: CHAPTERS.map((x, i) => ({ x, i }))
      .filter(({ x }) => x.part === pi)
      .map(({ x, i }) => ({ value: x.id, label: `${learned(x.id) ? '✓ ' : ''}${i + 1}. ${x.title}` })),
  }))
  return (
    <Notebook>
      <NotebookHeader section="Chords">
        <Button icon size="sm" title="Previous chapter" disabled={!prev} onClick={() => prev && navigate(chapterPath(prev.id))}>
          ◀
        </Button>
        <Select className={s.picker} aria-label="Chapter" value={C.id} groups={groups} onChange={(v) => navigate(chapterPath(v))} />
        <Button icon size="sm" title="Next chapter" disabled={!next} onClick={() => next && navigate(chapterPath(next.id))}>
          ▶
        </Button>
      </NotebookHeader>
      <main>
        <Section>
          <UnitLabel>
            Part {C.part} · {PARTS[C.part]}
          </UnitLabel>
          <PageTitle number={`${k + 1}.`}>{C.title}</PageTitle>
          {(links.laws.length > 0 || links.rules.length > 0) && (
            <p className={s.uses}>
              Built on:{' '}
              {links.laws.map((n) => (
                <LawRef key={n} n={n} />
              ))}
              {links.rules.length > 0 && <span>· harmony</span>}
              {links.rules.map((n) => (
                <RuleRef key={n} n={n} />
              ))}
            </p>
          )}
          <div className={s.piano}>
            <b>Piano idea. </b>
            <CText text={C.piano} />
          </div>
        </Section>
        <Section>
          {C.blocks[0]?.t !== 'h' && <SectionTitle>Bass logic</SectionTitle>}
          <Blocks blocks={C.blocks} />
        </Section>
        {C.tone && (
          <Section>
            <StickyNote title="Tone">
              <CText text={C.tone} />
            </StickyNote>
          </Section>
        )}
        {C.drills.length > 0 && (
          <Section>
            <SectionTitle>Drills</SectionTitle>
            <ol className={s.steps}>
              {C.drills.map((d, i) => (
                <li key={i}>
                  <CText text={typeof d === 'string' ? d : d.text} />
                  {typeof d !== 'string' && (
                    <div className={s.drillBlocks}>
                      {d.blocks.map((b, k) => (
                        <BlockView key={k} b={b} />
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </Section>
        )}
        <Practice key={C.id} chapter={C.id} />
        {exercises.length > 0 && (
          <Section>
            <SectionTitle>In the exercise book</SectionTitle>
            <p className={s.caption}>
              <CText text="The numbered exercises of the [[BOOK]] that practise this chapter, in order of difficulty. Read the chapter, then play these." />
            </p>
            <ul className={B.inBook}>
              {exercises.map((e) => (
                <li key={e.id}>
                  <Link to={exercisePath(e.id)} className={book.done(e) ? B.isDone : undefined}>
                    {book.done(e) ? '✓ ' : ''}Ex. {numberOf(e)} · {e.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}
        {C.checks.length > 0 && (
          <Section>
            <SectionTitle>Check yourself</SectionTitle>
            <CheckList items={C.checks} />
          </Section>
        )}
        {C.quiz.length > 0 && (
          <Section>
            <SectionTitle>Quiz</SectionTitle>
            <ChordsQuiz id={C.id} types={C.quiz} />
          </Section>
        )}
        <Section>
          <StickyNote
            tone={learned(C.id) ? 'success' : 'yellow'}
            title={learned(C.id) ? '✓ Ready' : 'Ready when'}
            action={
              <>
                {!learned(C.id) && <Button onClick={() => update(C.id, { done: true })}>I'm ready: mark it</Button>}
                {next && (
                  <Button variant={learned(C.id) ? 'ink' : 'default'} onClick={() => navigate(chapterPath(next.id))}>
                    Next chapter →
                  </Button>
                )}
              </>
            }
          >
            <Lead>
              <CText text={C.ready} />
            </Lead>
            {!learned(C.id) && C.quiz.length > 0 && (
              <span className={s.pencil}>
                Move on by this test, not by the calendar. Passing the quiz ({PASS}%{all[C.id]?.quiz ? `, best so far ${all[C.id]?.quiz}%` : ''}) also marks it.
              </span>
            )}
          </StickyNote>
        </Section>
      </main>
    </Notebook>
  )
}
