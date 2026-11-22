import { fretRefs } from '../../notation/FretRef'
import { Fragment } from 'react'

/** Text with **bold** marks. */
export const Rich = ({ text }: { text: string }) => (
  <>
    {text.split('**').map((part, i) => (i % 2 ? <b key={i}>{fretRefs(part)}</b> : <Fragment key={i}>{fretRefs(part)}</Fragment>))}
  </>
)
