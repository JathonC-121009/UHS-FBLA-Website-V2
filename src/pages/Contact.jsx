import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useContact from '../hooks/useContact.js'
import Masthead from '../components/Masthead.jsx'
import Icon from '../components/Icon.jsx'
import './Contact.css'

// Route + nav settings for this page. See src/pageRegistry.js.
export const meta = {
  label: 'Contact',
  order: 60,
  title: 'Urbana FBLA, Contact',
}

const DETAILS = [
  {
    icon: 'mail',
    label: 'Chapter email',
    value: 'uhsfbla2@gmail.com',
    href: 'mailto:uhsfbla2@gmail.com',
  },
  {
    icon: 'pin',
    label: 'Where we meet',
    value: 'Urbana High School, 3471 Campus Drive, Ijamsville, MD',
  },
  {
    icon: 'school',
    label: 'Faculty adviser',
    value: 'Travis Zimmerman',
    href: 'mailto:Travis.Zimmerman@fcps.org',
    note: 'Travis.Zimmerman@fcps.org',
  },
  {
    icon: 'camera',
    label: 'Instagram',
    value: '@urbanafbla',
    href: 'https://www.instagram.com/urbanafbla',
  },
]

const SUBJECTS = [
  'Joining FBLA',
  'A question about an event',
  'Competition information',
  'Something else',
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

  // /thank-you is only reached once the message is actually delivered, so the
  // confirmation never lies; on failure the user keeps their text.
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
      <Masthead
        eyebrow="Get in touch"
        title={<>Talk to the <em>chapter</em></>}
        lede="Have a question about joining, competing, or an event? Send it here and an officer will get back to you."
        meta={[
          { label: 'Reply time', value: 'Within a school week' },
          { label: 'Meetings', value: 'Open to all students' },
        ]}
      />

      <section className="contact-section">
        <div className="contact-layout">
          <div className="contact-details" data-reveal-group>
            <p className="eyebrow" data-reveal="fade">Direct lines</p>

            <ul className="detail-list">
              {DETAILS.map((item) => (
                <li className="detail-row edge" key={item.label} data-reveal>
                  <span className="detail-icon"><Icon name={item.icon} size={18} /></span>
                  <div>
                    <p className="detail-label">{item.label}</p>
                    {item.href ? (
                      <a className="detail-value" href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                        {item.value}
                      </a>
                    ) : (
                      <p className="detail-value">{item.value}</p>
                    )}
                    {item.note && <p className="detail-note">{item.note}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="contact-form-panel" data-reveal="right">
            <header className="form-head">
              <p className="eyebrow">Send a message</p>
              <h2 className="section-title">Write to us</h2>
            </header>

            <form onSubmit={handleSubmit} className="contact-form" noValidate>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="first-name">First name</label>
                  <input id="first-name" type="text" name="first-name" placeholder="Jane" autoComplete="given-name" maxLength={80} value={form.firstName} onChange={update('firstName')} />
                </div>
                <div className="field">
                  <label htmlFor="last-name">Last name</label>
                  <input id="last-name" type="text" name="last-name" placeholder="Smith" autoComplete="family-name" maxLength={80} value={form.lastName} onChange={update('lastName')} />
                </div>
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" placeholder="you@email.com" autoComplete="email" maxLength={200} value={form.email} onChange={update('email')} />
              </div>

              <div className="field">
                <label htmlFor="subject">Subject</label>
                <select id="subject" name="subject" value={form.subject} onChange={update('subject')}>
                  {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" placeholder="What can we help with?" maxLength={2000} value={form.message} onChange={update('message')} />
              </div>

              {error && <p className="form-error" role="alert">{error}</p>}

              <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
                {sending ? 'Sending…' : 'Send message'}
                <Icon name="arrow" className="arrow" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
