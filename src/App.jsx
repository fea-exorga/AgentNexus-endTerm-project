import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { AppDataProvider } from './context/AppDataProvider'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import NotFoundPage from './pages/NotFoundPage'

const EventsPage = lazy(() => import('./pages/EventsPage'))
const EventDetailsPage = lazy(() => import('./pages/EventDetailsPage'))
const ClubsPage = lazy(() => import('./pages/ClubsPage'))
const ClubDetailsPage = lazy(() => import('./pages/ClubDetailsPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const OrganizerPage = lazy(() => import('./pages/OrganizerPage'))

function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <Suspense fallback={<div className="page-shell">Loading page...</div>}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="auth" element={<AuthPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="events/:eventId" element={<EventDetailsPage />} />
              <Route path="clubs" element={<ClubsPage />} />
              <Route path="clubs/:clubId" element={<ClubDetailsPage />} />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="organizer"
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <OrganizerPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppDataProvider>
    </AuthProvider>
  )
}

export default App
