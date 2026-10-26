import { useMemo, useRef, useState } from 'react'
import Masthead from '../components/Masthead.jsx'
import Icon from '../components/Icon.jsx'
import { useIndicator } from '../hooks/useMotion.js'
import './Resources.css'

// Route + nav settings for this page. See src/pageRegistry.js.
export const meta = {
  label: 'Resources',
  order: 30,
  title: 'Urbana FBLA, Resources',
}

const TABS = [
  { key: 'events', label: 'Competitive events' },
  { key: 'connect', label: 'FBLA Connect' },
  { key: 'guide', label: 'Site guide' },
]

const TYPES = {
  o: 'Objective test',
  p: 'Presentation',
  r: 'Role play',
  c: 'Chapter award',
  d: 'Production',
}

const TYPE_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'o', label: 'Objective test' },
  { key: 'p', label: 'Presentation' },
  { key: 'r', label: 'Role play' },
  { key: 'd', label: 'Production' },
  { key: 'c', label: 'Chapter award' },
]

const SITE_MAP = [
  { path: '/', name: 'Home', note: 'Chapter record, mission, and where to start.' },
  { path: '/events', name: 'Events', note: 'The live chapter calendar, month by month.' },
  { path: '/resources', name: 'Resources', note: 'Event folders, FBLA Connect, this guide.' },
  { path: '/points', name: 'Points', note: 'Member point standings, total and monthly.' },
  { path: '/officers', name: 'Officers', note: 'Chapter officers, state officers, adviser.' },
  { path: '/gallery', name: 'Gallery', note: 'Photos from conferences and chapter events.' },
  { path: '/bulletin', name: 'Bulletin board', note: 'Member posts, questions, and replies.' },
  { path: '/contact', name: 'Contact', note: 'Reach the officer team or the adviser.' },
]

