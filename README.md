# Weather App

A full-stack weather application built with Next.js 16, TypeScript, and PostgreSQL. Search for weather by city, view detailed forecasts with contextual insights, manage favorite cities, and auto-detect your location.

## Tech Stack

| Layer            | Technology                              |
| ---------------- | --------------------------------------- |
| Framework        | Next.js 16 (App Router)                |
| Language         | TypeScript 5.9                          |
| Styling          | Tailwind CSS 4 + shadcn/ui             |
| State Management | Zustand (client) + TanStack Query (server) |
| ORM              | Prisma 7                                |
| Database         | PostgreSQL 18 (Docker)                  |
| Weather API      | WeatherAPI.com                          |
| Testing          | Vitest + React Testing Library          |
| CI/CD            | GitHub Actions + Vercel                 |

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

Edit `.env.local` and add your WeatherAPI.com key:

```env
DATABASE_URL="postgresql://weatherapp:weatherapp@localhost:5432/weatherapp"
WEATHER_API_KEY="your_actual_key_here"
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
| `pnpm test:watch`    | Run tests in watch mode            |
| `pnpm test:coverage` | Run tests with coverage report     |
| `pnpm db:migrate`    | Run Prisma migrations              |
| `pnpm db:studio`     | Open Prisma Studio (DB browser)    |
| `pnpm db:generate`   | Regenerate Prisma client           |

## State Management: Why Zustand?

We chose **Zustand** over alternatives like MobX or Redux for the following reasons:

1. **Bundle size**: Much smaller package size, perfect for small apps, generally makes it faster. Important for a weather app for quick access to info.
2. **Next.js compatibility**: Hook-based API integrates with React Server Components and client boundaries. MobX's observable/proxy model can cause SSR hydration issues.
3. **Simplicity**: A weather app's client state is very small and narrow (favorites, search term, UI state). MobX would have too much boilerplate for this.
4. **Persist middleware**: Built-in `persist` middleware which makes it trivial to cache favorites in localStorage alongside the PostgreSQL backend.
5. **TanStack Query complement**: Zustand handles client UI state while TanStack Query handles server state (weather data fetching, caching, background refetch). They compose well without overlap.

## Caching Implementation

The app implements a **dual-layer stale-while-revalidate** caching strategy:

### Server-side (in-memory)

- Weather data cached for **10 minutes** per city in a Node.js `Map`
- On cache hit (fresh): return immediately
- On cache hit (stale): return stale data immediately, refresh in the background
- Deduplication flag prevents concurrent background fetches for the same key
- Located in `src/lib/cache.ts`

### Client-side (TanStack Query)

- `staleTime: 600_000` (10 min) — won't refetch if data is fresh
- `gcTime: 1_800_000` (30 min) — keeps data in memory for fast re-navigation
- `refetchOnWindowFocus: false` — no unnecessary refetches on tab switch

This means: the client avoids network requests for recently-fetched cities, and the server avoids external API calls for recently-cached cities. Background refresh keeps data current without blocking the UI.

## Architecture

```
src/
  app/                    # Next.js App Router
    page.tsx              # Home: search + current weather + 3-day forecast
    weather/[city]/       # Weather Details: full metrics + recommendations
    favorites/            # Favorites: saved cities grid
    api/                  # API routes (weather, search, favorites, history)
  components/
    ui/                   # shadcn/ui primitives
    layout/               # Header, footer, navigation
    weather/              # Weather display components
    favorites/            # Favorites components
  lib/                    # Core utilities
    db.ts                 # Prisma client singleton
    cache.ts              # SWR cache implementation
    weather-api.ts        # WeatherAPI.com client
    recommendations.ts    # Weather-based recommendations engine
    timezone.ts           # Sunrise/sunset timezone conversion
  hooks/                  # Custom React hooks
  stores/                 # Zustand stores
  types/                  # TypeScript type definitions
```

## Deployment

The app deploys to **Vercel** via **GitHub Actions**:

- **Push to main**: lint + typecheck + test, then deploy to production
- **Pull requests**: lint + typecheck + test, then deploy preview

Required GitHub secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

## License

Private project.
