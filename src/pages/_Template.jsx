/* ============================================================================
   PAGE TEMPLATE. Copy this file to add a new page.

   1. Copy `_Template.jsx` to `MyPage.jsx`, and `_Template.css` to `MyPage.css`.
   2. In MyPage.jsx: rename the component, fix the CSS import, edit `meta`.
   3. In MyPage.css: replace every `.route-template` with `.route-my-page`
      (the slug is the filename in kebab-case, so MyPage becomes my-page).

   That is all. The route and the navbar link appear on their own: App.jsx,
   Navbar.jsx, Layout.jsx and index.css never need editing.

   Files beginning with `_` are skipped by the page registry, so this template
   never becomes a real route.
   ========================================================================= */

import Masthead from '../components/Masthead.jsx'
import './_Template.css'

export const meta = {
  label: 'Template',   // navbar text; delete this line to hide it from the nav
  order: 90,           // navbar position, lower numbers first
  title: 'Urbana FBLA, Template',  // browser tab title
  // path: 'custom-url',  // optional: override the URL (defaults to the slug)
  // index: true,         // optional: make this the "/" home page
}

export default function Template() {
  return (
    <>
      {/* Shared page header. Props only, styled in index.css. */}
      <Masthead
        eyebrow="Small label"
        title={<>Page <em>title</em></>}
        lede="One line explaining what this page is for."
        meta={[{ label: 'Metadata', value: 'Optional' }]}
      />

      <section className="tpl-section">
        <div className="tpl-wrap">
          {/* `data-reveal` animates an element in when it scrolls into view.
              Wrap a group in `data-reveal-group` to stagger its children.
              Values: up (default), fade, left, right, scale, clip. */}
          <div data-reveal-group>
            <p className="eyebrow" data-reveal="fade">Section label</p>
            <h2 className="section-title" data-reveal>Section title</h2>
            <p className="section-intro" data-reveal>Body copy goes here.</p>
          </div>
        </div>
      </section>
    </>
  )
}
