import type { ReactNode } from 'react'

/**
 * Tally marks — how musicians count run-throughs on paper.
 * Groups of five: four strokes crossed by a fifth. Empty slots up to `total` are faint.
 */
export function Tally({ count, total, label }: { count: number; total: number; label?: string }) {
  const n = Math.max(total, count)
  const groups = Math.ceil(n / 5)
  const W = groups * 34
  const strokes: ReactNode[] = []
  for (let i = 0; i < n; i++) {
    const g = Math.floor(i / 5)
    const k = i % 5
    const done = i < count
    const x = g * 34 + 4 + k * 6
    const jit = Math.sin(i * 7.3) * 1.2
    strokes.push(
      k === 4 ? (
        <path
          key={i}
          d={`M${g * 34 + 1},${19 + jit} L${g * 34 + 27},${5 - jit}`}
          stroke={done ? 'var(--red-pen)' : 'var(--rule)'}
          strokeWidth={2.2}
          strokeLinecap="round"
        />
      ) : (
        <path
          key={i}
          d={`M${x + jit * 0.4},3 Q${x + 1 + jit},12 ${x - jit * 0.3},21`}
          stroke={done ? 'var(--ink)' : 'var(--rule)'}
          strokeWidth={2.2}
          fill="none"
          strokeLinecap="round"
        />
      ),
    )
  }
  return (
    <svg
      width={W}
      height={24}
      viewBox={`0 0 ${W} 24`}
      role="img"
      aria-label={label ?? `${count} of ${total}`}
      style={{ verticalAlign: 'middle' }}
    >
      {strokes}
    </svg>
  )
}
