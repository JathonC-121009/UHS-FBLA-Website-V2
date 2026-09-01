import { useCallback, useEffect, useMemo, useState } from 'react'
import './Gallery.css'

// Route + nav settings for this page. See src/pageRegistry.js.
export const meta = {
  label: 'Gallery',
  order: 50,
  title: 'Urbana FBLA — Gallery',
}

/* ---------------------------------------------------------------------------
   PHOTOS — sourced from the Cloudinary `gallery` folder (cloud: dmgisz0pf).

   This account uses Cloudinary's dynamic folders, so the folder lives in
   `asset_folder` and NOT in the public_id — a `prefix=Gallery` query returns
   nothing. List the whole cloud and filter client-side instead:

       curl -s -u "<api_key>:<api_secret>" \
         "https://api.cloudinary.com/v1_1/dmgisz0pf/resources/image?type=upload&max_results=500" \
         | python3 -c "import json,sys; [print(f\"  {{ src: 'v{r['version']}/{r['public_id']}.{r['format']}', w: {r['width']}, h: {r['height']} }},\") for r in json.load(sys.stdin)['resources'] if r.get('asset_folder') == 'Gallery']"

   w/h are required: they decide which photos get a tall tile, and they reserve
   each tile's space so the grid doesn't reflow as images load. Nothing else on
   this page needs to change — captions, the filter bar and the lightbox are all
   derived from these filenames by the parser below.
   ------------------------------------------------------------------------ */
const CLOUD_NAME = 'dmgisz0pf'

const PHOTOS = [
  { src: 'v1777947550/SLC-2026-DAY1-7_qjizqp.jpg', w: 2000, h: 1333 },
  { src: 'v1777947564/FBLA-2026-D23-128_zcoepp.jpg', w: 2000, h: 1333 },
  { src: 'v1777947551/SLC-2026-DAY1-8_uxwqfv.jpg', w: 2000, h: 1333 },
  { src: 'v1777947565/FBLA-2026-D23-142_tsolkj.jpg', w: 1333, h: 2000 },
  { src: 'v1777947578/SLC-2026-DAY1-10_pcbwno.jpg', w: 2000, h: 1333 },
  { src: 'v1777947566/FBLA-2026-D23-148_tvlg05.jpg', w: 1333, h: 2000 },
  { src: 'v1777947552/SLC-2026-DAY1-15_fprhjm.jpg', w: 2000, h: 1333 },
  { src: 'v1777947566/FBLA-2026-D23-281_kfgi8b.jpg', w: 1333, h: 2000 },
  { src: 'v1777947553/SLC-2026-DAY1-17_b1x0au.jpg', w: 2000, h: 1333 },
  { src: 'v1777947567/FBLA-2026-D23-416_m28cmz.jpg', w: 2000, h: 1333 },
  { src: 'v1777947554/SLC-2026-DAY1-18_rqdeqs.jpg', w: 2000, h: 1333 },
  { src: 'v1777947568/FBLA-2026-D23-441_w4lfun.jpg', w: 2000, h: 1333 },
  { src: 'v1777947555/SLC-2026-DAY1-24_whoy5q.jpg', w: 2000, h: 1333 },
  { src: 'v1777947569/FBLA-2026-D23-450_uenn7x.jpg', w: 1333, h: 2000 },
  { src: 'v1777947555/SLC-2026-DAY1-32_zowfjn.jpg', w: 2000, h: 1333 },
  { src: 'v1777947570/FBLA-2026-D23-455_emp0xu.jpg', w: 1999, h: 1333 },
  { src: 'v1777947556/SLC-2026-DAY1-50_ando8h.jpg', w: 2000, h: 1333 },
  { src: 'v1777947571/FBLA-2026-D23-466_i9mpsw.jpg', w: 2000, h: 1333 },
  { src: 'v1777947557/SLC-2026-DAY1-82_ftiuqm.jpg', w: 1333, h: 2000 },
  { src: 'v1777947572/FBLA-2026-D23-470_p7mgwu.jpg', w: 2000, h: 1333 },
  { src: 'v1777947558/SLC-2026-DAY1-101_tl3an2.jpg', w: 2000, h: 1333 },
  { src: 'v1777947573/FBLA-2026-D23-471_f5a4vg.jpg', w: 2000, h: 1333 },
  { src: 'v1777947559/SLC-2026-DAY1-107_jdb5kp.jpg', w: 1333, h: 2000 },
  { src: 'v1777947574/FBLA-2026-D23-488_epsdmx.jpg', w: 2000, h: 1333 },
  { src: 'v1777947560/SLC-2026-DAY1-161_cdyqmf.jpg', w: 1333, h: 2000 },
  { src: 'v1777947575/FBLA-2026-D23-509_sqvnlk.jpg', w: 2000, h: 1333 },
  { src: 'v1777947561/SLC-2026-DAY1-205_emyotk.jpg', w: 2000, h: 1333 },
  { src: 'v1777947576/FBLA-2026-D23-545_vmpnnt.jpg', w: 2000, h: 1333 },
  { src: 'v1777947562/SLC-2026-DAY1-290_tjlyxa.jpg', w: 2000, h: 1333 },
  { src: 'v1777947577/FBLA-2026-D23-636_anhqwc.jpg', w: 1333, h: 2000 },
  { src: 'v1777947563/SLC-2026-DAY1-302_hel9l6.jpg', w: 2000, h: 1333 },
  { src: 'v1777946365/SLC-2026-DAY1-303_ggzsbb.jpg', w: 2000, h: 1333 },
  { src: 'v1777946366/SLC-2026-DAY1-342_mcraom.jpg', w: 2000, h: 1333 },
  { src: 'v1777946367/SLC-2026-DAY1-346_kxcdd5.jpg', w: 1333, h: 2000 },
]

