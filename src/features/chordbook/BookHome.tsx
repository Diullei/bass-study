import { Link, useNavigate } from 'react-router'
import { FactList, IndexEntry, IndexList, Lead, Notebook, PageTitle, Section, SectionTitle, StickyNote, Button, UnitLabel } from '../../ui'
import { NotebookHeader } from '../shell/NotebookHeader'
import { CText } from '../chords/CText'
import { EXERCISES, KIND_NAME, keysOf, numberOf, UNITS } from './exercises'
import { exercisePath } from './paths'
import { useBookProgress } from './progress'
import s from './Book.module.css'

/** /chord-exercises — the contents of the exercise book. */
export function BookHome() {
  const P = useBookProgress()
  const navigate = useNavigate()
  return (
    <Notebook>
      <NotebookHeader section="Chord exercises" aside={<span className={s.count}>{P.count}/{EXERCISES.length} done</span>} />
      <main>
        <Section>
          <UnitLabel>Section VI · the practice book of the chord method</UnitLabel>
          <PageTitle>Chord Exercise Book</PageTitle>
          <Lead>
            <CText text={`${EXERCISES.length} numbered exercises, from two notes on one chord to long forms in twelve keys. The chord method explains **why** a shape is what it is; this book is where the hands learn it. Each exercise names the chapters it practises, and each chapter of the method lists its exercises.`} />
          </Lead>
          <StickyNote
            title={P.count ? `Next: Exercise ${numberOf(P.next)}` : 'Start here'}
            action={<Button variant="ink" onClick={() => navigate(exercisePath(P.next.id))}>Open Exercise {numberOf(P.next)} →</Button>}
          >
            {P.next.title}
          </StickyNote>
        </Section>

        <Section>
          <SectionTitle>How to use this book</SectionTitle>
          <FactList
            items={[
              <CText key="1" text="**Read first, then play.** Every exercise says which chapters it comes from. If the idea is not clear, the exercise becomes copying shapes; go back and read." />,
              <CText key="2" text="**Say it before you play it.** The steps ask you to name a note, a form or a colour before the fingers move. This is the real exercise: the shapes are worked out for you on the page, but the point is that you can work them out yourself." />,
              <CText key="3" text="**The shapes are computed, not printed.** They are chosen for the key, for the place on the neck and for your hand size (⚙ Settings), by the same laws the method teaches. So a key can show another shape than the one you found: check yours with the [[CHECK]]." />,
              <CText key="4" text="**One key at a time.** Tick a key only when it went through without a stop at the tempo you chose. If a key breaks, slow down and stay in it." />,
              <CText key="5" text="**Two tempos.** Begin at the first, move on at the second. The loop stays on: time is part of every exercise." />,
              <CText key="6" text="**Move on by the test**, written at the bottom of each exercise, not by the calendar. A session of twenty minutes is enough: five on an old exercise, fifteen on the new one." />,
              <CText key="7" text='**"Work it out first"** exercises hide the diagrams. Play your answer, then show them. **Pieces** end each unit: play them as music, several times through. **Checkpoints** are to be recorded.' />,
            ]}
          />
        </Section>

        {UNITS.map((u, ui) => {
          const list = EXERCISES.filter((e) => e.unit === ui)
          const done = list.filter(P.done).length
          return (
            <Section key={u.title}>
              <SectionTitle>
                Unit {ui + 1} · {u.title}{' '}
                <span className={s.count}>
                  ({u.chapters} · {done}/{list.length})
                </span>
              </SectionTitle>
              <p className={s.about}>{u.about}</p>
              <IndexList>
                {list.map((e) => {
                  const keys = keysOf(e).length
                  const played = P.keysPlayed(e)
                  return (
                    <IndexEntry
                      key={e.id}
                      number={`${numberOf(e)}.`}
                      title={<Link to={exercisePath(e.id)}>{e.title}</Link>}
                      meta={P.done(e) ? '✓ done' : played ? `${played}/${keys} keys` : `${KIND_NAME[e.kind].toLowerCase()} · ${keys === 1 ? '1 key' : `${keys} keys`}`}
                    />
                  )
                })}
              </IndexList>
            </Section>
          )
        })}
      </main>
    </Notebook>
  )
}
