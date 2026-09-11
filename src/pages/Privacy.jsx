import LegalLayout from '../components/LegalLayout.jsx'

// No `label`, so this page is reachable at /privacy but stays out of the nav.
// See src/pageRegistry.js.
export const meta = {
  order: 71,
  title: 'Urbana FBLA, Privacy Policy',
}

const SECTIONS = [
  {
    id: 'collect',
    heading: 'What we collect',
    body: (
      <>
        <p>When you create an account or use a member feature, we may store:</p>
        <ul>
          <li><strong>Name.</strong> Taken from the Google account you sign in with.</li>
          <li><strong>Email address.</strong> Used to identify your account and to sign you in.</li>
          <li><strong>Grade level.</strong> Recorded on your profile where it applies.</li>
          <li><strong>What you post.</strong> Bulletin board posts, replies, and any image links included in them.</li>
          <li><strong>Authentication data.</strong> Handled by Google Sign-In through Firebase.</li>
        </ul>
        <p>
          We do <strong>not</strong> collect payment information, government identification
          numbers, or precise location data.
        </p>
      </>
    ),
  },
  {
    id: 'use',
    heading: 'How we use it',
    body: (
      <>
        <ul>
          <li>To create and manage your account.</li>
          <li>To show your name next to your posts and replies on the board.</li>
          <li>To check whether your account uses a school email domain, which decides posting permissions.</li>
          <li>To run chapter features such as the calendar.</li>
        </ul>
        <p>We do not sell your information, and we do not use it for advertising.</p>
      </>
    ),
  },
  {
    id: 'services',
    heading: 'Services we rely on',
    body: (
      <>
        <p>This site runs on third-party services:</p>
        <ul>
          <li><strong>Firebase Authentication</strong> (Google) handles sign-in.</li>
          <li><strong>Firebase Firestore</strong> (Google) stores profiles and board content.</li>
          <li><strong>Google Sign-In</strong> is the only sign-in method.</li>
          <li><strong>Google Calendar</strong> supplies the events shown on the calendar page.</li>
          <li><strong>Cloudinary</strong> hosts the photographs in the gallery.</li>
        </ul>
        <p>
          Anything you submit through a Google service is also subject to Google's own
          privacy practices.
        </p>
      </>
    ),
  },
  {
    id: 'storage',
    heading: 'Storage and security',
    body: (
      <>
        <p>
          Account and board data is stored in Firebase. Firestore security rules restrict
          who can create, edit, or delete records: only signed-in, school-affiliated
          accounts can post or reply, and members can only edit their own profile.
        </p>
        <p>
          No online system is perfectly secure, but we take reasonable steps to limit who
          can reach and change data here.
        </p>
      </>
    ),
  },
  {
    id: 'age',
    heading: 'Age requirement',
    body: (
      <p>
        You must be <strong>at least 13 years old</strong> to create an account. This site
        is not intended for children under 13, and we do not knowingly collect their
        information. If you believe a child under 13 has an account, write to the address
        below and we will remove it.
      </p>
    ),
  },
  {
    id: 'choices',
    heading: 'Your choices',
    body: (
      <ul>
        <li>You can read most of this site, the bulletin board included, <strong>without an account</strong>.</li>
        <li>You can ask us to delete your account and its data by email.</li>
        <li>You can ask for a copy of the information tied to your account.</li>
      </ul>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    body: (
      <p>
        We update this policy as the site changes. The effective date at the top of the
        page always reflects the most recent revision.
      </p>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact',
    body: (
      <p>
        Questions about this policy go to <strong>uhsfbla2@gmail.com</strong>.
      </p>
    ),
  },
]

export default function Privacy() {
  return (
    <LegalLayout
      title="Privacy policy"
      effective="September 10, 2026"
      sections={SECTIONS}
      intro={
        <p>
          This site is built and run by members of the Urbana FBLA chapter at Urbana High
          School. It is a student project. It serves the chapter community, but it is
          <strong> not an official Frederick County Public Schools system</strong>, and
          FCPS does not operate, endorse, or take responsibility for it.
        </p>
      }
    />
  )
}
