import { useEffect, useState } from 'react'
import './LegalLayout.css'

/**
 * Shared frame for the two legal pages. Sections are passed in as data, so
 * Privacy.jsx and Terms.jsx hold nothing but their own words, and the contents
 * column, scroll spy and layout are written once here.
 *
 *   <LegalLayout
 *     title="Privacy policy"
 *     effective="[DATE]"
 *     intro={<p>...</p>}
 *     sections={[{ id: 'what-we-collect', heading: 'What we collect', body: <>...</> }]}
 *   />
 */
export default function LegalLayout({ title, effective, intro, sections }) {
  const [activeId, setActiveId] = useState(sections[0]?.id)

  // Scroll spy: whichever heading sits nearest the top of the viewport owns
  // the contents column.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    )

    sections.forEach(({ id }) => {
      const node = document.getElementById(id)
      if (node) observer.observe(node)
    })

    return () => observer.disconnect()
  }, [sections])

  return (
    <>
      <header className="legal-head">
        <div className="legal-head-inner">
          <p className="eyebrow" data-reveal="fade">Legal</p>
          <h1 className="legal-title" data-reveal="clip">{title}</h1>
          <p className="legal-effective" data-reveal="fade">
            <span className="mono-label">Effective</span>
            {effective}
          </p>
        </div>
      </header>

      <div className="legal-body">
        <nav className="legal-toc" aria-label="Contents">
          <p className="mono-label">Contents</p>
          <ol>
            {sections.map((section, i) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={activeId === section.id ? 'is-active' : undefined}
                >
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="legal-content">
          <div className="legal-intro" data-reveal>{intro}</div>

          {sections.map((section, i) => (
            <section id={section.id} key={section.id} data-reveal="fade">
              <h2>
                <span className="legal-index">{String(i + 1).padStart(2, '0')}</span>
                {section.heading}
              </h2>
              {section.body}
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
