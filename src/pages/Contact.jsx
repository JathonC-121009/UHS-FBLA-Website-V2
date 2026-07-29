import { useNavigate } from 'react-router-dom'
import './Contact.css'

// Route + nav settings for this page. See src/pageRegistry.js.
export const meta = {
  label: 'Contact',
  order: 60,
  title: 'Urbana FBLA — Contact',
}

export default function Contact() {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Original static site posted to Netlify and redirected to /thank-you.html.
    navigate('/thank-you')
  }

  return (
    <>
      <div className="page-hero">
        <p className="page-hero-label">Get in Touch</p>
        <h1>Contact <span>Us</span></h1>
        <p>Questions? We'd love to hear from you.</p>
      </div>

      <section className="contact-section">
        <div className="contact-layout">

          <div className="fi">
            <p className="section-label">Reach Out</p>
            <h2 className="section-title">Contact Info</h2>
            <div className="divider"></div>

            <div className="cinfo-item">
              <div className="cinfo-icon">📧</div>
              <div>
                <div className="cinfo-label">Email</div>
                <div className="cinfo-value"><a href="mailto:uhsfbla2@gmail.com">uhsfbla2@gmail.com</a></div>
              </div>
            </div>
            <div className="cinfo-item">
              <div className="cinfo-icon">📍</div>
              <div>
                <div className="cinfo-label">Location</div>
                <div className="cinfo-value">Urbana High School<br />3471 Campus Dr, Ijamsville, MD</div>
              </div>
            </div>
            <div className="cinfo-item">
              <div className="cinfo-icon">👨‍🏫</div>
              <div>
                <div className="cinfo-label">Faculty Advisor</div>
                <div className="cinfo-value">Travis Zimmermann<br /><a href="mailto:Travis.Zimmerman@fcps.org">Travis.Zimmerman@fcps.org</a></div>
              </div>
            </div>
            <div className="cinfo-item">
              <div className="cinfo-icon">📸</div>
              <div>
                <div className="cinfo-label">Social Media</div>
                <div className="cinfo-value"><a href="https://www.instagram.com/urbanafbla">@urbanafbla</a></div>
              </div>
            </div>
          </div>

          <div className="form-card fi">
            <h3>Send a Message</h3>
            <form name="contact" method="POST" data-netlify="true" action="/thank-you" onSubmit={handleSubmit}>
              <input type="hidden" name="form-name" value="contact" />
              <div className="form-row">
                <div className="form-group"><label>First Name</label><input type="text" name="first-name" placeholder="Jane" /></div>
                <div className="form-group"><label>Last Name</label><input type="text" name="last-name" placeholder="Smith" /></div>
              </div>
              <div className="form-group"><label>Email Address</label><input type="email" name="email" placeholder="you@email.com" /></div>
              <div className="form-group">
                <label>Subject</label>
                <select name="subject" defaultValue="I want to join FBLA">
                  <option>I want to join FBLA</option>
                  <option>Question about an event</option>
                  <option>Competition information</option>
                  <option>General question</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group"><label>Message</label><textarea name="message" placeholder="Write your message here..."></textarea></div>
              <button type="submit" className="btn btn-navy btn-block">Send Message →</button>
            </form>
          </div>

        </div>
      </section>
    </>
  )
}
