import { useState } from 'react'
import { Button, Choice, ChoiceList, PencilNote, Row } from '../../ui'
import { CText } from './CText'
import { PASS, useChordsProgress } from './progress'
import { genCQuestion, type CQuestion, type QType } from './quiz'
import s from './Chords.module.css'

const TOTAL = 6

/** Six generated questions; after each one the reasoning, so the answer can be rebuilt next time instead of remembered. */
export function ChordsQuiz({ id, types }: { id: string; types: QType[] }) {
  const { all, update } = useChordsProgress()
  const best = all[id]?.quiz ?? 0
  const [run, setRun] = useState<{ n: number; right: number; q: CQuestion; picked: string | null } | null>(null)
  const [result, setResult] = useState('')
  const fresh = (prev?: CQuestion) => {
    let q = genCQuestion(types)
    for (let k = 0; prev && q.prompt === prev.prompt && k < 10; k++) q = genCQuestion(types)
    return q
  }
  const answer = (a: string) => run && !run.picked && setRun({ ...run, picked: a, right: run.right + (a === run.q.answer ? 1 : 0) })
  const next = () => {
    if (!run) return
    if (run.n >= TOTAL) {
      const sc = Math.round((run.right / TOTAL) * 100)
      update(id, { quiz: Math.max(best, sc), ...(sc >= PASS ? { done: true } : {}) })
      setResult(`Score: ${sc}% (${run.right}/${TOTAL}) — ${sc >= PASS ? 'passed ✓' : 'try again'} · best ${Math.max(best, sc)}%`)
      setRun(null)
    } else setRun({ n: run.n + 1, right: run.right, q: fresh(run.q), picked: null })
  }
  const stateOf = (o: string) => (!run?.picked ? 'idle' : o === run.q.answer ? 'right' : o === run.picked ? 'wrong' : 'idle')
  return (
    <div>
      <PencilNote>
        {run ? (
          <>
            Question <b>{run.n}/{TOTAL}</b> · right so far {run.right}
          </>
        ) : (
          result || (
            <>
              Best score: <b>{best}%</b> · pass mark {PASS}% · {TOTAL} questions, new ones every time
            </>
          )
        )}
      </PencilNote>
      {!run ? (
        <Row>
          <Button onClick={() => (setResult(''), setRun({ n: 1, right: 0, q: fresh(), picked: null }))}>{result ? 'Try again' : 'Start'}</Button>
        </Row>
      ) : (
        <div className={s.quiz}>
          <p className={s.prompt}>
            <CText text={run.q.prompt} />
          </p>
          <ChoiceList>
            {run.q.options.map((o) => (
              <Choice key={o} state={stateOf(o)} disabled={!!run.picked} onClick={() => answer(o)}>
                {o}
              </Choice>
            ))}
          </ChoiceList>
          {run.picked && (
            <>
              <p className={s.why}>
                <b>{run.picked === run.q.answer ? 'Right. ' : `It is ${run.q.answer}. `}</b>
                <CText text={run.q.why} />
              </p>
              <Row>
                <Button variant="ink" onClick={next}>
                  {run.n >= TOTAL ? 'See the score' : 'Next question →'}
                </Button>
              </Row>
            </>
          )}
        </div>
      )}
    </div>
  )
}
