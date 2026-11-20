import { useEffect, useRef, useState } from 'react'
import { Button, Choice, ChoiceList, PencilNote, Row } from '../../ui'
import { PASS, usePentProgress } from './progress'
import { genPQuestion, type PQuestion, type QType } from './quiz'
import s from './Pentatonics.module.css'

const TOTAL = 6

/** Six questions; the best score is kept, and passing marks the lesson as learned. */
export function PentQuiz({ id, types }: { id: string; types: QType[] }) {
  const { all, update } = usePentProgress()
  const best = all[id]?.quiz ?? 0
  const [run, setRun] = useState<{ n: number; right: number; q: PQuestion; picked: string | null } | null>(null)
  const [result, setResult] = useState('')
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])

  const fresh = (prev?: PQuestion) => {
    let q = genPQuestion(types)
    for (let k = 0; prev && q.prompt === prev.prompt && k < 10; k++) q = genPQuestion(types)
    return q
  }
  const answer = (a: string) => {
    if (!run || run.picked) return
    const ok = a === run.q.answer
    const next = { ...run, picked: a, right: run.right + (ok ? 1 : 0) }
    setRun(next)
    timer.current = window.setTimeout(
      () => {
        if (next.n >= TOTAL) {
          const sc = Math.round((next.right / TOTAL) * 100)
          update(id, { quiz: Math.max(best, sc), ...(sc >= PASS ? { done: true } : {}) })
          setResult(`Score: ${sc}% (${next.right}/${TOTAL}) — ${sc >= PASS ? 'passed ✓' : 'try again'} · best ${Math.max(best, sc)}%`)
          setRun(null)
        } else setRun({ n: next.n + 1, right: next.right, q: fresh(next.q), picked: null })
      },
      ok ? 500 : 2600,
    )
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
              Best score: <b>{best}%</b> · pass mark {PASS}% · {TOTAL} questions
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
          <p className={s.prompt}>{run.q.prompt}</p>
          <ChoiceList>
            {run.q.options.map((o) => (
              <Choice key={o} state={stateOf(o)} disabled={!!run.picked} onClick={() => answer(o)}>
                {o}
              </Choice>
            ))}
          </ChoiceList>
          <p className={s.why}>{run.picked && run.picked !== run.q.answer ? run.q.why : ''}</p>
        </div>
      )}
    </div>
  )
}
