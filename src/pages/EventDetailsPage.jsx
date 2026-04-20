import { Link, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import { useAppData } from '../hooks/useAppData'
import { useAuth } from '../hooks/useAuth'

function EventDetailsPage() {
  const { eventId } = useParams()
  const { events, registerForEvent, toggleSaveEvent } = useAppData()
  const { user } = useAuth()
  const event = events.find((entry) => entry.id === eventId)

  if (!event) {
    return (
      <section className="page-shell">
        <EmptyState title="Event not found" body="The event may have been removed or the link is incorrect." />
      </section>
    )
  }

  return (
    <section className="page-shell detail-shell">
      <div className="detail-main">
        <span className="eyebrow">{event.category}</span>
        <h1>{event.title}</h1>
        <p className="hero-copy">{event.description}</p>
        <div className="detail-grid">
          <div className="card">
            <h3>Event info</h3>
            <p>Date: {new Date(event.date).toLocaleString()}</p>
            <p>Registration closes: {new Date(event.registrationDeadline).toLocaleString()}</p>
            <p>Venue: {event.venue}</p>
            <p>Hosted by: {event.clubName}</p>
          </div>
          <div className="card">
            <h3>Availability</h3>
            <p>{event.registeredCount} students already registered</p>
            <p>{event.seatsLeft} seats remaining</p>
            <p>Mode: {event.mode}</p>
            <div className="tag-row">
              {event.tags.map((tag) => (
                <span className="soft-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <aside className="detail-side card">
        <h3>Take action</h3>
        <p>Save this event to your dashboard or register if you plan to attend.</p>
        {user ? (
          <div className="stacked-actions">
            <button className="primary-button" disabled={event.isRegistered} onClick={() => registerForEvent(event.id)}>
              {event.isRegistered ? 'Already registered' : 'Register now'}
            </button>
            <button className="ghost-button" onClick={() => toggleSaveEvent(event.id)}>
              {event.isSaved ? 'Remove from saved' : 'Save for later'}
            </button>
          </div>
        ) : (
          <Link className="primary-button" to="/auth">
            Login to continue
          </Link>
        )}
      </aside>
    </section>
  )
}

export default EventDetailsPage
