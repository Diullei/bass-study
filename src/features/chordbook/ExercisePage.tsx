import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { KEYS as STORE, store } from '../../state/storage'
import { useHandSize } from '../../state/prefs'
import { Button, Lead, Notebook, PageTitle, Section, SectionTitle, Segmented, Select, StickyNote, Tag, UnitLabel, cx, type OptionGroup } from '../../ui'
import { NotebookHeader } from '../shell/NotebookHeader'
import { chapterById, CHAPTERS } from '../chords/chapters'
import { ChapterRef, CText } from '../chords/CText'
import { LAYERS, voiceLead } from '../chords/finder'
import { PATTERNS } from '../chords/patterns'
import { asBells } from '../chords/Practice'
import { progIn } from '../chords/progressions'
import { PenKey } from '../chords/Shapes'
import { reachWords, Voiced } from '../chords/ToolPages'
import { bookProg, exerciseById, EXERCISES, KIND_NAME, keysOf, numberOf, ROUTES, UNITS, type Exercise } from './exercises'
import { BOOK_PATH, exercisePath } from './paths'
import { useBookProgress } from './progress'
import c from '../chords/Chords.module.css'
import s from './Book.module.css'

const PLACES = [
  { value: '5', label: 'low' },
  { value: '9', label: 'middle' },
  { value: '14', label: 'high' },
]
const STYLE_WORDS = { near: 'nearest shapes', closed: 'closed', open: 'open', jump: 'one grip that travels' } as const
const placeWord = (a: number) => (a <= 6 ? 'low on the neck' : a >= 13 ? 'high on the neck' : 'the middle of the neck')

/** /chord-exercises/:id — one exercise. */
export function ExercisePage() {
  const { id = '' } = useParams()
  const E = exerciseById(id)
  useEffect(() => {
    if (E) store(STORE.bookCurrent, E.id)
  }, [E])
  if (!E) return <Navigate to={BOOK_PATH} replace />
  return <ExerciseView key={E.id} E={E} />
}

