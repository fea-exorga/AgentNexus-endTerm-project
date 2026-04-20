import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContext'
import * as platformService from '../services/platformService'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    let active = true

    platformService.restoreSession().then((nextUser) => {
      if (!active) {
        return
      }

      setUser(nextUser)
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      authError,
      clearAuthError: () => setAuthError(''),
      login: async (credentials) => {
        try {
          setAuthError('')
          const nextUser = await platformService.login(credentials)
          setUser(nextUser)
          return nextUser
        } catch (error) {
          setAuthError(error.message)
          throw error
        }
      },
      signup: async (payload) => {
        try {
          setAuthError('')
          const nextUser = await platformService.signup(payload)
          setUser(nextUser)
          return nextUser
        } catch (error) {
          setAuthError(error.message)
          throw error
        }
      },
      logout: async () => {
        await platformService.logout()
        setUser(null)
      },
      patchUser: (nextUser) => setUser(nextUser),
    }),
    [authError, loading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
