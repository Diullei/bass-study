import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { KEYS, store } from '../../state/storage'
import { Button, FactList, Lead, Notebook, PageTitle, Section, SectionTitle, Select, StickyNote, UnitLabel, type OptionGroup } from '../../ui'
import { NotebookHeader } from '../shell/NotebookHeader'
import { DrillPanel, Example } from './DrillPanel'
import { LadderBlock } from './LadderBlock'
import { lessonById, LESSONS, PARTS, type Block, type PentLesson } from './lessons'
import { PENT_PATH, pentLessonPath } from './paths'
import { PASS, usePentProgress } from './progress'
import { PentQuiz } from './PentQuiz'
import { Rich } from './Rich'
import { ShapeBlock } from './ShapeBlock'
import s from './Pentatonics.module.css'

function BlockView({ b, tempo }: { b: Block; tempo: number }) {
  switch (b.t) {
    case 'p':
      return (
        <p className={s.para}>
          <Rich text={b.text} />
        </p>
      )
    case 'list':
      return <FactList items={b.items.map((x, i) => <Rich key={i} text={x} />)} />
    case 'tip':
      return (
        <StickyNote title={b.title}>
          <Rich text={b.text} />
        </StickyNote>
      )
    case 'ladder':
      return <LadderBlock q={b.q} root={b.root} only={b.only} />
    case 'shape':
      return <ShapeBlock kind={b.kind} root={b.root} from={b.from} to={b.to} caption={b.caption} />
    case 'example':
      return <Example title={b.title} spec={b.spec} root={b.root} seed={b.seed} choice={b.choice} tempo={tempo} />
  }
}

/** /pentatonics/:id — one lesson of the class. */
export function PentLessonPage() {
  const { id = '' } = useParams()
  const L = lessonById(id)
  useEffect(() => {
    if (L) store(KEYS.pentCurrent, L.id)
  }, [L])
  if (!L) return <Navigate to={PENT_PATH} replace />
  return <LessonView key={L.id} L={L} />
}

function LessonView({ L }: { L: PentLesson }) {
  const navigate = useNavigate()
  const { all, update, learned } = usePentProgress()
  const k = LESSONS.indexOf(L)
  const prev = LESSONS[k - 1]
  const next = LESSONS[k + 1]
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const groups: OptionGroup[] = PARTS.map((p, pi) => ({
    label: `Part ${pi + 1} · ${p}`,
    options: LESSONS.map((x, i) => ({ x, i }))
      .filter(({ x }) => x.part === pi)
      .map(({ x, i }) => ({ value: x.id, label: `${learned(x.id) ? '✓ ' : ''}${i + 1}. ${x.title}` })),
  }))

  return (
    <Notebook>
      <NotebookHeader section="Pentatonics">
        <Button icon size="sm" title="Previous lesson" disabled={!prev} onClick={() => prev && navigate(pentLessonPath(prev.id))}>
          ◀
        </Button>
        <Select className={s.picker} aria-label="Lesson" value={L.id} groups={groups} onChange={(v) => navigate(pentLessonPath(v))} />
        <Button icon size="sm" title="Next lesson" disabled={!next} onClick={() => next && navigate(pentLessonPath(next.id))}>
          ▶
        </Button>
      </NotebookHeader>
      <main>
        <Section>
          <UnitLabel>
            Part {L.part + 1} · {PARTS[L.part]}
          </UnitLabel>
          <PageTitle number={`${k + 1}.`}>{L.title}</PageTitle>
          <Lead>{L.goal}</Lead>
        </Section>
        <Section className={s.blocks}>
          {L.blocks.map((b, i) => (
            <BlockView key={i} b={b} tempo={L.tempo} />
          ))}
        </Section>
        <Section>
          <SectionTitle>Practice</SectionTitle>
          <DrillPanel drills={L.drills} root={L.root} choice={L.choice} tempo={L.tempo} keys />
        </Section>
        <Section>
          <SectionTitle>Check yourself</SectionTitle>
          <PentQuiz id={L.id} types={L.quiz} />
        </Section>
        <Section>
          <StickyNote
            tone={learned(L.id) ? 'success' : 'yellow'}
            title={learned(L.id) ? '✓ Learned' : 'When you can play it'}
            action={
              <>
                {!learned(L.id) && (
                  <Button onClick={() => update(L.id, { done: true })}>Mark as learned</Button>
                )}
                {next && (
                  <Button variant={learned(L.id) ? 'ink' : 'default'} onClick={() => navigate(pentLessonPath(next.id))}>
                    Next lesson →
                  </Button>
                )}
              </>
            }
          >
            {learned(L.id)
              ? next
                ? `Next: ${next.title}`
                : 'You have finished the class.'
              : `Play the practice line in three keys with the bass muted, and pass the quiz (${PASS}%${all[L.id]?.quiz ? `, best so far ${all[L.id]?.quiz}%` : ''}).`}
          </StickyNote>
        </Section>
      </main>
    </Notebook>
  )
}