/* ---------------------------------------------------------------------------
   CAPTIONS — every caption is parsed from the image filename, so new uploads
   caption themselves. `SLC-2026-DAY1-24` becomes "SLC 2026 — Day 1".

   ALBUMS below only overrides the parser where a filename is too cryptic to
   read (e.g. "D23"). Add a key here whenever a new shoot needs a nicer name;
   anything not listed still falls back to the generic parser.
   ------------------------------------------------------------------------ */
const ALBUMS = {
  'SLC-2026-DAY1': { label: 'SLC 2026 — Day 1', event: 'State Leadership Conference' },
  // "D23" is days 2-3 of the same conference; the photographer just switched
  // naming conventions partway through the week.
  'FBLA-2026-D23': { label: 'SLC 2026 — Days 2–3', event: 'State Leadership Conference' },
}

// Cloudinary appends a random 6-character suffix to uploaded public IDs.
const CLD_SUFFIX = /_[a-z0-9]{6}$/i

// "v1777947555/SLC-2026-DAY1-24_whoy5q.jpg" -> "SLC-2026-DAY1-24"
function publicIdOf(path) {
  const file = path.split('/').pop().replace(/\.[a-z0-9]+$/i, '')
  return file.replace(CLD_SUFFIX, '')
}

// Trailing frame number identifies the shot, not the shoot: "...-DAY1-24" -> 24
function frameOf(id) {
  const match = /-(\d+)$/.exec(id)
  return match ? match[1] : null
}

// Everything before the frame number is the album: "SLC-2026-DAY1-24" -> "SLC-2026-DAY1"
function albumKeyOf(id) {
  return id.replace(/-\d+$/, '').toUpperCase()
}

// Acronyms stay shouted (SLC, FBLA, NLC), years stay bare, words get cased.
function titleToken(token) {
  if (/^\d{4}$/.test(token)) return token
  if (/^[A-Z0-9]{2,5}$/.test(token)) return token
  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase()
}

function deriveAlbum(key) {
  if (ALBUMS[key]) return { key, ...ALBUMS[key] }

  const parts = key.split(/[-_]/)
  const dayIndex = parts.findIndex((part) => /^DAY\d+$/i.test(part))
  const head = (dayIndex === -1 ? parts : parts.slice(0, dayIndex)).map(titleToken).join(' ')
  const day = dayIndex === -1 ? '' : ` — Day ${parts[dayIndex].replace(/\D/g, '')}`

  return { key, label: head + day, event: head }
}

