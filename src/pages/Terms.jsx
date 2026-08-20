import './Terms.css'

// No `label`, so this page is reachable at /terms but hidden from the nav.
// See src/pageRegistry.js.
export const meta = {
  order: 72,
  title: 'Urbana FBLA — Terms of Service',
}

export default function Terms() {
  return (
    <>
      <div className="legal-header fi">
        <p className="section-label">Legal</p>
        <h1>Terms of Service</h1>
        <div className="divider"></div>
      </div>

      <section className="legal-wrap fi">
        <div className="legal-card">
          <p className="effective-date"><strong>Effective Date:</strong> [DATE]</p>

          <h2>Urbana FBLA — Terms of Service</h2>
          <p>
            By using this website, you agree to the following terms. This site is built
            and maintained by students of the Urbana FBLA chapter at Urbana High School.
            It is <strong>not an official Frederick County Public Schools (FCPS)
            system</strong>, and FCPS is not responsible for its content or operation.
          </p>

          <h3>1. Eligibility</h3>
          <p>
            You must be at least 13 years old to create an account on this site. By
            creating an account, you confirm that you meet this age requirement.
          </p>

          <h3>2. Accounts</h3>
          <p>
            You can create an account using a Google account or an email address and
            password. Some features — particularly posting and replying on the Bulletin
            Board — may be limited to accounts associated with a school email domain. You
            are responsible for maintaining the security of your own account credentials.
          </p>

          <h3>3. Acceptable Use</h3>
          <p>When using the Bulletin Board or any other interactive feature of this site, you agree not to:</p>
          <ul>
            <li>Post harassing, threatening, hateful, or discriminatory content.</li>
            <li>Post spam, advertising, or content unrelated to the chapter community.</li>
            <li>Impersonate another person or misrepresent your affiliation with the chapter.</li>
            <li>Post illegal content, or content that infringes someone else's rights.</li>
            <li>Attempt to disrupt, hack, or gain unauthorized access to any part of the site.</li>
          </ul>
          <p>We reserve the right to remove content or suspend accounts that violate these rules.</p>

          <h3>4. Content You Post</h3>
          <p>
            You retain ownership of any content (posts, replies, images, text) you submit
            to this site. By posting content, you grant the Urbana FBLA chapter a
            non-exclusive license to display that content on this site as part of its
            normal operation. You are responsible for the content you post and confirm
            you have the right to share it.
          </p>

          <h3>5. Content Moderation</h3>
          <p>
            Chapter officers or site administrators may remove posts, replies, or accounts
            that violate these Terms or the Privacy Policy, at their discretion, without
            prior notice.
          </p>

          <h3>6. No Warranty</h3>
          <p>
            This site is provided "as is," on a volunteer, student-run basis, without
            warranties of any kind, express or implied. We do not guarantee the site will
            be available, error-free, or secure at all times.
          </p>

          <h3>7. Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, the Urbana FBLA chapter, its members,
            and site maintainers are not liable for any damages arising from your use of
            this site, including but not limited to loss of data or content submitted by
            users.
          </p>

          <h3>8. Governing Law</h3>
          <p>
            These Terms are governed by the laws of the State of Maryland, without regard
            to conflict-of-law principles.
          </p>

          <h3>9. Changes to These Terms</h3>
          <p>
            We may update these Terms from time to time as the site evolves. Continued
            use of the site after changes are posted constitutes acceptance of the
            updated Terms.
          </p>

          <h3>10. Contact Us</h3>
          <p>Questions about these Terms can be directed to:</p>
          <p><strong>uhsfbla2@gmail.com</strong></p>
        </div>
      </section>
    </>
  )
}