import { useEffect, useState } from 'react'
import { useAppState } from '../../state/AppState'
import type { Settings, Tri } from '../../state/settings'
import { Button, Checkbox, Disclosure, Field, FieldGrid, NumberInput, Select, type Option } from '../../ui'

const tri = (auto: string): Option[] => [
  { value: 'auto', label: auto },
  { value: 'on', label: 'Always' },
  { value: 'off', label: 'Never' },
]

type BoolKey = { [K in keyof Settings]: Settings[K] extends boolean ? K : never }[keyof Settings]
const CHECKS: [BoolKey, string][] = [
  ['needTempo', 'Clean runs only count at the target tempo'],
  ['sndBass', 'Play bass line'],
  ['sndChords', 'Play chords'],
  ['sndGuide', 'Play melody (songs)'],
  ['sndClick', 'Metronome click'],
  ['countIn', '1-bar count-in'],
  ['loop', 'Loop playback'],
]

/** Bass, reading aids, mastery rules, sound — and progress reset. */
export function SettingsPanel() {
  const { settings: S, setSetting, resetProgress } = useAppState()
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    if (!armed) return
    const t = setTimeout(() => setArmed(false), 4000)
    return () => clearTimeout(t)
  }, [armed])

  const triField = (k: 'tab' | 'names' | 'count' | 'finger' | 'rn', label: string, auto: string) => (
    <Field label={label}>
      <Select value={S[k]} options={tri(auto)} onChange={(v) => setSetting(k, v as Tri)} />
    </Field>
  )

  return (
    <Disclosure summary="Settings">
      <FieldGrid>
        <Field label="Bass">
          <Select
            value={S.strings}
            options={[
              { value: '5', label: '5-string (B E A D G)' },
              { value: '4', label: '4-string (E A D G)' },
            ]}
            onChange={(v) => setSetting('strings', v as Settings['strings'])}
          />
        </Field>
        {triField('tab', 'Tab under the staff', 'Auto (when helpful)')}
        {triField('names', 'Note names', 'Auto')}
        {triField('count', 'Counting (1 + 2 +)', 'Auto (when rhythm is new)')}
        {triField('finger', 'Finger numbers', 'Auto')}
        {triField('rn', 'Roman-numeral analysis', 'Auto (harmony lessons)')}
        <Field label="Exercise length">
          <Select
            value={S.bars}
            options={[{ value: 'auto', label: 'Lesson default' }, ...['4', '8', '12', '16'].map((v) => ({ value: v, label: `${v} bars` }))]}
            onChange={(v) => setSetting('bars', v as Settings['bars'])}
          />
        </Field>
        <Field label="Clean run-throughs to master a lesson">
          <NumberInput min={1} max={10} value={S.cleanNeeded} onChange={(v) => setSetting('cleanNeeded', v || 1)} />
        </Field>
        <Field label="Quiz pass mark (%)">
          <NumberInput min={50} max={100} step={5} value={S.quizPass} onChange={(v) => setSetting('quizPass', v || 90)} />
        </Field>
        {CHECKS.map(([k, label]) => (
          <Checkbox key={k} label={label} checked={S[k]} onChange={(v) => setSetting(k, v)} />
        ))}
        <Field label="Progress">
          <Button
            variant={armed ? 'ink' : 'pencil'}
            size="sm"
            onClick={() => {
              if (!armed) return setArmed(true)
              resetProgress()
              setArmed(false)
            }}
          >
            {armed ? 'Click again to erase all progress' : 'Reset progress'}
          </Button>
        </Field>
      </FieldGrid>
    </Disclosure>
  )
}
