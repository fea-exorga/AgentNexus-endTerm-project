import { seedData } from './mockData'

const DB_KEY = 'campus-connect-db'
const SESSION_KEY = 'campus-connect-session'

const clone = (value) => JSON.parse(JSON.stringify(value))

function initializeDb() {
  const existing = localStorage.getItem(DB_KEY)
  if (!existing) {
    localStorage.setItem(DB_KEY, JSON.stringify(seedData))
    return clone(seedData)
  }

  return JSON.parse(existing)
}

export function getDb() {
  return initializeDb()
}

export function saveDb(nextDb) {
  localStorage.setItem(DB_KEY, JSON.stringify(nextDb))
  return clone(nextDb)
}

export function getSession() {
  const session = localStorage.getItem(SESSION_KEY)
  return session ? JSON.parse(session) : null
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
