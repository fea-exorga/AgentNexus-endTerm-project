import { useMemo, useState } from 'react'
import ClubCard from '../components/ClubCard'
import EmptyState from '../components/EmptyState'
import EventCard from '../components/EventCard'
import SectionHeader from '../components/SectionHeader'
import { useAppData } from '../hooks/useAppData'
import { useAuth } from '../hooks/useAuth'

function DashboardPage() {
  const [activePanel, setActivePanel] = useState('saved')
  const { user } = useAuth()
  const { events, clubs, toggleSaveEvent, registerForEvent, toggleJoinClub } = useAppData()

  const savedEvents = events.filter((event) => user?.savedEventIds?.includes(event.id))
  const registeredEvents = events.filter((event) => user?.registeredEventIds?.includes(event.id))
  const joinedClubs = clubs.filter((club) => user?.joinedClubIds?.includes(club.id))
  const recommendedEvents = events.filter((event) => user?.interests?.includes(event.category)).slice(0, 3)
  const activeContent = useMemo(() => {
    if (activePanel === 'saved') {
      return {
        title: 'Saved events',
        body: savedEvents.length ? (
          <div className="stack-grid">
            {savedEvents.map((event) => (
              <EventCard key={event.id} event={event} onSave={toggleSaveEvent} onRegister={registerForEvent} />
            ))}
          </div>
        ) : (
          <EmptyState title="No saved events yet" body="Save an event to revisit it from your dashboard." />
        ),
      }
    }

    if (activePanel === 'registered') {
      return {
        title: 'Registered events',
        body: registeredEvents.length ? (
          <div className="stack-grid">
            {registeredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSave={toggleSaveEvent}
                onRegister={registerForEvent}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No registrations yet"
            body="Once you register for an event, it will appear here for quick access."
          />
        ),
      }
    }

    return {
      title: 'Joined clubs',
      body: joinedClubs.length ? (
        <div className="stack-grid">
          {joinedClubs.map((club) => (
            <ClubCard key={club.id} club={club} onJoin={toggleJoinClub} />
          ))}
        </div>
      ) : (
        <EmptyState title="No clubs joined yet" body="Join a club to keep its community and events close by." />
      ),
    }
  }, [
    activePanel,
    joinedClubs,
    registerForEvent,
    registeredEvents,
    savedEvents,
    toggleJoinClub,
    toggleSaveEvent,
  ])

  const stats = [
    { key: 'saved', label: 'saved events', value: savedEvents.length },
    { key: 'registered', label: 'registrations', value: registeredEvents.length },
    { key: 'clubs', label: 'joined clubs', value: joinedClubs.length },
  ]

  return (
    <section className="page-shell">
      <SectionHeader
        eyebrow="Your dashboard"
        title={`Welcome back, ${user.name}`}
        description="A personalized student view with saved opportunities, registrations, and community activity."
      />

      <div className="stats-row">
        {stats.map((stat) => (
          <button
            key={stat.key}
            className={activePanel === stat.key ? 'stat-card active' : 'stat-card'}
            onClick={() => setActivePanel(stat.key)}
            type="button"
          >
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-grid">
        <div>
          <SectionHeader
            title="Recommended for your interests"
            description="A simple personalization layer driven by the categories you selected."
          />
          {recommendedEvents.length ? (
            <div className="stack-grid">
              {recommendedEvents.map((event) => (
                <EventCard key={event.id} event={event} onSave={toggleSaveEvent} onRegister={registerForEvent} />
              ))}
            </div>
          ) : (
            <EmptyState title="No recommendations yet" body="Update your interests by creating a fresh account." />
          )}
        </div>

        <div className="stack-grid">
          <div className="card">
            <div className="section-header compact-header">
              <div>
                <h3>{activeContent.title}</h3>
                <p>Click the dashboard stats to switch between your saved, registered, and joined activity.</p>
              </div>
            </div>
            {activeContent.body}
          </div>
        </div>
      </div>
    </section>
  )
}

export default DashboardPage
