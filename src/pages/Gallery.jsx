import { useCallback, useEffect, useMemo, useState } from 'react'
import './Gallery.css'

// Route + nav settings for this page. See src/pageRegistry.js.
export const meta = {
  label: 'Gallery',
  order: 50,
  title: 'Urbana FBLA — Gallery',
}

/* ---------------------------------------------------------------------------
   WHERE THE PHOTOS COME FROM

   Nothing in this file lists individual photos. The page asks Cloudinary for
   the contents of the `gallery` folder at load time, so adding, removing or
   re-foldering images in the Cloudinary Media Library updates the site on the
   next refresh — no code change, no redeploy.

   Each image's caption is the subfolder it sits in:

       gallery/SLC 2026 Day 1/IMG_0042.jpg   ->  "SLC 2026 Day 1"
       gallery/Fall Kickoff/IMG_0107.jpg     ->  "Fall Kickoff"

   Those subfolders also become the filter chips above the grid, in the order
   of their most recent upload, so a brand-new album lands first.

   ── ONE-TIME CLOUDINARY SETUP (needed once, then never again) ──────────────

   A browser can't call Cloudinary's Admin API — that needs an API secret,
   which can't live in frontend code. The public, key-free equivalent is the
   client-side resource list, and it works by tag:

       https://res.cloudinary.com/<cloud>/image/list/<tag>.json

   As of this writing that URL returns 401 for this cloud, because listing is
   switched off by default. Two things to do in the Cloudinary console:

     1. Settings -> Security -> "Restricted media types":
        UNCHECK "Resource list". (This only exposes public_id/size/folder for
        assets carrying the tag below — the images are already public.)

     2. Tag everything in the gallery folder with `gallery` (the GALLERY_TAG
        below). In the Media Library: open the folder, Select All, "Add tag".
        To keep it automatic for future uploads, put `gallery` in the Tags
        field of the upload preset you use, and new photos self-register.

   Until step 1 is done the page quietly falls back to FALLBACK_PHOTOS below
   and logs a one-line explanation to the console, so the gallery is never
   empty while the switch is being flipped.
   ------------------------------------------------------------------------ */
const CLOUD_NAME = 'dmgisz0pf'

// Only assets under this folder are shown, and only this tag is fetched.
const GALLERY_FOLDER = 'gallery'
const GALLERY_TAG = 'gallery'

