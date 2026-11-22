import { useState } from 'react'
import { ChordShape } from '../../notation/ChordShape'
import { ShapeMove } from '../../notation/ShapeMove'
import { VoiceLines } from '../../notation/VoiceLines'
import { Button, Checkbox, cx } from '../../ui'
import { CText } from './CText'
import { useLefty } from './progress'
import { info, parseRow, penOf, shapeBar, type ShapeInfo } from './render'
import { useClip } from './sound'
import { bandsOf, IV_NAME } from './voicing'
import s from './Chords.module.css'

export const degsOf = (I: ShapeInfo) => I.a.notes.map((n) => n.deg)
export const pensOf = (I: ShapeInfo) => I.a.notes.map((n) => penOf(n.deg))
export const rootsOf = (I: ShapeInfo) => I.a.notes.map((n) => n.deg === 'R')

/** The pens, explained once per block. */
export function PenKey() {
  return (
    <ul className={s.penKey} aria-label="What the colours mean">
      <li>
        <span className={cx(s.sw, s.swRoot)} /> root
      </li>
      <li>
        <span className={cx(s.sw, s.swGuide)} /> 3rd and 7th (guide tones)
      </li>
      <li>
        <span className={cx(s.sw, s.swColour)} /> colour (9, 11, 13)
      </li>
      <li>
        <span className={s.sw} /> 5th
      </li>
    </ul>
  )
}

/** One mud warning in words (Law 2), or nothing. */
export function mudNote(I: ShapeInfo): string | null {
  const m = I.a.mud[0]
  if (!m) return null
  const a = I.a.notes[m.at]
  const b = I.a.notes[m.at + 1]
  return `${a.deg}–${b.deg} is a ${IV_NAME[m.interval]} below its clear floor ([[Law2]])${m.inner ? '' : ': a low root softens it'}`
}

/** A shape as a card: name, diagram, frets, notes and degrees (computed), the author's note. Click to hear it. */
export function ShapeCard({ I, note, on, active, onPlay, compact }: { I: ShapeInfo; note?: string; on?: boolean; active?: boolean; onPlay?: () => void; compact?: boolean }) {
  const [lefty] = useLefty()
  const mud = mudNote(I)
  return (
    <figure className={cx(s.card, on && s.cardOn, compact && s.cardCompact)}>
      <button type="button" className={s.cardHead} onClick={onPlay} aria-label={`Play ${I.sym}`}>
        <b className={s.cardSym}>{I.sym}</b>
        <span className={s.cardPlay}>{active ? '■' : '▶'}</span>
      </button>
      <ChordShape shape={I.shape} labels={degsOf(I)} pens={pensOf(I)} roots={rootsOf(I)} lefty={lefty} active={active ? I.a.notes.map((_, i) => i) : []} />
      <figcaption>
        <code className={s.frets}>{I.shape}</code>
        {I.a.stretch && <span className={s.stretch}>stretch</span>}
        <span className={s.notes}>{I.a.notes.map((n) => n.name).join(' ')}</span>
        {!compact && note && (
          <span className={s.cardNote}>
            <CText text={note} />
          </span>
        )}
        {!compact && mud && (
          <span className={s.mud}>
            <CText text={mud} />
          </span>
        )}
      </figcaption>
    </figure>
  )
}

/** A `shapes` block: cards, or for a progression (seq) the voice lines and the moves between chords. */
export function ShapesBlock({ title, rows, caption, seq, tempo = 72 }: { title?: string; rows: string[]; caption?: string; seq?: boolean; tempo?: number }) {
  const P = useClip<number>()
  const [addRoot, setAddRoot] = useState(true)
  const items = rows.map(parseRow).map((r) => ({ ...r, I: info(r.sym, r.shape) }))
  const anyRootless = items.some((x) => x.I.rootless)
  const playOne = (i: number) => (P.playing && P.cue === i ? P.stop() : P.once([shapeBar(items[i].I, 'roll', 3, i, addRoot)], tempo))
  const playAll = () =>
    P.playing ? P.stop() : P.once(items.map((x, i) => shapeBar(x.I, seq ? 'block' : 'roll', seq ? 4 : 3, i, addRoot)), tempo)
  return (
    <figure className={s.shapes}>
      <figcaption className={s.shapesHead}>
        {title && <span className={s.shapesTitle}>{title}</span>}
        {items.length > 1 && (
          <Button size="sm" variant={P.playing ? 'ink' : 'default'} onClick={playAll}>
            {P.playing ? '■ Stop' : seq ? '▶ Play in order' : '▶ All'}
          </Button>
        )}
        {anyRootless && <Checkbox label="thumb adds the root" checked={addRoot} onChange={setAddRoot} />}
      </figcaption>
      {seq && items.length > 1 && <Progression items={items} at={P.cue} onPick={playOne} />}
      <div className={cx(s.cards, seq && s.cardsSeq)}>
        {items.map((x, i) => (
          <ShapeCard key={i} I={x.I} note={x.note} on={P.cue === i} active={P.cue === i} onPlay={() => playOne(i)} />
        ))}
      </div>
      {caption && (
        <p className={s.caption}>
          <CText text={caption} />
        </p>
      )}
    </figure>
  )
}

