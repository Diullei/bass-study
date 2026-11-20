import { progressionById } from './harmony'
import { LAYERS, NO_LAYERS, type Feel, type IdeaSettings, type Layers, type Mode } from './model'

/** Everything about an idea that lives in the URL, so an idea can be bookmarked or linked to. */
export type IdeaParams = Omit<IdeaSettings, 'five'> & { tempo: number }

export const IDEAS_PATH = '/ideas'

const clamp = (v: number, lo: number, hi: number, d: number) => (Number.isFinite(v) ? Math.max(lo, Math.min(hi, v)) : d)
const oneOf = <T extends string>(v: string | null, all: readonly T[], d: T): T => (all.includes(v as T) ? (v as T) : d)

export const newSeed = () => Math.floor(Math.random() * 1e6)

export function readParams(sp: URLSearchParams): IdeaParams {
  const layers: Layers = { ...NO_LAYERS }
  ;(sp.get('l') || '').split(',').forEach((id) => {
    if (id in layers) layers[id as keyof Layers] = true
  })
  layers.scale = true
  const n = (k: string) => (sp.has(k) ? Number(sp.get(k)) : NaN)
  return {
    key: clamp(n('key'), 0, 11, 0),
    prog: progressionById(sp.get('prog') || '').id,
    times: clamp(n('x'), 1, 3, 2),
    mode: oneOf<Mode>(sp.get('mode'), ['solo', 'fills'], 'solo'),
    feel: oneOf<Feel>(sp.get('feel'), ['straight', 'funk', 'swing'], 'straight'),
    busy: clamp(n('busy'), 10, 90, 50) / 100,
    fillEvery: [1, 2, 4].includes(n('fe')) ? n('fe') : 2,
    fillBeats: [1, 2, 4].includes(n('fb')) ? n('fb') : 2,
    tempo: clamp(n('bpm'), 50, 200, 90),
    seed: clamp(n('seed'), 0, 1e6, 0),
    layers,
  }
}

export function writeParams(p: IdeaParams): URLSearchParams {
  const sp = new URLSearchParams()
  sp.set('seed', String(p.seed))
  sp.set('l', LAYERS.filter((L) => p.layers[L.id]).map((L) => L.id).join(','))
  sp.set('key', String(p.key))
  sp.set('prog', p.prog)
  sp.set('x', String(p.times))
  sp.set('mode', p.mode)
  sp.set('feel', p.feel)
  sp.set('busy', String(Math.round(p.busy * 100)))
  if (p.mode === 'fills') {
    sp.set('fe', String(p.fillEvery))
    sp.set('fb', String(p.fillBeats))
  }
  sp.set('bpm', String(p.tempo))
  return sp
}

/** A link into the builder, e.g. from a lesson: `ideaLink({ prog: 'ii-V-I', layers: ['targets', 'guide'] })`. */
export function ideaLink(o: { prog?: string; layers?: (keyof Layers)[]; mode?: Mode; feel?: Feel } = {}) {
  const sp = new URLSearchParams()
  if (o.prog) sp.set('prog', o.prog)
  if (o.layers) sp.set('l', ['scale', ...o.layers].join(','))
  if (o.mode) sp.set('mode', o.mode)
  if (o.feel) sp.set('feel', o.feel)
  return `${IDEAS_PATH}?${sp}`
}
