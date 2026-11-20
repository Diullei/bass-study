import { useNavigate } from 'react-router'
import { lessonPath } from './paths'
import type { Lesson } from '../../curriculum/types'
import { useAppState } from '../../state/AppState'
import { Button, StickyNote } from '../../ui'

/** Sticky note with the lesson goal — or a well-done note and the way forward. */
export function MasteryNote({ lesson: L, next }: { lesson: Lesson; next?: Lesson }) {
  const { settings: S, mastered } = useAppState()
  const navigate = useNavigate()
  const ok = mastered(L)
  const go = next && (
    <Button variant={ok ? 'ink' : 'default'} onClick={() => navigate(lessonPath(next.id))}>
      Next lesson →
    </Button>
  )
  if (ok)
    return (
      <StickyNote tone="success" title="✓ Lesson mastered" action={go}>
        {next ? `Next: ${next.t}` : 'You have finished the method!'}
      </StickyNote>
    )
  const need = [!L.noEx ? `${S.cleanNeeded} clean run-throughs` : null, L.quiz ? `${S.quizPass}% on the quiz` : null]
    .filter(Boolean)
    .join(' and ')
  return (
    <StickyNote title="To master this lesson" action={go}>
      {need}.
    </StickyNote>
  )
}
