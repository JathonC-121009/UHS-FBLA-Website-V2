# UHS-FBLA-Website

The new 2026–2027 Urbana High School FBLA website, built with **React + Vite** and
**React Router**. In development.

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## The one rule

**Each page owns exactly two files, and those are the only files you touch.**

| You want to…                          | Edit only…                          |
| ------------------------------------- | ----------------------------------- |
| Restyle a page (colors, layout, size)  | `src/pages/<Page>.css`              |
| Change a page's words/content          | `src/pages/<Page>.jsx`              |
| Add a brand-new page                   | add `<Page>.jsx` + `<Page>.css`     |
| Rename a nav link / reorder the nav    | that page's `meta` in its `.jsx`    |
| Remove a page                          | delete its two files                |

`App.jsx`, `Navbar.jsx`, `Layout.jsx`, `pageRegistry.js`, `index.css`,
`hooks/`, `context/`, `services/` and `firebaseConfig.js` should stay
untouched during normal page work. See "When shared files DO need changing"
below for the few exceptions.

## Structure

```
index.html              Vite entry (loads Google Fonts + #root)
src/
  main.jsx              React entry, sets up the router
  App.jsx               Builds routes from the page registry
  pageRegistry.js       Auto-discovers src/pages/*.jsx — the reason nothing
                        else needs editing when pages change
  index.css             Global styles + the CSS variables pages override
  hooks/
    useFadeIn.js        IntersectionObserver scroll fade-in (the .fi class)
    useAuth.js          Reads the auth context
    useCalendar.js      Google Calendar events (needs AuthProvider mounted)
    usePosts.js         Firestore posts/replies
  context/
    AuthProvider.jsx    Google sign-in state (not mounted yet)
  services/
    authService.js      Firebase auth calls
    calendarService.js  Google Calendar API calls
    postsService.js     Firestore reads/writes
  components/
    Layout.jsx          Navbar + <Outlet/> + Footer, scroll-to-top,
                        sets the tab title and the body route class
    Navbar.jsx          Sticky nav, links generated from the registry
    Footer.jsx          Shared footer
  pages/
    Home.jsx/.css       / — hero, about, mission
    Events.jsx/.css     /events
    Calendar.jsx/.css   /calendar — month grid + event details
    Officers.jsx/.css   /officers
    Gallery.jsx/.css    /gallery — grid + lightbox
    Contact.jsx/.css    /contact — contact info + message form
    ThankYou.jsx/.css   /thank-you — form success page (hidden from nav)
    _Template.jsx/.css  Copy-paste starter; `_` files are not routes
  assets/
    hero.jpg            Home hero background
```

The original static HTML lives in the `FBLA Website/` folder for reference.

## How a page declares itself

Every page exports a `meta` object. The registry reads it to build the route
and the navbar link, so `App.jsx` and `Navbar.jsx` never need editing:

```jsx
export const meta = {
  label: 'Events',                 // navbar text — omit to hide from the nav
  order: 20,                       // navbar position, low numbers first
  title: 'Urbana FBLA — Events',   // browser tab title
  // path: 'custom-url',           // optional URL override (defaults to slug)
  // index: true,                  // optional: makes this the "/" page
}
```

The URL slug comes from the filename: `Events.jsx` → `/events`,
`ThankYou.jsx` → `/thank-you`.

## How page styles stay isolated

While a page is showing, `Layout.jsx` puts a class on `<body>` naming the
current route — `route-home`, `route-events`, `route-calendar`, and so on.
**Every rule in a page stylesheet is scoped under that class:**

```css
.route-events .event-card { ... }
```

Two consequences worth knowing:

1. **Your styles can never break another page.** Two pages can both use a
   class called `.card` without colliding.
2. **You can restyle the shared navbar, footer and hero for your page alone**,
   without opening `index.css`. Either override a variable:

   ```css
   .route-events { --nav-bg: #001a4d; --hero-bg: white; }
   ```

   or target the element directly:

   ```css
   .route-events nav { box-shadow: none; }
   ```

The full list of overridable variables is at the top of `src/index.css`.

## Adding a page

1. Copy `src/pages/_Template.jsx` → `MyPage.jsx` and `_Template.css` → `MyPage.css`.
2. In the `.jsx`: rename the function, fix the CSS import, edit `meta`.
3. In the `.css`: replace `.route-template` with `.route-my-page`.

The route and the nav link appear on their own. No other file changes.

## When shared files DO need changing

These are the only situations that require going outside `src/pages/`:

| Situation | File(s) that must change | Why |
| --- | --- | --- |
| A style should change on **every** page at once (new brand color, different site font, new nav height) | `src/index.css` | It is genuinely global by definition. Prefer editing a variable in `:root` over adding new rules. |
| Changing the **navbar or footer markup** — logo image, adding a search box, changing the copyright line | `src/components/Navbar.jsx` / `Footer.jsx` | The markup is shared; only its *styling* is page-overridable. |
| Adding **site-wide behavior** — a 404 page, analytics, a cookie banner, page transitions | `src/components/Layout.jsx` or `src/App.jsx` | Applies to all routes, not one page. |
| A page needs **live data** (Firestore posts, Google Calendar events) | `src/main.jsx` (to mount `AuthProvider`), plus `hooks/` and `services/` | See the note below. |
| Adding a **new npm package** | `package.json` | Unavoidable. |

### About live data

`hooks/` and `services/` are wired up but not connected to any page yet:
`AuthProvider` is not mounted in `main.jsx`, so `useAuth()` / `useCalendar()`
would throw if a page called them today. The Calendar page therefore renders
from the `EVENTS` array inside `Calendar.jsx` — editing that array is a normal
page-level change and needs no shared files.

Switching the Calendar to live Google Calendar data is the one change that
requires touching shared files: wrapping `<App />` in `<AuthProvider>` in
`main.jsx`, and setting up the Firebase environment variables from
`.env.example`. That is a one-time setup, not something a person restyling a
page should ever have to do.
