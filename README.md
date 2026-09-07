# Chaos Control

A responsive personal Kanban application built with React + TypeScript + Vite.

## Current version

**0.3.2** — Firebase Authentication + Firestore cloud workspace sync.

### Included

- Firebase email/password authentication
- Per-user Firestore workspace
- Realtime cloud synchronization
- One-time migration of existing local data into the user's cloud workspace
- Multiple boards
- Custom columns
- Drag-and-drop cards between columns
- Card detail drawer
- Priority
- Tags
- Due dates
- Subtasks
- Search
- Filters
- Board progress
- Dark/light theme
- Responsive desktop/tablet/phone layout
- Mobile-friendly bottom navigation
- Local JSON import/export backup

## Firebase setup

The web app reads these Vite environment variables:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

Do not commit `.env` files or Admin SDK credentials.

Firebase Authentication must have **Email/Password** enabled.

The repository contains `firestore.rules` and `firebase.json`. Deploy the rules to the Firebase project before relying on cloud persistence:

```bash
firebase deploy --only firestore:rules
```

## Run locally

On a machine with Node.js installed:

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Type checking:

```bash
npm run lint
```

## Cloud data model

Authenticated users get:

```text
users/{uid}
  email
  displayName
  updatedAt

users/{uid}/workspace/data
  data: AppData
  schemaVersion: 1
  updatedAt
```

The client cannot write another user's workspace. Invitation management is intentionally reserved for the later trusted-server/admin phase.
