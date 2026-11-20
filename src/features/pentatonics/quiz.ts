import { mod, nm, parseName, pc, type Note } from '../../theory/notes'
import { MAJ_BY_PC, MIN_BY_PC } from '../../theory/keys'
import { intervalOver, PENT, pentNotes, pentName, type PentKind } from '../../theory/pentatonic'
import { pick, shuffle } from '../../theory/random'
import { chordTones, drillChord, rootOf } from './chords'
import { LADDERS } from './ladders'
import { SLIP_MIN, type PentRef } from './model'

export interface PQuestion {
  prompt: string
  options: string[]
  answer: string
  why: string
}

export type QType =
  | 'notes'
  | 'formula'
  | 'relative'
  | 'blueNote'
  | 'intervalsOf'
  | 'whichPent'
  | 'common'
  | 'altitude'
  | 'slip'
  | 'mindset'

const tonic = (p: number, minor: boolean): Note => parseName((minor ? MIN_BY_PC : MAJ_BY_PC)[mod(p, 12)].replace(/m$/, ''))
const list = (ns: Note[]) => ns.map(nm).join(' ')

/** Wrong-but-plausible note sets: one note moved a half step. */
function nearMisses(ns: Note[]): string[] {
  const out = new Set<string>()
  for (let i = 1; i < ns.length; i++)
    for (const d of [-1, 1]) {
      const x = ns.slice()
      x[i] = { l: x[i].l, a: x[i].a + d }
      if (Math.abs(x[i].a) <= 1) out.add(list(x))
    }
  return [...out]
}

const choose = (answer: string, wrong: string[], n = 4) => shuffle([answer, ...shuffle([...new Set(wrong.filter((w) => w !== answer))]).slice(0, n - 1)])

const refLabel = (root: Note, ref: PentRef) => pentName(drillChord(root, 'm7', [ref]).sets[0].root, ref.kind)

