/** Where the method is mounted in the notebook. Build every method URL from here. */
export const METHOD_PATH = '/method'

export const lessonPath = (id: string) => `${METHOD_PATH}/lesson/${id}`
