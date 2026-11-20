import { useEffect, useRef, useState } from 'react'
import type { Lesson } from '../../curriculum/types'
import { Staff } from '../../notation/Staff'
import { genQuestion, type Question } from '../../quiz/questions'
import { useAppState } from '../../state/AppState'
import { Button, Choice, ChoiceList, Paper, PencilNote, Row, SectionTitle } from '../../ui'
import styles from './QuizPanel.module.css'

interface Run {
  n: number
  right: number
  total: number
  q: Question
  picked: string | null
}

/** The lesson quiz: N questions, best score saved. */
export function QuizPanel({ lesson: L, onMastered }: { lesson: Lesson; onMastered: () => void }) {
  const { settings: S, progressOf, addQuiz } = useAppState()
  const [run, setRun] = useState<Run | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])
  if (!L.quiz) return null
  const quiz = L.quiz
  const gen = { strings: S.strings, bars: S.bars }
  const total = quiz.n || 20
  const best = progressOf(L).quiz

  const fresh = (prev?: Question) => {
    let q: Question
    do q = genQuestion(L, gen)
    while (prev && q.prompt === prev.prompt && q.answer === prev.answer && Math.random() < 0.9)
    return q
  }

  const start = () => {
    setResult(null)
    setRun({ n: 1, right: 0, total, q: fresh(), picked: null })
  }

  const answer = (a: string) => {
    if (!run || run.picked) return
    const ok = a === run.q.answer
    const next = { ...run, picked: a, right: run.right + (ok ? 1 : 0) }
    setRun(next)
    timer.current = window.setTimeout(
      () => {
        if (next.n >= next.total) {
          const sc = Math.round((next.right / next.total) * 100)
          const nowMastered = addQuiz(L, sc)
          setResult(
            `Score: ${sc}% (${next.right}/${next.total}) — ${sc >= S.quizPass ? 'passed ✓' : 'keep practising'} · best ${Math.max(best, sc)}%`,
          )
          setRun(null)
          if (nowMastered) onMastered()
        } else setRun({ ...next, n: next.n + 1, q: fresh(next.q), picked: null })
      },
      ok ? 450 : 2200,
    )
  }

  const stateOf = (o: string) =>
    !run?.picked ? 'idle' : o === run.q.answer ? 'right' : o === run.picked ? 'wrong' : 'idle'

  return (
    <>
      <SectionTitle>{quiz.types[0] === 'note' ? 'Note quiz' : 'Theory quiz'}</SectionTitle>
      <PencilNote>
        {run ? (
          <>
            Question <b>{run.n}/{run.total}</b> · correct so far {run.right}
          </>
        ) : result ? (
          result
        ) : (
          <>
            Best score: <b>{best}%</b> · pass mark {S.quizPass}% · {total} questions
          </>
        )}
      </PencilNote>
      {!run && (
        <Row>
          <Button onClick={start}>{result ? 'Try again' : 'Start quiz'}</Button>
        </Row>
      )}
      {run && (
        <div className={styles.box}>
          <p className={styles.prompt}>{run.q.prompt}</p>
          {run.q.staff && (
            <Paper className={styles.staff}>
              <Staff
                score={{ K: run.q.staff.K, beats: 4, ts: [4, 4], bars: 1, events: run.q.staff.events, chords: [] }}
                flags={{ bpl: 1, noTime: true, noFinal: true }}
              />
            </Paper>
          )}
          <ChoiceList>
            {run.q.options.map((o) => (
              <Choice key={o} state={stateOf(o)} disabled={!!run.picked} onClick={() => answer(o)}>
                {o}
              </Choice>
            ))}
          </ChoiceList>
          <p className={styles.why}>{run.picked && run.picked !== run.q.answer ? run.q.why : ''}</p>
        </div>
      )}
    </>
  )
}
