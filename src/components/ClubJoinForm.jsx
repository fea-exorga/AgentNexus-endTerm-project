import { useState } from 'react'

function ClubJoinForm({ club, user, isJoined, onSubmit }) {
  const [form, setForm] = useState({
    studentName: user?.name ?? '',
    studentEmail: user?.email ?? '',
    interestArea: '',
    contribution: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setError('')
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await onSubmit(form)
    } catch (submissionError) {
      setError(submissionError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h3>Join {club.name}</h3>
      <p>Tell the club what you want to explore and we’ll add you to the community.</p>
      <div className="field-grid">
        <label>
          Full name
          <input name="studentName" onChange={handleChange} required value={form.studentName} />
        </label>
        <label>
          Email
          <input name="studentEmail" onChange={handleChange} required type="email" value={form.studentEmail} />
        </label>
        <label>
          Interest area
          <input
            name="interestArea"
            onChange={handleChange}
            placeholder="Photography, coding, speaking, design..."
            required
            value={form.interestArea}
          />
        </label>
        <label>
          Membership status
          <input disabled value={isJoined ? 'Already joined' : 'Open to join'} />
        </label>
        <label className="full-span">
          How would you like to contribute?
          <textarea
            name="contribution"
            onChange={handleChange}
            placeholder="Volunteer at events, lead workshops, create content, help with outreach..."
            rows="4"
            value={form.contribution}
          />
        </label>
      </div>
      {error && <p className="error-text">{error}</p>}
      <button className="primary-button" disabled={isJoined || submitting} type="submit">
        {isJoined ? 'Already joined' : submitting ? 'Joining...' : 'Join club'}
      </button>
    </form>
  )
}

export default ClubJoinForm
