import type { Check, HBlock } from './types'

export interface Rule {
  n: number
  title: string
  /** The rule in one sentence (shown when you hover a rule link). */
  short: string
  blocks: HBlock[]
  /** Work it out yourself. */
  tries: Check[]
}

export const RULES: Rule[] = [
  {
    n: 1,
    title: 'Half steps pull',
    short: 'A note a half step away from a stable note wants to slide into it.',
    blocks: [
      { t: 'h', text: 'The idea' },
      {
        t: 'p',
        text: 'A half step is the smallest distance between two different notes. When a note sits a half step from a note that feels settled, the ear hears it as a **near miss**, and wants it corrected. A whole step is far enough away to sound like a note of its own; a half step is not.',
      },
      {
        t: 'p',
        text: '"Stable" means a note of the chord you are on, most of all its root and its 3rd. So the same note can be at rest over one chord and pulling over another: F is at home on an F chord, but over a C chord it leans down onto E.',
      },
      { t: 'h', text: 'Example: the two pulling notes of C major' },
      {
        t: 'p',
        text: 'In the C major scale there are only two half steps: **B–C** and **E–F**. Over a C chord (C E G) that gives two notes that lean: **B leans up into C**, and **F leans down into E**. Every other note is a whole step or more from its neighbours.',
      },
      {
        t: 'listen',
        title: 'Hear the pull',
        caption: 'Play each one and notice which ends feel finished.',
        items: [
          { label: 'Scale, stop on B', notes: 'C4 | D4 | E4 | F4 | G4 | A4 | B4', bass: 'C2', beats: 1 },
          { label: '…then B → C', notes: 'B4 | C5', bass: 'C2', beats: 2 },
          { label: 'F over a C chord', chord: 'C', notes: 'F4', beats: 3 },
          { label: '…F → E', chord: 'C', notes: 'E4', beats: 3 },
          { label: 'D over a C chord (no pull)', chord: 'C', notes: 'D5', beats: 3 },
        ],
      },
      {
        t: 'tip',
        title: 'On the bass',
        text: 'Hold a C (A string, 3rd fret) and play B, one fret lower, then go back. Then play D, two frets higher. The B "wants" to go back; the D can stay. One fret is a half step: on the bass you can see Rule 1.',
      },
    ],
    tries: [
      {
        q: 'Over a C chord (C E G), which notes of the C major scale are a half step from a chord tone?',
        a: 'B (a half step below C) and F (a half step above E).',
        why: 'Measure each scale note against the chord tones: D is a whole step from C and from E; A is a whole step from G; only B and F are one fret away from a chord tone.',
      },
      {
        q: 'Over an A minor chord (A C E), which note of the C major scale leans down onto a chord tone?',
        a: 'F, a half step above E.',
        why: 'B is a whole step from A and from C, D is a whole step from C and from E, G is a whole step from A. F is the only one a half step from a chord tone.',
      },
    ],
  },
  {
    n: 2,
    title: 'The tritone is two pulls at once',
    short: 'A tritone holds two half-step pulls in opposite directions; resolving both at once is what "dominant" means.',
    blocks: [
      { t: 'h', text: 'The idea' },
      {
        t: 'p',
        text: 'Put the two pulling notes of the key together and you get **B and F**. B leans up to C, F leans down to E [[R1]]. Played together, the two notes pull in **opposite directions at the same moment**, and they land on C and E, the root and 3rd of the home chord. One interval, two pulls: that is the strongest "go home" sound in tonal music.',
      },
      {
        t: 'p',
        text: 'The distance B–F is 6 half steps: a **tritone**, exactly half an octave. Turn it upside down (F up to B) and it is still 6 half steps. Keep that symmetry in mind: it is why one tritone belongs to two different chords ([[R7]], [[L9]]).',
      },
      { t: 'h', text: 'Example: G7 → C' },
      {
        t: 'p',
        text: 'G7 is G B D F. It is the only chord built from the C major scale that has both B and F with a root that falls a fifth to C [[R3]]. That is why it is called the **dominant**: it contains the tritone, and the tritone points at C.',
      },
      {
        t: 'listen',
        title: 'Hear the tritone resolve',
        items: [
          { label: 'B + F alone', notes: 'B3 F4', beats: 3 },
          { label: '→ C + E', notes: 'C4 E4', beats: 3 },
          { label: 'G7', chord: 'G7', beats: 3 },
          { label: '→ Cmaj7', chord: 'Cmaj7', beats: 3 },
          { label: 'Gm7 (no tritone)', chord: 'Gm7', beats: 3 },
          { label: '→ Cmaj7 (weaker)', chord: 'Cmaj7', beats: 3 },
        ],
      },
      {
        t: 'p',
        text: 'Compare the last two: Gm7 has B♭ instead of B. B♭ is a whole step from C, so the upward pull is gone, and the arrival feels much softer. Same root motion, one note different, half the pull.',
      },
    ],
    tries: [
      {
        q: 'Which tritone is inside D7, and where do its two notes want to go?',
        a: 'F♯ and C. F♯ goes up to G, C goes down to B: the root and 3rd of G.',
        why: 'D7 = D F♯ A C. The 3rd (F♯) and the 7th (C) are 6 half steps apart. Each one is a half step from a note of G major: F♯→G, C→B [[R1]].',
      },
      {
        q: 'Why does G7 → C pull harder than Gm7 → C?',
        a: 'G7 has B, a half step below C; Gm7 has B♭, a whole step below. Without B there is no tritone, so only one pull is left.',
        why: 'The tritone needs both notes. Remove one and you lose one of the two pulls.',
      },
    ],
  },
  {
    n: 3,
    title: 'Roots like to fall a fifth',
    short: 'A root moving down a fifth (G → C) sounds like returning to its source: the strongest root motion.',
    blocks: [
      { t: 'h', text: 'The idea' },
      {
        t: 'p',
        text: 'Every note you play is really a stack of quieter notes above it, its **overtones**. The first new note in that stack is the note a **fifth above** (an octave higher). So a G "contains" a D, and a C "contains" a G.',
      },
      {
        t: 'p',
        text: 'When a root moves **down a fifth**, from G to C, the new root is the note the old one was hiding inside. The ear hears it as going back to the source. That is why it is the strongest root motion, and why so much of jazz is chains of it.',
      },
      {
        t: 'tip',
        title: 'Hear it on your bass',
        text: 'Touch the A string lightly over the 7th fret and pluck it: the harmonic is an E, a fifth above A (an octave up). The fifth is built into the string.',
      },
      {
        t: 'p',
        text: 'Down a fifth lands on the **same note** as up a fourth (G down a fifth = C; G up a fourth = C). That is why "falling fifths" and "the cycle of fourths" (C F B♭ E♭ A♭ D♭ G♭ B E A D G) are the same thing.',
      },
      { t: 'h', text: 'Example' },
      {
        t: 'listen',
        title: 'Up a fifth or down a fifth?',
        items: [
          { label: 'G → C (down a fifth)', bass: 'G2 | C2', notes: 'B3 D4 F4 | C4 E4 G4', beats: 2 },
          { label: 'C → G (up a fifth)', bass: 'C2 | G1', notes: 'C4 E4 G4 | B3 D4 G4', beats: 2 },
          { label: 'A chain: E7 A7 D7 G7 C', chord: 'E7 | A7 | D7 | G7 | Cmaj7', beats: 2 },
        ],
      },
      {
        t: 'p',
        text: 'The first one sounds like a full stop; the second sounds like a question. The chain at the end is five falls in a row: each chord sounds like the home of the one before it.',
      },
    ],
    tries: [
      { q: 'Which root falls a fifth into F?', a: 'C.', why: 'Go up a fifth from the target: F G A B♭ C. C down a fifth is F.' },
      {
        q: 'Write the chain of roots that falls by fifths from B to C.',
        a: 'B E A D G C.',
        why: 'Each step is down a fifth (or up a fourth): B→E, E→A, A→D, D→G, G→C. Read the cycle of fourths backwards from C.',
      },
    ],
  },
  {
    n: 4,
    title: "A chord's job depends on its pulling notes",
    short: "Look for the key's 4th degree (means 'not home') and 7th degree (with the 4th, means 'go home').",
    blocks: [
      { t: 'h', text: 'The idea' },
      {
        t: 'p',
        text: "In C, the two pulling notes are **F** (a half step above E, the 3rd of home) and **B** (a half step below C, the root of home) [[R1]]. Whether a chord contains them decides how it feels — at rest, moving away, or pulling back — which is called its **function**.",
      },
      {
        t: 'list',
        items: [
          '**No F** → the chord has nothing that fights the home chord: **tonic** (home).',
          '**F, without B** → F rubs against home\'s E, so the chord can\'t be home; but it doesn\'t point back yet: **subdominant** (away).',
          '**F and B together** → the tritone, two pulls into home [[R2]]: **dominant** (go home!).',
        ],
      },
      {
        t: 'p',
        text: 'Why doesn\'t B alone count? Because B sits happily inside the home chord: it is the 7 of Cmaj7. B only pulls when F is there to make the tritone.',
      },
      { t: 'h', text: 'Example: the test on every chord of C' },
      { t: 'functions', key: 'C' },
      {
        t: 'p',
        text: 'Em7 is marked tonic but contains B: it is a **weak** tonic, close to the dominant side. Use the same test in any key, with that key\'s 4th and 7th degrees: in F major they are B♭ and E.',
      },
    ],
    tries: [
      { q: 'In C, Dm7 (D F A C) contains F but not B. What is its function?', a: 'Subdominant.', why: 'F means "not home"; without B there is no tritone, so it is "away", not "go home".' },
      {
        q: 'In F major, what are the two pulling notes, and what is the function of B♭maj7 (B♭ D F A)?',
        a: 'B♭ (4th) and E (7th). B♭maj7 is subdominant.',
        why: 'It has the 4th degree, B♭, but not the 7th, E. That is the subdominant pattern.',
      },
    ],
  },
  {
    n: 5,
    title: "A chord's scale is the key, plus only the changes the chord forces",
    short: 'Keep every note of the key you can; where the chord disagrees, the chord wins. Change as little as possible.',
    blocks: [
      { t: 'h', text: 'The idea' },
      {
        t: 'p',
        text: 'Your ear doesn\'t forget the key when a new chord arrives. It hears the chord\'s notes, and **everything else is still the key**. So a chord\'s scale is not something to look up: it is the key\'s notes, overwritten only where the chord\'s own notes disagree.',
      },
      {
        t: 'p',
        text: 'Why change as little as possible? Every note you change pulls the ear further from the key. Change one note and the music still sounds like it is in C; change four and it sounds like a new key.',
      },
      { t: 'h', text: 'Example 1: a chord from the key (no changes)' },
      {
        t: 'p',
        text: 'Dm7 in C: all its notes (D F A C) are in C, so nothing changes. The scale is just C major started from D. That is all a **mode** is: the key\'s notes, starting from another chord\'s root. "D Dorian" is a name for the result, not a new thing to learn.',
      },
      { t: 'derive', key: 'C', chord: 'Dm7' },
      { t: 'h', text: 'Example 2: a chord from outside the key' },
      {
        t: 'p',
        text: 'A7 in C: its notes are A C♯ E G. C♯ disagrees with the key\'s C, so the chord wins on that letter. Everything else stays.',
      },
      { t: 'derive', key: 'C', chord: 'A7' },
    ],
    tries: [
      {
        q: 'D7 in C: which key note does the chord change, and what scale do you get?',
        a: 'F becomes F♯. D E F♯ G A B C: D Mixolydian.',
        why: 'D7 = D F♯ A C. Only F♯ disagrees with the key. Keep the rest: D E F♯ G A B C.',
      },
      {
        q: 'E7 in C: what scale do you get?',
        a: 'E F G♯ A B C D (Mixolydian ♭9 ♭13).',
        why: 'E7 = E G♯ B D. Only G♯ disagrees with the key. The kept notes F and C become the ♭9 and ♭13 of E7.',
      },
    ],
  },
  {
    n: 6,
    title: 'A note a half step above a chord tone is an avoid note',
    short: 'A scale note a half step above a chord tone leans into it, so don\'t sustain it. On a dominant, only the one above the 3rd counts.',
    blocks: [
      { t: 'h', text: 'The idea' },
      {
        t: 'p',
        text: 'This is [[R1]] applied to the notes of a chord\'s scale. Once you know a chord\'s scale [[R5]], sort its other notes in two groups:',
      },
      {
        t: 'list',
        items: [
          '**Tension**: a whole step (or more) away from the chord tone below it. It adds colour and can be held as long as you like: 9, 11, 13.',
          '**Avoid note**: a half step **above** a chord tone. It sits right on top of that note and leans down into it, so if you hold it the chord sounds unfinished, or like a different chord.',
        ],
      },
      {
        t: 'p',
        text: '"Avoid" does not mean "forbidden": you can pass through an avoid note in a line. Just don\'t land on it, hold it, or put it in a chord.',
      },
      { t: 'h', text: 'Example: Cmaj7' },
      { t: 'scale', chord: 'Cmaj7', scale: 'ionian', caption: 'F is a half step above E, the 3rd: avoid. D and A are a whole step above C and G: tensions.' },
      {
        t: 'listen',
        title: 'Tension or avoid?',
        items: [
          { label: 'Cmaj7 + D (9)', chord: 'Cmaj7', notes: 'D5', beats: 3 },
          { label: 'Cmaj7 + A (13)', chord: 'Cmaj7', notes: 'A4', beats: 3 },
          { label: 'Cmaj7 + F (11)', chord: 'Cmaj7', notes: 'F5', beats: 3 },
        ],
      },
      { t: 'h', text: 'The dominant exception' },
      {
        t: 'p',
        text: 'A dominant chord is **supposed** to be unstable: it is on its way somewhere [[R2]]. So rubs against its root (the ♭9) or its 5th (the ♭13) are welcome: they only add drive. But a note a half step above the **3rd** is still an avoid note, because the 3rd is half of the tritone. Cover it and the chord stops being a dominant.',
      },
      { t: 'scale', chord: 'G7', scale: 'mixolydian', caption: 'On G7, C (the 11) is a half step above B, the 3rd: still an avoid note.' },
      { t: 'h', text: 'A second check: notes that change the job' },
      {
        t: 'p',
        text: 'On a chord with no tritone, a note that makes a tritone with the chord\'s 3rd or ♭7 turns it into something that sounds like a dominant [[R2]]. B over Dm7 is the classic case: B and F are G7\'s tritone. It doesn\'t rub, so it isn\'t an avoid note, but it changes what the chord does. These are marked in blue.',
      },
      { t: 'scale', chord: 'Dm7', scale: 'dorian', caption: 'B on Dm7 passes the half-step test, but with F it makes the tritone of G7.' },
    ],
    tries: [
      { q: 'On Am7 (A C E G) in C, which scale note is the avoid note?', a: 'F, the ♭13.', why: 'The scale is A B C D E F G [[R5]]. F is a half step above E, the 5th. B is a whole step above A, D a whole step above C: tensions.' },
      { q: 'Why is A♭ fine on G7 going to C minor, but C is not?', a: 'A♭ rubs against the root (allowed on a dominant); C rubs against the 3rd, which is half of the tritone.', why: 'On a dominant only the rub against the 3rd counts, because covering the 3rd destroys the tritone [[R2]].' },
    ],
  },
  {
    n: 7,
    title: 'Chords that share their important notes can replace each other',
    short: 'Two chords with the same 3rd and 7th (or the same tritone) do the same job, so one can stand in for the other.',
    blocks: [
      { t: 'h', text: 'The idea' },
      {
        t: 'p',
        text: 'The ear decides what a chord **does** from a few notes: its 3rd and 7th, which give its type ([[L2]]), and above all its tritone, which gives its pull [[R2]]. If another chord contains the same important notes, the ear hears the same job, even with a different root. Every substitution in jazz comes from this one idea.',
      },
      { t: 'h', text: 'Example 1: the same tritone' },
      {
        t: 'p',
        text: 'G7 = G **B** D **F**. D♭7 = D♭ **F** A♭ **C♭**, and C♭ is the same key as B. Same tritone, so D♭7 also resolves to C ([[L9]]).',
      },
      { t: 'h', text: 'Example 2: the same notes minus the root' },
      {
        t: 'p',
        text: 'Bm7♭5 = B D F A. G9 = G B D F A. Bm7♭5 is G9 without the G: same tritone, same job ([[L6]]).',
      },
      {
        t: 'listen',
        title: 'Three chords, one job',
        items: [
          { label: 'G7 → C', chord: 'G7 | Cmaj7', beats: 2 },
          { label: 'D♭7 → C', chord: 'D♭7 | Cmaj7', beats: 2 },
          { label: 'Bm7♭5 → C', chord: 'Bm7♭5 | Cmaj7', beats: 2 },
        ],
      },
      { t: 'h', text: 'Example 3: tonic chords share notes too' },
      {
        t: 'p',
        text: 'Cmaj7 (C E G B), Em7 (E G B D) and Am7 (A C E G) share three notes each with the next one. That is why they can stand in for each other as tonic chords ([[L18]]).',
      },
    ],
    tries: [
      { q: 'Which dominant shares its tritone with A7?', a: 'E♭7.', why: 'A7 has C♯ and G. E♭7 = E♭ G B♭ D♭, and D♭ is the same key as C♯. Same tritone, so it can replace A7.' },
      { q: 'Dm7 and Fmaj7 can replace each other. Which notes do they share?', a: 'F, A and C.', why: 'Dm7 = D F A C, Fmaj7 = F A C E. Three shared notes, both have F without B: both subdominant [[R4]].' },
    ],
  },
]

export const ruleByN = (n: number) => RULES.find((r) => r.n === n)
