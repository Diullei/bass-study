/**
 * Practice for each chapter: the progressions to take through all twelve keys, with the voicing the chapter teaches.
 * Ordered from the easiest. The shapes are not stored: the voicing engine works them out for the key and the style chosen.
 */
import type { Layer, Style } from './finder'

export interface PracticePlan {
  /** What to do with these progressions in this chapter (rich text). */
  task: string
  /** The voicings of the chapter; the first is the default. */
  layers: Layer[]
  /** Progression ids (see progressions.ts), easiest first. */
  progs: string[]
  /** The style to start with. Default: closed. */
  style?: Exclude<Style, 'near'>
  /** Offer the upper notes as artificial harmonics (the harmonics chapter). */
  artificial?: boolean
}

export const PRACTICE: Record<string, PracticePlan> = {
  map: {
    task: 'Before you press anything, **say where each root is** (string and fret), then where its 7th or 10th is by [[Law1]]. Then look. The shapes are two notes only, so all your attention goes to the map.',
    layers: ['root2'],
    progs: ['one-four', 'cycle-doms'],
  },
  'plucking-hand': {
    task: 'One easy progression, four textures: play each key **once per texture** (block, roll, split, broken). The fretting hand should feel boring; the plucking hand is the lesson.',
    layers: ['root2'],
    progs: ['one-four', 'two-five'],
  },
  'first-tone': {
    task: 'A tone check on real changes. As the keys go round, some land low on the neck: **listen for the keys where the chord blurs**, and fix it with touch and tone before you change the shape.',
    layers: ['root2'],
    progs: ['one-four', 'two-five'],
  },
  'root-shells': {
    task: 'Root plus one note. Closed gives you root + 7th, open gives you root + 10th: **play every key both ways** and hear how the 10th sings and the 7th bites.',
    layers: ['root2'],
    progs: ['cycle-doms', 'one-four', 'two-five'],
  },
  'guide-tone-pairs': {
    task: 'Only the 3rd and 7th, on the D and G strings; the loop plays the roots. **Say which note is the 3rd before each change**: in a falling-fifths progression the two notes swap jobs every chord.',
    layers: ['pair'],
    progs: ['two-five', 'cycle-doms', 'blues'],
  },
  'shell-forms': {
    task: 'Three notes: root, 3rd, 7th. Closed tends to form B (3rd right above the root), open to forms A and C (a 7th or more above the root). **Name the form of every chord** as you play it.',
    layers: ['shell'],
    progs: ['one-four', 'two-five', 'one-six-two-five'],
  },
  'two-five-one': {
    task: 'The chapter itself, in every key. **Predict the three shapes before you look**: the forms alternate and one finger moves a fret at each change. Then check against the diagram.',
    layers: ['shell'],
    progs: ['two-five', 'turnaround', 'three-six-two-five'],
  },
  'minor-dim': {
    task: 'Minor keys and the diminished chord. The half-diminished chord fills its skipped string with the ♭5; the diminished chord is the same grip every three frets. **Listen for the ♭5 moving** to the next chord.',
    layers: ['shell'],
    progs: ['minor-two-five', 'dim-pass', 'minor-turn'],
  },
  'b-string': {
    task: 'Open is the point here: the root drops to the **B string** and the hand stays high, where 3rds are clear. Play each key open first, then closed, and compare where the hand ends up.',
    layers: ['shell'],
    progs: ['two-five', 'blues', 'turnaround'],
    style: 'open',
  },
  shifts: {
    task: 'Jump is the point here: **one grip for every chord**, so the whole hand travels. Look at the target fret before you move, land the root first. Then play the same key closed and feel the difference.',
    layers: ['shell'],
    progs: ['two-five', 'cycle-doms', 'thirds'],
    style: 'jump',
  },
  'top-note-menu': {
    task: 'Four notes: a shell plus one colour on top. **Sing the top note of each chord** before you play it; that line is the reason for the fourth note.',
    layers: ['grand'],
    progs: ['two-five', 'turnaround', 'bossa'],
  },
  rootless: {
    task: 'No root in the hand: the loop or your thumb plays it first ([[Law5]]). **Play the root alone, then the shape**, and name the chord whose shell you are borrowing.',
    layers: ['rootless'],
    progs: ['two-five', 'blues', 'rhythm-a'],
  },
  'dominant-colours': {
    task: 'Watch only the dominants. Their colours come from where they go ([[R5]]): ♭9 ♭13 into minor, 9 13 into major, 9 ♯11 when they slide down a half step. **Say the colours before each dominant.**',
    layers: ['rootless', 'grid'],
    progs: ['subv', 'minor-two-five', 'turnaround', 'backdoor'],
  },
  grid: {
    task: 'Four strings, four notes: 3rd and 7th below, two colours above. The hand barely moves through a whole progression. **Find the one or two fingers that move** at each change.',
    layers: ['grid'],
    progs: ['two-five', 'rhythm-bridge', 'jazz-blues'],
  },
  'rare-chords': {
    task: 'The uncommon symbols in real movement: sus chords, the minor-major 7th, a row of major 7ths. **Read the symbol aloud note by note** before you play each shape.',
    layers: ['grand', 'shell'],
    progs: ['sus', 'line-cliche', 'ladybird'],
  },
  fourths: {
    task: 'Stacks of fourths: one flat finger, or nearly. The loop plays the root; **name the three degrees you are holding** over it. Closed and open differ little here: use jump to plane one barre around.',
    layers: ['quartal'],
    progs: ['modal', 'two-five', 'one-four'],
  },
  triads: {
    task: 'Triads in any inversion on three neighbouring strings. Closed keeps the hand still and changes inversion; jump keeps the inversion and moves the hand. **Name the bottom note of each one** (root, 3rd or 5th).',
    layers: ['triad'],
    progs: ['triads-145', 'triads-pop', 'one-six-two-five'],
  },
  'inside-a-chord': {
    task: 'Slow harmony: one sound for a long time. Use the shape shown as home and **move one voice at a time** inside it, as the chapter shows, before the next chord arrives.',
    layers: ['grand', 'shell'],
    progs: ['maj-colours', 'line-cliche', 'modal'],
  },
  'chord-melody': {
    task: 'Treat the top note of each shape as a melody note. **Play the top line alone first**, sing it, then add the chord under it without losing it.',
    layers: ['grand', 'shell'],
    progs: ['one-four', 'two-five', 'one-six-two-five'],
  },
  comping: {
    task: 'The shapes are the easy part now: **change the pattern, not the chords**. Take each key through split, Charleston and bossa in the play-along below.',
    layers: ['shell', 'rootless'],
    progs: ['two-five', 'blues', 'bossa'],
  },
  'walking-stabs': {
    task: 'Walk the roots yourself and stab the shape on the off-beats. Start with the pair (two notes are enough over a walking line), then the rootless shape. **Keep the walk steady when the stab comes.**',
    layers: ['pair', 'rootless'],
    progs: ['blues', 'jazz-blues', 'rhythm-a'],
  },
  harmonics: {
    task: 'Natural harmonics do not follow you round the keys, artificial ones do. The shapes are the shells you know; **the upper notes are played as artificial harmonics** (touch twelve frets above the finger). Root first, then the bells, one at a time. In the sharp keys, also look for a natural harmonic that could replace one of them.',
    layers: ['shell', 'pair'],
    progs: ['one-four', 'two-five', 'one-six-two-five'],
    artificial: true,
  },
  workbook: {
    task: 'The long forms. Pick a voicing, take one progression through the twelve keys, then change the voicing and go round again. **Do not stop the loop to think**: if a key breaks, slow the tempo instead.',
    layers: ['shell', 'rootless', 'grid', 'grand', 'pair'],
    progs: ['fifths', 'jazz-blues', 'minor-blues', 'rhythm-a', 'thirds'],
  },
  'tone-lab': {
    task: 'A patch is only good if it is good in every key. Run each patch round the cycle and **note the keys where it turns to mud or gets thin**; that tells you what to change in the patch.',
    layers: ['shell', 'rootless'],
    progs: ['two-five', 'blues'],
  },
}
