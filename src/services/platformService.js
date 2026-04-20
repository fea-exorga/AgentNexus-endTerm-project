import { clearSession, getDb, getSession, saveDb, saveSession } from './storage'

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

const sanitizeUser = (user) => {
  const nextUser = { ...user }
  delete nextUser.password
  return nextUser
}

function findClub(db, clubId) {
  return db.clubs.find((club) => club.id === clubId)
}

function enrichEvents(db, user) {
  return db.events.map((event) => {
    const club = findClub(db, event.clubId)
    const isSaved = Boolean(user?.savedEventIds?.includes(event.id))
    const isRegistered = Boolean(user?.registeredEventIds?.includes(event.id))

    return {
      ...event,
      clubName: club?.name ?? 'Unknown club',
      isSaved,
      isRegistered,
      seatsLeft: Math.max(event.capacity - event.registeredCount, 0),
    }
  })
}

function enrichClubs(db, user) {
  return db.clubs.map((club) => ({
    ...club,
    isJoined: Boolean(user?.joinedClubIds?.includes(club.id)),
    upcomingEvents: db.events.filter((event) => event.clubId === club.id).length,
  }))
}

function createId(prefix) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
}

export async function login({ email, password }) {
  await wait()
  const db = getDb()
  const user = db.users.find((entry) => entry.email === email && entry.password === password)

  if (!user) {
    throw new Error('Invalid email or password.')
  }

  saveSession({ userId: user.id })
  return sanitizeUser(user)
}

export async function signup({ name, email, password, role, interests }) {
  await wait()
  const db = getDb()
  const existing = db.users.find((entry) => entry.email === email)

  if (existing) {
    throw new Error('An account with this email already exists.')
  }

  const user = {
    id: createId('user'),
    name,
    email,
    password,
    role,
    interests,
    savedEventIds: [],
    registeredEventIds: [],
    joinedClubIds: [],
    managedClubIds: role === 'organizer' ? ['club-1'] : [],
  }

  db.users.push(user)
  saveDb(db)
  saveSession({ userId: user.id })
  return sanitizeUser(user)
}

export async function restoreSession() {
  await wait(100)
  const session = getSession()
  if (!session) {
    return null
  }

  const db = getDb()
  const user = db.users.find((entry) => entry.id === session.userId)
  return user ? sanitizeUser(user) : null
}

export async function logout() {
  await wait(100)
  clearSession()
}

export async function getInitialData(user) {
  await wait(200)
  const db = getDb()

  return {
    events: enrichEvents(db, user),
    clubs: enrichClubs(db, user),
  }
}

function updateUser(db, userId, updater) {
  db.users = db.users.map((user) => (user.id === userId ? updater(user) : user))
  return db.users.find((user) => user.id === userId)
}

export async function toggleSaveEvent(user, eventId) {
  await wait(150)
  const db = getDb()
  const nextUser = updateUser(db, user.id, (entry) => {
    const saved = new Set(entry.savedEventIds)
    if (saved.has(eventId)) {
      saved.delete(eventId)
    } else {
      saved.add(eventId)
    }

    return {
      ...entry,
      savedEventIds: Array.from(saved),
    }
  })

  saveDb(db)
  return sanitizeUser(nextUser)
}

export async function registerForEvent(user, eventId) {
  await wait(150)
  const db = getDb()
  const event = db.events.find((entry) => entry.id === eventId)

  if (!event) {
    throw new Error('Event not found.')
  }

  if (event.registeredCount >= event.capacity) {
    throw new Error('This event is already full.')
  }

  const alreadyRegistered = user.registeredEventIds.includes(eventId)
  const nextUser = updateUser(db, user.id, (entry) => {
    if (entry.registeredEventIds.includes(eventId)) {
      return entry
    }

    return {
      ...entry,
      registeredEventIds: [...entry.registeredEventIds, eventId],
    }
  })

  db.events = db.events.map((entry) =>
    entry.id === eventId && !alreadyRegistered ? { ...entry, registeredCount: entry.registeredCount + 1 } : entry,
  )

  saveDb(db)
  return sanitizeUser(nextUser)
}

export async function toggleJoinClub(user, clubId) {
  await wait(150)
  const db = getDb()
  const nextUser = updateUser(db, user.id, (entry) => {
    const joined = new Set(entry.joinedClubIds)
    if (joined.has(clubId)) {
      joined.delete(clubId)
    } else {
      joined.add(clubId)
    }

    return {
      ...entry,
      joinedClubIds: Array.from(joined),
    }
  })

  saveDb(db)
  return sanitizeUser(nextUser)
}

export async function createEvent(user, eventInput) {
  await wait(200)
  const db = getDb()
  const event = {
    ...eventInput,
    id: createId('event'),
    organizerId: user.id,
    registeredCount: 0,
    featured: false,
    tags: eventInput.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
  }

  db.events.unshift(event)
  saveDb(db)
  return event
}

export async function updateEvent(eventId, eventInput) {
  await wait(200)
  const db = getDb()
  db.events = db.events.map((event) =>
    event.id === eventId
      ? {
          ...event,
          ...eventInput,
          tags: eventInput.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
        }
      : event,
  )

  saveDb(db)
}

export async function deleteEvent(eventId) {
  await wait(150)
  const db = getDb()
  db.events = db.events.filter((event) => event.id !== eventId)
  db.users = db.users.map((user) => ({
    ...user,
    savedEventIds: user.savedEventIds.filter((id) => id !== eventId),
    registeredEventIds: user.registeredEventIds.filter((id) => id !== eventId),
  }))
  saveDb(db)
}
