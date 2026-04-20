import { useMemo, useRef, useState } from 'react'
import EmptyState from '../components/EmptyState'
import EventCard from '../components/EventCard'
import SectionHeader from '../components/SectionHeader'
import { useAppData } from '../hooks/useAppData'
import { useAuth } from '../hooks/useAuth'
import { categories } from '../services/mockData'

function EventsPage() {
  const searchRef = useRef(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const { events, toggleSaveEvent, registerForEvent } = useAppData()
  const { user } = useAuth()

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory = category === 'All' || event.category === category
      const haystack = `${event.title} ${event.summary} ${event.clubName} ${event.tags.join(' ')}`.toLowerCase()
      const matchesQuery = haystack.includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [category, events, query])

  return (
    <section className="page-shell">
      <SectionHeader
        eyebrow="Discover"
        title="Events across your campus"
        description="Filter by theme, save what matters, and register before seats disappear."
        action={
          <button className="ghost-button" onClick={() => searchRef.current?.focus()}>
            Focus search
          </button>
        }
      />

      <div className="toolbar">
        <input
          ref={searchRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title, club, tag, or summary"
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {filteredEvents.length ? (
        <div className="card-grid">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSave={toggleSaveEvent}
              onRegister={registerForEvent}
              showActions={Boolean(user)}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No events matched your filters" body="Try a broader category or search term." />
      )}
    </section>
  )
}

export default EventsPage
