import ClubCard from '../components/ClubCard'
import EmptyState from '../components/EmptyState'
import EventCard from '../components/EventCard'
import SectionHeader from '../components/SectionHeader'
import { useAppData } from '../hooks/useAppData'
import { useAuth } from '../hooks/useAuth'

function DashboardPage() {
  const { user } = useAuth()
  const { events, clubs, toggleSaveEvent, registerForEvent, toggleJoinClub } = useAppData()

  const savedEvents = events.filter((event) => user?.savedEventIds?.includes(event.id))
  const registeredEvents = events.filter((event) => user?.registeredEventIds?.includes(event.id))
  const joinedClubs = clubs.filter((club) => user?.joinedClubIds?.includes(club.id))

  const stats = [
    { label: 'saved events', value: savedEvents.length },
    { label: 'registrations', value: registeredEvents.length },
    { label: 'joined clubs', value: joinedClubs.length },
  ]

  return (
    <section className="page-shell">
      <SectionHeader
        eyebrow="Your dashboard"
        title={`Welcome back, ${user.name}`}
        description="A cleaner overview of your saved events, confirmed registrations, and club memberships."
      />

      <div className="stats-row">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card active">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="stack-grid dashboard-sections">
        <div className="card">
          <div className="section-header compact-header">
            <div>
              <h3>Saved events</h3>
              <p>Everything you bookmarked for later, now shown in a clean grid.</p>
            </div>
          </div>
          {savedEvents.length ? (
            <div className="card-grid">
              {savedEvents.map((event) => (
                <EventCard key={event.id} event={event} onSave={toggleSaveEvent} onRegister={registerForEvent} />
              ))}
            </div>
          ) : (
            <EmptyState title="No saved events yet" body="Save an event to revisit it from your dashboard." />
          )}
        </div>

        <div className="card">
          <div className="section-header compact-header">
            <div>
              <h3>Registered events</h3>
              <p>Your confirmed plans and upcoming campus sessions in one place.</p>
            </div>
          </div>
          {registeredEvents.length ? (
            <div className="card-grid">
              {registeredEvents.map((event) => (
                <EventCard key={event.id} event={event} onSave={toggleSaveEvent} onRegister={registerForEvent} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No registrations yet"
              body="Once you register for an event, it will appear here for quick access."
            />
          )}
        </div>

        <div className="card">
          <div className="section-header compact-header">
            <div>
              <h3>Joined clubs</h3>
              <p>Your communities, grouped together in the same grid-based layout.</p>
            </div>
          </div>
          {joinedClubs.length ? (
            <div className="card-grid">
              {joinedClubs.map((club) => (
                <ClubCard key={club.id} club={club} onJoin={toggleJoinClub} />
              ))}
            </div>
          ) : (
            <EmptyState title="No clubs joined yet" body="Join a club to keep its community and events close by." />
          )}
        </div>
      </div>
    </section>
  )
}

export default DashboardPage