/** The voice-leading view of a progression: every voice as a line, and the move into the chosen chord on the neck. */
export function Progression({ items, at, onPick }: { items: { I: ShapeInfo }[]; at: number | null; onPick?: (i: number) => void }) {
  const [lefty] = useLefty()
  const [pick, setPick] = useState(1)
  const k = at ?? pick
  const cur = items[Math.min(k, items.length - 1)].I
  const prev = k > 0 ? items[k - 1].I : null
  const moves = prev ? describeMove(prev, cur) : null
  return (
    <div className={s.prog}>
      <div className={s.progLines}>
        <VoiceLines
          chords={items.map(({ I }) => ({ label: I.sym, midis: I.midis, names: I.a.notes.map((n) => n.name), degs: degsOf(I) }))}
          at={at}
        />
      </div>
      <div className={s.progMove}>
        <div className={s.progNav}>
          <Button size="sm" variant="pencil" disabled={k <= 1} onClick={() => setPick(Math.max(1, k - 1))}>
            ◀
          </Button>
          <span>
            {prev ? (
              <>
                <b>{prev.sym}</b> → <b>{cur.sym}</b>
              </>
            ) : (
              <b>{cur.sym}</b>
            )}
          </span>
          <Button size="sm" variant="pencil" disabled={k >= items.length - 1} onClick={() => setPick(Math.min(items.length - 1, k + 1))}>
            ▶
          </Button>
          {onPick && (
            <Button size="sm" variant="pencil" onClick={() => onPick(k)}>
              hear {cur.sym}
            </Button>
          )}
        </div>
        {prev ? (
          <ShapeMove
            from={{ shape: prev.shape }}
            to={{ shape: cur.shape, labels: degsOf(cur), pens: pensOf(cur), roots: rootsOf(cur) }}
            lefty={lefty}
          />
        ) : (
          <ChordShape shape={cur.shape} labels={degsOf(cur)} pens={pensOf(cur)} roots={rootsOf(cur)} lefty={lefty} />
        )}
        {moves && <p className={s.moveText}>{moves}</p>}
        <p className={s.moveKey}>dashed pencil = the chord before · thick ring = the finger stays · arrow = the finger moves · ½ = a half-step pull</p>
      </div>
    </div>
  )
}

/** "B stays · F falls a half step to E · the root jumps a fifth": the move in words (Law 4). */
export function describeMove(a: ShapeInfo, b: ShapeInfo): string {
  const A = a.a.notes
  const B = b.a.notes
  const k = Math.min(A.length, B.length)
  const out: string[] = []
  for (let i = 0; i < k; i++) {
    const x = A[A.length - k + i]
    const y = B[B.length - k + i]
    const d = y.midi - x.midi
    const isRoot = x.deg === 'R' && y.deg === 'R'
    if (isRoot) out.push(d === 0 ? 'the root stays' : `the root moves ${d > 0 ? 'up' : 'down'} ${Math.abs(d) % 12 === 0 ? 'an octave' : 'a ' + IV_NAME[Math.abs(d) % 12]}`)
    else if (d === 0) out.push(`${x.name} stays (${x.deg} → ${y.deg})`)
    else
      out.push(
        `${x.name} ${d > 0 ? 'rises' : 'falls'} ${Math.abs(d) === 1 ? 'a half step' : Math.abs(d) === 2 ? 'a whole step' : `${Math.abs(d)} semitones`} to ${y.name}`,
      )
  }
  const bandNote = B.some((n) => !n.harmonic && n.deg !== 'R' && bandsOf(n.midi).includes('bass')) ? ' Some upper notes sit in the bass band.' : ''
  return out.reverse().join(' · ') + '.' + bandNote
}