const LIST_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${GALLERY_TAG}.json`

/* ---------------------------------------------------------------------------
   FALLBACK — the last known contents of the gallery folder, baked in so the
   page still renders if Cloudinary is unreachable or resource listing is off.
   This list is a safety net, NOT the source of truth: it does not need to be
   kept up to date, and captions here come from the filename parser rather than
   from folders. Delete it once the live list has been running happily.
   ------------------------------------------------------------------------ */
const FALLBACK_PHOTOS = [
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

/* --- Reading a folder off a Cloudinary resource --------------------------- */

// This cloud uses dynamic folders, so the path lives in `asset_folder` and not
// in the public_id. Older/fixed-folder clouds put it in `folder`, or inline in
// the public_id. Check all three so the page keeps working either way.
function folderOf(resource) {
  const raw =
    resource.asset_folder ||
    resource.folder ||
    (resource.public_id.includes('/')
      ? resource.public_id.slice(0, resource.public_id.lastIndexOf('/'))
      : '')

  return String(raw).replace(/^\/+|\/+$/g, '')
}

// "Only use the things inside the gallery folder." A resource whose folder we
// genuinely can't read is kept — it carried the gallery tag, which is the only
// signal available in that case.
function inGalleryFolder(folder) {
  if (!folder) return true
  const lower = folder.toLowerCase()
  return lower === GALLERY_FOLDER || lower.startsWith(`${GALLERY_FOLDER}/`)
}

// "gallery/Fall Kickoff" -> ["Fall Kickoff"]   "gallery/2026/SLC" -> ["2026", "SLC"]
// Photos dropped loose in gallery/ itself return [] and fall through to the
// caption fallbacks below.
function albumSegments(folder) {
  const parts = folder.split('/').filter(Boolean)
  if (parts[0] && parts[0].toLowerCase() === GALLERY_FOLDER) parts.shift()
  return parts
}

/* --- Caption fallbacks, for photos with no readable subfolder ------------- */

// A hand-written caption typed into the asset's Context/Metadata panel.
function contextCaption(resource) {
  const context = resource.context || {}
  const custom = context.custom || context
  return custom.album || custom.caption || custom.alt || ''
}

// Any tag other than the marker one — tagging a photo "Fall Kickoff" captions
// it that way even if the folder never reaches us.
function tagCaption(resource) {
  const tags = Array.isArray(resource.tags) ? resource.tags : []
  return tags.find((tag) => tag.toLowerCase() !== GALLERY_TAG) || ''
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

// Acronyms stay shouted (SLC, FBLA, NLC), years stay bare, words get cased.
function titleToken(token) {
  if (/^\d{4}$/.test(token)) return token
  if (/^[A-Z0-9]{2,5}$/.test(token)) return token
  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase()
}

// Last resort: read the shoot out of the filename. "SLC-2026-DAY1-24" becomes
// "SLC 2026 — Day 1". Only reached for photos that are neither in a subfolder
// nor tagged nor captioned.
function captionFromFilename(id) {
  const parts = id.replace(/-\d+$/, '').split(/[-_]/)
  const dayIndex = parts.findIndex((part) => /^DAY\d+$/i.test(part))
  const head = (dayIndex === -1 ? parts : parts.slice(0, dayIndex)).map(titleToken).join(' ')
  const day = dayIndex === -1 ? '' : ` — Day ${parts[dayIndex].replace(/\D/g, '')}`
  return `${head}${day}`.trim() || 'Urbana FBLA'
}

/* --- Resource -> photo ---------------------------------------------------- */

const cloudinary = (path, transform) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}/${path}`

// `album` is what the caption, the filter chips and the lightbox all read from.
// `event` is the small gold line above the caption: the folders *between*
// gallery/ and the photo's own folder, so "gallery/2026/SLC" reads
// "2026 / SLC". A one-level-deep folder simply has no event line.
function albumFor(resource, id) {
  const segments = albumSegments(folderOf(resource))

  if (segments.length) {
    return {
      key: segments.join('/').toLowerCase(),
      label: segments[segments.length - 1],
      event: segments.slice(0, -1).join(' / '),
    }
  }

  const label = contextCaption(resource) || tagCaption(resource) || captionFromFilename(id)
  return { key: label.toLowerCase(), label, event: '' }
}

function buildPhoto({ src, w, h, album, sortKey }) {
  const id = publicIdOf(src)
  const frame = frameOf(id)
  // Portraits get a double-height tile, so they read as shot instead of being
  // squeezed into a landscape box.
  const portrait = h > w

  return {
    id,
    album,
    frame,
    portrait,
    sortKey,
    // g_auto crops around the subject rather than the dead centre, and the
    // requested shape matches the tile so the browser never rescales. The
    // dimensions are ~2x the on-screen tile so the grid stays sharp on retina.
    thumb: cloudinary(src, `f_auto,q_auto,c_fill,g_auto,w_900,h_${portrait ? 1350 : 675}`),
    full: cloudinary(src, 'f_auto,q_auto,w_1800'),
    alt: frame ? `${album.label}, photo ${frame}` : album.label,
  }
}

// A Cloudinary list entry -> a photo, or null if it isn't a gallery image.
function photoFromResource(resource) {
  if (!resource || !resource.public_id || !resource.format || !resource.version) return null
  if (!inGalleryFolder(folderOf(resource))) return null

  const src = `v${resource.version}/${resource.public_id}.${resource.format}`
  const id = publicIdOf(src)

  return buildPhoto({
    src,
    w: Number(resource.width) || 0,
    h: Number(resource.height) || 0,
    album: albumFor(resource, id),
    sortKey: Date.parse(resource.created_at) || 0,
  })
}