function ExerciseView({ E }: { E: Exercise }) {
  const navigate = useNavigate()
  const P = useBookProgress()
  const [hand] = useHandSize()
  const n = numberOf(E)
  const prev = EXERCISES[n - 2]
  const next = EXERCISES[n]
  const p = bookProg(E.prog)!
  const keys = keysOf(E)
  const played = P.all[E.id]?.keys ?? []
  const [key, setKey] = useState(() => keys.find((k) => !played.includes(k)) ?? keys[0])
  const [around, setAround] = useState(String(E.around ?? 9))
  const [shown, setShown] = useState<string | null>(null)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const bars = useMemo(() => progIn(p, key), [p, key])
  const out = useMemo(() => {
    const raw = voiceLead(bars.flat(), E.layer, E.dom ?? 'auto', +around, E.style ?? 'near', hand, E.only ? (f) => f.degs.every((d) => E.only!.includes(d)) : undefined)
    const V = raw.map((v) => (E.bells ? { ...v, shape: asBells(v.shape) } : v))
    let k = 0
    return { V, text: bars.map((b) => b.map(() => V[k++]).map((v) => `${v.sym}:${v.shape}`).join(' ')).join(' | ') }
  }, [bars, E, around, hand])
  const hidden = !!E.blind && shown !== key
  const done = P.done(E)
  const allKeys = keys.every((k) => played.includes(k))
  const keyName = `${key}${p.minor ? ' minor' : ''}`
  const mark = () => {
    const ks = played.includes(key) ? played : [...played, key]
    P.update(E.id, { keys: ks, ...(keys.every((k) => ks.includes(k)) ? { done: true } : {}) })
    const rest = keys.find((k) => !ks.includes(k))
    if (rest) setKey(rest)
  }
  const groups: OptionGroup[] = UNITS.map((u, ui) => ({
    label: `Unit ${ui + 1} · ${u.title}`,
    options: EXERCISES.filter((x) => x.unit === ui).map((x) => ({ value: x.id, label: `${P.done(x) ? '✓ ' : ''}${numberOf(x)}. ${x.title}` })),
  }))
  const layer = LAYERS.find((l) => l.value === E.layer)!
  const chapters = E.ch.map((id) => chapterById(id)).filter((x) => !!x)
  return (
    <Notebook>
      <NotebookHeader section="Chord exercises">
        <Button icon size="sm" title="Previous exercise" disabled={!prev} onClick={() => prev && navigate(exercisePath(prev.id))}>
          ◀
        </Button>
        <Select className={c.picker} aria-label="Exercise" value={E.id} groups={groups} onChange={(v) => navigate(exercisePath(v))} />
        <Button icon size="sm" title="Next exercise" disabled={!next} onClick={() => next && navigate(exercisePath(next.id))}>
          ▶
        </Button>
      </NotebookHeader>
      <main>
        <Section>
          <UnitLabel>
            Unit {E.unit + 1} · {UNITS[E.unit].title}
          </UnitLabel>
          <PageTitle number={`${n}.`}>{E.title}</PageTitle>
          <p className={c.uses}>
            <Tag tone={E.kind === 'review' ? 'blue' : E.kind === 'piece' ? 'green' : 'pencil'}>{KIND_NAME[E.kind]}</Tag> Read first:{' '}
            {chapters.map((ch) => (
              <ChapterRef key={ch.id} n={CHAPTERS.indexOf(ch) + 1} />
            ))}
          </p>
          <Lead>
            <CText text={E.aim} />
          </Lead>
        </Section>

        <Section>
          <SectionTitle>The assignment</SectionTitle>
          <dl className={s.sheet}>
            <dt>Progression</dt>
            <dd>
              {p.name}
              <span className={s.chart}>
                {bars.map((b, i) => (
                  <span key={i} className={s.bar}>
                    {b.join('  ')}
                  </span>
                ))}
              </span>
            </dd>
            <dt>Voicing</dt>
            <dd>
              <ChapterRef n={layer.ch} />: {layer.label.toLowerCase()} · {layer.what}
              {E.style && E.style !== 'near' ? ` · layout: ${STYLE_WORDS[E.style]}` : ''}
              {E.bells ? ' · upper notes as artificial harmonics' : ''}
            </dd>
            <dt>Where</dt>
            <dd>{E.places ? 'low, middle and high: you choose below' : placeWord(+around)}</dd>
            <dt>Texture</dt>
            <dd>
              {PATTERNS[E.pattern ?? 'split'].name}: {PATTERNS[E.pattern ?? 'split'].how}
            </dd>
            <dt>Tempo</dt>
            <dd>
              begin at <b>{E.tempo[0]}</b>, move on at <b>{E.tempo[1]}</b> bpm
            </dd>
            <dt>Keys</dt>
            <dd>{E.keys === 'one' ? `as written, in ${p.key}: the line itself goes through the roots` : `${keys.join(' → ')} (${ROUTES[E.keys].say})`}</dd>
          </dl>
          <ol className={c.steps}>
            {E.steps.map((t, i) => (
              <li key={i}>
                <CText text={t} />
              </li>
            ))}
          </ol>
        </Section>

        <Section>
          <SectionTitle>
            Play it{keys.length > 1 ? `: ${keyName}` : ''}
          </SectionTitle>
          {keys.length > 1 && (
            <div className={c.keyRow} role="radiogroup" aria-label="Key">
              {keys.map((k, i) => (
                <span key={k} className={c.keyStep}>
                  {i > 0 && (
                    <span className={c.keyArrow} aria-hidden>
                      →
                    </span>
                  )}
                  <button type="button" role="radio" aria-checked={k === key} className={cx(c.keyBtn, k === key && c.keyOn, played.includes(k) && c.keyDone)} onClick={() => setKey(k)}>
                    {k}
                    {p.minor ? 'm' : ''}
                    {played.includes(k) && <i aria-label="played">✓</i>}
                  </button>
                </span>
              ))}
            </div>
          )}
          {E.places && (
            <div className={s.places}>
              <Segmented label="Where on the neck" value={around} options={PLACES} onChange={setAround} />
              <span className={c.caption}>
                <CText text={reachWords(+around, hand, true)} />
              </span>
            </div>
          )}
          {hidden ? (
            <div className={s.blind}>
              <p>
                <CText text={`The shapes are hidden. Work them out from the symbols above (${layer.what}), play your answer, then look.`} />
              </p>
              <Button variant="ink" onClick={() => setShown(key)}>
                Show the shapes in {keyName}
              </Button>
            </div>
          ) : (
            <>
              <PenKey />
              <Voiced key={out.text} V={out.V} barsText={out.text} title={`Exercise ${n} in ${keyName}`} pattern={E.pattern ?? 'split'} tempo={E.tempo[0]} noKey />
            </>
          )}
          <div className={c.keyActions}>
            <Button variant="ink" size="sm" onClick={mark}>
              ✓ Played {keys.length > 1 ? `in ${keyName}` : 'it'} at {E.tempo[1]} bpm
              {keys.length > 1 && !allKeys ? ': next key' : ''}
            </Button>
            <span className={c.pencil}>
              {played.filter((k) => keys.includes(k)).length} of {keys.length} {keys.length > 1 ? 'keys' : 'key'}
              {played.length > 0 && (
                <>
                  {' · '}
                  <button type="button" className={c.zoneBtn} onClick={() => P.update(E.id, { keys: [], done: false })}>
                    start again
                  </button>
                </>
              )}
            </span>
          </div>
        </Section>

        <Section>
          <StickyNote
            tone={done ? 'success' : 'yellow'}
            title={done ? '✓ Done' : 'Move on when'}
            action={
              <>
                {!done && <Button onClick={() => P.update(E.id, { done: true })}>I pass the test: mark it done</Button>}
                {next ? (
                  <Button variant={done ? 'ink' : 'default'} onClick={() => navigate(exercisePath(next.id))}>
                    Exercise {n + 1} →
                  </Button>
                ) : (
                  <Button variant={done ? 'ink' : 'default'} onClick={() => navigate(BOOK_PATH)}>
                    Back to the contents
                  </Button>
                )}
              </>
            }
          >
            <Lead>
              <CText text={E.pass} />
            </Lead>
          </StickyNote>
        </Section>
      </main>
    </Notebook>
  )
}
