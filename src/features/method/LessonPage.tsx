import { useEffect, useState } from 'react'
import { lessonPath } from './paths'
import { Navigate, useParams } from 'react-router'
import { lessonById } from '../../curriculum/lessons'
import type { Lesson } from '../../curriculum/types'
import { ExercisePanel } from './ExercisePanel'
import { LessonHeader } from './LessonHeader'
import { LessonIntro } from './LessonIntro'
import { MasteryNote } from './MasteryNote'
import { QuizPanel } from './QuizPanel'
import { SettingsPanel } from './SettingsPanel'
import { useOfferTempo } from '../metronome/MetronomeTempo'
import { useAppState } from '../../state/AppState'
import { Notebook, Section } from '../../ui'

/** /method/lesson/:id — one page of the method. */
export function LessonPage() {
  const { id } = useParams()
  const { lessons, setCurrentId } = useAppState()
  const L = id ? lessonById(id) : undefined
  const visible = L && lessons.includes(L)
  useEffect(() => {
    if (L && visible) setCurrentId(L.id)
  }, [L, visible, setCurrentId])
  if (!L || !visible) return <Navigate to={lessonPath(lessons[0].id)} replace />
  // key: every lesson starts with fresh tempo, exercise and quiz state
  return <LessonView key={L.id} lesson={L} />
}

function LessonView({ lesson: L }: { lesson: Lesson }) {
  const { lessons } = useAppState()
  const k = lessons.indexOf(L)
  const [tempo, setTempo] = useState(L.tempo || 70)
  const [message, setMessage] = useState('')
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  useOfferTempo(tempo)

  return (
    <Notebook>
      <LessonHeader lesson={L} />
      <main>
        <Section>
          <LessonIntro lesson={L} number={k + 1} prev={lessons[k - 1]} />
        </Section>
        {!L.noEx && (
          <Section>
            <ExercisePanel lesson={L} tempo={tempo} onTempo={setTempo} message={message} onMessage={setMessage} />
          </Section>
        )}
        {L.quiz && (
          <Section>
            <QuizPanel lesson={L} onMastered={() => setMessage('Lesson mastered! On to the next one.')} />
          </Section>
        )}
        <Section>
          <MasteryNote lesson={L} next={lessons[k + 1]} />
        </Section>
        <SettingsPanel />
      </main>
    </Notebook>
  )
}
