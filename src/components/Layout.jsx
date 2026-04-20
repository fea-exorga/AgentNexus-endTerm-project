import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand-mark">
          <span className="brand-dot" />
          CampusConnect
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
              Login / Signup
            </NavLink>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
