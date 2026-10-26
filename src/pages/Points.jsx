import { useEffect, useMemo, useRef, useState } from 'react'
import Masthead from '../components/Masthead.jsx'
import Icon from '../components/Icon.jsx'
import { useIndicator } from '../hooks/useMotion.js'
import { fetchStudentData } from '../services/sheetsService'
import './Points.css'

// Route + nav settings for this page. See src/pageRegistry.js.
export const meta = {
  label: 'Points',
  order: 31,
  title: 'Urbana FBLA, Points',
}

const BOARDS = [
  { key: 'total', label: 'All time' },
  { key: 'monthly', label: 'This month' },
]

export default function Points() {
  const [board, setBoard] = useState('total')
  const [searchTerm, setSearchTerm] = useState('')
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const switcherRef = useRef(null)

  useIndicator(switcherRef, '.switch.is-active', [board])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchStudentData()
        // Give every member a stable id up front. Rows are keyed by it, so a
        // row keeps its identity when the board is re-sorted, and two members
        // sharing a name still get distinct keys.
        if (!cancelled) setStudents(data.map((s, i) => ({ ...s, id: `${i}-${s.name}` })))
      } catch (err) {
        console.error('Failed to load student data:', err)
        if (!cancelled) setError('Standings are unavailable right now. Sign in to your school Google account and reload.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Rank once, then filter, so a search never renumbers the board.
  const ranked = useMemo(() => {
    const points = (student) => (board === 'total' ? student.totalPoints : student.monthlyPoints)
    return [...students]
      .sort((a, b) => points(b) - points(a))
      .map((student, i) => ({ ...student, rank: i + 1, points: points(student) }))
  }, [students, board])

  const leader = ranked[0]?.points || 0

  const visible = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return ranked
    return ranked.filter((student) => student.name.toLowerCase().includes(term))
  }, [ranked, searchTerm])

  return (
    <>
      <Masthead
        eyebrow="Standings"
        title={<>Member <em>points</em></>}
        lede="You earn points for going to meetings, competing, volunteering, and showing up to chapter events. Officers update the board as points come in."
        meta={[
          { label: 'Members ranked', value: loading ? 'Loading' : String(students.length) },
          { label: 'Board', value: board === 'total' ? 'All time' : 'This month' },
        ]}
      />

      <section className="points-section">
        <div className="points-wrap">
          <div className="board-controls">
            <div className="switcher" role="tablist" aria-label="Leaderboard range" ref={switcherRef}>
              {BOARDS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  role="tab"
                  aria-selected={board === option.key}
                  className={`switch press${board === option.key ? ' is-active' : ''}`}
                  onClick={() => setBoard(option.key)}
                >
                  {option.label}
                </button>
              ))}
              <span className="indicator switch-indicator" aria-hidden="true" />
            </div>

            <label className="search">
              <Icon name="search" size={16} />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Find a member"
                aria-label="Search for a member"
              />
            </label>
          </div>

          {loading && (
            <div className="board-skeleton" aria-hidden="true">
              {Array.from({ length: 8 }, (_, i) => (
                <div className="skeleton-row" key={i} style={{ '--reveal-i': i }} />
              ))}
            </div>
          )}

          {!loading && error && <p className="board-state board-state--error">{error}</p>}

          {!loading && !error && students.length === 0 && (
            <p className="board-state">No points have been recorded yet this year.</p>
          )}

          {!loading && !error && students.length > 0 && (
            <>
              <div className="board" data-reveal-group>
                <div className="board-head">
                  <span>Rank</span>
                  <span>Member</span>
                  <span>Points</span>
                </div>

                {visible.map((student) => (
                  <div
                    className={`board-row${student.rank <= 3 ? ` is-top rank-${student.rank}` : ''}`}
                    key={student.id}
                    data-reveal="fade"
                    style={{ '--share': leader ? student.points / leader : 0 }}
                  >
                    <span className="board-rank">{String(student.rank).padStart(2, '0')}</span>
                    <span className="board-name">{student.name}</span>
                    <span className="board-points">{student.points}</span>
                  </div>
                ))}
              </div>

              {visible.length === 0 && (
                <p className="board-state">No member matches that name.</p>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