const cloudinary = (path, transform) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}/${path}`

const GALLERY = PHOTOS.map(({ src, w, h }) => {
  const id = publicIdOf(src)
  const album = deriveAlbum(albumKeyOf(id))
  const frame = frameOf(id)
  // Portraits get a double-height tile, so they read as shot instead of being
  // squeezed into a landscape box.
  const portrait = h > w

  return {
    id,
    album,
    frame,
    portrait,
    // g_auto crops around the subject rather than the dead centre, and the
    // requested shape matches the tile so the browser never rescales.
    thumb: cloudinary(src, `f_auto,q_auto,c_fill,g_auto,w_720,h_${portrait ? 1080 : 540}`),
    full: cloudinary(src, 'f_auto,q_auto,w_1600'),
    alt: frame ? `${album.label}, photo ${frame}` : album.label,
  }
})

// One filter chip per album, in the order the albums first appear above.
const FILTERS = [
  { key: 'all', label: 'All Photos', count: GALLERY.length },
  ...GALLERY.reduce((albums, photo) => {
    const existing = albums.find((a) => a.key === photo.album.key)
    if (existing) existing.count += 1
    else albums.push({ key: photo.album.key, label: photo.album.label, count: 1 })
    return albums
  }, []),
]

export default function Gallery() {
  const [filter, setFilter] = useState('all')
  const [index, setIndex] = useState(-1)

  const visible = useMemo(
    () => (filter === 'all' ? GALLERY : GALLERY.filter((photo) => photo.album.key === filter)),
    [filter]
  )

  const current = index >= 0 ? visible[index] : null

  const step = useCallback(
    (delta) => setIndex((i) => (i < 0 ? i : (i + delta + visible.length) % visible.length)),
    [visible.length]
  )

  // Changing the filter would leave the lightbox pointing at a stale index.
  useEffect(() => setIndex(-1), [filter])

  useEffect(() => {
    if (!current) return

    const onKey = (e) => {
      if (e.key === 'Escape') setIndex(-1)
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }

    // Stop the page behind the lightbox from scrolling with it.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [current, step])

  // Warm the neighbours so arrowing through the lightbox is instant.
  useEffect(() => {
    if (index < 0 || visible.length < 2) return
    ;[1, -1].forEach((delta) => {
      const neighbour = visible[(index + delta + visible.length) % visible.length]
      new Image().src = neighbour.full
    })
  }, [index, visible])

  return (
    <>
      <div className="page-hero">
        <p className="page-hero-label">Our Moments</p>
        <h1>Photo <span>Gallery</span></h1>
        <p>Conferences, competition and the people behind Urbana FBLA.</p>
      </div>

      <section className="gallery-section">
        <div className="gallery-wrap">
          <div className="gallery-intro fi">
            <p className="section-label">2026–2027 Season</p>
            <h2 className="section-title">Moments From the Year</h2>
            <div className="divider"></div>
            <p className="section-intro">
              Three days at the Maryland FBLA State Leadership Conference, from
              competition rounds to the awards stage. Hover any photo for its
              caption, or select one to open the full-size view.
            </p>
          </div>

          <div className="gallery-filters fi" role="group" aria-label="Filter photos by event">
            {FILTERS.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`gallery-filter${filter === option.key ? ' active' : ''}`}
                aria-pressed={filter === option.key}
                onClick={() => setFilter(option.key)}
              >
                {option.label}
                <span className="gallery-filter-count">{option.count}</span>
              </button>
            ))}
          </div>

          <div className="gallery-grid">
            {visible.map((photo, i) => (
              // Keying on the filter replays the stagger animation when it changes.
              <button
                type="button"
                className={`gallery-item${photo.portrait ? ' tall' : ''}`}
                key={`${filter}-${photo.id}`}
                style={{ '--stagger': `${Math.min(i, 12) * 40}ms` }}
                onClick={() => setIndex(i)}
                aria-label={`Open ${photo.alt}`}
              >
                <img src={photo.thumb} alt={photo.alt} loading="lazy" decoding="async" />
                <span className="gallery-caption">
                  <span className="gallery-caption-event">{photo.album.event}</span>
                  <span className="gallery-caption-label">{photo.album.label}</span>
                </span>
                <span className="gallery-zoom" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-4.2-4.2M11 8.5v5M8.5 11h5" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {current && (
        <div
          className="lightbox open"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          onClick={() => setIndex(-1)}
        >
          <button className="lb-close" onClick={() => setIndex(-1)} aria-label="Close">✕</button>

          <button
            className="lb-nav prev"
            aria-label="Previous photo"
            onClick={(e) => { e.stopPropagation(); step(-1) }}
          >
            ‹
          </button>

          <figure className="lb-figure" onClick={(e) => e.stopPropagation()}>
            <img src={current.full} alt={current.alt} />
            <figcaption className="lb-caption">
              <span className="lb-caption-event">{current.album.event}</span>
              <span className="lb-caption-label">{current.album.label}</span>
              <span className="lb-counter">{index + 1} / {visible.length}</span>
            </figcaption>
          </figure>

          <button
            className="lb-nav next"
            aria-label="Next photo"
            onClick={(e) => { e.stopPropagation(); step(1) }}
          >
            ›
          </button>
        </div>
      )}
    </>
  )
}
