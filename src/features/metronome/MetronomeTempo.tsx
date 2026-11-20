import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

/**
 * The metronome lives once, at the top of the app. A page that has a working tempo
 * (a lesson, a drill) offers it here, and the metronome shows a "♩ = tempo" button for it.
 */
interface Ctx {
  tempo: number | null
  setTempo: (t: number | null) => void
}

const TempoCtx = createContext<Ctx>({ tempo: null, setTempo: () => {} })

export function MetronomeTempoProvider({ children }: { children: ReactNode }) {
  const [tempo, setTempo] = useState<number | null>(null)
  return <TempoCtx.Provider value={{ tempo, setTempo }}>{children}</TempoCtx.Provider>
}

/** The tempo the current page suggests, if any. */
export const useSuggestedTempo = () => useContext(TempoCtx).tempo

/** Offer this page's tempo to the metronome while the page is open. */
export function useOfferTempo(tempo: number | null | undefined) {
  const { setTempo } = useContext(TempoCtx)
  useEffect(() => {
    setTempo(tempo ?? null)
    return () => setTempo(null)
  }, [tempo, setTempo])
}
