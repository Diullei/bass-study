import type { SongDef } from './types'

// Bass parts are written an octave above sounding, as usual for bass; guide melodies at sounding pitch.
// Bar syntax: "NOTE:dur" tokens (r = rest, ~ = tie). "R:" / ":R" = repeat start / end, "1." / "2." = endings.
export const SONGS: Record<string, SongDef> = {
 saintsD:{key:'D',time:4,win:[0,4],title:'When the Saints Go Marching In',credit:'Traditional · bass part on open strings',
  bars:['r:w','D3:h A2:h','D3:h A2:h','D3:h A2:h','D3:h A2:h','D3:h A2:h','D3:h A2:h','A2:h E2:h','A2:h E2:h','D3:h A2:h','D3:h A2:h','G3:h D3:h','G3:h D3:h','D3:h A2:h','A2:h E2:h','D3:w'],
  guide:['r:q D4:q F#4:q G4:q','A4:w','r:q D4:q F#4:q G4:q','A4:w','r:q D4:q F#4:q G4:q','A4:h F#4:h','D4:h F#4:h','E4:w','r:q F#4:q F#4:q E4:q','D4:hd D4:q','F#4:h A4:h','A4:h G4:h','r:h F#4:q G4:q','A4:h F#4:h','D4:h E4:h','D4:w'],
  chords:[[1,0,'D'],[7,0,'A7'],[9,0,'D'],[10,0,'D7'],[11,0,'G'],[13,0,'D'],[14,0,'A7'],[15,0,'D']]},
 auclair:{key:'C',time:4,win:[0,4],title:'Au clair de la lune',credit:'French traditional',bars:['R: G3:q G3:q G3:q A3:q','B3:h A3:h','G3:q B3:q A3:q A3:q','G3:w :R']},
 hotcross:{key:'C',time:4,win:[0,4],title:'Hot Cross Buns',credit:'Traditional',bars:['R: F3:q E3:q D3:h','F3:q E3:q D3:h','D3:e D3:e D3:e D3:e E3:e E3:e E3:e E3:e','F3:q E3:q D3:h :R']},
 twinkle:{key:'C',time:4,win:[0,4],title:'Twinkle, Twinkle, Little Star',credit:'Traditional (Ah! vous dirai-je, maman)',
  bars:['C3:q C3:q G3:q G3:q','A3:q A3:q G3:h','F3:q F3:q E3:q E3:q','D3:q D3:q C3:h','G3:q G3:q F3:q F3:q','E3:q E3:q D3:h','G3:q G3:q F3:q F3:q','E3:q E3:q D3:h','C3:q C3:q G3:q G3:q','A3:q A3:q G3:h','F3:q F3:q E3:q E3:q','D3:q D3:q C3:h']},
 frere:{key:'C',time:4,win:[0,4],title:'Frère Jacques',credit:'French traditional',bars:['R: C3:q D3:q E3:q C3:q :R','R: E3:q F3:q G3:h :R','R: G3:e A3:e G3:e F3:e E3:q C3:q :R','R: C3:q G2:q C3:h :R']},
 ode:{key:'C',time:4,win:[0,4],b:true,title:'Ode to Joy',credit:'Ludwig van Beethoven, Symphony No. 9 (1824)',bars:['R: E2:q E2:q F2:q G2:q','G2:q F2:q E2:q D2:q','C2:q C2:q D2:q E2:q','1. E2:qd D2:e D2:h :R','2. D2:qd C2:e C2:h']},
 minuet:{key:'G',time:3,win:[0,4],title:'Minuet in G',credit:'Christian Petzold (once attributed to J. S. Bach)',
  bars:['R: D3:q G2:e A2:e B2:e C3:e','D3:q G2:q G2:q','E3:q C3:e D3:e E3:e F#3:e','G3:q G2:q G2:q','C3:q D3:e C3:e B2:e A2:e','B2:q C3:e B2:e A2:e G2:e','1. F#2:q G2:e A2:e B2:e G2:e','1. A2:hd :R','2. A2:q B2:e A2:e G2:e F#2:e','2. G2:hd']},
 mountain:{key:'Bm',time:4,win:[0,4],title:'In the Hall of the Mountain King',credit:'Edvard Grieg, Peer Gynt (1875)',
  bars:['B2:q C#3:q D3:q E3:q','F#3:q D3:q F#3:h','F3:q C#3:q F3:h','E3:q C3:q E3:h','B2:q C#3:q D3:q E3:q','F#3:q D3:q F#3:q B3:q','A3:q F#3:q D3:q F#3:q','A3:w']},
 canon:{key:'D',time:4,win:[2,7],b:true,title:'Canon in D',credit:'Johann Pachelbel — the ground bass, in 5th/2nd position',
  bars:['D3:q A2:q B2:q F#2:q','G2:q D2:q G2:q A2:q','D3:q A2:q B2:q F#2:q','G2:q D2:q G2:q A2:q','D3:q A2:q B2:q F#2:q','G2:q D2:q G2:q A2:q','D3:q A2:q B2:q F#2:q','G2:q D2:q G2:q A2:q'],
  guide:['r:w','r:w','F#5:q E5:q D5:q C#5:q','B4:q A4:q B4:q C#5:q','D5:q C#5:q B4:q A4:q','G4:q F#4:q G4:q E4:q','D4:e F#4:e A4:e G4:e F#4:e D4:e F#4:e E4:e','D4:e B3:e D4:e A4:e G4:e B4:e A4:e G4:e'],
  chords:[0,1,2,3,4,5,6,7].flatMap(b=>(b%2?['G','D','G','A']:['D','A','Bm','F#m']).map((s,i):[number,number,string]=>[b,i,s]))},
 saintsF:{key:'F',time:4,win:[0,7],title:'When the Saints — walking bass',credit:'Traditional · walking line on the chord chart',
  bars:['r:w','F2:q A2:q C3:q A2:q','F2:q G2:q A2:q E2:q','F2:q A2:q C3:q A2:q','F2:q A2:q G2:q E2:q','F2:q A2:q C3:q D3:q','F2:q A2:q C3:q B2:q','C3:q E3:q G3:q E3:q','C3:q Bb2:q G2:q E2:q','F2:q A2:q C3:q A2:q','F2:q A2:q C3:q B2:q','Bb2:q D3:q F3:q D3:q','Bb2:q A2:q G2:q Gb2:q','F2:q A2:q D3:q Db3:q','C3:q Bb2:q G2:q E2:q','F2:w'],
  guide:['r:q F4:q A4:q Bb4:q','C5:w','r:q F4:q A4:q Bb4:q','C5:w','r:q F4:q A4:q Bb4:q','C5:h A4:h','F4:h A4:h','G4:w','r:q A4:q A4:q G4:q','F4:hd F4:q','A4:h C5:h','C5:h Bb4:h','r:h A4:q Bb4:q','C5:h A4:h','F4:h G4:h','F4:w'],
  chords:[[1,0,'F'],[7,0,'C7'],[9,0,'F'],[10,0,'F7'],[11,0,'B♭'],[13,0,'F'],[14,0,'C7'],[15,0,'F']],rnKey:'F'},
}
