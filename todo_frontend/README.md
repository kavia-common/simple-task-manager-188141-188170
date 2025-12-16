# Simple Todo Frontend (React)

A modern, lightweight React todo app with add, edit (inline or modal), delete, complete toggle, filters, and localStorage persistence. Optionally reads REACT_APP_API_BASE to sync with a backend if provided.

## Features

- Add tasks
- Edit tasks inline or via modal
- Delete tasks
- Toggle complete
- Filter by All / Active / Completed
- Persist to localStorage by default
- Optional API integration via `REACT_APP_API_BASE` (graceful fallback to local)
- Accessible (labels, keyboard support)
- Responsive layout and light/dark theme toggle

## Getting Started

Install dependencies and start the dev server:

- npm install
- npm start

The app runs at http://localhost:3000

## Environment Variables

The app will operate fully without any backend. If you have an API, define:

- REACT_APP_API_BASE: Base URL for the tasks API (optional)

Other variables present in the template are respected by CRA but not required for this app:
REACT_APP_BACKEND_URL, REACT_APP_FRONTEND_URL, REACT_APP_WS_URL, REACT_APP_NODE_ENV, REACT_APP_NEXT_TELEMETRY_DISABLED, REACT_APP_ENABLE_SOURCE_MAPS, REACT_APP_PORT, REACT_APP_TRUST_PROXY, REACT_APP_LOG_LEVEL, REACT_APP_HEALTHCHECK_PATH, REACT_APP_FEATURE_FLAGS, REACT_APP_EXPERIMENTS_ENABLED

Create a .env.local (optional) for local overrides, e.g.:
REACT_APP_API_BASE=http://localhost:8080

## API Contract (Optional)

If REACT_APP_API_BASE is set, the app will try to call:
- GET /tasks -> returns an array of tasks [{ id, text, completed }]
- POST /tasks -> create a task with body of the new task
- PATCH /tasks/:id/toggle -> toggle complete
- PATCH /tasks/:id -> update fields, e.g. { text }
- DELETE /tasks/:id -> delete a task

Failures are ignored and local state remains the source of truth.

## Scripts

- npm start: Start dev server
- npm test: Run tests
- npm run build: Production build

## Notes

- All configuration should be added via environment variables. Do not hardcode secrets.
- This app is self-contained and does not require changes to the preview system.
