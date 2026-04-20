import { Link } from 'react-router-dom'
import ClubCard from '../components/ClubCard'
import EventCard from '../components/EventCard'
import SectionHeader from '../components/SectionHeader'
import { useAppData } from '../hooks/useAppData'
import { useAuth } from '../hooks/useAuth'

function HomePage() {
  const { events, clubs, loading, toggleJoinClub, toggleSaveEvent, registerForEvent } = useAppData()
  const { user } = useAuth()

  const featuredEvents = events.filter((event) => event.featured).slice(0, 3)
  const spotlightClubs = clubs.slice(0, 3)

  return (
    <div>
      <section className="hero-shell page-shell">
        <div>
          <span className="eyebrow">Campus discovery for students</span>
          <h1>Find events worth showing up for.</h1>
          <p className="hero-copy">
            CampusConnect brings student clubs, workshops, cultural programs, and career opportunities into one
            streamlined platform for discovery and participation.
          </p>
          <div className="action-row">
            <Link className="primary-button" to="/events">
              Explore events
            </Link>
            <Link className="ghost-button" to="/clubs">
              Browse clubs
            </Link>
          </div>
          <div className="stats-row">
            <div className="stat-card">
              <strong>{events.length}</strong>
              <span>active events</span>
            </div>
            <div className="stat-card">
              <strong>{clubs.length}</strong>
              <span>campus clubs</span>
            </div>
            <div className="stat-card">
              <strong>{user ? 'Live dashboard' : '2 demo accounts'}</strong>
              <span>{user ? 'personalized for you' : 'student and organizer'}</span>
            </div>
          </div>
        </div>
        <div className="hero-panel">
          <h3>This project demonstrates</h3>
          <ul className="feature-list">
            <li>Authentication and role-based routes</li>
            <li>Event and club discovery with filtering</li>
            <li>Organizer CRUD workflow</li>
            <li>Persistent user dashboards and saved data</li>
          </ul>
        </div>
      </section>

      <section className="page-shell">
        <SectionHeader
          eyebrow="Featured events"
          title="What students are signing up for this week"
          description="A high-signal landing section for deadline-based campus opportunities."
          action={<Link to="/events">See all events</Link>}
        />
        <div className="card-grid">
          {(loading ? [] : featuredEvents).map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSave={toggleSaveEvent}
              onRegister={registerForEvent}
              showActions={Boolean(user)}
            />
          ))}
        </div>
      </section>

      <section className="page-shell">
        <SectionHeader
          eyebrow="Club spotlight"
          title="Communities that make campus feel alive"
          description="Join clubs, stay updated on their events, and discover activity beyond the classroom."
          action={<Link to="/clubs">See all clubs</Link>}
        />
        <div className="card-grid">
          {(loading ? [] : spotlightClubs).map((club) => (
            <ClubCard key={club.id} club={club} onJoin={user ? toggleJoinClub : undefined} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
