# ShopExpress (split project)

This folder is the split version of `shopexpress_code.js` with a React UI copied from the current project.

## Folders
- `backend/` Node/Express API (port 3000 by default)
- `frontend/` React UI (Vite, port 3000 by default) -- adjust one of the ports if running both

## Backend setup
1) Create a `.env` from `.env.example`:
   - `backend/.env.example`
2) Install deps:
   - `cd backend`
   - `npm install`
3) Start API:
   - `npm run dev`

## Database
This project expects PostgreSQL.
- Schema: `backend/db/schema.sql`
- Seed: `backend/db/seed.sql`

You can load manually or via docker-compose at repo root:
- `docker-compose up`

## Frontend setup
1) Create a `.env` from `.env.example`:
   - `frontend/.env.example`
2) Install deps:
   - `cd frontend`
   - `npm install`
3) Start UI:
   - `npm run start`

## Notes
- The frontend default API base is `http://localhost:3000/api`.
- If you run backend and frontend together, change one port (backend `PORT` or Vite `server.port`).

