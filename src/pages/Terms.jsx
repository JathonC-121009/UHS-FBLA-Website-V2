import LegalLayout from '../components/LegalLayout.jsx'

// No `label`, so this page is reachable at /terms but stays out of the nav.
// See src/pageRegistry.js.
export const meta = {
  order: 72,
  title: 'Urbana FBLA, Terms of Service',
}

const SECTIONS = [
  {
    id: 'eligibility',
    heading: 'Eligibility',
    body: (
      <p>
        You must be at least 13 years old to create an account. Creating one confirms that
        you meet that requirement.
      </p>
    ),
  },
  {
    id: 'accounts',
    heading: 'Accounts',
    body: (
      <p>
        Accounts are created with Google Sign-In. Some features, posting and replying on
        the bulletin board in particular, are limited to accounts on a school email
        domain. You are responsible for the security of your own account.
      </p>
    ),
  },
  {
    id: 'use',
    heading: 'Acceptable use',
    body: (
      <>
        <p>On the bulletin board, or any other interactive feature here, do not:</p>
        <ul>
          <li>Post harassing, threatening, hateful, or discriminatory content.</li>
          <li>Post spam, advertising, or anything unrelated to the chapter.</li>
          <li>Impersonate someone else or misstate your connection to the chapter.</li>
          <li>Post illegal content, or content that infringes someone else's rights.</li>
          <li>Attempt to disrupt the site or reach any part of it without authorization.</li>
        </ul>
        <p>We remove content and suspend accounts that break these rules.</p>
      </>
    ),
  },
  {
    id: 'content',
    heading: 'Content you post',
    body: (
      <p>
        You keep ownership of what you submit. By posting, you grant the Urbana FBLA
        chapter a non-exclusive license to display that content here as part of running
        the site. You are responsible for what you post and confirm you have the right to
        share it.
      </p>
    ),
  },
  {
    id: 'moderation',
    heading: 'Moderation',
    body: (
      <p>
        Chapter officers and site administrators may remove posts, replies, or accounts
        that break these terms or the privacy policy, at their discretion, without notice.
      </p>
    ),
  },
  {
    id: 'warranty',
    heading: 'No warranty',
    body: (
      <p>
        This site is provided as is, on a volunteer, student-run basis, without warranties
        of any kind. We cannot guarantee that it will always be available, error free, or
        secure.
      </p>
    ),
  },
  {
    id: 'liability',
    heading: 'Limitation of liability',
    body: (
      <p>
        To the fullest extent the law allows, the Urbana FBLA chapter, its members, and
        the people who maintain this site are not liable for damages arising from your use
        of it, including loss of data or of content you submitted.
      </p>
    ),
  },
  {
    id: 'law',
    heading: 'Governing law',
    body: (
      <p>
        These terms are governed by the laws of the State of Maryland, without regard to
        conflict-of-law principles.
      </p>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to these terms',
    body: (
      <p>
        We update these terms as the site changes. Continuing to use the site after an
        update means you accept the revised terms.
      </p>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact',
    body: (
      <p>
        Questions about these terms go to <strong>uhsfbla2@gmail.com</strong>.
      </p>
    ),
  },
]

export default function Terms() {
  return (
    <LegalLayout
      title="Terms of service"
      effective="September 10, 2026"
      sections={SECTIONS}
      intro={
        <p>
          Using this site means agreeing to what follows. The site is built and maintained
          by students in the Urbana FBLA chapter at Urbana High School. It is
          <strong> not an official Frederick County Public Schools system</strong>, and
          FCPS is not responsible for its content or operation.
        </p>
      }
    />
  )
}
