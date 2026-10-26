/**
 * The site's entire icon set, drawn as inline strokes on a 24 unit grid so
 * every glyph shares one weight and inherits the surrounding text color.
 * Usage: <Icon name="close" /> or <Icon name="arrow" size={14} />
 */
const PATHS = {
  close: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  arrowLeft: <path d="M20 12H5m6-6-6 6 6 6" />,
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  chevronRight: <path d="M9 5l7 7-7 7" />,
  chevronDown: <path d="M5 9l7 7 7-7" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4.3-4.3" /></>,
  zoom: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4.3-4.3M11 8.5v5M8.5 11h5" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m3.5 6 8.5 7 8.5-7" /></>,
  pin: <><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="1" /><path d="M3.5 10h17M8 3.5v3M16 3.5v3" /></>,
  camera: <><path d="M3.5 8h3l1.5-2.5h8L17.5 8h3v11h-17z" /><circle cx="12" cy="13" r="3.5" /></>,
  image: <><rect x="3.5" y="5" width="17" height="14" rx="1" /><path d="m4 16 5-5 4 4 3-2 4 4" /><circle cx="9" cy="9.5" r="1.2" /></>,
  message: <path d="M4 5h16v11H9l-5 4V5Z" />,
  trash: <><path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" /></>,
  user: <><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20c1.4-4 4.1-6 7.5-6s6.1 2 7.5 6" /></>,
  school: <><path d="M3 10.5 12 5l9 5.5-9 5.5z" /><path d="M6.5 13v5.5c0 .8 2.5 1.5 5.5 1.5s5.5-.7 5.5-1.5V13" /></>,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  external: <><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M18 14v5.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5H10" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
}

export default function Icon({ name, size = 16, className, strokeWidth = 1.6 }) {
  const glyph = PATHS[name]
  if (!glyph) return null

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {glyph}
    </svg>
  )
}
