/**
 * Practice for each harmony lesson: progressions that use the lesson's idea, to play on the bass in all twelve keys.
 * The same tool as the chord method's chapters (features/chords/Practice): the shapes are worked out for each key.
 */
import type { PracticePlan } from '../chords/practice'

/** By lesson number (1–20), easiest progression first. */
export const HARMONY_PLANS: PracticePlan[] = [
  {
    task: 'The numbers stay, the names change. **Say the Roman numeral of each chord aloud** as you play, in every key: after twelve keys you know the progression as numbers, which is the only way it is worth knowing.',
    layers: ['root2', 'shell'],
    progs: ['one-four', 'one-six-two-five'],
  },
  {
    task: 'One root, every kind of seventh chord. **Say which note moved** from one chord to the next (the 7th, then the 3rd, then the 5th, then the 7th again). Then the same in the next key.',
    layers: ['shell'],
    progs: ['five-qualities', 'one-four'],
    style: 'jump',
  },
  {
    task: 'Every chord of the key has a job ([[R4]]). **Say the job before you play the chord**: tonic, subdominant or dominant. In a new key the jobs do not move.',
    layers: ['shell', 'root2'],
    progs: ['one-six-two-five', 'three-six-two-five', 'diatonic-fifths'],
  },
  {
    task: 'Four notes: the chord plus one tension on top. **Name the top note of each shape and say whether it is a tension you can hold** ([[R6]]). Switch the scale on in a neck\'s corner to see the passing notes.',
    layers: ['grand', 'rootless'],
    progs: ['two-five', 'one-six-two-five'],
  },
  {
    task: 'Watch only the 3rd and the 7th. In falling fifths one of them stays and the other falls a step, every time ([[R3]]). **Say "stays" or "falls" for each voice** before each change.',
    layers: ['pair', 'shell'],
    progs: ['two-five', 'cycle-doms', 'turnaround'],
  },
  {
    task: 'Find the tritone inside the dominant (its 3rd and ♭7) and **follow each of its two notes into the next chord**. Then the deceptive ending: the same tritone, a different landing.',
    layers: ['pair', 'shell'],
    progs: ['five-one', 'two-five'],
  },
  {
    task: 'A dominant can point at any chord of the key, not only at I. **Before each dominant, say which chord it points to** (V of II, V of VI …), then hear it land.',
    layers: ['shell', 'grand'],
    progs: ['turnaround', 'rhythm-a', 'secondary'],
  },
  {
    task: 'Every dominant can bring its own II in front. **Mark the II–V pairs with your voice** ("two-five of two", "two-five of one") and notice which dominants only pass the pull along.',
    layers: ['shell', 'rootless'],
    progs: ['three-six-two-five', 'rhythm-bridge', 'fifths'],
  },
  {
    task: 'The substitute dominant holds the same tritone a tritone away. **Play each key twice: with V7, then with the ♭II7**, and hear that the 3rd and 7th do not move while the root does.',
    layers: ['shell', 'rootless'],
    progs: ['subv', 'two-five', 'bossa'],
  },
  {
    task: 'The colours of a dominant come from where it goes ([[R5]]). **Say the colours before each dominant**: into major 9 and 13, into minor ♭9 and ♭13, sliding down a half step 9 and ♯11.',
    layers: ['rootless', 'grid'],
    progs: ['two-five', 'minor-two-five', 'subv', 'backdoor'],
  },
  {
    task: 'Minor keys borrow a major 3rd for their V. **Listen for the one note that is not in the natural minor scale** (the 3rd of the V chord) and name it in every key.',
    layers: ['shell', 'grand'],
    progs: ['minor-two-five', 'minor-turn', 'minor-blues', 'fifths'],
  },
  {
    task: 'A major key can borrow chords from its own minor. **Say which chords are borrowed** and which note of the major scale each one lowers.',
    layers: ['shell', 'grand'],
    progs: ['borrowed-iv', 'backdoor', 'ladybird'],
  },
  {
    task: 'A diminished chord is a dominant ♭9 without its root. **For each one, say the dominant it stands for** and the chord it leads to; its root is a half step under that chord.',
    layers: ['shell'],
    progs: ['dim-pass', 'dim-walk'],
  },
  {
    task: 'The blues, from three chords to the jazz forms. Learn each form **in F and B♭ first** (the keys you will be asked for), then take it round. Use the "four" pattern in the play-along.',
    layers: ['shell', 'pair', 'rootless'],
    progs: ['blues', 'jazz-blues', 'minor-blues', 'bird-blues'],
  },
  {
    task: 'Hear where the key changes. **Say the key you are in at every bar**, and mark the chord where the new key is confirmed (its V going to its I).',
    layers: ['shell', 'rootless'],
    progs: ['fifths', 'rhythm-a', 'thirds'],
  },
  {
    task: 'No pull to resolve: one colour that stays. **Plane the shapes inside the mode** while the loop holds the root, and use the sus chord as a dominant that does not push.',
    layers: ['quartal', 'shell'],
    progs: ['modal', 'sus'],
  },
  {
    task: 'One progression, four kinds of voicing. **Change the voicing, not the chords**: rootless, the four-string grid, fourths, then four-note chords, and listen to what each one does to the same harmony.',
    layers: ['rootless', 'grid', 'quartal', 'grand'],
    progs: ['two-five', 'turnaround', 'modal'],
  },
  {
    task: 'Each progression here is a reharmonization of a plainer one. **Play the plain version first** (I – VI – II – V in the key), then the changed one, and name the technique used on each chord.',
    layers: ['shell', 'rootless', 'grid'],
    progs: ['one-six-two-five', 'turnaround', 'subv', 'bossa', 'ladybird'],
  },
  {
    task: 'Harmony that does not follow the jobs of a key. **Do not look for a key**: follow the roots (major 3rds, half steps) and keep the same grip moving. Jump is the natural layout here.',
    layers: ['shell', 'rootless'],
    progs: ['ladybird', 'thirds', 'modal'],
    style: 'jump',
  },
  {
    task: 'Everything together. Pick a form, **analyse it first** (numerals, jobs, where each dominant goes), then play it in twelve keys with one voicing, and again with another.',
    layers: ['shell', 'rootless', 'grid', 'grand', 'pair'],
    progs: ['fifths', 'jazz-blues', 'bird-blues', 'rhythm-a', 'thirds'],
  },
]
