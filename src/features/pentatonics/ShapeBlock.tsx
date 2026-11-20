import { useAppState } from '../../state/AppState'
import { mod, pc } from '../../theory/notes'
import { PENT, type PentKind } from '../../theory/pentatonic'
import { PencilNote } from '../../ui'
import { rootOf, placeSet } from './chords'
import { NeckShape } from './NeckShape'
import s from './Pentatonics.module.css'

/** One pentatonic on the neck, labelled by scale degree. */
export function ShapeBlock({ kind, root, from, to, caption }: { kind: PentKind; root: number; from?: number; to?: number; caption: string }) {
  const { settings } = useAppState()
  const r = rootOf(root, kind === 'minor' || kind === 'minor6' || kind === 'blues' ? 'm7' : 'maj7')
  const set = placeSet(r, { deg: 1, semis: 0, kind, role: '' }, 0)
  const degree = (m: number) => {
    const x = mod(m - pc(r), 12)
    const i = PENT[kind].steps.findIndex(([, st]) => st === x)
    return PENT[kind].formula.split(' ')[i] ?? ''
  }
  return (
    <figure className={s.shape}>
      <NeckShape set={set} strings={settings.strings === '5' ? 5 : 4} from={from} to={to} label={degree} />
      <PencilNote>{caption}</PencilNote>
    </figure>
  )
}
