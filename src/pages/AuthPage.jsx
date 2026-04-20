import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const interestsList = ['Tech', 'Career', 'Creative', 'Cultural', 'Entrepreneurship']

function AuthPage() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    interests: ['Tech', 'Career'],
  })
  const [submitting, setSubmitting] = useState(false)
  const { login, signup, authError, clearAuthError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const destination = useMemo(() => location.state?.from ?? '/dashboard', [location.state])

  const handleChange = (event) => {
    const { name, value } = event.target
    clearAuthError()
    setForm((current) => ({ ...current, [name]: value }))
  }

  const toggleInterest = (interest) => {
    clearAuthError()
    setForm((current) => {
      const nextInterests = current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest]

      return {
        ...current,
        interests: nextInterests,
      }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      if (mode === 'login') {
        const user = await login({ email: form.email, password: form.password })
        navigate(user.role === 'organizer' ? '/organizer' : destination)
      } else {
        const user = await signup(form)
        navigate(user.role === 'organizer' ? '/organizer' : '/dashboard')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page-shell auth-shell">
      <div className="auth-copy">
        <span className="eyebrow">CampusConnect access</span>
        <h1>Launch the student or organizer experience.</h1>
        <p>
          Use the demo accounts below or create a new one. This flow is persistent and ready to be swapped to
          Firebase when you add your credentials.
        </p>
        <div className="card demo-card">
          <h3>Demo accounts</h3>
          <p>`student@campusconnect.dev` / `demo123`</p>
          <p>`organizer@campusconnect.dev` / `demo123`</p>
        </div>
      </div>

      <div className="card auth-card">
        <div className="pill-toggle">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')} type="button">
            Login
          </button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')} type="button">
            Signup
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label>
              Full name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
          )}

          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>

          {mode === 'signup' && (
            <>
              <label>
                Role
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="student">Student</option>
                  <option value="organizer">Organizer</option>
                </select>
              </label>

              <div>
                <span className="label">Interests</span>
                <div className="tag-row">
                  {interestsList.map((interest) => (
                    <button
                      key={interest}
                      className={form.interests.includes(interest) ? 'tag-button active' : 'tag-button'}
                      onClick={() => toggleInterest(interest)}
                      type="button"
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {authError && <p className="error-text">{authError}</p>}

          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default AuthPage
