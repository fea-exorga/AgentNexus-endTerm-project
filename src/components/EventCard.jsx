import { Link } from 'react-router-dom'

function EventCard({ event, onSave, onRegister, showActions = true }) {
  return (
    <article className="card event-card">
      <div className="card-topline">
        <span className="badge">{event.category}</span>
        <span>{new Date(event.date).toLocaleString()}</span>
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
            <button
              className="primary-button"
              onClick={() => onRegister?.(event.id)}
              disabled={event.isRegistered}
            >
              {event.isRegistered ? 'Registered' : 'Register'}
            </button>
          </>
        )}
      </div>
    </article>
  )
}

export default EventCard
