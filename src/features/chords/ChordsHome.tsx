import { Link } from 'react-router'
import { FactList, IndexEntry, IndexList, Lead, Notebook, PageTitle, Section, SectionTitle, StickyNote, UnitLabel } from '../../ui'
import { NotebookHeader } from '../shell/NotebookHeader'
import { BlockView } from './Blocks'
import { CHAPTERS, PART_WEEKS, PARTS } from './chapters'
import { CText } from './CText'
import { LAWS } from './laws'
import { CHAPTERS_BY_LAW } from './LawsPage'
import { chapterPath, CHECK_PATH, FIND_PATH, GEN_PATH, lawPath, LAWS_PATH, TESTS_PATH } from './paths'
import { useChordsProgress } from './progress'
import s from './Chords.module.css'

const PLAN: [string, string, string][] = [
  ['1', '1–3', 'Find any degree from any root; a clean chord tone'],
  ['2–3', '4', 'II–V–I and a scale in two notes'],
  ['4–5', '5', 'Comp a blues with guide-tone pairs'],
  ['6–7', '6', 'Build any 7th chord in three forms'],
  ['8–9', '7', 'II–V–I in every key'],
  ['10', '8', 'Minor II–V–I, diminished passing chords'],
  ['11–12', '9', "Choose the root's string by register"],
  ['13', '10', 'Shift without gaps. **Checkpoint** ([[TP]])'],
  ['14–16', '11', 'Four-note chords with a chosen top note'],
  ['17–19', '12', 'Rootless comping over a loop'],
  ['20–21', '13', 'Dominant colours and tritone trades'],
  ['22–24', '14', 'Any pair of tensions on any chord type'],
  ['25', '15', 'Rare chords; reduce any chord symbol. **Checkpoint**'],
  ['26–27', '16', 'Modal comping in fourths'],
  ['28–29', '17', 'Triads over roots'],
  ['30', '18', 'Motion on a static chord'],
  ['31–33', '19', 'One complete chord-melody tune. **Checkpoint**'],
  ['34–35', '20', 'Swing, bossa and ballad comping'],
  ['36', '21', 'Walking with stabs'],
  ['37', '22', 'Harmonic chords'],
  ['38–40', '23', 'Two tunes and a blues, your own arrangements'],
]

