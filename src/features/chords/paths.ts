export const CHORDS_PATH = '/chords'
export const chapterPath = (id: string) => `${CHORDS_PATH}/${id}`
export const LAWS_PATH = `${CHORDS_PATH}/laws`
export const lawPath = (n: number) => `${LAWS_PATH}#law-${n}`
export const TESTS_PATH = `${CHORDS_PATH}/test-progressions`
export const GEN_PATH = `${CHORDS_PATH}/generator`
export const FIND_PATH = `${CHORDS_PATH}/finder`
export const CHECK_PATH = `${CHORDS_PATH}/checker`
