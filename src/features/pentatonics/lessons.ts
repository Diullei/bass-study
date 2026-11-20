import type { PentKind } from '../../theory/pentatonic'
import type { DrillSpec } from './drills'
import { FOURTH_MAJ_M6, NINTH_MIN_M6 } from './ladders'
import {
  B3_MIN_ALT,
  B3_MIN_HALFDIM,
  FIFTH_MAJ,
  FIFTH_MIN,
  FIFTH_MIN_DOM,
  NINTH_MAJ,
  NINTH_MIN,
  R_BLUES,
  R_MAJ,
  R_MIN,
  R_MIN6,
  type PentRef,
} from './model'
import type { QType } from './quiz'

/** A piece of a lesson page. Text supports **bold**. */
export type Block =
  | { t: 'p'; text: string }
  | { t: 'list'; items: string[] }
  | { t: 'tip'; title: string; text: string }
  /** The altitude ladder of a chord type: table, fretboard, listen. */
  | { t: 'ladder'; q: string; root?: number; only?: number[] }
  /** One pentatonic on the neck, labelled by degree. */
  | { t: 'shape'; kind: PentKind; root: number; from?: number; to?: number; caption: string }
  /** A fixed, playable example. */
  | { t: 'example'; title: string; spec: DrillSpec; root: number; seed: number; choice?: number }

export interface PentLesson {
  id: string
  part: number
  title: string
  goal: string
  blocks: Block[]
  /** The practice: one or more generated drills (any key). */
  drills: { name: string; spec: DrillSpec }[]
  /** Default root of the drill (pitch class), and default pentatonic choice. */
  root: number
  choice?: number
  tempo: number
  quiz: QType[]
}

export const PARTS = [
  'The shape',
  'Grooves & the blues',
  'Over chords: the altitude ladder',
  'Weaving',
  'Through the changes',
  'Beyond the box',
]

const REL_MIN: PentRef = { deg: 6, semis: 9, kind: 'minor', role: 'relative minor (from the 6th)', say: 'The same five notes, with the 6th as home.' }
const KEY_BLUES = (deg: number, semis: number): PentRef => ({ ...R_BLUES, deg, semis, role: 'the key’s blues scale' })
const CHORD_PENT: PentRef = { ...R_MAJ, role: 'the chord’s major pentatonic' }

