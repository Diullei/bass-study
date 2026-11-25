import { useMemo } from 'react'
import { useHandSize } from '../../state/prefs'
import { voiceLead, type Layer } from './finder'
import { chordScale, type ScaleId } from './scales'
import { ShapesBlock } from './Shapes'
import { parseSym } from './voicing'

/** Symbols as other parts of the notebook write them → the chord method's spelling (Co7 → C°7). */
export const normSym = (sym: string) => sym.replace(/^([A-G][♭♯b#]?)o/, '$1°').replace(/sus4/, 'sus')

/** The harmony course's scale ids → the chord method's. */
const SCALE_ID: Record<string, ScaleId> = {
  ionian: 'ionian', dorian: 'dorian', phrygian: 'phrygian', lydian: 'lydian', mixolydian: 'mixolydian', aeolian: 'aeolian', locrian: 'locrian',
  locrian2: 'locrian2', mixob13: 'mixoB13', mixob9b13: 'phrygDom', lyddom: 'lydDom', altered: 'altered', hw: 'halfWhole', wholetone: 'wholeTone',
  melmin: 'melodic', harmmin: 'harmonic', wh: 'wholeHalf',
}

/**
 * A chord, or a row of chords, on the bass: each one in the clearest shape that keeps the hand and the voices
 * moving as little as possible (the chord method's engine). A symbol that names a colour (G13, Dm9) gets it.
 * Renders nothing when a symbol is outside what the engine knows.
 */
export function OnBass({ chords, title, layer = 'shell', caption, row, scale }: { chords: string[]; title?: string; layer?: Layer; caption?: string; /** Separate chords to compare, not a progression: no voice leading between them. */ row?: boolean; /** The scale to offer on the neck (a harmony lesson's scale id). */ scale?: string }) {
  const [hand] = useHandSize()
  const rows = useMemo(() => {
    try {
      const syms = chords.map(normSym).filter((x, i, a) => i === 0 || x !== a[i - 1])
      syms.forEach(parseSym)
      // chords to compare are voiced one by one, around the same place on the neck
      const V = row ? syms.flatMap((x) => voiceLead([x], layer, 'auto', 9, 'near', hand)) : voiceLead(syms, layer, 'auto', 9, 'near', hand)
      if (V.some((v) => v.shape === 'x-x-x-x-x')) return null
      return V.slice(0, 16).map((v) => `${v.sym} | ${v.shape} | ${v.degs.join(' ')}`)
    } catch {
      return null
    }
  }, [chords, layer, hand, row])
  if (!rows) return null
  const forced = scale && SCALE_ID[scale] ? rows.map((r) => chordScale(r.split(' | ')[0], { force: SCALE_ID[scale] })) : undefined
  return <ShapesBlock title={title ?? 'On the bass'} rows={rows} seq={!row && rows.length > 1} caption={caption} scales={forced} />
}
