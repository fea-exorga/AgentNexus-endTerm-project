import { useMemo, useState } from 'react'
import EventForm from '../components/EventForm'
import SectionHeader from '../components/SectionHeader'
import { useAppData } from '../hooks/useAppData'
import { useAuth } from '../hooks/useAuth'

function OrganizerPage() {
  const { user } = useAuth()
  const { events, clubs, createEvent, updateEvent, deleteEvent } = useAppData()
  const [editingId, setEditingId] = useState(null)

  const myEvents = useMemo(
    () => events.filter((event) => event.organizerId === user.id || user.managedClubIds?.includes(event.clubId)),
    [events, user.id, user.managedClubIds],
  )

  const editingEvent = myEvents.find((event) => event.id === editingId)

  const handleSubmit = async (payload) => {
    if (editingId) {
      await updateEvent(editingId, payload)
      setEditingId(null)
      return
    }

    await createEvent(payload)
  }

  return (
    <section className="page-shell">
      <SectionHeader
        eyebrow="Organizer workspace"
        title="Manage your events and club presence"
        description="This dashboard covers create, update, and delete workflows with persistent data."
      />

      <div className="dashboard-grid">
        <div className="card">
          <h3>{editingId ? 'Edit event' : 'Create a new event'}</h3>
          <EventForm
            key={editingId ?? 'new'}
            clubs={clubs}
            initialEvent={editingEvent}
            onSubmit={handleSubmit}
            onCancel={() => setEditingId(null)}
          />
        </div>

        <div className="stack-grid">
          <div className="card">
            <h3>Organizer metrics</h3>
            <p>{myEvents.length} events managed</p>
            <p>{myEvents.reduce((sum, event) => sum + event.registeredCount, 0)} total registrations</p>
            <p>{clubs.length} clubs available in the directory</p>
          </div>

          <div className="card">
            <h3>Your event list</h3>
            {myEvents.map((event) => (
              <div key={event.id} className="list-row">
                <div>
                  <strong>{event.title}</strong>
                  <p>
                    {event.clubName} · {new Date(event.date).toLocaleString()}
                  </p>
                </div>
                <div className="action-row">
                  <button className="ghost-button" onClick={() => setEditingId(event.id)}>
                    Edit
                  </button>
                  <button className="danger-button" onClick={() => deleteEvent(event.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrganizerPage
