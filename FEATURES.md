# Feature Checklist

Comprehensive checklist of all features to be implemented. Organized by category.

---

## Frontend — Pages

### Home Page (`/`)

- [ ] City search input with debounced autocomplete (300 ms)
- [ ] Autocomplete dropdown showing matching cities from WeatherAPI `/search.json`
- [ ] Display current weather card (temperature, condition, icon, city name, region)
- [ ] Display 3-day forecast grid (date, high/low temp, condition icon, description)
- [ ] "View Details" navigation link to `/weather/[city]`
- [ ] Browser geolocation detection on initial page load
- [ ] Auto-fetch weather for detected coordinates if geolocation granted
- [ ] Graceful fallback if geolocation denied or unavailable

### Weather Details Page (`/weather/[city]`)

- [ ] Wind speed display (km/h)
- [ ] Humidity display (%)
- [ ] UV index display with severity label
- [ ] Feels-like temperature display
- [ ] Visibility display (km)
- [ ] Atmospheric pressure display (mb)
- [ ] Sunrise/sunset in city's local timezone
- [ ] Sunrise/sunset converted to user's browser timezone
- [ ] Weather-based recommendation badges
- [ ] Add/remove favorite toggle button (heart icon)
- [ ] 3-day forecast section (detailed)

### Favorites Page (`/favorites`)

- [ ] Grid/list of favorite city cards
- [ ] Each card shows city name + current weather summary (temp, condition, icon)
- [ ] Click-through navigation to `/weather/[city]` for each card
- [ ] Remove from favorites button on each card
- [ ] Empty state message + CTA when no favorites saved

---

## Frontend — UI/UX

- [ ] Responsive design: mobile (320px+), tablet, desktop (2560px)
- [ ] Loading skeleton components matching content shape on all pages
- [ ] Error boundary components on each page route
- [ ] Toast notifications for action success/failure (sonner)
- [ ] Keyboard-accessible interactive elements
- [ ] Semantic HTML with ARIA labels where needed
- [ ] SEO metadata via `generateMetadata` on each page

---

## Frontend — State Management (Zustand)

- [ ] `favorites-store.ts` — favorites list with `persist` middleware (localStorage)
- [ ] `weather-store.ts` — current search term, selected city
- [ ] Optimistic UI updates for favorite add/remove
- [ ] Rollback on API failure with error toast

---

## Frontend — Custom Hooks

- [ ] `use-geolocation.ts` — browser Geolocation API wrapper
- [ ] `use-weather.ts` — TanStack Query wrappers (staleTime: 10 min)
- [ ] `use-debounce.ts` — debounce utility (300 ms)
- [ ] `use-favorites.ts` — CRUD operations syncing Zustand + API

---

## Backend — API Routes

### Weather

- [ ] `GET /api/weather/forecast?q={city}&days=3` — current weather + forecast + astronomy
- [ ] Zod input validation on query params
- [ ] Server-side SWR cache integration (10-min TTL)
- [ ] Error handling with appropriate HTTP status codes

### Search

- [ ] `GET /api/search?q={term}` — city autocomplete
- [ ] Zod input validation

### Favorites

- [ ] `GET /api/favorites?userId={id}` — list user's favorites
- [ ] `POST /api/favorites` — add favorite `{userId, cityName}`
- [ ] `DELETE /api/favorites` — remove favorite `{userId, cityName}`
- [ ] Zod input validation on all methods
- [ ] Upsert logic to prevent duplicate favorites

### Search History

- [ ] `GET /api/history?userId={id}&limit={n}` — get search history
- [ ] `POST /api/history` — record a search `{userId, searchTerm}`
- [ ] Zod input validation

---

## Backend — Database (PostgreSQL + Prisma)

- [ ] `favorite_cities` table with `id`, `city_name`, `user_id`, `created_at`
- [ ] Unique constraint on `(user_id, city_name)`
- [ ] Index on `user_id`
- [ ] `search_history` table with `id`, `search_term`, `user_id`, `timestamp`
- [ ] Indexes on `user_id` and `timestamp`
- [ ] Prisma migration files generated and committed
- [ ] Prisma client singleton (`src/lib/db.ts`)

---

## Business Logic

### Weather Recommendations (`src/lib/recommendations.ts`)

- [ ] Rain/drizzle/snow → "Take an umbrella"
- [ ] Extreme heat (> 35 °C) → "Stay hydrated and seek shade"
- [ ] Cold (< 10 °C) → "Wear a warm jacket"
- [ ] Sunny/hot (> 25 °C) → "Wear sunglasses and sunscreen"
- [ ] High UV (> 6) → "Wear sun protection"
- [ ] Strong wind (> 40 km/h) → "It's quite windy"
- [ ] Fog/mist → "Low visibility, drive carefully"
- [ ] Mild fallback (10–25 °C) → "Great weather for outdoor activities"
- [ ] Multiple simultaneous recommendations supported

### Timezone Conversion (`src/lib/timezone.ts`)

- [ ] Parse WeatherAPI sunrise/sunset strings
- [ ] Display in city's local timezone
- [ ] Convert and display in user's browser timezone
- [ ] Format: "6:45 AM BST (11:45 AM your time)"

### Caching (`src/lib/cache.ts`)

- [ ] In-memory `Map` with 10-minute TTL per key
- [ ] Stale-while-revalidate pattern (return stale, refresh in background)
- [ ] `isRefreshing` deduplication flag
- [ ] Cache key format: `weather:forecast:{normalizedCity}`
- [ ] Client-side TanStack Query cache (staleTime: 10 min, gcTime: 30 min)

---

## Multi-User Support

- [ ] Generate UUIDv4 on first visit, persist in localStorage as `weatherapp_user_id`
- [ ] Include user ID in all API requests
- [ ] Favorites and history scoped to user ID

---

## External API Integration

### WeatherAPI.com (`src/lib/weather-api.ts`)

- [ ] `getForecast(query, days)` — current + forecast + astronomy
- [ ] `searchCities(query)` — autocomplete
- [ ] API key kept server-side only (never exposed to client)
- [ ] Error handling for API failures

### Browser Geolocation API

- [ ] Request permission on Home page load
- [ ] Extract lat/lon coordinates
- [ ] Pass coordinates to weather API as query

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

- [ ] `.github/workflows/ci-cd.yml` created
- [ ] **On push to main + PRs:** lint, typecheck (`tsc --noEmit`), test
- [ ] **On PRs:** deploy preview to Vercel
- [ ] **On push to main:** deploy production to Vercel
- [ ] GitHub secrets configured: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

---

## Documentation

- [ ] `README.md` — setup instructions, state management rationale, caching explanation
- [ ] `CLAUDE.md` — AI assistant project context
- [ ] `AGENTS.md` — agent-specific instructions
- [ ] `PRD.md` — full product requirements document
- [ ] `.env.example` — environment variable template

---

## DevOps / Infrastructure

- [ ] `docker-compose.yml` — PostgreSQL 18 container
- [ ] `.gitignore` — comprehensive exclusions
- [ ] Clean git commit history with meaningful messages
