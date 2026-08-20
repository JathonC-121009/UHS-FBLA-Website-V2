import './Privacy.css'

// No `label`, so this page is reachable at /privacy but hidden from the nav.
// See src/pageRegistry.js.
export const meta = {
  order: 71,
  title: 'Urbana FBLA — Privacy Policy',
}

export default function Privacy() {
  return (
    <>
      <div className="legal-header fi">
        <p className="section-label">Legal</p>
        <h1>Privacy Policy</h1>
        <div className="divider"></div>
      </div>

      <section className="legal-wrap fi">
        <div className="legal-card">
          <p className="effective-date"><strong>Effective Date:</strong> [DATE]</p>

          <h2>Urbana FBLA — Privacy Policy</h2>
          <p>
            This website is run by and for members of the Urbana FBLA (Future Business
            Leaders of America) chapter at Urbana High School. It is a student-built
            and student-operated project. While it serves the chapter's community, it
            is <strong>not an official Frederick County Public Schools (FCPS) system or
            website</strong>, and FCPS does not operate, endorse, or take responsibility
            for it.
          </p>

          <h3>1. Information We Collect</h3>
          <p>When you create an account or use features of this site, we may collect:</p>
          <ul>
            <li><strong>Name</strong> — provided by you during account setup, or from your Google account if you sign in with Google.</li>
            <li><strong>Email address</strong> — associated with your account, used for sign-in and account identification.</li>
            <li><strong>Grade level</strong> — collected during profile setup (9th, 10th, 11th, 12th, or Staff/Other).</li>
            <li><strong>Content you post</strong> — including Bulletin Board posts, replies, and any images or links you choose to include in them.</li>
            <li><strong>Authentication data</strong> — handled through Google Sign-In or email/password, depending on how you choose to sign in.</li>
          </ul>
          <p>We do <strong>not</strong> collect payment information, government ID numbers, or precise location data.</p>

          <h3>2. How We Use Your Information</h3>
          <p>We use the information above to:</p>
          <ul>
            <li>Create and manage your account.</li>
            <li>Display your name alongside posts and replies you make on the Bulletin Board.</li>
            <li>Determine whether your account is associated with a school email domain, which affects certain posting permissions.</li>
            <li>Operate features like the chapter Calendar, if and when Google Calendar integration is active.</li>
          </ul>
          <p>We do not sell your information, and we do not use it for advertising.</p>

          <h3>3. Third-Party Services We Use</h3>
          <p>This site relies on the following third-party services to operate:</p>
          <ul>
            <li><strong>Firebase Authentication</strong> (Google) — handles sign-in via Google account or email/password.</li>
            <li><strong>Firebase Firestore</strong> (Google) — stores account profile data (name, grade level) and Bulletin Board posts/replies.</li>
            <li><strong>Google Sign-In</strong> — an optional sign-in method using your existing Google account.</li>
            <li><strong>Google Calendar API</strong> — if and when the chapter Calendar feature is active, this may be used to display chapter events. This section will be updated with further detail once that feature is finalized.</li>
            <li><strong>Google Forms</strong> — our Contact Us page may use an embedded Google Form to let visitors send messages to the chapter. If you submit that form, your submission is subject to Google's own privacy practices in addition to this policy.</li>
          </ul>
          <p><em>This section will be updated once our Contact Us implementation is finalized, since the exact data flow depends on that decision.</em></p>

          <h3>4. Data Storage and Security</h3>
          <p>
            Account and Bulletin Board data is stored using Firebase, a service provided
            by Google. We use Firestore security rules to restrict who can create, edit,
            or delete data — for example, only signed-in school-affiliated accounts can
            create or modify posts and replies, and users can only edit their own account
            profile.
          </p>
          <p>
            No online system can guarantee perfect security, but we take reasonable steps
            to limit who can access and modify data on this site.
          </p>

          <h3>5. Age Requirement</h3>
          <p>
            You must be <strong>at least 13 years old</strong> to create an account on this
            site. This site is not intended for children under 13, and we do not knowingly
            collect personal information from children under 13. If you believe a child
            under 13 has created an account, please contact us at the email below so we can
            address it.
          </p>

          <h3>6. Your Choices and Rights</h3>
          <ul>
            <li>You can browse most of this site, including the Bulletin Board, <strong>without creating an account</strong>.</li>
            <li>If you have an account, you may request that we delete your account and associated data by contacting us at the email below.</li>
            <li>You may request a copy of the information we have associated with your account.</li>
          </ul>

          <h3>7. Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy from time to time as the site's features
            change. The "Effective Date" at the top of this page will reflect the most
            recent update.
          </p>

          <h3>8. Contact Us</h3>
          <p>Questions about this Privacy Policy can be directed to:</p>
          <p><strong>uhsfbla2@gmail.com</strong></p>
        </div>
      </section>
    </>
  )
}