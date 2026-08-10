import { addDoc, collection } from 'firebase/firestore'
import { db, auth } from '../firebaseConfig.js'

const CONTACT_COL = 'contactMessages'

/**
 * Store a Contact-page message in Firestore.
 *
 * Submissions are open to signed-out visitors — this is a public contact form,
 * not a member feature — so `authorUid` is null unless someone happens to be
 * signed in. The matching rule in firestore.rules allows create only, and
 * validates every field below; reads happen in the Firebase console.
 *
 * The field list here and the `hasOnly([...])` list in firestore.rules must
 * stay in sync, or every write fails with permission-denied.
 */
export async function addContactMessage({ firstName, lastName, email, subject, message }) {
  const data = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    subject,
    message: message.trim(),
    authorUid: auth.currentUser?.uid ?? null,
    createdAt: new Date().toISOString(),
    handled: false,
  }
  const ref = await addDoc(collection(db, CONTACT_COL), data)
  return { id: ref.id, ...data }
}
