import './Points.css'
import { useState, useEffect } from 'react'
import { fetchStudentData } from '../services/sheetsService'

export const meta = {
  label: 'Points',   // navbar text — delete this line to hide it from the nav
  order: 31,           // navbar position; lower numbers come first
  title: 'Urbana FBLA — Points',  // browser tab title
  // path: 'custom-url',  // optional: override the URL (defaults to the slug)
  // index: true,         // optional: make this the "/" home page
}

export default function Points() {
  const [leaderboardType, setLeaderboardType] = useState('total')
  const [searchTerm, setSearchTerm] = useState('')
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch student data from Google Sheets on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchStudentData()
        setStudents(data)
      } catch (err) {
        console.error('Failed to load student data:', err)
        setError('Unable to load student data. Please make sure you are logged in to Google.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Get sorted students based on leaderboard type
  const sortedStudents = [...students].sort((a, b) => {
    const pointsA = leaderboardType === 'total' ? a.totalPoints : a.monthlyPoints
    const pointsB = leaderboardType === 'total' ? b.totalPoints : b.monthlyPoints
    return pointsB - pointsA
  })

  // Filter students based on search
  const displayedStudents = searchTerm.trim()
    ? sortedStudents.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
    : sortedStudents

  // Determine medal class based on rank
  const getMedalClass = (index) => {
    if (index === 0) return 'medal-gold'
    if (index === 1) return 'medal-silver'
    if (index === 2) return 'medal-bronze'
    return ''
  }

  return (
    <>
      <div className="page-hero">
        <p className="page-hero-label">Urbana FBLA</p>
        <h1>Point <span>Leaderboard</span></h1>
        <p>See who's standing out in Urbana FBLA!</p>
      </div>

      <section className="points-section">
        <div className="points-wrap">
          {loading && <p className="loading-state">Loading student data...</p>}
          {error && <p className="error-state">{error}</p>}
          {!loading && !error && students.length === 0 && (
            <p className="empty-state">No student data available.</p>
          )}
          {!loading && !error && students.length > 0 && (
            <>
              {/* Leaderboard Header with Search and Switcher */}
              <div className="leaderboard-header">
            <h2 className="leaderboard-title">
              {leaderboardType === 'total' ? 'Total Points' : 'Points This Month'}
            </h2>
            <input
              type="text"
              className="header-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a student..."
              aria-label="Search for student name"
            />
            <div className="switcher-group">
              <button
                className={`switcher-btn ${leaderboardType === 'total' ? 'active' : ''}`}
                onClick={() => setLeaderboardType('total')}
              >
                Total Points
              </button>
              <button
                className={`switcher-btn ${leaderboardType === 'monthly' ? 'active' : ''}`}
                onClick={() => setLeaderboardType('monthly')}
              >
                This Month
              </button>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="leaderboard">
            <div className="leaderboard-row header-row">
              <div className="rank-col">Rank</div>
              <div className="name-col">Name</div>
              <div className="points-col">Points</div>
            </div>
            {displayedStudents.map((student) => {
              const actualIndex = sortedStudents.findIndex(s => s.name === student.name)
              return (
                <div
                  key={student.name}
                  className={`leaderboard-row ${getMedalClass(actualIndex)}`}
                >
                  <div className="rank-col">#{actualIndex + 1}</div>
                  <div className="name-col">{student.name}</div>
                  <div className="points-col">
                    {leaderboardType === 'total' ? student.totalPoints : student.monthlyPoints}
                  </div>
                </div>
              )
            })}
          </div>

          {displayedStudents.length === 0 && searchTerm && (
            <p className="no-results">No students found matching "{searchTerm}".</p>
          )}
            </>
          )}
        </div>
      </section>
    </>
  )
}