export const LESSONS: PentLesson[] = [
  // ───────────── Part 1: the shape ─────────────
  {
    id: 'five-notes',
    part: 0,
    title: 'Five notes, no wrong ones',
    goal: 'Learn the minor pentatonic, and why it is the safest scale on the bass.',
    blocks: [
      { t: 'p', text: 'A pentatonic is a five-note scale. The **minor pentatonic** is **1 ♭3 4 5 ♭7**: the natural minor scale with its 2nd and ♭6 taken out.' },
      { t: 'p', text: 'What is left has **no half steps**. With no half steps, no two notes rub against each other, so every note sounds good over the whole key. That is why it is the first scale most bass players learn, and why it never stops being useful.' },
      { t: 'shape', kind: 'minor', root: 9, from: 3, to: 9, caption: 'A minor pentatonic in 5th position. Filled dots are the root.' },
      {
        t: 'list',
        items: [
          'Root on the E string, 5th fret. Fingers 1 and 4 on the E and A strings, 1 and 3 on the D and G strings.',
          'Say the degrees while you play: 1, ♭3, 4, 5, ♭7, 1.',
          'The shape is the scale; the fret is the key. Move it and you have the same scale in a new key.',
        ],
      },
      { t: 'example', title: 'A minor pentatonic, up and down', spec: { type: 'scale', q: 'm7', pents: [R_MIN], octaves: 1 }, root: 9, seed: 1 },
      { t: 'tip', title: 'Practise it like music', text: 'Slowly, with the click on 2 and 4. Then start from the ♭3 or the 5th instead of the root.' },
    ],
    drills: [{ name: 'Minor pentatonic', spec: { type: 'scale', q: 'm7', pents: [R_MIN], octaves: 1 } }],
    root: 9,
    tempo: 80,
    quiz: ['notes', 'formula'],
  },
  {
    id: 'major-minor',
    part: 0,
    title: 'Major and minor: the same five notes',
    goal: 'One set of notes, two names: the major pentatonic and its relative minor.',
    blocks: [
      { t: 'p', text: 'The **major pentatonic** is **1 2 3 5 6**: the major scale without the 4th and the 7th, the two notes that make half steps.' },
      { t: 'p', text: 'Play C major pentatonic: C D E G A. Now A minor pentatonic: A C D E G. **The same notes.** Every minor pentatonic is the major pentatonic a minor 3rd up. Learn the shapes once and use them both ways. What changes is which note is home.' },
      { t: 'shape', kind: 'major', root: 0, from: 0, to: 12, caption: 'C major pentatonic. The same dots as A minor pentatonic, with C as home.' },
      {
        t: 'list',
        items: [
          'Major pentatonic sounds bright and open: country, pop, soul.',
          'Minor pentatonic sounds darker: blues, rock, funk.',
          'Over a major chord, home is the major root; over a minor chord, the minor root.',
        ],
      },
      { t: 'example', title: 'C major pentatonic over Cmaj7', spec: { type: 'scale', q: 'maj7', pents: [R_MAJ], octaves: 1 }, root: 0, seed: 1 },
    ],
    drills: [{ name: 'Major pentatonic or its relative minor', spec: { type: 'scale', q: 'maj7', pents: [R_MAJ, REL_MIN], octaves: 1 } }],
    root: 0,
    tempo: 80,
    quiz: ['relative', 'formula', 'notes'],
  },
  {
    id: 'whole-neck',
    part: 0,
    title: 'Two octaves across the neck',
    goal: 'Connect the shapes, so the pentatonic covers the whole neck.',
    blocks: [
      { t: 'p', text: 'One box covers about an octave. To use the whole bass, learn how the shapes join: each one starts on the next note of the scale, and the top of one is the bottom of the next.' },
      { t: 'p', text: 'On bass it is easier to **shift** than to stretch: two notes per string, sliding up the neck on the way up, so a two-octave run climbs from the 5th fret past the 12th.' },
      { t: 'shape', kind: 'minor', root: 9, from: 0, to: 15, caption: 'A minor pentatonic up to the 15th fret. Find the box from lesson 1, then the box that starts on each next note.' },
      {
        t: 'list',
        items: [
          'Pick one degree (say the ♭3) and find it on every string.',
          'Play the two-octave run, then find the same notes in another position.',
          'On a 5-string, the low B gives you the box below the 5th fret without open strings.',
        ],
      },
      { t: 'example', title: 'Two octaves of A minor pentatonic', spec: { type: 'scale', q: 'm7', pents: [R_MIN], octaves: 2 }, root: 9, seed: 1 },
    ],
    drills: [{ name: 'Two octaves', spec: { type: 'scale', q: 'm7', pents: [R_MIN, FIFTH_MIN], octaves: 2 } }],
    root: 9,
    tempo: 80,
    quiz: ['notes', 'relative'],
  },
  {
    id: 'sequences',
    part: 0,
    title: 'Sequences: from scale to music',
    goal: 'Break the up-and-down habit with groups of 3, groups of 4 and 4ths.',
    blocks: [
      { t: 'p', text: 'Running a scale straight up and down is the sound of practising. **Sequences** reorder the same notes: groups of three (1 2 3, 2 3 4 …), groups of four, or **in 4ths**, every other note, which on a pentatonic is mostly perfect 4ths.' },
      { t: 'p', text: 'The 4ths sound matters: it is open and modern, and on bass it lies across adjacent strings at the same fret. You will hear it all through the advanced lessons.' },
      {
        t: 'list',
        items: [
          'Groups of 3 in 8th notes cross the beat: accent the first note of each group to feel it.',
          'In 4ths: play each pair on adjacent strings and roll one finger across.',
          'Do every pattern up and down, then start it on a different note.',
        ],
      },
      { t: 'example', title: 'D minor pentatonic in 4ths', spec: { type: 'sequence', q: 'm7', pents: [R_MIN], pattern: '4ths' }, root: 2, seed: 1 },
    ],
    drills: [
      { name: 'Groups of 3', spec: { type: 'sequence', q: 'm7', pents: [R_MIN, R_MAJ], pattern: '3s' } },
      { name: 'Groups of 4', spec: { type: 'sequence', q: 'm7', pents: [R_MIN, R_MAJ], pattern: '4s' } },
      { name: 'In 4ths', spec: { type: 'sequence', q: 'm7', pents: [R_MIN, R_MAJ], pattern: '4ths' } },
    ],
    root: 2,
    tempo: 84,
    quiz: ['mindset', 'formula'],
  },

  // ───────────── Part 2: grooves & the blues ─────────────
  {
    id: 'riffs',
    part: 1,
    title: 'Riffs and grooves',
    goal: 'Use the minor pentatonic the way a bass player does first: as the groove.',
    blocks: [
      { t: 'p', text: 'Before it is a soloing scale, the pentatonic is the bass line. The **root, the ♭7 below, the octave and the 5th** are the skeleton of a thousand funk, rock and soul grooves; the ♭3 and 4 are the passing colour.' },
      {
        t: 'list',
        items: [
          'Lock the root to the kick drum; put the octave or the ♭7 on the off-beats.',
          'Play the riff three times and answer with a fill in the 4th bar: call and answer.',
          'Play the notes short. The space between them is half the groove.',
        ],
      },
      { t: 'example', title: 'A riff in E', spec: { type: 'riff', q: 'm7' }, root: 4, seed: 3 },
    ],
    drills: [{ name: 'Riff + fill', spec: { type: 'riff', q: 'm7' } }],
    root: 4,
    tempo: 92,
    quiz: ['notes', 'formula'],
  },
  {
    id: 'blue-note',
    part: 1,
    title: 'The blue note',
    goal: 'Add the ♭5 to make the blues scale, and learn where it belongs.',
    blocks: [
      { t: 'p', text: 'Add one note to the minor pentatonic, between the 4th and the 5th, and you get the **blues scale**: **1 ♭3 4 ♭5 5 ♭7**. That ♭5 (or ♯4) is the blue note.' },
      { t: 'p', text: 'It is a **passing note**, not a place to stay. Going up, slip through it: 4 → ♯4 → 5. Coming down: 5 → ♭5 → 4. Sit on it and it sounds wrong; pass through it and it sounds like the blues.' },
      {
        t: 'list',
        items: [
          'In the drills the blue notes are written in purple pen.',
          'Play it as a quick 16th, or hammer-on / slide from it into the 5th.',
          'It works over minor chords and over dominant 7ths (the blues).',
        ],
      },
      { t: 'example', title: 'Blues scale over Am7', spec: { type: 'blues', q: 'm7', level: 1 }, root: 9, seed: 4 },
    ],
    drills: [
      { name: 'Over a minor chord', spec: { type: 'blues', q: 'm7', level: 1 } },
      { name: 'Over a dominant (the blues)', spec: { type: 'blues', q: '7', level: 1 } },
    ],
    root: 9,
    tempo: 84,
    quiz: ['blueNote', 'formula'],
  },
  {
    id: 'major-blues',
    part: 1,
    title: 'Sweet and sour: major meets blues',
    goal: 'Mix the major pentatonic and the blues scale over dominant chords.',
    blocks: [
      { t: 'p', text: 'The **major blues scale** is the major pentatonic plus the ♭3: **1 2 ♭3 3 5 6**. The ♭3 slides up into the 3: the country, gospel and soul sound.' },
      { t: 'p', text: 'Over a dominant 7th you can use both: the major pentatonic for the sweet side, the blues scale for the gritty side. Moving between them inside one phrase is the sound of a blues bass solo.' },
      { t: 'example', title: 'Major blues over C7', spec: { type: 'blues', q: '7', major: true, level: 1 }, root: 0, seed: 2 },
    ],
    drills: [
      { name: 'Major blues', spec: { type: 'blues', q: '7', major: true, level: 1 } },
      { name: 'Major pentatonic ↔ blues scale', spec: { type: 'weave', q: '7', pents: [R_MAJ, R_BLUES], maxRun: 4, level: 1 } },
    ],
    root: 0,
    tempo: 88,
    quiz: ['formula', 'blueNote'],
  },

  // ───────────── Part 3: the altitude ladder ─────────────
  {
    id: 'altitude',
    part: 2,
    title: 'The altitude ladder',
    goal: 'Hear why the root pentatonic sounds “inside”, and meet the idea of altitude.',
    blocks: [
      { t: 'p', text: 'Over a D minor chord, D minor pentatonic gives **R ♭3 11 5 ♭7**. Every note belongs, and the root and ♭3 tie the sound to the ground. It is right, and it is what everybody plays first.' },
      { t: 'p', text: 'Now think of all the pentatonics that fit a chord as the rungs of a ladder. The bottom rung is the root pentatonic: grounded. Each rung up swaps a grounding note (the root, the 3rd) for a colour (9, 11, 13). Climbing raises the **altitude** of your line without leaving the chord. One more step and you are outside.' },
      { t: 'ladder', q: 'm7' },
      {
        t: 'list',
        items: [
          'The higher the rung, the less the line spells out the chord, and the more it floats over it.',
          'Altitude works like a dial for tension: climb to build, come down to release.',
          'Every chord type has its own ladder. This part climbs the minor one, then all the others; the Pentatonic map shows any chord in any key.',
        ],
      },
      { t: 'tip', title: 'Think in the shed, not on stage', text: 'Naming “9, 11, 13” while you practise teaches your ear what each rung sounds like. On the gig, forget the numbers and play what you hear.' },
    ],
    drills: [{ name: 'One rung at a time', spec: { type: 'over', q: 'm7', pents: [R_MIN, FIFTH_MIN, NINTH_MIN], level: 1 } }],
    root: 2,
    tempo: 84,
    quiz: ['intervalsOf', 'formula'],
  },
  {
    id: 'from-the-fifth',
    part: 2,
    title: 'From the 5th: above the harmony',
    goal: 'Play the minor pentatonic built on the 5th of a minor chord.',
    blocks: [
      { t: 'p', text: 'Build the minor pentatonic on the **5th** of a minor chord. Over Dm7, A minor pentatonic (A C D E G) gives **5 ♭7 R 9 11**. The ♭3 is gone, the root is hidden in the middle, and the 9 and 11 come forward.' },
      { t: 'p', text: 'The line now floats above the chord instead of sitting in it: the modern sound. Start and end phrases on the 5th and you never land on the obvious note.' },
      { t: 'ladder', q: 'm7', only: [0, 1] },
      {
        t: 'list',
        items: [
          'Same shape as lesson 1, seven frets higher.',
          'It works over any minor 7th: Gm7 → D minor pentatonic, Cm7 → G minor pentatonic, F♯m7 → C♯ minor pentatonic.',
          'Nothing in it says “root-position minor chord”. The harmony underneath supplies that.',
        ],
      },
      { t: 'example', title: 'A minor pentatonic over Dm7', spec: { type: 'over', q: 'm7', pents: [R_MIN, FIFTH_MIN, NINTH_MIN], level: 1 }, root: 2, seed: 9, choice: 1 },
    ],
    drills: [{ name: 'Over a minor 7th', spec: { type: 'over', q: 'm7', pents: [R_MIN, FIFTH_MIN, NINTH_MIN], level: 1 } }],
    root: 2,
    choice: 1,
    tempo: 84,
    quiz: ['intervalsOf', 'whichPent'],
  },
  {
    id: 'from-the-ninth',
    part: 2,
    title: 'From the 9th: high altitude',
    goal: 'Reach the top of the minor ladder: the pentatonic on the 9th.',
    blocks: [
      { t: 'p', text: 'One more rung: the minor pentatonic on the **9th**. Over Dm7, E minor pentatonic (E G A B D) gives **9 11 5 13 R**: the 9th and the Dorian 13th, with no ♭3 and no ♭7.' },
      { t: 'p', text: 'This is the top of the inside ladder: all colour, no ground. Tense, yet still part of the chord. Drop back to the root pentatonic and you feel the altitude fall; the ♭3 is the note that brings you back down.' },
      { t: 'ladder', q: 'm7', only: [0, 1, 2] },
      {
        t: 'list',
        items: [
          'Best over Dorian minor chords: ii7 chords and modal vamps. Over a minor chord that wants the ♭6 (Aeolian, the i of a minor key), the 13 can clash.',
          'On the neck: root pentatonic, up 7 frets for the 5th, up 2 frets from the root for the 9th.',
          'Am7 → B minor pentatonic; Cm7 → D minor pentatonic; E♭m7 → F minor pentatonic.',
        ],
      },
      { t: 'example', title: 'E minor pentatonic over Dm7', spec: { type: 'over', q: 'm7', pents: [R_MIN, FIFTH_MIN, NINTH_MIN], level: 1 }, root: 2, seed: 5, choice: 2 },
    ],
    drills: [{ name: 'Over a minor 7th', spec: { type: 'over', q: 'm7', pents: [R_MIN, FIFTH_MIN, NINTH_MIN], level: 1 } }],
    root: 2,
    choice: 2,
    tempo: 84,
    quiz: ['altitude', 'whichPent', 'intervalsOf'],
  },
  {
    id: 'major-ladder',
    part: 2,
    title: 'Major chords: up to Lydian',
    goal: 'Climb the ladder on a major 7th chord.',
    blocks: [
      { t: 'p', text: 'The same climb works on a major 7th chord, with major pentatonics: from the root (C over Cmaj7: **R 9 3 5 13**), from the 5th (G: **5 13 7 9 3**) and from the 9th (D: **9 3 ♯11 13 7**).' },
      { t: 'p', text: 'The top rung brings the ♯11, the bright and open Lydian sound. Notice what no rung has: the 4th (F), the note that clashes with the 3rd. The pentatonic from the 4th is the one to avoid.' },
      { t: 'ladder', q: 'maj7' },
      {
        t: 'list',
        items: [
          'As minor pentatonics: A, E and B minor over Cmaj7 (built on the 6th, 3rd and 7th).',
          'The ♯11 rung suits IV chords and modern ballads; on a plain I chord, use it as a passing colour.',
        ],
      },
    ],
    drills: [{ name: 'Over a major 7th', spec: { type: 'over', q: 'maj7', pents: [R_MAJ, FIFTH_MAJ, NINTH_MAJ], level: 1 } }],
    root: 0,
    choice: 1,
    tempo: 84,
    quiz: ['intervalsOf', 'whichPent', 'altitude'],
  },
  {
    id: 'dominant-ladder',
    part: 2,
    title: 'Dominants: sweet, blue, sus and altered',
    goal: 'Use the widest ladder of all, on the chord that wants to move.',
    blocks: [
      { t: 'p', text: 'A dominant 7th has the widest ladder, because it is the chord that wants to go somewhere. Over G7: **G major pentatonic** (inside and sweet), **G blues** (the gritty side), **D minor pentatonic** from the 5th (5 ♭7 R 9 11, the sus sound with the 11 hanging over the 3rd) and **B♭ minor pentatonic** from the ♭3 (♯9 ♯11 ♭13 ♭7 ♭9, altered).' },
      { t: 'p', text: 'The higher rungs are **tension that has to resolve**. Climb on the dominant, then land on a chord tone of the next chord, best of all its 3rd.' },
      { t: 'ladder', q: '7' },
      { t: 'tip', title: 'Same notes, two names', text: 'B♭ minor pentatonic over G7 is D♭ major pentatonic, the tritone substitute’s own scale. One shape, the whole altered sound.' },
    ],
    drills: [{ name: 'Over a dominant 7th', spec: { type: 'over', q: '7', pents: [R_MAJ, R_BLUES, FIFTH_MIN_DOM, B3_MIN_ALT], level: 1 } }],
    root: 7,
    tempo: 84,
    quiz: ['intervalsOf', 'whichPent', 'blueNote'],
  },
  {
    id: 'halfdim-minor6',
    part: 2,
    title: 'Half-diminished and tonic minor',
    goal: 'Complete the set: m7♭5 and minor 6 chords.',
    blocks: [
      { t: 'p', text: 'Over a **half-diminished** chord (Em7♭5), the minor pentatonic from the ♭3 (G minor: G B♭ C D F) gives **♭3 ♭5 ♭13 ♭7 ♭9**: the whole Locrian colour in five notes.' },
      { t: 'ladder', q: 'm7♭5' },
      { t: 'p', text: 'Over a **tonic minor** chord (Dm6, Dm(maj7)) the ♭7 of the minor pentatonic can sound wrong. Use the **minor 6 pentatonic** (1 ♭3 4 5 6: D F G A B), the major pentatonic from the 4th (G: 11 5 6 R 9) or the minor pentatonic from the 9th (E), which has no ♭7 at all.' },
      { t: 'ladder', q: 'm6' },
    ],
    drills: [
      { name: 'Half-diminished', spec: { type: 'over', q: 'm7♭5', pents: [B3_MIN_HALFDIM], level: 1 } },
      { name: 'Tonic minor', spec: { type: 'over', q: 'm6', pents: [R_MIN6, FOURTH_MAJ_M6, NINTH_MIN_M6], level: 1 } },
    ],
    root: 4,
    tempo: 84,
    quiz: ['intervalsOf', 'whichPent', 'formula'],
  },

  // ───────────── Part 4: weaving ─────────────
  {
    id: 'four-note-limit',
    part: 3,
    title: 'The four-note limit',
    goal: 'Weave two pentatonics, never playing more than four notes in one.',
    blocks: [
      { t: 'p', text: 'Knowing the rungs is not enough: run any one of them up and down and the device is obvious. The fix is a practice rule: **never play more than four notes in a row from one pentatonic**, then switch to the next one.' },
      { t: 'p', text: 'Start with two, the root and the 5th pentatonics (Dm and Am over Dm7). They share four notes, so every switch either repeats a note or jumps, and both sound good. The rule makes your hand move, and a moving hand plays bigger intervals.' },
      {
        t: 'list',
        items: [
          'Each pentatonic is written in its own pen: ink for the root pentatonic, green for the one from the 5th.',
          'Switch every time, even when it feels awkward. Slow down rather than break the rule.',
          'Count at first: 1-2-3-switch, 1-2-switch …',
        ],
      },
      { t: 'example', title: 'Dm + Am pentatonics over Dm7', spec: { type: 'weave', q: 'm7', pents: [R_MIN, FIFTH_MIN], maxRun: 4, level: 0 }, root: 2, seed: 7 },
    ],
    drills: [{ name: 'Two pentatonics', spec: { type: 'weave', q: 'm7', pents: [R_MIN, FIFTH_MIN], maxRun: 4, level: 0 } }],
    root: 2,
    tempo: 76,
    quiz: ['mindset', 'common'],
  },
  {
    id: 'repeated-notes',
    part: 3,
    title: 'Repeated notes and wide intervals',
    goal: 'Use shared notes as pivots, and keep the jumps the switches create.',
    blocks: [
      { t: 'p', text: 'D minor and A minor pentatonics share A, C, D and G. Switch on one of those and the same pitch comes twice: a **repeated note**, often on another string or finger. It gives the line a stuttering, insistent energy that no scale has.' },
      { t: 'p', text: 'Switch where there is no shared note and you get the opposite: a **jump** to the nearest note of the new shape, often a 4th, while your hand shifts position. Lines built this way have the wide intervals and restless motion of modern players.' },
      {
        t: 'list',
        items: [
          'Play a repeated note on two different strings: same pitch, new position.',
          'Keep the 4ths and 5ths that appear at the switches.',
          'End each phrase on a chord tone (the drill does this before every breath).',
        ],
      },
    ],
    drills: [
      { name: 'Switch every 2–3 notes', spec: { type: 'weave', q: 'm7', pents: [R_MIN, FIFTH_MIN], maxRun: 3, level: 1 } },
      { name: 'Major chord: C + G pentatonics', spec: { type: 'weave', q: 'maj7', pents: [R_MAJ, FIFTH_MAJ], maxRun: 3, level: 1 } },
    ],
    root: 2,
    tempo: 80,
    quiz: ['common', 'mindset'],
  },
  {
    id: 'three-way',
    part: 3,
    title: 'Three-way weave: riding the altitude',
    goal: 'Weave three rungs and control tension as you play.',
    blocks: [
      { t: 'p', text: 'Add the third rung: weave the root, 5th and 9th pentatonics (Dm, Am, Em over Dm7), always moving to the next rung up or down. Now you control altitude as you play: climb towards the 9th pentatonic to build tension, step down to the root pentatonic to release it.' },
      { t: 'p', text: 'Listen for the moment the line comes back to the ♭3: it feels like landing. Use it on purpose, at the end of a phrase or when the band drops down.' },
      { t: 'ladder', q: 'm7', only: [0, 1, 2] },
      {
        t: 'list',
        items: [
          'Pens: ink = root pentatonic, green = from the 5th, blue = from the 9th.',
          'Do the same over a major 7th (C, G, D pentatonics) and over a dominant (G pentatonic, D minor, B♭ minor), resolving at the end.',
        ],
      },
    ],
    drills: [
      { name: 'Minor 7th', spec: { type: 'weave', q: 'm7', pents: [R_MIN, FIFTH_MIN, NINTH_MIN], maxRun: 4, level: 1 } },
      { name: 'Major 7th', spec: { type: 'weave', q: 'maj7', pents: [R_MAJ, FIFTH_MAJ, NINTH_MAJ], maxRun: 4, level: 1 } },
      { name: 'Dominant 7th', spec: { type: 'weave', q: '7', pents: [R_MAJ, FIFTH_MIN_DOM, B3_MIN_ALT], maxRun: 4, level: 1 } },
    ],
    root: 2,
    tempo: 80,
    quiz: ['altitude', 'intervalsOf', 'mindset'],
  },

  // ───────────── Part 5: through the changes ─────────────
  {
    id: 'two-five-one',
    part: 4,
    title: 'ii–V–I with pentatonics',
    goal: 'Let the chords move: change pentatonic with every chord.',
    blocks: [
      { t: 'p', text: 'Over a ii–V–I in C: **Dm7** → A or E minor pentatonic; **G7** → D minor (sus), then B♭ minor (altered); **Cmaj7** → G or D major pentatonic (the same notes as E and B minor).' },
      { t: 'p', text: 'The chord change is where the ear checks you. Switch pentatonic exactly on the change, and aim the first note of the new chord at a close chord tone, its 3rd or 7th (the guide tones of the Idea Builder).' },
      {
        t: 'list',
        items: [
          'Each bar uses its chord’s pentatonics; the four-note limit still applies inside the bar.',
          'In C the whole progression fits in four shapes that sit close on the neck: A, E, D and B♭ minor.',
          'Change the key with the selector: the drill works in all 12.',
        ],
      },
    ],
    drills: [
      {
        name: 'ii–V–I',
        spec: {
          type: 'changes',
          bars: [
            { rn: 'ii7', pents: [FIFTH_MIN, NINTH_MIN] },
            { rn: 'V7', pents: [FIFTH_MIN_DOM, B3_MIN_ALT] },
            { rn: 'Imaj7', pents: [FIFTH_MAJ, NINTH_MAJ] },
            { rn: 'Imaj7', pents: [R_MAJ, FIFTH_MAJ] },
          ],
          maxRun: 4,
          level: 1,
        },
      },
    ],
    root: 0,
    tempo: 84,
    quiz: ['whichPent', 'intervalsOf', 'altitude'],
  },
  {
    id: 'minor-and-blues',
    part: 4,
    title: 'Minor ii–V–i and the 12-bar blues',
    goal: 'The two other progressions you will meet everywhere.',
    blocks: [
      { t: 'p', text: 'In a minor key: half-diminished ii → the minor pentatonic from its ♭3; altered V → the minor pentatonic from its ♭3 (altered); tonic minor → the minor 6 pentatonic, or the minor pentatonic from the 9th.' },
      { t: 'p', text: 'In a 12-bar blues, mix **the key’s blues scale**, which works over every chord, with **each chord’s own major pentatonic**: the blues scale for grit, the chord’s pentatonic to show the changes.' },
    ],
    drills: [
      {
        name: 'Minor ii–V–i',
        spec: {
          type: 'changes',
          minor: true,
          bars: [
            { rn: 'iiø7', pents: [B3_MIN_HALFDIM] },
            { rn: 'V7♭9', pents: [B3_MIN_ALT] },
            { rn: 'i6', pents: [R_MIN6, NINTH_MIN_M6] },
            { rn: 'i6', pents: [R_MIN6, FOURTH_MAJ_M6] },
          ],
          maxRun: 4,
          level: 1,
        },
      },
      {
        name: '12-bar blues',
        spec: {
          type: 'changes',
          bars: ['I7', 'IV7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'].map((rn) => ({
            rn,
            pents: [CHORD_PENT, rn === 'I7' ? KEY_BLUES(1, 0) : rn === 'IV7' ? KEY_BLUES(5, 7) : KEY_BLUES(4, 5)],
          })),
          maxRun: 4,
          level: 1,
        },
      },
    ],
    root: 9,
    tempo: 88,
    quiz: ['blueNote', 'whichPent', 'intervalsOf'],
  },

  // ───────────── Part 6: beyond the box ─────────────
  {
    id: 'side-slip',
    part: 5,
    title: 'Side-slipping: outside and back',
    goal: 'Step off the ladder on purpose, and come back cleanly.',
    blocks: [
      { t: 'p', text: 'Above the top rung is **outside**: the same pentatonic a half step up (E♭ minor over Dm7). None of its five notes is a chord tone (over Dm7 it gives ♭9 3 ♯11 ♭13 7). Played for a beat or two and then resolved by a half step back into the chord’s pentatonic, it sounds deliberate: tension and release at their purest.' },
      { t: 'p', text: 'The rule: get out briefly, come back cleanly, land on a strong chord tone. The drill slips out for two beats in bar 2 and three beats in bar 4, written in purple pen, then resolves.' },
      { t: 'ladder', q: 'm7' },
    ],
    drills: [{ name: 'Slip and resolve', spec: { type: 'sideslip', q: 'm7', level: 1 } }],
    root: 2,
    tempo: 80,
    quiz: ['slip', 'altitude'],
  },
  {
    id: 'sing-it',
    part: 5,
    title: 'Sing it first',
    goal: 'Connect your ear to the fingerboard.',
    blocks: [
      { t: 'p', text: 'Everything so far builds vocabulary. The last step makes it yours: **connect your ear to the fingerboard**. Most players can sing a better solo than they can play. The goal is to play what you would sing.' },
      { t: 'p', text: 'Use call and response. The drill plays a one-bar phrase, then leaves a bar of space. Sing an answer first, then play it, from any rung you like. Treat the bass as an interface you can reshape: the shapes serve the line you hear, not the other way round.' },
      {
        t: 'list',
        items: [
          'Sing first, then find it on the bass, never the other way round.',
          'Answer with the same rhythm first, then change the notes, then change the rhythm.',
          'When you play, forget the numbers. They were for the shed.',
        ],
      },
    ],
    drills: [{ name: 'Call and response', spec: { type: 'callResponse', q: 'm7', pents: [R_MIN, FIFTH_MIN, NINTH_MIN], maxRun: 4 } }],
    root: 2,
    tempo: 80,
    quiz: ['mindset'],
  },
]

export const lessonById = (id: string) => LESSONS.find((l) => l.id === id)
