import { useParams } from 'react-router-dom'
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
                {club.isJoined ? 'Joined club' : 'Join club'}
              </button>
            )}
            <span className="ghost-pill">{club.membersCount} members</span>
          </div>
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
    </section>
  )
}

export default ClubDetailsPage
