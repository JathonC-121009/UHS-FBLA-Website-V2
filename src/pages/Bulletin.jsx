import './Bulletin.css'

export const meta = {
  label: 'Bulletin',   // navbar text — delete this line to hide it from the nav
  order: 90,           // navbar position; lower numbers come first
  title: 'Urbana FBLA — Bulletin',  // browser tab title
  // path: 'custom-url',  // optional: override the URL (defaults to the slug)
  // index: true,         // optional: make this the "/" home page
}

export default function Bulletin() {
  return (
    <>
      <div className="page-hero">
        <p className="page-hero-label">Chapter Bulletin</p>
        <h1>The <span>Board</span></h1>
        <p>Announcements, updates, and shoutouts from the chapter</p>
      </div>

      <section className="bulletin-section">
        <div className="bulletin-wrap">

          {/* Post composer — UI only, no submit behavior */}
          <div className="composer-card fi">
            <div className="composer-head">
              <div className="avatar">You</div>
              <textarea
                className="composer-input"
                placeholder="Share an announcement with the chapter..."
                rows={3}
              ></textarea>
            </div>

            {/* Example attachment preview */}
            <div className="composer-preview">
              <div className="preview-chip">
                <span className="preview-chip-icon">🖼️</span>
                <span className="preview-chip-name">fbla-banner.jpg</span>
                <button type="button" className="preview-chip-remove" aria-label="Remove attachment">×</button>
              </div>
            </div>

            <div className="composer-footer">
              <div className="composer-attach">
                <label className="attach-btn">
                  📷 <span>Photo</span>
                  <input type="file" accept="image/*" hidden />
                </label>
                <label className="attach-btn">
                  🎥 <span>Video</span>
                  <input type="file" accept="video/*" hidden />
                </label>
              </div>
              <button type="button" className="btn btn-navy">Post</button>
            </div>
          </div>

          {/* Feed */}
          <div className="fi">
            <p className="section-label">The Feed</p>
            <h2 className="section-title">Recent Posts</h2>
            <div className="divider"></div>
          </div>

          <div className="bulletin-feed">

            <div className="post-card fi">
              <div className="post-head">
                <div className="avatar">MZ</div>
                <div className="post-hinfo">
                  <div className="post-name">Mia Zhang <span className="post-role">Officer</span></div>
                  <div className="post-time">Posted 2 hours ago</div>
                </div>
              </div>
              <p className="post-text">
                Huge congrats to everyone who competed at the regional conference this weekend —
                we brought home 6 medals! 🏆 Keep up the amazing work, Knights.
              </p>
              <div className="post-media">
                <div className="post-media-placeholder">
                  <span className="post-media-icon">🖼️</span>
                  <span>Image attached</span>
                </div>
              </div>
              <div className="post-actions">
                <button type="button" className="post-action">
                  👍 <span>Like</span> <span className="count">24</span>
                </button>
                <button type="button" className="post-action">
                  💬 <span>Comment</span> <span className="count">6</span>
                </button>
                <button type="button" className="post-action post-action-delete">
                  🗑️ <span>Delete</span>
                </button>
              </div>
            </div>

            <div className="post-card fi">
              <div className="post-head">
                <div className="avatar">TZ</div>
                <div className="post-hinfo">
                  <div className="post-name">Travis Zimmermann <span className="post-role">Advisor</span></div>
                  <div className="post-time">Posted yesterday</div>
                </div>
              </div>
              <p className="post-text">
                Quick recap from this week's meeting — video below. Make sure to check the sign-up sheet
                for the community service event before Friday!
              </p>
              <div className="post-media">
                <div className="post-media-placeholder post-media-video">
                  <span className="post-media-play">▶</span>
                  <span>Video attached</span>
                </div>
              </div>
              <div className="post-actions">
                <button type="button" className="post-action">
                  👍 <span>Like</span> <span className="count">15</span>
                </button>
                <button type="button" className="post-action">
                  💬 <span>Comment</span> <span className="count">2</span>
                </button>
                <button type="button" className="post-action post-action-delete">
                  🗑️ <span>Delete</span>
                </button>
              </div>
            </div>

            <div className="post-card fi">
              <div className="post-head">
                <div className="avatar">JP</div>
                <div className="post-hinfo">
                  <div className="post-name">Jordan Patel <span className="post-role">Member</span></div>
                  <div className="post-time">Posted 3 days ago</div>
                </div>
              </div>
              <p className="post-text">
                Reminder: dues for the spring semester are due next Friday. Reach out to any officer
                if you have questions about payment options!
              </p>
              <div className="post-actions">
                <button type="button" className="post-action">
                  👍 <span>Like</span> <span className="count">9</span>
                </button>
                <button type="button" className="post-action">
                  💬 <span>Comment</span> <span className="count">1</span>
                </button>
                <button type="button" className="post-action post-action-delete">
                  🗑️ <span>Delete</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
