import { useState } from 'react'

const initialForm = {
  attendeeName: '',
  attendeeEmail: '',
  course: '',
  note: '',
}

function EventRegistrationForm({ event, user, isClosed, isRegistered, onSubmit }) {
  const [form, setForm] = useState(() => ({
    attendeeName: user?.name ?? '',
    attendeeEmail: user?.email ?? '',
    course: '',
    note: '',
  }))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (formEvent) => {
    const { name, value } = formEvent.target
    setError('')
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await onSubmit(form)
      setForm({
        ...initialForm,
        attendeeName: user?.name ?? '',
        attendeeEmail: user?.email ?? '',
      })
    } catch (submissionError) {
      setError(submissionError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h3>Register for this event</h3>
      <p>
        Reserve your spot for <strong>{event.title}</strong> before the deadline.
      </p>
      <div className="field-grid">
        <label>
          Full name
          <input name="attendeeName" onChange={handleChange} required value={form.attendeeName} />
        </label>
        <label>
          Email
          <input
            name="attendeeEmail"
            onChange={handleChange}
            required
            type="email"
            value={form.attendeeEmail}
          />
        </label>
        <label>
          Course or year
          <input name="course" onChange={handleChange} placeholder="B.Tech CSE, 2nd year" required value={form.course} />
        </label>
        <label>
          Registration status
          <input disabled value={isClosed ? 'Registration closed' : isRegistered ? 'Already registered' : 'Open'} />
        </label>
        <label className="full-span">
          Note for the organizer
          <textarea
            name="note"
            onChange={handleChange}
            placeholder="Optional question, accessibility note, or team preference"
            rows="4"
            value={form.note}
          />
        </label>
      </div>
      {error && <p className="error-text">{error}</p>}
      <button className="primary-button" disabled={isClosed || isRegistered || submitting} type="submit">
        {isClosed ? 'Registration closed' : isRegistered ? 'Already registered' : submitting ? 'Submitting...' : 'Confirm registration'}
      </button>
    </form>
  )
}

export default EventRegistrationForm
