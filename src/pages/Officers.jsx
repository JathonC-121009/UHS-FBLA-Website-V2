import './Officers.css'

// Route + nav settings for this page. See src/pageRegistry.js.
export const meta = {
  label: 'Officers',
  order: 40,
  title: 'Urbana FBLA — Officers',
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
  { role: 'State Reporter/Historian', name: 'Hannah Cho', img: 'https://res.cloudinary.com/dmgisz0pf/image/upload/f_auto,q_auto,w_400/v1777948475/Hannah_Cho_onkvkd.jpg' },
]

export default function Officers() {
  return (
    <>
      <div className="page-hero">
        <p className="page-hero-label">Leadership Team</p>
        <h1>Meet Our <span>Officers</span></h1>
      </div>

      <section className="officers-section">
        <div className="officers-wrap">
          <div className="officers-intro fi">
            <p className="section-label">2026–2027 Chapter Officers</p>
            <h2 className="section-title">Chapter Officers</h2>
            <div className="divider"></div>
          </div>

          <div className="officers-grid">
            {CHAPTER_OFFICERS.map((officer) => (
              <div className="officer-card fi" key={officer.name + officer.role}>
                <div className="officer-photo">
                  <img
                    src={officer.img}
                    alt={officer.name}
                  />
                </div>
                <div className="officer-info">
                  <div className="officer-role">{officer.role}</div>
                  <div className="officer-name">{officer.name}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="state-block fi">
            <p className="section-label">State Leadership</p>
            <h2 className="section-title">State Officers</h2>
            <div className="divider"></div>
            <div className="state-grid">
              {STATE_OFFICERS.map((officer) => (
                <div className="officer-card fi" key={officer.name + officer.role}>
                  <div className="officer-photo">
                    <img
                      src={officer.img}
                      alt={officer.name}
                    />
                  </div>
                  <div className="officer-info">
                    <div className="officer-role">{officer.role}</div>
                    <div className="officer-name">{officer.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ADVISOR */}
          <div className="advisor-block fi">
            <p className="section-label">Faculty</p>
            <h2 className="section-title">Chapter Advisor</h2>
            <div className="divider"></div>
            <div className="advisor-wrap">
              <div className="officer-card advisor">
                <div className="officer-photo">
                  <img
                    src="https://res.cloudinary.com/dmgisz0pf/image/upload/f_auto,q_auto,w_400/v1777948570/03_Zimmerman_Travis_UHS_1x1_1_vxlwbn.jpg"
                    alt="Travis Zimmerman"
                  />
                </div>
                <div className="officer-info">
                  <div className="officer-role">Advisor</div>
                  <div className="officer-name">Travis Zimmerman</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
