import { Button, Checkbox, cx } from '../../ui'
import { LAYERS, type LayerId, type Layers } from './model'
import s from './LayerCard.module.css'

interface Props {
  layers: Layers
  onChange: (layers: Layers) => void
}

/** The eight layers on an index card. The ones switched on, and the next one, show how the player thinks. */
export function LayerCard({ layers, onChange }: Props) {
  const next = LAYERS.find((L) => !layers[L.id])
  const on = LAYERS.filter((L) => layers[L.id]).length
  const set = (id: LayerId, v: boolean) => onChange({ ...layers, [id]: v, scale: true })
  const all = (v: boolean) => onChange(Object.fromEntries(LAYERS.map((L) => [L.id, v || L.id === 'scale'])) as Layers)

  return (
    <div className={s.card}>
      <div className={s.head}>
        <h3>How the player thinks</h3>
        <span className={s.count}>
          {on} of {LAYERS.length}
        </span>
      </div>
      <ol className={s.list}>
        {LAYERS.map((L, i) => {
          const isOn = layers[L.id]
          const isNext = next?.id === L.id
          return (
            <li key={L.id} className={cx(s.layer, isOn && s.on, isNext && s.next)}>
              <Checkbox
                checked={isOn}
                disabled={L.id === 'scale'}
                onChange={(v) => set(L.id, v)}
                label={
                  <span className={s.name}>
                    <span className={s.num}>{i + 1}</span>
                    {L.name}
                  </span>
                }
              />
              {(isOn || isNext) && <p className={s.think}>{L.think}</p>}
            </li>
          )
        })}
      </ol>
      <div className={s.actions}>
        <Button variant="ink" disabled={!next} onClick={() => next && set(next.id, true)}>
          {next ? `Add layer ${LAYERS.indexOf(next) + 1}` : 'All layers on'}
        </Button>
        <Button variant="pencil" size="sm" onClick={() => all(false)}>
          Scale only
        </Button>
        <Button variant="ghost" size="sm" onClick={() => all(true)}>
          All
        </Button>
      </div>
    </div>
  )
}
