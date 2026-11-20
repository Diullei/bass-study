import { Link } from 'react-router'
import { FactList, IndexEntry, IndexList, Lead, Notebook, PageTitle, PencilNote, Section, SectionTitle, StickyNote, UnitLabel } from '../../ui'
import { NotebookHeader } from '../shell/NotebookHeader'
import { LESSONS, PARTS } from './lessons'
import { PENT_MAP_PATH, pentLessonPath } from './paths'
import { usePentProgress } from './progress'
import s from './Pentatonics.module.css'

/** /pentatonics — the class: six parts, twenty lessons, and the map. */
export function ClassPage() {
  const { all, learned } = usePentProgress()
  const next = LESSONS.find((L) => !learned(L.id)) ?? LESSONS[0]
  const done = LESSONS.filter((L) => learned(L.id)).length
  return (
    <Notebook>
      <NotebookHeader section="Pentatonics" aside={<span className={s.count}>{done}/{LESSONS.length} learned</span>} />
      <main>
        <Section>
          <UnitLabel>Section III · a class in six parts</UnitLabel>
          <PageTitle>Pentatonics</PageTitle>
          <Lead>
            From the first five-note shape to weaving pentatonics through chord changes. Five notes, no half steps, nothing
            that clashes: the most useful scale on the bass, and, used well, one of the most modern sounding.
          </Lead>
          <FactList
            items={[
              <>
                <b>The shape</b> and <b>grooves & the blues</b>: the scale, the neck, sequences, riffs, the blue note.
              </>,
              <>
                <b>The altitude ladder</b>: for every chord type, the pentatonics that fit it, from grounded to high colour, and
                one rung outside.
              </>,
              <>
                <b>Weaving</b>: switch between rungs, never more than four notes in one, for lines that never sound like a
                scale.
              </>,
              <>
                <b>Through the changes</b> and <b>beyond the box</b>: ii–V–I, minor ii–V–i, the blues, side-slipping, and
                playing what you sing.
              </>,
            ]}
          />
          <PencilNote>
            Parts 3 and 4 follow an approach taught by fusion bassist Gary Willis: over a minor chord, use the minor
            pentatonics on the root, the 5th and the 9th, and weave between them, never more than four notes in one. Here it is
            extended to every chord type and key.
          </PencilNote>
        </Section>

        <Section>
          <StickyNote
            title={done ? `Continue: ${LESSONS.indexOf(next) + 1}. ${next.title}` : 'Start here'}
            action={
              <Link className={s.goLink} to={pentLessonPath(next.id)}>
                {done ? 'Open →' : `1. ${LESSONS[0].title} →`}
              </Link>
            }
          >
            Every lesson has an explanation, examples, a practice line in any key with a backing band, and a short quiz.
          </StickyNote>
        </Section>

        {PARTS.map((part, pi) => (
          <Section key={part}>
            <SectionTitle>
              Part {pi + 1} · {part}
            </SectionTitle>
            <IndexList>
              {LESSONS.map((L, i) => ({ L, i }))
                .filter(({ L }) => L.part === pi)
                .map(({ L, i }) => (
                  <IndexEntry
                    key={L.id}
                    number={`${i + 1}.`}
                    title={<Link to={pentLessonPath(L.id)}>{L.title}</Link>}
                    meta={learned(L.id) ? '✓ learned' : all[L.id]?.quiz ? `quiz ${all[L.id]?.quiz}%` : undefined}
                  >
                    <p>{L.goal}</p>
                  </IndexEntry>
                ))}
            </IndexList>
          </Section>
        ))}

        <Section>
          <SectionTitle>Tool</SectionTitle>
          <IndexList>
            <IndexEntry number="✎" title={<Link to={PENT_MAP_PATH}>The pentatonic map</Link>} meta="any chord, any key">
              <p>Pick a chord type and a root: see its altitude ladder, what every pentatonic gives you over it, and where each lies on the neck.</p>
            </IndexEntry>
          </IndexList>
        </Section>
      </main>
    </Notebook>
  )
}
