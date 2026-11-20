import { useMemo, useState } from 'react'
import { useAppState } from '../../state/AppState'
import { nm } from '../../theory/notes'
import { intervalOver, pentName } from '../../theory/pentatonic'
import { Button, cx, Field, PencilNote, Select } from '../../ui'
import { drillChord, rootOf } from './chords'
import { buildDrill } from './drills'
import { ladderOf, LADDERS } from './ladders'
import { NeckShape } from './NeckShape'
import { lineToScore } from './score'
import { usePlayer } from './usePlayer'
import { PenHead } from '../ideas/RoleLegend'
import s from './Pentatonics.module.css'

interface Props {
  q: string
  root?: number
  /** Show only these rungs (indices). */
  only?: number[]
  /** Let the reader change the chord type too (the map page). */
  pickType?: boolean
  onType?: (q: string) => void
}

/**
 * The altitude ladder of a chord: its pentatonics from the ground up, what each one gives over the
 * chord, how it sounds, and where it lies on the neck. Any root.
 */
export function LadderBlock({ q, root: root0, only, pickType, onType }: Props) {
  const L = ladderOf(q)
  const { settings } = useAppState()
  const strings = settings.strings === '5' ? 5 : 4
  const [root, setRoot] = useState(root0 ?? L.root)
  const rungs = only ? L.rungs.filter((_, i) => only.includes(i)) : L.rungs
  // a lesson that shows part of the ladder is about its top rung; the full ladder opens one rung up
  const [sel, setSel] = useState(only ? rungs.length - 1 : Math.min(1, rungs.length - 1))
  const ch = useMemo(() => drillChord(rootOf(root, q), q, rungs), [root, q, rungs])
  const set = ch.sets[Math.min(sel, ch.sets.length - 1)]
  const { playing, play, stop } = usePlayer()
  const [playingRung, setPlayingRung] = useState(-1)

  const hear = (i: number) => {
    if (playing && playingRung === i) return stop()
    const line = buildDrill({ type: 'scale', q, pents: [rungs[i]], octaves: 1 }, { root, five: strings === 5, seed: 1, choice: 0 })
    setPlayingRung(i)
    play(lineToScore(line, strings === 5), { tempo: 100, loop: false })
  }

  return (
    <div className={s.ladder}>
      <div className={s.ladderHead}>
        {pickType && (
          <Field label="Chord type">
            <Select value={q} options={LADDERS.map((l) => ({ value: l.q, label: l.name }))} onChange={(v) => onType?.(v)} />
          </Field>
        )}
        <Field label="Root">
          <Select
            value={String(root)}
            options={Array.from({ length: 12 }, (_, i) => ({ value: String(i), label: `${nm(rootOf(i, q))}${q}` }))}
            onChange={(v) => setRoot(+v)}
          />
        </Field>
        <span className={s.ladderTitle}>
          Altitude ladder of <b>{ch.chord.sym}</b>
        </span>
      </div>
      <ol className={s.rungs} reversed>
        {[...ch.sets.keys()].reverse().map((i) => {
          const st = ch.sets[i]
          const ivs = st.pcs.map((p) => intervalOver(p, ch.rootPc, ch.tones))
          return (
            <li key={i} className={cx(s.rung, i === sel && s.rungOn, st.ref.role.includes('outside') && s.rungOut)}>
              <button type="button" className={s.rungMain} onClick={() => setSel(i)} aria-pressed={i === sel}>
                <PenHead pen={st.pen} />
                <span className={s.rungName}>
                  {pentName(st.root, st.ref.kind)} <span className={s.rungRole}>{st.ref.role}</span>
                </span>
                <span className={s.rungNotes}>{st.notes.map(nm).join(' ')}</span>
                <span className={s.rungIvs}>
                  {ivs.map((x, k) => (
                    <span key={k} className={cx(s.iv, ['R', '♭3', '3'].includes(x) && s.ivGround)}>
                      {x}
                    </span>
                  ))}
                </span>
                {st.ref.say && <span className={s.rungSay}>{st.ref.say}</span>}
              </button>
              <Button size="sm" variant={playing && playingRung === i ? 'ink' : 'ghost'} onClick={() => hear(i)} title="Hear it over the chord">
                {playing && playingRung === i ? '■' : '▶'}
              </Button>
            </li>
          )
        })}
      </ol>
      <div className={s.neck}>
        <PencilNote>
          {pentName(set.root, set.ref.kind)} on the neck, labelled against {ch.chord.sym}. Filled dots: {nm(set.root)}, the
          pentatonic’s own root.
        </PencilNote>
        <NeckShape set={set} strings={strings} label={(m) => intervalOver(m, ch.rootPc, ch.tones)} />
      </div>
      {!only && (
        <PencilNote>
          {L.note} {L.alias}
        </PencilNote>
      )}
    </div>
  )
}
