# Ibraheem's Vial Query Management Application

This is a clinical query management system built for Vial's take-home assignment. It lets users view patient form responses, create queries when clarification is needed, and manage them through to resolution.

The app is built with a Fastify/Prisma/PostgreSQL backend and a React/Next.js/Mantine frontend. Both are deployed and running live.

## Live Demo

- **Frontend**: [https://vial-take-home.vercel.app/](https://vial-take-home.vercel.app/)
- **Backend API**: [https://vial-take-home-l97p.onrender.com/form-data](https://vial-take-home-l97p.onrender.com/form-data)
- **API Documentation**: [https://vial-take-home-l97p.onrender.com/docs](https://vial-take-home-l97p.onrender.com/docs)

## What's Included

### Core Features
- View patient form responses in a clean table layout
- Create queries for specific responses when clarification is needed
- Edit query descriptions and update status (Open/Resolved)
- Filter view by query status (All/Open/Resolved)

### Bonus Features
- **Full deployment** with live database
- **API documentation** via Swagger UI at `/docs`
- **Delete functionality** for queries
- **Responsive design** that works on mobile and desktop
- **Light/dark mode** theme switching
- **Comprehensive tests** via Jest
- **Real-time updates** when creating/editing queries


### Technical Details
- **Backend**: Fastify, Prisma ORM, PostgreSQL, TypeScript
- **Frontend**: React, Next.js, Mantine UI, TypeScript
- **Deployment**: Render (API + Database), Vercel (Frontend)
- **Testing**: Jest for unit and integration tests

## Implementation Decisions

### Bonus Features

- **Real-Time UI Updates**: Instead of globally re-fetching query data after each update, the frontend uses local optimistic state updates to reflect changes instantly. This improves perceived performance and responsiveness.
- **Light/Dark Theme Toggle**: Leveraged Mantine’s built-in color scheme provider to add dark mode with minimal overhead. All components are fully theme-aware.
- **Responsive Query Expansion**: Only one response’s queries can be expanded at a time. This keeps the UI focused and avoids clutter, especially on smaller screens.
- **Delete Functionality**: Implemented a `DELETE /query/:id` endpoint and UI control to fully manage query lifecycles, even though it was marked as optional in the original spec.

### Deployment

- **Split Monorepo**: Separated `/frontend` and `/backend` directories to streamline deployment to Vercel and Render respectively. Each part has isolated environment configs and build scripts.
- **Render for Backend + DB**: Deployed the Fastify app and Postgres DB to Render. Used environment variables to inject dynamic database URLs and ports during runtime.
- **Vercel for Frontend**: Deployed the Next.js app via Vercel, optimized for static assets and SSR performance.
- **Keepalive Cron Job**: Set up an external cron job (via cron-job.org) to ping the backend every 15 minutes. This prevents cold starts due to Render’s free-tier idling.


## Local Development Setup

### Prerequisites
- Node.js 18+
- Docker and Docker Compose

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/Digital-Ibraheem/vial-take-home
cd vial-take-home
```

2. **Set up environment files**

Create `backend/.env`:
```bash
DATABASE_URL=postgresql://vial_query_db_user:X68NU1oaCeKaquPKR9WPD1ScBBWNpqzj@dpg-d13lgou3jp1c73d74jfg-a/vial_query_db
PORT=8080
```

Create `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

3. **Start the application**
```bash
# Build and start containers
docker-compose build
docker-compose up

# In a new terminal, run migrations and seed data
npm run migrate
npm run seed
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:8080`.

### API Documentation
Once running locally, you can view the Swagger documentation at `http://localhost:8080/docs`.

### Running Tests
```bash
npm run tests:docker
```

### Development Commands
```bash
# Backend development
cd backend
docker-compose up

# Frontend development  
cd frontend
npm run dev

# Run Prisma Studio (database viewer)
cd backend
npx prisma studio
```

## Project Structure

```
vial-take-home/
├── backend/           # Fastify API server
│   ├── src/          # TypeScript source
│   ├── prisma/       # Database schema and migrations
│   └── package.json
├── frontend/         # Next.js React app
│   ├── src/          # TypeScript source
│   └── package.json
├── docker-compose.yml
└── README.md
```

## API Endpoints

- `GET /form-data` - Get all form data with associated queries
- `POST /query` - Create a new query
- `PATCH /query/:id` - Update an existing query
- `DELETE /query/:id` - Delete a query

Full API documentation is available at `/docs` when running the server.

## Design Notes

The app uses a clean, clinical interface appropriate for healthcare data management. The main table shows form responses with expandable query sections. Query creation happens via modal dialogs with contextual information.

The responsive design adapts between desktop table views and mobile card layouts. All interactions provide immediate visual feedback, and the app maintains state consistency across operations.

---