export default function Resources() {
  const [active, setActive] = useState('events')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const tabsRef = useRef(null)

  // The underline slides between tabs rather than blinking on and off.
  useIndicator(tabsRef, '.tab.is-active', [active])

  const events = [
    { name: 'Accounting', url: 'https://drive.google.com/drive/folders/1T877gdscLJuhtAGUaAZX-CBTKFRiBOmr', type: 'o' },
    { name: 'Advanced Accounting', url: 'https://drive.google.com/drive/folders/1-eWFwxzCDFSPGS1jF2OQIFB6R0R_NxKh', type: 'o' },
    { name: 'Advertising', url: 'https://drive.google.com/drive/folders/11Tbx9ytwLfrsYBkIMK4NRF8N87Okj1sd', type: 'o' },
    { name: 'Agribusiness', url: 'https://drive.google.com/drive/folders/13feGgwScmbzvuKZeoIremqsRbHuekwIM', type: 'o' },
    { name: 'Banking & Financial Systems', url: 'https://drive.google.com/drive/folders/1BjdINcrOO7Ws03-DhEuRJ7rj_EbEAblm', type: 'r' },
    { name: 'Broadcast Journalism', url: 'https://drive.google.com/drive/folders/191SA4lPyI5M4K1OWc-V4DVAwZGXZaHRU', type: 'p' },
    { name: 'Business Communication', url: 'https://drive.google.com/drive/folders/1p9jR4ZvE73uGpI5EKIi0Or_BqwqGShUG', type: 'o' },
    { name: 'Business Ethics', url: 'https://drive.google.com/drive/folders/15MPfNEqZayZNuo2DIKyi-fvcTyePV3rr', type: 'p' },
    { name: 'Business Law', url: 'https://drive.google.com/drive/folders/1jRu9POUvtstwohUnbS2sSNvCqP5wVsEm', type: 'o' },
    { name: 'Business Management', url: 'https://drive.google.com/drive/folders/1SnVqTbzTHqfKxtNNEnILHcH2vaYW9kXJ', type: 'r' },
    { name: 'Business Plan', url: 'https://drive.google.com/drive/folders/1vdoO5jKmwzU7ibKEVuSkLaKavkbZdLFZ', type: 'p' },
    { name: 'Career Portfolio', url: 'https://drive.google.com/drive/folders/1R2BQNWz9BHqRI_sN1WXJWDmChEBjuwws', type: 'p' },
    { name: 'Coding & Programming', url: 'https://drive.google.com/drive/folders/1ZyKZcEyypNaEN-m7VC6TLKW_CiM9aMB3', type: 'p' },
    { name: 'Community Service Project', url: 'https://drive.google.com/drive/folders/1XUHgFEC0Dp8rtUxF-GQrK8V4_Ky9IlS4', type: 'c' },
    { name: 'Computer Applications', url: 'https://drive.google.com/drive/folders/11ZZ8Aj9WQ5lL5UIW2BjN5Sz6hIyfNCDM', type: 'd' },
    { name: 'Computer Game & Simulation Programming', url: 'https://drive.google.com/drive/folders/16WJxaNXNzQCecFTCcjg_qpXk_Bqqc76w', type: 'p' },
    { name: 'Computer Problem Solving', url: 'https://drive.google.com/drive/folders/1l4CuktyHMKHFGAEhV6_QRjrxyy7_Q8L5', type: 'o' },
    { name: 'Customer Service', url: 'https://drive.google.com/drive/folders/1zls8mJS75ugLyGs33SAqcDleOtza6Bap', type: 'r' },
    { name: 'Cybersecurity', url: 'https://drive.google.com/drive/folders/10vDLW7iGGtLZHP9yh9xzM-7SqUpeT0wo', type: 'o' },
    { name: 'Data Analysis', url: 'https://drive.google.com/drive/folders/1JmKU0-Kv7ad0dpqacAB3eXXgzRMIgylS', type: 'p' },
    { name: 'Data Science & AI', url: 'https://drive.google.com/drive/folders/1kN2MgbqX0KNV7Ms2TqTCajbOOO3pAoTA', type: 'o' },
    { name: 'Digital Animation', url: 'https://drive.google.com/drive/folders/1TYpca0TPEOtzyUqkrv0QPH46N4lXbO3N', type: 'p' },
    { name: 'Digital Video Production', url: 'https://drive.google.com/drive/folders/1fFIcdbzy6oBLTgKr2VyRaKLZcWluf83n', type: 'p' },
    { name: 'Economics', url: 'https://drive.google.com/drive/folders/10jE0mlWJZWyyWSCTLFIY_yAwNRqRGiwT', type: 'o' },
    { name: 'Entrepreneurship', url: 'https://drive.google.com/drive/folders/1GqfuTmjt1u8ZMKVRCv4E8_l7e9FZg0bI', type: 'r' },
    { name: 'Event Planning', url: 'https://drive.google.com/drive/folders/1TDuQ1e2pKI878tIUL6HpIBmJ2SE4SRtm', type: 'p' },
    { name: 'Financial Planning', url: 'https://drive.google.com/drive/folders/1mzcDHY5gpDBaRbDiCB7gAxaN63W0M6xn', type: 'p' },
    { name: 'Financial Statement Analysis', url: 'https://drive.google.com/drive/folders/1YOf12M6w0fnyzBV8MXjIVsS_KrKud6Mu', type: 'p' },
    { name: 'Future Business Educator', url: 'https://drive.google.com/drive/folders/1gYJaGb76wV5RxzwUknNz0_QW-2OpFCpm', type: 'p' },
    { name: 'Future Business Leader', url: 'https://drive.google.com/drive/folders/12mDWtk8gFQwlZNUHDf8NT8zTijqd2SoP', type: 'p' },
    { name: 'Graphic Design', url: 'https://drive.google.com/drive/folders/1d4sm_507ouEqexn1L-Jv41vy5Grucfuy', type: 'p' },
    { name: 'Health Care Administration', url: 'https://drive.google.com/drive/folders/1wSrQLUo95YB2nRC00oxFA1Z8rW3Vgv0r', type: 'o' },
    { name: 'Hospitality & Event Management', url: 'https://drive.google.com/drive/folders/1e1hEuaLpkhHUmChLx_vzVWaCUGS-PmfK', type: 'r' },
    { name: 'Human Resource Management', url: 'https://drive.google.com/drive/folders/13PdFC5jbQYzv1gUMLtiVzrhxZP20EnIn', type: 'o' },
    { name: 'Impromptu Speaking', url: 'https://drive.google.com/drive/folders/1aLi_djtMnV8_EAAcZBZmbXaG5EpSIx-B', type: 'p' },
    { name: 'Insurance & Risk Management', url: 'https://drive.google.com/drive/folders/165VWRI_heDWOtqPRV4zIuKsbCqQR2Sse', type: 'o' },
    { name: 'International Business', url: 'https://drive.google.com/drive/folders/1u-N7TMzvn-dKEwQH94ybZi0ePUKE7cGp', type: 'r' },
    { name: 'Introduction to Business Communication', url: 'https://drive.google.com/drive/folders/1SplDfP6nNMm_IXdlJpZHiAormJY8thZr', type: 'o' },
    { name: 'Introduction to Business Concepts', url: 'https://drive.google.com/drive/folders/1vVzCZbWLPxqSXHpg0zkpmgwx7kddOr-d', type: 'o' },
    { name: 'Introduction to Business Presentation', url: 'https://drive.google.com/drive/folders/19i7tX7Mhjoh6C6kb6NLaUgP1qFaqMm1n', type: 'p' },
    { name: 'Introduction to Business Procedures', url: 'https://drive.google.com/drive/folders/12v1_FXoAEztTWx3l6Ngx0QTYRqJsDhv1', type: 'o' },
    { name: 'Introduction to FBLA', url: 'https://drive.google.com/drive/folders/1QYyhRP9QImNgpegORgblhb5ol7qW8x9q', type: 'o' },
    { name: 'Introduction to Information Technology', url: 'https://drive.google.com/drive/folders/1nEo09oTODtjLDM17cB1SSSd16PEn0qjO', type: 'o' },
    { name: 'Introduction to Parliamentary Procedure', url: 'https://drive.google.com/drive/folders/16J_5rxkIMNAYbnlcTPRh0IpaabUCfMvZ', type: 'o' },
    { name: 'Introduction to Programming', url: 'https://drive.google.com/drive/folders/1Gjx_LllWwJmciGnT-Ha0SE30G-oYjN9b', type: 'p' },
    { name: 'Introduction to Public Speaking', url: 'https://drive.google.com/drive/folders/1iAHU4mjHcPpWhxJ1ZVEewoXjfKYi1sBr', type: 'p' },
    { name: 'Introduction to Supply Chain Management', url: 'https://drive.google.com/drive/folders/1viXE9ssYcRXiyXi0tqGc2cZFSipTbDV6', type: 'o' },
    { name: 'Job Interview', url: 'https://drive.google.com/drive/folders/15iYfi3io3lHXTBbf_wki8F5V6I7DZjim', type: 'p' },
    { name: 'Journalism', url: 'https://drive.google.com/drive/folders/1nmzMqC3SvH-tcJvVayMFMvpM1jijso4h', type: 'o' },
    { name: 'Local Chapter Annual Business Report', url: 'https://drive.google.com/drive/folders/1_WjpPeFZetaPAgUUsd9PwZx-zJ4CaTDS', type: 'c' },
    { name: 'Management Information Systems', url: 'https://drive.google.com/drive/folders/1EJ3nAokxMvYlk8bdFGC43mtj1jzrN7Cg', type: 'r' },
    { name: 'Marketing', url: 'https://drive.google.com/drive/folders/13RnlY-5_RjtN7F14vmm5_AGOjVes0YdK', type: 'r' },
    { name: 'Mobile Application Development', url: 'https://drive.google.com/drive/folders/1q1LLwN0nKqiT2XJ_0KXDrqqymkg2iXuh', type: 'p' },
    { name: 'Network Design', url: 'https://drive.google.com/drive/folders/1qmAInIbIj3Ktrhk_2EYsMunEfJT1HM_q', type: 'r' },
    { name: 'Networking & Infrastructure', url: 'https://drive.google.com/drive/folders/1xiKF19idEwOvhVZRaCPtsecFFwXsouEV', type: 'o' },
    { name: 'Organizational Leadership', url: 'https://drive.google.com/drive/folders/1qfmRDcv7Rm7_S72bNBMsUZHd72ZWAiGX', type: 'o' },
    { name: 'Parliamentary Procedure', url: 'https://drive.google.com/drive/folders/1kLrGCxo2ne1fjnaJiI2-XxGrQ4n6DJoH', type: 'r' },
    { name: 'Project Management', url: 'https://drive.google.com/drive/folders/1qn0HaUxjlFSGNjLYSFaQT8O8EN-M2n82', type: 'o' },
    { name: 'Public Service Announcement', url: 'https://drive.google.com/drive/folders/13tWn0x9xdJQOuR9hMnzDOmVhM1jZhlX2', type: 'p' },
    { name: 'Public Speaking', url: 'https://drive.google.com/drive/folders/1Hq5mpf6Mf2_9x2ZzqQ3n4wEHjStl3NQW', type: 'p' },
    { name: 'Retail Management', url: 'https://drive.google.com/drive/folders/1UQ7-V8r4b2oHzTSrhrGmdKFar_VJObFE', type: 'o' },
    { name: 'Sales Presentation', url: 'https://drive.google.com/drive/folders/173yGEsWcUHgv_90hq-MGu_dDMGSw30KD', type: 'p' },
    { name: 'Social Media Strategies', url: 'https://drive.google.com/drive/folders/1qCniC5IJcPW4Eqw8WbWtZ9CgceIefcq9', type: 'p' },
    { name: 'Sports & Entertainment Management', url: 'https://drive.google.com/drive/folders/1cVywuQP5ULMMSMlurG_i2pmZZNmZyjdn', type: 'r' },
    { name: 'Supply Chain Management', url: 'https://drive.google.com/drive/folders/1Zze02UJeKX3LsTQ1MZ2qmSuM71xhFxlh', type: 'p' },
    { name: 'Technology Support & Services', url: 'https://drive.google.com/drive/folders/1Ts8SMTjgsmSdsoJDh4yJWxhr6KJhKJ98', type: 'r' },
    { name: 'Visual Design', url: 'https://drive.google.com/drive/folders/11MGuiz2Zklz0MXzfISABz5kqGTCjN2e0', type: 'p' },
    { name: 'Website Coding & Development', url: 'https://drive.google.com/drive/folders/1duvSKU4E_zhfjo6T1GLi9FPNI_ExOgxT', type: 'p' },
    { name: 'Website Design', url: 'https://drive.google.com/drive/folders/1QXw0w2LCXqeXInHwguXPwgPa_YAW26fu', type: 'p' }
  ]

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return events.filter(
      (evt) =>
        (typeFilter === 'all' || evt.type === typeFilter) &&
        (!term || evt.name.toLowerCase().includes(term)),
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, typeFilter])

  return (
    <>
      <Masthead
        eyebrow="Member resources"
        title={<>Everything you need to <em>compete</em></>}
        lede="Study folders for every event we compete in, plus links to the national FBLA site and the rest of this one."
        meta={[
          { label: 'Events listed', value: String(events.length) },
          { label: 'Hosted on', value: 'Google Drive' },
        ]}
      />

      <section className="resources-section">
        <div className="resources-wrap">
          <div className="tabs" role="tablist" aria-label="Resource sections" ref={tabsRef}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={active === tab.key}
                className={`tab press${active === tab.key ? ' is-active' : ''}`}
                onClick={() => setActive(tab.key)}
              >
                {tab.label}
              </button>
            ))}
            <span className="indicator tab-indicator" aria-hidden="true" />
          </div>

          {active === 'events' && (
            <div className="panel" key="events">
              <div className="panel-head">
                <div>
                  <h2 className="section-title">Competitive events</h2>
                  <p className="section-intro">
                    Each card opens the chapter folder for that event: past topics,
                    rubrics, and notes from members who placed.
                  </p>
                </div>

                <label className="search">
                  <Icon name="search" size={16} />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search events"
                    aria-label="Search competitive events"
                  />
                </label>
              </div>

              <div className="type-filters" role="group" aria-label="Filter by event format">
                {TYPE_FILTERS.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className={`chip press${typeFilter === option.key ? ' is-active' : ''}`}
                    aria-pressed={typeFilter === option.key}
                    onClick={() => setTypeFilter(option.key)}
                  >
                    {option.label}
                  </button>
                ))}
                <span className="type-count">
                  {filtered.length} of {events.length}
                </span>
              </div>

              <div className="event-grid" data-reveal-group>
                {filtered.map((evt) => (
                  <a
                    key={evt.name}
                    className="event-card edge"
                    href={evt.url || 'https://drive.google.com'}
                    target="_blank"
                    rel="noreferrer"
                    data-reveal="scale"
                  >
                    <span className="event-type">{TYPES[evt.type]}</span>
                    <h3 className="event-name">{evt.name}</h3>
                    <span className="event-open">
                      Open folder
                      <Icon name="external" size={13} />
                    </span>
                  </a>
                ))}
              </div>

              {filtered.length === 0 && (
                <p className="empty">Nothing matches that search. Try a shorter word.</p>
              )}
            </div>
          )}

          {active === 'connect' && (
            <div className="panel" key="connect">
              <div className="connect-card" data-reveal>
                <p className="eyebrow">National platform</p>
                <h2 className="section-title">FBLA Connect</h2>
                <p className="section-intro">
                  Connect is where national FBLA posts competitive event guidelines,
                  deadlines, and conference announcements. Sign in with the account tied
                  to your membership.
                </p>
                <a className="btn btn-primary" href="https://connect.fbla.org/" target="_blank" rel="noreferrer">
                  Open FBLA Connect
                  <Icon name="external" size={14} />
                </a>
              </div>
            </div>
          )}

          {active === 'guide' && (
            <div className="panel" key="guide">
              <h2 className="section-title">What is on this site</h2>
              <p className="section-intro">
                Eight pages, each doing one job. Members get a little more on two of them
                once signed in.
              </p>

              <ol className="sitemap" data-reveal-group>
                {SITE_MAP.map((entry, i) => (
                  <li key={entry.path} data-reveal>
                    <a href={entry.path}>
                      <span className="sitemap-index">{String(i + 1).padStart(2, '0')}</span>
                      <span className="sitemap-name">{entry.name}</span>
                      <span className="sitemap-note">{entry.note}</span>
                      <Icon name="arrow" size={14} className="arrow" />
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
