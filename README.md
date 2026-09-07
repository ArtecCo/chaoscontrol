# Chaos Control

A responsive personal Kanban application built with React + TypeScript + Vite.

## Current version

This first version is intentionally dependency-light and uses `localStorage` for persistence, so the application can be developed and tested without a backend.

### Included

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
- Local persistence
- Seeded demo data
- Import/export JSON backup

## Run locally

On a machine with Node.js installed:

```bash
npm install
npm run dev
```

Then open the URL printed by Vite.

Production build:

```bash
npm run build
npm run preview
```

Type checking:

```bash
npm run lint
```

## GitHub workflow

You can push this entire folder to a GitHub repository from VS Code.

Do not commit `node_modules` or `.env` files.

## Next phase

The local data layer is isolated in `src/data/storage.ts`. That is the intended replacement point for Firestore later.

Planned next additions:

1. Firebase Authentication
2. Firestore persistence
3. Cross-device sync
4. Recurring tasks
5. Calendar view
6. Notifications/reminders
7. Projects
8. Activity history
9. PWA/offline improvements

The UI does not need to be rewritten when the storage layer moves to Firestore.
