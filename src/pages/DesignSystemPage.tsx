import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import type { Highlight } from '../audio/player'
import { LESSONS } from '../curriculum/lessons'
import { generate, lessonIntro, type Score } from '../engine'
import { Fretboard } from '../notation/Fretboard'
import { Staff } from '../notation/Staff'
import {
  Button,
  Checkbox,
  Choice,
  ChoiceList,
  Disclosure,
  FactList,
  Field,
  FieldGrid,
  IndexEntry,
  IndexList,
  Kbd,
  Lead,
  Marker,
  Notebook,
  NumberInput,
  PageTitle,
  Paper,
  PencilNote,
  PenMessage,
  Row,
  SectionTitle,
  Select,
  Slider,
  StickyNote,
  Tag,
  Tally,
  UnitLabel,
} from '../ui'
import { PenHead } from '../features/ideas/RoleLegend'
import { NotebookHeader } from '../features/shell/NotebookHeader'
import s from './DesignSystemPage.module.css'

const GEN = { strings: '5', bars: 'auto' } as const

/** One component specimen: name, import path, guidance, live demo. */
function Spec({ id, name, path, children, text, column }: {
  id: string
  name: string
  path?: string
  text?: ReactNode
  column?: boolean
  children?: ReactNode
}) {
  return (
    <section id={id} className={s.spec}>
      <div className={s.specHead}>
        <h3>{name}</h3>
        {path && <code className={s.path}>{path}</code>}
      </div>
      {text && <p className={s.specText}>{text}</p>}
      {children && <div className={`${s.demo} ${column ? s.col : ''}`}>{children}</div>}
    </section>
  )
}

const Caption = ({ children }: { children: ReactNode }) => <span className={s.caption}>{children}</span>

const COLORS: [string, string, string][] = [
  ['--paper', 'Notebook page', 'Page background, ruled every 32px.'],
  ['--paper-sheet', 'Manuscript sheet', 'Paper that holds notation.'],
  ['--desk', 'Desk', 'Behind the notebook.'],
  ['--ink', 'Ink', 'Text, notation, primary buttons.'],
  ['--ink-soft', 'Faded ink', 'Borders, secondary strokes.'],
  ['--pencil', 'Pencil', 'Helpers: labels, counting, status.'],
  ['--staff', 'Staff lines', 'The five lines and tab lines.'],
  ['--red-pen', 'Red pen', 'Corrections, playback, numbering.'],
  ['--green-pen', 'Green pen', 'Right answers.'],
  ['--highlighter', 'Highlighter', 'Hover, key words.'],
  ['--sticky', 'Sticky note', 'Goals and reminders.'],
  ['--margin-line', 'Margin line', 'The red rule at the left.'],
  ['--cover', 'Cover cloth', 'The bound cover on the contents page.'],
  ['--elastic', 'Elastic band', 'The strap across the cover.'],
  ['--tab-blue', 'Index tab', 'One --tab-* colour per notebook section.'],
  ['--blue-pen', 'Blue pen', 'A third voice, e.g. the third pentatonic in a weave.'],
  ['--purple-pen', 'Purple pen', 'Outside notes: approach notes, blue notes, side-slips.'],
  ['--marker-pink', 'Pink marker', 'Colour tones (tension) in the Idea Builder.'],
]

const TYPE: [string, string, ReactNode][] = [
  ['--font-hand · 34px', 'Page title (Kalam bold)', <h2 key="a" style={{ fontSize: 'var(--fs-2xl)' }}>The ii–V–I</h2>],
  ['--font-hand · 21px', 'Section title', <h3 key="b" style={{ fontSize: 'var(--fs-lg)' }}>Chart reading</h3>],
  ['--font-body · 18px', 'Body (Patrick Hand)', <span key="c">Play the root on every beat — the letter name of the chord.</span>],
  ['--font-hand · 15px', 'Pencil note', <span key="d" style={{ font: '400 var(--fs-sm) var(--font-hand)', color: 'var(--pencil)' }}>Unit 11 · Jazz harmony I</span>],
  ['--font-mono · 11px', 'Stamp / code', <span key="e" style={{ font: '700 11px var(--font-mono)', letterSpacing: '.12em' }}>THEORY</span>],
]

