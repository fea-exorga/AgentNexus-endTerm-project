import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppDataContext } from './appDataContext'
import { useAuth } from '../hooks/useAuth'
import * as platformService from '../services/platformService'

export function AppDataProvider({ children }) {
  const { user, patchUser } = useAuth()
  const [events, setEvents] = useState([])
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)

  const refresh = useCallback(async (currentUser = user) => {
    setLoading(true)
    try {
      const { events: nextEvents, clubs: nextClubs } = await platformService.getInitialData(currentUser)
      setEvents(nextEvents)
      setClubs(nextClubs)
      setError('')
    } catch {
      setError('Failed to load campus data.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    let active = true

    const loadData = async () => {
      setLoading(true)
      try {
        const { events: nextEvents, clubs: nextClubs } = await platformService.getInitialData(user)
        if (!active) {
          return
        }

        setEvents(nextEvents)
        setClubs(nextClubs)
        setError('')
      } catch {
        if (active) {
          setError('Failed to load campus data.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [user])

  const value = useMemo(
    () => ({
      events,
      clubs,
      loading,
      error,
      successMessage,
      clearSuccessMessage: () => setSuccessMessage(null),
      refresh,
      toggleSaveEvent: async (eventId) => {
        if (!user) {
          return
        }

        const nextUser = await platformService.toggleSaveEvent(user, eventId)
        patchUser(nextUser)
        await refresh(nextUser)
      },
      registerForEvent: async (eventId) => {
        if (!user) {
          throw new Error('Please log in to register.')
        }

        const nextUser = await platformService.registerForEvent(user, eventId)
        patchUser(nextUser)
        await refresh(nextUser)
        const event = events.find((entry) => entry.id === eventId)
        setSuccessMessage({
          title: 'Registration confirmed',
          body: event ? `You have successfully joined ${event.title}.` : 'Your event registration was completed successfully.',
        })
      },
      toggleJoinClub: async (clubId) => {
        if (!user) {
          return
        }

        const nextUser = await platformService.toggleJoinClub(user, clubId)
        patchUser(nextUser)
        await refresh(nextUser)
        const club = clubs.find((entry) => entry.id === clubId)
        const joinedBefore = user.joinedClubIds?.includes(clubId)
        setSuccessMessage({
          title: joinedBefore ? 'Club updated' : 'Joined successfully',
          body: club
            ? joinedBefore
              ? `You left ${club.name}.`
              : `You have successfully joined ${club.name}.`
            : 'Your club membership has been updated.',
        })
      },
      createEvent: async (payload) => {
        await platformService.createEvent(user, payload)
        await refresh(user)
      },
      updateEvent: async (eventId, payload) => {
        await platformService.updateEvent(eventId, payload)
        await refresh(user)
      },
      deleteEvent: async (eventId) => {
        await platformService.deleteEvent(eventId)
        await refresh(user)
      },
    }),
    [clubs, error, events, loading, patchUser, refresh, successMessage, user],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}
