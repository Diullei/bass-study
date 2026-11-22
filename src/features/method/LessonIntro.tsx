import { fretRefs } from '../../notation/FretRef'
import { useMemo } from 'react'
import { UNITS } from '../../curriculum/lessons'
import type { Lesson } from '../../curriculum/types'
import { lessonIntro, type Fact } from '../../engine'
import { Staff } from '../../notation/Staff'
import { useAppState } from '../../state/AppState'
import { FactList, Lead, PageTitle, Paper, Tag, UnitLabel } from '../../ui'

const renderFact = (f: Fact) =>
  typeof f === 'string' ? (
    f
  ) : (
    <>
      {f.pre}
      <b>{f.strong}</b>
      {f.post}
    </>
  )

/** Unit, title, lead text, facts and the "new material" illustration. */
export function LessonIntro({ lesson: L, number, prev }: { lesson: Lesson; number: number; prev?: Lesson }) {
  const { settings: S } = useAppState()
  const intro = useMemo(
    () => lessonIntro(L, { strings: S.strings, bars: S.bars }, prev),
    [L, S.strings, S.bars, prev],
  )
  const tags = (
    <>
      {L.tag && <Tag tone="blue">{L.tag}</Tag>}
      {L.song && <Tag tone="red">song</Tag>}
      {L.chart && !L.tag && <Tag>chart</Tag>}
    </>
  )
  return (
    <>
      <UnitLabel>{UNITS[L.u]}</UnitLabel>
      <PageTitle number={`${number}.`} tags={L.tag || L.song || L.chart ? tags : undefined}>
        {L.t}
      </PageTitle>
      <Lead>{fretRefs(L.txt)}</Lead>
      <FactList items={intro.facts.map(renderFact)} />
      {intro.paper && (
        <Paper tape tilt="left" label="new">
          <Staff
            score={intro.paper}
            flags={{
              tab: true,
              names: true,
              finger: !L.chart && !L.tag,
              count: L.newR.length > 0,
              rn: true,
              syms: true,
              nStr: S.strings === '4' ? 4 : 5,
              noFinal: true,
            }}
          />
        </Paper>
      )}
    </>
  )
}
