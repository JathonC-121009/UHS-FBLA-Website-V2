/**
 * Page registry: auto-discovers every page in src/pages/.
 *
 * Nobody should have to edit this file to add, rename, remove, or restyle a
 * page. Vite's import.meta.glob picks up every `src/pages/*.jsx` file at build
 * time, and each page describes itself with a `meta` export:
 *
 *   export const meta = {
 *     label: 'Events',                  // nav text; omit to hide from the nav
 *     order: 20,                        // nav position (low numbers first)
 *     title: 'Urbana FBLA, Events',     // browser tab title
 *     path: 'events',                   // optional; defaults to the slug
 *     slug: 'events',                   // optional; defaults from the filename
 *     index: true,                      // optional; makes this the "/" page
 *   }
 *
 * Files starting with `_` (like _Template.jsx) are ignored, so they can sit in
 * the pages folder as copy-paste starters without becoming real routes.
 */

const modules = import.meta.glob(['./pages/*.jsx', '!./pages/_*.jsx'], { eager: true })

const fileName = (path) => path.split('/').pop().replace(/\.jsx$/, '')

// 'ThankYou' -> 'thank-you', 'Events' -> 'events'
const toSlug = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

export const pages = Object.entries(modules)
  .filter(([path, mod]) => {
    if (typeof mod.default === 'function') return true
    console.warn(`[pageRegistry] ${path} has no default-exported component, skipped.`)
    return false
  })
  .map(([path, mod]) => {
    const name = fileName(path)
    const meta = mod.meta ?? {}
    const slug = meta.slug ?? toSlug(name)
    const isIndex = meta.index === true
    const routePath = meta.path ?? slug

    return {
      name,
      slug,
      isIndex,
      routePath,                                  // what <Route path> gets
      path: isIndex ? '/' : `/${routePath}`,      // what <NavLink to> gets
      label: meta.label ?? null,                  // null means hidden from the nav
      order: meta.order ?? 999,
      title: meta.title ?? `Urbana FBLA, ${name}`,
      Component: mod.default,
    }
  })
  .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))

/** Pages that appear in the navbar, already in nav order. */
export const navPages = pages.filter((page) => page.label)

/** Look up the page for a URL path, e.g. '/events' or '/'. */
export function findPage(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/'
  return pages.find((page) => page.path === clean) ?? null
}
