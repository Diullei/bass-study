import type { Chapter } from './types'

/** Chapters 1–12: setup, two notes, three notes, and the first colours. */
export const CHAPTERS_1: Chapter[] = [
  // ───────────────────────────── Part 0: Setup ─────────────────────────────
  {
    id: "map",
    part: 0,
    title: "The map: shape arithmetic and the clear zones",
    piano:
      "On a keyboard every interval looks different in every key: a major 3rd from C is white–white, from D♭ it is black–white. Pianists learn twelve of everything.",
    blocks: [
      { t: "h", text: "Bass logic: one of everything ([[Law1]])" },
      {
        t: "p",
        text: "On a bass tuned in fourths you learn **one** of everything. An interval is a number of semitones, and the neck gives you exactly two ways to add semitones: go up a string (+5) or go up a fret (+1). Every interval is some mix of the two.",
      },
      { t: "big", text: "interval = 5 × strings + frets" },
      {
        t: "p",
        text: "Rebuild any shape with this. A major 3rd is 4 semitones: 5 − 1, so *one string up, one fret back*. A minor 7th is 10: 5 + 5, so *two strings up, same fret*. A major 10th is 16: 15 + 1, so *three strings up, one fret forward*. You never need to remember where a note is; you can always work it out in a second.",
      },
      { t: "h", text: "The whole map, worked out from a root" },
      {
        t: "p",
        text: "Read it as “from my root, where is each degree?” Every cell is computed from the formula: click one to hear the root and that note.",
      },
      { t: "map" },
      { t: "p", text: "Three things to notice, because the whole method leans on them:" },
      {
        t: "steps",
        items: [
          "**Same fret, next string = a fourth.** A finger laid flat across strings plays stacked fourths. [[Ch16]] is built on this.",
          "**Two strings up, same fret = ♭7. One fret forward = major 7.** The 7th is always right there, two strings above the root.",
          "**Three strings up, same fret = minor 10th. One fret forward = major 10th.** The 3rd is always three strings above the root, an octave higher, where it sounds clear.",
        ],
      },
      {
        t: "p",
        text: "Row 4 exists only because you have five strings. It is what [[Ch11]] uses to add colour on top. Notice also that a guitar would break this map between its G and B strings; a bass in fourths has no exception anywhere, so one shape works on every string set and in every key.",
      },
      { t: "h", text: "The clear zones ([[Law2]])" },
      {
        t: "p",
        text: "Low notes have long, slow waves. Two of them close together beat against each other and blur into a rumble, which is why a pianist never plays a close 3rd at the bottom of the keyboard. Arrangers keep a list of the lowest pitch at which each interval still sounds clean (the *low interval limits*). Converted to fret positions for the **lower** note of the pair:",
      },
      { t: "zones" },
      {
        t: "p",
        text: "The pattern behind the table: the smaller the interval, the higher it must sit. A tritone, a 10th or anything wider than an octave is clear anywhere, which is why so many shapes in this method put a wide gap at the bottom.",
      },
      {
        t: "tip",
        title: "Warnings, not walls",
        text: "These limits were written for sustained, evenly balanced chords in a band. Two things bend them on a solo bass: a low **root** under a 7th is more forgiving than two inner notes at the same height, and a bright tone ([[Ch3]]) moves every floor down a little. Your ear makes the final call.",
      },
      { t: "h", text: "Registers are diagonal, not fret ranges" },
      {
        t: "p",
        text: "A piano has registers you can point at: bass on the left, chords around the middle, melody on the right. A bass has the same three registers, but they are **not** fret ranges. Fret 8 on the B string is a deep bass note; fret 8 on the G string is in the middle of the chord register. A register is a range of *pitch*, and by [[Law1]] the same pitch sits five frets higher on each lower string. So each register is a **diagonal band** across the neck.",
      },
      { t: "registers" },
      {
        t: "p",
        text: "The bands overlap a little at the edges, as they do on a piano. The chord band is where the clear-zone table lets 3rds and 7ths sit; the melody band is where 2nds become clean too. Three consequences shape every voicing in this method:",
      },
      {
        t: "steps",
        items: [
          "**One hand position crosses all the registers.** With your hand around frets 7 to 12, the B and E strings under it are in the bass register, the D string is in the chord register, and the G string is at the top of the chord register, touching the melody register. That is why a chord on bass is nearly vertical under the hand: root on a thick string, guide tones on D and G, same few frets. You reach *across the strings*, not sideways.",
          "**To change register, change string before you change fret.** If a 3rd is too low, the fix is rarely “move up the neck”. It is “put that note on a higher string”. [[Ch9]] turns this into a technique.",
          "**The same pitch has a different colour on each string.** E3 on the G string (fret 9) is bright and defined. The same E3 on the D string (fret 14) is rounder. On the A string (fret 19) it is thick and short-lived. For the upper notes of a chord, take the **thinnest string that offers the note**. For a warm single-note melody, the opposite choice is often nicer.",
        ],
      },
      {
        t: "p",
        text: "When this method says a shape “sits well” it means every note is inside its own band: the root in the bass band, the 3rd and 7th in the chord band, the top note at the upper edge of it.",
      },
      {
        t: "shapes",
        title: "Same two notes, two strings: hear the colour change",
        rows: ["C | x-x-x-10-9 | C3 + E3: D string and G string, bright", "C | x-x-15-14-x | the same C3 + E3 on A and D: rounder, thicker"],
        caption: "Both shapes play exactly the same pitches. Only the strings changed. This is Drill 4.",
      },
    ],
    drills: [
      "**Rebuild the map.** Without looking, write the row for “1 string up”. Check it with arithmetic, then on the bass from C (E string, fret 8). Next day do “2 strings up”, and so on.",
      "**Name and play.** From C at E‑8, play and say: 3, ♭7, 7, 10th, ♭3 an octave up, 9. Then from F at A‑8, then G at B‑8.",
      "**Mud test.** Play a major 3rd (one string up, one fret back) starting on E‑3, E‑8, A‑8, A‑14, D‑9. Notice where it starts to sound like a chord and not a rumble. You have just found your own floor for 3rds.",
      "**Same note, three colours.** Play E3 at G‑9, D‑14 and A‑19. Then play the pair C3 + E3 as D‑10 with G‑9, and as A‑15 with D‑14. Same notes, different chord. Decide which you would use under a melody.",
      "**Trace a band.** Play F2 on every string that has it (D‑3, A‑8, E‑13, B‑18). That diagonal is the floor of the chord register.",
    ],
    ready: "You can find any degree from any root in under three seconds, by reasoning, without the table.",
    checks: [
      {
        q: "Where is the 13 from a root on the B string?",
        a: "Four strings up, one fret forward: on the G string, one fret above the root's fret.",
        why: "The 13 is an octave plus a major 6th: 12 + 9 = 21 semitones. By [[Law1]], 21 = 5 × 4 + 1: four strings up, one fret forward.",
      },
      {
        q: "Which interval is “two strings up, one fret back”?",
        a: "A major 6th (the 6, or 13).",
        why: "5 × 2 − 1 = 9 semitones, and 9 semitones is a major 6th. Same fret would be 10 (♭7), so one fret back is one semitone less.",
      },
      {
        q: "Why is a 3rd fine at D‑9 and muddy at E‑3?",
        a: "Register: D‑9 is B2, right at the floor for 3rds; E‑3 is G1, more than an octave below it.",
        why: "[[Law2]]: the lower a close interval sits, the more it blurs. The floor for a major 3rd is B2. D‑9 = 38 + 9 = B2, on the floor; E‑3 = 28 + 3 = G1, far under it.",
      },
      {
        q: "Fret 10 on the E string and fret 10 on the G string: which registers?",
        a: "E‑10 is D2, bass register. G‑10 is F3, upper chord register, inside the melody band too.",
        why: "Registers are pitch, not frets. E‑10 = 28 + 10 = 38 (D2), below F2, so bass. G‑10 = 43 + 10 = 53 (F3): above F2 and above E3, so the top of the chord band, where the melody band starts.",
      },
    ],
    quiz: ["map", "where", "register", "mud"],
  },
  {
    id: "plucking-hand",
    part: 0,
    title: "The plucking hand is the pianist",
    piano:
      "Left hand plays the bottom, right hand plays the top, and they do not have to play at the same time. A stride pianist's left hand jumps between a low note and a chord in the middle; the right hand plays above both.",
    blocks: [
      { t: "h", text: "Bass logic ([[Law5]])" },
      { t: "p", text: "Your plucking hand already has that split built in." },
      {
        t: "list",
        items: [
          "**T (thumb)** plucks the lowest note. It is the pianist's left hand.",
          "**i, m, r** pluck the upper notes, one finger per string. They are the right hand.",
        ],
      },
      {
        t: "p",
        text: "Rest the thumb on the string it is about to play, not on the pickup. For three notes on B/E + D + G: T on the root, i on the D string, m on the G string. For four notes: T, i, m, r. One finger per string means every note is plucked with the same motion, so the chord comes out even.",
      },
      { t: "h", text: "Four textures from one held shape" },
      {
        t: "p",
        text: "Hold {Cmaj7:x-8-x-9-9} (a C major 7 shell; [[Ch6]] explains it). The fretting hand does nothing new: the four textures come only from the plucking hand. Press each one to hear it, and watch the grid: the thumb row is the pianist's left hand, the fingers row the right hand.",
      },
      { t: "patterns", chord: "Cmaj7", shape: "x-8-x-9-9", ids: ["block", "roll", "split", "broken"] },
      {
        t: "p",
        text: "**Split** is the one to notice: the thumb on the beat, the fingers a beat later. It is [[Law5]] in its simplest form, and it will rescue every hard chord change in this method ([[Ch10]]).",
      },
      { t: "h", text: "Muting" },
      {
        t: "p",
        text: "A chord is as clean as its silent strings. The fretting finger that holds the root leans back slightly so its underside touches the skipped string. Unused low strings are damped by the side of the plucking thumb or the heel of the hand. Check every new shape by plucking *all five* strings slowly: you should hear only the notes you meant.",
      },
      { t: "h", text: "Pressure" },
      {
        t: "p",
        text: "Use the weight of the arm more than the squeeze of the thumb behind the neck. Barre with the flat pad, not the tip. If a shape hurts, stop: pain here comes from squeezing or from playing it too low on the neck, and both are fixable by moving the shape up or thinning it to two notes.",
      },
    ],
    drills: [
      "Hold {Cmaj7:x-8-x-9-9}. **Block**, four times per bar, at 60 bpm. Listen for three equal notes.",
      "**Roll**, one per bar. Let it ring the whole bar.",
      "**Split:** T on 1 and 3, fingers on 2 and 4.",
      "**Broken:** T‑i‑m‑i in eighth notes.",
      "**The five-string check:** pluck B, E, A, D, G one at a time. Only three should sound.",
    ],
    ready: "All four textures sound even, and the five-string check is clean without thinking about it.",
    checks: [
      {
        q: "In the split texture, which of the pianist's hands is your thumb?",
        a: "The left hand: it plays the bottom note on the beat.",
        why: "The thumb always takes the lowest string, which is the root, the pianist's left-hand job. The fingers take the upper notes a beat later, the right hand's job. That split in time is [[Law5]].",
      },
      {
        q: "You pluck all five strings while holding {Cmaj7:x-8-x-9-9} and the open A rings. Which finger fixes it?",
        a: "The finger on the root (E‑8): it leans back so its underside touches the A string.",
        why: "The A string is the one skipped *between* the root and the upper pair, so neither hand can reach it except the root finger lying right next to it. Unused low strings (B) are damped by the plucking thumb.",
      },
      {
        q: "Which texture gives the fretting hand the most time to reach a hard chord?",
        a: "Split: the root sounds on the beat, the rest of the chord a beat later.",
        why: "[[Law5]]: what you cannot do at once, do in sequence. The listener hears a root on time and a chord after it, which sounds intentional (it is how stride piano sounds), while the hand gets a whole beat to arrive.",
      },
    ],
    quiz: ["map", "register", "fifthBelow"],
  },
  {
    id: "first-tone",
    part: 0,
    title: "First tone: a clean chord sound",
    piano:
      "A piano's chord sound comes for free: hammers on bright strings, a sustain pedal. On a bass the sound is built for low single notes, so a chord needs a different tone.",
    blocks: [
      {
        t: "p",
        text: "Chords on bass fail for two reasons: **mud at the bottom** ([[Law2]]) and **notes that die too fast**. The tone for chords fixes both: less low end, more definition, more sustain. Full settings are in [[Ch24]]; this is the short version to set up on day one.",
      },
      { t: "h", text: "On the bass" },
      {
        t: "list",
        items: [
          "Favour the **bridge pickup**. It has less low boom and more of the note's edge, which is what lets three notes stay separate.",
          "Pluck closer to the bridge than you do for bass lines.",
          "In active mode, keep the bass control flat or slightly cut, and push the mids a little.",
          "Fresh round-wound strings help more than any pedal.",
        ],
      },
      { t: "h", text: "On the Zoom B3n: patch “KEYS”" },
      {
        t: "p",
        text: "Five effects, in this order. Names are exactly as they appear on the unit. The numbers are starting points worked out from Zoom's parameter list, not settings anyone has auditioned on your rig: adjust by ear.",
      },
      {
        t: "table",
        head: ["#", "Effect", "Start with", "Why"],
        rows: [
          ["1", "**BlackOpt**", "Comp 40, Lo 50, Hi 60", "Evens out the three notes and makes them last"],
          ["2", "**Low EQ**", "Type HPF, FREQ 80", "Removes rumble under the chord"],
          ["3", "**BassGEQ**", "50: −4, 120: −3, 800: +3, 4.5k: +3, 10k: +2", "Less boom, more definition"],
          ["4", "**BassStCho**", "Depth 40, Rate 15, LoCut 200, Mix 30", "Width, only on the upper part of the sound"],
          ["5", "**Hall**", "PreD 20, Decay 12, Mix 20, Tail ON", "The “sustain pedal”"],
        ],
      },
      {
        t: "p",
        text: "No amp model for now. Amp and cabinet models add low-mid weight, which is exactly what chords do not need. Every choice in this patch follows from [[Law2]]: anything that lowers the mud lowers every floor in the clear-zone table of [[Ch1]], so more shapes become usable.",
      },
      {
        t: "shapes",
        title: "The test chord",
        rows: ["Cmaj7 | x-8-x-9-9 | roll it slowly: three clear notes, a full bar long"],
      },
    ],
    drills: [
      "Set up the KEYS patch. Roll {Cmaj7:x-8-x-9-9} once per bar and turn each knob both ways; keep what makes the three notes clearest.",
      "Switch between the neck and the bridge pickup on the same roll. Describe the difference in one word each.",
      "Pluck the same roll over the neck and then near the bridge. Notice which one keeps the notes separate.",
    ],
    ready: "{Cmaj7:x-8-x-9-9} rolled slowly sounds like three clear notes that last a full bar.",
    checks: [
      {
        q: "Why the bridge pickup for chords?",
        a: "It has less low boom and more attack and edge, so the notes stay separate.",
        why: "[[Law2]]: mud comes from low frequencies of close notes beating together. A tone with less low end and more definition lowers the floors of the clear zones, so the same shape sounds clearer.",
      },
      {
        q: "Why does the chorus have LoCut 200?",
        a: "So only the upper part of the sound is modulated.",
        why: "Chorus works by wobbling the pitch slightly. On low notes the wobble is heard as an out-of-tune bass; above 200 Hz it is heard as width. Modulate only the highs.",
      },
      {
        q: "Why no amp model in the KEYS patch?",
        a: "Amp and cabinet models add low-mid weight, the frequencies where three notes blur.",
        why: "A chord needs definition, not weight ([[Law2]]). The compressor and the reverb do the useful work: even notes, and a tail that holds the chord while the hand moves.",
      },
    ],
    quiz: ["mud", "register", "map"],
    tone: "The KEYS patch is the everyday chord sound for the whole method. Chapter 24 has its variations and three more patches.",
  },

  // ───────────────────────────── Part 1: Two notes ─────────────────────────────
  {
    id: "root-shells",
    part: 1,
    title: "Root shells: root + 7th, root + 10th",
    piano:
      "Bud Powell's left hand: the root plus *one* other note, either the 7th or the 3rd placed a 10th above the root. Tiny, clear, and enough to state the chord. Two notes are already harmony: pianists have played two-note left hands since bebop.",
    blocks: [
      { t: "h", text: "Bass logic" },
      { t: "p", text: "From the map of [[Ch1]]:" },
      {
        t: "list",
        items: [
          "**Root + 7th**: two strings up. Same fret is ♭7, one fret forward is major 7, one fret back is 6.",
          "**Root + 10th**: three strings up. Same fret is the minor 3rd, one fret forward is the major 3rd.",
        ],
      },
      {
        t: "p",
        text: "Both shapes skip strings, which [[Law2]] likes: the gap at the bottom is wide (a 7th or a 10th, clear even low on the neck).",
      },
      {
        t: "shapes",
        rows: ["Cmaj7 | x-8-x-9-x | root + 7", "C7 | x-8-x-8-x | root + ♭7", "C6 | x-8-x-7-x | root + 6", "C | x-8-x-x-9 | root + major 10th", "Cm | x-8-x-x-8 | root + minor 10th"],
        caption: "Fingering: root with finger 1 or 2, the upper note with 3 or 4. For the same-fret shapes, lay finger 1 flat.",
      },
      { t: "h", text: "Which one to use?" },
      {
        t: "p",
        text: "The 7th tells major 7 from dominant. The 10th tells major from minor. On a II–V–I you want whichever note is about to move by a fret ([[Law4]]):",
      },
      {
        t: "shapes",
        seq: true,
        rows: ["Dm7 | x-10-x-x-10 | root + ♭3", "G7 | x-x-10-x-10 | root + ♭7: the top note has not moved", "Cmaj7 | x-8-x-x-9 | root + 3: the top note falls one fret"],
      },
      {
        t: "p",
        text: "Look at the top voice: F, F, E. That is [[R1]] (F pulls down to E), played with one finger. The root moves D, G, C, falling in fifths ([[R3]]). Two notes, and both engines of the II–V–I are audible.",
      },
      {
        t: "along",
        title: "II–V–I in two notes",
        bars: "Dm7:x-10-x-x-10 | G7:x-x-10-x-10 | Cmaj7:x-8-x-x-9 | Cmaj7:x-8-x-x-9",
        pattern: "split",
        tempo: 80,
        caption: "Switch your part off and play it yourself. Say the top voice aloud: F, F, E.",
      },
      { t: "h", text: "The scale in 10ths" },
      {
        t: "p",
        text: "Harmonize the C major scale with a 10th on every step. This is one of the most-used sounds in solo bass playing: Jaco Pastorius and Richard Bona both lean on it.",
      },
      {
        t: "shapes",
        seq: true,
        rows: ["G | x-3-x-x-4", "Am | x-5-x-x-5", "B° | x-7-x-x-7", "C | x-8-x-x-9", "Dm | x-10-x-x-10", "Em | x-12-x-x-12", "F | x-13-x-x-14"],
      },
      {
        t: "p",
        text: "You do not need to memorize which are major. The key decides: the top note must be in C major. From G, the note two letters up in C major is B, a major 3rd: one fret forward. From A it is C, a minor 3rd: same fret. That is [[R5]] with two notes.",
      },
    ],
    drills: [
      "**Cycle of fourths, alternating.** Roots on the E string take a 10th, roots on the A string take a 7th: {C7:x-8-x-x-9}, {F7:x-x-8-x-8}, {B♭7:x-6-x-x-7}, {E♭7:x-x-6-x-6}, and continue down the neck. The hand moves two frets every two chords.",
      "**10ths scale** in C, up and down, split texture (T on the beat, finger off the beat). Then in F and G.",
      "**II–V–I in two notes**, in C, then B♭, E♭, F, G. Say the degrees of the top voice aloud.",
      "**Ear:** play a root, sing the 10th, then play it.",
    ],
    ready: "You can play Drill 3 in five keys without stopping to think, and Drill 2 sounds like music.",
    checks: [
      {
        q: "Write the root + 7 shape for E♭maj7 with the root on the A string.",
        a: "{E♭maj7:x-x-6-x-7}",
        why: "E♭ is at A‑6. The major 7 is two strings up, one fret forward ([[Law1]]: 5 × 2 + 1 = 11 semitones): G string, fret 7.",
      },
      {
        q: "In the 10ths scale of F major starting at E‑1, is the 10th on G (E‑3) major or minor, and why?",
        a: "Minor: {Gm:x-3-x-x-3}.",
        why: "The 10th above G in F major is B♭ (two letters up, inside the key: [[R5]]). G to B♭ is a minor 3rd, so the upper note is three strings up, same fret.",
      },
    ],
    quiz: ["map", "where", "shapeDeg", "nameShape"],
  },
  {
    id: "guide-tone-pairs",
    part: 1,
    title: "Guide-tone pairs: the 3rd and 7th alone",
    piano:
      "The 3rd and 7th are called *guide tones*: they tell the ear what kind of chord it is ([[HL2]]), and they move smoothly from chord to chord ([[HL5]]). A pianist's shell is just these two notes above a bass player's root. Here you are both people, so first learn the pair alone.",
    blocks: [
      { t: "h", text: "Bass logic" },
      {
        t: "p",
        text: "Put the pair on the D and G strings, where [[Law2]] allows close intervals. There are only three possible shapes, and you can derive them:",
      },
      {
        t: "list",
        items: [
          "From 7 up to 3 is a fourth when the chord is maj7 or m7 → **same fret**.",
          "From 3 up to 7 is a fifth when the chord is maj7 or m7 → **two frets forward**.",
          "In a dominant 7th, 3 and 7 are a tritone apart both ways → **one fret forward** ([[R2]]).",
        ],
      },
      {
        t: "shapes",
        seq: true,
        rows: ["Dm7 | x-x-x-10-10 | ♭7 below ♭3: a fourth", "G7 | x-x-x-9-10 | 3 below ♭7: a tritone", "Cmaj7 | x-x-x-9-9 | 7 below 3: a fourth"],
        caption: "One finger moves at a time. First the lower note drops a fret (C to B), then the upper one (F to E). That is the II–V–I in its smallest form, and it is [[R1]] twice.",
      },
      { t: "p", text: "The other inversion, higher on the neck:" },
      {
        t: "shapes",
        seq: true,
        rows: ["Dm7 | x-x-x-15-17 | ♭3 below ♭7: a fifth", "G7 | x-x-x-15-16 | ♭7 below 3: a tritone", "Cmaj7 | x-x-x-14-16 | 3 below 7: a fifth"],
      },
      { t: "h", text: "What the pair cannot tell you" },
      {
        t: "p",
        text: "A fourth or a fifth is “stable”; a tritone is “tense”. But the pair alone does not say *major 7* or *minor 7*. `x-x-x-10-10` is C and F. Over D those are ♭7 and ♭3: {Dm7:x-x-x-10-10}. Over D♭ they are 7 and 3: {D♭maj7:x-x-x-10-10}. The root decides, which is why your thumb, a looper, or another player supplies it ([[Law5]]).",
      },
      { t: "h", text: "Dominants around the cycle: one fret down each time" },
      {
        t: "shapes",
        seq: true,
        rows: ["G7 | x-x-x-9-10 | 3 and ♭7", "C7 | x-x-x-8-9 | ♭7 and 3", "F7 | x-x-x-7-8 | 3 and ♭7", "B♭7 | x-x-x-6-7 | ♭7 and 3"],
      },
      {
        t: "p",
        text: "The tritone slides down one fret per chord while the roots fall in fifths. Why? Each 3rd falls a half step into the next ♭7, and each ♭7 falls a half step into the next 3rd ([[R1]] twice), so the shape keeps its form and only the labels swap. This is why the bridge of rhythm changes and every chain of secondary dominants ([[HL7]], [[HL8]]) feels so smooth.",
      },
      {
        t: "tip",
        title: "The tritone-sub shortcut ([[R7]])",
        text: "`x-x-x-9-10` is B and F. Over G those are 3 and ♭7: {G7:x-x-x-9-10}. Over D♭ they are ♭7 and 3: {D♭7:x-x-x-9-10}. Same two notes, two roots a tritone apart. You already know every tritone substitution ([[HL9]]); you only change what the thumb plays.",
      },
      { t: "h", text: "A 12-bar blues with one shape" },
      {
        t: "shapes",
        rows: ["F7 | x-x-x-7-8 | 3 ♭7", "B♭7 | x-x-x-6-7 | ♭7 3", "C7 | x-x-x-8-9 | ♭7 3"],
        caption: "Three positions of one shape. Record the roots on the B3n looper (or have a friend play them) and comp the whole F blues.",
      },
      {
        t: "along",
        title: "Blues in F with guide-tone pairs",
        bars: "F7:x-x-x-7-8 | B♭7:x-x-x-6-7 | F7:x-x-x-7-8 | F7:x-x-x-7-8 | B♭7:x-x-x-6-7 | B♭7:x-x-x-6-7 | F7:x-x-x-7-8 | F7:x-x-x-7-8 | C7:x-x-x-8-9 | B♭7:x-x-x-6-7 | F7:x-x-x-7-8 | C7:x-x-x-8-9",
        pattern: "four",
        tempo: 100,
        caption: "The looper plays the roots, as the B3n looper would. Play the pairs four to the bar, short, a little louder on 2 and 4.",
      },
    ],
    drills: [
      "II–V–I pairs in C (both inversions), then down a whole step to B♭, A♭, and so on. Twelve keys in two weeks.",
      "Dominant cycle: start at `x-x-x-13-14` and slide down a fret at a time, naming each chord. Each position has two names (the tritone pair). Say both.",
      "Blues in F over a looped root line, block texture, on beats 2 and 4.",
      "**Ear:** loop a D root. Play {Dm7:x-x-x-10-10}, then move only the upper note up one fret: {D7:x-x-x-10-11}. You have turned Dm7 into D7. Hear the 3rd change.",
    ],
    ready: "You can comp a blues in F and in B♭ with pairs, in time, and name the 3 and 7 of any dominant chord as you play it.",
    checks: [
      {
        q: "Which two dominant chords own the pair `x-x-x-6-7`?",
        a: "{B♭7:x-x-x-6-7} and {E7:x-x-x-6-7}.",
        why: "The notes are A♭ (D‑6) and D (G‑7), a tritone. A tritone is two 3–♭7 pairs at once ([[R2]]): D is the 3 of B♭7 with A♭ its ♭7, and G♯ (= A♭) is the 3 of E7 with D its ♭7. The two roots are a tritone apart ([[R7]]).",
      },
      {
        q: "Starting from `x-x-x-10-10` as Dm7, what is the smallest move to make it G7?",
        a: "Move the lower note down one fret: {G7:x-x-x-9-10}.",
        why: "C, the ♭7 of Dm7, falls a half step to B, the 3 of G7 ([[R1]]). F stays: the ♭3 of Dm7 becomes the ♭7 of G7. One finger, one fret ([[Law4]]).",
      },
      {
        q: "Which major 7 chord shares its guide-tone pair with Em7?",
        a: "E♭maj7.",
        why: "Em7's guide tones are G (♭3) and D (♭7). G is the 3 of E♭ and D is its major 7. Same two notes, a root a half step lower: the root decides the name.",
      },
    ],
    quiz: ["pair", "trade", "shapeDeg", "nameShape"],
    tone: "Pairs sound good with a little more chorus than full chords: raise BassStCho Mix to 40.",
  },

  // ───────────────────────────── Part 2: Three notes ─────────────────────────────
  {
    id: "shell-forms",
    part: 2,
    title: "The three shell forms: A, B and C",
    piano:
      "A pianist's basic left hand is a shell: root with 7th and 3rd above it, in one of two orders (7 below 3, or 3 below 7). Pianists call them type A and type B and alternate them.",
    blocks: [
      {
        t: "p",
        text: "Root, 3rd, 7th. By [[Law3]] this is a complete chord: the 3rd and 7th say what it is, the root says where it is. There are exactly three ways to lay those three notes under one hand, and each puts the notes in different registers.",
      },
      { t: "h", text: "Bass logic: join the root shells and the pairs" },
      {
        t: "p",
        text: "Join [[Ch4]] (root + one note) with [[Ch5]] (the pair). Enumerate every way to put R, 3 and 7 on three strings inside a four-fret span with the root at the bottom, and exactly three survive:",
      },
      {
        t: "table",
        head: ["Form", "Order, low to high", "Strings", "Root lives on", "Character"],
        rows: [
          ["**A**", "R – 7 – 3", "root, *skip one*, two neighbours", "E or B string", "Open and clear. The default."],
          ["**B**", "R – 3 – 7", "three neighbours", "A or E string", "Thick and warm. Needs height."],
          ["**C**", "R – 3 – 7, spread", "root, *skip two*, two neighbours", "B string only", "Wide, pianistic. The 5-string form."],
        ],
      },
      {
        t: "p",
        text: "In form A the upper pair is “7 below 3” (a fourth or a tritone). In forms B and C it is “3 below 7” (a fifth or a tritone). You already own both pairs from [[Ch5]].",
      },
      { t: "h", text: "Form A, root C on the E string" },
      {
        t: "shapes",
        rows: ["Cmaj7 | x-8-x-9-9", "C7 | x-8-x-8-9", "Cm7 | x-8-x-8-8", "CmMaj7 | x-8-x-9-8", "C6 | x-8-x-7-9", "Cm6 | x-8-x-7-8"],
      },
      {
        t: "tip",
        title: "Do not memorize six shapes: two switches make all of them",
        text: "**D string (the 7th):** one fret forward = maj7, same fret = ♭7, one fret back = 6. **G string (the 3rd):** one fret forward = major, same fret = minor. Both switches are just the map of [[Ch1]]: two strings up and three strings up from the root.",
      },
      {
        t: "p",
        text: "Fingering: finger 1 on the root, leaning on the A string to mute it. Same-fret notes get a flat finger 1; notes one fret forward get fingers 2 and 3, or a small barre with 3.",
      },
      { t: "h", text: "Form B, root F on the A string" },
      {
        t: "shapes",
        rows: ["Fmaj7 | x-x-8-7-9", "F7 | x-x-8-7-8", "Fm7 | x-x-8-6-8", "Fm6 | x-x-8-6-7", "F6 | x-x-8-7-7"],
      },
      {
        t: "p",
        text: "Switches: **D string (the 3rd)** one fret back = major, two back = minor. **G string (the 7th)** as in the map: same fret ♭7, forward maj7, back 6. Fingering: for major types, finger 2 on the root, 1 on the 3rd, 3 or 4 on the 7th. For minor types, finger 3 on the root, 1 on the 3rd, 4 on the 7th.",
      },
      {
        t: "tip",
        title: "Register warning ([[Law2]])",
        text: "Form B puts the 3rd right above the root, both in the bass band, a 3rd apart. With the root at A‑8 it is acceptable; below A‑5 it gets thick fast. Lower than that, use form A or C, or thin to two notes. The shape checker flags this pair on every form B shape: it is the price of the form.",
      },
      { t: "h", text: "Form C, root G on the B string" },
      {
        t: "shapes",
        rows: ["Gmaj7 | 8-x-x-9-11", "G7 | 8-x-x-9-10", "Gm7 | 8-x-x-8-10", "G6 | 8-x-x-9-9", "Gm6 | 8-x-x-8-9"],
      },
      {
        t: "p",
        text: "Switches from the map: the D string is three strings up (same fret minor, forward major). The G string is four strings up (+1 is 6, +2 is ♭7, +3 is maj7). This is the shape a pianist's left hand makes when it stretches a 10th. The root is deep in the bass band, the 3rd and 7th are well inside the chord band. Nothing is crowded.",
      },
      {
        t: "shapes",
        title: "One chord, three forms: hear the register change",
        rows: ["C7 | x-8-x-8-9 | form A: clear", "C7 | x-x-3-2-3 | form B at fret 3: the mud [[Law2]] predicts", "C7 | 13-x-x-14-15 | form C: wide and bright"],
        caption: "All three are C7. The second one is meant to sound thick: the 3rd sits a 3rd above a low root, under its floor.",
      },
    ],
    drills: [
      "**Switch drill.** Hold form A on C. Without lifting the root, play maj7, 7, m7, m6, and back. Say the name each time. Same for forms B and C.",
      "**One chord, three forms.** C7 as form A {C7:x-8-x-8-9}, form B {C7:x-x-3-2-3}, form C {C7:13-x-x-14-15}. Listen to how the register changes the chord. Notice form B at fret 3: this is the mud that [[Law2]] predicts.",
      "**Cycle of fourths, dominant 7ths**, alternating A and B: C7 (A, E‑8), F7 (B, A‑8), B♭7 (A, E‑6), E♭7 (B, A‑6), and on.",
      "Five-string check ([[Ch2]]) on every new shape.",
    ],
    ready: "You can build any of the five qualities on any root in any of the three forms, by using the switches.",
    checks: [
      {
        q: "Write Am7 in form A.",
        a: "{Am7:x-5-x-5-5}",
        why: "Root A at E‑5. Form A: the 7th two strings up (D string), the 3rd three strings up (G string). Minor 7: the ♭7 switch at the same fret, the ♭3 switch at the same fret. One flat finger plus the root.",
      },
      {
        q: "Write B♭maj7 in form B.",
        a: "{B♭maj7:x-x-13-12-14}",
        why: "Root B♭ at A‑13 (A‑1 would be far too low for form B, [[Law2]]). The 3rd one string up, one fret back (D‑12). The major 7 two strings up, one fret forward (G‑14).",
      },
      {
        q: "Write D7 in form C.",
        a: "{D7:3-x-x-4-5}",
        why: "Root D at B‑3. The 3rd is three strings up, one fret forward (D‑4); the ♭7 is four strings up, two frets forward (G‑5): 5 × 4 + 2 = 22 = ♭7 an octave up.",
      },
      {
        q: "Cm6 and which other chord share `x-8-x-7-8`?",
        a: "C°7 ({C°7:x-8-x-7-8}).",
        why: "The notes are C, A, E♭. A °7 is a double-flat 7th, the same pitch as a 6. So C°7 (C E♭ G♭ A) contains all three, and its shell without the ♭5 is the m6 shell ([[Ch8]]).",
      },
    ],
    quiz: ["form", "nameShape", "shapeDeg", "where"],
  },
  {
    id: "two-five-one",
    part: 2,
    title: "II–V–I by alternating forms",
    piano:
      "Go from type A to type B to type A. The roots jump, but the 3rds and 7ths barely move ([[HL5]]).",
    blocks: [
      { t: "h", text: "Bass logic ([[Law4]])" },
      {
        t: "p",
        text: "The roots fall a fifth each time ([[R3]]). On bass that means “next string up, same fret” or “next string down, two frets back” ([[Law1]]: a fourth up = a fifth down, one octave apart). If the root changes string, the form changes with it, and the upper pair stays almost where it was.",
      },
      { t: "h", text: "Route 1: A → B → A (root starts on the E string)" },
      {
        t: "shapes",
        seq: true,
        rows: ["Dm7 | x-10-x-10-10 | form A", "G7 | x-x-10-9-10 | form B: root moved across, one finger dropped a fret", "Cmaj7 | x-8-x-9-9 | form A"],
        caption: "The form B chord in the middle carries the low root–3rd of [[Ch6]]: at fret 10 it is acceptable, and the alternation is what keeps the hand still.",
      },
      { t: "h", text: "Route 2: B → A → B (root starts on the A string)" },
      {
        t: "shapes",
        seq: true,
        rows: ["Gm7 | x-x-10-8-10 | form B", "C7 | x-8-x-8-9 | form A", "Fmaj7 | x-x-8-7-9 | form B"],
      },
      { t: "h", text: "Route 3: C → A → C (root starts on the B string)" },
      {
        t: "shapes",
        seq: true,
        rows: ["Gm7 | 8-x-x-8-10 | form C", "C7 | x-8-x-8-9 | form A: the root moves one string, same fret", "Fmaj7 | 6-x-x-7-9 | form C"],
        caption: "The smoothest of all: the inner voice goes B♭, B♭, A and the top goes F, E, E. Play Routes 2 and 3 back to back: same key, same upper notes, but the root an octave lower in Route 3, so root to 3rd becomes a 10th instead of a 3rd.",
      },
      {
        t: "tip",
        title: "Choosing a route",
        text: "Find the root of the II chord in the bass band on each string. Choose the string that puts your hand where the D and G strings are inside the chord band (roughly frets 6 to 14 for the hand). This is [[Ch1]]'s register map doing the choosing for you.",
      },
      {
        t: "along",
        title: "Route 1 in C, split texture",
        bars: "Dm7:x-10-x-10-10 | G7:x-x-10-9-10 | Cmaj7:x-8-x-9-9 | Cmaj7:x-8-x-9-9",
        pattern: "split",
        tempo: 90,
        caption: "Thumb on 1 and 3, the pair on 2 and 4. This split is the comping feel you will use most.",
      },
      { t: "h", text: "The turnaround: I – VI7 – II – V" },
      {
        t: "shapes",
        seq: true,
        rows: ["Cmaj7 | x-8-x-9-9", "A7 | x-x-12-11-12", "Dm7 | x-10-x-10-10", "G7 | x-x-10-9-10"],
      },
      {
        t: "along",
        title: "Turnaround in C",
        bars: "Cmaj7:x-8-x-9-9 A7:x-x-12-11-12 | Dm7:x-10-x-10-10 G7:x-x-10-9-10 | Cmaj7:x-8-x-9-9 A7:x-x-12-11-12 | Dm7:x-10-x-10-10 G7:x-x-10-9-10",
        pattern: "charleston",
        tempo: 100,
      },
    ],
    drills: [
      "Route 1 in C, B♭, A♭, G♭. Route 2 in F, E♭, D♭, B. Route 3 in F, G, A, B♭.",
      "All the textures of [[Ch2]] on each route. With *split*, the thumb plays the root on beat 1 and the pair lands on beat 2: this is the comping feel you will use most.",
      "Turnaround in C, then in F (start from {Fmaj7:x-x-8-7-9}).",
      "**Ear:** sing the top voice of Route 1 while playing only the roots.",
    ],
    ready: "You can play a II–V–I in any key within five seconds of hearing its name, with no gap between the chords.",
    checks: [
      {
        q: "Write Route 1 in B♭.",
        a: "{Cm7:x-8-x-8-8}, {F7:x-x-8-7-8}, {B♭maj7:x-6-x-7-7}.",
        why: "Route 1 starts with form A on the E string: C is at E‑8. F (down a fifth) is the next string up, same fret: A‑8, form B. B♭ is back on the E string two frets lower: E‑6, form A. Then the switches of [[Ch6]] give each quality.",
      },
      {
        q: "In Route 2, which note of C7 was already under your finger in Gm7?",
        a: "B♭ on the D string, fret 8.",
        why: "The ♭3 of Gm7 is B♭, and the ♭7 of C7 is B♭ too. A common tone stays put ([[Law4]]); only the root and the other note move.",
      },
    ],
    quiz: ["form", "nameShape", "shapeDeg", "where"],
  },
  {
    id: "minor-dim",
    part: 2,
    title: "Minor keys, half-diminished and diminished",
    piano: "The same shells, with the notes the minor key forces ([[R5]], [[HL11]]).",
    blocks: [
      { t: "h", text: "Bass logic" },
      {
        t: "list",
        items: [
          "**m7♭5.** Its shell (R, ♭7, ♭3) is the same as m7. To hear the ♭5 you add it as a fourth note on the skipped string, or you drop the root.",
          "**Tonic minor** is usually m6 or m(maj7), not m7 ([[HL11]]): the key's raised 7th and the Dorian 6th make the home chord sound settled.",
          "**dim7** is R, ♭3, ♭5, °7, and the °7 is the same pitch as a 6. So the form A shell of a dim7 is the same shape as m6.",
        ],
      },
      {
        t: "shapes",
        seq: true,
        title: "Minor II–V–I in C minor",
        rows: ["Dm7♭5 | x-10-11-10-10 | four notes: the ♭5 fills the skipped string", "G7 | x-x-10-9-10", "Cm6 | x-8-x-7-8"],
        caption: "The top voice goes F, F, E♭ and the inner voice C, B, A.",
      },
      { t: "p", text: "With the tonic as m(maj7), the inner voice simply stays on B:" },
      {
        t: "shapes",
        seq: true,
        rows: ["Dm7♭5 | x-10-x-10-10 | shell only", "G7 | x-x-10-9-10", "CmMaj7 | x-8-x-9-8"],
        caption: "The shell-only Dm7♭5 is the same shape as Dm7: without its ♭5 the ear takes the key's word for it. The four-note version above sounds the ♭5, at the price of a slightly thick 3rd between ♭5 and ♭7 on the A and D strings ([[Law2]]).",
      },
      {
        t: "along",
        title: "Minor II–V–I in C minor",
        bars: "Dm7♭5:x-10-11-10-10 | G7:x-x-10-9-10 | Cm6:x-8-x-7-8 | Cm6:x-8-x-7-8",
        pattern: "split",
        tempo: 90,
      },
      {
        t: "tip",
        title: "Rootless half-diminished",
        text: "Drop the root of Dm7♭5 and three notes remain: A♭, C, F. That is an F minor triad. So a m7♭5 is “the minor triad a minor 3rd above the root” ([[R7]]: same important notes, another name). You will use this in [[Ch13]] and [[Ch17]].",
      },
      { t: "h", text: "Diminished passing chords" },
      {
        t: "shapes",
        seq: true,
        rows: ["Cmaj7 | x-8-x-9-9", "C♯°7 | x-9-x-8-9 | root up a fret, 7th down a fret", "Dm7 | x-10-x-10-10"],
        caption: "Every voice moves by a half step or stays: [[R1]] at work in three voices ([[HL13]]).",
      },
      {
        t: "p",
        text: "A dim7 chord divides the octave into four equal parts (minor 3rd + minor 3rd + minor 3rd + minor 3rd = 12), so its shape repeats every three frets: {C♯°7:x-9-x-8-9}, {E°7:x-12-x-11-12} and {B♭°7:x-6-x-5-6} are the same chord (C♯ E G B♭): each shell plays three of its four notes, with a different one on the bottom.",
      },
    ],
    drills: [
      "Minor II–V–I in C minor, G minor, D minor, F minor. Both versions of the tonic.",
      "Passing diminished: Cmaj7, C♯°7, Dm7, D♯°7, Em7 (continue the pattern up the E string).",
      "Slide one dim7 shape up three frets at a time and listen: same chord, new top note.",
    ],
    ready: "The minor II–V–I feels as automatic as the major one.",
    checks: [
      {
        q: "Which minor triad is Bm7♭5 without its root?",
        a: "D minor (D F A).",
        why: "Bm7♭5 is B D F A. Remove B and D F A remain: the minor triad a minor 3rd above the root ([[R7]]).",
      },
      {
        q: "The notes of `x-9-x-8-9` belong to C♯°7. Which three other dim7 chords are made of the same notes?",
        a: "E°7, G°7 and B♭°7.",
        why: "A dim7 is four minor 3rds stacking back to the octave, so every one of its notes can be the root: C♯, E, G, B♭. Four names, one set of notes; that is why the shape repeats every three frets.",
      },
    ],
    quiz: ["nameShape", "shapeDeg", "form"],
  },
  {
    id: "b-string",
    part: 2,
    title: "The B string: trading strings for position",
    piano:
      "A pianist who wants a thicker or a clearer chord moves the left hand an octave. You cannot move a hand that far and keep the chord. But you have something a pianist does not.",
    blocks: [
      { t: "h", text: "Bass logic" },
      { t: "p", text: "By [[Law1]], the same root exists in several places:" },
      {
        t: "table",
        head: ["Root C2 on…", "Hand position", "The D and G strings under that hand are in…"],
        rows: [
          ["A string, fret 3", "frets 2–5", "the bottom of the chord band, under the floor for 3rds: 3rds will be muddy"],
          ["E string, fret 8", "frets 7–10", "the chord band: shells are clear"],
          ["B string, fret 13", "frets 12–16", "the top of the chord band, touching melody"],
        ],
      },
      {
        t: "big",
        text: "Moving the root to a lower string raises everything else.",
      },
      {
        t: "p",
        text: "This is the single most useful fact about the fifth string for chords. It is not there for lower notes; it is there so that your hand can sit higher on the neck while the root stays in the bass band. The rule: **if a voicing is muddy, do not look for a different chord. Put the root one string lower and five frets higher, then rebuild the chord in the form that string takes (form A from the E string, form A or C from the B string).**",
      },
      {
        t: "shapes",
        rows: ["Cmaj7 | x-x-3-2-4 | form B, root on A: thick", "Cmaj7 | x-8-x-9-9 | form A, root on E: clear", "Cmaj7 | 13-x-x-14-16 | form C, root on B: wide and bright", "Cmaj7 | 13-x-14-14-x | form A again, root on B"],
        caption: "All four have the root C2 at the same pitch. Only the upper notes changed register. The first one is flagged for mud on purpose.",
      },
      { t: "h", text: "II–V–I with the B string, in B♭" },
      {
        t: "shapes",
        seq: true,
        rows: ["Cm7 | 13-x-x-13-15 | form C", "F7 | x-13-x-13-14 | form A", "B♭maj7 | 11-x-x-12-14 | form C"],
      },
      { t: "h", text: "The blues in F, three notes, one hand position" },
      {
        t: "shapes",
        rows: ["F7 | 6-x-x-7-8 | form C", "B♭7 | x-6-x-6-7 | form A", "C7 | x-8-x-8-9 | form A"],
        caption: "The whole blues fits between frets 6 and 9. Compare it with [[Ch5]]: the same pairs on D and G, now with roots under them.",
      },
      {
        t: "along",
        title: "Blues in F, one hand position",
        bars: "F7:6-x-x-7-8 | B♭7:x-6-x-6-7 | F7:6-x-x-7-8 | F7:6-x-x-7-8 | B♭7:x-6-x-6-7 | B♭7:x-6-x-6-7 | F7:6-x-x-7-8 | F7:6-x-x-7-8 | C7:x-8-x-8-9 | B♭7:x-6-x-6-7 | F7:6-x-x-7-8 | C7:x-8-x-8-9",
        pattern: "split",
        tempo: 100,
      },
    ],
    drills: [
      "**Root tracing.** For each of the 12 notes, play it at every place it exists in the bass band (B, E, A strings). Say which hand position gives the clearest shell.",
      "The four Cmaj7 shapes above, then the same for F7 and for Gm7.",
      "Blues in F with split texture: thumb on 1, pair on 2 and 4.",
      "II–V–I in B♭ as written, then in A and in C, staying above fret 10.",
    ],
    ready: "You choose the root's string on purpose, by register, before your hand moves.",
    checks: [
      {
        q: "You are playing Fmaj7 as `x-x-8-7-9` and it sounds thick. Give the form C fix.",
        a: "{Fmaj7:6-x-x-7-9}",
        why: "The thickness is the 3rd (A, D‑7) sitting a major 3rd above the root (F, A‑8), both in the bass band ([[Law2]]). Keep the 3rd and 7th where they are and move the root to the B string: B‑6 is F an octave lower. Now root to 3rd is a 10th, which is clear anywhere. Same upper notes, same hand position, and the mud is gone.",
      },
      {
        q: "Where is E♭2 on the B string?",
        a: "Fret 16.",
        why: "E♭2 is MIDI 39 and the open B string is B0 = 23. 39 − 23 = 16.",
      },
    ],
    quiz: ["register", "mud", "form", "where"],
  },
  {
    id: "shifts",
    part: 2,
    title: "Shifts: how the hand travels",
    piano:
      "Sooner or later the next chord is not under your hand. Pianists look at the target and move from the elbow.",
    blocks: [
      {
        t: "p",
        text: "On bass there are six ways to make a move disappear. Try them in this order: each one is cheaper than the next.",
      },
      {
        t: "steps",
        items: [
          "**Trade a string first.** Before shifting, ask whether the next root exists on a neighbouring string near where you are ([[Ch9]]). Five frets of travel can usually be replaced by one string.",
          "**Guide finger.** Keep one finger touching its string during the shift and slide it to its new fret. The other fingers rebuild around it. In Route 1 of [[Ch7]], the finger on the D string slides 10 → 9 → 9 while everything else re-forms.",
          "**Common tone as a pivot.** If a note is in both chords, hold it and let the hand rotate around it. Dm7 to G7 shares F: keep the G string finger down ([[Law4]]).",
          "**Root first, chord late ([[Law5]]).** Play the new root with the thumb *while* the hand is still arriving, and place the pair a beat later. Listeners hear a root on the beat and a chord after it, which is what a pianist's stride sounds like. This turns every hard change into two easy ones.",
          "**Open-string breath.** In keys that have them, an open B, E, A, D or G can ring while the hand moves any distance. Open strings are free shifts.",
          "**Stamp.** When two chords have the same shape, do not rebuild it. Lift slightly, keep the shape frozen, and land.",
        ],
      },
      {
        t: "shapes",
        seq: true,
        title: "The stamp: approach from one fret above",
        rows: ["D♭maj7 | x-9-x-10-10 | same shape, one fret above", "Cmaj7 | x-8-x-9-9"],
        caption: "A classic piano move, and on bass it costs nothing: the hand does not change shape at all.",
      },
      {
        t: "tip",
        title: "Landing order",
        text: "Aim with your eyes at the fret where the *root finger* will land. Land the root first, the upper fingers a few milliseconds later. If you aim for the top note, the bottom arrives late and the chord sounds unsure. The root carries the time; the rest carries the colour.",
      },
      {
        t: "shapes",
        seq: true,
        title: "Octave ladder on Cmaj7 (Drill 1)",
        rows: ["Cmaj7 | x-x-3-2-4 | form B, low and thick", "Cmaj7 | x-8-x-9-9 | form A", "Cmaj7 | 13-x-x-14-16 | form C", "Cmaj7 | x-x-15-14-16 | form B an octave up"],
      },
      {
        t: "along",
        title: "The long jump: Route 1 in C, then in A♭",
        bars: "Dm7:x-10-x-10-10 | G7:x-x-10-9-10 | Cmaj7:x-8-x-9-9 | Cmaj7:x-8-x-9-9 | B♭m7:x-6-x-6-6 | E♭7:x-x-6-5-6 | A♭maj7:x-4-x-5-5 | A♭maj7:x-4-x-5-5",
        pattern: "split",
        tempo: 72,
        caption: "Bar 5 is the jump. Use technique 4: the thumb lands the B♭ on beat 1, the pair follows on beat 2. The A♭ shapes sit low on the neck, so expect some thickness ([[Law2]]).",
      },
    ],
    drills: [
      "**Octave ladder on Cmaj7:** {Cmaj7:x-x-3-2-4} → {Cmaj7:x-8-x-9-9} → {Cmaj7:13-x-x-14-16} → {Cmaj7:x-x-15-14-16}. Slow, in time, using technique 4.",
      "**Stamp drill:** every chord of Route 1 approached from a fret above, as an eighth note before the beat.",
      "**Silent shifts:** play Route 1 in C, then Route 1 in A♭ (a long jump). Practise the jump alone, without sound, ten times, eyes on the target fret. Then with sound.",
      "**Metronome test:** II–V–I in a new key every two bars at 60 bpm, no rests. Use the [[GEN]] to pick the keys for you.",
    ],
    ready: "Drill 4 works in six keys in a row. Then do the **Part 2 checkpoint**: play the four [[TP]] with three-note shells, record yourself, and keep the recording.",
    checks: [
      {
        q: "You hold {Cmaj7:x-8-x-9-9} and the next chord is Fmaj7. Where is the nearest F root, and which form goes with it?",
        a: "A string, fret 8 (same fret, next string up): form B, {Fmaj7:x-x-8-7-9}.",
        why: "Technique 1, trade a string first. F is a fourth above C, and by [[Law1]] a fourth is one string up at the same fret. No shift at all; the form changes because the root changed string.",
      },
      {
        q: "Why aim at the root finger, not the top note, when you shift?",
        a: "Because the root carries the time and the harmony; if it lands late the whole chord sounds unsure.",
        why: "The listener hears the bottom note as the chord's location ([[Law3]]: the root says *where*). Land it on the beat; the upper notes can arrive a few milliseconds later, or a beat later ([[Law5]]).",
      },
      {
        q: "Dm7 {Dm7:x-10-x-10-10} to G7 {G7:x-x-10-9-10}: which finger never lifts?",
        a: "The one on the G string, fret 10 (F).",
        why: "F is the ♭3 of Dm7 and the ♭7 of G7: a common tone. Hold it and rotate the hand around it (technique 3, [[Law4]]).",
      },
    ],
    quiz: ["form", "register", "nameShape", "fifthBelow"],
  },

  // ───────────────────────────── Part 3: Colour ─────────────────────────────
  {
    id: "top-note-menu",
    part: 3,
    title: "The top-note menu: four-note chords",
    piano:
      "Keep the shell in the left hand, add one colour note with the right. Pianists add 9ths, 11ths and 13ths: the harmony course calls them tensions ([[HL4]]).",
    blocks: [
      {
        t: "p",
        text: "So far every chord has been root, 3rd, 7th. On bass you get colour in two ways: add a fourth note on top, or give up the root and spend that finger on colour ([[Ch12]]). This chapter is the first way.",
      },
      { t: "h", text: "Bass logic" },
      {
        t: "p",
        text: "A shell uses three strings. If one string is still free *above* the shell, the map of [[Ch1]] tells you which colours it offers. Two families come out, one for each close shell form.",
      },
      { t: "h", text: "Grand A: root on the B string (R – 7 – 3 – top)" },
      {
        t: "p",
        text: "Form A from the B string leaves the G string free. It is four strings above the root, so row 4 of the map applies: two frets back ♯11 (or ♭5), one back 5, same fret ♭13, one forward 13.",
      },
      {
        t: "shapes",
        rows: [
          "Gmaj7 | 8-x-9-9-7 | top = 5",
          "Gmaj13 | 8-x-9-9-9 | top = 13: one flat finger across three strings",
          "Gmaj7♯11 | 8-x-9-9-6 | top = ♯11: the Lydian sound",
          "G7 | 8-x-8-9-7 | top = 5",
          "G13 | 8-x-8-9-9 | top = 13",
          "G7♭13 | 8-x-8-9-8 | top = ♭13",
          "G7♯11 | 8-x-8-9-6 | top = ♯11",
          "Gm7 | 8-x-8-8-7 | top = 5",
          "Gm13 | 8-x-8-8-9 | top = 13: the Dorian sound",
          "Gm7♭5 | 8-x-8-8-6 | top = ♭5: the full half-diminished chord",
        ],
        caption: "Ten chords, and you learned none of them: three shells you had, times a top note you can calculate.",
      },
      { t: "h", text: "Grand B: root on the E string (R – 3 – 7 – top)" },
      {
        t: "p",
        text: "Form B from the E string also leaves the G string free. It is three strings above the root, so row 3 applies: two frets back ♭9, one back 9, same fret ♯9, two forward 11.",
      },
      {
        t: "shapes",
        rows: ["Cmaj9 | x-8-7-9-7 | top = 9", "C9 | x-8-7-8-7 | top = 9", "C7♭9 | x-8-7-8-6 | top = ♭9", "C7♯9 | x-8-7-8-8 | top = ♯9", "Cm9 | x-8-6-8-7 | top = 9", "Cm11 | x-8-6-8-10 | top = 11"],
      },
      {
        t: "tip",
        title: "Register ([[Law2]])",
        text: "Grand B has the same thickness problem as form B: root and 3rd are neighbours in the bass band. Use it with the root at E‑10 or higher, roll it instead of striking it, or drop the root ([[Ch12]]). Grand A is fully inside the clear zones with the root at B‑12 or higher; between B‑6 and B‑11 it still works with a bright tone. The examples above sit at B‑8 and E‑8 only because the numbers are easy to read: the checker flags their low 3rds, and your ear should hear why.",
      },
      {
        t: "p",
        text: "**So the two families split the colours between them:** 9ths live in Grand B, 13ths and ♯11 live in Grand A. Since a II–V–I alternates forms anyway, the colours come for free:",
      },
      {
        t: "shapes",
        seq: true,
        rows: ["Cm7 | 13-x-13-13-12 | Grand A, top = 5", "F9 | x-13-12-13-12 | Grand B, top = 9", "B♭maj13 | 11-x-12-12-12 | Grand A, top = 13"],
        caption: "The top note is G in all three chords: the 5 of Cm, the 9 of F, the 13 of B♭. One finger never moves. A pianist calls this a common tone in the soprano; it is the most “arranged” sound you can make with three chords.",
      },
      {
        t: "p",
        text: "Fingering for the first chord: finger 1 on the G string, fingers 2, 3 and 4 lined up at fret 13. It is the hardest grip so far; if it will not settle, play it as {Cm7:13-x-13-13-x} and add the top note a beat later ([[Law5]]).",
      },
      {
        t: "along",
        title: "Common-tone II–V–I in B♭",
        bars: "Cm7:13-x-13-13-12 | F9:x-13-12-13-12 | B♭maj13:11-x-12-12-12 | B♭maj13:11-x-12-12-12",
        pattern: "ballad",
        tempo: 70,
        caption: "Roll each chord, top note loudest: it is the melody, and it never moves.",
      },
    ],
    drills: [
      "Grand A top-note switch on G: 5, 13, ♭13, ♯11, for each of the three shells. Say what you hear, not just the name.",
      "Grand B top-note switch on E (root at E‑12): 9, ♭9, ♯9.",
      "The common-tone II–V–I in B♭, then in C (two frets up), A and G.",
      "Plucking: T‑i‑m‑r as a slow roll. The top note must be the loudest; it is the melody.",
    ],
    ready: "You can add a named colour to any shell on request: “E♭7 with a 13”, “A minor with a 9”.",
    checks: [
      {
        q: "Write D13 as Grand A.",
        a: "{D13:3-x-3-4-4}, or an octave up {D13:15-x-15-16-16}.",
        why: "Root D on the B string (fret 3 or 15). Form A: ♭7 two strings up at the same fret (A string), 3 three strings up one fret forward (D string). The 13 is four strings up, one fret forward (G string): 5 × 4 + 1 = 21.",
      },
      {
        q: "Write F7♯9 as Grand B.",
        a: "{F7♯9:x-13-12-13-13}",
        why: "Root F at E‑13. Form B: 3 one string up, one fret back; ♭7 two strings up, same fret. The ♯9 is three strings up at the same fret (G‑13): 15 semitones, a minor 10th, which over a dominant is spelled ♯9.",
      },
      {
        q: "Which family holds the ♭13, and why can the other one not reach it?",
        a: "Grand A.",
        why: "In Grand A the top string is four strings above the root, where the ♭13 is at the same fret (5 × 4 = 20 = ♭13). In Grand B the top string is three strings above the root; the ♭13 would be five frets forward (15 + 5), out of the hand's reach.",
      },
    ],
    quiz: ["shapeDeg", "nameShape", "where", "colour"],
  },
  {
    id: "rootless",
    part: 3,
    title: "Rootless voicings: a shell of another chord",
    piano:
      "In the late 1950s pianists, Bill Evans most famously, stopped playing the root in the left hand: the bassist already has it. That freed a finger for colour. The two standard left-hand shapes are built from the 3rd (3‑5‑7‑9) and from the 7th (7‑9‑3‑5).",
    blocks: [
      { t: "h", text: "Bass logic ([[Law5]])" },
      {
        t: "p",
        text: "You are the bassist, so “leave the root to the bass” becomes [[Law5]]: play the root *first*, or loop it, then play a chord with no root in it. Take a grand chord, remove the root, and the remaining three notes sit entirely in the chord band, where nothing is muddy ([[Law2]]). Three notes, two orders:",
      },
      {
        t: "list",
        items: ["**RA: 3 – 7 – 9** (Grand B without its root)", "**RB: 7 – 3 – 5, or 7 – 3 – 13** (Grand A without its root)"],
      },
      {
        t: "p",
        text: "Derive the shapes from the map. 3 up to 7 is a fifth (next string, two frets forward), or a tritone in a dominant (one fret forward). 7 up to 3 is a fourth (same fret), or a tritone. The last gap is a 3rd or a 4th.",
      },
      {
        t: "shapes",
        seq: true,
        rows: ["Dm9 | x-x-8-10-9 | RA: ♭3 ♭7 9", "G13 | x-x-8-9-9 | RB: ♭7 3 13", "Cmaj9 | x-x-7-9-7 | RA: 3 7 9"],
        caption: "Around frets 7–10 the inner 3rds and 4ths sit a little under their floors ([[Law2]]); with no root under them and a bright tone they speak clearly. Slide the shapes up a few frets if they sound thick. From Dm9 to G13 **one finger moves one fret**. The other two notes are common tones. This is the smoothest II–V in the method ([[Law4]]).",
      },
      { t: "p", text: "A sweeter ending, with the tonic as a 6/9 chord. Notice the shape: a flat finger." },
      {
        t: "shapes",
        seq: true,
        rows: ["Dm9 | x-x-8-10-9", "G13 | x-x-8-9-9", "C6/9 | x-x-7-7-7 | 3 6 9: stacked fourths"],
      },
      { t: "p", text: "Starting from RB instead (key of G):" },
      {
        t: "shapes",
        seq: true,
        rows: ["Am7 | x-x-10-10-9 | RB: ♭7 ♭3 5", "D9 | x-x-9-10-9 | RA: 3 ♭7 9", "Gmaj13 | x-x-9-9-9 | RB: 7 3 13"],
      },
      { t: "h", text: "The chord a third up ([[R7]])" },
      {
        t: "p",
        text: "Look at what the rootless notes spell. Dm9 without D is F, A, C, E: an Fmaj7. Cmaj9 without C is E, G, B, D: an Em7. So a rootless voicing is a simpler chord built on the 3rd. If you can find the 3rd of a chord, you can find its rootless voicing: think “minor chord → major 7 a third up; major chord → minor 7 a third up”. Nothing new to learn: the shells of [[Ch6]], read from a different root.",
      },
      { t: "h", text: "How to supply the root" },
      {
        t: "steps",
        items: [
          "**Split:** the thumb plays the root on beat 1 (any octave, any string, open strings welcome), the fingers play the rootless shape on beat 2 or on the “and”. The hand has a whole beat to get there.",
          "**Looper:** record the bass line on the B3n looper and comp over it. This is the closest you will get to being a pianist with a bassist. The play-alongs here do this for you.",
          "**Leave it out.** With another bass instrument, a keyboard left hand or a backing track, you do not need it at all.",
        ],
      },
      {
        t: "along",
        title: "Rootless II–V–I over a looped bass",
        bars: "Dm9:x-x-8-10-9 | G13:x-x-8-9-9 | Cmaj9:x-x-7-9-7 | C6/9:x-x-7-7-7",
        pattern: "charleston",
        tempo: 100,
        caption: "The looper holds the roots; your part has none. Mute the looper once and hear how the same shapes lose their meaning.",
      },
    ],
    drills: [
      "The three progressions above, with split texture, thumb on the roots.",
      "Same in four more keys each. Transposing rootless shapes means sliding: you are already on the top three strings, so there is no higher string set to move to.",
      "Loop a II–V–I bass line in C, two beats per chord. Comp rootless on the off-beats.",
      "**Ear:** play the Dm9 shape `x-x-8-10-9` with no root, then add a D root, then an F root, then a B♭ root. Three different chords from one shape. Name them.",
    ],
    ready: "You can comp a blues and a II–V–I with rootless shapes over a loop, without looking at the neck.",
    checks: [
      {
        q: "What is Fmaj9 without its root?",
        a: "Am7 (A C E G).",
        why: "Fmaj9 is F A C E G. Remove F: A C E G, the minor 7 chord built on the 3rd. Major chord → minor 7 a third up ([[R7]]).",
      },
      {
        q: "Write the RA voicing for Gm9.",
        a: "{Gm9:x-x-13-15-14}",
        why: "RA is 3 – 7 – 9. The ♭3 of G is B♭ at A‑13. The ♭7 F is a fifth above: next string, two frets forward (D‑15). The 9, A, is a 3rd above F: next string, one fret back (G‑14).",
      },
      {
        q: "In Drill 4, what chord is the Dm9 shape over B♭?",
        a: "B♭maj9♯11 with the 3rd and 7th left out: {B♭maj9♯11:x-x-8-10-9}.",
        why: "The notes F, C, E over B♭ are the 5, the 9 and the ♯11: a B♭ Lydian sound. The shape never changed; the root decided what it means ([[R7]]).",
      },
    ],
    quiz: ["rootless", "shapeDeg", "nameShape", "colour"],
  },
]
