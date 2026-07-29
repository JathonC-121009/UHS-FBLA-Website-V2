/* ============================================================================
   PAGE TEMPLATE — copy this file to add a new page.

   1. Copy `_Template.jsx`  -> `MyPage.jsx`   and `_Template.css` -> `MyPage.css`
   2. In MyPage.jsx: rename the component, fix the CSS import, edit `meta`.
   3. In MyPage.css: replace every `.route-template` with `.route-my-page`
      (the slug is the filename in kebab-case: MyPage -> my-page).

   That's it. The route and the navbar link appear automatically — App.jsx,
   Navbar.jsx, Layout.jsx and index.css do NOT need to be touched.

   Files beginning with `_` are skipped by the page registry, so this template
   never becomes a real route.
   ========================================================================= */

import './_Template.css'

export const meta = {
  label: 'Template',   // navbar text — delete this line to hide it from the nav
  order: 90,           // navbar position; lower numbers come first
  title: 'Urbana FBLA — Template',  // browser tab title
  // path: 'custom-url',  // optional: override the URL (defaults to the slug)
  // index: true,         // optional: make this the "/" home page
}

export default function Template() {
  return (
    <>
      {/* Shared hero — styled in index.css, recolorable per page in your CSS */}
      <div className="page-hero">
        <p className="page-hero-label">Small Label</p>
        <h1>Page <span>Title</span></h1>
        <p>One line of supporting text.</p>
      </div>

      <section className="tpl-section">
        <div className="tpl-wrap">
          {/* `fi` = fade in on scroll. Only put it on content that is rendered
              right away — content added later by a click won't be observed. */}
          <div className="fi">
            <p className="section-label">Section Label</p>
            <h2 className="section-title">Section Title</h2>
            <div className="divider"></div>
            <p className="section-intro">Body copy goes here.</p>
          </div>
        </div>
      </section>
    </>
  )
}
