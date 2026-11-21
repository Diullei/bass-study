import { useEffect, useState } from 'react'
import { nm } from '../../theory/notes'
import { Field, FieldGrid, Lead, Notebook, PageTitle, Section, SectionTitle, Segmented, Select, UnitLabel } from '../../ui'
import { NotebookHeader } from '../shell/NotebookHeader'
import { BlockView, DeriveView, ScaleView } from './Blocks'
import { HText } from './HText'
import { derive, MINOR_TONICS, nameScale, parseChord, SCALES, TONICS, type Mode } from './theory'

const ROOTS = ['C', 'C♯', 'D♭', 'D', 'D♯', 'E♭', 'E', 'F', 'F♯', 'G♭', 'G', 'G♯', 'A♭', 'A', 'A♯', 'B♭', 'B']
const QUALS = [
  { value: 'maj7', label: 'maj7' },
  { value: 'm7', label: 'm7' },
  { value: '7', label: '7' },
  { value: 'm7♭5', label: 'm7♭5' },
  { value: 'o7', label: 'o7' },
  { value: 'm6', label: 'm6' },
  { value: 'm(maj7)', label: 'm(maj7)' },
  { value: '7sus4', label: '7sus4' },
]

/** /harmony/workshop — Rule 5 and Rule 6 on any chord in any key. */
export function WorkshopPage() {
  const [mode, setMode] = useState<Mode>('major')
  const [key0, setKey] = useState('C')
  const [root, setRoot] = useState('A')
  const [q, setQ] = useState('7')
  const keys = (mode === 'major' ? TONICS : MINOR_TONICS).map(nm)
  const key = keys.includes(key0) ? key0 : keys[0]
  const chord = root + q
  const c = parseChord(chord)!
  const { steps, clash } = derive(parseChord(key)!.root, mode, c)
  const derived = clash ? null : nameScale(c.root, steps.map((x) => x.out))
  const [scale, setScale] = useState<string>('')
  useEffect(() => setScale(''), [chord, key, mode])
  const shown = scale || derived || 'mixolydian'

  return (
    <Notebook>
      <NotebookHeader section="Jazz Harmony" />
      <main>
        <Section>
          <UnitLabel>Tool</UnitLabel>
          <PageTitle>Chord-scale workshop</PageTitle>
          <Lead>
            <HText text="Pick a key and a chord. The workshop builds the chord's scale with [[R5]] and sorts its notes with [[R6]], step by step. Predict every note before you look." />
          </Lead>
          <FieldGrid>
            <Field label="Key">
              <Select value={key} options={keys.map((k) => ({ value: k, label: k }))} onChange={setKey} />
            </Field>
            <Field label="Mode">
              <Segmented label="Mode" value={mode} options={[{ value: 'major', label: 'major' }, { value: 'minor', label: 'minor' }]} onChange={setMode} />
            </Field>
            <Field label="Chord root">
              <Select value={root} options={ROOTS.map((r) => ({ value: r, label: r }))} onChange={setRoot} />
            </Field>
            <Field label="Chord type">
              <Select value={q} options={QUALS} onChange={setQ} />
            </Field>
          </FieldGrid>
        </Section>
        <Section>
          <DeriveView key={chord + key + mode} keyName={key} mode={mode} chord={chord} />
        </Section>
        <Section>
          <SectionTitle>On the keyboard</SectionTitle>
          <FieldGrid>
            <Field label="Scale">
              <Select
                value={shown}
                options={Object.entries(SCALES).map(([id, x]) => ({ value: id, label: x.name + (id === derived ? ' (from the key)' : '') }))}
                onChange={setScale}
              />
            </Field>
          </FieldGrid>
          <ScaleView key={chord + shown} chord={chord} scale={shown} caption={clash ? 'Rule 5 gave no clean answer here, so try the scales of [[L10]] and listen.' : undefined} />
        </Section>
      </main>
    </Notebook>
  )
}

const SHEET: [string, string, string][] = [
  ['Cmaj7', 'ionian', 'Imaj7'],
  ['Dm7', 'dorian', 'IIm7'],
  ['Em7', 'phrygian', 'IIIm7'],
  ['Fmaj7', 'lydian', 'IVmaj7'],
  ['G7', 'mixolydian', 'V7'],
  ['Am7', 'aeolian', 'VIm7'],
  ['Bm7♭5', 'locrian', 'VIIm7♭5'],
  ['G7', 'mixob9b13', 'V7 → minor'],
  ['D♭7', 'lyddom', 'SubV7 / ♭VII7'],
  ['G7', 'altered', 'V7alt'],
  ['G7', 'hw', 'V7♭9 (13)'],
  ['G7sus4', 'mixolydian', 'V7sus4'],
  ['Cm6', 'melmin', 'Im6 (minor key)'],
  ['Cm(maj7)', 'melmin', 'Im(maj7) (minor key)'],
  ['Dm7♭5', 'locrian2', 'IIm7♭5 (minor key)'],
  ['Fm7', 'dorian', 'IVm7 (borrowed)'],
  ['A♭maj7', 'lydian', '♭VImaj7 (borrowed)'],
  ['Co7', 'wh', 'o7'],
]

/** /harmony/cheat-sheet — every chord scale of the course, computed. */
export function CheatSheetPage() {
  return (
    <Notebook>
      <NotebookHeader section="Jazz Harmony" />
      <main>
        <Section>
          <UnitLabel>Tool</UnitLabel>
          <PageTitle>Chord-scale cheat sheet</PageTitle>
          <Lead>
            <HText text="Use this to **check** your answers, not to memorize. No row is typed in: each one is computed with [[R6]] from the chord and its scale, and each scale comes from [[R5]]. Examples in C." />
          </Lead>
        </Section>
        <Section>
          <BlockView b={{ t: 'cstable', rows: SHEET.map(([c, sc, f]) => [c, sc, f]) }} />
        </Section>
      </main>
    </Notebook>
  )
}
