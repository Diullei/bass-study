import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent, useLayoutEffect } from 'react'
import { KEYS, load, store } from '../../state/storage'
import { Button, cx, Stepper } from '../../ui'
import { Display } from './Display'
import { metronome } from './engine'
import { useSuggestedTempo } from './MetronomeTempo'
import { DrumsPanel, PlayPanel, PracticePanel, RhythmPanel, SetlistPanel, SettingsPanel } from './Panels'
import { useMetronome } from './useMetronome'
import styles from './Metronome.module.css'

interface Pos {
  x: number
  y: number
}

const TABS = [
  { id: 'play', label: 'Play' },
  { id: 'rhythm', label: 'Rhythm' },
  { id: 'drums', label: 'Drums' },
  { id: 'practice', label: 'Practice' },
  { id: 'setlist', label: 'Setlist' },
  { id: 'settings', label: 'Settings' },
] as const
type Tab = (typeof TABS)[number]['id']

/**
 * The floating metronome: a sticky note in the corner that opens a draggable window,
 * compact (one line) or full (display + six panels). Mounted once for the whole app,
 * so it keeps running from page to page.
 */
export function Metronome() {
  const pageTempo = useSuggestedTempo()
  const { S, live, m } = useMetronome()
  const [open, setOpenState] = useState<boolean>(() => load(KEYS.metroOpen, false))
  const setOpen = (v: boolean | ((o: boolean) => boolean)) =>
    setOpenState((o) => {
      const next = typeof v === 'function' ? v(o) : v
      store(KEYS.metroOpen, next)
      return next
    })
  const [compact, setCompact] = useState<boolean>(() => load(KEYS.metroCompact, true))
  const [tab, setTabState] = useState<Tab>(() => {
    const saved = load<string>(KEYS.metroTab, 'play')
    return TABS.some((t) => t.id === saved) ? (saved as Tab) : 'play'
  })
  const setTab = (t: Tab) => (setTabState(t), store(KEYS.metroTab, t))
  const [stage, setStage] = useState(false)
  const [pos, setPos] = useState<Pos | null>(() => load<Pos | null>(KEYS.metroPos, null))
  const win = useRef<HTMLDivElement>(null)
  const drag = useRef<{ dx: number; dy: number } | null>(null)

  useEffect(() => store(KEYS.metroCompact, compact), [compact])

  // keep the window on screen when the browser resizes
  const [, force] = useState(0)
  useEffect(() => {
    const onResize = () => force((n) => n + 1)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  // the window changes size when it opens and when it switches between compact and full: place it again after that
  useLayoutEffect(() => {
    force((n) => n + 1)
  }, [open, compact])
  const placed = (() => {
    if (!pos || window.innerWidth < 560 || !win.current) return undefined
    // what is really visible: on a phone or tablet the address bar makes innerHeight too tall
    const vw = window.visualViewport?.width ?? window.innerWidth
    const vh = window.visualViewport?.height ?? window.innerHeight
    const w = win.current.offsetWidth
    const h = Math.min(win.current.offsetHeight, vh - 8)
    // never off screen: the top-left corner is clamped last, so the title bar (and its close button) always shows
    return {
      left: Math.max(0, Math.min(pos.x, vw - w)),
      top: Math.max(0, Math.min(pos.y, vh - h)),
      right: 'auto',
      bottom: 'auto',
      maxHeight: vh - 8,
    }
  })()

  const close = () => {
    m.stop()
    setOpen(false)
  }

  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, input, select') || !win.current) return
    const r = win.current.getBoundingClientRect()
    drag.current = { dx: e.clientX - r.left, dy: e.clientY - r.top }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (drag.current) setPos({ x: e.clientX - drag.current.dx, y: e.clientY - drag.current.dy })
  }
  const onUp = () => {
    if (!drag.current) return
    drag.current = null
    store(KEYS.metroPos, pos)
  }
  const dragProps = { onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: onUp }

  // keys work while the metronome has focus: Space plays, arrows change the tempo
  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement
    if (/^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(t.tagName)) return
    if (e.code === 'Space') {
      e.preventDefault()
      e.stopPropagation()
      m.toggle()
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault()
      m.step('bpm', 1)
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault()
      m.step('bpm', -1)
    }
  }

  const pageTempoBtn = pageTempo != null && (
    <Button size="sm" variant="pencil" className={styles.pageBtn} title="Set the metronome to this page's tempo" onClick={() => m.set('bpm', pageTempo)}>
      ♩={pageTempo}
    </Button>
  )

  return (
    <>
      <button type="button" className={cx(styles.fab, live.playing && styles.on)} onClick={() => setOpen((o) => !o)} title="Metronome" data-hint={`${S.bpm} bpm · ${S.beats}/${S.note}${live.playing ? ' · playing' : ''}`}>
        <span className={styles.fabIcon} aria-hidden>
          ♩<i className={styles.led} />
        </span>
        <span>Metronome</span>
      </button>

      <div
        ref={win}
        className={cx(styles.win, !open && styles.hidden, compact && styles.compact)}
        style={placed}
        role="dialog"
        aria-label="Metronome"
        aria-hidden={!open}
        tabIndex={-1}
        onKeyDown={onKey}
      >
        {compact ? (
          <div className={styles.mini} {...dragProps}>
            <span className={styles.grip} aria-hidden>
              ⋮⋮
            </span>
            <Button variant={live.playing ? 'default' : 'ink'} icon size="sm" title="Play / stop" onClick={() => m.toggle()}>
              {live.playing ? '■' : '▶'}
            </Button>
            <Stepper label="Tempo" value={S.bpm} onStep={(d) => m.step('bpm', d)} />
            <Button size="sm" onClick={() => m.tap('bpm')}>
              tap
            </Button>
            <span className={styles.dots} aria-hidden>
              {S.accents.slice(0, 16).map((a, i) => (
                <i key={i} className={cx(live.beat === i && !live.muted && (live.lvl === 3 ? styles.dotAcc : styles.dotOn), a === 0 && styles.dotMute)} />
              ))}
            </span>
            {pageTempoBtn}
            <Button icon size="sm" variant="ghost" title="Open the full metronome" onClick={() => setCompact(false)}>
              ⤢
            </Button>
            <Button icon size="sm" variant="ghost" title="Stop and close" onClick={close}>
              ×
            </Button>
          </div>
        ) : (
          <>
            <div className={styles.bar} {...dragProps}>
              <span className={styles.title}>♩ Metronome</span>
              {pageTempoBtn}
              <Button size="sm" variant="ghost" title="One-line view" onClick={() => setCompact(true)}>
                ⤡
              </Button>
              <Button icon size="sm" variant="ghost" title="Hide (keeps playing)" onClick={() => setOpen(false)}>
                –
              </Button>
              <Button icon size="sm" variant="ghost" title="Stop and close" onClick={close}>
                ×
              </Button>
            </div>
            <Display />
            <nav className={styles.tabs} role="tablist" aria-label="Metronome panels">
              {TABS.map((t) => (
                <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={cx(styles.tab, tab === t.id && styles.tabOn)} onClick={() => setTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </nav>
            <div className={styles.body} role="tabpanel">
              {tab === 'play' && <PlayPanel onRhythm={() => setTab('rhythm')} onStage={() => setStage(true)} />}
              {tab === 'rhythm' && <RhythmPanel />}
              {tab === 'drums' && <DrumsPanel />}
              {tab === 'practice' && <PracticePanel />}
              {tab === 'setlist' && <SetlistPanel />}
              {tab === 'settings' && <SettingsPanel />}
            </div>
          </>
        )}
      </div>

      <Flash />
      {stage && <Stage onClose={() => setStage(false)} />}
    </>
  )
}

/** A quick wash of colour over the page on beats / tempo changes (if switched on). */
function Flash() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(
    () =>
      metronome.onFlash((c) => {
        const el = ref.current
        if (!el) return
        el.className = `${styles.flash} ${styles['flash_' + c]}`
        el.style.transition = 'none'
        el.style.opacity = c === 'beat' ? '0.25' : '0.45'
        requestAnimationFrame(() => {
          el.style.transition = 'opacity .15s'
          el.style.opacity = '0'
        })
      }),
    [],
  )
  return <div ref={ref} className={styles.flash} aria-hidden />
}

/** Full screen: the beat number written huge, for playing from across the room. */
function Stage({ onClose }: { onClose: () => void }) {
  const { S, live, m } = useMetronome()
  useEffect(() => {
    try {
      void document.documentElement.requestFullscreen?.().catch(() => {})
    } catch {
      /* not allowed */
    }
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      try {
        if (document.fullscreenElement) void document.exitFullscreen()
      } catch {
        /* already left */
      }
    }
  }, [onClose])
  const n = live.beat == null ? 1 : live.beat + 1
  return (
    <div className={styles.stage} onClick={() => m.toggle()} role="dialog" aria-label="Stage view">
      <Button size="sm" className={styles.stageClose} onClick={(e) => (e.stopPropagation(), onClose())}>
        Close
      </Button>
      <div key={live.tick} className={cx(styles.stageBeat, live.playing && !live.muted && (live.lvl === 3 ? styles.stageAcc : styles.stageHi))}>
        {n}
      </div>
      <div className={styles.stageBpm}>♩ = {S.bpm}</div>
      <div className={styles.stageInfo}>
        {!live.playing ? 'tap anywhere to start' : live.counting ? 'count-in' : live.muted ? '— silent —' : S.barCounter ? `bar ${live.bar + 1}` : ''}
      </div>
    </div>
  )
}