/** /chords — the method: the laws, seven parts, tools, the plan. */
export function ChordsHome() {
  const { all, learned } = useChordsProgress()
  const done = CHAPTERS.filter((c) => learned(c.id)).length
  const next = CHAPTERS.find((c) => !learned(c.id)) ?? CHAPTERS[0]
  return (
    <Notebook>
      <NotebookHeader section="Chords" aside={<><span className={s.count}>{done}/{CHAPTERS.length} ready</span></>} />
      <main>
        <Section>
          <UnitLabel>Section V · a chord method for 5-string bass</UnitLabel>
          <PageTitle>Two Hands on One Neck</PageTitle>
          <Lead>
            <CText text="Jazz piano voicing, translated to a B‑E‑A‑D‑G bass. The harmony course tells you **which** notes a chord needs; this method tells you **where** to put them, **which** to leave out, and **how** to move to the next chord with the least travel. It is the companion of the harmony course: [[R1]] to [[R7]] link back to it." />
          </Lead>
          <BlockView
            b={{
              t: 'big',
              text: 'A pianist has two hands: the left holds the bottom of the chord, the right adds colour. A bassist has one fretting hand. So we split the **neck** into a left hand and a right hand, and we split **time** when the neck is not enough.',
            }}
          />
          <BlockView
            b={{
              t: 'table',
              head: ['Piano', 'Bass'],
              rows: [
                ['Left hand (root, shell)', 'B, E and A strings, plucked by the **thumb**'],
                ['Right hand (colour, melody)', 'D and G strings, plucked by the **fingers**'],
                ['Sustain pedal', 'Letting strings ring, a reverb tail, the B3n’s Hold DLY and looper'],
                ['Two hands at once', 'Root first, chord just after ([[Law5]])'],
              ],
            }}
          />
          <FactList
            items={[
              <CText key="a" text="**Nothing to memorize.** Every shape comes from five laws. Forget a shape, rebuild it from [[Law1]]: the rebuilding is the practice." />,
              <CText key="b" text="**Every shape is computed.** Notes and degrees under each diagram are worked out from the frets, and every shape is checked: each note belongs to its chord, the hand can reach it, and anything below its clear floor ([[Law2]]) is flagged." />,
              <CText key="c" text="**See the moves.** Progressions show each voice as a line from chord to chord and each finger's move on the neck, so the voice leading ([[Law4]]) is something you can see." />,
              <CText key="d" text="**Play along.** Every progression loops with drums and the roots (as if from a looper); switch your part off and play it yourself." />,
            ]}
          />
        </Section>

        <Section>
          <StickyNote
            title={done ? `Continue: ${CHAPTERS.indexOf(next) + 1}. ${next.title}` : 'Start here: the five laws, then Chapter 1'}
            action={
              <Link className={s.goLink} to={done ? chapterPath(next.id) : LAWS_PATH}>
                {done ? 'Open →' : 'Read the laws →'}
              </Link>
            }
          >
            Move on by each chapter's "Ready when" test, not by the calendar. Forty minutes a day: 5 on tone and textures, 10 on the chapter's drills in a new key, 10
            on a test progression, 10 on a tune, 5 singing the top voice while playing only the roots.
          </StickyNote>
        </Section>

        <Section>
          <SectionTitle>How to read the shapes</SectionTitle>
          <FactList
            items={[
              <CText key="1" text="Shapes are written low string to high string, **B‑E‑A‑D‑G**: {Cmaj7:x-8-x-9-9} means B muted, E fret 8, A muted, D fret 9, G fret 9. Hover it to see it, click it to hear it." />,
              <CText key="2" text="`0` is an open string; `h7` is a natural harmonic touched over fret 7 (a diamond in the diagrams)." />,
              <CText key="3" text="Degrees use the numbers of the harmony course ([[HL1]]): R, ♭3, 3, 5, ♭7, 7, 9, 11, 13." />,
              <CText key="4" text="This method never says left or right hand: it says **fretting hand** and **plucking hand**, so it reads the same for left-handed players. Tab is the same both ways; the diagrams can be mirrored with **left-handed view** at the top." />,
              <CText key="5" text="Plucking fingers: **T** thumb, **i** index, **m** middle, **r** ring. Fretting fingers: 1 index, 2 middle, 3 ring, 4 little finger." />,
            ]}
          />
          <BlockView b={{ t: 'shapes', rows: ['Cmaj7 | x-8-x-9-9 | form A: root, a skipped string, then 7 and 3', 'G13 | x-x-8-9-9 | rootless: the root comes from the thumb or a loop'] }} />
        </Section>

        <Section>
          <SectionTitle>The engine: five laws</SectionTitle>
          <IndexList>
            {LAWS.map((l) => (
              <IndexEntry key={l.n} number={`L${l.n}`} title={<Link to={lawPath(l.n)}>{l.title}</Link>} meta={`${CHAPTERS_BY_LAW[l.n].length} chapters`}>
                <p>{l.short}</p>
              </IndexEntry>
            ))}
          </IndexList>
        </Section>

        {PARTS.map((part, pi) => (
          <Section key={part}>
            <SectionTitle>
              Part {pi} · {part} <span className={s.count}>({PART_WEEKS[pi]})</span>
            </SectionTitle>
            <IndexList>
              {CHAPTERS.map((c, i) => ({ c, i }))
                .filter(({ c }) => c.part === pi)
                .map(({ c, i }) => (
                  <IndexEntry
                    key={c.id}
                    number={`${i + 1}.`}
                    title={<Link to={chapterPath(c.id)}>{c.title}</Link>}
                    meta={learned(c.id) ? '✓ ready' : all[c.id]?.quiz ? `quiz ${all[c.id]?.quiz}%` : undefined}
                  >
                    <p>
                      <CText text={c.piano.split(/(?<=\.)\s/)[0]} />
                    </p>
                  </IndexEntry>
                ))}
            </IndexList>
          </Section>
        ))}

        <Section>
          <SectionTitle>Tools</SectionTitle>
          <IndexList>
            <IndexEntry number="✎" title={<Link to={TESTS_PATH}>The four test progressions</Link>} meta="the spiral">
              <p>The same four progressions at the end of every part, each time with the new layer: you hear your progress because the tune stays the same.</p>
            </IndexEntry>
            <IndexEntry number="✎" title={<Link to={GEN_PATH}>Progression generator</Link>} meta="any key, any layer">
              <p>Pick a progression, a key and a layer: the shapes are chosen by the laws (clear and nearest), with the moves drawn and a play-along.</p>
            </IndexEntry>
            <IndexEntry number="✎" title={<Link to={FIND_PATH}>Voicing finder</Link>} meta="every placement">
              <p>Any chord, any set of degrees: every playable way to put them under one hand, ranked by clarity.</p>
            </IndexEntry>
            <IndexEntry number="✎" title={<Link to={CHECK_PATH}>Shape checker</Link>} meta="your own shapes">
              <p>Type a chord and frets: notes, degrees, reach and mud, worked out the way every shape in the method is checked.</p>
            </IndexEntry>
          </IndexList>
        </Section>

        <Section>
          <SectionTitle>A 40-week plan</SectionTitle>
          <BlockView b={{ t: 'table', head: ['Weeks', 'Chapter', 'What you can do at the end'], rows: PLAN.map(([w, c, x]) => [w, c, x]) }} />
          <FactList
            items={[
              <CText key="h" text="**With the harmony course.** Parts 1 and 2 here need only its first part ([[HL1]] to [[HL5]]). Part 3 goes with its lessons on tensions, secondary dominants and tritone substitution ([[HL4]], [[HL7]], [[HL9]], [[HL10]]). Part 4 goes with modal interchange, modes and reharmonization ([[HL12]], [[HL16]], [[HL18]]). Whenever a harmony lesson introduces a chord, come back and voice it with whatever layer you are on." />,
              <CText key="w" text="**Hands.** Stop when anything hurts. Chords load the fretting hand more than lines do. Three short sessions beat one long one, and shapes above fret 7 need much less stretch than the same shapes near the nut." />,
            ]}
          />
        </Section>

        <Section>
          <SectionTitle>Where the ideas come from</SectionTitle>
          <FactList
            items={[
              <span key="p">
                <b>From piano:</b> two- and three-note shells (the bebop left hand, Bud Powell); rootless voicings in two alternating forms (the Bill Evans generation);
                fourths and the "So What" voicing (McCoy Tyner, Bill Evans); the 6th–diminished scale (Barry Harris); upper-structure triads and low interval limits
                (standard arranging practice). A readable piano reference for all of it: Mark Levine, <i>The Jazz Piano Book</i>.
              </span>,
              <span key="b">
                <b>From bass:</b> 10ths, harmonics and chordal playing (Jaco Pastorius); thumb-and-fingers plucking (listen to Richard Bona). Other books on bass chords:
                Chuck Sher, <i>The Improvisor's Bass Method</i>; Jonas Hellborg, <i>Chord Bassics</i>; the <i>Bass Chord Encyclopedia</i>.
              </span>,
              <span key="m">
                <b>Specific to this method:</b> the five laws, the register bands, forms A, B and C, the Grand A and Grand B families, the four-string grid with its two
                switches, and deriving every shape from 5 × strings + frets. With a teacher, describe shapes by their degrees (R‑7‑3, 3‑7‑9), which everyone understands.
              </span>,
            ]}
          />
        </Section>
      </main>
    </Notebook>
  )
}
