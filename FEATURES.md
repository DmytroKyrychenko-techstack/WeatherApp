# Feature Checklist

Comprehensive checklist of all features to be implemented. Organized by category.

---

## Frontend — Pages

### Home Page (`/`)

- [x] City search input with debounced autocomplete (300 ms)
- [x] Autocomplete dropdown showing matching cities from WeatherAPI `/search.json`
- [x] Display current weather card (temperature, condition, icon, city name, region)
- [x] Display 3-day forecast grid (date, high/low temp, condition icon, description)
- [x] "View Details" navigation link to `/weather/[city]`
- [x] Browser geolocation detection on initial page load
- [x] Auto-fetch weather for detected coordinates if geolocation granted
- [x] Graceful fallback if geolocation denied or unavailable

### Weather Details Page (`/weather/[city]`)

- [x] Wind speed display (km/h)
- [x] Humidity display (%)
- [x] UV index display with severity label
- [x] Feels-like temperature display
- [x] Visibility display (km)
- [x] Atmospheric pressure display (mb)
- [x] Sunrise/sunset in city's local timezone
- [x] Sunrise/sunset converted to user's browser timezone
- [x] Weather-based recommendation badges
- [x] Add/remove favorite toggle button (heart icon)
- [x] 3-day forecast section (detailed)

### Favorites Page (`/favorites`)

- [x] Grid/list of favorite city cards
- [x] Each card shows city name + current weather summary (temp, condition, icon)
- [x] Click-through navigation to `/weather/[city]` for each card
- [x] Remove from favorites button on each card
- [x] Empty state message + CTA when no favorites saved

---

## Frontend — UI/UX

- [x] Responsive design: mobile (320px+), tablet, desktop (2560px)
- [x] Loading skeleton components matching content shape on all pages
- [x] Error boundary components (`error.tsx` + `global-error.tsx` at app root)
- [x] Toast notifications for action success/failure (sonner)
- [x] Keyboard-accessible interactive elements
- [x] Semantic HTML with ARIA labels where needed
- [x] SEO metadata via `generateMetadata` on each page

---

## Frontend — State Management

- [x] Explore necessity for separate state management library except TanStack Query
- [ ] Explain solution in readme

---

## Frontend — Custom Hooks

- [x] `use-geolocation.ts` — browser Geolocation API wrapper
- [x] `use-weather.ts` — TanStack Query wrappers (cache config in `providers.tsx`)
- [x] `use-debounce.ts` — debounce utility (300 ms)
- [x] `use-favorites.ts` — CRUD operations
- [x] `use-search-history.ts` — search history with optimistic updates

---

## Backend — API Routes

### Weather

- [x] `GET /api/weather/forecast?q={city}&days=3` — current weather + forecast + astronomy
- [x] Zod input validation on query params
- [x] Server-side SWR cache integration (10-min TTL)
- [x] Error handling with appropriate HTTP status codes

### Search

- [x] `GET /api/search?q={term}` — city autocomplete
- [x] Zod input validation

### Favorites

- [x] `GET /api/favorites?userId={id}` — list user's favorites
- [x] `POST /api/favorites` — add favorite `{userId, cityName}`
- [x] `DELETE /api/favorites` — remove favorite `{userId, cityName}`
- [x] Zod input validation on all methods
- [x] Upsert logic to prevent duplicate favorites (unique constraint + P2002 catch → 409)

### Search History

- [x] `GET /api/history` — get search history (max 5, newest first)
- [x] `POST /api/history` — record a search `{searchTerm}` (auth via JWT cookie)
- [x] Zod input validation

---

## Backend — Database (PostgreSQL + Prisma)

- [x] `favorite_cities` table with `id`, `city_name`, `user_id`, `created_at`
- [x] Unique constraint on `(user_id, city_name)`
- [x] Index on `user_id`
- [x] `search_history` table with `id`, `search_term`, `user_id`, `timestamp`
- [x] Index on `user_id` (timestamp index omitted — max 5 rows per user)
- [x] Prisma migration files generated and committed
- [x] Prisma client singleton (`src/lib/db.ts`)

---

## Business Logic

### Weather Recommendations (`src/lib/recommendations.ts`)

- [x] Rain/drizzle/snow → "Take an umbrella"
- [x] Extreme heat (> 35 °C) → "Stay hydrated and seek shade"
- [x] Cold (< 10 °C) → "Wear a warm jacket"
- [x] Sunny/hot (> 25 °C) → "Wear sunglasses and sunscreen"
- [x] High UV (> 6) → "Wear sun protection"
- [x] Strong wind (> 40 km/h) → "It's quite windy"
- [x] Fog/mist → "Low visibility, drive carefully"
- [x] Mild fallback (10–25 °C) → "Great weather for outdoor activities"
- [x] Multiple simultaneous recommendations supported

### Timezone Conversion (`src/lib/timezone.ts`)

- [x] Parse WeatherAPI sunrise/sunset strings
- [x] Display in city's local timezone
- [x] Convert and display in user's browser timezone
- [x] Format: "6:45 AM BST (11:45 AM your time)"

### Caching (`src/lib/cache.ts`)

- [x] In-memory `Map` with 10-minute TTL per key
- [x] Stale-while-revalidate pattern (return stale, refresh in background)
- [x] `isRefreshing` deduplication flag
- [x] ~~Cache key format: `weather:forecast:{normalizedCity}`~~ → uses Vercel/Next.js built-in caching
- [x] Client-side TanStack Query cache (staleTime: 10 min, gcTime: 30 min)

---

## Multi-User Support

- [x] ~~Generate UUIDv4 on first visit~~ → JWT-based auth with user accounts
- [x] Include user ID in all API requests (via JWT cookie, `getAuthUser`)
- [x] Favorites and history scoped to user ID

---

## External API Integration

### WeatherAPI.com (`src/lib/weather-api.ts`)

- [x] `getForecast(query, days)` — current + forecast + astronomy
- [x] `searchCities(query)` — autocomplete
- [x] API key kept server-side only (never exposed to client)
- [x] Error handling for API failures

### Browser Geolocation API

- [x] Request permission on Home page load
- [x] Extract lat/lon coordinates
- [x] Pass coordinates to weather API as query

---

## Testing

### Unit Tests (Vitest)

- [ ] `recommendations.ts` — all condition rules + edge cases
- [ ] `timezone.ts` — parsing, conversion, formatting
- [ ] `cache.ts` — fresh hit, stale hit, miss, deduplication

### Component Tests (React Testing Library)

- [ ] `SearchBar` — input, debounce, autocomplete, navigation
- [ ] `ForecastCard` — renders props, handles missing data
- [ ] `FavoriteButton` — toggle state, API calls, toast

### API Route Tests

- [ ] `/api/favorites` — CRUD operations
- [ ] `/api/history` — record and retrieve

---

## CI/CD Pipeline

- [x] `.github/workflows/ci-cd.yml` created
- [x] **On push to master + PRs:** lint, typecheck (`tsc --noEmit`), test
- [x] **On push to master:** deploy production to Vercel
- [x] GitHub secrets configured: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

---

## Documentation

- [ ] `README.md` — setup instructions, state management rationale, caching explanation
- [x] `CLAUDE.md` — AI assistant project context and instructions
- [x] `PRD.md` — full product requirements document
- [x] `.env.example` — environment variable template

---

## DevOps / Infrastructure

- [x] `docker-compose.yml` — PostgreSQL 18 container
- [x] `.gitignore` — comprehensive exclusions
- [ ] Clean git commit history with meaningful messages
