import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { KEYS, store } from '../../state/storage'
import { Button, FactList, Lead, Notebook, PageTitle, Section, SectionTitle, Select, StickyNote, UnitLabel, type OptionGroup } from '../../ui'
import { NotebookHeader } from '../shell/NotebookHeader'
import { BlockView, CheckList } from './Blocks'
import { HarmonyQuiz } from './HarmonyQuiz'
import { HText, RuleRef, rulesIn } from './HText'
import { lessonById, LESSONS, PARTS, type HLesson } from './lessons'
import { HARMONY_PATH, harmonyLessonPath } from './paths'
import { PASS, useHarmonyProgress } from './progress'
import s from './Harmony.module.css'

/** /harmony/:id — one lesson. */
export function HarmonyLessonPage() {
  const { id = '' } = useParams()
  const L = lessonById(id)
  useEffect(() => {
    if (L) store(KEYS.harmonyCurrent, L.id)
  }, [L])
  if (!L) return <Navigate to={HARMONY_PATH} replace />
  return <LessonView key={L.id} L={L} />
}

function LessonView({ L }: { L: HLesson }) {
  const navigate = useNavigate()
  const { all, update, learned } = useHarmonyProgress()
  const k = LESSONS.indexOf(L)
  const prev = LESSONS[k - 1]
  const next = LESSONS[k + 1]
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const rules = rulesIn(L.blocks, [...L.practice, ...L.check.map((c) => c.why)])

  const groups: OptionGroup[] = PARTS.map((p, pi) => ({
    label: `Part ${pi + 1} · ${p}`,
    options: LESSONS.map((x, i) => ({ x, i }))
      .filter(({ x }) => x.part === pi)
      .map(({ x, i }) => ({ value: x.id, label: `${learned(x.id) ? '✓ ' : ''}${i + 1}. ${x.title}` })),
  }))

  return (
    <Notebook>
      <NotebookHeader section="Jazz Harmony">
        <Button icon size="sm" title="Previous lesson" disabled={!prev} onClick={() => prev && navigate(harmonyLessonPath(prev.id))}>
          ◀
        </Button>
        <Select className={s.picker} aria-label="Lesson" value={L.id} groups={groups} onChange={(v) => navigate(harmonyLessonPath(v))} />
        <Button icon size="sm" title="Next lesson" disabled={!next} onClick={() => next && navigate(harmonyLessonPath(next.id))}>
          ▶
        </Button>
      </NotebookHeader>
      <main>
        <Section>
          <UnitLabel>
            Part {L.part + 1} · {PARTS[L.part]}
          </UnitLabel>
          <PageTitle number={`${k + 1}.`}>{L.title}</PageTitle>
          <Lead>
            <HText text={L.idea} />
          </Lead>
          {rules.length > 0 && (
            <p className={s.uses}>
              Built on:{' '}
              {rules.map((n) => (
                <RuleRef key={n} n={n} />
              ))}
              <span className={s.usesHint}>hover a rule to see it, click to open it</span>
            </p>
          )}
        </Section>
        <Section className={s.blocks}>
          {L.blocks.map((b, i) => (
            <BlockView key={i} b={b} />
          ))}
        </Section>
        <Section>
          <SectionTitle>Practice</SectionTitle>
          <FactList items={L.practice.map((x, i) => <HText key={i} text={x} />)} />
        </Section>
        {L.check.length > 0 && (
          <Section>
            <SectionTitle>Check yourself</SectionTitle>
            <CheckList items={L.check} />
          </Section>
        )}
        <Section>
          <SectionTitle>Quiz</SectionTitle>
          <HarmonyQuiz id={L.id} types={L.quiz} />
        </Section>
        <Section>
          <StickyNote
            tone={learned(L.id) ? 'success' : 'yellow'}
            title={learned(L.id) ? '✓ Learned' : 'When you understand it'}
            action={
              <>
                {!learned(L.id) && <Button onClick={() => update(L.id, { done: true })}>Mark as learned</Button>}
                {next && (
                  <Button variant={learned(L.id) ? 'ink' : 'default'} onClick={() => navigate(harmonyLessonPath(next.id))}>
                    Next lesson →
                  </Button>
                )}
              </>
            }
          >
            {learned(L.id)
              ? next
                ? `Next: ${next.title}`
                : 'You have finished the course.'
              : `You can explain every answer above with a rule, and you pass the quiz (${PASS}%${all[L.id]?.quiz ? `, best so far ${all[L.id]?.quiz}%` : ''}).`}
          </StickyNote>
        </Section>
      </main>
    </Notebook>
  )
}
