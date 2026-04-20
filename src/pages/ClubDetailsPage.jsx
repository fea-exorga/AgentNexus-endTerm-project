import { Link, useParams } from 'react-router-dom'
import ClubJoinForm from '../components/ClubJoinForm'
import EmptyState from '../components/EmptyState'
import EventCard from '../components/EventCard'
import { useAppData } from '../hooks/useAppData'
import { useAuth } from '../hooks/useAuth'

function ClubDetailsPage() {
  const { clubId } = useParams()
  const { clubs, events, toggleJoinClub, toggleSaveEvent, registerForEvent } = useAppData()
  const { user } = useAuth()
  const club = clubs.find((entry) => entry.id === clubId)

  if (!club) {
    return (
      <section className="page-shell">
        <EmptyState title="Club not found" body="This club profile is unavailable." />
      </section>
    )
  }

  const clubEvents = events.filter((event) => event.clubId === club.id)

  return (
    <section className="page-shell">
      <div className="club-hero">
        <img src={club.image} alt={club.name} className="club-cover" />
        <div>
          <span className="eyebrow">{club.category}</span>
          <h1>{club.name}</h1>
          <p className="hero-copy">{club.description}</p>
          <div className="action-row">
            {user && (
              <button className="primary-button" onClick={() => toggleJoinClub(club.id)}>
                {club.isJoined ? 'Leave club' : 'Quick join'}
              </button>
            )}
            <span className="ghost-pill">{club.membersCount} members</span>
          </div>
        </div>
      </div>

      <div className="detail-shell">
        <div>
          <div className="section-header compact-header">
            <div>
              <h2>Upcoming events from {club.name}</h2>
              <p>See what this club is hosting next and jump into the activities that fit you best.</p>
            </div>
          </div>
          <div className="card-grid">
            {clubEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSave={toggleSaveEvent}
                onRegister={registerForEvent}
                showActions={Boolean(user)}
              />
            ))}
          </div>
        </div>

        <aside className="card detail-side">
          {user ? (
            <ClubJoinForm club={club} isJoined={club.isJoined} onSubmit={() => toggleJoinClub(club.id)} user={user} />
          ) : (
            <>
              <h3>Join this club</h3>
              <p>Log in to submit the join form and become part of the community.</p>
              <Link className="primary-button" to="/auth">
                Login to continue
              </Link>
            </>
          )}
        </aside>
      </div>
    </section>
  )
}

export default ClubDetailsPage