// Newest album first, newest photo first inside it, so a fresh upload shows up
// at the top of the page on its own without anyone reordering anything.
function groupByAlbum(photos) {
  const albums = new Map()

  photos.forEach((photo) => {
    const bucket = albums.get(photo.album.key)
    if (bucket) bucket.push(photo)
    else albums.set(photo.album.key, [photo])
  })

  return [...albums.values()]
    .map((bucket) => bucket.slice().sort((a, b) => b.sortKey - a.sortKey))
    .sort((a, b) => b[0].sortKey - a[0].sortKey || a[0].album.label.localeCompare(b[0].album.label))
    .flat()
}

// The baked-in list has no folders or timestamps, so it keeps its written order.
const FALLBACK_GALLERY = FALLBACK_PHOTOS.map(({ src, w, h }, i) => {
  const id = publicIdOf(src)
  const label = captionFromFilename(id)
  return buildPhoto({
    src,
    w,
    h,
    album: { key: label.toLowerCase(), label, event: '' },
    sortKey: FALLBACK_PHOTOS.length - i,
  })
})

/* --- The page ------------------------------------------------------------- */

// Enough tiles to fill the first screen while the list request is in flight.
const SKELETONS = Array.from({ length: 6 }, (_, i) => i)

export default function Gallery() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [index, setIndex] = useState(-1)

  useEffect(() => {
    let cancelled = false

    fetch(LIST_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Cloudinary resource list returned ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const live = (data.resources || []).map(photoFromResource).filter(Boolean)
        if (!live.length) throw new Error(`no images tagged "${GALLERY_TAG}"`)
        if (!cancelled) setPhotos(groupByAlbum(live))
      })
      .catch((err) => {
        if (cancelled) return
        // Not fatal: the page renders the baked-in list instead. The message is
        // here so the fix is obvious to whoever opens the console next.
        console.warn(
          `[gallery] Live Cloudinary list unavailable (${err.message}); showing the ` +
            'built-in fallback. Enable Settings → Security → Restricted media types → ' +
            `"Resource list" and tag the gallery folder "${GALLERY_TAG}".`
        )
        setPhotos(FALLBACK_GALLERY)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // One chip per subfolder, in the order the albums appear in the grid.
  const filters = useMemo(
    () => [
      { key: 'all', label: 'All Photos', count: photos.length },
      ...photos.reduce((albums, photo) => {
        const existing = albums.find((a) => a.key === photo.album.key)
        if (existing) existing.count += 1
        else albums.push({ key: photo.album.key, label: photo.album.label, count: 1 })
        return albums
      }, []),
    ],
    [photos]
  )

  const visible = useMemo(
    () => (filter === 'all' ? photos : photos.filter((photo) => photo.album.key === filter)),
    [filter, photos]
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
              Every album we&apos;ve shot this year, straight from the chapter photo
              library. Hover any photo for its caption, or select one to open the
              full-size view.
            </p>
          </div>

          {/* Deliberately not a `.fi` element: the chips arrive after the shared
              fade-in observer has already run, so this animates on its own. */}
          <div className="gallery-filters" role="group" aria-label="Filter photos by album">
            {filters.map((option) => (
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

          <div className="gallery-grid" aria-busy={loading}>
            {loading
              ? SKELETONS.map((i) => (
                  <div
                    className="gallery-item skeleton"
                    key={`skeleton-${i}`}
                    style={{ '--stagger': `${i * 60}ms` }}
                    aria-hidden="true"
                  />
                ))
              : visible.map((photo, i) => (
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
                      {photo.album.event && (
                        <span className="gallery-caption-event">{photo.album.event}</span>
                      )}
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

          {!loading && !visible.length && (
            <p className="gallery-empty">No photos in this album yet — check back soon.</p>
          )}
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
              {current.album.event && (
                <span className="lb-caption-event">{current.album.event}</span>
              )}
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
