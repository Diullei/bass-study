import { Link } from 'react-router'
import { SECTIONS } from '../sections'
import { IndexEntry, IndexList, Notebook, PageTitle, Paper, PencilNote, UnitLabel } from '../ui'
import s from './CoverPage.module.css'

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

/** A few bars drawn on the cover label: bass clef and a walking line. */
function CoverStaff() {
  const lines = [0, 1, 2, 3, 4].map((i) => {
    const y = 14 + i * 9
    return `M4 ${y} Q 70 ${y - 0.8} 140 ${y + 0.4} T 276 ${y - 0.3}`
  })
  // E G A B C — on the staff, rising from the 2nd line
  const notes: [number, number][] = [
    [92, 45.5], [136, 41], [180, 36.5], [224, 32], [262, 27.5],
  ]
  return (
    <svg className={s.staff} viewBox="0 0 280 64" aria-hidden>
      {lines.map((d) => (
        <path key={d} d={d} fill="none" stroke="var(--staff)" strokeWidth="1.2" />
      ))}
      <text x="8" y="40" className={s.clef}>
        𝄢
      </text>
      {notes.map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx="5.6" ry="4" transform={`rotate(-22 ${x} ${y})`} fill="var(--ink)" />
          <path d={`M ${x + 5} ${y - 1} Q ${x + 5.6} ${y - 14} ${x + 5} ${y - 27}`} stroke="var(--ink)" strokeWidth="1.4" fill="none" />
        </g>
      ))}
    </svg>
  )
}

/** "/" — the notebook's cover and its contents page. Every feature is a section listed here. */
export function CoverPage() {
  return (
    <div className={s.desk}>
      <div className={s.spread}>
        <section className={s.cover} aria-label="Cover">
          <span className={s.band} aria-hidden />
          <Paper tape tilt="left" className={s.label}>
            <span className={s.vol}>Vol. 1</span>
            <h1 className={s.title}>Bass Study</h1>
            <CoverStaff />
            <dl className={s.fields}>
              <div>
                <dt>Subject</dt>
                <dd>Electric bass</dd>
              </div>
              <div>
                <dt>Inside</dt>
                <dd>reading · harmony · grooves</dd>
              </div>
            </dl>
          </Paper>
          <p className={s.imprint}>practice notebook</p>
        </section>

        <Notebook className={s.contents}>
          <div className={s.rings} aria-hidden>
            {Array.from({ length: 14 }, (_, i) => (
              <span key={i} />
            ))}
          </div>
          <header className={s.head}>
            <UnitLabel>Inside this notebook</UnitLabel>
            <PageTitle>Contents</PageTitle>
          </header>

          <IndexList>
            {SECTIONS.map(({ id, title, blurb, path, Summary, meta }, i) => (
              <IndexEntry key={id} number={`${ROMAN[i]}.`} title={<Link to={path}>{title}</Link>} meta={meta}>
                <p>{blurb}</p>
                {Summary && <Summary />}
              </IndexEntry>
            ))}
            <IndexEntry number={`${ROMAN[SECTIONS.length]}.`} title="to be written…" muted>
              The next section goes here.
            </IndexEntry>
          </IndexList>

          <footer className={s.appendix}>
            <PencilNote>
              Appendix — <Link to="/design-system">the design system</Link>: the paper, pens and parts this notebook is
              drawn with.
            </PencilNote>
          </footer>

        </Notebook>

        {/* index tabs: tucked between the pages, so the page edge covers their inner end */}
        <nav className={s.tabs} aria-label="Sections">
          {SECTIONS.map((sec) => (
            <Link key={sec.id} to={sec.path} className={s.tab} style={{ background: sec.tab }}>
              {sec.tabLabel}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
