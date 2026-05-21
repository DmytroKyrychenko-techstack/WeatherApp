# Weather App

A full-stack weather application built with Next.js 16, TypeScript, and PostgreSQL. Search for weather by city and save search history, view detailed forecasts with contextual insights, manage favorite cities, and auto-detect your location.

## Tech Stack

| Layer            | Technology                                |
| ---------------- | ----------------------------------------- |
| Framework        | Next.js 16 (App Router)                   |
| Language         | TypeScript 5.9                            |
| Styling          | Tailwind CSS 4 + shadcn/ui                |
| State Management | TanStack Query                            |
| ORM              | Prisma 7                                  |
| Database         | PostgreSQL 18 (Docker local, Neon deploy) |
| Weather API      | WeatherAPI.com                            |
| Testing          | Vitest + React Testing Library            |
| CI/CD            | GitHub Actions + Vercel                   |

## Prerequisites

- **Node.js** 20+ (22+ recommended)
- **pnpm** 10+
- **Docker Desktop** (for PostgreSQL)
- **WeatherAPI.com API key** 

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd weather-app
pnpm install
```

### 2. Start the database

```bash
docker compose up -d
```

This starts PostgreSQL 18 on port 5432 with credentials `weatherapp/weatherapp`.

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in the values:

```env
DATABASE_URL="postgresql://weatherapp:weatherapp@127.0.0.1:5433/weatherapp"
WEATHER_API_KEY="your_actual_key_here"
JWT_SECRET="any_random_string_for_signing_tokens"
```

### 4. Run database migrations

```bash
pnpm db:migrate
```

### 5. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `pnpm dev`           | Start development server           |
| `pnpm build`         | Production build                   |
| `pnpm start`         | Start production server            |
| `pnpm lint`          | Run ESLint                         |
| `pnpm test`          | Run tests                          |
| `pnpm db:migrate`    | Run Prisma migrations              |
| `pnpm db:generate`   | Regenerate Prisma client           |

## State Management: Why TanStack Query Alone?

TanStack Query (React Query) is not just a data-fetching library — it is a full **server state manager**. It owns the entire lifecycle of remote data: fetching, caching, background refresh, deduplication, optimistic updates, error/retry handling, and garbage collection. This covers the vast majority of state in the app (weather data, favorites, search history, auth).

A dedicated client state library like Zustand, MobX, or Redux would be overkill here because:

1. **No shared client-only state.** The app has no complex UI state that needs to be shared across distant components. The small pieces of local state that do exist (search input value, dropdown open/closed, highlight index) live naturally in component-level `useState`.
2. **TanStack Query already handles the hard parts.** Cache invalidation, optimistic updates on favorites, background refetching, and stale-while-revalidate are all built in. Duplicating any of this in a separate store would mean managing two sources of truth for the same data.
3. **Less code, no need to sync, no dupe** Adding a state library means writing stores, actions, selectors, and synchronization logic between the store and the query cache. Skipping it removes an entire category of boilerplate and potential synchronization issues.

**In short:** TanStack Query for server state + React `useState` for local UI state covers 100% of this app's needs.

## Caching Implementation

The app implements a **dual-layer** caching strategy:

### Server-side (Next.js `fetch` cache)

- Uses Next.js built-in `fetch` caching via the `next: { revalidate }` option
- Weather forecast data revalidates every **10 minutes** (`CACHE_TTL_S = 600`)
- City search results revalidate every **1 hour**
- On Vercel, this is backed by the Edge Cache — no custom in-memory cache needed

### Client-side (TanStack Query)

- `staleTime: 300_000` (5 min) — won't refetch if data is fresh
- `gcTime: 1_800_000` (30 min) — keeps data in memory for fast re-navigation
- `refetchOnWindowFocus: false` — no unnecessary refetches on tab switch

This means: the client avoids network requests for recently-fetched cities, and the server avoids external API calls for recently-cached cities. Background revalidation keeps data current without blocking the UI.

## Deployment

The app deploys to **Vercel**. The production database is hosted on **Neon** (serverless PostgreSQL).

Required GitHub secrets:

| Secret               | Description                        |
| -------------------- | ---------------------------------- |
| `VERCEL_TOKEN`       | Vercel API token                   |
| `VERCEL_ORG_ID`      | Vercel organization ID             |
| `VERCEL_PROJECT_ID`  | Vercel project ID                  |
| `DATABASE_URL`       | Neon PostgreSQL connection string   |

## CI/CD

GitHub Actions workflow (`.github/workflows/ci-cd.yml`):

- **On push to master + PRs**: lint, typecheck (`tsc --noEmit`), tests
- **On push to master only**: run Prisma migrations against production DB, then build and deploy to Vercel

## License

Private project.
