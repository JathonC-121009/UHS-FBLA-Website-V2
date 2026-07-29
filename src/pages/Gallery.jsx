import { useEffect, useState } from 'react'
import './Gallery.css'

// Route + nav settings for this page. See src/pageRegistry.js.
export const meta = {
  label: 'Gallery',
  order: 50,
  title: 'Urbana FBLA — Gallery',
}

const CAPTION = 'SLC 2026 — State Leadership Conference'
const B = 'https://res.cloudinary.com/dmgisz0pf/image/upload/f_auto,q_auto,w_1200'

// tall: true reproduces the .tall (grid-row span 2) items from the original layout.
const PHOTOS = [
  { src: `${B}/v1777947577/FBLA-2026-D23-636_anhqwc.jpg`, tall: true },
  { src: `${B}/v1777947555/SLC-2026-DAY1-24_whoy5q.jpg` },
  { src: `${B}/v1777947562/SLC-2026-DAY1-290_tjlyxa.jpg` },
  { src: `${B}/v1777947566/FBLA-2026-D23-281_kfgi8b.jpg`, tall: true },
  { src: `${B}/v1777947567/FBLA-2026-D23-416_m28cmz.jpg` },
  { src: `${B}/v1777947572/FBLA-2026-D23-470_p7mgwu.jpg` },
  { src: `${B}/v1777947566/FBLA-2026-D23-148_tvlg05.jpg`, tall: true },
  { src: `${B}/v1777947550/SLC-2026-DAY1-7_qjizqp.jpg` },
  { src: `${B}/v1777947573/FBLA-2026-D23-471_f5a4vg.jpg` },
  { src: `${B}/v1777947569/FBLA-2026-D23-450_uenn7x.jpg`, tall: true },
  { src: `${B}/v1777947574/FBLA-2026-D23-488_epsdmx.jpg` },
  { src: `${B}/v1777947564/FBLA-2026-D23-128_zcoepp.jpg` },
  { src: `${B}/v1777947559/SLC-2026-DAY1-107_jdb5kp.jpg`, tall: true },
  { src: `${B}/v1777947568/FBLA-2026-D23-441_w4lfun.jpg` },
  { src: `${B}/v1777947561/SLC-2026-DAY1-205_emyotk.jpg` },
  { src: `${B}/v1777946367/SLC-2026-DAY1-346_kxcdd5.jpg`, tall: true },
  { src: `${B}/v1777947570/FBLA-2026-D23-455_emp0xu.jpg` },
  { src: `${B}/v1777947571/FBLA-2026-D23-466_i9mpsw.jpg` },
  { src: `${B}/v1777947565/FBLA-2026-D23-142_tsolkj.jpg`, tall: true },
  { src: `${B}/v1777947554/SLC-2026-DAY1-18_rqdeqs.jpg` },
  { src: `${B}/v1777947552/SLC-2026-DAY1-15_fprhjm.jpg` },
  { src: `${B}/v1777947558/SLC-2026-DAY1-101_tl3an2.jpg` },
  { src: `${B}/v1777946365/SLC-2026-DAY1-303_ggzsbb.jpg` },
  { src: `${B}/v1777946366/SLC-2026-DAY1-342_mcraom.jpg` },
  { src: `${B}/v1777947563/SLC-2026-DAY1-302_hel9l6.jpg` },
  { src: `${B}/v1777947555/SLC-2026-DAY1-32_zowfjn.jpg` },
  { src: `${B}/v1777947578/SLC-2026-DAY1-10_pcbwno.jpg` },
  { src: `${B}/v1777947556/SLC-2026-DAY1-50_ando8h.jpg` },
  { src: `${B}/v1777947553/SLC-2026-DAY1-17_b1x0au.jpg` },
  { src: `${B}/v1777947576/FBLA-2026-D23-545_vmpnnt.jpg` },
  { src: `${B}/v1777947551/SLC-2026-DAY1-8_uxwqfv.jpg` },
  { src: `${B}/v1777947575/FBLA-2026-D23-509_sqvnlk.jpg` },
]

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <div className="page-hero">
        <p className="page-hero-label">Our Moments</p>
        <h1>Photo <span>Gallery</span></h1>
      </div>

      <section className="gallery-section">
        <div className="gallery-wrap">
          <div className="gallery-grid fi">
            {PHOTOS.map((photo, i) => (
              <div
                className={`gallery-item${photo.tall ? ' tall' : ''}`}
                key={i}
                onClick={() => setLightbox({ src: photo.src, alt: CAPTION })}
              >
                <img src={photo.src} alt={CAPTION} loading="lazy" />
                <div className="overlay"><p>{CAPTION}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <div
        className={`lightbox${lightbox ? ' open' : ''}`}
        onClick={() => setLightbox(null)}
      >
        <button className="lb-close" onClick={() => setLightbox(null)}>✕</button>
        {lightbox && (
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    </>
  )
}
