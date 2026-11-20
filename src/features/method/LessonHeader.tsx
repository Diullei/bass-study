import { useNavigate } from 'react-router'
import { UNITS } from '../../curriculum/lessons'
import type { Lesson } from '../../curriculum/types'
import { useAppState } from '../../state/AppState'
import { Button, Select, type OptionGroup } from '../../ui'
import { NotebookHeader } from '../shell/NotebookHeader'
import styles from './LessonHeader.module.css'
import { lessonPath } from './paths'

/** Sticky top bar of the method: lesson picker, previous/next, overall progress. */
export function LessonHeader({ lesson }: { lesson: Lesson }) {
  const { lessons, mastered } = useAppState()
  const navigate = useNavigate()
  const k = lessons.indexOf(lesson)
  const go = (L?: Lesson) => L && navigate(lessonPath(L.id))

  const groups: OptionGroup[] = []
  lessons.forEach((L, i) => {
    if (!groups.length || groups[groups.length - 1].label !== UNITS[L.u]) groups.push({ label: UNITS[L.u], options: [] })
    groups[groups.length - 1].options.push({ value: L.id, label: `${mastered(L) ? '✓ ' : ''}${i + 1}. ${L.t}` })
  })

  return (
    <NotebookHeader
      section="Method"
      aside={
        <span className={styles.overall}>
          {lessons.filter(mastered).length}/{lessons.length} mastered
        </span>
      }
    >
      <Button icon size="sm" title="Previous lesson" disabled={k <= 0} onClick={() => go(lessons[k - 1])}>
        ◀
      </Button>
      <Select
        className={styles.select}
        aria-label="Lesson"
        value={lesson.id}
        groups={groups}
        onChange={(id) => navigate(lessonPath(id))}
      />
      <Button icon size="sm" title="Next lesson" disabled={k >= lessons.length - 1} onClick={() => go(lessons[k + 1])}>
        ▶
      </Button>
    </NotebookHeader>
  )
}
