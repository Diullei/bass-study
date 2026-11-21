import { Link } from 'react-router'
import { FactList, IndexEntry, IndexList, Lead, Notebook, PageTitle, Section, SectionTitle, StickyNote, UnitLabel } from '../../ui'
import { NotebookHeader } from '../shell/NotebookHeader'
import { HText } from './HText'
import { LESSONS, PARTS } from './lessons'
import { CHEATSHEET_PATH, harmonyLessonPath, rulePath, RULES_PATH, WORKSHOP_PATH } from './paths'
import { useHarmonyProgress } from './progress'
import { LESSONS_BY_RULE } from './RulesPage'
import { RULES } from './rules'
import s from './Harmony.module.css'

const PLAN = [
  ['1–5', 'Lessons 1–5'],
  ['6', 'Review Part 1: `Cmaj7 Am7 Dm7 G7` with shells plus one tension in C, F, B♭, E♭; walk it on bass'],
  ['7–11', 'Lessons 6–10'],
  ['12', 'Review Part 2: analyse and play All of Me, Satin Doll, There Will Never Be Another You'],
  ['13–16', 'Lessons 11–14'],
  ['17', 'Review Part 3: Blue Bossa, Autumn Leaves, one blues'],
  ['18–22', 'Lessons 15–19'],
  ['23–24', 'Lesson 20, the capstone'],
]

const TUNES = [
  ['Parts 1–2', 'All of Me, Satin Doll, Take the A Train, Honeysuckle Rose, There Will Never Be Another You'],
  ['Part 3', "Blue Bossa, Autumn Leaves, Lady Bird, Solar, Alone Together, Beautiful Love, Billie's Bounce, Mr. P.C., Blues for Alice"],
  ['Part 4', 'All the Things You Are, rhythm changes (Oleo, Anthropology), So What, Impressions, Maiden Voyage, Inner Urge, Countdown, Giant Steps, Stella by Starlight'],
]

/** /harmony — the course: the rules, four parts, tools. */
export function HarmonyHome() {
  const { all, learned } = useHarmonyProgress()
  const next = LESSONS.find((L) => !learned(L.id)) ?? LESSONS[0]
  const done = LESSONS.filter((L) => learned(L.id)).length
  return (
    <Notebook>
      <NotebookHeader section="Jazz Harmony" aside={<span className={s.count}>{done}/{LESSONS.length} learned</span>} />
      <main>
        <Section>
          <UnitLabel>Section IV · a course in four parts</UnitLabel>
          <PageTitle>Functional Jazz Harmony</PageTitle>
          <Lead>
            From intervals to Coltrane changes, in plain language. Nothing here needs memorizing: every table is the output of seven
            rules, and every lesson shows which rule produces what.
          </Lead>
          <FactList
            items={[
              <HText key="a" text="**Understand, don't memorize.** If you forget a table, rebuild it from the rules. Doing the rebuilding *is* the practice." />,
              <HText key="b" text="**Rule links everywhere.** When a lesson leans on a rule you see a link like [[R1]]: hover it to see the rule, click it to read it with examples." />,
              <HText key="c" text="**Tables are computed.** Chord-scale tables, functions and Rule 5 derivations are worked out live by the same rules you are learning." />,
              <HText key="d" text="**Every lesson:** the idea, the logic, examples to hear, practice for keys and bass, questions with the reasoning, and a quiz that is new every time." />,
            ]}
          />
        </Section>

        <Section>
          <StickyNote
            title={done ? `Continue: ${LESSONS.indexOf(next) + 1}. ${next.title}` : 'Start here: the seven rules'}
            action={
              <Link className={s.goLink} to={done ? harmonyLessonPath(next.id) : RULES_PATH}>
                {done ? 'Open →' : 'Read the rules →'}
              </Link>
            }
          >
            Learn everything in C first, then move it to F, B♭, E♭ and G, then to all 12 keys. Thirty minutes a day: 10 on the lesson, 10
            on a tune, 10 on ear work (sing roots and guide tones).
          </StickyNote>
        </Section>

        <Section>
          <SectionTitle>The engine: seven rules</SectionTitle>
          <IndexList>
            {RULES.map((r) => (
              <IndexEntry key={r.n} number={`R${r.n}`} title={<Link to={rulePath(r.n)}>{r.title}</Link>} meta={`${LESSONS_BY_RULE[r.n].length} lessons`}>
                <p>{r.short}</p>
              </IndexEntry>
            ))}
          </IndexList>
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
                    title={<Link to={harmonyLessonPath(L.id)}>{L.title}</Link>}
                    meta={learned(L.id) ? '✓ learned' : all[L.id]?.quiz ? `quiz ${all[L.id]?.quiz}%` : undefined}
                  >
                    <p>
                      <HText text={L.idea} />
                    </p>
                  </IndexEntry>
                ))}
            </IndexList>
          </Section>
        ))}

        <Section>
          <SectionTitle>Tools</SectionTitle>
          <IndexList>
            <IndexEntry number="✎" title={<Link to={WORKSHOP_PATH}>Chord-scale workshop</Link>} meta="any chord, any key">
              <p>Rule 5 and Rule 6, step by step, on any chord you pick.</p>
            </IndexEntry>
            <IndexEntry number="✎" title={<Link to={CHEATSHEET_PATH}>Chord-scale cheat sheet</Link>} meta="computed">
              <p>Every chord scale of the course, to check your own answers.</p>
            </IndexEntry>
          </IndexList>
        </Section>

        <Section>
          <SectionTitle>A 24-week plan</SectionTitle>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Weeks</th>
                  <th>Content</th>
                </tr>
              </thead>
              <tbody>
                {PLAN.map(([w, c]) => (
                  <tr key={w}>
                    <td>{w}</td>
                    <td>
                      <HText text={c} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section>
          <SectionTitle>Tunes by stage</SectionTitle>
          <FactList items={TUNES.map(([p, t]) => <span key={p}><b>{p}:</b> {t}</span>)} />
        </Section>
      </main>
    </Notebook>
  )
}
