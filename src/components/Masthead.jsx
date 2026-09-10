/**
 * The page header every inner page opens with: mono eyebrow, display title,
 * optional lede, and an optional metadata column set against a grid that
 * drifts with the scroll. Styled in index.css under `.masthead`.
 *
 *   <Masthead
 *     eyebrow="Leadership"
 *     title={<>Chapter <em>Officers</em></>}
 *     lede="Eleven students run this chapter."
 *     meta={[{ label: 'Term', value: '2026 / 2027' }]}
 *   />
 */
export default function Masthead({ eyebrow, title, lede, meta = [] }) {
  return (
    <header className="masthead" data-reveal-group>
      <div className="masthead-grid" data-parallax="0.06" aria-hidden="true" />
      <div className="masthead-inner">
        <div>
          {eyebrow && (
            <p className="eyebrow" data-reveal="fade">
              {eyebrow}
            </p>
          )}
          <h1 className="masthead-title" data-reveal="clip">
            {title}
          </h1>
          {lede && (
            <p className="masthead-lede" data-reveal>
              {lede}
            </p>
          )}
        </div>

        {meta.length > 0 && (
          <dl className="masthead-meta" data-reveal="right">
            {meta.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </header>
  )
}
