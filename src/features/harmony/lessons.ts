import type { QType } from './quiz'
import type { Check, HBlock } from './types'

export interface HLesson {
  id: string
  part: number
  title: string
  /** The idea, in one sentence. */
  idea: string
  blocks: HBlock[]
  practice: string[]
  check: Check[]
  /** Generated questions for the quiz. */
  quiz: QType[]
}

export const PARTS = ['Foundations', 'Dominant harmony', 'Minor keys, borrowing, diminished, blues', 'Advanced']

export const LESSONS: HLesson[] = [
  // ───────────── Part 1 ─────────────
  {
    id: 'numbers',
    part: 0,
    title: 'Think in numbers, not note names',
    idea: 'Name every note by its distance from the root, and everything you learn works in every key.',
    blocks: [
      {
        t: 'p',
        text: 'Instead of "the E in a C chord", say "the **3rd**". The number stays the same in every key, so you learn a thing once and it moves to all twelve keys by itself. On the bass this is even easier: a distance is a **shape** on the neck, and the shape never changes.',
      },
      {
        t: 'table',
        head: ['Half steps', 'Interval', 'Name when it is a tension'],
        rows: [
          ['1', 'minor 2nd', '♭9'],
          ['2', 'major 2nd', '9'],
          ['3', 'minor 3rd', '♯9 (on dominants)'],
          ['4', 'major 3rd', '—'],
          ['5', 'perfect 4th', '11'],
          ['6', 'tritone', '♯11 / ♭5'],
          ['7', 'perfect 5th', '—'],
          ['8', 'minor 6th', '♭13'],
          ['9', 'major 6th', '13'],
          ['10', 'minor 7th', '—'],
          ['11', 'major 7th', '—'],
        ],
      },
      { t: 'h', text: 'The logic: why 9, 11 and 13?' },
      {
        t: 'p',
        text: 'Chords are built by stacking **thirds** (every other note of the scale): 1, 3, 5, 7. Keep stacking and you get 9, 11, 13. From C: C E G B D F A. That is all seven notes of the scale. So **9, 11 and 13 are the same notes as 2, 4 and 6**, just counted from the top of the stack.',
      },
      {
        t: 'code',
        caption: 'The same seven notes, two ways',
        lines: ['in steps:   C  D  E  F  G  A  B', '            1  2  3  4  5  6  7', '', 'in thirds:  C  E  G  B  D  F  A', '            1  3  5  7  9  11 13'],
      },
      {
        t: 'p',
        text: 'This is the most useful idea in the whole course: **a chord and its scale are the same thing seen two ways**. The scale is the notes in steps; the chord is the same notes stacked in thirds. Everything in [[L4]] comes from this.',
      },
      {
        t: 'p',
        text: 'One interval needs a special mention: the **tritone**, 6 half steps (B–F). It is exactly half an octave and the most unstable interval there is. It drives the whole system [[R2]].',
      },
      {
        t: 'listen',
        title: 'Intervals above C',
        items: [
          { label: '♭9 (C–D♭)', notes: 'C3 D♭4', beats: 2 },
          { label: '9 (C–D)', notes: 'C3 D4', beats: 2 },
          { label: '11 (C–F)', notes: 'C3 F4', beats: 2 },
          { label: '♯11 (C–F♯)', notes: 'C3 F♯4', beats: 2 },
          { label: '♭13 (C–A♭)', notes: 'C3 A♭4', beats: 2 },
          { label: '13 (C–A)', notes: 'C3 A4', beats: 2 },
          { label: 'tritone (B–F)', notes: 'B3 F4', beats: 2 },
        ],
      },
    ],
    practice: [
      '**Keys:** play every interval up from C and sing it.',
      '**Bass:** find every interval from a root on two strings (root on the E string, interval on the A string). Say the name, not the note.',
      '**Ears:** 5 minutes a day naming intervals by ear.',
    ],
    check: [
      { q: 'What is the 13 of G?', a: 'E', why: '13 is the same note as 6 (one octave up). The 6th note of G major: G A B C D **E**.' },
      { q: 'What is a tritone above F?', a: 'B', why: '6 half steps up from F: F♯ G G♯ A A♯ **B**. It is also the pair B–F, the tritone of G7.' },
      { q: 'What is the ♭9 of A?', a: 'B♭', why: '♭9 = a half step above the root (an octave up). A half step above A is B♭.' },
    ],
    quiz: ['interval'],
  },
  {
    id: 'seventh-chords',
    part: 0,
    title: 'Seventh chords: the five basic shapes',
    idea: 'In jazz a basic chord has four notes, and there are five main types.',
    blocks: [
      {
        t: 'table',
        head: ['Symbol', 'Formula', 'On C', 'Character'],
        rows: [
          ['Cmaj7', '1 3 5 7', 'C E G B', 'stable, soft'],
          ['C7', '1 3 5 ♭7', 'C E G B♭', 'tense, wants to move'],
          ['Cm7', '1 ♭3 5 ♭7', 'C E♭ G B♭', 'soft, minor'],
          ['Cm7♭5 (Cø)', '1 ♭3 ♭5 ♭7', 'C E♭ G♭ B♭', 'dark, unstable'],
          ['Co7', '1 ♭3 ♭5 𝄫7', 'C E♭ G♭ B𝄫 (sounds as A)', 'very unstable, symmetrical'],
        ],
      },
      {
        t: 'p',
        text: 'You will also meet C6 (1 3 5 6), Cm6 (1 ♭3 5 6), Cm(maj7) (1 ♭3 5 7) and C7sus4 (1 4 5 ♭7).',
      },
      {
        t: 'listen',
        title: 'The five types on C',
        items: [
          { label: 'Cmaj7', chord: 'Cmaj7', beats: 3 },
          { label: 'C7', chord: 'C7', beats: 3 },
          { label: 'Cm7', chord: 'Cm7', beats: 3 },
          { label: 'Cm7♭5', chord: 'Cm7♭5', beats: 3 },
          { label: 'Co7', chord: 'Co7', beats: 3 },
        ],
      },
      { t: 'h', text: 'The logic: where the types come from' },
      {
        t: 'p',
        text: 'Stack thirds using **only the notes of the major scale**, starting on each degree. The scale\'s uneven steps give different chords on different degrees:',
      },
      {
        t: 'list',
        items: [
          'degrees 1 and 4 → **maj7**',
          'degrees 2, 3 and 6 → **m7**',
          'degree 5 → **7** (only one!)',
          'degree 7 → **m7♭5**',
        ],
      },
      {
        t: 'p',
        text: 'So the major scale gives you four of the five types for free. The o7 needs a note from outside the major scale; it appears in minor keys ([[L11]]).',
      },
      { t: 'h', text: 'The logic: why the 3rd and the 7th matter most' },
      {
        t: 'p',
        text: 'The 5th is a perfect 5th in maj7, 7 and m7 alike, so it tells you nothing. The 3rd (major or minor) and the 7th (major or minor) are two yes/no switches, and 2 × 2 = 4 chords:',
      },
      {
        t: 'table',
        head: ['', 'major 7th', 'minor 7th'],
        rows: [
          ['major 3rd', 'maj7', '7'],
          ['minor 3rd', 'm(maj7)', 'm7'],
        ],
      },
      {
        t: 'p',
        text: '**The 3rd and the 7th decide the type.** That is why jazz players happily leave out the 5th, and why the 3rd and 7th get a name of their own: **guide tones** ([[L5]]).',
      },
    ],
    practice: [
      '**Keys:** play all five types on all 12 roots, round the cycle of fourths (C F B♭ E♭ A♭ D♭ G♭ B E A D G).',
      '**Bass:** arpeggiate 1-3-5-7 for each type over two octaves.',
      '**Ears:** have someone play maj7, 7 or m7; name it. Listen for the 7th first: is it a half step below the octave (maj7) or a whole step (♭7)?',
    ],
    check: [
      { q: 'Spell E♭maj7.', a: 'E♭ G B♭ D', why: '1 3 5 7 from E♭: count 4, 7 and 11 half steps up. Each letter skips one: E♭ G B♭ D.' },
      { q: 'Spell Bm7♭5.', a: 'B D F A', why: 'It is the chord on degree 7 of C major, so it uses only white notes: B D F A. Check: ♭3 = D, ♭5 = F, ♭7 = A.' },
      { q: 'Which two notes tell you a chord\'s type?', a: 'The 3rd and the 7th.', why: 'The 5th is the same in maj7, 7 and m7; the 3rd and 7th are the two switches.' },
    ],
    quiz: ['spell', 'quality'],
  },
  {
    id: 'functions',
    part: 0,
    title: 'The chords of a key and their jobs',
    idea: 'Build a 7th chord on each note of the major scale, and each one gets a job: tonic, subdominant or dominant.',
    blocks: [
      {
        t: 'p',
        text: 'C major\'s diatonic chords (the chords made only from the notes of the key): `Imaj7 = Cmaj7 · IIm7 = Dm7 · IIIm7 = Em7 · IVmaj7 = Fmaj7 · V7 = G7 · VIm7 = Am7 · VIIm7♭5 = Bm7♭5`.',
      },
      {
        t: 'tip',
        title: 'How to read the numerals',
        text: 'The Roman numeral is the degree of the root (always upper case), and the chord type is written out: `IIm7`, `V7`, `VIIm7♭5`. So `IIm7` means "a m7 chord on the 2nd degree" in any key.',
      },
      { t: 'h', text: 'The logic: two notes decide everything' },
      {
        t: 'p',
        text: 'Use [[R4]]: look for the key\'s two pulling notes, F and B. F means "not home"; F with B (the tritone) means "go home" [[R2]].',
      },
      { t: 'functions', key: 'C' },
      { t: 'h', text: 'How chords move' },
      {
        t: 'p',
        text: 'The usual flow is **tonic → subdominant → dominant → tonic**: home, away, tension, home. The most important phrase in jazz is the **IIm7 – V7 – Imaj7** (Dm7 – G7 – Cmaj7).',
      },
      {
        t: 'p',
        text: 'Why is the II–V–I so strong? Two forces push the same way. The roots fall a fifth twice [[R3]], and the pull builds step by step [[R4]]: Dm7 has one pulling note (F), G7 has both (F + B), and Cmaj7 resolves both.',
      },
      {
        t: 'chart',
        title: 'Turnaround and II–V–I in C',
        chords: 'Cmaj7 | Am7 | [Dm7 | G7]> | Cmaj7',
        rn: 'Imaj7 VIm7 IIm7 V7 Imaj7',
        walk: 'C2 E2 G2 B1 | A1 C2 E2 G1 | D2 F2 A2 C2 | G1 B1 D2 F2 | C2 E2 G2 C2',
        tempo: 100,
      },
    ],
    practice: [
      '**Keys:** play the diatonic chords up and down in C, F and B♭, then loop the turnaround `Cmaj7 Am7 | Dm7 G7`.',
      '**Bass:** walk 1-3-5-7 on each chord, two beats per chord.',
      '**Analysis:** write Roman numerals under the chords of a simple tune. For each chord, ask the [[R4]] question: does it have the 4th degree? the 7th?',
    ],
    check: [
      { q: 'In F major, what are IIm7 and V7?', a: 'Gm7 and C7.', why: 'F major = F G A B♭ C D E. Degree 2 is G, degree 5 is C. Stack thirds: G B♭ D F (m7) and C E G B♭ (7).' },
      { q: 'What is the function of Am7 in C?', a: 'Tonic.', why: 'Am7 = A C E G: no F, so nothing fights the home chord [[R4]].' },
      { q: 'Which two chords in C contain the tritone?', a: 'G7 and Bm7♭5.', why: 'They are the only two with both F and B [[R4]].' },
    ],
    quiz: ['diatonic', 'function'],
  },
  {
    id: 'chord-scales',
    part: 0,
    title: 'Tensions and avoid notes (chord scales)',
    idea: 'Each chord comes with a scale; its other notes are either tensions or avoid notes.',
    blocks: [
      {
        t: 'p',
        text: 'Remember [[L1]]: a chord and its scale are the same notes. So once you have a chord, you have a scale, and you need only one question for each of its other notes: **can I hold this note over the chord?**',
      },
      { t: 'h', text: 'Work it out in two steps' },
      {
        t: 'list',
        items: [
          '**Step 1, the scale:** in a key, the scale is the key\'s notes starting from the chord\'s root [[R5]].',
          '**Step 2, the test:** for each note that is not in the chord, ask: is it a half step above a chord tone? Yes → avoid note. No → tension [[R6]].',
        ],
      },
      { t: 'h', text: 'Example: Em7 in C' },
      {
        t: 'p',
        text: 'Em7 = E G B D. The scale is E F G A B C D. Test the other notes: F is a half step above E → **avoid** (♭9). A is a whole step above G → **tension** (11). C is a half step above B → **avoid** (♭13).',
      },
      { t: 'scale', chord: 'Em7', scale: 'phrygian' },
      { t: 'h', text: 'The same test on every chord of C' },
      {
        t: 'p',
        text: 'Try the test on each chord **before** you look. The table below is not typed in: it is computed with the two steps above, so if your answer differs, the rule tells you why.',
      },
      {
        t: 'cstable',
        rows: [
          ['Cmaj7', 'ionian'],
          ['Dm7', 'dorian'],
          ['Em7', 'phrygian'],
          ['Fmaj7', 'lydian'],
          ['G7', 'mixolydian'],
          ['Am7', 'aeolian'],
          ['Bm7♭5', 'locrian'],
        ],
      },
      {
        t: 'list',
        items: [
          '**The 13 on Dm7 is B.** It passes the half-step test, but with F it makes the tritone [[R2]], so Dm7 starts sounding like G7. Use it knowing what it does.',
          '**G7 row:** C is a half step above B, the 3rd, so it stays an avoid note even with the dominant exception [[R6]].',
          'On a tonic major chord, 6 and maj7 are interchangeable (C6 or Cmaj7).',
          'Want the 11 on a dominant? Use **G7sus4**: the 4 replaces the 3, so nothing rubs ([[L10]]).',
        ],
      },
      {
        t: 'listen',
        title: 'Hold each tension, then the avoid note',
        items: [
          { label: 'Em7 + A (11)', chord: 'Em7', notes: 'A4', beats: 3 },
          { label: 'Em7 + F (♭9)', chord: 'Em7', notes: 'F5', beats: 3 },
          { label: 'Fmaj7 + B (♯11)', chord: 'Fmaj7', notes: 'B4', beats: 3 },
          { label: 'G7 + E (13)', chord: 'G7', notes: 'E5', beats: 3 },
          { label: 'G7 + C (11)', chord: 'G7', notes: 'C5', beats: 3 },
        ],
      },
    ],
    practice: [
      '**Keys:** hold each chord in the left hand and play its scale with the right. Hold each tension and listen, then hold the avoid note and hear the rub.',
      '**Bass:** play each chord scale up from the root in eighth notes. Land phrases on chord tones and tensions, pass through avoid notes.',
      '**Workshop:** pick any chord in the [[W]] and predict every note before it shows you.',
    ],
    check: [
      { q: 'What is the avoid note on Cmaj7?', a: 'F, the 11.', why: 'F is a half step above E, the 3rd [[R6]].' },
      { q: 'What are the tensions on Fmaj7 in C?', a: 'G (9), B (♯11), D (13).', why: 'The scale is F G A B C D E [[R5]]. None of G, B, D is a half step above F, A, C or E [[R6]].' },
      { q: 'Why is C an avoid note on G7?', a: 'It is a half step above B, the 3rd.', why: 'On a dominant, only the rub against the 3rd counts: the 3rd is half of the tritone [[R6]].' },
    ],
    quiz: ['avoid'],
  },
  {
    id: 'voice-leading',
    part: 0,
    title: 'Voice leading, guide tones and first voicings',
    idea: 'Move each voice to the closest note of the next chord; the 3rds and 7ths (the guide tones) carry the harmony.',
    blocks: [
      {
        t: 'code',
        caption: 'Guide tones in a II–V–I',
        lines: ['        Dm7   G7    Cmaj7', '  7th:  C  →  B  →  B     (drops a half step, then holds)', '  3rd:  F  →  F  →  E     (holds, then drops a half step)'],
      },
      {
        t: 'p',
        text: 'The pattern: the 7th of one chord drops a step to become the 3rd of the next; the 3rd stays put to become the next 7th. The two lines zig-zag down in half steps.',
      },
      { t: 'h', text: 'The logic: why it always works' },
      {
        t: 'p',
        text: 'When the root falls a fifth [[R3]], the guide tones barely need to move to keep up. Count it in half steps: the 7th of the first chord is always **one or two half steps above** the 3rd of the next; the 3rd of the first chord is **the same note** as the next chord\'s 7th, or a half step from it. So two notes moving by half steps [[R1]] follow a root that jumps a fifth. You don\'t need to learn the zig-zag: it is what falling fifths produce.',
      },
      {
        t: 'listen',
        title: 'Guide tones only, then with the roots',
        items: [
          { label: 'Guide tones', notes: 'F3 C4 | F3 B3 | E3 B3', beats: 3 },
          { label: 'With roots', notes: 'F3 C4 | F3 B3 | E3 B3', bass: 'D2 | G1 | C2', beats: 3 },
        ],
      },
      { t: 'h', text: 'Shell voicings' },
      {
        t: 'p',
        text: 'A **shell** is root + 3rd + 7th, or root + 7th + 3rd. Alternate the two so the upper notes move smoothly: `Dm7 = D-F-C → G7 = G-F-B → Cmaj7 = C-E-B`. Add one tension on top and you have an instant jazz sound: Dm9, G13, Cmaj9.',
      },
      { t: 'h', text: 'Walking bass with guide-tone thinking' },
      {
        t: 'p',
        text: 'Root on beat 1, chord tones on beats 2–3, and an **approach note** on beat 4: a half step above or below the next root. The approach note uses [[R1]]: a half step away, it leans into the next root.',
      },
      {
        t: 'chart',
        title: 'II–V–I walk with approach notes',
        chords: '[Dm7 | G7]> | Cmaj7 | Cmaj7',
        rn: 'IIm7 V7 Imaj7 Imaj7',
        walk: 'D2 E2 F2 A♭2 | G2 A2 B2 D♭3 | C3 B2 A2 G2 | E2 D2 C2 D♭2',
        tempo: 110,
      },
    ],
    practice: [
      '**Keys:** II–V–I shells in all 12 keys, round the cycle.',
      '**Ears:** play the roots and sing the guide-tone line.',
      '**Bass:** walk II–V–I in all 12 keys, approach note on beat 4.',
    ],
    check: [
      { q: 'What are the guide tones of B♭7?', a: 'D and A♭.', why: 'The 3rd (4 half steps above B♭) is D; the ♭7 (10 half steps) is A♭.' },
      { q: 'In a II–V–I, what happens to the 7th of the IIm7?', a: 'It drops a half step to become the 3rd of V7.', why: 'C (7th of Dm7) → B (3rd of G7): the root fell a fifth, the guide tone moved one half step.' },
      { q: 'Write a R-3-7 shell for E♭maj7.', a: 'E♭ G D.', why: 'Root E♭, 3rd G (4 half steps), 7th D (11 half steps).' },
    ],
    quiz: ['guide'],
  },

  // ───────────── Part 2 ─────────────
  {
    id: 'tritone',
    part: 1,
    title: 'Why V7 pulls home',
    idea: 'G7 contains B and F, a tritone; B goes up to C, F goes down to E. That resolution is the feeling of arriving.',
    blocks: [
      {
        t: 'p',
        text: 'This lesson is [[R2]] put to work. Any dominant 7th points to a target **a fifth below** its root [[R3]], and its tritone points to that target\'s root and 3rd.',
      },
      { t: 'h', text: 'Three ways V7 can go' },
      {
        t: 'list',
        items: [
          'To **I**, as expected: G7 → Cmaj7.',
          'To **VIm7**, a *deceptive* resolution: G7 → Am7. Why does it work? Am7 shares C and E with Cmaj7 [[R7]], so the tritone still resolves; only the bass surprises you.',
          'Somewhere else entirely: a surprise.',
        ],
      },
      {
        t: 'listen',
        title: 'Expected and deceptive',
        items: [
          { label: 'G7 → Cmaj7', chord: 'G7 | Cmaj7', beats: 2 },
          { label: 'G7 → Am7', chord: 'G7 | Am7', beats: 2 },
        ],
      },
      { t: 'h', text: 'VIIm7♭5 is a dominant without its root' },
      {
        t: 'p',
        text: 'Bm7♭5 (B D F A) is G9 (G B D F A) without the G. Same tritone, same job [[R7]]. That is why [[R4]] put it on the dominant side.',
      },
      {
        t: 'tip',
        title: 'Analysis habit',
        text: 'Draw a solid arrow from each V7 to the chord it resolves to. In the charts on these pages the arrow is the → after the chord.',
      },
      { t: 'h', text: 'Slide the tritone' },
      {
        t: 'p',
        text: 'Play B + F, resolve it to C + E. Then move the tritone down a half step at a time: B♭ + E, A + E♭… Each tritone sits inside **two** dominant chords: B + F is in G7 and in D♭7. That sets up [[L9]].',
      },
      {
        t: 'listen',
        title: 'One tritone, two roots',
        items: [
          { label: 'B + F over G', notes: 'B3 F4', bass: 'G1', beats: 3 },
          { label: 'the same over D♭', notes: 'B3 F4', bass: 'D♭2', beats: 3 },
        ],
      },
    ],
    practice: [
      '**Keys:** play B–F and resolve it to C–E; then slide the tritone down by half steps and resolve each one.',
      '**Bass:** play the root of G7, then the root of D♭7, under the same held tritone. Hear the same tension with two roots.',
    ],
    check: [
      { q: 'Which notes form the tritone in A7?', a: 'C♯ and G.', why: 'The 3rd and the ♭7 of A: C♯ (4 half steps) and G (10). They are 6 half steps apart.' },
      { q: 'Bm7♭5 is a rootless version of which chord?', a: 'G9.', why: 'G9 = G B D F A. Remove G and you have B D F A [[R7]].' },
      { q: 'What is G7 → Am7 called?', a: 'A deceptive resolution.', why: 'The tritone resolves (to C and E, both in Am7), but the root goes up a step instead of down a fifth.' },
    ],
    quiz: ['tritone'],
  },
  {
    id: 'secondary',
    part: 1,
    title: 'Secondary dominants',
    idea: 'Any diatonic chord (except the diminished one) can be preceded by its own V7, which makes it a temporary home.',
    blocks: [
      { t: 'h', text: 'The logic' },
      {
        t: 'p',
        text: '[[R2]] does not care what key you are in. Give any chord a tritone that resolves into it and that chord becomes a temporary home. **To find the V7 of any chord, go up a fifth from its root and make it a dominant 7th** [[R3]]. There is no list to learn.',
      },
      {
        t: 'table',
        head: ['Target', 'Its V7', 'Analysis', 'Outside note'],
        rows: [
          ['Dm7', 'A7', 'V7/II', 'C♯'],
          ['Em7', 'B7', 'V7/III', 'D♯ (and F♯)'],
          ['Fmaj7', 'C7', 'V7/IV', 'B♭'],
          ['G7', 'D7', 'V7/V', 'F♯'],
          ['Am7', 'E7', 'V7/VI', 'G♯'],
        ],
        caption: 'Bm7♭5 has no V7: it is too unstable to sound like a home.',
      },
      {
        t: 'p',
        text: '**How to spot one:** a dominant chord with a note from outside the key, resolving down a fifth.',
      },
      {
        t: 'chart',
        title: '"All of Me", first 8 bars',
        chords: 'Cmaj7 | E7> | A7> | Dm7 | E7> | Am7 | D7> | [Dm7 G7]>',
        rn: 'Imaj7 V7/VI V7/II IIm7 V7/VI VIm7 V7/V IIm7 V7',
        tempo: 120,
      },
      { t: 'h', text: 'Chord scales: [[R5]] in action' },
      { t: 'derive', key: 'C', chord: 'A7' },
      {
        t: 'p',
        text: 'Why do dominants going to a minor chord get ♭9 and ♭13? Not a new rule: the key notes you kept **are the target\'s notes**. E7 → Am7 keeps F and C, which belong to A minor; on E7 they are the ♭9 and ♭13. D7 → G keeps E and B, which belong to G major; on D7 they are the 9 and 13. The dominant is already using notes from where it is going.',
      },
      {
        t: 'cstable',
        rows: [
          ['C7', 'mixolydian', '→ Fmaj7 (major target)'],
          ['D7', 'mixolydian', '→ G7 (major target)'],
          ['A7', 'mixob13', '→ Dm7'],
          ['E7', 'mixob9b13', '→ Am7'],
          ['B7', 'mixob9b13', '→ Em7'],
        ],
      },
      { t: 'tip', title: 'Short version', text: 'Dominant going to a **minor** chord: ♭9 and ♭13. Going to a **major** chord: 9 and 13. And now you know why.' },
    ],
    practice: [
      '**Keys:** play each secondary dominant into its target in C, then in F.',
      '**Bass:** walk "All of Me". On each secondary dominant, play its 3rd (the outside note) on beat 2 or 3, and hear it lead into the next root.',
    ],
    check: [
      { q: 'What is V7/VI in F major?', a: 'A7.', why: 'VI of F is D (Dm7). Up a fifth from D is A; make it a dominant: A7.' },
      { q: 'In C, D7 is the V7 of what?', a: 'G7, so it is V7/V.', why: 'Down a fifth from D is G [[R3]].' },
      { q: 'What tensions work on E7 going to Am7?', a: '♭9 (F) and ♭13 (C), often ♯9 (G).', why: 'Keep the key notes [[R5]]: F and C are notes of A minor, the target.' },
    ],
    quiz: ['secdom'],
  },
  {
    id: 'related-ii',
    part: 1,
    title: 'Related IIs and extended dominants',
    idea: 'Every V7 can bring its own IIm7, and dominants can resolve into other dominants.',
    blocks: [
      { t: 'h', text: 'Idea 1: the related II' },
      {
        t: 'p',
        text: 'Any V7 can be preceded by its own IIm7: `D7 → G7` becomes `Am7 D7 → G7`. Most standards are chains of these small II–V pairs. How do you find it? It is the chord a fifth above the V [[R3]], so the roots keep falling. If the target is minor, the related II is usually m7♭5: `Bm7♭5 E7 → Am7` (why: in A minor, the II chord is m7♭5 — see [[L11]]).',
      },
      { t: 'h', text: 'Idea 2: extended dominants' },
      {
        t: 'p',
        text: 'Dominants that resolve to **other dominants**, each one down a fifth: `E7 → A7 → D7 → G7 → Cmaj7`. Each chord is the V7 of the next, so each arrival is also a new departure.',
      },
      {
        t: 'code',
        caption: 'Guide tones in the chain: they slide down chromatically',
        lines: ['  E7    A7    D7    G7    C', '  G♯ →  G  →  F♯ →  F  →  E', '  D  →  C♯ →  C  →  B  →  B'],
      },
      {
        t: 'p',
        text: 'Why chromatic? It is [[L5]] again: a root falling a fifth moves each guide tone by a half step [[R1]]. Do that five times in a row and you get two lines walking down the chromatic scale.',
      },
      {
        t: 'chart',
        title: 'Rhythm changes bridge in B♭: pure extended dominants',
        chords: 'D7> | D7 | G7> | G7 | C7> | C7 | F7> | F7',
        rn: 'V7/VI . V7/II . V7/V . V7 .',
        tempo: 140,
      },
      {
        t: 'tip',
        title: 'Analysis habit',
        text: 'Put a bracket under each II–V pair and an arrow from each V to its target. In the charts here, a bracket is the line under the two chords.',
      },
    ],
    practice: [
      '**Keys:** play the E7–A7–D7–G7–C chain with guide tones only, then add tensions.',
      '**Bass:** walk the rhythm changes bridge.',
      '**Rewrite:** add a related II before every dominant in "All of Me".',
    ],
    check: [
      { q: 'What is the related II for A7 going to Dm7?', a: 'Em7♭5 (or Em7).', why: 'Up a fifth from A is E. The target Dm is minor, so m7♭5 fits best.' },
      { q: 'Write the extended-dominant chain from B7 to C.', a: 'B7 E7 A7 D7 G7 C.', why: 'Each root falls a fifth [[R3]].' },
      { q: 'How does the guide-tone line move in an extended-dominant chain?', a: 'It descends chromatically.', why: 'Each fall of a fifth moves each guide tone a half step down [[R1]].' },
    ],
    quiz: ['relii'],
  },
  {
    id: 'subv',
    part: 1,
    title: 'Tritone substitution (SubV)',
    idea: 'G7 and D♭7 share the same tritone, so D♭7 can replace G7 and still resolve to C, with a chromatic bass.',
    blocks: [
      {
        t: 'p',
        text: 'The tritone is half an octave, so it splits the octave into two equal parts [[R2]]. B–F and F–C♭ are the same two keys. G7 has B and F; D♭7 has F and C♭. Same tritone, same job [[R7]].',
      },
      {
        t: 'chart',
        title: 'II–V–I and II–subV–I',
        chords: '[Dm7 | G7]> | Cmaj7 | Cmaj7 | [Dm7 | D♭7]~> | Cmaj7 | Cmaj7',
        rn: 'IIm7 V7 Imaj7 . IIm7 SubV7 Imaj7 .',
        walk: 'D2 F2 A2 C3 | G2 F2 D2 D♭2 | C2 E2 G2 B2 | C3 B2 A2 E♭2 | D2 F2 A2 C3 | D♭2 F2 A♭2 C♭3 | C3 G2 E2 D2 | C2 E2 G2 E♭2',
        tempo: 100,
      },
      {
        t: 'list',
        items: [
          'Any dominant can be swapped for the dominant a tritone away: E♭7 can replace A7 going to Dm7.',
          'A subV can bring its own related II: `A♭m7 D♭7 → Cmaj7`.',
          'The roots now fall a **half step** (D♭ → C) instead of a fifth: a chromatic bass line [[R1]].',
        ],
      },
      { t: 'h', text: 'Its scale: Lydian dominant' },
      { t: 'scale', chord: 'D♭7', scale: 'lyddom', caption: 'The ♯11 of D♭7 is G: the root of the chord it replaced.' },
      {
        t: 'p',
        text: 'Why Lydian dominant? D♭7 is far from the key, and [[R5]] on its own gives two notes on the same key (B and C♭), so you choose a colour ([[L10]]). The natural 9 and 13 don\'t rub [[R6]], and the ♯11 is G, a note of the home key and the root of the original V7. It is the subV keeping a memory of the chord it replaced.',
      },
      { t: 'tip', title: 'Analysis habit', text: 'Use a *dashed* arrow for a subV resolving down a half step (shown as ⇢ in the charts).' },
    ],
    practice: [
      '**Keys:** II–V–I and II–subV–I in all 12 keys; compare.',
      '**Bass:** chromatic lines into the target (D – D♭ – C). Walk both versions above.',
      '**Reharm:** in "All of Me", swap two dominants for their subVs.',
    ],
    check: [
      { q: 'What is the subV of G7?', a: 'D♭7.', why: 'A tritone (6 half steps) from G is D♭; D♭7 contains F and C♭ = B.' },
      { q: 'What is the subV of A7?', a: 'E♭7.', why: 'A7 has C♯–G; E♭7 has G–D♭ = the same tritone.' },
      { q: 'What is the ♯11 of D♭7, and why is it interesting?', a: 'G: the root of the chord it replaced.', why: '6 half steps above D♭ is G.' },
    ],
    quiz: ['subv'],
  },
  {
    id: 'dominant-colours',
    part: 1,
    title: 'Dominant colours: which tensions when',
    idea: 'Dominants are the one chord type where clashing tensions are welcome; your choice depends on where the chord is going.',
    blocks: [
      {
        t: 'list',
        items: ['**Natural tensions:** 9 and 13.', '**Altered tensions:** ♭9, ♯9, ♯11 and ♭13.'],
      },
      { t: 'h', text: 'The logic: tensions come from the target' },
      {
        t: 'list',
        items: [
          'G7 → C major: the key of C gives A and E, the **9 and 13** of G7 [[R5]].',
          'G7 → C minor: C minor gives A♭ and E♭, the **♭9 and ♭13**.',
          '**Altered** tensions add more half-step pulls into the target [[R1]]: A♭ (♭9) → G, D♭ (♯11) → C, E♭ (♭13) → E (or it stays as the ♭3 of Cm). More half steps, more pull: that is why "altered" sounds so tense.',
        ],
      },
      { t: 'h', text: 'What that gives you' },
      {
        t: 'list',
        items: [
          'Going to a **major** chord: 9 and 13 sound "inside"; altered tensions are optional spice.',
          'Going to a **minor** chord: ♭9 and ♭13 sound "inside" because they are notes of the minor key.',
          '**Not resolving** (blues, vamps, subV, ♭VII7): 9, ♯11 and 13 — no pull needed, so no rubs.',
        ],
      },
      {
        t: 'cstable',
        caption: 'The dominant scales on G7, computed with the dominant exception of Rule 6',
        rows: [
          ['G7', 'mixolydian', 'V7 → major'],
          ['G7', 'mixob9b13', 'V7 → minor'],
          ['G7', 'lyddom', 'subV, ♭VII7, not resolving'],
          ['G7', 'altered', 'most tension, either target'],
          ['G7', 'hw', 'the "13♭9" sound'],
          ['G7', 'wholetone', 'dreamy, augmented'],
        ],
      },
      {
        t: 'listen',
        title: 'Same II–V–I, four different V chords',
        items: [
          { label: 'G13', chord: 'Dm9 | G13 | Cmaj9', beats: 2 },
          { label: 'G7♭9', chord: 'Dm9 | G7♭9 | Cmaj9', beats: 2 },
          { label: 'G7alt', chord: 'Dm9 | G7alt | Cmaj9', beats: 2 },
          { label: 'G7♯11', chord: 'Dm9 | G7♯11 | Cmaj9', beats: 2 },
        ],
      },
      { t: 'h', text: 'Sus chords' },
      {
        t: 'p',
        text: 'In G7sus4 (G C D F), the 4 replaces the 3. Without B there is no tritone [[R2]], so nothing pulls and the chord floats. It is often written **F/G** or **Dm7/G**: a II and a V in one chord. Its scale is Mixolydian, and now the **3** is the note to avoid — not because it rubs, but because with F it brings the tritone back [[R6]].',
      },
      { t: 'scale', chord: 'G7sus4', scale: 'mixolydian' },
    ],
    practice: [
      '**Keys:** the same II–V–I four times, changing only the V: G13 → G7♭9 → G7alt → G7♯11. Left hand 3rd and 7th; right hand pairs of tensions.',
      '**Bass:** over a held G7, play the ♭9 and ♭13 resolving to the 5th and 3rd of C minor, then the 9 and 13 resolving into C major.',
    ],
    check: [
      { q: 'Which scale fits G7 going to Cm?', a: 'Mixolydian ♭9 ♭13, or altered.', why: 'C minor supplies A♭ and E♭ [[R5]].' },
      { q: 'What are the tensions of Lydian dominant?', a: '9, ♯11, 13.', why: 'Mixolydian with the 4 raised: the raised 4 no longer rubs against the 3rd [[R6]].' },
      { q: 'Why doesn\'t G7sus4 need to resolve as urgently as G7?', a: 'It has no tritone.', why: 'No B against F, so no double pull [[R2]].' },
    ],
    quiz: ['domscale'],
  },

  // ───────────── Part 3 ─────────────
  {
    id: 'minor-keys',
    part: 2,
    title: 'Harmony in minor keys',
    idea: 'Minor has three scales, and jazz takes the most useful chord for each job from whichever scale has it.',
    blocks: [
      {
        t: 'table',
        head: ['Scale (C minor)', 'Notes', 'What it gives you'],
        rows: [
          ['Natural minor', 'C D E♭ F G A♭ B♭', 'Cm7, Dm7♭5, E♭maj7, Fm7, A♭maj7, B♭7'],
          ['Harmonic minor', '… A♭ **B**', 'a real **G7** (with ♭9, ♭13) and **Bo7**'],
          ['Melodic minor', '… **A B**', '**Cm6, Cm(maj7)**'],
        ],
      },
      { t: 'h', text: 'The logic: each minor scale repairs the one before' },
      {
        t: 'list',
        items: [
          '**Natural minor** has B♭, a *whole* step below C. No half-step pull into the root [[R1]], and its V chord, Gm7, has no tritone [[R2]]. Weak cadences.',
          '**Repair: raise B♭ to B.** Now G7 has the tritone B–F: a real dominant. That is **harmonic minor**.',
          '**New problem:** A♭ to B is an awkward gap, and on the tonic Cm7 the A♭ sits a half step above G — an avoid note on the home chord [[R6]]. Home doesn\'t sound settled.',
          '**Repair: raise A♭ to A.** Now Cm6 and Cm(maj7) have no avoid notes and sound like home. That is **melodic minor**.',
        ],
      },
      { t: 'p', text: 'So there are not three scales to learn, just two repairs.' },
      {
        t: 'listen',
        title: 'Weak and strong minor cadences',
        items: [
          { label: 'Gm7 → Cm7 (natural)', chord: 'Gm7 | Cm7', beats: 2 },
          { label: 'G7♭9 → Cm6 (repaired)', chord: 'G7♭9 | Cm6', beats: 2 },
        ],
      },
      { t: 'h', text: 'Minor-key functions' },
      {
        t: 'list',
        items: [
          '**Tonic:** Cm6, Cm(maj7), Cm7, E♭maj7',
          '**Subdominant:** Dm7♭5, Fm7, A♭maj7, B♭7',
          '**Dominant:** G7 (♭9 ♭13), Bo7',
        ],
      },
      { t: 'h', text: 'The minor II–V–I' },
      {
        t: 'chart',
        title: 'Minor II–V–I in C minor',
        chords: '[Dm7♭5 | G7♭9]> | Cm6 | Cm6',
        rn: 'IIm7♭5 V7 Im6 .',
        walk: 'D2 F2 A♭2 C3 | G2 B1 D2 F2 | C2 E♭2 G2 A2 | C3 G2 E♭2 D♭2',
        tempo: 100,
      },
      {
        t: 'cstable',
        rows: [
          ['Dm7♭5', 'locrian', 'or Locrian ♮2 (adds a natural 9)'],
          ['Dm7♭5', 'locrian2'],
          ['G7', 'mixob9b13', 'or altered'],
          ['Cm6', 'melmin', 'the "end of the tune" sound'],
          ['Cm7', 'dorian', 'soft, modal'],
        ],
      },
      {
        t: 'chart',
        title: '"Autumn Leaves" (G minor), first 8 bars',
        chords: '[Cm7 | F7]> | B♭maj7 | E♭maj7 | [Am7♭5 | D7]> | Gm6 | Gm6',
        rn: 'IIm7/B♭ V7/B♭ Imaj7/B♭ IVmaj7/B♭ IIm7♭5 V7 Im6 .',
        caption: 'A major II–V–I in B♭, then a minor II–V–I in G minor: the relative major and minor share their notes.',
        tempo: 120,
      },
    ],
    practice: ['**Keys:** minor II–V–I in all 12 keys, shells then tensions. Then "Blue Bossa".', '**Bass:** walk the minor II–V–I; on G7 use B (the raised 7th) to lead into C.'],
    check: [
      { q: 'Write a minor II–V–I in A minor.', a: 'Bm7♭5 – E7♭9 – Am6.', why: 'II of A minor is B (m7♭5), V is E made dominant by raising G to G♯.' },
      { q: 'Which minor scale gives you the V7?', a: 'Harmonic minor.', why: 'Raising the 7th puts the tritone in V [[R2]].' },
      { q: 'Name two tonic minor chords with a "final" sound.', a: 'Im6 and Im(maj7).', why: 'With the raised 6th there is no avoid note on the home chord [[R6]].' },
    ],
    quiz: ['minor'],
  },
  {
    id: 'borrowing',
    part: 2,
    title: 'Modal interchange: borrowing from minor',
    idea: 'In a major key you can borrow chords from the parallel minor (the minor key on the same root) for a darker, bittersweet colour.',
    blocks: [
      {
        t: 'table',
        head: ['Chord (in C)', 'Analysis', 'Function', 'Scale'],
        rows: [
          ['Fm7 / Fm6', 'IVm7 / IVm6', 'subdominant minor', 'F Dorian'],
          ['B♭7', '♭VII7', 'subdominant minor ("backdoor")', 'B♭ Lydian dominant'],
          ['A♭maj7', '♭VImaj7', 'subdominant minor', 'A♭ Lydian'],
          ['Dm7♭5', 'IIm7♭5', 'subdominant minor', 'D Locrian'],
          ['D♭maj7', '♭IImaj7', 'subdominant minor', 'D♭ Lydian'],
          ['E♭maj7', '♭IIImaj7', 'tonic minor', 'E♭ Lydian'],
          ['Cm7 / Cm6', 'Im', 'tonic minor', 'Dorian / melodic minor'],
        ],
      },
      { t: 'h', text: 'The logic: one note, A♭' },
      {
        t: 'p',
        text: 'Every subdominant minor chord contains **A♭**, the ♭6 of the key. In V7, B pulls **up** into C. In these chords, A♭ pulls **down** into G [[R1]]. **Subdominant minor is the mirror image of dominant**: a soft downward pull instead of a sharp upward one. That is why B♭7 → Cmaj7 works with no G7: two downward half steps, A♭ → G and F → E.',
      },
      {
        t: 'p',
        text: 'So you can test any borrowed chord: **contains A♭ → subdominant minor**. E♭maj7 has no A♭, which is why it counts as a tonic chord. (Same kind of test as [[R4]], with A♭ as the pulling note.)',
      },
      {
        t: 'tip',
        title: 'Their scales',
        text: 'Borrowed chords take their notes from where they were borrowed: C minor [[R5]]. Fm7 in C minor gives F Dorian. B♭7 is the one exception people choose often: Lydian dominant keeps E, the 3rd of the home chord it is about to resolve into (Mixolydian, pure C minor, works too).',
      },
      {
        t: 'listen',
        title: 'The minor plagal and the backdoor',
        items: [
          { label: 'Cmaj7 – Fm6 – Cmaj7', chord: 'Cmaj7 | Fm6 | Cmaj7', beats: 2 },
          { label: 'Fm7 – B♭7 – Cmaj7', chord: 'Fm7 | B♭7 | Cmaj7', beats: 2 },
        ],
      },
      {
        t: 'chart',
        title: 'Ending of "Lady Bird": the Tadd Dameron turnaround',
        chords: 'Cmaj7 E♭maj7 | A♭maj7 D♭maj7 | Cmaj7',
        rn: 'Imaj7 ♭IIImaj7 ♭VImaj7 ♭IImaj7 Imaj7',
        tempo: 100,
      },
    ],
    practice: ['**Keys:** I – IVm6 – I in all 12 keys, then the backdoor II–V, then the Lady Bird turnaround.', '**Bass:** over Fm6 → Cmaj7, play A♭ → G and hear the downward pull.'],
    check: [
      { q: 'Write a backdoor II–V into Fmaj7.', a: 'B♭m7 – E♭7 – Fmaj7.', why: 'IVm7 and ♭VII7 of F: B♭m7 and E♭7.' },
      { q: 'Which note gives subdominant minor chords their colour in C?', a: 'A♭, the ♭6.', why: 'It pulls down a half step into G [[R1]].' },
      { q: 'Is E♭maj7 a subdominant minor chord in C?', a: 'No, it is tonic minor.', why: 'E♭ G B♭ D: no A♭.' },
    ],
    quiz: ['borrow'],
  },
  {
    id: 'diminished',
    part: 2,
    title: 'Diminished chords',
    idea: 'A dim7 chord is built only from minor thirds, so it is symmetrical and there are only three different ones.',
    blocks: [
      {
        t: 'p',
        text: 'Co7 = C E♭ G♭ A, then C again: four minor thirds fill the octave exactly (3 + 3 + 3 + 3 = 12). So C♯o7 shares no notes with Co7, Do7 shares none either — but E♭o7 has the same four notes as Co7. Only **three** different dim7 chords exist.',
      },
      { t: 'h', text: 'Three uses' },
      {
        t: 'list',
        items: [
          '**Ascending passing chord:** `Cmaj7 – C♯o7 – Dm7`. C♯o7 (C♯ E G B♭) is **A7♭9 without its root**: same tritone C♯–G, so it works like V7/II [[R7]]. Likewise D♯o7 leads to Em7 (it is B7♭9 without B).',
          '**Descending passing chord:** `Em7 – E♭o7 – Dm7 – G7`. The bass walks down chromatically [[R1]].',
          '**Auxiliary (common-tone) chord:** `Cmaj7 – Co7 – Cmaj7`. C stays while the other notes move a step and come back: a decoration.',
        ],
      },
      {
        t: 'tip',
        title: 'Find the hidden dominant',
        text: 'A passing dim7 is a dominant ♭9 with no root. Its root is a major 3rd **below** the dim7\'s bass: C♯o7 → A7♭9. Then [[R3]] tells you where it goes: down a fifth from A is D.',
      },
      {
        t: 'chart',
        title: 'Passing diminished chords',
        chords: 'Cmaj7 C♯o7> | Dm7 D♯o7> | Em7',
        rn: 'Imaj7 ♯Io7 IIm7 ♯IIo7 IIIm7',
        walk: 'C2 E2 C♯2 E2 | D2 F2 D♯2 F♯2 | E2 G2 B2 G2',
        tempo: 100,
      },
      { t: 'h', text: 'Chord scale' },
      { t: 'scale', chord: 'Co7', scale: 'wh', caption: 'Whole-half diminished: tensions a whole step above each chord tone: 9, 11, ♭13, maj7.' },
      { t: 'p', text: 'For a passing dim7 you can also use the scale of the dominant it stands in for (A7♭9 → half-whole).' },
    ],
    practice: ['**Keys:** `Cmaj7 – C♯o7 – Dm7 – D♯o7 – Em7` in several keys.', '**Bass:** chromatic walk-ups through the dim7 chords.'],
    check: [
      { q: 'C♯o7 is a rootless version of which chord?', a: 'A7♭9.', why: 'A7♭9 = A C♯ E G B♭. Remove A: C♯ E G B♭ [[R7]].' },
      { q: 'How many different dim7 chords are there?', a: 'Three.', why: 'Each one repeats every 3 half steps, so it covers 4 of the 12 roots: 12 ÷ 4 = 3.' },
      { q: 'What are the tensions on Co7, using whole-half?', a: 'D, F, A♭, B.', why: 'A whole step above each chord tone C, E♭, G♭, A.' },
    ],
    quiz: ['dim'],
  },
  {
    id: 'blues',
    part: 2,
    title: 'The blues, jazz style',
    idea: 'The blues breaks the rules on purpose: I7 and IV7 are dominants that don\'t resolve. They are colour, not tension.',
    blocks: [
      { t: 'h', text: 'The logic' },
      {
        t: 'p',
        text: 'Blues harmony grew **out of the melody**. Blues singing uses "blue notes" (♭3 and ♭7) over major chords. Harmonize that melody and every chord picks up a ♭7. That ♭7 is a colour from the melody, not a tritone waiting to resolve, so the ear accepts I7 as home. ([[R2]] still says the tritone pulls; the blues simply chooses not to follow it.)',
      },
      {
        t: 'chart',
        title: 'Basic jazz blues in F',
        chords: 'F7 | B♭7 | F7 | [Cm7 F7]> | B♭7 | Bo7 | F7 | D7> | [Gm7 | C7]> | F7 D7> | [Gm7 C7]>',
        rn: 'I7 IV7 I7 IIm7/IV V7/IV IV7 ♯IVo7 I7 V7/II IIm7 V7 I7 V7/II IIm7 V7',
        tempo: 130,
        caption: 'Bar 4 is a related II–V into IV. Bar 6 is a passing diminished. Bar 8 is V7/II. Bars 11–12: a I–VI–II–V turnaround.',
      },
      {
        t: 'chart',
        title: 'Minor blues in C',
        chords: 'Cm7 | Cm7 | Cm7 | Cm7 | Fm7 | Fm7 | Cm7 | Cm7 | A♭7~> | G7alt> | Cm7 | [Dm7♭5 G7]>',
        rn: 'Im7 . . . IVm7 . Im7 . SubV7/V V7 Im7 IIm7♭5 V7',
        tempo: 130,
        caption: 'A♭7 is the subV of D7 (V7/V), sliding down a half step into G7.',
      },
      {
        t: 'chart',
        title: 'Bird blues in F ("Blues for Alice" style)',
        chords: 'Fmaj7 | [Em7♭5 A7]> | [Dm7 G7]> | [Cm7 F7]> | B♭7 | [B♭m7 E♭7] | [Am7 D7] | [A♭m7 D♭7] | [Gm7 | C7]> | Fmaj7 D7> | [Gm7 C7]>',
        tempo: 140,
        caption: 'Chains of II–Vs. Bars 2–4 fall by fifths; bars 6–8 slide down by half steps.',
      },
      {
        t: 'p',
        text: '**Scales:** over I7 and IV7 use Mixolydian plus the blue notes. The ♭3 over a dominant is simply the ♯9. Use the blues scale as a colour over the whole form, and the usual chord scales for the "jazz" bars.',
      },
    ],
    practice: ['**Keys:** comp all three forms in F and B♭.', '**Bass:** walk them. Tunes: Billie\'s Bounce, Blue Monk, Mr. P.C. (minor), Blues for Alice (Bird blues).'],
    check: [
      { q: 'What is the chord in bar 6 of the basic F blues?', a: 'Bo7, a passing ♯IVo7.', why: 'Between B♭7 and F7/C, the bass walks up B♭ – B – C [[R1]].' },
      { q: 'In the minor blues, what is A♭7 going to G7?', a: 'The tritone sub of D7 (SubV7/V).', why: 'A♭7 and D7 share C and G♭/F♯ [[R7]].' },
      { q: 'Which bars of the Bird blues are chains of II–Vs?', a: 'Bars 2–4 and 6–8.', why: 'Look for m7 (or m7♭5) followed by a dominant a fourth above.' },
    ],
    quiz: ['secdom', 'subv'],
  },

  // ───────────── Part 4 ─────────────
  {
    id: 'form',
    part: 3,
    title: "Tonicization, modulation and reading a tune's form",
    idea: 'Tunes pass through several temporary keys; your job is to mark each key area and analyse the chords inside it.',
    blocks: [
      {
        t: 'list',
        items: [
          '**Tonicization:** a short visit, like a II–V into a chord that doesn\'t stay.',
          '**Modulation:** a new key that lasts, usually confirmed by a II–V–I and a few bars in that key.',
          '**Ways to get there:** a II–V into the new key (most common in jazz); a **pivot chord** that belongs to both keys; a **direct** jump.',
        ],
      },
      { t: 'h', text: 'A method that works on any standard' },
      {
        t: 'list',
        items: [
          '**1.** Find every V7 and draw an arrow to its target [[R2]] [[R3]].',
          '**2.** Bracket every II–V ([[L8]]).',
          '**3.** Circle the maj7 and minor chords where phrases land: these are your key areas.',
          '**4.** What is left is borrowed ([[L12]]), diminished ([[L13]]) or a substitute ([[L9]]).',
        ],
      },
      {
        t: 'p',
        text: 'Why this order? Dominants are the easiest chords to spot (they have the tritone), and every dominant points at its target, so the key areas show themselves.',
      },
      {
        t: 'p',
        text: '**"All the Things You Are":** the key centres go A♭ → C → E♭ → G → (bridge) G → E → A♭. Each A section starts in one key and moves up a major third with a II–V.',
      },
      {
        t: 'chart',
        title: 'Rhythm changes in B♭, A section',
        chords: 'B♭maj7 G7> | [Cm7 F7]> | Dm7 G7> | [Cm7 F7]> | [Fm7 B♭7]> | E♭ Eo7 | Dm7 G7> | [Cm7 F7]>',
        rn: 'Imaj7 V7/II IIm7 V7 IIIm7 V7/II IIm7 V7 IIm7/IV V7/IV IV ♯IVo7 IIIm7 V7/II IIm7 V7',
        tempo: 150,
        caption: 'I–VI–II–V, then III–VI–II–V, then a related II–V into IV (E♭), then IV – ♯IVo7.',
      },
      { t: 'p', text: 'Common forms: AABA (32 bars), ABAC (32 bars) and the 12-bar blues.' },
    ],
    practice: ['Analyse "All the Things You Are" and rhythm changes on paper, using the four steps, before you play them.'],
    check: [
      { q: 'What is the difference between tonicization and modulation?', a: 'Tonicization is a short visit; modulation sets up a new key that lasts.', why: 'Count the bars spent in the new key and look for a II–V–I that confirms it.' },
      { q: 'What are the four steps of the analysis method?', a: 'Arrows on V7s, brackets on II–Vs, circle the landing chords, label the rest.', why: 'Start from the easiest chords to spot: the dominants.' },
      { q: 'What are the key areas of the first A section of "All the Things You Are"?', a: 'A♭, then C.', why: 'It lands on A♭maj7, then G7 → Cmaj7 takes it to C.' },
    ],
    quiz: ['secdom', 'relii'],
  },
  {
    id: 'modal',
    part: 3,
    title: 'Modal harmony and sus chords',
    idea: 'Modal jazz switches off the tension-and-release engine: instead of moving through a progression, you stay on one mode and colour it.',
    blocks: [
      { t: 'h', text: 'The logic' },
      {
        t: 'p',
        text: 'The pull toward a key comes from two rules: tritones resolving [[R2]] and roots falling a fifth [[R3]]. Take those away and the pull is gone. What is left is pure colour, so the **mode\'s colour** has to carry the music.',
      },
      {
        t: 'table',
        head: ['Mode', 'Characteristic note', 'Brightness'],
        rows: [
          ['Lydian', '♯4', 'brightest'],
          ['Ionian', '— (major)', ''],
          ['Mixolydian', '♭7', ''],
          ['Dorian', '♮6', ''],
          ['Aeolian', '♭6', ''],
          ['Phrygian', '♭2', ''],
          ['Locrian', '♭5', 'darkest'],
        ],
        caption: 'The characteristic note is the one that makes the mode different from plain major or natural minor. Each line down lowers one more note.',
      },
      {
        t: 'list',
        items: [
          'Feature the characteristic note in lines and voicings.',
          'Don\'t let a tritone resolve like V7 → I, or the ear snaps into a key [[R2]].',
          'Use pedal points and vamps, and voicings built in **fourths**.',
        ],
      },
      {
        t: 'p',
        text: '"So What" and "Impressions" use one form: 16 bars of D Dorian, 8 of E♭ Dorian, 8 of D Dorian. The "So What" voicing is E A D G B over D: three fourths and a major third, moved in parallel.',
      },
      {
        t: 'listen',
        title: 'Two modes on D',
        items: [
          { label: 'D Dorian vamp: So What voicing', notes: 'E3 A3 D4 G4 B4', bass: 'D2', beats: 4 },
          { label: 'D Aeolian: the ♭6', notes: 'D4 E4 F4 G4 A4 B♭4 C5', bass: 'D2', beats: 1 },
          { label: 'D Dorian: the ♮6', notes: 'D4 E4 F4 G4 A4 B4 C5', bass: 'D2', beats: 1 },
        ],
      },
      { t: 'h', text: 'Sus chords' },
      {
        t: 'p',
        text: 'G7sus4 (G C D F) has no tritone, so it floats ([[L10]]). Voice it as **F/G** or **Dm7/G**. Its scale is Mixolydian; the 4 is now a chord tone and the **3** is the note to avoid [[R6]].',
      },
    ],
    practice: ['5 minutes on a one-chord vamp in each mode, landing phrases on the characteristic note.', 'Comp "So What" with quartal voicings; walk it on bass.'],
    check: [
      { q: 'What is the characteristic note of Dorian?', a: 'The natural 6.', why: 'Natural minor has ♭6; Dorian raises it.' },
      { q: 'Spell G7sus4.', a: 'G C D F.', why: '1 4 5 ♭7.' },
      { q: 'Why avoid V7 → I motion in modal music?', a: 'A resolving tritone pulls the ear into a key.', why: 'That is [[R2]]: the tritone points at a home, and the modal colour is lost.' },
    ],
    quiz: ['domscale'],
  },
  {
    id: 'voicings',
    part: 3,
    title: 'Voicings: rootless, drop 2, upper structures, quartal',
    idea: 'Keep the notes that carry information, add colour, drop what is redundant.',
    blocks: [
      {
        t: 'p',
        text: 'The logic of any voicing: keep the 3rd and 7th (they give the type, [[L2]]); add tensions that pass the half-step test [[R6]]; drop the root if the bass plays it (that is your job!) and the 5th, which tells nothing. Every voicing type below is one way of doing that.',
      },
      { t: 'h', text: 'A) Rootless voicings' },
      {
        t: 'table',
        head: ['Form', 'm7 / maj7', 'Dominant'],
        rows: [
          ['A', '3-5-7-9', '3-13-7-9'],
          ['B', '7-9-3-5', '7-9-3-13'],
        ],
      },
      {
        t: 'code',
        lines: ['Dm9 (A): F A C E  →  G13 (B): F A B E  →  Cmaj9 (A): E G B D', 'Dm9 (B): C E F A  →  G13 (A): B E F A  →  Cmaj9 (B): B D E G'],
        caption: 'Alternate A and B: only one or two notes move each time',
      },
      {
        t: 'listen',
        title: 'Rootless II–V–I with the bass on the roots',
        items: [{ label: 'A – B – A', notes: 'F3 A3 C4 E4 | F3 A3 B3 E4 | E3 G3 B3 D4', bass: 'D2 | G1 | C2', beats: 4 }],
        tempo: 90,
      },
      { t: 'h', text: 'B) Drop 2' },
      { t: 'p', text: 'Start from a close four-note chord and drop the second note from the top an octave: Cmaj7 (C E G B) becomes **G C E B**. Open and even, good for a melody on top.' },
      { t: 'h', text: 'C) Upper-structure triads on dominants' },
      {
        t: 'table',
        head: ['Triad over G7 (B + F)', 'Tensions it adds', 'Sound'],
        rows: [
          ['A major', '9, ♯11, 13', 'G13♯11 (Lydian dominant)'],
          ['E major', '13, ♭9, 3', 'G13♭9 (half-whole)'],
          ['E♭ major', '♭13, root, ♯9', 'G7♯9♭13 (altered)'],
          ['D♭ major', '♯11, 7, ♭9', 'G7♭9♯11'],
        ],
        caption: 'Work each row out: name each triad note by its distance from G ([[L1]]).',
      },
      {
        t: 'listen',
        title: 'Four upper structures, one shell',
        items: [
          { label: 'A / G7', notes: 'B3 F4 A4 C♯5 E5', bass: 'G1', beats: 3 },
          { label: 'E / G7', notes: 'B3 F4 G♯4 B4 E5', bass: 'G1', beats: 3 },
          { label: 'E♭ / G7', notes: 'B3 F4 G4 B♭4 E♭5', bass: 'G1', beats: 3 },
          { label: 'D♭ / G7', notes: 'B3 F4 A♭4 D♭5 F5', bass: 'G1', beats: 3 },
        ],
      },
      { t: 'h', text: 'D) Quartal voicings' },
      { t: 'p', text: 'Stack fourths, as in the So What voicing ([[L16]]). They suit modal tunes and sus chords.' },
    ],
    practice: ['II–V–I with rootless A/B forms in all 12 keys: the single most important keyboard drill in jazz.', 'The same II–V–I with the four upper structures on the V.'],
    check: [
      { q: 'Write a rootless A form for Fmaj7.', a: 'A C E G.', why: '3-5-7-9 of F.' },
      { q: 'Which triad over G7 gives 9, ♯11 and 13?', a: 'A major.', why: 'A = 9, C♯ = ♯11, E = 13 of G.' },
      { q: 'Write a rootless B form for G7.', a: 'F A B E.', why: '7-9-3-13 of G.' },
    ],
    quiz: ['guide', 'interval'],
  },
  {
    id: 'reharm',
    part: 3,
    title: 'Reharmonization',
    idea: 'Keep the melody, change the chords under it; every technique in this course is a reharmonization tool.',
    blocks: [
      { t: 'h', text: 'The toolkit, from subtle to wild' },
      {
        t: 'list',
        items: [
          '**1. Diatonic substitution:** swap chords with the same function (Cmaj7 ↔ Em7 ↔ Am7; Dm7 ↔ Fmaj7) [[R4]] [[R7]].',
          '**2. Add a V7 or a II–V** in front of any chord ([[L7]], [[L8]]).',
          '**3. Tritone substitution** for any V7, secondary dominants included ([[L9]]).',
          '**4. Borrowing:** IV → IVm6, or V7 → ♭VII7 ([[L12]]).',
          '**5. Passing diminished chords** between two chords a whole step apart ([[L13]]).',
          '**6. Chromatic approach:** come from a half step above with the same type (D♭maj7 → Cmaj7, E♭m7 → Dm7) [[R1]].',
          '**7. Melody first** ([[R6]] backwards): for a melody note, choose any chord where it is a chord tone or a tension, then connect the chords with good bass motion (steps or fifths).',
          '**8. Pedal point:** hold one bass note and change the chords above it. Great for intros and endings.',
        ],
      },
      {
        t: 'p',
        text: 'Melody note **C** could sit on: Cmaj7 (root), Am7 (♭3), Fmaj7 (5), Dm7 (♭7), A♭maj7 (3), E♭6 (13), B♭9 (9), D7 (♭7), F♯m7♭5 (♭5) or G♭7♯11 (♯11). In none of these is C a half step above a chord tone.',
      },
      {
        t: 'chart',
        title: 'Turnaround in C, four ways',
        chords: 'Cmaj7 | Am7 | Dm7 | G7> | Cmaj7 | A7> | Dm7 | G7> | Cmaj7 | E♭7~> | Dm7 | D♭7~> | Cmaj7 E♭maj7 | A♭maj7 D♭maj7 | Cmaj7',
        rn: 'Imaj7 VIm7 IIm7 V7 Imaj7 V7/II IIm7 V7 Imaj7 SubV7/II IIm7 SubV7 Imaj7 ♭IIImaj7 ♭VImaj7 ♭IImaj7 Imaj7',
        tempo: 110,
        caption: 'Original; with a secondary dominant; with tritone subs; Tadd Dameron. The last line takes the subVs of A7–D7–G7 (E♭7–A♭7–D♭7) and makes them maj7.',
      },
      { t: 'tip', title: 'Always check', text: 'Play the melody over every new chord. A reharm fails if a melody note becomes an avoid note on its new chord [[R6]].' },
    ],
    practice: ['Take the A section of a ballad and write two versions: one subtle (tools 1–3), one bold (tools 4–8). Check every melody note with [[R6]].'],
    check: [
      { q: 'Name three chords that could harmonize a melody note E.', a: 'E.g. Cmaj7 (3), Am7 (5), Fmaj7 (7), Dm9 (9), B♭maj7♯11 (♯11), C♯m7 (♭3), D9 (9).', why: 'Any chord where E is a chord tone or passes the half-step test [[R6]].' },
      { q: 'What is a chromatic-approach chord into Fmaj7?', a: 'G♭maj7.', why: 'Same type, a half step above [[R1]].' },
      { q: 'What must you check after reharmonizing?', a: 'That no melody note became an avoid note on its new chord.', why: '[[R6]] on every melody note.' },
    ],
    quiz: ['subv', 'secdom', 'borrow'],
  },
  {
    id: 'beyond',
    part: 3,
    title: 'Beyond function: constant structure, slash chords, Coltrane changes',
    idea: 'In advanced jazz, chords sometimes move for colour or symmetry rather than function.',
    blocks: [
      { t: 'h', text: 'The logic: equal divisions of the octave' },
      {
        t: 'list',
        items: [
          '**In two** (6 half steps): the tritone sub. G7 and D♭7 share a tritone because the tritone splits the octave in half ([[L9]]).',
          '**In three** (4 half steps): Coltrane changes (C, A♭, E).',
          '**In four** (3 half steps): the diminished chord, which is why there are only three of them ([[L13]]).',
        ],
      },
      { t: 'p', text: 'An equal division sounds the same from every starting point, so the ear follows the pattern instead of a key.' },
      { t: 'h', text: 'Constant structure' },
      { t: 'p', text: 'The same chord type moving by any interval: `Cmaj7♯11 – E♭maj7♯11 – D♭maj7♯11`. The ear follows the shape, not a key. Hear it in "Inner Urge".' },
      { t: 'h', text: 'Slash chords' },
      {
        t: 'list',
        items: ['**D/C** = C Lydian: D F♯ A over C are the 9, ♯11 and 13.', '**B♭/C** = C9sus4: B♭ D F over C are the ♭7, 9 and 11.'],
      },
      {
        t: 'listen',
        title: 'Slash chords',
        items: [
          { label: 'D/C', notes: 'D4 F♯4 A4', bass: 'C2', beats: 3 },
          { label: 'B♭/C', notes: 'B♭3 D4 F4', bass: 'C2', beats: 3 },
        ],
      },
      { t: 'h', text: 'Coltrane changes' },
      {
        t: 'chart',
        title: 'A Coltrane substitution for Dm7 G7 | Cmaj7',
        chords: 'Dm7 E♭7> | A♭maj7 B7> | Emaj7 G7> | Cmaj7',
        rn: 'IIm7 V7/♭VI ♭VImaj7 V7/III IIImaj7 V7 Imaj7',
        tempo: 100,
        caption: 'Three key centres a major 3rd apart (C, A♭, E), each reached through its own V7 [[R3]]. Hear it in "Giant Steps" and "Countdown".',
      },
    ],
    practice: ['Write your own 4-bar constant-structure phrase.', 'Play the Coltrane cycle in C slowly with shells, then walk it on bass.'],
    check: [
      { q: 'What are the Coltrane key centres from C?', a: 'C, A♭, E.', why: 'Divide the octave in three: 4 half steps each.' },
      { q: 'What does D/C sound like?', a: 'C Lydian (Cmaj7♯11).', why: 'D, F♯, A over C are 9, ♯11, 13.' },
      { q: 'What is B♭/C?', a: 'C9sus4.', why: 'B♭ D F over C are ♭7, 9, 11.' },
    ],
    quiz: ['secdom', 'subv'],
  },
  {
    id: 'capstone',
    part: 3,
    title: 'Capstone project',
    idea: 'Take one standard all the way: analysis, reharmonization, voicings, a walking line and a guide-tone solo.',
    blocks: [
      {
        t: 'p',
        text: 'Choose a standard: "There Will Never Be Another You" is a good choice, "Stella by Starlight" if you want a challenge. Then do the five tasks. Each one uses the rules; write the rule next to every decision you make.',
      },
      {
        t: 'list',
        items: [
          '**1. Full analysis:** numerals, arrows, brackets, key areas and a chord scale for every chord ([[L15]], [[R5]]).',
          '**2. Two reharmonizations:** one subtle, one bold, with the melody checked against each chord ([[L18]], [[R6]]).',
          '**3. A voicing chart:** rootless voicings for the whole tune ([[L17]]).',
          '**4. A walking bass line:** one chorus, written out, with approach notes into every chord ([[L5]], [[R1]]).',
          '**5. A guide-tone solo:** one chorus that lands on a 3rd or 7th on every chord change ([[L5]]).',
        ],
      },
      { t: 'tip', title: 'If you can do all five', text: 'you have covered the core of jazz harmony: from here it is tunes, ears and time.' },
    ],
    practice: ['One task a day for a week, then play the result with the band and record yourself.'],
    check: [],
    quiz: ['secdom', 'subv', 'avoid', 'guide', 'function'],
  },
]

export const lessonById = (id: string) => LESSONS.find((L) => L.id === id)
export const lessonByN = (n: number) => LESSONS[n - 1]
