import { useState } from 'react'
import { Link } from 'react-router'
import { Lead, Notebook, PageTitle, Section, UnitLabel } from '../../ui'
import { NotebookHeader } from '../shell/NotebookHeader'
import { LadderBlock } from './LadderBlock'
import { PENT_PATH } from './paths'
import s from './Pentatonics.module.css'

/** /pentatonics/map — the altitude ladder of any chord type, in any key. */
export function MapPage() {
  const [q, setQ] = useState('m7')
  return (
    <Notebook>
      <NotebookHeader section="Pentatonics" aside={<Link className={s.count} to={PENT_PATH}>← the class</Link>} />
      <main>
        <Section>
          <UnitLabel>Pentatonics · tool</UnitLabel>
          <PageTitle>The pentatonic map</PageTitle>
          <Lead>
            Pick a chord type and a root. The ladder lists the pentatonics that work over it, from the ground up, with what
            each gives you over the chord. Click a rung to see it on the neck; ▶ plays it over the chord.
          </Lead>
        </Section>
        <Section>
          <LadderBlock key={q} q={q} pickType onType={setQ} />
        </Section>
      </main>
    </Notebook>
  )
}
