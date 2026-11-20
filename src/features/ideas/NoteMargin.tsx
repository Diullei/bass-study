import { PencilNote } from '../../ui'
import { ROLES, type Idea } from './model'
import { PenHead } from './RoleLegend'
import { beatName } from './generator/pitch'
import { spellIn } from './harmony'
import { nm } from '../../theory/notes'
import s from './IdeaBuilderPage.module.css'

/** Why the clicked note was chosen, written next to the staff. */
export function NoteMargin({ idea, index }: { idea: Idea; index: number | null }) {
  const n = index != null ? idea.notes[index] : null
  if (!n)
    return (
      <div className={s.margin}>
        <PencilNote>Click any note on the staff to see why it was chosen.</PencilNote>
      </div>
    )
  const ch = idea.chords[n.ci]
  return (
    <div className={s.margin} aria-live="polite">
      <div className={s.marginHead}>
        <PenHead pen={ROLES[n.role].pen} />
        <b>{n.ghost ? 'Ghost note' : nm(spellIn(n.midi, ch, idea.K, n.pref))}</b>
        <span>{beatName(n.t)}</span>
        {!n.ghost && (
          <span>
            <b>{n.label}</b> of {ch.sym}
          </span>
        )}
        <span className={s.role}>{ROLES[n.role].name}</span>
      </div>
      <p>{n.why}</p>
    </div>
  )
}
