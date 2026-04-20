import { useEffect, useRef } from 'react'
import { Link, useSearchParams, useParams } from 'react-router-dom'
import EventRegistrationForm from '../components/EventRegistrationForm'
import EmptyState from '../components/EmptyState'
import { useAppData } from '../hooks/useAppData'
import { useAuth } from '../hooks/useAuth'
import { isRegistrationClosed } from '../services/platformService'

function EventDetailsPage() {
  const { eventId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { events, registerForEvent, toggleSaveEvent } = useAppData()
  const { user } = useAuth()
  const event = events.find((entry) => entry.id === eventId)
  const registrationClosed = event ? isRegistrationClosed(event) : false
  const showRegistrationForm = searchParams.get('register') === '1'
  const formRef = useRef(null)

  useEffect(() => {
    if (showRegistrationForm) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showRegistrationForm])

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
            <p>{registrationClosed ? 'Registration closed' : 'Registration open'}</p>
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
        <h3>Event registration</h3>
        <p>Save this event to your dashboard and open the registration form when you are ready to confirm your spot.</p>
        {user ? (
          <div className="stacked-actions">
            <button className="ghost-button" onClick={() => toggleSaveEvent(event.id)}>
              {event.isSaved ? 'Remove from saved' : 'Save for later'}
            </button>
            <button
              className="primary-button"
              disabled={registrationClosed || event.isRegistered}
              onClick={() => {
                setSearchParams({ register: '1' })
              }}
              type="button"
            >
              {registrationClosed ? 'Registration closed' : event.isRegistered ? 'Registered' : 'Open registration form'}
            </button>
            {showRegistrationForm && (
              <div className="registration-panel" ref={formRef}>
                <EventRegistrationForm
                  event={event}
                  isClosed={registrationClosed}
                  isRegistered={event.isRegistered}
                  onSubmit={() => registerForEvent(event.id)}
                  user={user}
                />
              </div>
            )}
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
