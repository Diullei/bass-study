/** A small synthesized drum kit for play-along. */

const noiseBuffers = new WeakMap<AudioContext, AudioBuffer>()

function noise(AC: AudioContext): AudioBuffer {
  let b = noiseBuffers.get(AC)
  if (!b) {
    b = AC.createBuffer(1, AC.sampleRate, AC.sampleRate)
    const d = b.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    noiseBuffers.set(AC, b)
  }
  return b
}

function noiseHit(AC: AudioContext, out: AudioNode, t: number, vol: number, highpass: number, decay: number) {
  const s = AC.createBufferSource()
  const f = AC.createBiquadFilter()
  const g = AC.createGain()
  s.buffer = noise(AC)
  f.type = 'highpass'
  f.frequency.value = highpass
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.002)
  g.gain.exponentialRampToValueAtTime(0.001, t + decay)
  s.connect(f).connect(g).connect(out)
  s.start(t)
  s.stop(t + decay + 0.02)
}

export function kick(AC: AudioContext, out: AudioNode, t: number, vel = 0.9) {
  const o = AC.createOscillator()
  const g = AC.createGain()
  o.frequency.setValueAtTime(150, t)
  o.frequency.exponentialRampToValueAtTime(45, t + 0.12)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.9 * vel, t + 0.005)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
  o.connect(g).connect(out)
  o.start(t)
  o.stop(t + 0.32)
}

export function snare(AC: AudioContext, out: AudioNode, t: number, vel = 0.9) {
  noiseHit(AC, out, t, 0.45 * vel, 1500, 0.16)
  const o = AC.createOscillator()
  const g = AC.createGain()
  o.type = 'triangle'
  o.frequency.setValueAtTime(190, t)
  g.gain.setValueAtTime(0.3 * vel, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
  o.connect(g).connect(out)
  o.start(t)
  o.stop(t + 0.1)
}

export const hat = (AC: AudioContext, out: AudioNode, t: number, vel = 0.1) => noiseHit(AC, out, t, vel, 7000, 0.04)
export const pedalHat = (AC: AudioContext, out: AudioNode, t: number, vel = 0.1) => noiseHit(AC, out, t, vel, 6000, 0.05)
export const ride = (AC: AudioContext, out: AudioNode, t: number, vel = 0.09) => noiseHit(AC, out, t, vel, 5000, 0.35)
