import type { Lesson } from '../curriculum/types'
import type { RenderFlags } from '../notation/renderScore'

/** Show a helper always, never, or when the lesson needs it. */
export type Tri = 'auto' | 'on' | 'off'

export interface Settings {
  strings: '4' | '5'
  tab: Tri
  names: Tri
  count: Tri
  finger: Tri
  rn: Tri
  bars: 'auto' | '4' | '8' | '12' | '16'
  cleanNeeded: number
  quizPass: number
  needTempo: boolean
  sndBass: boolean
  sndChords: boolean
  sndGuide: boolean
  sndClick: boolean
  countIn: boolean
  loop: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  strings: '5',
  tab: 'auto',
  names: 'auto',
  count: 'auto',
  finger: 'auto',
  rn: 'auto',
  bars: 'auto',
  cleanNeeded: 3,
  quizPass: 90,
  needTempo: true,
  sndBass: true,
  sndChords: true,
  sndGuide: true,
  sndClick: true,
  countIn: true,
  loop: false,
}

/** Older saves stored `strings` as a number. */
export function normalizeSettings(raw: Partial<Settings> & Record<string, unknown>): Settings {
  const s = { ...DEFAULT_SETTINGS, ...raw }
  s.strings = String(s.strings) === '4' ? '4' : '5'
  s.bars = String(s.bars) as Settings['bars']
  return s
}

type Helper = 'tab' | 'names' | 'count' | 'finger' | 'rn'

/** Whether a reading aid is shown for this lesson ("auto" fades them out as the method goes on). */
export function helperOn(L: Lesson, S: Settings, w: Helper): boolean {
  const v = S[w]
  if (v === 'on') return true
  if (v === 'off') return false
  switch (w) {
    case 'tab':
      return L.u <= 1 || (L.u === 7 && !L.chart)
    case 'names':
      return L.u <= 2
    case 'finger':
      return L.u <= 7 && !L.chart
    case 'count':
      return L.u <= 1 || L.newR.length > 0 || L.time === 6
    case 'rn':
      return !!L.chart && L.u >= 7
  }
}

export const exerciseFlags = (L: Lesson, S: Settings): RenderFlags => ({
  tab: helperOn(L, S, 'tab'),
  names: helperOn(L, S, 'names'),
  count: helperOn(L, S, 'count'),
  finger: helperOn(L, S, 'finger'),
  rn: helperOn(L, S, 'rn'),
  syms: true,
  nStr: S.strings === '4' ? 4 : 5,
})
