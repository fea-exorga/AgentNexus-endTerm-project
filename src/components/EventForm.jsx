import { useState } from 'react'
import { categories } from '../services/mockData'

const initialState = {
  title: '',
  summary: '',
  description: '',
  category: 'Tech',
  clubId: 'club-1',
  venue: '',
  date: '',
  registrationDeadline: '',
  capacity: 50,
  mode: 'Offline',
  tags: '',
}

function EventForm({ clubs, initialEvent, onSubmit, onCancel }) {
  const [form, setForm] = useState(() =>
    initialEvent
      ? {
          ...initialEvent,
          tags: Array.isArray(initialEvent.tags) ? initialEvent.tags.join(', ') : initialEvent.tags,
        }
      : initialState,
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const submit = (event) => {
    event.preventDefault()
    onSubmit({
      ...form,
      capacity: Number(form.capacity),
    })
    if (!initialEvent) {
      setForm(initialState)
    }
  }

  return (
    <form className="event-form" onSubmit={submit}>
      <div className="field-grid">
        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            {categories.filter((item) => item !== 'All').map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="full-span">
          Summary
          <input name="summary" value={form.summary} onChange={handleChange} required />
        </label>
        <label className="full-span">
          Description
          <textarea name="description" value={form.description} onChange={handleChange} rows="4" required />
        </label>
        <label>
          Club
          <select name="clubId" value={form.clubId} onChange={handleChange}>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Venue
          <input name="venue" value={form.venue} onChange={handleChange} required />
        </label>
        <label>
          Date and Time
          <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required />
        </label>
        <label>
          Registration Deadline
          <input
            type="datetime-local"
            name="registrationDeadline"
            value={form.registrationDeadline}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Capacity
          <input type="number" min="1" name="capacity" value={form.capacity} onChange={handleChange} required />
        </label>
        <label>
          Mode
          <select name="mode" value={form.mode} onChange={handleChange}>
            <option value="Offline">Offline</option>
            <option value="Online">Online</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </label>
        <label className="full-span">
          Tags
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Hackathon, Networking, Portfolio"
          />
        </label>
      </div>
      <div className="action-row">
        <button className="primary-button" type="submit">
          {initialEvent ? 'Update event' : 'Create event'}
        </button>
        {initialEvent && (
          <button className="ghost-button" type="button" onClick={onCancel}>
            Cancel edit
          </button>
        )}
      </div>
    </form>
  )
}

export default EventForm
