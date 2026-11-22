import type { Law } from './types'

/**
 * The five laws of chords on bass. The harmony course's seven rules are about notes ([[R1]] … [[R7]]);
 * these are about the instrument. Every shape in the method can be rebuilt from them.
 */
export const LAWS: Law[] = [
  {
    n: 1,
    title: 'Shape arithmetic',
    short: 'One string up adds 5 semitones, one fret up adds 1: every interval is 5 × strings + frets, the same on every string and in every key.',
    blocks: [
      { t: 'h', text: 'The idea' },
      {
        t: 'p',
        text: 'A bass is tuned in fourths: B, E, A, D, G, each string **5 semitones** above the one below it. A fret is **1 semitone**. So any distance on the neck is a sum of those two steps:',
      },
      { t: 'big', text: 'interval = 5 × strings + frets' },
      {
        t: 'p',
        text: 'There is no exception anywhere on the neck. A guitar has one (its B string is tuned a major 3rd above G, so every shape bends when it crosses that pair). On a bass, a shape that works from a root on the E string works unchanged from a root on the A string, and a shape that works in C works in every key: you only slide it. That is why this method teaches *one* of everything, where a pianist learns twelve.',
      },
      { t: 'h', text: 'The logic: count, do not memorize' },
      {
        t: 'p',
        text: 'Know the size of the interval in semitones ([[HL1]]; the first table below gives every number) and split it into fives and ones. When the number of frets gets awkward, use one more string and go back a few frets.',
      },
      {
        t: 'table',
        head: ['Degree of the major scale', '1 (R)', '2', '3', '4', '5', '6', '7', '8'],
        rows: [
          ['**Half steps above the root**', '0', '2', '4', '5', '7', '9', '11', '12'],
          ['The same degrees an octave up', '8', '9', '10', '11', '12', '13', '14', '15'],
          ['**Half steps above the root**', '12', '14', '16', '17', '19', '21', '23', '24'],
        ],
        caption: 'The major scale goes whole, whole, half, whole, whole, whole, half, which gives the first row of numbers. An octave adds 12. A ♭ takes one off and a ♯ adds one: ♭3 = 3, ♭5 = 6, ♭7 = 10, ♭9 = 13, ♯11 = 18, ♭13 = 20. This is the number you split into fives and ones.',
      },
      {
        t: 'table',
        head: ['You want', 'Semitones', 'Split into 5s and 1s', 'In words', 'On the neck'],
        rows: [
          ['major 3rd', '4', '5 − 1', 'one string up, one fret back', '[[neck:up:1:-1:3]]'],
          ['perfect 5th', '7', '5 + 2', 'one string up, two frets forward', '[[neck:up:1:2:5]]'],
          ['minor 7th (♭7)', '10', '5 + 5', 'two strings up, same fret', '[[neck:up:2:0:♭7]]'],
          ['major 7th', '11', '5 + 5 + 1', 'two strings up, one fret forward', '[[neck:up:2:1:7]]'],
          ['minor 10th (♭3 an octave up)', '15', '5 + 5 + 5', 'three strings up, same fret', '[[neck:up:3:0:♭3]]'],
          ['major 10th (3 an octave up)', '16', '15 + 1', 'three strings up, one fret forward', '[[neck:up:3:1:3]]'],
          ['13th (6 an octave up)', '21', '20 + 1', 'four strings up, one fret forward', '[[neck:up:4:1:13]]'],
        ],
        caption: 'Every row comes from the formula. The whole map of [[Ch1]] is this table, finished.',
      },
      { t: 'h', text: 'Example: the same shape from two strings' },
      {
        t: 'shapes',
        rows: [
          'Cmaj7 | x-8-x-9-x | root on E, 7th two strings up and one fret forward',
          'Fmaj7 | x-x-8-x-9 | the same shape one string higher: the same chord type on F',
          'C | x-8-7-x-x | 5 − 1 = 4 semitones: a major 3rd (low and muddy, see Law 2)',
          'C | x-8-x-x-9 | 15 + 1 = 16: the same 3rd an octave higher, the major 10th',
        ],
        caption: 'Play each one: the first two sound like the same chord type at different heights, because they are the same arithmetic.',
      },
      {
        t: 'tip',
        title: 'Reverse it to find notes below',
        text: 'The formula works downwards too. One string **down**, same fret, is 5 semitones down: the 5th below the root. That is where the thumb finds its second note for a bossa (from C at E‑8, G at B‑8, [[Ch20]]).',
      },
      { t: 'h', text: 'Backwards: from any note to the root' },
      {
        t: 'p',
        text: 'The formula has no direction. One string **down** takes 5 semitones away, one fret **forward** gives one back. So from any note you are holding, the same arithmetic finds the notes below it, the root above all. This is how you open a chord from the middle: from its 3rd, from its 7th, from the melody note on top ([[Ch19]]), or from a rootless grip whose root the thumb has to find ([[Ch12]]).',
      },
      { t: 'big', text: 'interval below = 5 × strings down − frets forward' },
      {
        t: 'table',
        head: ['Your note is the…', 'Semitones above the root', 'Split', 'So the root is', 'On the neck'],
        rows: [
          ['♭3', '3', '5 − 2', 'one string down, two frets forward', '[[neck:down:1:2:♭3]]'],
          ['3', '4', '5 − 1', 'one string down, one fret forward', '[[neck:down:1:1:3]]'],
          ['5', '7', '5 + 2', 'one string down, two frets back', '[[neck:down:1:-2:5]]'],
          ['6 (13)', '9', '10 − 1', 'two strings down, one fret forward', '[[neck:down:2:1:6]]'],
          ['♭7', '10', '5 + 5', 'two strings down, same fret', '[[neck:down:2:0:♭7]]'],
          ['7', '11', '10 + 1', 'two strings down, one fret back', '[[neck:down:2:-1:7]]'],
          ['9', '14', '15 − 1', 'three strings down, one fret forward', '[[neck:down:3:1:9]]'],
          ['♭3 an octave up (♭10)', '15', '5 + 5 + 5', 'three strings down, same fret', '[[neck:down:3:0:♭3]]'],
          ['3 an octave up (10)', '16', '15 + 1', 'three strings down, one fret back', '[[neck:down:3:-1:3]]'],
          ['13', '21', '20 + 1', 'four strings down, one fret back', '[[neck:down:4:-1:13]]'],
        ],
        caption: 'The same splits as going up, with the direction of the fret turned round. Nothing new to learn: it is the map read from the other end.',
      },
      { t: 'map', down: true },
      {
        t: 'shapes',
        rows: [
          'Cmaj7 | x-8-x-9-9 | hold the 3 (G‑9): three strings down, one fret back is the root (E‑8)',
          'Fmaj7 | x-x-8-7-9 | hold the 7 (G‑9): two strings down, one fret back is the root (A‑8)',
          'G13 | x-x-8-9-9 | rootless: hold the 3 (D‑9), one string down and one fret forward is G (A‑10), where the thumb goes',
        ],
        caption: 'Find each root from the note named in the caption before you look at the diagram.',
      },
      { t: 'h', text: 'When the answer does not fit the hand' },
      {
        t: 'p',
        text: 'The arithmetic always gives an answer, but not always one you can play. There are only five strings, so a root has a limited number of strings above it: four from the B string, three from the E string, two from the A string. When the strings run out, the frets have to make up the rest, and more than three or four frets is out of reach.',
      },
      {
        t: 'p',
        text: 'Example: the root is C at E‑8 and you want the **13** (21 semitones). The E string has three strings above it, worth 15. That leaves 21 − 15 = **6 frets**: G‑14, far from a hand at fret 8. Do not tap it and do not give up on the note. Run Law 1 again, in one of three ways:',
      },
      {
        t: 'steps',
        items: [
          '**Buy a string.** The same C is also on the B string, five frets higher (B‑13), because one string down and five frets up cancel out. From there four strings are above the root: 21 = 20 + 1, so the 13 is four strings up and **one** fret forward (G‑14). The note did not move; the root came to it. This is the reason for the fifth string ([[Ch9]], [[Ch11]]).',
          '**Take an octave off.** An octave is 12 = 5 + 5 + 2: **two strings and two frets**. The 13 an octave lower is the 6, the same note: 21 − 12 = 9 = 10 − 1, two strings up and one fret back (D‑7). You keep the colour and lose only its height, so check the lower note against the clear zones ([[Law2]]).',
          '**Split it in time.** Play the root, let it ring, move the hand, play the note ([[Law5]]).',
        ],
      },
      { t: 'big', text: 'too many frets? one string lower for the root = 5 frets fewer · an octave off = 2 strings + 2 frets' },
      {
        t: 'p',
        text: 'The same thinking covers the other dead ends. **No string above the root** (the root is on the G string): go along the string (a 3rd is 4 frets forward, a stretch), or move the root to a lower string. **Too many frets back** (the fret would be below the nut): the note is on the next string down, five frets higher. Try any case here: choose a root, its string and the degree you want.',
      },
      { t: 'reach', root: 'C', string: 1, degree: '13' },
      { t: 'h', text: 'Train it: answer on the neck' },
      {
        t: 'p',
        text: 'A starting note is on the neck. Work out where the asked note is, click that place, then check. The answer comes with the reasoning, and if you miss, with what you actually picked and why it is a different interval. Use the hints only after you have tried: the point is to do the arithmetic yourself, in every direction.',
      },
      { t: 'drill' },
    ],
    tries: [
      {
        q: 'Which interval is three strings up and two frets back?',
        a: 'A ♭9 (13 semitones: an octave plus a half step).',
        why: '5 × 3 − 2 = 13. Twelve is an octave, so 13 is one half step above the octave: the ♭9.',
      },
      {
        q: 'Where is the 13 from a root on the B string?',
        a: 'Four strings up (the G string), one fret forward.',
        why: 'The 13 is a major 6th plus an octave: 9 + 12 = 21 semitones. 21 = 5 × 4 + 1.',
      },
      {
        q: 'A guitarist says "this shape changes when it crosses the B string". Why does a bassist never have that problem?',
        a: 'Every pair of neighbouring bass strings is a fourth apart, so the arithmetic never changes.',
        why: 'The formula 5 × strings + frets assumes 5 semitones per string. On a guitar one pair (G–B) is 4 semitones, so shapes crossing it move one fret. On a bass the 5 holds everywhere.',
      },
      {
        q: 'The root is F at E‑1 and you want the 9 (14 semitones). Three strings up gives 15: what do you do?',
        a: 'Three strings up, one fret back would be G‑0: the open G string. That works here. In another key, take an octave off: the 2 is on the same string, two frets forward.',
        why: '14 = 15 − 1: three strings up, one fret back. From fret 1 that is fret 0, an open string, which rings without a finger. From a root at the nut with no open string to help, 14 − 12 = 2: the same note an octave lower, two frets along the root\'s own string.',
      },
      {
        q: 'The root is C at E‑8 and you want the 13. The G string gives it only at fret 14. Name two fixes.',
        a: 'Move the root to B‑13 (then the 13 is four strings up, one fret forward), or play the 6 instead: two strings up, one fret back, D‑7.',
        why: '21 semitones need four strings (20 + 1), and the E string has only three above it. Putting the root one string lower adds a string above it; taking an octave off (two strings and two frets) turns 21 into 9 = 10 − 1.',
      },
      {
        q: 'You hold the ♭7 of a chord at G‑10. Where is the root?',
        a: 'Two strings down, same fret: A‑10 (G). The chord is some kind of G7.',
        why: 'The ♭7 is 10 semitones above the root, and 10 = 5 + 5: two strings, no fret change. G‑10 is F, and F is the ♭7 of G.',
      },
      {
        q: 'You hold the 3rd at D‑9. Where is the root on a lower string?',
        a: 'One string down, one fret forward: A‑10 (G). For the root an octave lower: three strings down, one fret back, B‑8.',
        why: 'The 3rd is 4 semitones above the root, and 4 = 5 − 1: one string down (−5), one fret forward (+1). D‑9 is B, the 3rd of G; A‑10 is G. An octave lower the gap is 16 = 15 + 1: three strings down, one fret back, B‑8 (G1).',
      },
    ],
  },
  {
    n: 2,
    title: 'Low wants wide',
    short: 'The lower two notes are, the further apart they must be to sound clear: roots low, big gaps at the bottom, small gaps only up high.',
    blocks: [
      { t: 'h', text: 'The idea' },
      {
        t: 'p',
        text: 'A note is not one frequency: it carries a stack of overtones. When two notes are close together and low, their overtones crowd into the same narrow range and beat against each other. The ear hears a rumble instead of two notes. Higher up, the same interval spans more hertz, the overtones separate, and the two notes sound clear. Arrangers call the floor below which an interval turns to mud its **low interval limit**.',
      },
      { t: 'h', text: 'The logic: the floor depends on the interval' },
      {
        t: 'floors',
        rows: [
          { text: '**Wide intervals** (a tenth, anything over an octave) and the **tritone** sound clear almost anywhere.' },
          { text: '**Fifths** are clear from about A‑4 or E‑9.', ivs: [7] },
          { text: '**Thirds** need the chord register: from about G‑4, D‑9 or A‑14.', ivs: [4] },
          { text: '**Seconds** only work up high: from about G‑8.', ivs: [2] },
        ],
      },
      {
        t: 'p',
        text: 'So a voicing on bass is built from the bottom with **big gaps first**: root low, then a 7th or a 10th above it, and the close intervals (3rds, 2nds) only on the D and G strings. That is exactly the shape of form A ({Cmaj7:x-8-x-9-9}): root, a skipped string, then a fourth on top.',
      },
      { t: 'h', text: 'Example: the same notes, low and high' },
      {
        t: 'shapes',
        rows: [
          'G | x-3-2-x-x | a major 3rd at E‑3: below its floor, a rumble',
          'C | x-x-x-10-9 | a major 3rd at D‑10: inside the chord band, clear',
          'C | x-8-x-x-9 | the same C and E spread to a 10th: clear even with the root low',
          'Cmaj7 | x-x-3-2-4 | form B low on the neck: 3rd right above the root, thick',
          'Cmaj7 | x-8-x-9-9 | the same chord in form A: wide at the bottom, clear',
        ],
        caption: 'Listen to the first and the last pairs. Nothing changed but the gaps at the bottom.',
      },
      { t: 'h', text: 'Worked example: build Cmaj7 from the bottom' },
      {
        t: 'p',
        text: 'Put the root at E‑8 (C2) and ask one question for each note you add: **is this gap above its floor at this height?** Three of the four candidates below fail or tell too little; the last one is form A.',
      },
      {
        t: 'shapes',
        rows: [
          'C | x-8-7-x-x | the 3rd next: a major 3rd on C2, almost an octave under its floor (B2). Mud',
          'C | x-8-10-x-x | the 5th next: a fifth on C2, one half step under its floor (C♯2). Dull, and it does not name the chord',
          'Cmaj7 | x-8-x-9-x | the 7th next: a wide gap over a low root. Clear',
          'Cmaj7 | x-8-x-9-9 | then the 3rd on top: a fourth on B2, above its floor (A2). Clear',
        ],
        caption: 'The rule you just used: after a low root, skip a string. The skipped string is the wide gap.',
      },
      { t: 'h', text: 'The same repair on other chords' },
      {
        t: 'shapes',
        rows: [
          'G7 | x-3-2-3-x | 3rd right above a low root: mud',
          'G7 | x-3-x-3-4 | the 3rd moved up an octave: a 7th at the bottom, a tritone on top',
          'Cm7 | x-x-3-1-3 | minor 3rd on C2: mud',
          'Cm7 | x-8-x-8-8 | the same notes reordered: a 7th at the bottom, a fourth on top',
        ],
        caption: 'Each pair has the same three notes. Only the order changed: the 3rd went from the bottom gap to the top.',
      },
      { t: 'h', text: 'Spreads that work: read the gaps from the bottom' },
      {
        t: 'shapes',
        rows: [
          'G7 | 8-x-x-9-10 | gaps: G up to B is a 10th, B up to F is a tritone',
          'D | x-10-12-x-11 | gaps: D up to A is a 5th (D2 is above its floor), A up to F♯ is a 6th. The open triad',
          'Dm9 | x-10-x-10-9 | gaps: D up to C is a 7th, C up to E is a major 3rd apart (the ♭7 and the 9 of the chord). C3 is above the floor for 3rds',
          'G13 | 8-x-8-9-9 | gaps: G to F a 7th, F to B a tritone, B to E a 4th. Every gap is smaller than the one under it',
        ],
        caption: 'Here a 3rd or a 5th is the **distance between two neighbouring notes**, not a degree of the chord: the labels in the dots are the degrees. The pattern in all four: the widest gap is at the bottom, and the gaps shrink as you go up, like the overtones of one low note.',
      },
      {
        t: 'shapes',
        title: 'In a progression: ii–V–I in C under one hand',
        seq: true,
        rows: [
          'Dm7 | x-10-x-10-10 | gaps: a 7th, then a 4th',
          'G7 | 8-x-x-9-10 | gaps: a 10th, then a tritone',
          'Cmaj7 | x-8-x-9-9 | gaps: a 7th, then a 4th',
        ],
        caption: 'Three clear chords inside frets 8 to 10. The roots stay on the low strings and the 3rds and 7ths stay on D and G.',
      },
      { t: 'zones' },
      {
        t: 'tip',
        title: 'Warnings, not walls',
        text: 'The limits were written for sustained band chords. A low **root** under a 7th is more forgiving than two inner notes at the same height, and a bright tone (bridge pickup, [[Ch3]]) moves every floor down a little. The shape checker ([[CHECK]]) flags anything under its floor; your ear makes the final call.',
      },
    ],
    tries: [
      {
        q: 'Why is a 3rd fine at D‑9 and muddy at E‑3?',
        a: 'Register: D‑9 is B2, right at the floor for 3rds; E‑3 is G1, more than an octave below it.',
        why: 'The floor for a major 3rd is B2. Law 1 puts B2 at D‑9 (38 + 9 = 47). E‑3 is 28 + 3 = 31, sixteen semitones lower.',
      },
      {
        q: 'A Cmaj7 at `x-x-3-2-4` sounds thick. Without changing the chord, give two fixes.',
        a: 'Widen the bottom (form A, `x-8-x-9-9`), or keep form B but move the root to a lower string so the hand sits higher (form C, `13-x-x-14-16`).',
        why: 'The mud comes from the 3rd sitting right above a low root. Both fixes put a big interval at the bottom and lift the 3rd into the chord band ([[Ch9]]).',
      },
      {
        q: 'A G7 at `x-3-2-3-x` is muddy. Fix it without moving the root or changing a note name.',
        a: 'Move the 3rd up an octave: `x-3-x-3-4`.',
        why: 'The B at A‑2 is a major 3rd on G1, far under the floor (B2). An octave is two strings and two frets ([[Law1]]): A‑2 becomes G‑4. Now the bottom gap is a 7th and the top gap is a tritone, which is clear at any height.',
      },
      {
        q: 'Which interval can sit lowest of all without mud: a fifth, a fourth or a tritone?',
        a: 'The tritone.',
        why: 'Its limit is B1, lower than the fifth (C♯2) and much lower than the fourth (A2). That is why the 3rd and ♭7 of a dominant can share the E and A strings in the four-string grid ([[Ch14]]).',
      },
    ],
  },
  {
    n: 3,
    title: 'Three notes is a full chord',
    short: 'You have four fingers and a four-fret reach, so you budget: the 3rd and 7th first, then the root, then a colour, and the 5th last.',
    blocks: [
      { t: 'h', text: 'The idea' },
      {
        t: 'p',
        text: 'A pianist has ten fingers; you have four, a comfortable reach of four frets, and Law 2 forbidding close notes at the bottom. So you cannot play every note of a chord. You do not need to: the ear identifies a chord from very few notes ([[R7]]).',
      },
      { t: 'h', text: 'The logic: what each note tells the ear' },
      {
        t: 'table',
        head: ['Note', 'What it tells the ear', 'Priority'],
        rows: [
          ['3rd', 'major or minor', '1: never leave it out (sus chords use the 4th instead)'],
          ['7th (or 6th)', 'maj7, dominant or 6 chord', '1: together with the 3rd it names the chord ([[HL2]])'],
          ['root', 'where the chord is', '2: often played by the thumb first, or left to a loop ([[Law5]])'],
          ['colour (9, 11, 13 …)', 'the mood', '3: one, sometimes two'],
          ['5th', 'almost nothing: every common chord has the same perfect 5th', '4: the first to go, unless it is altered (♭5, ♯5)'],
        ],
      },
      { t: 'h', text: 'Example: hear what each note adds' },
      {
        t: 'shapes',
        rows: [
          'C7 | x-x-x-8-9 | 3 and ♭7 only: already a dominant, though it does not say which one',
          'C7 | x-8-x-8-9 | add the root: now it is C7. Three notes, complete',
          'C7 | x-8-10-8-9 | add the 5th: thicker, but not more C7',
          'C9 | x-8-7-8-7 | spend the finger on a colour instead: the 9',
        ],
        caption: 'The third shape costs a finger and buys nothing; the fourth spends the same finger on colour. That is the budget.',
      },
      {
        t: 'tip',
        title: 'The B string buys a fourth note',
        text: 'With the root on the B string, the hand sits higher and a fourth string is free above the shell: that is where the colours of [[Ch11]] live.',
      },
    ],
    tries: [
      {
        q: 'You can play only three notes of G13. Which three?',
        a: 'The 3rd (B), the ♭7 (F) and the 13 (E); the thumb or a loop supplies G.',
        why: '3 and ♭7 say "dominant", the 13 is the reason the symbol says 13, and the root can come from time ([[Law5]]). The 5th and 9 add the least.',
      },
      {
        q: 'Why is the 5th the first note to drop?',
        a: 'It is the same in major, minor and dominant chords, so it does not tell the ear which chord it is.',
        why: 'Maj7, m7 and 7 chords all have a perfect 5th. Only the 3rd and 7th change between them, so they carry the identity ([[HL2]]).',
      },
    ],
  },
  {
    n: 4,
    title: 'Nearest move wins',
    short: 'From one chord to the next, keep every note you can and move the others by one or two frets: the 7th falls a fret into the next 3rd.',
    blocks: [
      { t: 'h', text: 'The idea' },
      {
        t: 'p',
        text: 'Pianists do not jump from shape to shape; each finger moves to the nearest note of the next chord. On bass that is also the cheapest move for the hand. And it is the sound of good voice leading: [[R1]] says half steps pull, so a voice that moves by a half step *resolves*.',
      },
      { t: 'h', text: 'The logic: what stays and what falls' },
      {
        t: 'p',
        text: 'Roots that fall a fifth ([[R3]]) carry a gift: the 7th of each chord is a half step above the 3rd of the next. In Dm7 to G7, C (the ♭7 of Dm7) falls to B (the 3 of G7); F stays, because it is the ♭3 of Dm7 *and* the ♭7 of G7. In G7 to Cmaj7, F falls to E and B stays. One finger moves one fret at a time.',
      },
      {
        t: 'shapes',
        title: 'II–V–I by the nearest move',
        seq: true,
        rows: ['Dm7 | x-10-x-10-10 | form A', 'G7 | x-x-10-9-10 | form B: the root moved across, one finger dropped a fret', 'Cmaj7 | x-8-x-9-9 | form A'],
        caption: 'Step through it: the pencil dots are the chord before, the arrows are the fingers that move.',
      },
      {
        t: 'shapes',
        title: 'The same chords, by jumping',
        seq: true,
        rows: ['Dm7 | x-10-x-10-10', 'G7 | x-3-x-3-4 | the same form, seven frets away', 'Cmaj7 | x-8-x-9-9'],
        caption: 'Same chords, same form every time: the hand jumps, the top voice leaps, and the half-step pulls are gone.',
      },
    ],
    tries: [
      {
        q: 'Going from G7 `x-x-10-9-10` to Cmaj7 `x-8-x-9-9`, which upper note moves, and by how much?',
        a: 'The top note: F (G‑10) falls one fret to E (G‑9). B on the D string stays.',
        why: 'F is the ♭7 of G7 and E the 3rd of Cmaj7: the 7th falls a half step into the next 3rd ([[R1]]). B is the 3 of G7 and the 7 of Cmaj7, a common tone.',
      },
      {
        q: 'Why does a II–V–I alternate forms (A, B, A) instead of keeping one?',
        a: 'Because the root moves to the next string while the guide tones stay put; changing the form is what keeps the upper notes still.',
        why: 'A fifth down is "next string up, same fret" ([[Law1]]). The upper pair then only needs one-fret moves, which is the nearest move.',
      },
    ],
  },
  {
    n: 5,
    title: 'Time is your second hand',
    short: 'What you cannot hold together, play in sequence: the root first, the chord just after. Thumb, then fingers. A looped root, then voicings over it.',
    blocks: [
      { t: 'h', text: 'The idea' },
      {
        t: 'p',
        text: "A pianist's left hand does not have to sound with the right. Stride piano plays a low root on the beat and a chord after it; the ear hears one harmony, because a bass note keeps sounding in memory after it stops. You can do the same with one hand: the thumb plays the root, the fingers play the chord a beat (or half a beat) later.",
      },
      { t: 'h', text: 'The logic: split what does not fit' },
      {
        t: 'list',
        items: [
          '**Too wide for the hand?** Root first, then move the hand up for the chord.',
          '**Root plus two tensions?** It does not fit one grip without mud ([[Law2]]). Play the root, then the rootless grip ([[Ch12]], [[Ch14]]).',
          '**Hard change?** Land the new root on the beat while the fingers are still arriving ([[Ch10]]).',
          '**No time at all?** Loop the roots (the B3n looper) and play only the upper notes over them.',
        ],
      },
      { t: 'h', text: 'Example: one rootless shape, the root from the thumb' },
      {
        t: 'patterns',
        chord: 'Dm9',
        shape: 'x-x-8-10-9',
        ids: ['block', 'split'],
        caption: 'The grip has no D in it. In *block* the thumb adds D under it at once; in *split* the thumb plays D on 1 and 3 and the fingers answer on 2 and 4. Same harmony, and the hand never had to reach.',
      },
      {
        t: 'along',
        title: 'Rootless II–V–I over a loop',
        bars: 'Dm9:x-x-8-10-9 | G13:x-x-8-9-9 | C6/9:x-x-7-7-7 | C6/9:x-x-7-7-7',
        pattern: 'split',
        tempo: 96,
        caption: 'Turn **Your part** off and play the shapes yourself over the loop; turn **Roots** off and the shapes alone show how much the root was doing.',
      },
    ],
    tries: [
      {
        q: 'Why can root + 3rd + 7th + two tensions not sit under one hand?',
        a: 'Five notes need five strings and the root and 3rd end up a 3rd apart in the bass band, which Law 2 forbids.',
        why: 'With the root at the bottom, the next voice must be a wide interval away; the tensions then push the top beyond a four-fret reach. Splitting in time removes both problems.',
      },
      {
        q: 'In the split texture, the thumb plays on 1 and 3. Why does the chord still sound "complete" on 2 and 4 without a root?',
        a: 'The root keeps sounding in the ear (and often on the string) after it is plucked.',
        why: "This is the stride principle: the ear joins a bass note with the chord that follows it. It is the pianist's left-hand jump, done with one hand.",
      },
    ],
  },
]

export const lawByN = (n: number) => LAWS[n - 1]
