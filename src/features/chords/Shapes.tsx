import { useState } from 'react'
import { ChordShape } from '../../notation/ChordShape'
import { ShapeRef } from '../../notation/ShapeRef'
import { FingerKey } from '../../notation/FingerKey'
import { ScaleStrip } from '../../notation/ScaleStrip'
import { ShapeMove } from '../../notation/ShapeMove'
import { VoiceLines } from '../../notation/VoiceLines'
import { Button, Checkbox, cx } from '../../ui'
import { CText } from './CText'
import { fingerMoveText, fingerText, useFingers, type ShapeFingers } from './fingers'
import { useLefty } from './progress'
import { info, parseRow, penOf, shapeBar, type ShapeInfo } from './render'
import { chordScale, progressionScales, type ChordScale } from './scales'
import { useClip } from './sound'
import { bandsOf, clearPair, IV_NAME, pitchName, zonesAround, zoneWords } from './voicing'
import s from './Chords.module.css'

export const degsOf = (I: ShapeInfo) => I.a.notes.map((n) => n.deg)
export const pensOf = (I: ShapeInfo) => I.a.notes.map((n) => penOf(n.deg))
export const rootsOf = (I: ShapeInfo) => I.a.notes.map((n) => n.deg === 'R')

/** What a scale note is drawn with around a shape: the pen of its job. */
const fillOf = (sc: ChordScale) =>
  Object.fromEntries(
    sc.notes.map((n) => [n.pc, { label: n.deg, root: n.role === 'root', pen: n.role === 'guide' ? 'pen-green' : n.role === 'colour' ? 'pen-blue' : n.role === 'pass' ? 'pen-pencil' : undefined, dashed: n.role === 'pass' }]),
  )

/** The scale switch of one fretboard: off until this neck is switched. Returns the state and the small button for the neck's corner. */
function useNeckScale(lefty: boolean) {
  const [on, setOn] = useState(false)
  const button = (
    <button type="button" className={cx(s.scaleTog, on && s.scaleTogOn, lefty && s.scaleTogLefty)} aria-pressed={on} title={on ? 'Hide the chord scale on this neck' : 'Show the chord scale on this neck'} onClick={() => setOn(!on)}>
      scale
    </button>
  )
  return { on, button }
}

/** What the scale switch of a neck shows. */
export function ScaleKey() {
  return (
    <div className={s.zoneKey}>
      <b className={s.zoneKeyTitle}>
        <span className={cx(s.scaleTog, s.scaleTogDemo)}>scale</span> in the corner of a neck: the scale that fits the chord
      </b>
      {
        <ul>
          <li>
            <span className={cx(s.sw, s.swSq)} />
            <span>
              <b>small squares</b>: the other notes of the scale, under the same hand. Round dots are the notes of the chord shape
            </span>
          </li>
          <li>
            <span className={cx(s.sw, s.swSq, s.swSqColour)} />
            <span>
              <b>blue</b>: a colour you can hold over the chord
            </span>
          </li>
          <li>
            <span className={cx(s.sw, s.swSq, s.swPass)} />
            <span>
              <b>dashed</b>: a passing note, a half step above a chord tone. Play through it, do not stop on it
            </span>
          </li>
          <li>under the card: the scale root to root, ½ marks the half steps, and ▶ hear it</li>
        </ul>
      }
    </div>
  )
}

