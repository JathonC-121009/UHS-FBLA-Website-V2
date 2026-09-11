import { useNavigate } from 'react-router-dom'
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

export default function Contact() {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // The original static site posted to Netlify and redirected to /thank-you.
    navigate('/thank-you')
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

      <div className="coming-soon-banner" role="status">
        <h2>Coming soon!</h2>
      </div>

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

            <form
              name="contact"
              method="POST"
              data-netlify="true"
              action="/thank-you"
              onSubmit={handleSubmit}
              className="contact-form"
            >
              <input type="hidden" name="form-name" value="contact" />

              <div className="form-row">
                <div className="field">
                  <label htmlFor="first-name">First name</label>
                  <input id="first-name" type="text" name="first-name" placeholder="Jane" />
                </div>
                <div className="field">
                  <label htmlFor="last-name">Last name</label>
                  <input id="last-name" type="text" name="last-name" placeholder="Smith" />
                </div>
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" placeholder="you@email.com" />
              </div>

              <div className="field">
                <label htmlFor="subject">Subject</label>
                <select id="subject" name="subject" defaultValue="Joining FBLA">
                  <option>Joining FBLA</option>
                  <option>A question about an event</option>
                  <option>Competition information</option>
                  <option>Something else</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" placeholder="What can we help with?" />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Send message
                <Icon name="arrow" className="arrow" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
