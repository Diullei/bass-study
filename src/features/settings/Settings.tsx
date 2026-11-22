import { useState, type ComponentType } from 'react'
import { ChordShape } from '../../notation/ChordShape'
import { useLefty } from '../../state/prefs'
import { Button, Modal, Segmented } from '../../ui'
import s from './Settings.module.css'

/**
 * One setting of the notebook. To add one: write its control (it reads and saves its own value,
 * like useLefty in state/prefs.ts) and add an entry here. The modal groups entries by `group`.
 */
interface SettingDef {
  id: string
  group: string
  label: string
  help: string
  Control: ComponentType
}

function LeftyControl() {
  const [lefty, setLefty] = useLefty()
  return (
    <div className={s.control}>
      <Segmented
        label="Fretboard orientation"
        value={lefty ? 'left' : 'right'}
        options={[
          { value: 'right', label: 'right-handed' },
          { value: 'left', label: 'left-handed' },
        ]}
        onChange={(v) => setLefty(v === 'left')}
      />
      <div className={s.preview} aria-hidden>
        <ChordShape shape="x-8-x-9-9" labels={['R', '7', '3']} pens={[undefined, 'pen-green', 'pen-green']} roots={[true]} />
      </div>
    </div>
  )
}

export const SETTINGS: SettingDef[] = [
  {
    id: 'lefty',
    group: 'Fretboards',
    label: 'Neck orientation',
    help: 'Left-handed mirrors every neck in the notebook, nut on the right, as a left-handed player sees it. Tab and shape names (x-8-x-9-9) read the same both ways.',
    Control: LeftyControl,
  },
]

/** The settings of the whole notebook, in a modal. Every value is saved in this browser. */
export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const groups = [...new Set(SETTINGS.map((x) => x.group))]
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="⚙ Settings"
      footer={
        <>
          <span className={s.saved}>Saved in this browser, for every section.</span>
          <Button variant="ink" onClick={onClose}>
            Done
          </Button>
        </>
      }
    >
      {groups.map((g) => (
        <section key={g} className={s.group}>
          <h3 className={s.groupTitle}>{g}</h3>
          {SETTINGS.filter((x) => x.group === g).map(({ id, label, help, Control }) => (
            <div key={id} className={s.row}>
              <div className={s.text}>
                <b>{label}</b>
                <p>{help}</p>
              </div>
              <Control />
            </div>
          ))}
        </section>
      ))}
    </Modal>
  )
}

/** A sticky note in the bottom-left corner of every page that opens the settings. */
export function Settings() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" className={s.fab} onClick={() => setOpen(true)} title="Settings" aria-haspopup="dialog">
        <span aria-hidden>⚙</span> Settings
      </button>
      <SettingsModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
