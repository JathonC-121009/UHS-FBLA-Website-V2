import './Points.css'
import { useState } from 'react'

export const meta = {
  label: 'Points',   // navbar text — delete this line to hide it from the nav
  order: 31,           // navbar position; lower numbers come first
  title: 'Urbana FBLA — Points',  // browser tab title
  // path: 'custom-url',  // optional: override the URL (defaults to the slug)
  // index: true,         // optional: make this the "/" home page
}

export default function Points() {
  return (
    <>
      {/* Shared hero — styled in index.css, recolorable per page in your CSS */}
      <div className="page-hero">
        <p className="page-hero-label">Urbana FBLA</p>
        <h1>Point<span> Leaderboard</span></h1>
        <p>See who's standing out in Urbana FBLA!</p>
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