/** The pens, explained once per block. */
export function PenKey() {
  const F = useFingers()
  return (
    <div className={s.keys}>
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
      <div className={s.zoneKey} aria-label="What the shading means">
        <b className={s.zoneKeyTitle}>
          tap a note: what fits with it? <CText text="[[Law2]]" />
        </b>
        <ul>
          <li>
            <svg className={s.zoneKeyDot} viewBox="0 0 34 34" aria-hidden>
              <circle cx="17" cy="17" r="15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 3" />
              <circle cx="17" cy="17" r="10" fill="currentColor" />
            </svg>
            the note you tapped
          </li>
          <li>
            <span className={cx(s.sw, s.swClear)} />
            <span>
              <b>clear</b>: a second note here sounds clean with it
            </span>
          </li>
          <li>
            <span className={cx(s.sw, s.swMud)} />
            <span>
              <b>mud</b>: too close to it for this height
            </span>
          </li>
          <li>
            <svg className={s.zoneKeyDot} viewBox="0 0 34 34" aria-hidden>
              <circle cx="17" cy="19" r="11" fill="none" stroke="var(--red-pen)" strokeWidth="2.6" />
              <circle cx="8" cy="8" r="6.5" fill="var(--red-pen)" />
              <text x="8" y="12" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--paper-sheet)">
                !
              </text>
            </svg>
            <span>
              <b>red ring</b>: a note of the chord that sits in the mud
            </span>
          </li>
          <li>no shade: the same note · tap again to hide</li>
        </ul>
      </div>
      <ScaleKey />
      {F.show && <FingerKey />}
    </div>
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
export function ShapeCard({ I, note, on, active, onPlay, compact, sf: given, zones, scale }: { I: ShapeInfo; /** The scale chosen for this chord inside its progression; without it the chord's usual scale. */ scale?: ChordScale; note?: string; on?: boolean; active?: boolean; onPlay?: () => void; compact?: boolean; sf?: ShapeFingers | null; /** Start with the clear zones of the lowest note shown. */ zones?: boolean }) {
  // the note whose clear zones are shaded (Law 2); tap a note to choose it, tap it again to clear
  const [pick, setPick] = useState<number | null>(zones ? 0 : null)
  const held = pick != null ? I.a.notes[pick] : undefined
  const bands = held ? zonesAround(held.midi, I.a.chord.root).map((z) => ({ str: z.str, from: z.from, to: z.to, cls: z.clear ? 'zone-clear' : 'zone-mud' })) : undefined
  const words = held ? zoneWords(held.midi, I.a.chord.root) : null
  // notes in the wrong place: with a note tapped, every note that is mud with it; else the pairs the checker flags
  const plain = I.a.notes.filter((n) => !n.harmonic && !n.artificial)
  const warn = held
    ? I.a.notes.map((n, i) => (!n.harmonic && !n.artificial && !held.harmonic && !held.artificial && clearPair(held.midi, n.midi, I.a.chord.root) === false ? i : -1)).filter((i) => i >= 0)
    : I.a.mud.flatMap((m) => [I.a.notes[m.at], plain[plain.indexOf(I.a.notes[m.at]) + 1]]).map((n) => I.a.notes.indexOf(n))
  const [lefty] = useLefty()
  const F = useFingers()
  const NS = useNeckScale(lefty)
  // the progression's choice when it holds every note of the shape, else the scale that does
  const sc = NS.on ? (scale && I.midis.every((m) => scale.at[m % 12]) ? scale : chordScale(I.sym, { must: I.midis.map((m) => m % 12) })) : null
  const SP = useClip<number>()
  // the chord held, the scale walked up over it, root to root
  const hearScale = () => {
    if (!sc) return
    if (SP.playing) return SP.stop()
    let base = 45
    while (base % 12 !== sc.notes[0].pc) base++
    const up = [...sc.notes.map((n) => base + n.iv), base + 12]
    SP.once(
      [
        {
          notes: [...I.midis.map((m) => ({ t: 0, midi: m, dur: up.length * 0.5 + 1, vel: 0.5 })), ...up.map((m, i) => ({ t: 0.5 + i * 0.5, midi: m, dur: 0.48, vel: 0.9 }))],
          cues: up.map((_, i) => ({ t: 0.5 + i * 0.5, v: i })),
          beats: up.length * 0.5 + 1.5,
        },
      ],
      84,
    )
  }
  // the fingering chosen for the progression when there is one, else the best for this shape alone
  const sf = given === undefined ? F.of(I) : given
  const mud = mudNote(I)
  return (
    <figure className={cx(s.card, on && s.cardOn, compact && s.cardCompact)}>
      <button type="button" className={s.cardHead} onClick={onPlay} aria-label={`Play ${I.sym}`}>
        <b className={s.cardSym}>{I.sym}</b>
        <span className={s.cardPlay}>{active ? '■' : '▶'}</span>
      </button>
      <div className={s.neckWrap}>
        {NS.button}
      <ChordShape
        shape={I.shape}
        labels={degsOf(I)}
        pens={pensOf(I)}
        roots={rootsOf(I)}
        lefty={lefty}
        active={active ? I.a.notes.map((_, i) => i) : []}
        bands={bands}
        picked={pick}
        warn={warn}
        fill={sc ? fillOf(sc) : undefined}
        onNote={(i) => setPick(pick === i ? null : i)}
        {...F.props(sf)}
      />
      </div>
      <figcaption>
        <ShapeRef shape={I.shape} />
        {I.a.stretch && <span className={s.stretch}>stretch</span>}
        <span className={s.notes}>{I.a.notes.map((n) => n.name).join(' ')}</span>
        {!compact && note && (
          <span className={s.cardNote}>
            <CText text={note} />
          </span>
        )}
        {F.show && sf && (
          <span className={s.fingers}>
            ✋ <CText text={fingerText(I, sf)} />
            {sf.split ? '' : sf.f.stretch > 0.93 ? ' · a stretch' : ''}
          </span>
        )}
        {F.show && !sf && <span className={s.mud}>✋ too wide for this hand size: play the root first, then the rest (Law 5), or set a larger hand in Settings</span>}
        {!compact && mud && (
          <span className={s.mud}>
            <CText text={mud} />
            {pick !== I.a.mud[0].at && (
              <>
                {' '}
                <button type="button" className={s.zoneBtn} onClick={() => setPick(I.a.mud[0].at)}>
                  show on the neck
                </button>
              </>
            )}
          </span>
        )}
        {sc && !compact && (
          <span className={s.scaleBox}>
            <span className={s.scaleHead}>
              <b>{sc.title}</b>
              <button type="button" className={s.zoneBtn} onClick={hearScale}>
                {SP.playing ? '■ stop' : '▶ hear it'}
              </button>
            </span>
            <ScaleStrip notes={sc.notes} active={SP.playing ? SP.cue : null} />
            <span className={s.scaleWhy}>{sc.why}</span>
          </span>
        )}
        {held && words && (
          <span className={s.zoneNote}>
            <span>
              Above {held.deg} ({pitchName(held.midi)}):
            </span>
            <span>
              <span className={cx(s.sw, s.swMud)} /> mud: {words.mud.length ? words.mud.join(', ') : 'nothing'}
            </span>
            <span>
              <span className={cx(s.sw, s.swClear)} /> clear: {words.clear.length ? `${words.clear.join(', ')}, an octave or more` : 'an octave or more'}
            </span>
          </span>
        )}
      </figcaption>
    </figure>
  )
}

/** A `shapes` block: cards, or for a progression (seq) the voice lines and the moves between chords. */
export function ShapesBlock({ title, rows, caption, seq, tempo = 72, zones, scales }: { title?: string; rows: string[]; caption?: string; seq?: boolean; tempo?: number; zones?: boolean; /** A scale per row, when the page has already chosen them. */ scales?: (ChordScale | undefined)[] }) {
  const P = useClip<number>()
  const [addRoot, setAddRoot] = useState(true)
  const items = rows.map(parseRow).map((r) => ({ ...r, I: info(r.sym, r.shape) }))
  const anyRootless = items.some((x) => x.I.rootless)
  const F = useFingers()
  const seqF = seq ? F.seq(items.map((x) => x.I)) : null
  // in a progression each chord's scale follows the key and the chord it goes to
  const seqScales = seq ? progressionScales(items.map((x) => x.I.sym)).scales : null
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
          <ShapeCard key={i} I={x.I} note={x.note} on={P.cue === i} active={P.cue === i} onPlay={() => playOne(i)} sf={seqF ? seqF[i] : undefined} zones={zones} scale={scales?.[i] ?? seqScales?.[i]} />
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
  const F = useFingers()
  // step 0 is the first chord alone; each later step is the move into that chord
  const [pick, setPick] = useState(0)
  // a progression shown without a player of its own page (a generated one, a play-along's) plays itself
  const own = !onPick
  const P = useClip<number>()
  const now = at ?? (own && P.playing ? P.cue : null)
  const k = Math.min(now ?? pick, items.length - 1)
  const playAll = () => (P.playing ? P.stop() : P.once(items.map((x, i) => shapeBar(x.I, 'block', 4, i, true)), 72))
  const hear = (i: number) => (onPick ? onPick(i) : P.once([shapeBar(items[i].I, 'roll', 3, i, true)], 72))
  const cur = items[k].I
  const prev = k > 0 ? items[k - 1].I : null
  const moves = prev ? describeMove(prev, cur) : null
  const seqF = F.seq(items.map((x) => x.I))
  const sfCur = seqF[k]
  const sfPrev = k > 0 ? seqF[k - 1] : null
  const fmoves = F.show && prev && sfCur && sfPrev ? fingerMoveText({ I: prev, sf: sfPrev }, { I: cur, sf: sfCur }) : null
  const NS = useNeckScale(lefty)
  const PS = NS.on ? progressionScales(items.map((x) => x.I.sym)) : null
  const scCur = PS ? (cur.midis.every((m) => PS.scales[k].at[m % 12]) ? PS.scales[k] : chordScale(cur.sym, { must: cur.midis.map((m) => m % 12) })) : null
  return (
    <div className={s.prog}>
      <div className={s.progLines}>
        <VoiceLines
          chords={items.map(({ I }) => ({ label: I.sym, midis: I.midis, names: I.a.notes.map((n) => n.name), degs: degsOf(I) }))}
          at={now}
          focus={k}
        />
      </div>
      <div className={s.progMove}>
        <div className={s.progNav}>
          <Button size="sm" variant="pencil" disabled={k <= 0} onClick={() => setPick(Math.max(0, k - 1))}>
            ◀
          </Button>
          <span>
            {prev ? (
              <>
                <b>{prev.sym}</b> → <b>{cur.sym}</b>
                {scCur && <small className={s.cardScale}> {scCur.title}</small>}
              </>
            ) : (
              <>
                start: <b>{cur.sym}</b>
                {scCur && <small className={s.cardScale}> {scCur.title}</small>}
              </>
            )}
          </span>
          <Button size="sm" variant="pencil" disabled={k >= items.length - 1} onClick={() => setPick(Math.min(items.length - 1, k + 1))}>
            ▶
          </Button>
          <Button size="sm" variant="pencil" onClick={() => hear(k)}>
            hear {cur.sym}
          </Button>
          {own && (
            <Button size="sm" variant={P.playing ? 'ink' : 'default'} onClick={playAll}>
              {P.playing ? '■ Stop' : '▶ Play in order'}
            </Button>
          )}
        </div>
        <div className={s.neckWrap}>
          {NS.button}
          {prev ? (
          <ShapeMove
            from={{ shape: prev.shape }}
            to={{ shape: cur.shape, labels: degsOf(cur), pens: pensOf(cur), roots: rootsOf(cur), fill: scCur ? fillOf(scCur) : undefined, ...F.props(sfCur) }}
            lefty={lefty}
          />
        ) : (
          <ChordShape shape={cur.shape} labels={degsOf(cur)} pens={pensOf(cur)} roots={rootsOf(cur)} lefty={lefty} fill={scCur ? fillOf(scCur) : undefined} {...F.props(sfCur)} />
        )}
        </div>
        {!prev && <p className={s.moveText}>The first chord. Press ▶ to see how each finger moves to {items[1]?.I.sym ?? 'the next chord'}.</p>}
        {moves && <p className={s.moveText}>{moves}</p>}
        {fmoves && (
          <p className={s.fingerMove}>
            ✋ <CText text={fmoves} />
          </p>
        )}
        {prev && <p className={s.moveKey}>dashed pencil = the chord before · thick ring = the note stays · arrow = the note moves · ½ = a half-step pull · yellow tag = finger</p>}
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
