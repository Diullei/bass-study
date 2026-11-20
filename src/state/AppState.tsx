import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LESSONS } from '../curriculum/lessons'
import type { Lesson } from '../curriculum/types'
import { normalizeSettings, type Settings } from './settings'
import { KEYS, load, store } from './storage'

export interface LessonProgress {
  /** Clean run-throughs recorded. */
  clean: number
  /** Best quiz score, in percent. */
  quiz: number
}

interface AppState {
  settings: Settings
  setSetting: <K extends keyof Settings>(k: K, v: Settings[K]) => void
  progressOf: (L: Lesson) => LessonProgress
  /** Records a clean run. Returns true if this mastered the lesson. */
  addClean: (L: Lesson) => boolean
  /** Records a quiz score. Returns true if this mastered the lesson. */
  addQuiz: (L: Lesson, score: number) => boolean
  resetProgress: () => void
  mastered: (L: Lesson) => boolean
  /** Lessons available with the current bass (4-string hides low-B lessons). */
  lessons: Lesson[]
  currentId: string
  setCurrentId: (id: string) => void
}

const Ctx = createContext<AppState | null>(null)

const EMPTY: LessonProgress = { clean: 0, quiz: 0 }

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => normalizeSettings(load(KEYS.settings, {})))
  const [progress, setProgress] = useState<Record<string, LessonProgress>>(() => load(KEYS.progress, {}))
  const [currentId, setCurrentId] = useState<string>(() => load(KEYS.current, LESSONS[0].id))

  useEffect(() => store(KEYS.settings, settings), [settings])
  useEffect(() => store(KEYS.progress, progress), [progress])
  useEffect(() => store(KEYS.current, currentId), [currentId])

  const setSetting = useCallback(<K extends keyof Settings>(k: K, v: Settings[K]) => {
    setSettings((s) => ({ ...s, [k]: v }))
  }, [])

  const progressOf = useCallback((L: Lesson) => progress[L.id] || EMPTY, [progress])

  const masteredWith = useCallback(
    (p: LessonProgress, L: Lesson) =>
      (L.noEx || p.clean >= settings.cleanNeeded) && (!L.quiz || p.quiz >= settings.quizPass),
    [settings.cleanNeeded, settings.quizPass],
  )
  const mastered = useCallback((L: Lesson) => masteredWith(progressOf(L), L), [masteredWith, progressOf])

  const addClean = useCallback(
    (L: Lesson) => {
      const before = progressOf(L)
      const after = { ...before, clean: before.clean + 1 }
      setProgress((p) => ({ ...p, [L.id]: after }))
      return !masteredWith(before, L) && masteredWith(after, L)
    },
    [progressOf, masteredWith],
  )

  const addQuiz = useCallback(
    (L: Lesson, score: number) => {
      const before = progressOf(L)
      const after = { ...before, quiz: Math.max(before.quiz, score) }
      setProgress((p) => ({ ...p, [L.id]: after }))
      return !masteredWith(before, L) && masteredWith(after, L)
    },
    [progressOf, masteredWith],
  )

  const resetProgress = useCallback(() => setProgress({}), [])

  const lessons = useMemo(() => LESSONS.filter((L) => !(settings.strings === '4' && L.b)), [settings.strings])

  const value = useMemo<AppState>(
    () => ({
      settings, setSetting, progressOf, addClean, addQuiz, resetProgress, mastered, lessons, currentId, setCurrentId,
    }),
    [settings, setSetting, progressOf, addClean, addQuiz, resetProgress, mastered, lessons, currentId],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAppState(): AppState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAppState must be used inside <AppStateProvider>')
  return v
}

