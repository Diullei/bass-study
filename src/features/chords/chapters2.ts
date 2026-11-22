import type { Chapter } from './types'

/** Chapters 13–24: colour (continued), other piano systems, playing music, tone. */
export const CHAPTERS_2: Chapter[] = [
  // ───────────── 13 ─────────────
  {
    id: 'dominant-colours',
    part: 3,
    title: 'Dominant colours and the tritone-sub shortcut',
    piano:
      "The dominant chord is where pianists spend their colours: ♭9, ♯9, ♯11, ♭13, in any mix. The harmony course explains why ([[R6]]): a dominant is *supposed* to be unstable, so clashes are welcome everywhere except against the 3rd, which is half of the tritone ([[R2]]).",
    blocks: [
      { t: 'h', text: 'Bass logic: keep the tritone, move one finger' },
      {
        t: 'p',
        text: "A dominant is defined by its tritone, the 3rd and the ♭7 ([[R2]]). Hold those two notes still and change only the third note: every colour is one fret away. There are two shapes, and each has exactly one moving finger.",
      },
      {
        t: 'p',
        text: 'Register: the RB shapes around fret 8 put a 3rd or a 2nd just under its clear floor ([[Ch1]]). With no root under them and a bright tone they are fine; if one sounds cloudy, roll it or play it an octave up (the RA shapes at fret 14 are that octave).',
      },
      {
        t: 'shapes',
        title: 'RB on G7 (♭7 – 3 – top): the top note is on the G string',
        rows: ['G7 | x-x-8-9-7 | top = 5', 'G13 | x-x-8-9-9 | top = 13', 'G7♭13 | x-x-8-9-8 | top = ♭13', 'G7♯11 | x-x-8-9-6 | top = ♯11'],
        caption: 'The G string is four strings above the (absent) root, so row 4 of the map gives the menu: one fret back 5, same fret ♭13, one forward 13, two back ♯11 ([[Ch1]], [[Ch11]]).',
      },
      {
        t: 'shapes',
        title: 'RA on G7 (3 – ♭7 – top)',
        rows: ['G9 | x-x-14-15-14 | top = 9', 'G7♭9 | x-x-14-15-13 | top = ♭9', 'G7♯9 | x-x-14-15-15 | top = ♯9'],
        caption: 'Here the top string is three strings above the root: row 3 of the map. Same fret is the minor 10th, which on a dominant is called ♯9; one back is the 9, two back the ♭9.',
      },
      { t: 'h', text: 'Which colour? Ask where the chord is going' },
      {
        t: 'p',
        text: "Use [[R5]]: take the colour from the key you are going **to**. Going to C major: 9 and 13 (A and E are in C major). Going to C minor: ♭9 and ♭13 (A♭ and E♭ are in C minor). \"Altered\" just means using the minor-key colours on the way to a major chord, for extra pull. So nothing here needs memorizing: look one chord ahead and borrow its notes.",
      },
      {
        t: 'shapes',
        title: 'Chromatic top line: E, E♭, D',
        seq: true,
        rows: ['Dm9 | x-x-8-10-9 | top E', 'G7♭13 | x-x-8-9-8 | top E♭', 'Cmaj9 | x-x-7-9-7 | top D'],
        caption: 'Choose the colours so the top voice walks down by half steps. Each top note is a half step above the next one, so it *pulls* into it ([[R1]]).',
      },
      {
        t: 'shapes',
        title: 'Minor II–V–I, rootless',
        seq: true,
        rows: ['Dm7♭5 | x-x-11-10-10 | ♭5 ♭7 ♭3: an F minor triad', 'G7♭13 | x-x-8-9-8', 'Cm9 | x-x-6-8-7'],
        caption: 'The first chord is the triad from [[Ch8]]: Dm7♭5 without its root is F minor. The ♭13 of G7 (E♭) is the ♭3 of the C minor that follows: [[R5]] again.',
      },
      { t: 'h', text: 'The tritone-sub shortcut, with colours' },
      {
        t: 'p',
        text: "In [[Ch5]] the pair B + F served both G7 and D♭7. Add a third note and the trade still works, and it converts plain colours into altered ones ([[R7]]). Every note is simply renamed from a root six frets away:",
      },
      {
        t: 'shapes',
        rows: [
          'G7♭13 | x-x-8-9-8 | over G: ♭7 3 ♭13',
          'D♭9 | x-x-8-9-8 | the same three notes over D♭: 3 ♭7 9',
          'G13 | x-x-8-9-9 | over G: ♭7 3 13',
          'D♭7♯9 | x-x-8-9-9 | the same three notes over D♭: 3 ♭7 ♯9',
        ],
      },
      {
        t: 'tip',
        title: 'You never need to learn an "altered" shape',
        text: 'To play G7 altered, play a plain D♭9. To play a plain G13, you are also playing D♭7♯9. Which one the listener hears depends only on the root under it, which is the thumb\'s job ([[Law5]]).',
      },
      {
        t: 'along',
        title: 'Tritone trade: one shape, two roots',
        bars: 'G7♭13:x-x-8-9-8 | G7♭13:x-x-8-9-8 | D♭9:x-x-8-9-8 | D♭9:x-x-8-9-8',
        pattern: 'split',
        tempo: 80,
        caption: 'The shape never moves. Listen to the same three notes change meaning when the looped root changes.',
      },
      {
        t: 'along',
        title: 'Chromatic top line over a loop',
        bars: 'Dm9:x-x-8-10-9 | G7♭13:x-x-8-9-8 | Cmaj9:x-x-7-9-7 | Cmaj9:x-x-7-9-7',
        pattern: 'split',
        tempo: 90,
      },
      { t: 'h', text: 'Blues in F with colours and roots' },
      {
        t: 'shapes',
        rows: ['F13 | 6-x-6-7-7 | Grand A', 'B♭9 | x-6-5-6-5 | Grand B', 'C9 | x-8-7-8-7 | Grand B'],
        caption: 'Lift the root finger off each of these and you have the rootless version, for playing over a loop.',
      },
    ],
    drills: [
      'Top-note switch on G7, both shapes, over a looped G. Sing each colour before you play it.',
      'The chromatic top line in C, F, B♭, E♭.',
      'Tritone trade: loop G for two bars, then D♭ for two bars, and hold {G7♭13:x-x-8-9-8} the whole time. Listen to the same shape change meaning.',
      'Blues in F: first with roots (grand chords), then rootless over the looper, choosing a different colour on each chorus.',
    ],
    ready: 'You can choose a dominant colour by ear for where the chord is going.',
    checks: [
      {
        q: 'Which plain chord has the same three notes as a rootless C7♭13 (♭7, 3, ♭13)?',
        a: 'G♭9.',
        why: 'The tritone trade ([[R7]]): a root six frets away renames every note. The 3 and ♭7 swap roles, and ♭13 over C becomes the 9 over G♭. So the altered C7 is a plain G♭9.',
      },
      {
        q: 'Going to F minor, which two colours does [[R5]] suggest for C7?',
        a: '♭9 and ♭13 (D♭ and A♭).',
        why: 'Take the colours from the key you are going to. D♭ and A♭ are both in F minor; the plain D and A are not.',
      },
      {
        q: 'Write A13 as RB (♭7 – 3 – 13).',
        a: '{A13:x-x-10-11-11}',
        why: 'The ♭7 of A is G, at A‑10. The 3 (C♯) is one string up and one fret forward (a tritone), D‑11. The 13 (F♯) is a fourth above the 3: next string, same fret, G‑11.',
      },
    ],
    quiz: ['colour', 'trade', 'shapeDeg', 'nameShape'],
    tone: 'Altered dominants have close, dissonant intervals, and too much chorus blurs them. Drop BassStCho Mix to 15–20 for this chapter.',
  },

  // ───────────── 14 ─────────────
  {
    id: 'grid',
    part: 3,
    title: 'The four-string grid: two tensions at once, every chord type',
    piano:
      'The complete rootless left hand has four notes: the 3rd and 7th, plus two colours. A pianist chooses which two. Chapters 11 to 13 added **one** tension at a time; real chord symbols ask for more: G7♯9♭13, C13♭9, Fmaj9♯11, Dm11.',
    blocks: [
      { t: 'h', text: 'Bass logic: give each pair of strings a job' },
      {
        t: 'list',
        items: [
          '**E and A strings: the 3rd and 7th.** [[Law2]] allows this because a fourth, a fifth or a tritone is clear even in the bass band, where 3rds and 2nds are not.',
          '**D and G strings: one colour each.** Each of these two strings is a *switch* with three or four positions, and every position comes from the map ([[Ch1]]).',
        ],
      },
      {
        t: 'tip',
        title: 'The honest limit',
        text: 'The root is played first by the thumb, looped, or left to someone else ([[Law5]]). **A chord with its root at the bottom *and* two tensions does not fit under one hand without mud.** A pianist has the same limit in one hand, and solves it the same way.',
      },
      {
        t: 'p',
        text: 'Register note: every shape below passes the checker for notes and reach. Many of them have one inner 3rd a semitone or two under the floor from [[Ch1]], and the ♯11 shapes have a 2nd in the middle. With the bridge pickup and a bright tone they speak; if one sounds thick on your bass, roll it, or move the chord to the other grid.',
      },
      { t: 'h', text: 'Which note goes on the E string?' },
      {
        t: 'p',
        text: 'Either the 3rd or the 7th can be the bottom note. Find both on the E string and take the one that falls between frets 9 and 14: there the whole grid sits in the chord band. For a dominant the 3rd and ♭7 are six frets apart on one string (a tritone), so in any window of six frets **exactly one** of them appears. The window decides for you.',
      },
      { t: 'h', text: 'Dominant chords, ♭7 on the E string' },
      {
        t: 'table',
        head: ['D string', 'gives', 'G string', 'gives'],
        rows: [
          ['n − 2', '♯11', 'n', '♭9'],
          ['n − 1', '5', 'n + 1', '9'],
          ['n', '♭13', 'n + 2', '♯9'],
          ['n + 1', '13', '', ''],
        ],
        caption: 'G7: F at E‑13, B at A‑14. Call the E-string fret *n*. Each entry is Law 1: the D string is two strings above the ♭7, the G string three.',
      },
      {
        t: 'shapes',
        title: 'The six classic pairs: two D settings × three G settings',
        rows: [
          'G13 | x-13-14-14-14 | 13 and 9: plain',
          'G9♭13 | x-13-14-13-14 | ♭13 and 9',
          'G13♭9 | x-13-14-14-13 | 13 and ♭9',
          'G7♭9♭13 | x-13-14-13-13 | ♭13 and ♭9',
          'G13♯9 | x-13-14-14-15 | 13 and ♯9',
          'G7♯9♭13 | x-13-14-13-15 | ♭13 and ♯9: the "altered" chord',
        ],
        caption: 'Nothing here spans more than three frets. The E and A fingers never move.',
      },
      {
        t: 'shapes',
        title: 'With the D switch on the 5 or the ♯11',
        rows: [
          'G9 | x-13-14-12-14 | 5 and 9',
          'G7♭9 | x-13-14-12-13 | 5 and ♭9',
          'G7♯9 | x-13-14-12-15 | 5 and ♯9',
          'G9♯11 | x-13-14-11-14 | ♯11 and 9: Lydian dominant',
          'G7♭9♯11 | x-13-14-11-13 | ♯11 and ♭9',
        ],
      },
      { t: 'h', text: 'Dominant chords, 3rd on the E string' },
      {
        t: 'table',
        head: ['D string', 'gives', 'G string', 'gives'],
        rows: [
          ['n − 1', '♭9', 'n − 1', '♯11'],
          ['n', '9', 'n', '5'],
          ['n + 1', '♯9', 'n + 1', '♭13'],
          ['', '', 'n + 2', '13'],
        ],
        caption: 'C7: E at E‑12, B♭ at A‑13.',
      },
      {
        t: 'shapes',
        rows: [
          'C13 | x-12-13-12-14 | 9 and 13',
          'C13♭9 | x-12-13-11-14 | ♭9 and 13',
          'C7♭9♭13 | x-12-13-11-13 | ♭9 and ♭13',
          'C7♯9♭13 | x-12-13-13-13 | ♯9 and ♭13',
          'C13♯9 | x-12-13-13-14 | ♯9 and 13',
          'C9♯11 | x-12-13-12-11 | 9 and ♯11',
        ],
      },
      { t: 'h', text: 'The two grids are one grid' },
      {
        t: 'p',
        text: 'A tritone is the same shape whichever note is on the bottom, so the G7 grid at fret 13 is also the D♭7 grid at fret 13 ([[R7]]). Every shape has two names, a tritone apart, and the tensions trade like this (add 6 semitones to the root and rename):',
      },
      {
        t: 'table',
        head: ['Over one root', 'Over the root a tritone away'],
        rows: [['13', '♯9'], ['♭13', '9'], ['5', '♭9'], ['♯11', 'root']],
        caption: 'So G7♯9♭13 and D♭13 (with its 9) are the same four notes, and so are G13♭9 and D♭7♯9 with its 5. Six shapes, twelve chords.',
      },
      { t: 'h', text: 'Which pair to choose ([[R5]] and your ear)' },
      {
        t: 'table',
        head: ['Pair', 'Sound', 'Use it when'],
        rows: [
          ['9, 13', 'Plain, warm', 'Going to a major chord'],
          ['♭9, ♭13', 'Dark', 'Going to a minor chord: both notes come from the minor key'],
          ['♯9, ♭13', 'Altered: the strongest pull', 'You want maximum tension, to major or minor'],
          ['♭9, 13', 'Bright but biting (the diminished-scale sound)', 'Going to major, for surprise'],
          ['♯9, 13', 'Bluesy', 'Blues and funk dominants'],
          ['9, ♭13', 'Gentle tension', 'Ballads'],
          ['9, ♯11', 'Floating (Lydian dominant)', 'Dominants that do **not** fall a fifth: tritone subs, ♭VII7, IV7'],
        ],
      },
      {
        t: 'p',
        text: 'Two spelling rules keep you out of trouble: use only **one kind of 9** (not 9 with ♭9) and only **one kind of 13** (not 13 with ♭13). Two versions of one degree a half step apart contradict each other. The exception is ♭9 with ♯9, which belong to the same altered scale; they need both upper strings, so there is no room for a 13 next to them.',
      },
      { t: 'h', text: 'Major chords' },
      {
        t: 'p',
        text: 'Legal tensions: 9, ♯11, 13. The 11 fails [[R6]]: it sits a half step above the 3rd. **3rd on the E string** (C: E at E‑12, B at A‑14): D string at n is the 9. G string: n − 1 is ♯11, n is 5, n + 1 is ♯5, n + 2 is 13. Moving the A string down two frets turns the 7 into a 6.',
      },
      {
        t: 'shapes',
        rows: [
          'Cmaj9 | x-12-14-12-12 | 9 and 5',
          'Cmaj13 | x-12-14-12-14 | 9 and 13',
          'Cmaj9♯11 | x-12-14-12-11 | 9 and ♯11',
          'C6/9 | x-12-12-12-12 | 6 instead of 7: one flat finger',
        ],
      },
      {
        t: 'p',
        text: '**7th on the E string** (G: F♯ at E‑14, B at A‑14): G string at n is the 9. D string: n − 3 is ♯11, n − 2 is 5, n is 13.',
      },
      {
        t: 'shapes',
        rows: ['Gmaj13 | x-14-14-14-14 | 13 and 9: one flat finger', 'Gmaj9 | x-14-14-12-14 | 5 and 9', 'Gmaj9♯11 | x-14-14-11-14 | ♯11 and 9'],
        caption: 'A flat finger across four strings is a major chord with every colour. Which chord depends on the lowest note: if it is the 7th you have maj13 with a 9; if it is the 3rd you have 6/9; and [[Ch16]] reads the same barre as fourths.',
      },
      { t: 'h', text: 'Minor chords' },
      {
        t: 'p',
        text: 'Legal tensions: 9, 11, 13. Use the 13 freely on a tonic or Dorian minor; on a II chord heading to V it gives away the V\'s 3rd early, so most players save it. **♭3 on the E string** (Cm: E♭ at E‑11, B♭ at A‑13): D string at n + 1 is the 9. G string: n − 1 is 11, n is ♭5, n + 1 is 5, n + 3 is 13. On the A string, n + 1 is the 6 and n + 3 the major 7.',
      },
      {
        t: 'shapes',
        rows: [
          'Cm9 | x-11-13-12-12 | 9 and 5',
          'Cm11 | x-11-13-12-10 | 9 and 11',
          'Cm13 | x-11-13-12-14 | 9 and 13',
          'Cm6/9 | x-11-12-12-12 | tonic minor: 6 instead of ♭7',
          'CmMaj9 | x-11-14-12-12 | tonic minor: major 7',
          'Cm7♭5 | x-11-13-12-11 | half-diminished with a 9',
          'Cm7♭5 | x-11-13-10-11 | half-diminished, plain: ♭3 ♭7 R ♭5',
        ],
      },
      {
        t: 'p',
        text: '**♭7 on the E string** (Gm: F at E‑13, B♭ at A‑13): G string: n − 1 is the root, n + 1 is the 9. D string: n − 2 is ♭5, n − 1 is 5, n + 1 is 13.',
      },
      {
        t: 'shapes',
        rows: [
          'Gm9 | x-13-13-12-14 | 5 and 9',
          'Gm13 | x-13-13-14-14 | 13 and 9',
          'Gm7♭5 | x-13-13-11-14 | half-diminished with a 9',
          'Gm7♭5 | x-13-13-11-12 | half-diminished, plain',
        ],
        caption: 'The 11 is out of reach in this second grid. For an m11 with the ♭7 at the bottom use three notes: {Cm11:x-x-13-13-10} is ♭7, ♭3, 11.',
      },
      { t: 'h', text: 'The atlas' },
      {
        t: 'table',
        head: ['Chord type', 'Legal tensions', 'Pairs that fit one grip', 'Does not fit; do this instead'],
        rows: [
          ['maj7', '9, ♯11, 13', '9+13, 9+♯11, 9+5', '♯11+13: [[Ch15]]'],
          ['6', '9', '6/9 as a barre', '–'],
          ['m7', '9, 11, 13', '9+11, 9+13, 9+5', '11+13: choose one'],
          ['m6, m(maj7)', '9, 11', '9+5', '11: three notes'],
          ['7', '♭9, 9, ♯9, ♯11, ♭13, 13', 'any 9 with any 13; any 9 with ♯11 or 5', '♯11 with a 13: [[Ch15]]'],
          ['m7♭5', '9, 11, ♭13', '9+♭5', '11 or ♭13: the top-note menu of [[Ch11]]'],
          ['dim7', 'any note a whole step above a chord tone', '[[Ch15]]', '–'],
          ['7sus', '9, 13, ♭9', '[[Ch15]]', '–'],
        ],
      },
      {
        t: 'along',
        title: 'II–V–I in grids, then with the V altered',
        bars: 'Dm9:x-13-15-14-14 | G13:x-13-14-14-14 | Cmaj9:x-12-14-12-12 | Cmaj9:x-12-14-12-12 | Dm9:x-13-15-14-14 | G7♯9♭13:x-13-14-13-15 | Cmaj9:x-12-14-12-12 | Cmaj9:x-12-14-12-12',
        pattern: 'charleston',
        tempo: 100,
        caption: 'Bars 1–4 plain (9 and 13), bars 5–8 altered (♯9 and ♭13). Only the D and G fingers of the V chord change.',
      },
    ],
    drills: [
      '**Switch drill, dominants.** Hold the tritone of G7 on E and A. Play all six pairs in the order of the first table. Say the pair aloud. Then the same six on C7.',
      '**Destination drill.** Loop D–G–C (two beats each). On G7 play 9+13 one chorus, ♭9+♭13 the next, ♯9+♭13 the next. Then loop D–G–C minor and hear which pairs belong.',
      '**Tritone reading.** Hold {G7♯9♭13:x-13-14-13-15}. Loop a G root for two bars, then D♭ for two bars. Name the chord each time.',
      '**Whole II–V–I in grids:** {Dm9:x-13-15-14-14}, {G13:x-13-14-14-14}, {Cmaj9:x-12-14-12-12}. Then alter the middle chord to {G7♯9♭13:x-13-14-13-15}.',
      'One major, one minor and one half-diminished grid, in six keys, using the "which note on the E string" rule.',
    ],
    ready: 'Someone can call out any dominant with two tensions and you can play it within five seconds.',
    checks: [
      {
        q: 'For A13 with a 9, which note goes on the E string, at which fret? Write the shape.',
        a: 'The 3rd, C♯, at E‑9: {A13:x-9-10-9-11}.',
        why: 'The ♭7 (G) would be at E‑3 or E‑15, outside the 9–14 window; the 3rd is six frets away, inside it. Then the "3rd on the E string" grid: ♭7 on the A string one fret up, D at n is the 9, G at n + 2 is the 13.',
      },
      {
        q: 'What chord is that same shape over E♭?',
        a: 'E♭7♯9♭13.',
        why: 'E♭ is a tritone from A, so every tension trades ([[R7]]): 13 becomes ♯9, 9 becomes ♭13, and the 3 and ♭7 swap.',
      },
      {
        q: 'Why does no voicing contain both a 9 and a ♭9?',
        a: 'They are two versions of the same degree a half step apart, so one contradicts the other.',
        why: 'A chord symbol names one kind of 9 and one kind of 13. The accepted exception is ♭9 with ♯9, which both belong to the altered scale.',
      },
    ],
    quiz: ['trade', 'shapeDeg', 'colour', 'nameShape'],
    tone: 'Four notes with close tensions need definition more than width: KEYS patch, chorus Mix at 15, a little more treble.',
  },

  // ───────────── 15 ─────────────
  {
    id: 'rare-chords',
    part: 3,
    title: 'Rare chord types and big chord symbols',
    piano:
      'Lead sheets sometimes ask for chords that are rare (maj7♯5, dim7 with tensions, sus chords) or symbols that name more notes than any hand can hold (C13♯11♭9). A pianist reduces them to what matters; so do you.',
    blocks: [
      { t: 'h', text: 'maj7♯5' },
      {
        t: 'p',
        text: 'The 5 is raised a half step. Rootless, it is simply the major triad built on the 3rd: C maj7♯5 is an E major triad over C ([[R7]]: a simpler chord on the 3rd).',
      },
      { t: 'shapes', rows: ['Cmaj7♯5 | x-x-14-14-13 | 7 3 ♯5', 'Cmaj9♯5 | x-12-14-12-13 | grid: the G switch at n + 1'] },
      { t: 'h', text: 'maj13♯11' },
      { t: 'p', text: 'Both upper colours of a Lydian chord, with 7 and 3, land on a single fret:' },
      { t: 'shapes', rows: ['Cmaj13♯11 | x-14-14-14-14 | ♯11 7 3 13'] },
      { t: 'p', text: '**7♭5 and 7♯5** are spellings, not new chords: ♭5 is the same pitch as ♯11, ♯5 the same as ♭13. Use the dominant grids of [[Ch14]].' },
      { t: 'h', text: 'Diminished 7th with tensions' },
      {
        t: 'p',
        text: 'A dim7 divides the octave into four equal parts ([[Ch8]]). Its legal tensions are the four notes a whole step above its chord tones (which form another dim7 chord). So: take any dim7 shape and raise **one** note two frets.',
      },
      { t: 'shapes', rows: ['C°7 | x-14-15-13-14 | ♭5 R ♭3 °7', 'C°Maj7 | x-14-15-13-16 | top note up two frets: the major 7'] },
      { t: 'h', text: 'Sus chords by substitution' },
      {
        t: 'p',
        text: 'A sus chord replaces the 3rd with the 4th. The quickest way to all of them ([[R7]]): play the chord whose root is **a whole step below**, over the sus chord\'s root. Over C, a B♭ triad gives B♭, D, F: the ♭7, 9 and 4. No 3rd anywhere, so the chord is suspended.',
      },
      {
        t: 'table',
        head: ['Over C, play…', 'You get'],
        rows: [['a B♭ major triad', 'C9sus (♭7, 9, 4)'], ['a B♭maj7 chord', 'C13sus (♭7, 9, 4, 13)'], ['a B♭ minor triad', 'C7sus♭9 (♭7, ♭9, 4)']],
      },
      {
        t: 'shapes',
        rows: [
          'C7sus | x-x-15-15-15 | R 4 ♭7: one flat finger',
          'C9sus | x-x-13-12-10 | a B♭ triad',
          'C13sus | x-17-17-15-15 | the notes of B♭maj7',
          'C7sus♭9 | x-x-16-15-15 | a B♭ minor triad',
          'C7sus♭9 | 13-x-16-15-15 | the same with the root on the B string',
        ],
      },
      {
        t: 'along',
        title: 'A sus vamp on C',
        bars: 'C7sus:x-x-15-15-15 | C9sus:x-x-13-12-10 | C13sus:x-17-17-15-15 | C7sus♭9:x-x-16-15-15',
        pattern: 'bossa',
        tempo: 110,
        caption: 'One root, four triads from a whole step below. Hear how the sus chord never asks to resolve.',
      },
      { t: 'h', text: 'Reading a big chord symbol' },
      { t: 'p', text: 'A symbol like C13♯11♭9 names seven notes. You have four strings. Reduce it in this order, which follows what the ear needs most:' },
      {
        t: 'steps',
        items: [
          '**3rd and 7th stay** (4th and ♭7 for a sus chord). Without them it is a different chord ([[HL2]]).',
          '**Altered tensions next** (♭9, ♯9, ♯11, ♭13). They are the reason the symbol was written.',
          '**Then the highest natural tension.** A "13" chord should have its 13; the 9 under it is optional.',
          '**The 5th goes first**, unless it is altered.',
          '**The root is the thumb\'s job** ([[Law5]]).',
          '**Still more than four notes?** Split the chord across two beats: two grips that share the 3rd and 7th. Or play the melody note as the top tension and let that decide.',
        ],
      },
      {
        t: 'shapes',
        title: 'Worked examples',
        rows: [
          'C13♭9 | x-12-13-11-14 | C13♯11♭9, first grip: ♭9 and 13',
          'C7♭9♯11 | x-12-13-11-11 | second grip: ♭9 and ♯11. One finger moved.',
          'G7♯9♭13 | x-13-14-13-15 | "G7alt": the default reading',
          'G7♭9♭13 | x-13-14-13-13 | "G7alt" when the melody is on the ♭9',
          'Dm11 | x-13-15-14-12 | ♭3 ♭7 9 11',
        ],
        caption: 'For C13♯11♭9 there is also the triad route from [[Ch17]]: a G♭ major triad gives ♭7, ♭9, ♯11 and an A major triad gives ♭9, 3, 13.',
      },
      {
        t: 'along',
        title: 'C13♯11♭9 as two grips',
        bars: 'C13♭9:x-12-13-11-14 C7♭9♯11:x-12-13-11-11 | C13♭9:x-12-13-11-14 C7♭9♯11:x-12-13-11-11 | Fmaj9:x-12-12-10-12 | Fmaj9:x-12-12-10-12',
        pattern: 'split',
        tempo: 90,
      },
      { t: 'h', text: 'What the bass cannot do, and the substitute' },
      {
        t: 'table',
        head: ['Not playable under one hand', 'Why', 'Do this'],
        rows: [
          ['Root at the bottom plus two tensions', 'Root and 3rd end up a 3rd apart in the bass band ([[Law2]])', 'Root first, then the grid'],
          ['Three tensions with 3 and 7', 'Five notes, four strings', 'Two grips on two beats, or an upper-structure triad'],
          ['2nds and clusters below the G string\'s 8th fret', 'Below the floor for 2nds', 'Spread them: put one of the two notes an octave up or leave it out'],
          ['11 and 13 together on a minor chord', 'Both live on the G string', 'Choose by the melody'],
          ['♯11 and 13 together on a dominant', 'Both live on the same switch', 'Alternate, or play the major triad a whole step above the root ([[Ch17]])'],
          ['Any voicing near the nut with more than two notes', 'Everything is in the bass band', 'Move the root one string lower and five frets up ([[Ch9]])'],
        ],
      },
      {
        t: 'tip',
        title: 'Part 3 checkpoint',
        text: 'Play the four [[TP]] again, now with a colour on every chord, at least one dominant with two tensions, and a common tone or chromatic line in the top voice. Record and compare with your Part 2 recording.',
      },
    ],
    drills: [
      'Sus by substitution: loop C, play B♭, B♭maj7 and B♭m shapes over it. Then loop F and find E♭, E♭maj7, E♭m.',
      'Take ten chord symbols with two or more tensions from any real book page. Reduce each with the six steps, write the four notes, then find the grid ([[Ch14]]).',
      'The C13♯11♭9 pair of grips, alternating every two beats over a looped C.',
      'Diminished: play {C°7:x-14-15-13-14}, then raise each of the four notes by two frets in turn (one at a time), where the hand allows. Hear four different tensions.',
    ],
    ready: 'No chord symbol on a lead sheet stops you: you can say which notes you keep and why.',
    checks: [
      {
        q: 'Which chord over F gives F13sus?',
        a: 'E♭maj7.',
        why: 'Sus chords by substitution: the chord a whole step below the root. E♭ G B♭ D over F are ♭7, 9, 4 and 13.',
      },
      {
        q: 'You have only three strings free for C7♯9♭13. Which notes do you keep?',
        a: 'The 3rd, the ♭7 and one of the two alterations, preferably the one the melody is not already playing.',
        why: 'Steps 1 and 2 of the reduction: the 3rd and 7th say what the chord is; an alteration is why the symbol was written. One alteration is enough to make it altered.',
      },
      {
        q: 'Why is Cmaj7♯5 "an E triad over C"?',
        a: 'Its upper notes E, G♯, B are the 3, ♯5 and 7: exactly an E major triad.',
        why: 'Drop the root of any chord and the remaining notes form a chord on the 3rd ([[R7]], [[Ch12]]). Here the raised 5th makes that chord major.',
      },
    ],
    quiz: ['sus', 'shapeDeg', 'nameShape', 'trade'],
  },

  // ───────────── 16 ─────────────
  {
    id: 'fourths',
    part: 4,
    title: 'Fourths: quartal voicings',
    piano:
      'Around 1960 pianists (McCoy Tyner is the name to listen for) began stacking fourths instead of thirds. The sound is open and ambiguous, ideal for modal tunes where one scale lasts a long time ([[HL16]]). The "So What" chord is the famous case: three fourths with a major 3rd on top.',
    blocks: [
      { t: 'h', text: 'Bass logic: a fourth is one flat finger' },
      {
        t: 'p',
        text: '[[Law1]] says same fret, next string is a fourth. So a quartal voicing is **one flat finger**. No other instrument gets this chord so cheaply. And because stacked fourths have no 3rd at the bottom, the root under them decides what chord they are ([[R7]]). All of these are the same three notes, G, C and F:',
      },
      {
        t: 'shapes',
        rows: ['Dm11 | x-x-10-10-10 | over D: 11 ♭7 ♭3', 'G7sus | x-x-10-10-10 | over G: R 4 ♭7', 'E♭maj13 | x-x-10-10-10 | over E♭: 3 13 9', 'A♭maj13 | x-x-10-10-10 | over A♭: 7 3 13'],
        caption: 'Loop each root in turn under the same barre and listen. Fourths starting on the A string below fret 12 sit a little under their clear floor ([[Ch1]]); they speak with a bright tone and a light touch, and an octave up they are fully clear.',
      },
      { t: 'h', text: 'A mode in fourths' },
      {
        t: 'p',
        text: 'To comp on D Dorian (the scale of Dm7 as a II chord: D E F G A B C), stack fourths *inside the scale* on every step. A perfect fourth fits everywhere except across the scale\'s tritone (F to B): there one note moves a fret forward. The scale itself tells you where: [[R5]] again.',
      },
      {
        t: 'shapes',
        seq: true,
        rows: [
          'Dm11 | x-x-7-7-7 | E A D',
          'Dm13 | x-x-8-9-9 | F B E',
          'Dm11 | x-x-10-10-10 | G C F',
          'Dm11 | x-x-12-12-12 | A D G',
          'Dm13 | x-x-14-14-14 | B E A',
          'Dm13 | x-x-15-15-16 | C F B',
        ],
        caption: 'Every one of these is "D minor" over a D root. Sliding between them is called *planing*; it gives the chord motion even though the harmony does not change.',
      },
      { t: 'h', text: 'The "So What" voicing' },
      {
        t: 'p',
        text: 'Three fourths and a major 3rd on top. The top four notes fit on four strings, and the fifth string adds the root: the full five-note piano voicing exists on a 5-string bass.',
      },
      {
        t: 'shapes',
        rows: ['Dm11 | x-x-15-15-14 | top three notes: ♭7 ♭3 5', 'Dm11 | x-15-15-15-14 | top four', 'Dm11 | 15-15-15-15-14 | all five: D G C F A'],
        caption: 'The five-note grip needs a ring-finger barre at fret 15 with finger 1 at G‑14, and its lowest fourths are below the clear zone ([[Law2]]). Treat it as a special effect, rolled slowly. The three- and four-note versions are the everyday ones. These are the second chord of the tune\'s famous two-chord figure; slide any of them up two frets for the first (E A D G B).',
      },
      {
        t: 'along',
        title: 'Modal vamp: D Dorian in fourths',
        bars: 'Dm11:x-x-10-10-10 | Dm13:x-x-8-9-9 Dm11:x-x-10-10-10 | Dm11:x-x-12-12-12 | Dm13:x-x-14-14-14 Dm11:x-x-12-12-12 | Dm11:x-x-10-10-10 | Dm13:x-x-8-9-9 | Dm11:x-x-7-7-7 | Dm13:x-x-8-9-9',
        pattern: 'charleston',
        tempo: 120,
        caption: 'One chord for eight bars, never static: the shapes plane up and down the Dorian scale.',
      },
    ],
    drills: [
      'Loop a D root. Plane the six Dorian shapes up and down in a rhythm of your choice.',
      'Same over a looped G: the same shapes are now G Mixolydian (G7sus colours).',
      'One barre, four roots (the first table). Name each chord as the loop changes.',
      'Build the fourths ladder for C Dorian by arithmetic, without looking anything up.',
    ],
    ready: 'You can comp for two minutes on one minor chord without repeating yourself and without leaving the scale.',
    checks: [
      {
        q: '{B♭maj13:x-x-5-5-5} over a B♭ root: which degrees?',
        a: '3, 13, 9 (D, G, C).',
        why: 'A‑5 is D, a major 3rd above B♭; each string up adds a fourth: G is the 13 (6), C the 9.',
      },
      {
        q: 'In the C Dorian ladder, which two shapes are not a flat barre?',
        a: '{Cm13:x-x-6-7-7} and {Cm13:x-x-13-13-14}.',
        why: 'C Dorian\'s tritone is E♭ to A. A stack of fourths that crosses it needs one augmented fourth, which is one fret forward. Those are the two shapes that contain both E♭ and A.',
      },
      {
        q: 'Why does the same barre {G7sus:x-x-10-10-10} sound like four different chords?',
        a: 'Fourths contain no 3rd above a root, so they do not name a chord by themselves; the root under them does.',
        why: '[[R7]]: the ear decides the chord from the notes against the bass. G C F over G is R 4 ♭7; over E♭ it is 3 13 9.',
      },
    ],
    quiz: ['quartal', 'shapeDeg', 'map'],
    tone: 'Fourths love space: raise Hall Mix to 30–35, or use the PAD patch ([[Ch24]]).',
  },

  // ───────────── 17 ─────────────
  {
    id: 'triads',
    part: 4,
    title: 'Triads, inversions and upper structures',
    piano:
      'A pianist\'s right hand often plays a plain triad that is *not* the chord\'s own triad. Over a left-hand shell it produces rich colours with a simple, strong sound. These are called upper structures.',
    blocks: [
      { t: 'h', text: 'Step 1: triads on A‑D‑G' },
      {
        t: 'p',
        text: 'A triad has three positions (inversions). Derive each shape from the map ([[Ch1]]): a major 3rd is "next string, one fret back", a minor 3rd is "two back", a fourth is "same fret".',
      },
      {
        t: 'table',
        head: ['', 'Low to high', 'Major', 'Minor'],
        rows: [
          ['Root position', 'R 3 5', 'n, n−1, n−3', 'n, n−2, n−3'],
          ['1st inversion', '3 5 R', 'n, n−2, n−2', 'n, n−1, n−1'],
          ['2nd inversion', '5 R 3', 'n, n, n−1', 'n, n, n−2'],
        ],
        caption: 'n is the fret on the A string.',
      },
      {
        t: 'shapes',
        rows: ['C | x-x-10-10-9 | 2nd inversion', 'C | x-x-15-14-12 | root position', 'Cm | x-x-10-10-8 | 2nd inversion', 'Cm | x-x-15-13-12 | root position'],
        caption: 'The 2nd inversion is the friendliest on bass: two notes under one finger, and it sits in the chord band from about fret 9.',
      },
      { t: 'h', text: 'Step 2: a triad over a different root' },
      {
        t: 'p',
        text: 'The root goes on the B string, the triad on A‑D‑G, and by [[Law5]] they do not have to sound together. Over major and minor chords, use triads built on the chord’s upper notes, the 3rd, the 5th or the 9th (the triad a third up is the rootless idea of [[Ch12]]):',
      },
      {
        t: 'shapes',
        rows: ['Cmaj7 | 13-x-14-14-12 | E minor triad over C: 7 3 5', 'Cmaj9 | 13-x-14-12-12 | G major triad over C: 7 9 5', 'Cmaj13♯11 | 13-x-12-12-11 | D major triad over C: 13 9 ♯11 (Lydian)'],
      },
      { t: 'h', text: 'Over a dominant: which triads qualify?' },
      {
        t: 'p',
        text: 'Which major triads can sit on C7? Test all twelve with [[R5]] and [[R6]]: a triad qualifies if none of its notes is the 11 (F, a half step above the 3rd) or the major 7 (B, which contradicts the chord\'s own ♭7). Besides C’s own triad, five pass: **D, E♭, G♭, A♭ and A**. You can redo this test for any chord type, which is the point: the list is the output of a rule, not something to memorize.',
      },
      {
        t: 'shapes',
        rows: [
          'C7♯9 | 13-x-13-13-12 | E♭ triad: ♭7 ♯9 5',
          'C13♭9 | 13-x-16-14-14 | A triad: ♭9 3 13',
          'C7♭9♯11 | 13-x-13-11-11 | G♭ triad: ♭7 ♭9 ♯11',
          'C13♯11 | 13-x-12-12-11 | D triad: 13 9 ♯11',
        ],
        caption: 'The first three contain the 3 or the ♭7 of C7, so they still sound like a dominant on their own. The D triad has neither; it needs the shell first: play {C7:13-x-x-14-15}, then the triad.',
      },
      {
        t: 'p',
        text: 'From [[Ch8]]: a half-diminished chord is the minor triad a minor 3rd up. Dm7♭5 is an F minor triad over D.',
      },
      {
        t: 'along',
        title: 'Upper structures over C7, resolving to F',
        bars: 'C7♯9:13-x-13-13-12 | C13♭9:13-x-16-14-14 | C7♭9♯11:13-x-13-11-11 | C13♯11:13-x-12-12-11 | F6:x-x-8-7-7 | F6:x-x-8-7-7',
        pattern: 'ballad',
        tempo: 72,
        caption: 'Rank the four triads from mild to tense by ear. Which one pulls hardest into F?',
      },
    ],
    drills: [
      'C major triad, three inversions up the A‑D‑G strings. Then F, G, and their minors.',
      'Loop a C root. Play E minor, G major, D major triads over it in any inversion. Name the colours you hear.',
      'Loop C7 (root and shell). Play the five qualifying triads. Rank them from mild to tense by ear.',
      'Redo the "which triads qualify" test for Cm7.',
    ],
    ready: 'You can name what any triad adds to a root before you play it.',
    checks: [
      {
        q: 'Which triad over G gives G13♭9?',
        a: 'An E major triad (the triad on the 6th).',
        why: 'E, G♯, B over G are 13, ♭9 and 3: all legal on a dominant, and the 3 keeps it sounding like G7.',
      },
      {
        q: 'Why does a B♭ major triad fail the test over C7, and what chord does it make instead?',
        a: 'It contains F, the 11, a half step above the 3rd ([[R6]]). With no E in the voicing it makes C9sus.',
        why: 'Without the 3rd there is nothing for the 11 to clash with, and B♭ D F over C is ♭7, 9, 4: the sus chord of [[Ch15]].',
      },
      {
        q: 'Drill 4: over Cm7, which major triads qualify?',
        a: 'E♭, F and B♭.',
        why: 'Every note must be a chord tone or a legal tension of Cm7 (R 9 ♭3 11 5 13 ♭7). E♭ G B♭, F A C and B♭ D F pass; every other major triad holds a note a half step above a chord tone or a major 3rd/7th.',
      },
    ],
    quiz: ['triad', 'rootless', 'shapeDeg'],
  },

  // ───────────── 18 ─────────────
  {
    id: 'inside-a-chord',
    part: 4,
    title: 'Moving inside one chord',
    piano:
      'Good pianists never sit on a chord for four bars. They move through its inversions, slip in passing chords, and come back. Barry Harris taught a complete system for this: a major 6th chord and a diminished 7th chord, alternating on each step of a scale.',
    blocks: [
      { t: 'h', text: 'Bass logic: home and "wants to go home"' },
      {
        t: 'p',
        text: 'Take the notes of C6 (C E G A). The notes of the C major scale that are left over, plus one added note (A♭), are D F A♭ B: a diminished 7th chord. That dim7 is a G7♭9 without its root, a dominant. So walking up this eight-note scale alternates **home** and **wants to go home** on every step ([[R2]] and [[R4]]). Each of the three voices just climbs the scale.',
      },
      {
        t: 'shapes',
        seq: true,
        rows: [
          'C6 | x-8-x-7-9 | home',
          'D°7 | x-10-x-9-10 | passing',
          'C6 | x-12-x-10-12 | home, next inversion',
          'F°7 | x-13-x-12-13 | passing',
          'C6 | x-15-x-14-14 | home, next inversion',
        ],
        caption: 'The dim7 shape is the same both times: it repeats every three frets ([[Ch8]]). The C6 shapes are the inversions you get by moving each voice to the next chord tone. For C minor use Cm6 (C E♭ G A) with the same diminished chord.',
      },
      {
        t: 'along',
        title: 'The C6 ladder in half notes',
        bars: 'C6:x-8-x-7-9 D°7:x-10-x-9-10 | C6:x-12-x-10-12 F°7:x-13-x-12-13 | C6:x-15-x-14-14 F°7:x-13-x-12-13 | C6:x-12-x-10-12 D°7:x-10-x-9-10',
        pattern: 'split',
        tempo: 84,
        caption: 'Up and down the ladder: a static C chord starts to breathe. Switch the roots off and hear it as pure voice leading.',
      },
      { t: 'h', text: 'Drop voicings, briefly' },
      {
        t: 'p',
        text: 'Pianists and arrangers spread a tight four-note chord by dropping its second-highest note an octave ("drop 2"). You have been doing this since [[Ch6]]: form A is a close chord whose 3rd has been lifted an octave to make room at the bottom. On bass, every usable voicing is a spread voicing; [[Law2]] forces it.',
      },
      { t: 'h', text: 'Side-slipping' },
      {
        t: 'p',
        text: 'The stamp move of [[Ch10]], used on purpose: play the same shape one fret above or below for half a beat, then return. On a long Dm7, {E♭m7:x-11-x-11-11} for an eighth note and back to {Dm7:x-10-x-10-10}. The slip is a half step above every note, so each note pulls back into place ([[R1]]).',
      },
    ],
    drills: [
      'The C6 ladder, up and down, block and broken.',
      'The same on F6: start at {F6:x-x-8-7-7} and build the rest yourself, using form B on the upper strings or moving the root to E‑13.',
      'Four bars of Dm7 at 80 bpm: fill them using inversions, planing in fourths ([[Ch16]]) and one side-slip.',
    ],
    ready: 'A four-bar chord no longer makes you nervous.',
    checks: [
      {
        q: 'Why does the C6 ladder sound like "home, away, home" on every step?',
        a: 'The in-between chord (D F A♭ B) is G7♭9 without its root: a dominant of C.',
        why: 'It holds the tritone B–F ([[R2]]), so it wants to resolve, and the next step of the ladder is a C6 inversion: the resolution, one scale step later.',
      },
      {
        q: 'Which added note turns the C major scale into the eight-note ladder, and why that one?',
        a: 'A♭.',
        why: 'With A♭ the leftover notes D F A♭ B are four notes a minor 3rd apart: a full diminished chord, which alternates with the four notes of C6.',
      },
      {
        q: '{D°7:x-10-x-9-10} and {F°7:x-13-x-12-13}: why is it the same shape three frets apart?',
        a: 'A dim7 chord is built from minor 3rds only, so moving every note up a minor 3rd (three frets) gives the same four notes.',
        why: 'The octave splits into four equal parts of three semitones; each inversion of the chord is the same shape again ([[Ch8]]).',
      },
    ],
    quiz: ['shapeDeg', 'nameShape', 'form'],
  },

  // ───────────── 19 ─────────────
  {
    id: 'chord-melody',
    part: 4,
    title: 'Chord melody: the tune on top',
    piano: 'Melody on top in the right hand, harmony underneath. The melody note is always the highest note.',
    blocks: [
      { t: 'h', text: 'Bass logic: work from the top down' },
      { t: 'p', text: 'This is the reverse of everything so far: the melody note comes first, the chord is built under it.' },
      {
        t: 'steps',
        items: [
          '**Put the melody on the G string** (or the D string for low phrases), in the melody band: G‑9 and above ([[Ch1]]).',
          '**Ask what degree the melody note is** of the current chord.',
          '**Fill in below it.** Melody is the 3rd → 7th on the string below (same fret, or one back for a dominant), root under that: form A. Melody is the 7th → 3rd on the string below, root under that: form B or C. Melody is the 5, 9 or 13 → put the 3‑7 pair on the two strings below: a rootless or grand shape with your note as the top colour. Melody is the root → 7th and 3rd below it; let the thumb skip the low root or play it first. Every one of these is [[Law1]] run backwards: from the note on top, count down to the 3rd, the 7th and the root (the reversed map of [[Ch1]]).',
          '**If the melody moves while the chord holds,** play the chord on the first melody note, then let it ring (or let the reverb hold it) and play the rest of the melody alone.',
          '**If nothing fits under the hand,** split: root on beat 1, melody with its pair on the next beat ([[Law5]]).',
        ],
      },
      { t: 'h', text: 'An eight-bar étude' },
      {
        t: 'p',
        text: 'An original melody over II–V–I–VI, II–V–I–I in C. The top note of each chord is the tune: A, B, G, G, then F, E, D, E.',
      },
      {
        t: 'shapes',
        seq: true,
        rows: [
          'Dm7 | 15-x-15-15-14 | melody A is the 5',
          'G7 | x-15-x-15-16 | melody B is the 3',
          'Cmaj7 | 13-x-14-14-12 | melody G is the 5',
          'A7 | x-x-12-11-12 | melody G is the ♭7',
          'Dm7 | x-10-x-10-10 | melody F is the ♭3',
          'G13 | 8-x-8-9-9 | melody E is the 13',
          'Cmaj9 | x-8-7-9-7 | melody D is the 9',
          'C6 | x-8-x-7-9 | melody E is the 3',
        ],
      },
      {
        t: 'along',
        title: 'The étude, rolled',
        bars: 'Dm7:15-x-15-15-14 | G7:x-15-x-15-16 | Cmaj7:13-x-14-14-12 | A7:x-x-12-11-12 | Dm7:x-10-x-10-10 | G13:8-x-8-9-9 | Cmaj9:x-8-7-9-7 | C6:x-8-x-7-9',
        pattern: 'ballad',
        tempo: 66,
        caption: 'One chord per bar, top note loudest. Then play each chord on beat 1 and improvise two or three melody notes from the C major scale on the G string before the next chord.',
      },
      { t: 'h', text: 'Arranging a tune yourself' },
      {
        t: 'p',
        text: 'Pick a standard with a slow melody and one chord per bar. For each bar: write the melody note, write its degree, choose the fill from step 3. Move the melody up an octave if it falls below G‑9. This is slow the first time and gets faster for the rest of your life, because it is the same five decisions every bar.',
      },
      {
        t: 'tip',
        title: 'Part 4 checkpoint',
        text: 'Play the four [[TP]], each three ways: in fourths (where the chord allows), with upper-structure triads on the dominants, and as chord melody with a top line you invent.',
      },
    ],
    drills: [
      'The étude, in three textures ([[Ch2]]).',
      'Reharmonize bar 2: replace G7 with D♭7 ([[Ch13]]). What is the melody note B over D♭? Find the new shape.',
      'Arrange the first eight bars of a ballad you know.',
    ],
    ready: 'You can play one complete tune, melody and chords, from memory.',
    checks: [
      {
        q: 'Melody note E over Am7: which degree, and what goes under it?',
        a: 'The 5. Put the ♭7–♭3 pair under it: {Am7:x-x-10-10-9}, with the root at B‑10 if you want all four notes: {Am7:10-x-10-10-9}.',
        why: 'Step 3: a 5, 9 or 13 on top takes the 3‑7 pair on the two strings below. G (♭7) and C (♭3) are a fourth apart: same fret on A and D.',
      },
      {
        q: 'Melody F♯ over D7, with the hand near fret 11: write a shape.',
        a: '{D7:x-10-x-10-11}: form A.',
        why: 'F♯ is the 3 of D7. Melody on the 3 → the 7th on the string below (one fret back for a dominant: C at D‑10), root under that (D at E‑10).',
      },
      {
        q: 'Drill 2: what is the melody note B over D♭7, and which shape fits?',
        a: 'The ♭7 (written C♭): form C, {D♭7:14-x-x-15-16}.',
        why: 'Melody on the 7th → the 3rd on the string below, root under it. D♭ at B‑14, F at D‑15, the melody on top.',
      },
    ],
    quiz: ['shapeDeg', 'below', 'form', 'nameShape'],
    tone: 'Use the GLASS patch ([[Ch24]]): the exciter brings out the top note, which is the melody.',
  },

  // ───────────── 20 ─────────────
  {
    id: 'comping',
    part: 5,
    title: 'Comping patterns for thumb and fingers',
    piano: 'Comping is rhythm first, notes second. A pianist\'s two hands make a small drum kit.',
    blocks: [
      { t: 'h', text: 'Bass logic: T is the low drum, the fingers are the high one' },
      {
        t: 'p',
        text: 'Every pattern below works with any voicing from Parts 1 to 4. Counts are in 4/4; "&" is the off-beat. Press play on each pattern, then play along with your own shape.',
      },
      {
        t: 'patterns',
        chord: 'Cmaj7',
        shape: 'x-8-x-9-9',
        ids: ['four', 'split', 'charleston', 'bossa', 'ballad'],
        caption: 'Four to the bar works best with pairs ([[Ch5]]); split is the default for practising; bossa lasts two bars.',
      },
      { t: 'h', text: 'The thumb\'s second note' },
      {
        t: 'p',
        text: 'On beat 3 the thumb can play the 5th instead of repeating the root. [[Law1]] finds it: one string down is 5 semitones lower, and 5 semitones below the root is its 5th. So the 5th below the root is *one string lower, same fret*. From C at E‑8 that is G at B‑8. Root on 1, low 5th on 3, with no hand movement at all. This is the 5-string version of the root–fifth bass every bossa and samba needs.',
      },
      { t: 'h', text: 'Independence' },
      {
        t: 'p',
        text: 'Bossa is hard at first because the thumb and fingers disagree. Learn it the way pianists do: thumb alone until it is automatic, fingers alone (tapping on the strings), then together at half speed.',
      },
      {
        t: 'along',
        title: 'Route 3 in F, every pattern',
        bars: 'Gm7:8-x-x-8-10 | C7:x-8-x-8-9 | Fmaj7:6-x-x-7-9 | Fmaj7:6-x-x-7-9',
        pattern: 'split',
        tempo: 100,
        caption: 'The II–V–I from [[Ch7]], one chord per bar. Change the pattern each time round.',
      },
      {
        t: 'along',
        title: 'Bossa: thumb on root and low 5th',
        bars: 'Dm9:x-x-8-10-9 | G13:x-x-8-9-9 | Cmaj9:x-x-7-9-7 | C6/9:x-x-7-7-7',
        pattern: 'bossa',
        tempo: 120,
      },
      {
        t: 'along',
        title: 'Charleston on the F blues, with pairs',
        bars: 'F7:x-x-x-7-8 | B♭7:x-x-x-6-7 | F7:x-x-x-7-8 | F7:x-x-x-7-8 | B♭7:x-x-x-6-7 | B♭7:x-x-x-6-7 | F7:x-x-x-7-8 | F7:x-x-x-7-8 | C7:x-x-x-8-9 | B♭7:x-x-x-6-7 | F7:x-x-x-7-8 | C7:x-x-x-8-9',
        pattern: 'charleston',
        tempo: 120,
      },
    ],
    drills: [
      'Each pattern on Route 3 of [[Ch7]] (II–V–I in F), one chord per bar, four times round.',
      'Bossa on Dm9 – G13 – Cmaj9 – C6/9 with grand or rootless shapes; the thumb plays root and low 5th.',
      'Charleston on the F blues with pairs, then with rootless shapes.',
    ],
    ready: 'You can hold a conversation while playing the split pattern, and play the bossa pattern for two minutes without the thumb drifting.',
    checks: [
      {
        q: 'The root is G at A‑10. Where is the low 5th for the thumb?',
        a: 'D at E‑10.',
        why: 'One string lower is 5 semitones down ([[Law1]]), and 5 semitones below G is D, its 5th. Same fret, no movement.',
      },
      {
        q: 'Why does the split pattern sound like a pianist\'s stride?',
        a: 'The thumb plays the bass on 1 and 3 and the fingers answer with the chord on 2 and 4, exactly like a stride left hand jumping between a low note and a chord.',
        why: '[[Law5]]: time is the second hand. What one hand cannot hold at once, it plays in turn.',
      },
      {
        q: 'Why learn the bossa thumb alone first?',
        a: 'Because the fingers are syncopated against it; if the thumb is not automatic, it follows the fingers and the pulse drifts.',
        why: 'The thumb is the time-keeper (the pianist\'s left hand). The fingers can only be free once it runs by itself.',
      },
    ],
    quiz: ['fifthBelow', 'map', 'form'],
  },

  // ───────────── 21 ─────────────
  {
    id: 'walking-stabs',
    part: 5,
    title: 'Walking with chord stabs',
    piano: 'A solo pianist walks a bass line in the left hand and drops chords in with the right.',
    blocks: [
      { t: 'h', text: 'Bass logic: the chord is a stab' },
      {
        t: 'p',
        text: 'One hand cannot hold a chord and walk ([[Law5]]). So the chord is a *stab*: it sounds on beat 1 with the root, and the line walks away from it on beats 2, 3 and 4. Beat 4 is an approach note, a half step above or below the next root ([[R1]]): it is the note that pulls the ear into the next bar.',
      },
      {
        t: 'table',
        head: ['Bar', 'Beat 1: chord', 'Beat 2', 'Beat 3', 'Beat 4: approach'],
        rows: [
          ['Dm7', '{Dm7:x-10-x-10-10}', 'F (A‑8)', 'A (A‑12)', 'A♭ (A‑11): a half step above G'],
          ['G7', '{G7:x-x-10-9-10}', 'F (A‑8)', 'E (A‑7)', 'D♭ (E‑9): a half step above C'],
          ['Cmaj7', '{Cmaj7:x-8-x-9-9}', 'E (A‑7)', 'G (A‑10)', 'C♯ (E‑9): a half step below D, back to the top'],
        ],
        caption: 'Beats 2 and 3 are chord tones or scale steps; beat 4 always points at the next root.',
      },
      {
        t: 'along',
        title: 'Stabs and a walking line: II–V–I in C',
        bars: 'Dm7:x-10-x-10-10 | G7:x-x-10-9-10 | Cmaj7:x-8-x-9-9 | Cmaj7:x-8-x-9-9',
        walk: 'D2 F2 A2 Ab2 | G2 F2 E2 Db2 | C2 E2 G2 E2 | C2 E2 G2 C#2',
        pattern: 'stab',
        tempo: 70,
        caption: 'Play the chord short, like a snare hit, and the walking notes long. Switch "your part" off and walk it yourself.',
      },
      {
        t: 'p',
        text: 'Once this is easy, move the stab: play only the root on beat 1 and put the pair on the & of 1, or on the & of 2. The walking line never stops.',
      },
      {
        t: 'along',
        title: 'Blues in F with a stab on every bar',
        bars: 'F7:6-x-x-7-8 | B♭7:x-6-x-6-7 | F7:6-x-x-7-8 | F7:6-x-x-7-8 | B♭7:x-6-x-6-7 | B♭7:x-6-x-6-7 | F7:6-x-x-7-8 | F7:6-x-x-7-8 | C7:x-8-x-8-9 | B♭7:x-6-x-6-7 | F7:6-x-x-7-8 | C7:x-8-x-8-9',
        walk: 'F1 A1 C2 B1 | Bb1 Ab1 G1 Gb1 | F1 A1 G1 Gb1 | F1 A1 C2 B1 | Bb1 D2 C2 B1 | Bb1 Ab1 G1 Gb1 | F1 A1 G1 E1 | F1 A1 Bb1 B1 | C2 E2 D2 B1 | Bb1 Ab1 G1 Gb1 | F1 A1 C2 Db2 | C2 Bb1 G1 Gb1',
        pattern: 'stab',
        tempo: 80,
        caption: 'Every beat 4 is a half step from the next root. Find them in the line before you play it.',
      },
    ],
    drills: [
      'The three bars above, looped, 70 bpm.',
      'Write your own line for Route 2 (II–V–I in F, [[Ch7]]): chord, chord tone, chord tone, approach.',
      'Blues in F: stab on beat 1 of every bar, walk the rest.',
    ],
    ready: 'You can walk a blues with a stab on every bar and the time does not wobble when the chord lands.',
    checks: [
      {
        q: 'In the G7 bar, why is beat 4 a D♭?',
        a: 'It is a half step above C, the next root.',
        why: '[[R1]]: a note a half step from a stable note pulls into it, so the line lands on the new root as if pulled.',
      },
      {
        q: 'Why must the chord be short?',
        a: 'Because the same hand has to leave the shape to walk beats 2 to 4.',
        why: '[[Law5]]: what one hand cannot hold together it plays in sequence. A short stab also sounds intended, like a snare hit, rather than cut off.',
      },
      {
        q: 'In the blues line, bar 11 ends on D♭ and bar 12 starts on C. What other approach would work?',
        a: 'B (a half step below C), or G, the 5th of C (a fifth above, falling).',
        why: 'An approach note only needs to point at the next root: a half step from either side ([[R1]]), or the dominant of it ([[R3]]).',
      },
    ],
    quiz: ['fifthBelow', 'register', 'map'],
  },

  // ───────────── 22 ─────────────
  {
    id: 'harmonics',
    part: 5,
    title: 'Harmonics as a chord layer',
    piano: 'The highest register of the piano, used for bell-like colour above a low root.',
    blocks: [
      { t: 'h', text: 'Bass logic: notes that ring by themselves' },
      {
        t: 'p',
        text: 'Jaco Pastorius made natural harmonics a chord instrument of their own; "Portrait of Tracy" is the piece to hear. A harmonic rings on after you let go, so it frees the hand ([[Law5]]), and it sounds far above the chord band, so it never muddies anything ([[Law2]]). Touch the string lightly, exactly over the fret wire, pluck near the bridge, and lift.',
      },
      { t: 'h', text: 'The logic: a string in equal parts' },
      {
        t: 'p',
        text: 'A light touch does not shorten the string: it stops the string from moving at that one point, so the string can only vibrate in equal parts that have a still point there. Touch the middle and it vibrates in two halves, one octave up. Touch a third of the way and it vibrates in three parts, and so on. That is why harmonics sit only at a few exact places, why the same harmonic exists at more than one fret (fret 7 and fret 19 both cut the string in thirds), and why the notes are always the same family: the open string, its fifth and its major 3rd.',
      },
      {
        t: 'table',
        head: ['The string in', 'Touch over', 'Sounds above the open string', 'On the G string', 'In tune?'],
        rows: [
          ['2 parts', 'fret 12', 'one octave', 'G', 'exact'],
          ['3 parts', 'fret 7 or 19', 'an octave and a 5th', 'D', 'yes'],
          ['4 parts', 'fret 5 or 24', 'two octaves', 'G', 'exact'],
          ['5 parts', 'fret 4, 9 or 16, a hair towards the nut', 'two octaves and a major 3rd', 'B', 'a little flat: sweet in a chord'],
          ['6 parts', 'just past fret 3', 'two octaves and a 5th', 'D', 'yes'],
          ['7 parts', 'between frets 2 and 3, nearer 3', 'two octaves and a ♭7', 'F', 'very flat: an effect, not a chord note'],
          ['8 parts', 'just past fret 2', 'three octaves', 'G', 'exact, and faint'],
        ],
        caption: 'The higher the harmonic, the closer to the nut, the quieter, and the more it needs the bridge pickup and a hard pluck close to the bridge. In the diagrams `h3` means the harmonic just past fret 3.',
      },
      { t: 'harmonics' },
      {
        t: 'shapes',
        title: 'One string is a bugle',
        rows: [
          'G | x-3-x-x-h12 | the root, an octave up',
          'G | x-3-x-x-h7 | the 5th',
          'G | x-3-x-x-h5 | the root, two octaves up',
          'G | x-3-x-x-h4 | the major 3rd',
          'G | x-3-x-x-h3 | the 5th again, higher',
        ],
        caption: 'Hold G at E‑3 and walk the touch down the G string: every harmonic of one string is a note of its major triad. A bugle has no valves and plays tunes with exactly these notes.',
      },
      { t: 'h', text: 'What you have: nine of the twelve notes' },
      {
        t: 'p',
        text: 'Five strings times root, 5th and major 3rd gives these notes: **B, E, A, D, G** (the strings), **F♯** (the 5th of B) and **D♯, G♯, C♯** (the major 3rds of B, E and A; the 3rds of D and G are F♯ and B again). Three notes are missing: **C, F and B♭**. So natural harmonics are rich in the sharp keys (E, A, D, G, B and their minors) and thin in the flat keys. The fix for the flat keys is the artificial harmonic, further down.',
      },
      { t: 'h', text: 'One finger, three strings: the clusters' },
      {
        t: 'p',
        text: 'Across the A, D and G strings one flat finger gives three ready-made clusters: **over fret 7:** E, A, D · **over fret 5:** A, D, G · **over fret 4:** C♯, F♯, B. Each cluster is a stack of fourths ([[Ch16]]), so each one is several chords, depending on the fretted root under it ([[R7]]). The root is held on the B or E string close by:',
      },
      {
        t: 'shapes',
        rows: [
          'C6/9 | x-8-h7-h7-h7 | 3 6 9',
          'Fmaj13 | 6-x-h7-h7-h7 | 7 3 13',
          'B♭maj7♯11 | x-6-h7-h7-h7 | ♯11 7 3',
          'G6/9 | 8-x-h7-h7-h7 | 6 9 5',
          'Dmaj13 | 3-x-h4-h4-h4 | 7 3 13',
          'A6/9 | x-5-h4-h4-h4 | 3 6 9',
          'Gmaj7♯11 | x-3-h4-h4-h4 | ♯11 7 3',
          'B♭maj13 | x-6-h5-h5-h5 | 7 3 13',
        ],
        caption: 'Two hand postures. When the harmonics are on the **nut side** of the root, the index lies flat and light over them and finger 2 frets the root behind it: the posture of a barre chord. When they are on the **bridge side**, fret the root with finger 1 or 2 and lay the little finger flat over the harmonics. One finger cannot press a note and touch a harmonic at the same time. Pluck the root with T and the harmonics with i, m, r. The fret‑4 harmonics are a little flat and quieter.',
      },
      {
        t: 'along',
        title: 'One cluster, three roots',
        bars: 'Fmaj13:6-x-h7-h7-h7 | B♭maj7♯11:x-6-h7-h7-h7 | C6/9:x-8-h7-h7-h7 | C6/9:x-8-h7-h7-h7',
        pattern: 'ballad',
        tempo: 60,
      },
      { t: 'h', text: 'Five strings, one finger' },
      {
        t: 'p',
        text: 'The B and E strings join in. One finger across all five strings is five notes a fourth apart, with no fretted note at all: let a loop or the chord before supply the root, or let the harmonics be the whole sound for a bar.',
      },
      {
        t: 'shapes',
        rows: [
          'D6/9 | h7-h7-h7-h7-h7 | F♯ B E A D: over D, the 3 6 9 5 and the root',
          'Bm11 | h7-h7-h7-h7-h7 | the same five notes over B',
          'Em11 | h5-h5-h5-h5-h5 | B E A D G: the open strings, two octaves up',
          'A7sus | h5-h5-h5-h5-h5 | the same five notes over A',
          'B6/9 | h4-h4-h4-h4-h4 | D♯ G♯ C♯ F♯ B: over B',
          'Emaj13 | h4-h4-h4-h4-h4 | the same five notes over E',
        ],
        caption: 'Roll them slowly from the B string up. The same barre under two roots is two chords ([[R7]]): that is all the harmony a slow ending needs.',
      },
      { t: 'h', text: 'Mixed frets: real chord qualities' },
      {
        t: 'p',
        text: 'A flat finger only gives fourths. Put each harmonic at **its own fret** and you can choose the notes: a major 3rd from fret 4, a root or 5th from 5, 7 and 12. Now a dominant 7th, a minor 7th and a major 9th are possible, with one finger per harmonic. The frets stay within 4 to 7, so the hand does not move.',
      },
      {
        t: 'shapes',
        rows: [
          'A7 | x-5-h4-h7-h5 | 3 R ♭7: a dominant, which no barre gives',
          'Cmaj13 | x-8-h7-h7-h4 | 3 13 7',
          'Fmaj9 | 6-x-h7-h7-h5 | 7 3 9',
          'Gmaj9 | 8-x-h5-h4-h4 | 9 7 3',
          'Cmaj9 | 1-x-h7-h5-h4 | 3 9 7: the root at B‑1 is far from the harmonics',
        ],
        caption: 'When the hand cannot hold the root and reach the harmonics together, play the **harmonics first**: they ring on after the fingers lift, a fretted note does not. Then move the hand and put the root under them ([[Law5]]). In the A7 the harmonic on the A string (C♯) sounds higher than the one on the D string: with harmonics the order of the strings is not the order of the pitches.',
      },
      {
        t: 'shapes',
        title: 'An open string as the root: the fretting hand only touches',
        rows: [
          'Em7 | x-0-h7-h5-h5 | open E, then R ♭7 ♭3',
          'E7sus | x-0-h5-h4-h7 | open E, then 4 9 ♭7',
          'Am11 | x-x-0-h5-h5 | open A, then 11 ♭7',
          'Bm7 | 0-x-h5-h4-h7 | open B, then ♭7 5 ♭3',
        ],
        caption: 'Nothing is pressed down, so everything rings as long as the strings do. This is the sound of the famous solo-bass harmonic pieces: open strings below, harmonics above, in E, A and B.',
      },
      { t: 'h', text: 'A harmonic on top of a fretted chord' },
      {
        t: 'p',
        text: 'A shell leaves strings free ([[Ch6]]). Put one harmonic on a free string and it becomes the **colour on top**, an octave or two above anything you could fret there. When the harmonic is under the same hand, hold the shell and touch it with a free finger. When it is far away, ring the harmonic first and put the shell under it: the harmonic rings on, the shell would not ([[Law5]]).',
      },
      {
        t: 'shapes',
        rows: [
          'F7 | 6-x-6-7-h5 | a 9 on top (G)',
          'F7 | 6-x-6-7-h7 | a 13 on top (D)',
          'F7 | 6-x-6-7-h4 | a ♯11 on top (B)',
          'D7 | 3-x-3-4-h4 | a 13 on top, one fret from the hand',
          'E7 | 5-x-5-6-h5 | a ♯9 on top (G): the "Hendrix chord" with a bell in it',
          'E♭7 | 4-x-4-5-h4 | a ♭13 on top',
          'A7 | 10-x-10-11-h4 | a 9 on top: harmonic first, then the shell',
          'B♭maj7 | 11-x-12-12-h5 | a 13 on top',
        ],
        caption: 'One shell, three colours, only by moving the touch on the G string (the three F7 shapes). The colour depends on the root, so the same harmonic is a 9 over F, a 13 over B♭ and a ♯9 over E.',
      },
      { t: 'h', text: 'Artificial harmonics: any note, any key' },
      {
        t: 'p',
        text: 'A natural harmonic halves an **open** string at fret 12. Fret a note and the middle of the string moves up with it: it is now **twelve frets above your finger**. Touch there with the plucking hand and pluck at the same time, and the fretted note sounds an octave higher, as a harmonic. That works for every note on the neck, so C, F and B♭ are no longer missing and harmonic chords follow you into every key.',
      },
      {
        t: 'steps',
        items: [
          'Fret the note as usual and keep it down.',
          'Lay the tip of the plucking hand\'s **index finger** on the same string, exactly over the fret wire twelve frets higher. Do not press.',
          'Pluck the string with the **thumb** (or the ring finger) of the same hand, a little behind the index finger, and lift the index finger at once.',
          'For a second way, touch with the side of the thumb and pluck with the index finger just behind it. Use the one that gives you the clearer bell.',
          'Seven frets above the fretted note gives an octave and a 5th; five frets above gives two octaves. They are quieter; twelve is the one to learn first.',
        ],
      },
      {
        t: 'shapes',
        rows: [
          'Cmaj7 | x-8-x-9-a9 | the shell, with only the top note as a harmonic',
          'Cmaj7 | x-8-x-a9-a9 | root fretted, 7th and 3rd as harmonics',
          'Cmaj9 | x-8-a7-a9-a7 | root, then 3 7 9 all as harmonics',
          'C | x-a8-a7-a5-a5 | a whole triad in harmonics: roll it',
        ],
        caption: 'In the diagrams an artificial harmonic is a diamond **in the fret space** (where the finger presses) marked +12; a natural harmonic is a diamond **over the fret wire** (where the finger touches). The plucking hand touches one string at a time, so these chords are always rolled.',
      },
      {
        t: 'shapes',
        title: 'II–V–I in C, upper notes as artificial harmonics',
        seq: true,
        rows: ['Dm7 | x-10-x-a10-a10 | root, then ♭7 and ♭3 as bells', 'G7 | 8-x-x-a9-a10 | root, then 3 and ♭7', 'Cmaj7 | x-8-x-a9-a9 | root, then 7 and 3'],
        caption: 'The fretting hand plays the shells you already know ([[Ch7]]); only the plucking hand is new. Because nothing depends on open strings, this moves to all twelve keys: it is the practice at the end of this chapter.',
      },
      {
        t: 'tip',
        title: 'The harp',
        text: 'Hold a chord shape and alternate: a **fretted** note on one string, an **artificial harmonic** on the next, a fretted note, a harmonic. The harmonics land between the fretted notes in pitch, so a four-note shape becomes a run of neighbouring notes that all ring into each other, like a harp. Start with {Cmaj9:x-8-7-9-7}: pluck C, then E as a harmonic, B fretted, D as a harmonic.',
      },
      { t: 'h', text: 'Other ways to make and bend a harmonic' },
      {
        t: 'list',
        items: [
          '**Tapped harmonics.** Fret a note, then tap the string quickly onto the fret wire twelve frets higher with a plucking-hand finger and bounce off. The tap both touches and plucks. Tap across a held shape for a whole chord of bells.',
          '**Fretted note and its own harmonic.** Pluck a fretted note normally, then touch it twelve frets up while it rings: the note jumps an octave without a new attack.',
          '**Bend behind the nut.** Ring a natural harmonic, then press the same string between the nut and the tuner. The pitch rises up to about a half step and falls back when you let go. A natural harmonic has no finger on it, so this is the only way to bend one.',
          '**Vibrato on a chord of harmonics.** Ring a cluster, then push the neck gently forward and back with the fretting hand on the upper horn. Small movements only.',
          '**Harmonic over a walking line.** Ring a cluster on the first beat and walk under it on the low strings: the cluster keeps sounding for the whole bar and both hands are free ([[Ch21]]).',
          '**Tune with them.** The fret‑5 harmonic of a string and the fret‑7 harmonic of the next higher string are the same note (E string fret 5 = A string fret 7 = E). Play both and remove the slow beating between them.',
        ],
      },
      { t: 'h', text: 'A tune of harmonics' },
      {
        t: 'along',
        title: 'Four bars, harmonics only above the roots',
        bars: 'G6/9:8-x-h7-h7-h7 | Gmaj9:8-x-h5-h4-h4 | Fmaj9:6-x-h7-h7-h5 | E7sus:x-0-h5-h4-h7',
        pattern: 'ballad',
        tempo: 56,
        caption: 'One root held for two bars while the cluster changes, then two new roots. Let every bar ring into the next.',
      },
    ],
    drills: [
      'Get each cluster to ring cleanly on its own. Bridge pickup, pluck hard, close to the bridge.',
      'One string at a time: walk the touch from fret 12 to 7, 5, 4 and just past 3, and name the note each time (the bugle).',
      'The eight cluster chords, root then harmonics, letting everything ring.',
      'Fmaj13 → B♭maj7♯11 → C6/9: one cluster (fret 7), three roots. Then find your own.',
      'Mixed frets: A7, Cmaj13, Fmaj9, Gmaj9. One finger per harmonic; say the degree of each one as you touch it.',
      'One shell, three colours: F7 with the harmonic over fret 5, 7 and 4 of the G string. Name the colour before you touch.',
      'Artificial harmonics: one fretted note, twelve clean bells in a row. Then the top note of a shell, then both upper notes.',
      'The harp on {Cmaj9:x-8-7-9-7}: fretted, harmonic, fretted, harmonic, up and down, slowly.',
    ],
    ready: 'You can end a tune on a harmonic chord, on purpose, in a sharp key with natural harmonics and in a flat key with artificial ones.',
    checks: [
      {
        q: 'The fret‑5 cluster over an F root: which degrees?',
        a: '3, 6, 9: an F6/9, for example {F6/9:x-1-h5-h5-h5}.',
        why: 'Over fret 5 the strings sound two octaves up: A, D, G. Against F, A is the 3, D the 6, G the 9.',
      },
      {
        q: 'Why do the fret‑7 harmonics over F♯ sound "altered"?',
        a: 'Over F♯ the notes E, A, D are ♭7, ♯9 and ♭13, the altered colours of a dominant.',
        why: 'Same cluster, new root ([[R7]]): renaming the notes against F♯ gives two altered tensions over a ♭7.',
      },
      {
        q: 'Which three notes can you not get as a natural harmonic, and why?',
        a: 'C, F and B♭.',
        why: 'Every harmonic of a string is its root, its 5th or its major 3rd. The five strings give B, E, A, D, G, then F♯, then D♯, G♯, C♯. Nothing lands on C, F or B♭; those need an artificial harmonic.',
      },
      {
        q: 'You want the 3rd of an A7 as a natural harmonic. Where is it?',
        a: 'Over fret 4 (or 9, or 16) of the A string: C♯.',
        why: 'A major 3rd comes only from a string in five parts, and the string must be the chord\'s root string: the 3rd of A is on the A string. That is the first note of {A7:x-5-h4-h7-h5}.',
      },
      {
        q: 'You fret B♭ at G‑3. Where does the plucking hand touch for an artificial harmonic, and what sounds?',
        a: 'Over fret 15 of the G string; B♭, one octave above the fretted note.',
        why: 'The fretted note is the new end of the string, so its middle is twelve frets higher: 3 + 12 = 15. Half a string sounds an octave up.',
      },
      {
        q: 'Why is the harmonic between frets 2 and 3 not used in chords?',
        a: 'It is the string in seven parts: a ♭7 about a third of a half step flat.',
        why: 'The first six parts give only octaves, 5ths and one major 3rd, which are in tune or close. The seventh part is the first one that does not fit the tuning of the fretted notes, so it clashes with a fretted ♭7.',
      },
    ],
    quiz: ['harmonic', 'quartal', 'register'],
    tone: 'Add **Exciter** (Treble 60) in front of the KEYS patch, or use GLASS ([[Ch24]]). For artificial and tapped harmonics a little compression helps: they are much quieter than fretted notes.',
  },

  // ───────────── 23 ─────────────
  {
    id: 'workbook',
    part: 5,
    title: 'Progression workbook',
    piano: 'Pianists learn voicings on real progressions, not in isolation. These are the long-term practice material.',
    blocks: [
      {
        t: 'p',
        text: 'Each progression is first written in plain shells. Your job is to re-voice it with every layer you have learned: pairs, grand chords, rootless, colours, fourths, upper structures, melody on top. The [[GEN]] can voice any of them in any key and any layer for you to compare.',
      },
      { t: 'h', text: '1. Jazz blues in F' },
      {
        t: 'shapes',
        rows: ['F7 | 6-x-x-7-8', 'B♭7 | x-6-x-6-7', 'Cm7 | x-8-x-8-8', 'B°7 | x-7-x-6-7', 'D7 | x-10-x-10-11', 'Gm7 | x-x-10-8-10', 'C7 | x-8-x-8-9'],
        caption: 'Bars: F7 | B♭7 | F7 | Cm7 F7 | B♭7 | B°7 | F7 | D7 | Gm7 | C7 | F7 D7 | Gm7 C7',
      },
      {
        t: 'along',
        title: 'Jazz blues in F',
        bars: 'F7:6-x-x-7-8 | B♭7:x-6-x-6-7 | F7:6-x-x-7-8 | Cm7:x-8-x-8-8 F7:6-x-x-7-8 | B♭7:x-6-x-6-7 | B°7:x-7-x-6-7 | F7:6-x-x-7-8 | D7:x-10-x-10-11 | Gm7:x-x-10-8-10 | C7:x-8-x-8-9 | F7:6-x-x-7-8 D7:x-10-x-10-11 | Gm7:x-x-10-8-10 C7:x-8-x-8-9',
        pattern: 'split',
        tempo: 120,
      },
      { t: 'h', text: '2. Minor blues in C' },
      {
        t: 'along',
        title: 'Minor blues in C',
        bars: 'Cm7:x-8-x-8-8 | Fm7:x-x-8-6-8 | Cm7:x-8-x-8-8 | Cm7:x-8-x-8-8 | Fm7:x-x-8-6-8 | Fm7:x-x-8-6-8 | Cm7:x-8-x-8-8 | Cm7:x-8-x-8-8 | A♭7:x-x-11-10-11 | G7:x-x-10-9-10 | Cm7:x-8-x-8-8 | G7:x-x-10-9-10',
        pattern: 'charleston',
        tempo: 110,
        caption: 'Shapes: {Cm7:x-8-x-8-8}, {Fm7:x-x-8-6-8}, {A♭7:x-x-11-10-11}, {G7:x-x-10-9-10}. A♭7 to G7 is a tritone sub falling a half step ([[HL9]]).',
      },
      { t: 'h', text: '3. Four dominants in a row (the bridge of rhythm changes, in B♭)' },
      {
        t: 'shapes',
        seq: true,
        rows: ['D7 | x-10-x-10-11', 'G7 | x-x-10-9-10', 'C7 | x-8-x-8-9', 'F7 | x-x-8-7-8'],
        caption: 'Two bars each. Watch the tritone on D and G slide down a fret per chord ([[Ch5]], [[HL8]]).',
      },
      {
        t: 'along',
        title: 'Rhythm changes bridge',
        bars: 'D7:x-10-x-10-11 | D7:x-10-x-10-11 | G7:x-x-10-9-10 | G7:x-x-10-9-10 | C7:x-8-x-8-9 | C7:x-8-x-8-9 | F7:x-x-8-7-8 | F7:x-x-8-7-8',
        pattern: 'four',
        tempo: 140,
      },
      { t: 'h', text: '4. II – ♭II – I (tritone substitution)' },
      {
        t: 'shapes',
        seq: true,
        rows: ['Dm7 | x-10-x-10-10', 'D♭7 | x-9-x-9-10', 'Cmaj7 | x-8-x-9-9'],
        caption: 'The pair on D and G is the same as for G7. Only the root changed ([[R7]]).',
      },
      {
        t: 'along',
        title: 'II – ♭II – I in C',
        bars: 'Dm7:x-10-x-10-10 | D♭7:x-9-x-9-10 | Cmaj7:x-8-x-9-9 | Cmaj7:x-8-x-9-9',
        pattern: 'split',
        tempo: 100,
      },
      { t: 'h', text: '5. The backdoor: IVm7 – ♭VII7 – I' },
      {
        t: 'shapes',
        seq: true,
        rows: ['Fm7 | x-13-x-13-13', 'B♭7 | x-x-13-12-13', 'Cmaj7 | x-x-15-14-16'],
        caption: 'Both chords are borrowed from C minor ([[HL12]]); B♭7 reaches C from a whole step below instead of a fifth above.',
      },
      {
        t: 'along',
        title: 'The backdoor',
        bars: 'Fm7:x-13-x-13-13 | B♭7:x-x-13-12-13 | Cmaj7:x-x-15-14-16 | Cmaj7:x-x-15-14-16',
        pattern: 'ballad',
        tempo: 72,
      },
      { t: 'h', text: '6. Seven chords falling in fifths through a key' },
      {
        t: 'shapes',
        seq: true,
        rows: ['Cm7 | 13-x-x-13-15', 'F7 | x-13-x-13-14', 'B♭maj7 | 11-x-x-12-14', 'E♭maj7 | x-11-x-12-12', 'Am7♭5 | 10-x-x-10-12', 'D7 | x-10-x-10-11', 'Gm6 | 8-x-x-8-9'],
        caption: 'This sequence (in B♭ major and G minor) is the skeleton of many standards. It alternates form C and form A all the way down and never leaves frets 8 to 15. Am7♭5 is played as its plain shell (R ♭3 ♭7): the ♭5 is left out, as in [[Ch8]], and the key supplies it.',
      },
      {
        t: 'along',
        title: 'Falling fifths',
        bars: 'Cm7:13-x-x-13-15 | F7:x-13-x-13-14 | B♭maj7:11-x-x-12-14 | E♭maj7:x-11-x-12-12 | Am7♭5:10-x-x-10-12 | D7:x-10-x-10-11 | Gm6:8-x-x-8-9 | Gm6:8-x-x-8-9',
        pattern: 'bossa',
        tempo: 120,
      },
      { t: 'h', text: '7. Key centres a major third apart' },
      {
        t: 'shapes',
        seq: true,
        rows: ['Cmaj7 | x-8-x-9-9', 'E♭7 | x-x-6-5-6', 'A♭maj7 | x-4-x-5-5', 'B7 | x-7-x-7-8', 'Emaj7 | x-x-7-6-8', 'G7 | x-x-10-9-10', 'Cmaj7 | x-8-x-9-9'],
        caption: 'The "Coltrane" cycle from the end of the harmony course ([[HL19]]): C, A♭ and E, each reached by its own dominant. The low shapes sit near the clear-zone floor; roll them.',
      },
      {
        t: 'along',
        title: 'Major-third cycle',
        bars: 'Cmaj7:x-8-x-9-9 E♭7:x-x-6-5-6 | A♭maj7:x-4-x-5-5 B7:x-7-x-7-8 | Emaj7:x-x-7-6-8 G7:x-x-10-9-10 | Cmaj7:x-8-x-9-9',
        pattern: 'split',
        tempo: 100,
      },
      { t: 'h', text: '8. One chord: a modal vamp' },
      {
        t: 'p',
        text: 'Loop a D. Eight bars of D Dorian in fourths ([[Ch16]]), eight bars a half step up on E♭ Dorian (every shape one fret higher), and back.',
      },
      {
        t: 'along',
        title: 'D Dorian, then E♭ Dorian',
        bars: 'Dm11:x-x-10-10-10 | Dm13:x-x-8-9-9 | Dm11:x-x-12-12-12 | Dm11:x-x-10-10-10 | E♭m11:x-x-11-11-11 | E♭m13:x-x-9-10-10 | E♭m11:x-x-13-13-13 | E♭m11:x-x-11-11-11',
        pattern: 'charleston',
        tempo: 130,
      },
      { t: 'h', text: 'How to work on a progression' },
      {
        t: 'steps',
        items: [
          'Roots only, with the thumb, saying the chord names.',
          'Pairs over a looped root line ([[Ch5]]).',
          'Shells, split texture ([[Ch6]]).',
          'Colours: choose a top line first, then find the chords under it ([[Ch11]]–[[Ch14]]).',
          'A comping pattern from [[Ch20]].',
          'Walk it with stabs ([[Ch21]]).',
          'Record it, listen the next day, and write down one thing to fix.',
        ],
      },
    ],
    drills: [
      'Pick one progression a week. Work through the seven steps above, one step a day.',
      'Re-voice progression 1 with rootless shapes ([[Ch12]]) over the looper.',
      'Play progression 4 and 3 back to back: the same tritone pairs, two different jobs.',
    ],
    ready: 'You can play two tunes and a blues in your own arrangements, each with at least three layers.',
    checks: [
      {
        q: 'In the rhythm-changes bridge, how far does the upper pair move per chord, and why?',
        a: 'One fret down each time.',
        why: 'Each 3rd falls a half step into the next ♭7 and each ♭7 into the next 3rd ([[R1]]); the roots fall a fifth ([[R3]]), but the guide tones only slide.',
      },
      {
        q: 'In II – ♭II – I, why do {D♭7:x-9-x-9-10} and {G7:x-x-10-9-10} share their upper pair?',
        a: 'Both have B (C♭) and F as their 3rd and ♭7.',
        why: 'Two dominants a tritone apart share their tritone, so they do the same job ([[R7]]).',
      },
      {
        q: 'Why does the falling-fifths sequence (6) alternate forms C and A?',
        a: 'Each root falls a fifth, which on bass is the next string up, same fret, or the next string down, two frets back; changing string changes the form.',
        why: '[[Law4]]: the form follows the root\'s string so the upper notes stay almost still ([[Ch7]]).',
      },
    ],
    quiz: ['pair', 'form', 'nameShape', 'colour'],
  },

  // ───────────── 24 ─────────────
  {
    id: 'tone-lab',
    part: 6,
    title: 'Bass and B3n settings for chords and melodies',
    piano: 'A pianist chooses the instrument and the pedal; a bassist chooses the pickup, the plucking spot and the effects. Tone is part of voicing.',
    blocks: [
      {
        t: 'p',
        text: '[[Law2]] says low notes need room. A tone with less low end and more definition lowers every floor in the clear-zone table ([[Ch1]]), which means more shapes become usable.',
      },
      {
        t: 'tip',
        title: 'About the numbers',
        text: 'Effect names and parameter ranges below come from Zoom\'s official B3n effect list. The values are reasoned starting points, not settings anyone has auditioned on your bass, strings, hands or speakers. Treat each number as "start here, then turn the knob both ways and keep what sounds better".',
      },
      { t: 'h', text: 'Five rules before any patch' },
      {
        t: 'steps',
        items: [
          '**Cut lows before anything else.** A high-pass around 80 Hz and a small cut at 120 Hz does more for chords than any effect.',
          '**Compress first.** Three plucked notes are never equally loud. A compressor at the start of the chain evens them and lengthens the sustain.',
          '**Modulate only the highs.** Chorus on low notes makes the pitch wobble. BassStCho has a LoCut control for exactly this.',
          '**Reverb is your sustain pedal.** Tail ON, so a chord keeps ringing after you leave it for the next shape.',
          '**Match volumes.** Set each patch\'s last VOL so switching patches does not jump in level.',
        ],
      },
      {
        t: 'p',
        text: 'The B3n chains up to seven effects in a patch. If it runs out of processing power with a long chain, remove the amp model first; none of these patches needs one.',
      },
      { t: 'h', text: 'On the bass' },
      {
        t: 'table',
        head: ['For', 'Pickups', 'Plucking position', 'Preamp'],
        rows: [
          ['Chords', 'Mostly bridge', 'Near the bridge', 'Bass flat or slightly cut, mids up a little'],
          ['Chord melody', 'Bridge, a little neck blended in', 'Between the pickups', 'Flat'],
          ['Singing melody', 'Both, or neck-heavy', 'Over the neck pickup, or at the end of the fingerboard', 'A touch of mids'],
        ],
      },
      { t: 'h', text: 'Patch 1: KEYS (everyday chords)' },
      {
        t: 'table',
        head: ['#', 'Effect', 'Start with', 'Why'],
        rows: [
          ['1', '**BlackOpt**', 'Comp 40, Lo 50, Hi 60', 'Evens out the three notes and makes them last'],
          ['2', '**Low EQ**', 'Type HPF, FREQ 80', 'Removes rumble under the chord'],
          ['3', '**BassGEQ**', '50: −4, 120: −3, 800: +3, 4.5k: +3, 10k: +2', 'Less boom, more definition'],
          ['4', '**BassStCho**', 'Depth 40, Rate 15, LoCut 200, Mix 30', 'Width, only on the upper part of the sound'],
          ['5', '**Hall**', 'PreD 20, Decay 12, Mix 20, Tail ON', 'The "sustain pedal"'],
        ],
        caption: 'Variations: electric-piano flavour, add **Tremolo** before the reverb (Wave TRI, Depth 30, Rate 35). For altered dominants ([[Ch13]]): chorus Mix down to 15–20. For pairs ([[Ch5]]): chorus Mix up to 40.',
      },
      { t: 'h', text: 'Patch 2: GLASS (chord melody, harmonics, ballads)' },
      {
        t: 'table',
        head: ['#', 'Effect', 'Start with'],
        rows: [
          ['1', '**OptComp**', 'Drive 5, Lo 40, Hi 60'],
          ['2', '**Exciter**', 'Bass 20, Treble 60'],
          ['3', '**CoronaTri**', 'Depth 35, Speed 25, Tone 60, Mix 30'],
          ['4', '**Delay**', 'Time 380 (or tap the tempo), F.B 20, Mix 15, Tail ON'],
          ['5', '**Plate**', 'PreD 30, Decay 40, Mix 25, Tail ON'],
        ],
        caption: 'The exciter brings out the top note, which is the melody. The quiet delay fills the gaps while your hand shifts ([[Ch10]]).',
      },
      { t: 'h', text: 'Patch 3: PAD (fourths, held chords, intros)' },
      {
        t: 'table',
        head: ['#', 'Effect', 'Start with'],
        rows: [
          ['1', '**SlowATTCK**', 'Time 20, Curve 5, Tone 60'],
          ['2', '**Ba Detune**', 'Cent 12, PreD 10, Tone 6, Mix 50'],
          ['3', '**HD Hall**', 'PreD 40, Decay 70, Mix 45, Tail ON'],
        ],
        caption: 'SlowATTCK removes the pluck, so a chord swells in like strings or a synth pad. Roll the chord slowly and it blooms note by note. This is the patch for [[Ch16]].',
      },
      { t: 'h', text: 'Patch 4: SINGER (melodies)' },
      {
        t: 'table',
        head: ['#', 'Effect', 'Start with'],
        rows: [
          ['1', '**BlackOpt**', 'Comp 50, Lo 50, Hi 50'],
          ['2', '**Defret**', 'Sense 15, Color 5, Tone 30'],
          ['3', '**BassPEQ**', 'FREQ 800, Q 1.0, Gain +4'],
          ['4', '**AnalogDly**', 'Time 350, F.B 25, Mix 20, Tail ON'],
          ['5', '**Hall**', 'PreD 30, Decay 14, Mix 22, Tail ON'],
        ],
        caption: 'Defret softens the attack and adds the "mwah" of a fretless, the voice Jaco used for melodies. The mid boost at 800 Hz is where a bass melody speaks. Turn Defret off and you have a clean lead tone; try **EP Stomp** (Gain 30) in its place for a little warmth.',
      },
      { t: 'h', text: 'The third hand: looper and Hold DLY' },
      {
        t: 'list',
        items: [
          '**Looper.** Record the roots, or a bass line, then comp over it. This is the most valuable practice tool in the whole method: it lets you hear rootless voicings, fourths and upper structures in context ([[Ch12]] to [[Ch17]]). The looper and the built-in rhythm patterns follow the same tap tempo, so you can loop in time against a drum pattern. The play-along blocks in this notebook are the same idea: switch the roots on, your part off.',
          '**Hold DLY.** A delay that the control switch can hold. Set Time to about one beat, F.B high, Mix around 50, play a chord, hold it with the switch, and play a melody over the top. Its exact behaviour depends on the LATCH/UnLATCH setting; spend ten minutes finding out what each does on your unit before relying on it.',
        ],
      },
      { t: 'h', text: 'Experiments' },
      {
        t: 'table',
        head: ['Idea', 'Effect', 'What to try', 'Watch out for'],
        rows: [
          ['Octave shimmer on pairs and 10ths', '**PitchSHFT**', 'Shift 12, Tone 7, BAL 25–35', 'Use PitchSHFT, not BaMnPitch: Zoom describes the second as made for single notes. Expect some wobble on three-note chords.'],
          ['Harmonized melody', '**HPS**', 'Key = the key of the tune, Scale 3 or 6, Mix 40', 'Single notes only. It adds the scale\'s own 3rd or 6th, so your melody comes out in diatonic double stops.'],
          ['Synth pad under a loop', '**Z-Syn** or **StdSyn**', 'Low BAL, blended with the clean sound', 'Synths track single notes; use them for the looped root, not the chord.'],
          ['Sub-bass for the looped root', '**Ba Octave**', 'Oct 50, Dry 100', 'Never on chords: an octave below every note is [[Law2]] in reverse.'],
          ['Stereo width', '**St Ba GEQ**, **BassStCho**', 'Run the B3n in stereo to two speakers or headphones', 'In mono the width disappears.'],
        ],
        caption: 'These are less predictable. Try them and keep what you like.',
      },
    ],
    drills: [
      '**Build your own.** For each new chapter, ask three questions and adjust one knob for each: Is the bottom clear? Does the top note sing? Does the chord last as long as I need? Save the result under the chapter\'s name.',
      'Mud test with tone: play the major 3rd drill of [[Ch1]] with the neck pickup, then with the KEYS patch. Note how many frets lower the 3rd stays clear.',
    ],
    ready: 'You have KEYS, GLASS, PAD and SINGER saved, level-matched, and you know which chapter each one is for.',
    checks: [
      {
        q: 'Why cut lows before anything else?',
        a: 'Low end is what turns close intervals into mud; removing it lowers every clear-zone floor.',
        why: '[[Law2]]: low wants wide. Less boom means a 3rd or a 7th can sit lower and still be heard as two notes.',
      },
      {
        q: 'Why does BassStCho get a LoCut of 200?',
        a: 'So the chorus only touches the upper notes and the root stays steady.',
        why: 'Rule 3 of the patch rules: chorus on low notes makes the pitch wobble, and the root is what tells the ear where the chord is.',
      },
      {
        q: 'Why never put Ba Octave on chords?',
        a: 'It adds an octave below every note, so the upper notes of the chord land in the bass band.',
        why: 'That is [[Law2]] in reverse: close intervals dropped an octave fall below their floor and turn to rumble.',
      },
    ],
    quiz: ['mud', 'register'],
  },
]
