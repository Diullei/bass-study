import { useState } from 'react'
import { audioContext, bassTone } from '../../audio/synth'
import { Fretboard } from '../../notation/Fretboard'
import { cx } from '../../ui'
import s from './IntervalRuler.module.css'

/** Degree name of each half step, two octaves. `major`: a degree of the major scale. */
const DEGREES: { n: number; name: string; major: boolean; also?: string }[] = [
  { n: 0, name: 'R', major: true },
  { n: 1, name: '♭2', major: false },
  { n: 2, name: '2', major: true },
  { n: 3, name: '♭3', major: false },
  { n: 4, name: '3', major: true },
  { n: 5, name: '4', major: true },
  { n: 6, name: '♭5', major: false, also: '♯4' },
  { n: 7, name: '5', major: true },
  { n: 8, name: '♭6', major: false, also: '♯5' },
  { n: 9, name: '6', major: true },
  { n: 10, name: '♭7', major: false },
  { n: 11, name: '7', major: true },
  { n: 12, name: '8', major: true, also: 'octave' },
  { n: 13, name: '♭9', major: false },
  { n: 14, name: '9', major: true },
  { n: 15, name: '♯9', major: false, also: '♭10' },
  { n: 16, name: '10', major: true, also: '3 up an octave' },
  { n: 17, name: '11', major: true },
  { n: 18, name: '♯11', major: false },
  { n: 19, name: '12', major: true, also: '5 up an octave' },
  { n: 20, name: '♭13', major: false },
  { n: 21, name: '13', major: true },
  { n: 22, name: '♭14', major: false, also: '♭7 up an octave' },
  { n: 23, name: '14', major: true, also: '7 up an octave' },
  { n: 24, name: '15', major: true, also: 'two octaves' },
]

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`

/** Every way to split n half steps into strings (5) and frets (1) that a hand can use: at most three frets either way. */
function splits(n: number) {
  const out: { su: number; df: number }[] = []
  for (let su = 0; su <= 4; su++) {
    const df = n - 5 * su
    if (Math.abs(df) <= 3 && !(su === 0 && df <= 0)) out.push({ su, df })
  }
  return out.sort((a, b) => Math.abs(a.df) - Math.abs(b.df))
}
const sum = (su: number, df: number) => (su === 0 ? `${df}` : `5 × ${su}${df === 0 ? '' : ` ${df > 0 ? '+' : '−'} ${Math.abs(df)}`}`)
/** "2 strings apart, 1 fret back": how far the two notes are from each other, said from the root. */
const apart = (su: number, df: number) =>
  `${su === 0 ? 'on the same string' : `${plural(su, 'string')} apart`}, ${df === 0 ? 'same fret' : `${plural(Math.abs(df), 'fret')} ${df > 0 ? 'forward' : 'back'}`}`

/**
 * The interval ruler: two octaves of half steps with the degree written over each one, like a slide rule.
 * Pick a degree to read its half steps, the split into strings and frets (interval = 5 × strings + frets),
 * and every place that puts it on the neck around a root. One picture reads both ways: up from the root, or down to it.
 */
export function IntervalRuler() {
  const [pick, setPick] = useState(10)
  const d = DEGREES[pick]
  const S = splits(d.n)
  const play = (n: number) => {
    setPick(n)
    const AC = audioContext()
    if (!AC) return
    bassTone(AC, AC.destination, AC.currentTime + 0.02, 36, 1.6)
    if (n > 0) bassTone(AC, AC.destination, AC.currentTime + 0.5, 36 + n, 1.3)
  }
  return (
    <div className={s.ruler}>
      {[DEGREES.slice(0, 13), DEGREES.slice(12)].map((row, r) => (
        <div key={r} className={s.row} role="group" aria-label={r === 0 ? 'Inside the octave' : 'The octave above'}>
          {row.map((x) => (
            <button key={x.n} type="button" className={cx(s.cell, x.major && s.major, pick === x.n && s.on)} onClick={() => play(x.n)} aria-pressed={pick === x.n} title={`${x.name}: ${plural(x.n, 'half step')}`}>
              <span className={s.deg}>{x.name}</span>
              <span className={s.tick} aria-hidden />
              <span className={s.num}>{x.n}</span>
            </button>
          ))}
        </div>
      ))}
      <p className={s.legend}>
        top: the degree · bottom: half steps above the root · <b>ink</b> = a degree of the major scale, <span className={s.pencil}>pencil</span> = one lowered or raised
      </p>
      <div className={s.detail}>
        <div className={s.head}>
          <span className={s.bigDeg}>{d.name}</span>
          <span>
            <b>{plural(d.n, 'half step')}</b>
            {d.also ? ` · also ${d.also}` : ''}
          </span>
        </div>
        {d.n === 0 ? (
          <p className={s.legend}>The root itself.</p>
        ) : S.length === 0 ? (
          <p className={s.legend}>Too far for one hand in one piece: take an octave off (2 strings and 2 frets), or put the root on a lower string.</p>
        ) : (
          <div className={s.where}>
            <div className={s.ways}>
              <b>Where it is</b>
              <ol>
                {S.map((x, k) => (
                  <li key={k} className={cx(k === 0 && s.first)}>
                    <span className={cx(s.mark, k === 0 ? s.markFirst : s.markOther)} aria-hidden />
                    <span>
                      {x.su > 0 && (
                        <span className={s.sum}>
                          {d.n} = {sum(x.su, x.df)}
                        </span>
                      )}
                      {apart(x.su, x.df)}
                    </span>
                  </li>
                ))}
              </ol>
              <p className={s.legend}>
                It is one distance, so it reads both ways: from the root <b>up</b> to the {d.name}, or from the {d.name} <b>down</b> to the root.
              </p>
            </div>
            <div className={s.neck}>
              <Fretboard
                strings={5}
                from={5}
                to={11}
                allNumbers
                dots={[
                  { str: 0, fret: 8, label: 'R', root: true },
                  ...S.map((x, k) => ({ str: x.su, fret: 8 + x.df, label: d.name, pen: k === 0 ? 'pen-green' : 'pen-blue' })),
                ]}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
