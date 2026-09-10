import Masthead from '../components/Masthead.jsx'
import './Officers.css'

// Route + nav settings for this page. See src/pageRegistry.js.
export const meta = {
  label: 'Officers',
  order: 40,
  title: 'Urbana FBLA, Officers',
}

const CHAPTER_OFFICERS = [
  { role: 'Chief Executive Officer', name: 'Ryan Thyparambil', img: 'https://res.cloudinary.com/dmgisz0pf/image/upload/f_auto,q_auto,w_400/v1777948483/Ryan_Thyparambil_vscw3l.jpg' },
  { role: 'Chief Operations Officer', name: 'Alan Wang', img: 'https://res.cloudinary.com/dmgisz0pf/image/upload/f_auto,q_auto,w_400/v1777948468/Alan_Wang_ft68o5.jpg' },
  { role: 'Chief Operations Officer', name: 'Arianie Dey', img: 'https://res.cloudinary.com/dmgisz0pf/image/upload/f_auto,q_auto,w_400/v1777948470/Arianie_Dey_vaysdq.jpg' },
  { role: 'Chief Financial Officer', name: 'Elaine Gao', img: 'https://res.cloudinary.com/dmgisz0pf/image/upload/f_auto,q_auto,w_400/v1777948473/Elaine_Gao_umwfc4.jpg' },
  { role: 'Chief Technology Officer', name: 'Jathon Chen', img: 'https://res.cloudinary.com/dmgisz0pf/image/upload/f_auto,q_auto,w_400/v1777948477/Jathon_Chen_xnb4hd.jpg' },
  { role: 'Chief Technology Officer', name: 'Vaibhav Sykhesh', img: 'https://res.cloudinary.com/dmgisz0pf/image/upload/f_auto,q_auto,w_400/v1777948477/Vaibhav_Sykhesh_xiuj8b.jpg' },
  { role: 'Chief Communications Officer', name: 'Kayla Benjamin', img: 'https://res.cloudinary.com/dmgisz0pf/image/upload/f_auto,q_auto,w_400/v1777948479/Kayla_Benjamin_u0sfeo.jpg' },
  { role: 'Chief Marketing Officer', name: 'Medha Mullapudi', img: 'https://res.cloudinary.com/dmgisz0pf/image/upload/f_auto,q_auto,w_400/v1777948481/Medha_Mullapudi_b3ufmz.jpg' },
  { role: 'Regional VP Liaison', name: 'Sruthi Madhusoothanan', img: 'https://res.cloudinary.com/dmgisz0pf/image/upload/f_auto,q_auto,w_400/v1777948485/Sruthi_Madhusoothanan_awk2bb.jpg' },
]

const STATE_OFFICERS = [
  { role: 'State President', name: 'Charis Roussel', img: 'https://res.cloudinary.com/dmgisz0pf/image/upload/f_auto,q_auto,w_400/v1777948471/Charis_Roussel_sp4jyr.jpg' },
  { role: 'State Reporter and Historian', name: 'Hannah Cho', img: 'https://res.cloudinary.com/dmgisz0pf/image/upload/f_auto,q_auto,w_400/v1777948475/Hannah_Cho_onkvkd.jpg' },
]

const ADVISOR = {
  role: 'Chapter Advisor',
  name: 'Travis Zimmerman',
  img: 'https://res.cloudinary.com/dmgisz0pf/image/upload/f_auto,q_auto,w_400/v1777948570/03_Zimmerman_Travis_UHS_1x1_1_vxlwbn.jpg',
}

function OfficerCard({ officer, index }) {
  return (
    <article className="officer edge" data-reveal="scale">
      <div className="officer-photo">
        <img src={officer.img} alt={officer.name} loading="lazy" />
        {index != null && <span className="officer-index">{String(index + 1).padStart(2, '0')}</span>}
      </div>
      <h3 className="officer-name">{officer.name}</h3>
      <p className="officer-role">{officer.role}</p>
    </article>
  )
}

export default function Officers() {
  return (
    <>
      <Masthead
        eyebrow="Leadership"
        title={<>Officer <em>team</em></>}
        lede="Eleven students run the chapter, from competition prep and finances to communications and every event on the calendar."
        meta={[
          { label: 'Term', value: '2026 / 2027' },
          { label: 'Officers', value: '9 chapter, 2 state' },
        ]}
      />

      <section className="officers-section">
        <div className="officers-wrap">
          <header className="block-head">
            <p className="eyebrow" data-reveal="fade">01 / Chapter</p>
            <h2 className="section-title" data-reveal>Chapter officers</h2>
          </header>

          <div className="officers-grid" data-reveal-group>
            {CHAPTER_OFFICERS.map((officer, i) => (
              <OfficerCard officer={officer} index={i} key={officer.name + officer.role} />
            ))}
          </div>

          <header className="block-head block-head--spaced">
            <p className="eyebrow" data-reveal="fade">02 / State</p>
            <h2 className="section-title" data-reveal>Maryland state officers</h2>
            <p className="section-intro" data-reveal>
              Two of our members hold statewide office and represent every FBLA
              chapter in Maryland.
            </p>
          </header>

          <div className="officers-grid officers-grid--narrow" data-reveal-group>
            {STATE_OFFICERS.map((officer) => (
              <OfficerCard officer={officer} key={officer.name + officer.role} />
            ))}
          </div>

          <header className="block-head block-head--spaced">
            <p className="eyebrow" data-reveal="fade">03 / Faculty</p>
            <h2 className="section-title" data-reveal>Advisor</h2>
          </header>

          <div className="officers-grid officers-grid--narrow" data-reveal-group>
            <OfficerCard officer={ADVISOR} />
          </div>
        </div>
      </section>
    </>
  )
}