export function DesignSystemPage() {
  const scaleDemo = useMemo(() => {
    const L = LESSONS.find((x) => x.demo?.type === 'scale')!
    return lessonIntro(L, GEN).paper as Score
  }, [])
  const chordDemo = useMemo(() => {
    const L = LESSONS.find((x) => x.demo?.type === 'romans' && x.demo.items.length === 7 && x.demo.items[0] === 'Imaj7')!
    return lessonIntro(L, GEN).paper as Score
  }, [])
  const walking = useMemo(() => generate(LESSONS.find((x) => x.t === 'The ii–V–I')!, GEN) as Score, [])
  const song = useMemo(() => generate(LESSONS.find((x) => x.song === 'minuet')!, GEN) as Score, [])

  // a fake playhead to show the red-pen highlight
  const [hl, setHl] = useState<Highlight>({ events: [], chords: [] })
  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      const ev = walking.events[i % walking.events.length]
      setHl({ events: [i % walking.events.length], chords: ev.ci != null ? [ev.ci] : [] })
      i++
    }, 450)
    return () => clearInterval(t)
  }, [walking])

  const [choice, setChoice] = useState('8')
  const [check, setCheck] = useState(true)
  const [tempo, setTempo] = useState(96)

  return (
    <Notebook>
      <NotebookHeader section="Design system" />

      <div className={s.layout}>
        <nav className={s.toc} aria-label="Contents">
          <span className={s.tocGroup}>Foundations</span>
          <a href="#colors">Colour</a>
          <a href="#type">Type</a>
          <a href="#shape">Shape &amp; paper</a>
          <span className={s.tocGroup}>Components</span>
          <a href="#notebook">Notebook</a>
          <a href="#headings">Headings</a>
          <a href="#text">Text</a>
          <a href="#buttons">Button</a>
          <a href="#tags">Tag</a>
          <a href="#forms">Form controls</a>
          <a href="#choice">Choice</a>
          <a href="#tally">Tally</a>
          <a href="#sticky">Sticky note</a>
          <a href="#paper">Paper</a>
          <a href="#disclosure">Disclosure</a>
          <a href="#index">Index entry</a>
          <span className={s.tocGroup}>Notation</span>
          <a href="#staff">Staff</a>
          <a href="#playback">Playback highlight</a>
          <a href="#song">Repeats &amp; endings</a>
          <a href="#pens">Pens</a>
          <a href="#fretboard">Fretboard</a>
        </nav>

        <main>
          <div className={s.intro}>
            <UnitLabel>Design system</UnitLabel>
            <PageTitle>The practice notebook</PageTitle>
            <Lead>
              Everything in the app is drawn as if it were a musician&apos;s notebook: <Marker>ruled paper</Marker>,
              ink for what you read, pencil for helpers you will stop needing, red pen for corrections and the
              playhead, sticky notes for goals. Components live in <code>src/ui</code>, notation in{' '}
              <code>src/notation</code>.
            </Lead>
            <FactList
              items={[
                'Ink is for the music; pencil is for help. If a thing will disappear as the student improves (tab, counting, note names), write it in pencil.',
                'Red pen means "look here": the lesson number, the playing note, a wrong answer.',
                'Shapes are never perfect: borders use irregular radii (--wobble-*) and notation strokes have a small, repeatable jitter.',
                'One main action per row — the ink-filled button.',
              ]}
            />
          </div>

          {/* ---------------- foundations ---------------- */}
          <div className={s.group}>
            <h2>Foundations</h2>
            <Spec id="colors" name="Colour" path="src/styles/tokens.css" text="Paper, ink, pencil and pens. Use the tokens, never raw hex values.">
              <div className={s.swatches} style={{ width: '100%' }}>
                {COLORS.map(([v, name, use]) => (
                  <div key={v} className={s.swatch}>
                    <div className={s.chip} style={{ background: `var(${v})` }} />
                    <b>{name}</b> <code>{v}</code>
                    <div style={{ color: 'var(--pencil)' }}>{use}</div>
                  </div>
                ))}
              </div>
            </Spec>
            <Spec id="type" name="Type" text="Kalam for anything written large or labelled; Patrick Hand for reading text — both handwritten, both legible at small sizes." column>
              {TYPE.map(([token, name, sample]) => (
                <div key={token} className={s.typeRow}>
                  <div>
                    <b>{name}</b>
                    <br />
                    <code>{token}</code>
                  </div>
                  <div>{sample}</div>
                </div>
              ))}
            </Spec>
            <Spec id="shape" name="Shape & paper" text="Three pen-drawn radii. Sheets get a soft shadow and optional tape; sticky notes a folded corner. Scrollbars are a thin pencil stroke (--scroll-* tokens), never the browser default.">
              <div className={s.shapes}>
                {['--wobble-1', '--wobble-2', '--wobble-3'].map((w) => (
                  <div key={w} className={s.shape} style={{ borderRadius: `var(${w})` }}>
                    {w}
                  </div>
                ))}
              </div>
            </Spec>
          </div>

          {/* ---------------- components ---------------- */}
          <div className={s.group}>
            <h2>Components</h2>

            <Spec id="notebook" name="Notebook" path="ui/Notebook" text="The page shell: ruled lines every 32px, a red margin line and punched holes. This page is a Notebook. On phones the holes go and the margin moves in." />

            <Spec id="headings" name="Headings" path="ui/Heading" column>
              <div>
                <UnitLabel>Unit 11 · Jazz harmony I · the ii–V–I</UnitLabel>
                <PageTitle number="71." tags={<Tag tone="blue">theory</Tag>}>
                  The ii–V–I
                </PageTitle>
                <SectionTitle>Chart reading</SectionTitle>
              </div>
              <Caption>UnitLabel · PageTitle (number in red pen, optional tags) · SectionTitle (hand-underlined)</Caption>
            </Spec>

            <Spec id="text" name="Text" path="ui/Text" column>
              <Lead>Lead — the opening paragraph of a lesson. ii7 – V7 – Imaj7 is the most important progression in jazz.</Lead>
              <FactList items={['FactList — one fact per line, marked with a ♪.', <>Facts can hold <b>bold ink</b> for the thing to remember.</>]} />
              <PencilNote>
                PencilNote — status: best score <b>80%</b> · pass mark 90%
              </PencilNote>
              <PenMessage>PenMessage — Nice — but this one doesn&apos;t count yet: bring the tempo up to 80.</PenMessage>
              <p>
                <Marker>Marker</Marker> highlights a key phrase; <Kbd>Space</Kbd> <Kbd>N</Kbd> show keys.
              </p>
            </Spec>

            <Spec id="buttons" name="Button" path="ui/Button" text="Ink = the one main action. Default = pen outline. Pencil (dashed) = secondary. Ghost = text link. Hover adds highlighter; press nudges the button.">
              <Button variant="ink">▶ Play</Button>
              <Button>✓ I played it clean</Button>
              <Button variant="pencil">New exercise</Button>
              <Button variant="ghost">Skip</Button>
              <Button disabled>Disabled</Button>
              <Button size="sm">Small</Button>
              <Button icon size="sm" aria-label="Previous">
                ◀
              </Button>
              <Button icon size="sm" aria-label="Next">
                ▶
              </Button>
            </Spec>

            <Spec id="tags" name="Tag" path="ui/Tag" text="A rubber stamp to classify a lesson.">
              <Tag>chart</Tag>
              <Tag tone="blue">theory</Tag>
              <Tag tone="red">song</Tag>
              <Tag tone="green">mastered</Tag>
            </Spec>

            <Spec id="forms" name="Form controls" path="ui/Form" text="Values are written on a line, like filling in a form by hand. Checkboxes are ticked in red pen.">
              <FieldGrid style={{ width: '100%' }}>
                <Field label="Exercise length">
                  <Select
                    value={choice}
                    onChange={setChoice}
                    options={['4', '8', '12', '16'].map((v) => ({ value: v, label: `${v} bars` }))}
                  />
                </Field>
                <Field label="Quiz pass mark (%)">
                  <NumberInput value={90} min={50} max={100} step={5} readOnly />
                </Field>
                <Field label={`Tempo ♩ = ${tempo}`}>
                  <Slider min={40} max={220} step={2} value={tempo} onChange={setTempo} />
                </Field>
                <Checkbox label="Play bass line" checked={check} onChange={setCheck} />
                <Checkbox label="Loop playback" checked={!check} onChange={(v) => setCheck(!v)} />
              </FieldGrid>
            </Spec>

            <Spec id="choice" name="Choice" path="ui/Choice" text="Quiz answers. The right one is circled in green; a wrong pick is crossed out in red.">
              <ChoiceList>
                <Choice>minor 3rd</Choice>
                <Choice state="right">major 3rd</Choice>
                <Choice state="wrong">perfect 4th</Choice>
                <Choice disabled>tritone</Choice>
              </ChoiceList>
            </Spec>

            <Spec id="tally" name="Tally" path="ui/Tally" text="Clean run-throughs, counted the way you would on paper. Empty slots are faint; the fifth stroke crosses in red.">
              <span>
                <Tally count={0} total={3} />
                <Caption>0 of 3</Caption>
              </span>
              <span>
                <Tally count={2} total={3} />
                <Caption>2 of 3</Caption>
              </span>
              <span>
                <Tally count={5} total={5} />
                <Caption>5 of 5</Caption>
              </span>
              <span>
                <Tally count={7} total={10} />
                <Caption>7 of 10</Caption>
              </span>
            </Spec>

            <Spec id="sticky" name="Sticky note" path="ui/StickyNote" column>
              <StickyNote title="To master this lesson" action={<Button>Next lesson →</Button>}>
                3 clean run-throughs and 90% on the quiz.
              </StickyNote>
              <StickyNote tone="success" title="✓ Lesson mastered" action={<Button variant="ink">Next lesson →</Button>}>
                Next: Guide tones: 3rds and 7ths
              </StickyNote>
            </Spec>

            <Spec id="paper" name="Paper" path="ui/Paper" text="A sheet of manuscript paper on the page. Use tape for the lesson's 'new material', a slight tilt so sheets don't line up perfectly.">
              <Paper tape tilt="left" label="new" style={{ width: 280, height: 120 }} />
              <Paper tilt="right" style={{ width: 280, height: 120 }} />
            </Spec>

            <Spec id="index" name="Index entry" path="ui/IndexEntry" text="A line of the contents page: red-pen number, title, dotted leader, and a description on the ruled lines below. A long title wraps onto the next lines and the leader follows its last line. Sections not written yet are muted pencil." column>
              <IndexList>
                <IndexEntry number="I." title={<Link to="/">Bass Method</Link>} meta="18 units">
                  <p>From the open strings to walking bass, a lesson at a time.</p>
                </IndexEntry>
                <IndexEntry number="R5" title={<Link to="/harmony/rules#rule-5">A chord's scale is the key, plus only the changes the chord forces</Link>} meta="9 lessons">
                  <p>A long title: it wraps instead of running off the page.</p>
                </IndexEntry>
                <IndexEntry number="III." title="to be written…" muted>
                  The next section goes here.
                </IndexEntry>
              </IndexList>
            </Spec>

            <Spec id="disclosure" name="Disclosure" path="ui/Disclosure" column>
              <Disclosure summary="Settings">
                <PencilNote>Anything optional goes in a fold-out, framed in dashed pencil.</PencilNote>
              </Disclosure>
            </Spec>
          </div>

          {/* ---------------- notation ---------------- */}
          <div className={s.group}>
            <h2>Notation</h2>
            <Spec
              id="staff"
              name="Staff"
              path="notation/Staff · renderScore()"
              text="Hand-drawn bass clef from a Score. Aids are flags: tab, names, count, finger, rn (roman numerals), syms (chord symbols). It re-lays out to the width of its container."
              column
            >
              <Paper tape label="tab · names · finger · scale degrees">
                <Staff score={scaleDemo} flags={{ tab: true, names: true, finger: true, rn: true, syms: true, noFinal: true }} />
              </Paper>
              <Paper label="chord symbols · roman numerals">
                <Staff score={chordDemo} flags={{ syms: true, rn: true, names: true, noFinal: true }} />
              </Paper>
            </Spec>
            <Spec id="playback" name="Playback highlight" text="During playback the red pen follows the sounding note and chord." column>
              <Paper>
                <Staff score={walking} flags={{ syms: true, rn: true }} highlight={hl} />
              </Paper>
            </Spec>
            <Spec id="song" name="Repeats & endings" text="Songs carry a title, credit, repeat signs and 1st/2nd endings." column>
              <Paper tilt="left">
                <Staff score={song} flags={{ syms: true, finger: true }} />
              </Paper>
            </Spec>
            <Spec
              id="pens"
              name="Pens"
              path="styles/notation.css · MusicEvent.cls"
              text="A note can be written in a different pen to show what it is doing. Set cls on a score event: pen-pencil (passing), pen-green (guide tone), pen-blue, pen-purple (outside / approach), pen-marker (the motif, highlighted), pen-tension (colour tone), pen-ghost (ghost note). Never red for a note: the red pen is the playback cursor. Used by the Idea Builder and the Pentatonics class."
            >
              {['', 'pen-green', 'pen-blue', 'pen-pencil', 'pen-purple', 'pen-marker', 'pen-tension', 'pen-ghost'].map((pen) => (
                <span key={pen} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <PenHead pen={pen} />
                  <code>{pen || 'ink'}</code>
                </span>
              ))}
            </Spec>
            <Spec
              id="fretboard"
              name="Fretboard"
              path="notation/Fretboard"
              text="A hand-drawn neck, G string on top as in tab. Dots carry a label (an interval or a degree) and a pen; filled dots mark a root."
              column
            >
              <Fretboard
                strings={4}
                from={3}
                to={10}
                dots={[
                  { str: 0, fret: 5, label: 'R', root: true },
                  { str: 0, fret: 8, label: '♭3' },
                  { str: 1, fret: 5, label: '4' },
                  { str: 1, fret: 7, label: '5', pen: 'pen-green' },
                  { str: 2, fret: 5, label: '♭7', pen: 'pen-blue' },
                  { str: 2, fret: 7, label: 'R', root: true },
                  { str: 3, fret: 5, label: '♭3' },
                  { str: 3, fret: 7, label: '4', pen: 'pen-purple' },
                ]}
              />
            </Spec>
          </div>
          <Row style={{ marginTop: 'var(--sp-7)' }}>
            <Link to="/">← back to the contents</Link>
          </Row>
        </main>
      </div>
    </Notebook>
  )
}
