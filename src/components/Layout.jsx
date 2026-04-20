import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useAppData } from '../hooks/useAppData'
import SuccessPopup from './SuccessPopup'

function Layout() {
  const { user, logout } = useAuth()
  const { successMessage, clearSuccessMessage } = useAppData()

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand-mark">
          <span className="brand-dot" />
          GoGather
        </NavLink>
        <nav className="main-nav">
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/clubs">Clubs</NavLink>
          {user && <NavLink to="/dashboard">Dashboard</NavLink>}
          {user?.role === 'organizer' && <NavLink to="/organizer">Organizer</NavLink>}
        </nav>
        <div className="topbar-actions">
          {user ? (
            <>
              <div className="user-pill">
                <span>{user.name}</span>
                <small>{user.role}</small>
              </div>
              <button className="ghost-button" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <NavLink to="/auth" className="primary-button">
              Login / Sign up
            </NavLink>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <SuccessPopup message={successMessage} onClose={clearSuccessMessage} />
    </div>
  )
}

export default Layout
