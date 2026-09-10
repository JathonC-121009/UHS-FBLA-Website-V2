# UHS-FBLA-Website

The 2026 / 2027 Urbana High School FBLA website, built with **React + Vite** and
**React Router**.

## Getting started

```bash
npm install
npm run dev      # dev server on http://localhost:5173
npm run build    # production build into dist/
npm run preview  # preview the production build
```

Copy `.env.example` to `.env` and fill in the Firebase and Google Calendar keys
before running. Without them, sign-in and the calendar fall back to their error
states; the rest of the site works.

## The one rule

**Each page owns exactly two files, and those are the only files you touch.**

| You want to                            | Edit only                           |
| -------------------------------------- | ----------------------------------- |
| Restyle a page (color, layout, size)    | `src/pages/<Page>.css`              |
| Change a page's words                   | `src/pages/<Page>.jsx`              |
| Add a page                              | add `<Page>.jsx` and `<Page>.css`   |
| Rename a nav link or reorder the nav    | that page's `meta` in its `.jsx`    |
| Remove a page                           | delete its two files                |

`App.jsx`, `Navbar.jsx`, `Layout.jsx`, `pageRegistry.js`, `index.css`, `hooks/`,
`context/`, `services/` and `firebaseConfig.js` stay untouched during normal
page work. The exceptions are listed at the bottom.

## Structure

```
index.html              Vite entry: fonts, favicon, #root
src/
  main.jsx              React entry, AuthProvider + router
  App.jsx               Builds routes from the page registry
  pageRegistry.js       Auto-discovers src/pages/*.jsx, which is why nothing
                        else needs editing when pages change
  index.css             Design tokens, shared chrome, motion primitives
  hooks/
    useMotion.js        The motion layer: reveals, scroll progress, parallax,
                        pointer tilt, sliding indicators, shared expansion
    useAuth.js          Reads the auth context
    useCalendar.js      Google Calendar events
    usePosts.js         Firestore posts and replies
  context/
    AuthProvider.jsx    Google sign-in state, mounted in main.jsx
  services/             Firebase auth, Firestore, Calendar, Sheets calls
  components/
    Layout.jsx          Nav + <Outlet/> + Footer, scroll reset, body route
                        class, tab title, site-wide motion
    Navbar.jsx          Sticky nav, links generated from the registry
    Footer.jsx          Shared footer
    Masthead.jsx        The header every inner page opens with
    Icon.jsx            The whole icon set, drawn inline
    Counter.jsx         Figure that counts up when scrolled into view
    Portal.jsx          Renders overlays at the end of <body>
    LegalLayout.jsx     Shared frame for /privacy and /terms
    AuthWidget/Modal    Sign-in control and dialog
    BulletinBoard/      Board, Note, and the board's three dialogs
  pages/
    Home.jsx/.css       /
    Events.jsx/.css     /events, the live chapter calendar
    Resources.jsx/.css  /resources, competitive event folders
    Points.jsx/.css     /points, member standings
    Officers.jsx/.css   /officers
    Gallery.jsx/.css    /gallery, Cloudinary-backed grid and lightbox
    Contact.jsx/.css    /contact
    Bulletin.jsx/.css   /bulletin, the member board
    ThankYou.jsx/.css   /thank-you, hidden from the nav
    Privacy.jsx         /privacy, content only; layout comes from LegalLayout
    Terms.jsx           /terms, same
    _Template.jsx/.css  Copy-paste starter; `_` files never become routes
  assets/
    hero.jpg            Home hero photograph
```

The original static HTML is kept in `FBLA Website/` for reference.

## How a page declares itself

Every page exports a `meta` object. The registry reads it to build the route and
the navbar link, so `App.jsx` and `Navbar.jsx` never need editing:

```jsx
export const meta = {
  label: 'Events',                  // navbar text; omit to hide from the nav
  order: 20,                        // navbar position, low numbers first
  title: 'Urbana FBLA, Events',     // browser tab title
  // path: 'custom-url',            // optional URL override (defaults to slug)
  // index: true,                   // optional: makes this the "/" page
}
```

The slug comes from the filename: `Events.jsx` becomes `/events`, `ThankYou.jsx`
becomes `/thank-you`.

## How page styles stay isolated

While a page is showing, `Layout.jsx` puts a class on `<body>` naming the route:
`route-home`, `route-events`, and so on. **Every rule in a page stylesheet is
scoped under that class:**

```css
.route-events .day { ... }
```

Two consequences:

1. **Your styles can never break another page.** Two pages can both use `.card`
   without colliding.
2. **You can restyle the shared nav, footer and masthead for your page alone.**
   Either override a token:

   ```css
   .route-events { --surface: #fff; --accent: var(--blue-700); }
   ```

   or target the element directly:

   ```css
   .route-events .nav { border-bottom-color: transparent; }
   ```

## The design system

All of it lives in `:root` at the top of `src/index.css`.

