import { pick } from '../theory/random'

/** Jazz forms as "roman:beats" tokens. A function form is regenerated each time. */
export const FORMS: Record<string, string | (() => string)> = {
  iiVI:'ii7:4 V7:4 Imaj7:8', iiVimin:'iiø7:4 V7♭9:4 i7:8', alt:'ii7:4 V7alt:4 Imaj7:8', altmin:'iiø7:4 V7alt:4 i(maj7):8',
  blues:'I7:4 IV7:4 I7:8 IV7:8 I7:8 V7:4 IV7:4 I7:4 V7:4',
  jazzblues:'I7:4 IV7:4 I7:4 v7:2 I7:2 IV7:4 ♯iv°7:4 I7:4 VI7:4 ii7:4 V7:4 I7:2 VI7:2 ii7:2 V7:2',
  minorblues:'i7:16 iv7:8 i7:8 ♭VI7:4 V7:4 i7:4 V7:4',
  autumn:'iv7:4 ♭VII7:4 ♭IIImaj7:4 ♭VImaj7:4 iiø7:4 V7♭9:4 i7:8 iv7:4 ♭VII7:4 ♭IIImaj7:4 ♭VImaj7:4 iiø7:4 V7♭9:4 i7:8',
  rhythm:'I6:2 VI7:2 ii7:2 V7:2 iii7:2 VI7:2 ii7:2 V7:2 I6:2 I7:2 IV6:2 ♯iv°7:2 iii7:2 VI7:2 ii7:2 V7:2 '+
         'I6:2 VI7:2 ii7:2 V7:2 iii7:2 VI7:2 ii7:2 V7:2 I6:2 I7:2 IV6:2 ♯iv°7:2 ii7:2 V7:2 I6:4 '+
         'III7:8 VI7:8 II7:8 V7:8 '+
         'I6:2 VI7:2 ii7:2 V7:2 iii7:2 VI7:2 ii7:2 V7:2 I6:2 I7:2 IV6:2 ♯iv°7:2 ii7:2 V7:2 I6:4',
  extdom:'Imaj7:4 VI7:4 II7:4 V7:4 III7:4 VI7:4 II7:4 V7:4 Imaj7:8',
  backdoor:'Imaj7:4 vi7:4 iv7:4 ♭VII7:4 Imaj7:4 ii7:2 V7:2 Imaj7:8',
  turn:()=>[0,1,2].map(()=>pick(['Imaj7:4 vi7:4 ii7:4 V7:4','iii7:4 VI7:4 ii7:4 V7:4','Imaj7:4 VI7:4 ii7:4 V7:4','Imaj7:2 vi7:2 ii7:2 V7:2 iii7:2 VI7:2 ii7:2 V7:2'])).join(' ')+' Imaj7:4',
  tritturn:'Imaj7:4 ♭III7:4 ♭VImaj7:4 ♭II7:4 Imaj7:4 VI7:4 ii7:4 ♭II7:4 Imaj7:8',
  chrom:'iii7:2 VI7:2 ♭iii7:2 ♭VI7:2 ii7:2 V7:2 Imaj7:4',
  coltrane:'ii7:2 ♭III7:2 ♭VImaj7:2 VII7:2 IIImaj7:2 V7:2 Imaj7:4',
  modal:'i7:64 ♭ii7:32 i7:32',
  dimmix:'Imaj7:4 ♯i°7:4 ii7:4 ♯ii°7:4 iii7:4 VI13♭9:4 ii7:4 V13♭9:4 Imaj7:8',
}
