import { Link } from 'react-router-dom'

function ClubCard({ club, onJoin }) {
  return (
    <article className="card club-card">
      <img src={club.image} alt={club.name} className="club-image" />
      <div className="card-topline">
        <span className="badge">{club.category}</span>
        <span>{club.membersCount} members</span>
      </div>
      <h3>{club.name}</h3>
      <p>{club.tagline}</p>
      <div className="meta-grid">
        <span>{club.upcomingEvents} upcoming events</span>
        <span>{club.contactEmail}</span>
      </div>
      <div className="action-row">
        <Link className="ghost-button" to={`/clubs/${club.id}`}>
          View club
        </Link>
        <button className="primary-button" onClick={() => onJoin?.(club.id)}>
          {club.isJoined ? 'Joined' : 'Join club'}
        </button>
      </div>
    </article>
  )
}

export default ClubCard