- **Type.** `--font-display` (Archivo) for headlines, `--font-sans` (Inter) for
  everything read at length. `--font-mono` is a legacy name kept because page
  stylesheets reference it; it now also resolves to Inter, because the small
  letter-spaced monospace labels it used to carry were the least readable thing
  on the site. Archivo and Inter are the closest widely available pairing to
  FBLA's brand face, Apercu Pro. Sizes come from the `--step-*` scale, which is
  fluid, so pages should not hard-code `font-size` in pixels.
- **Color.** The official FBLA brand palette: navy `--navy-900` (#0a2e7f) with
  `--navy-950` / `--navy-800` shades, `--blue-700` (#1d52bc) and `--blue-600`
  (#226add), and gold `--gold` (#f4ab19). Gold fails contrast as text on white,
  so use `--accent` (a deepened gold) on light surfaces and `--accent-ink` /
  `--gold` on navy. Alongside those: cool greys (`--ink-900` through
  `--ink-400`), paper (`--paper-000` through `--paper-300`) and hairlines
  (`--line`, `--line-ink`).
- **Spacing.** `--space-section` between major sections and `--space-block`
  between blocks inside one. Reach for those before writing a fresh `clamp()`,
  so vertical rhythm stays consistent from page to page.
- **Elevation.** Structure comes from 1px hairlines and grid outlines. There
  are no drop shadows and no glows anywhere in the site, so if a component
  needs to separate from its background, give it a border or a surface change.
- **Motion.** `--e-out`, `--e-spring` and `--e-inout` are the three easing
  curves; `--t-fast`, `--t-mid` and `--t-slow` the three durations.

## Animating something

Nothing needs wiring up: `Layout.jsx` runs the motion layer for the whole site,
and everything is opt-in through markup.

| Add this                      | And the element                                        |
| ----------------------------- | ------------------------------------------------------ |
| `data-reveal`                 | rises into view when scrolled to                        |
| `data-reveal="fade\|left\|right\|scale\|clip"` | uses that entrance instead        |
| `data-reveal-group`           | staggers every `data-reveal` inside it                  |
| `data-parallax="0.08"`        | drifts with the scroll at that rate                     |
| `class="tilt"`                | tilts slightly toward the pointer                       |
| `class="edge"`                | brightens its 1px border nearest the pointer            |
| `class="press"`               | scales down briefly when clicked                        |

For a tab strip or a nav, call `useIndicator(ref, '.is-active')` and drop a
`<span className="indicator" />` inside the container; the underline slides
between items. For a dialog that should grow out of the thing that opened it,
capture the trigger's `getBoundingClientRect()` on click and call
`sharedExpand(node, rect)` from the dialog's ref callback, as `Gallery.jsx` and
`Events.jsx` do. Everything degrades to a static page under
`prefers-reduced-motion: reduce`.

Two rules keep reveals from ever hiding real content, and both matter if you
touch `useMotion.js`:

- The hidden state is gated behind `html.reveal-ready`, which the hook adds
  itself. If the script never runs, nothing is hidden and the page renders as
  plain HTML rather than a blank screen.
- A revealed element carries the `data-in` **attribute**, not a class. React
  rewrites `className` whenever an element re-renders, which silently wipes a
  class added from outside React and strands the element at `opacity: 0`. That
  is what used to blank out most of the points leaderboard whenever the board
  was switched. Never move this back to a class.

A failsafe timer also shows anything still hidden shortly after it appears, so
a dropped observer callback cannot leave content permanently invisible.

## Adding a page

1. Copy `src/pages/_Template.jsx` to `MyPage.jsx`, and `_Template.css` to
   `MyPage.css`.
2. In the `.jsx`: rename the function, fix the CSS import, edit `meta`.
3. In the `.css`: replace `.route-template` with `.route-my-page`.

The route and the nav link appear on their own. No other file changes.

## Writing copy for this site

House style, applied everywhere:

- No emoji, anywhere, including code comments. Icons come from `Icon.jsx`.
- No em dashes. Use a period, a comma, a colon, or a second sentence.
- Say the thing. Skip "leverage", "seamless", "empower", "unlock", "cutting
  edge", and anything else that could describe any organization at all.
- Numbers and facts beat adjectives: "over fifty members at Nationals" rather
  than "an incredible showing".

## When shared files do need changing

| Situation | File(s) | Why |
| --- | --- | --- |
| A change should apply to **every** page (brand color, site font, nav height) | `src/index.css` | Global by definition. Prefer editing a token in `:root` over adding rules. |
| Changing **nav, footer or masthead markup** | `src/components/*.jsx` | The markup is shared; only its styling is page-overridable. |
| Adding **site-wide behavior** (a 404 page, analytics, a new motion primitive) | `src/components/Layout.jsx`, `src/hooks/useMotion.js` | Applies to all routes. |
| A page needs **new live data** | `src/hooks/`, `src/services/` | Data fetching stays out of components. |
| Adding an **npm package** | `package.json` | Unavoidable. |

## Known gaps

- The Google Calendar key in `.env` must allow the origin you are serving from,
  or `/events` shows its error state. A 403 from the API is a key restriction,
  not a bug in the page.
- `/privacy` and `/terms` carry a `[DATE]` placeholder for the effective date.
  Set it before the site goes public.
