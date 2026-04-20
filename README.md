# CampusConnect

CampusConnect is a production-style React application for discovering campus events and clubs in one place. Students can browse and register for events, save opportunities, and join communities, while organizers can create and manage event listings through a dedicated dashboard.

## Problem Statement

College students often miss campus events, workshops, and club activities because updates are scattered across WhatsApp groups, posters, and social media. CampusConnect solves this by centralizing event discovery, club visibility, and participation workflows for both students and organizers.

## Features

- Authentication flow with student and organizer roles
- Protected routes for personalized dashboards
- Event discovery with search and category filtering
- Event detail pages with save and register actions
- Club directory with join flow
- Student dashboard with saved, registered, and recommended events
- Organizer dashboard with event create, update, and delete operations
- Persistent storage using a backend-ready service layer

## Tech Stack

- React
- React Router
- Context API
- Firebase SDK ready for integration
- LocalStorage persistence for demo mode
- Vite
- CSS with a responsive custom design system

## Demo Accounts

- Student: `student@campusconnect.dev` / `demo123`
- Organizer: `organizer@campusconnect.dev` / `demo123`

## Folder Structure

```text
src/
  components/
  context/
  hooks/
  pages/
  services/
```

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

## Firebase Upgrade Path

The app currently runs in demo mode with persistent LocalStorage data so it works immediately after install. A Firebase config loader is already included in `src/services/firebase.js`.

To connect a real backend, add a `.env` file with:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Then replace the LocalStorage-based functions in `src/services/platformService.js` with Firestore/Auth calls.

## Suggested Submission Notes

- Explain the two-role architecture in your demo
- Highlight Context API, routing, memoized filtering, lazy loading, and protected routes in viva
- Mention that the service layer was designed so demo persistence can be swapped to Firebase cleanly
