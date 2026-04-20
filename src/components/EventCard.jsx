import { Link } from 'react-router-dom'
import { isRegistrationClosed } from '../services/platformService'

function EventCard({ event, onSave, showActions = true }) {
  const registrationClosed = isRegistrationClosed(event)

  return (
    <article className="card event-card">
      <div className="card-topline">
        <span className="badge">{event.category}</span>
        <span>{registrationClosed ? 'Registration closed' : new Date(event.date).toLocaleString()}</span>
      </div>
      <h3>{event.title}</h3>
      <p>{event.summary}</p>
      <div className="meta-grid">
        <span>{event.clubName}</span>
        <span>{event.venue}</span>
        <span>{event.mode}</span>
        <span>{event.seatsLeft} seats left</span>
      </div>
      <div className="tag-row">
        {event.tags.map((tag) => (
          <span key={tag} className="soft-tag">
            {tag}
          </span>
        ))}
      </div>
      <div className="action-row">
        <Link className="ghost-button" to={`/events/${event.id}`}>
          View details
        </Link>
        {showActions && (
          <>
            <button className="ghost-button" onClick={() => onSave?.(event.id)}>
              {event.isSaved ? 'Saved' : 'Save'}
            </button>
            <Link
              className={registrationClosed || event.isRegistered ? 'primary-button disabled-link' : 'primary-button'}
              onClick={(clickEvent) => {
                if (registrationClosed || event.isRegistered) {
                  clickEvent.preventDefault()
                }
              }}
              to={`/events/${event.id}?register=1`}
            >
              {registrationClosed ? 'Registration closed' : event.isRegistered ? 'Registered' : 'Register'}
            </Link>
          </>
        )}
      </div>
    </article>
  )
}

export default EventCard
