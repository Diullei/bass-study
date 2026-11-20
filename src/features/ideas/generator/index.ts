import { buildChords } from '../harmony'
import type { Idea, IdeaSettings } from '../model'
import { makeCtx } from './context'
import { applyFeel } from './feel'
import { genFills } from './fills'
import { assignFrets } from '../../../engine/fretPath'
import { genSolo } from './phrase'
import { ivLabel } from './pitch'

/**
 * Generate a bass idea. The same settings and seed always give the same idea,
 * so switching a layer on changes only what that layer is about.
 */
export function generateIdea(S: IdeaSettings): Idea {
  const { K, chords } = buildChords(S)
  const ctx = makeCtx(S, K, chords)
  const notes = S.mode === 'fills' ? genFills(ctx) : genSolo(ctx)
  notes.sort((a, b) => a.t - b.t)
  applyFeel(notes, ctx)
  // a note never rings into the next one
  for (let i = 0; i < notes.length - 1; i++) notes[i].dur = Math.max(1, Math.min(notes[i].dur, notes[i + 1].t - notes[i].t))
  const last = notes[notes.length - 1]
  if (last) last.dur = Math.max(1, Math.min(last.dur, ctx.T - last.t))
  assignFrets(notes, S.five)
  notes.forEach((n) => (n.label = n.ghost ? '' : ivLabel(n.midi, chords[n.ci])))
  ctx.log.sort((a, b) => a.t - b.t)
  return { K, chords, notes, log: ctx.log, bars: ctx.bars, T: ctx.T }
}
