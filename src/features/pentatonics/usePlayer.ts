import { useCallback, useEffect, useRef, useState } from 'react'
import type { BandFeel } from '../../audio/band'
import { ScorePlayer, type Highlight, type PlayOptions } from '../../audio/player'
import type { Score } from '../../engine/types'
import { useAppState } from '../../state/AppState'
import { KEYS, load, store } from '../../state/storage'

/** Only one thing on the page plays at a time. */
let active: ScorePlayer | null = null

const NONE: Highlight = { events: [], chords: [] }

/** What plays along with you: a click or a band, and whether the written line itself is heard. */
export interface Backing {
  band: BandFeel | 'click'
  line: boolean
}
const DEFAULT_BACKING: Backing = { band: 'click', line: true }

export function useBacking() {
  const [b, setB] = useState<Backing>(() => ({ ...DEFAULT_BACKING, ...load(KEYS.backing, {}) }))
  const set = useCallback((patch: Partial<Backing>) => setB((x) => {
    const next = { ...x, ...patch }
    store(KEYS.backing, next)
    return next
  }), [])
  return [b, set] as const
}

export function usePlayer() {
  const { settings: S } = useAppState()
  const [playing, setPlaying] = useState(false)
  const [highlight, setHighlight] = useState<Highlight>(NONE)
  const ref = useRef<ScorePlayer | null>(null)
  if (!ref.current) ref.current = new ScorePlayer(setHighlight, setPlaying)
  useEffect(() => () => ref.current?.stop(), [])
  const play = (score: Score, o: { tempo: number; loop: boolean; backing?: Backing }) => {
    if (active && active !== ref.current) active.stop()
    active = ref.current
    const bk = o.backing ?? DEFAULT_BACKING
    const band = bk.band === 'click' ? undefined : bk.band
    const opts: PlayOptions = {
      tempo: o.tempo,
      bass: bk.line,
      chords: S.sndChords,
      guide: false,
      click: band ? false : S.sndClick,
      countIn: S.countIn,
      loop: o.loop,
      band,
    }
    // a swing band swings the line too
    ref.current?.play(band === 'swing' ? { ...score, swing: true } : score, opts)
  }
  const stop = () => ref.current?.stop()
  return { playing, highlight, play, stop }
}
