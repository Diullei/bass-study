import { useMemo, useState } from 'react'
import { useHandSize } from '../../state/prefs'
import { KEYS as STORE, load, store } from '../../state/storage'
import { Button, Checkbox, Field, FieldGrid, Section, SectionTitle, Segmented, Select, cx } from '../../ui'
import { CText } from './CText'
import { LAYERS, voiceLead, type Layer, type Style } from './finder'
import { PRACTICE, type PracticePlan } from './practice'
import { progById, progIn } from './progressions'
import { reachWords, Voiced } from './ToolPages'
import s from './Chords.module.css'

/** The twelve keys in the order of practice: each one a fourth above the last. */
const CYCLE = ['C', 'F', 'B♭', 'E♭', 'A♭', 'D♭', 'F♯', 'B', 'E', 'A', 'D', 'G']

/** Where the hand works: the fret the shapes are pulled towards. Higher up the hand covers more frets, so more shapes exist. */
const REGIONS = [
  { value: '5', label: 'low' },
  { value: '9', label: 'middle' },
  { value: '14', label: 'high' },
]

type PStyle = Exclude<Style, 'near'>
const STYLES: { value: PStyle; label: string; what: string }[] = [
  { value: 'closed', label: 'closed', what: '**Closed:** the notes as close together as the neck allows, and the hand stays in one place. The lowest keys can get thick ([[Law2]]): a red ring marks a note in the mud.' },
  { value: 'open', label: 'open', what: '**Open:** the notes spread wide, the bottom note dropped to a lower string. Clear in any key, and a bigger reach across the strings.' },
  { value: 'jump', label: 'jump', what: '**Jump:** one grip for every chord. The fingers keep their shape and the whole hand travels ([[Ch10]]).' },
]

/**
 * The end of a chapter: its progressions, to take round the twelve keys in fourths, in the voicing the chapter teaches.
 * The shapes are worked out for the key and the style chosen, so every key shows its own voicing.
 */
export function Practice({ chapter, plan: given }: { /** An id for remembering the keys played: a chapter of the chord method, or "harmony:…". */ chapter: string; /** A plan from outside the chord method (the harmony lessons). */ plan?: PracticePlan }) {
  const plan = given ?? PRACTICE[chapter]
  const [hand] = useHandSize()
  const [pid, setPid] = useState(plan?.progs[0] ?? '')
  const [layer, setLayer] = useState<Layer>(plan?.layers[0] ?? 'shell')
  const [style, setStyle] = useState<PStyle>(plan?.style ?? 'closed')
  const [key, setKey] = useState('C')
  const [region, setRegion] = useState('9')
  const [bells, setBells] = useState(!!plan?.artificial)
  const [done, setDone] = useState<Record<string, string[]>>(() => load(STORE.chordsPractice, {}))
  const p = progById(pid)
  const slot = `${chapter}:${pid}:${layer}:${style}`
  const played = done[slot] ?? []
  const out = useMemo(() => {
    if (!p) return null
    const bars = progIn(p, key)
    const run = (st: Style) => voiceLead(bars.flat(), layer, 'auto', +region, st, hand)
    // the harmonics chapter: every note above the lowest becomes an artificial harmonic of itself
    const asBells = (shape: string) => {
      let low = true
      return shape
        .split('-')
        .map((t) => {
          if (t === 'x') return t
          const first = low
          low = false
          return first || +t < 1 || +t > 12 ? t : `a${t}`
        })
        .join('-')
    }
    const raw = run(style)
    const V = raw.map((v) => (bells ? { ...v, shape: asBells(v.shape) } : v))
    let k = 0
    const text = bars.map((b) => b.map(() => V[k++]).map((v) => `${v.sym}:${v.shape}`).join(' ')).join(' | ')
    // closed and open can land on the same shapes (two notes on two strings leave no choice): say so
    const twin = style !== 'jump' && run(style === 'closed' ? 'open' : 'closed').every((v, i) => v.shape === raw[i].shape)
    return { V, text, twin }
  }, [p, key, layer, style, hand, bells, region])
  if (!plan || !p || !out) return null
  const mark = () => {
    const next = { ...done, [slot]: played.includes(key) ? played : [...played, key] }
    setDone(next)
    store(STORE.chordsPractice, next)
    setKey(CYCLE[(CYCLE.indexOf(key) + 1) % 12])
  }
  const reset = () => {
    const next = { ...done, [slot]: [] }
    setDone(next)
    store(STORE.chordsPractice, next)
  }
  const what = STYLES.find((x) => x.value === style)!.what
  return (
    <Section>
      <SectionTitle>Practice: round the twelve keys</SectionTitle>
      <p className={s.practiceTask}>
        <CText text={plan.task} />
      </p>
      <FieldGrid>
        <Field label="Progression (easiest first)">
          <Select value={pid} options={plan.progs.map((id, i) => ({ value: id, label: `${i + 1}. ${progById(id)?.name ?? id}` }))} onChange={setPid} />
        </Field>
        {plan.layers.length > 1 && (
          <Field label="Voicing">
            <Select value={layer} options={plan.layers.map((l) => ({ value: l, label: LAYERS.find((x) => x.value === l)!.label }))} onChange={(v) => setLayer(v as Layer)} />
          </Field>
        )}
        <Field label="How the chords are laid out">
          <Segmented label="How the chords are laid out" value={style} options={STYLES.map(({ value, label }) => ({ value, label }))} onChange={setStyle} />
        </Field>
        <Field label="Where on the neck">
          <Segmented label="Where on the neck" value={region} options={REGIONS} onChange={setRegion} />
        </Field>
      </FieldGrid>
      {plan.artificial && <Checkbox label="upper notes as artificial harmonics" checked={bells} onChange={setBells} />}
      <p className={s.caption}>
        <CText text={what} />
        {out.twin && ' In this key and voicing, closed and open give the same shapes.'}
      </p>
      {region !== '9' && (
        <p className={s.caption}>
          <CText text={reachWords(+region, hand, true)} />
        </p>
      )}
      <div className={s.keyRow} role="radiogroup" aria-label="Key, in fourths">
        {CYCLE.map((k, i) => (
          <span key={k} className={s.keyStep}>
            {i > 0 && (
              <span className={s.keyArrow} aria-hidden>
                →
              </span>
            )}
            <button type="button" role="radio" aria-checked={k === key} className={cx(s.keyBtn, k === key && s.keyOn, played.includes(k) && s.keyDone)} onClick={() => setKey(k)}>
              {k}
              {p.minor ? 'm' : ''}
              {played.includes(k) && <i aria-label="played">✓</i>}
            </button>
          </span>
        ))}
      </div>
      <div className={s.keyActions}>
        <Button variant="ink" size="sm" onClick={mark}>
          ✓ Played in {key}
          {p.minor ? ' minor' : ''}: next key, up a fourth
        </Button>
        <span className={s.pencil}>
          {played.length} of 12 keys with this progression and layout
          {played.length > 0 && (
            <>
              {' · '}
              <button type="button" className={s.zoneBtn} onClick={reset}>
                start again
              </button>
            </>
          )}
        </span>
      </div>
      <Voiced key={out.text} V={out.V} barsText={out.text} title={`${p.name} in ${key}${p.minor ? ' minor' : ''}`} pattern={pid.includes('blues') ? 'four' : pid === 'bossa' ? 'bossa' : 'split'} noKey />
    </Section>
  )
}
