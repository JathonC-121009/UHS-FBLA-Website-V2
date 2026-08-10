import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useContact from '../hooks/useContact.js'
import './Contact.css'

// Route + nav settings for this page. See src/pageRegistry.js.
export const meta = {
  label: 'Contact',
  order: 60,
  title: 'Urbana FBLA — Contact',
}

const SUBJECTS = [
  'I want to join FBLA',
  'Question about an event',
  'Competition information',
  'General question',
  'Other',
]

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  subject: SUBJECTS[0],
  message: '',
}

export default function Contact() {
  const navigate = useNavigate()
  const { send, sending, error, clearError } = useContact()
  const [form, setForm] = useState(EMPTY_FORM)

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (error) clearError()
  }

  // The message now goes to Firestore first; /thank-you is only reached once
  // the write succeeds, so the confirmation never lies about what happened.
  const handleSubmit = async (e) => {
    e.preventDefault()
    const sent = await send(form)
    if (sent) {
      setForm(EMPTY_FORM)
      navigate('/thank-you')
    }
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
            <form name="contact" onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="contact-error" role="alert">{error}</div>
              )}
              {/* Each label sits AFTER its field so the CSS can float it up on
                  focus (`input:focus + label`). Don't reorder them. */}
              <div className="form-row">
                <div className="form-group">
                  <input
                    id="contact-first-name"
                    type="text"
                    name="first-name"
                    autoComplete="given-name"
                    placeholder="Jane"
                    value={form.firstName}
                    onChange={update('firstName')}
                  />
                  <label htmlFor="contact-first-name">First Name</label>
                </div>
                <div className="form-group">
                  <input
                    id="contact-last-name"
                    type="text"
                    name="last-name"
                    autoComplete="family-name"
                    placeholder="Smith"
                    value={form.lastName}
                    onChange={update('lastName')}
                  />
                  <label htmlFor="contact-last-name">Last Name</label>
                </div>
              </div>
              <div className="form-group">
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={update('email')}
                />
                <label htmlFor="contact-email">Email Address</label>
              </div>
              <div className="form-group form-group-select">
                <select
                  id="contact-subject"
                  name="subject"
                  value={form.subject}
                  onChange={update('subject')}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <label htmlFor="contact-subject">Subject</label>
              </div>
              <div className="form-group">
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={update('message')}
                />
                <label htmlFor="contact-message">Message</label>
              </div>
              <button type="submit" className="btn btn-navy btn-block" disabled={sending}>
                {sending ? 'Sending…' : 'Send Message →'}
              </button>
            </form>
          </div>

        </div>
      </section>
    </>
  )
}