const GEN: Record<QType, () => PQuestion> = {
  notes: () => {
    const kind: PentKind = pick(['minor', 'major'])
    const r = tonic(Math.floor(Math.random() * 12), kind === 'minor')
    const ns = pentNotes(r, kind)
    const ans = list(ns)
    return {
      prompt: `Which notes are in ${pentName(r, kind)}?`,
      options: choose(ans, nearMisses(ns)),
      answer: ans,
      why: `${pentName(r, kind)} = ${PENT[kind].formula} from ${nm(r)}: ${ans}.`,
    }
  },
  formula: () => {
    const kind: PentKind = pick(['minor', 'major', 'blues', 'minor6'])
    const all = (['minor', 'major', 'blues', 'minor6', 'majorBlues'] as PentKind[]).map((k) => PENT[k].formula)
    return {
      prompt: `What is the formula of the ${PENT[kind].name}?`,
      options: choose(PENT[kind].formula, [...all, '1 2 ♭3 5 ♭7', '1 3 4 5 7']),
      answer: PENT[kind].formula,
      why: `The ${PENT[kind].name} is ${PENT[kind].formula}.`,
    }
  },
  relative: () => {
    const p = Math.floor(Math.random() * 12)
    const m = tonic(p, true)
    const M = tonic(p + 3, false)
    const ans = `${nm(M)} major pentatonic`
    return {
      prompt: `${pentName(m, 'minor')} has the same five notes as…`,
      options: choose(ans, [`${nm(tonic(p + 9, false))} major pentatonic`, `${nm(tonic(p + 5, false))} major pentatonic`, `${nm(tonic(p + 7, false))} major pentatonic`, `${nm(tonic(p, false))} major pentatonic`]),
      answer: ans,
      why: `A minor pentatonic and the major pentatonic a minor 3rd up share their notes: ${list(pentNotes(m, 'minor'))}.`,
    }
  },
  blueNote: () => {
    const r = tonic(Math.floor(Math.random() * 12), true)
    const b = pentNotes(r, 'blues')[3]
    const ans = `${nm(b)} (the ♭5 / ♯4)`
    const others = pentNotes(r, 'major').map((n) => `${nm(n)} (the ${['1', '2', '3', '5', '6'][pentNotes(r, 'major').indexOf(n)]})`)
    return {
      prompt: `Which note turns ${pentName(r, 'minor')} into the ${nm(r)} blues scale?`,
      options: choose(ans, others),
      answer: ans,
      why: `The blues scale adds the ♭5 (♯4) between the 4th and the 5th: ${list(pentNotes(r, 'blues'))}.`,
    }
  },
  intervalsOf: () => {
    const L = pick(LADDERS)
    const p = Math.floor(Math.random() * 12)
    const root = rootOf(p, L.q)
    const ref = pick(L.rungs.filter((x) => x !== SLIP_MIN))
    const c = drillChord(root, L.q, [ref])
    const s = c.sets[0]
    const lab = (rf: PentRef) => drillChord(root, L.q, [rf]).sets[0].pcs.map((x) => intervalOver(x, c.rootPc, c.tones)).join(' ')
    const ans = lab(ref)
    const wrong = LADDERS.flatMap((l) => l.rungs).map(lab)
    return {
      prompt: `Over ${c.chord.sym}, ${pentName(s.root, ref.kind)} gives you…`,
      options: choose(ans, wrong),
      answer: ans,
      why: `${list(s.notes)} over ${c.chord.sym} = ${ans}. ${ref.say ?? ''}`,
    }
  },
  whichPent: () => {
    const L = pick(LADDERS.filter((l) => l.rungs.length > 1))
    const p = Math.floor(Math.random() * 12)
    const root = rootOf(p, L.q)
    const ref = pick(L.rungs)
    const c = drillChord(root, L.q, [ref])
    const labs = c.sets[0].pcs.map((x) => intervalOver(x, c.rootPc, c.tones)).join(' ')
    const ans = refLabel(root, ref)
    const key = (r: PentRef) => drillChord(root, L.q, [r]).sets[0].pcs.slice().sort().join()
    // leave out other names for the same five notes (B♭m pent = D♭ pent)
    const wrong = [...L.rungs, ...LADDERS.flatMap((l) => l.rungs)].filter((r) => key(r) !== key(ref)).map((r) => refLabel(root, r))
    return {
      prompt: `Over ${c.chord.sym}, which pentatonic gives ${labs}?`,
      options: choose(ans, wrong),
      answer: ans,
      why: `${ans} is built ${ref.role} of ${c.chord.sym}.`,
    }
  },
  common: () => {
    const p = Math.floor(Math.random() * 12)
    const a = tonic(p, true)
    const b = tonic(p + 7, true)
    const A = pentNotes(a, 'minor')
    const B = new Set(pentNotes(b, 'minor').map(pc))
    const shared = A.filter((n) => B.has(pc(n)))
    const ans = list(shared)
    return {
      prompt: `Which notes do ${pentName(a, 'minor')} and ${pentName(b, 'minor')} share?`,
      options: choose(ans, [list(A.slice(0, 4)), list(A.slice(1)), list([A[0], A[2], A[3], A[4]]), list([A[1], A[2], A[3], A[4]])]),
      answer: ans,
      why: `Pentatonics a 5th apart share four notes (${ans}) — switch on one of them and you get a repeated note.`,
    }
  },
  altitude: () => {
    const p = Math.floor(Math.random() * 12)
    const L = pick(LADDERS.filter((l) => l.rungs.length >= 3))
    const root = rootOf(p, L.q)
    const sym = drillChord(root, L.q, []).chord.sym
    const top = L.rungs[L.q === '7' ? 3 : 2]
    const ans = refLabel(root, top)
    return {
      prompt: `Over ${sym}, which of these sits highest on the altitude ladder (most colour, still “in”)?`,
      options: choose(ans, L.rungs.slice(0, 2).map((r) => refLabel(root, r)).concat(refLabel(root, L.rungs[0]))),
      answer: ans,
      why: `${ans} (${top.role}): ${top.say}`,
    }
  },
  slip: () => {
    const p = Math.floor(Math.random() * 12)
    const root = rootOf(p, 'm7')
    const c = drillChord(root, 'm7', [SLIP_MIN])
    const ans = pentName(c.sets[0].root, 'minor')
    return {
      prompt: `Side-slipping over ${c.chord.sym}: which pentatonic is a half step up?`,
      options: choose(ans, [1, 2, 5, 7, 10, 11].map((d) => pentName(tonic(p + d, true), 'minor'))),
      answer: ans,
      why: `${ans} is a half step above ${nm(root)} minor pentatonic: outside for a moment, then slide back in.`,
    }
  },
  mindset: () => {
    const items: [string, string, string[], string][] = [
      ['When do you think about interval numbers (9, 11, 13)?', 'When building and practising vocabulary', ['While soloing on stage', 'Never', 'Only on the bass drum hits'], 'Analyse in the shed so your ear learns the sound; on the gig, play what you hear.'],
      ['Why limit yourself to four notes per pentatonic when practising?', 'So the line keeps moving and never sounds like a scale', ['Because pentatonics only have four notes', 'To play faster', 'So you stay in one position'], 'More than four notes in one shape and it sounds like practising the scale.'],
      ['What tends to happen when you switch to an adjacent pentatonic on a shared note?', 'A repeated note', ['A wrong note', 'A key change', 'The groove stops'], 'Adjacent pentatonics share notes; switching on one gives the repeated-note energy.'],
      ['Running a pentatonic straight up and down in a solo…', 'gives the device away', ['always sounds modern', 'is the best way to resolve', 'hides the root'], 'Sequences up and down sound like an exercise; weave and change direction instead.'],
    ]
    const [q, a, w, why] = pick(items)
    return { prompt: q, options: choose(a, w), answer: a, why }
  },
}

export function genPQuestion(types: QType[]): PQuestion {
  for (let k = 0; k < 20; k++) {
    const q = GEN[pick(types)]()
    if (q.options.length >= 3 && q.options.includes(q.answer)) return q
  }
  return GEN.formula()
}

export { chordTones }
