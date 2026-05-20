# Product Requirements Document (PRD)

## Weather App with Real-Time Data and Business Logic

**Version:** 1.0
**Date:** 2026-05-19
**Status:** Draft

---

## 1. Overview

### 1.1 Purpose

Build a production-ready, full-stack Weather App that enables users to search for weather data by city, view detailed forecasts with contextual insights (outfit recommendations, sunrise/sunset calculations), manage favorite cities, and automatically detect their location for instant weather information.

### 1.2 Tech Stack

| Layer              | Technology                          | Justification                                                              |
| ------------------ | ----------------------------------- | -------------------------------------------------------------------------- |
| Framework          | **Next.js** (App Router)            | Full-stack React framework with SSR, API routes, and file-based routing    |
| Language           | **TypeScript**                      | Type safety across the entire codebase                                     |
| Styling            | **Tailwind CSS** + **shadcn/ui**    | Utility-first CSS with accessible, composable UI primitives                |
| State Management   | **Zustand**                         | Used for favorites with `persist` middleware; search/city selection handled via URL routing |
| Server State       | **TanStack Query**                  | Caching, background refetch, and stale-while-revalidate for API data       |
| ORM                | **Prisma**                          | Type-safe database access, declarative schema, migration file generation   |
| Database           | **PostgreSQL 18** (Docker)          | Robust relational database for favorites and search history                |
| Weather Provider   | **WeatherAPI.com**                  | 1 M free calls/month, single endpoint for current + forecast + astronomy   |
| Testing            | **Vitest** + **React Testing Library** | Fast unit/component testing with native ESM support                     |
| CI/CD              | **GitHub Actions** → **Vercel**     | Automated lint, test, deploy pipeline                                      |
| Package Manager    | **pnpm**                            | Fast, disk-efficient, strict dependency resolution                         |

---

## 2. User Stories

### 2.1 Home Page

| ID    | Story                                                                                              | Acceptance Criteria                                                                                                    |
| ----- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| US-01 | As a user, I want to search for a city so I can see its current weather.                           | Search input with autocomplete. On submit, displays current temperature, condition, icon, and city name.               |
| US-02 | As a user, I want to see a 3-day forecast for the searched city.                                   | Three forecast cards showing date, high/low temp, condition icon, and brief description.                               |
| US-03 | As a user, I want my current location detected automatically so I see local weather without typing. | On page load, browser prompts for geolocation. If granted, weather loads for detected coordinates. Graceful fallback.  |
| US-04 | As a user, I want to navigate to a detailed weather view for any city.                             | Clicking a city/forecast navigates to `/weather/[city]` details page.                                                 |

### 2.2 Weather Details Page

| ID    | Story                                                                                              | Acceptance Criteria                                                                                                    |
| ----- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| US-05 | As a user, I want to see detailed weather metrics for a city.                                      | Displays: wind speed, humidity, UV index, feels-like temp, visibility, pressure, and condition.                        |
| US-06 | As a user, I want to see sunrise and sunset times in my local timezone.                            | Shows sunrise/sunset in both the city's local time and the user's browser timezone.                                    |
| US-07 | As a user, I want personalized recommendations based on the weather.                               | Displays contextual badges/cards (e.g., "Wear a warm jacket" when cold, "Take an umbrella" when raining).             |
| US-08 | As a user, I want to add/remove a city from my favorites directly from the details page.           | Heart/star toggle button. Optimistic UI update. Persists to PostgreSQL.                                                |

### 2.3 Favorites Page

| ID    | Story                                                                                              | Acceptance Criteria                                                                                                    |
| ----- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| US-09 | As a user, I want to see all my favorited cities in one place.                                     | Grid/list of favorite city cards, each showing city name and current weather summary.                                  |
| US-10 | As a user, I want to quickly navigate to any favorite city's details.                              | Each favorite card links to `/weather/[city]`.                                                                         |
| US-11 | As a user, I want to remove cities from my favorites list.                                         | Remove button on each card. Removes from PostgreSQL and updates UI immediately.                                        |

### 2.4 Cross-Cutting

| ID    | Story                                                                                              | Acceptance Criteria                                                                                                    |
| ----- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| US-12 | As a user, I want loading indicators while data is being fetched.                                  | Skeleton loaders matching content shape on all pages during API calls.                                                 |
| US-13 | As a user, I want graceful error messages when something goes wrong.                               | Error boundaries on each page. Toast notifications for action failures. Retry options.                                 |
| US-14 | As a user, I want the app to work well on both desktop and mobile.                                 | Responsive layout using Tailwind breakpoints. Touch-friendly interactive elements.                                     |
| US-15 | As a user, I want my search history recorded so I can see past searches.                           | Every search is stored in PostgreSQL. Accessible via API.                                                              |
| US-16 | As a user, I want fast responses even for repeated city searches.                                  | 10-minute server-side cache with stale-while-revalidate. Client-side TanStack Query cache.                             |

---

## 3. Functional Requirements

### 3.1 Frontend Pages

#### 3.1.1 Home Page (`/`)

- **Search bar** with debounced autocomplete (300 ms delay, powered by WeatherAPI `/search.json`)
- **Geolocation detection** on initial load using `navigator.geolocation`
  - If permission granted: auto-fetch weather for detected lat/lon
  - If denied/unavailable: show search prompt with no error
- **Current weather card**: temperature, condition text, icon, city name, region
- **3-day forecast grid**: date, high/low temperatures, condition icon, description
- **"View Details" link** for the currently displayed city

#### 3.1.2 Weather Details Page (`/weather/[city]`)

- **Weather metrics grid**:
  - Wind speed (km/h)
  - Humidity (%)
  - UV index (with severity label)
  - Feels-like temperature
  - Visibility (km)
  - Atmospheric pressure (mb)
- **Sunrise/Sunset display**: city local time + user's local time equivalent
- **Recommendations section**: contextual badges based on current conditions
- **Favorite toggle button**: add/remove with optimistic UI
- **3-day forecast** (same as Home but with more detail)

#### 3.1.3 Favorites Page (`/favorites`)

- **Favorites grid**: cards for each saved city showing name + current weather summary
- **Empty state**: message + CTA to search when no favorites saved
- **Remove action**: per-card button to unfavorite
- **Click-through**: each card navigates to `/weather/[city]`

### 3.2 Backend API Routes

| Method   | Endpoint                              | Request                         | Response                                     |
| -------- | ------------------------------------- | ------------------------------- | -------------------------------------------- |
| `GET`    | `/api/weather/forecast?q={city}&days=3` | Query: `q` (required), `days`  | Current weather + forecast + astronomy data  |
| `GET`    | `/api/search?q={term}`                | Query: `q` (required)           | Array of matching cities (name, region, country) |
| `GET`    | `/api/favorites?userId={id}`          | Query: `userId` (required)      | Array of favorite city records               |
| `POST`   | `/api/favorites`                      | Body: `{userId, cityName}`      | Created favorite record                      |
| `DELETE` | `/api/favorites`                      | Body: `{userId, cityName}`      | Deletion confirmation                        |
| `GET`    | `/api/history?userId={id}&limit={n}`  | Query: `userId`, `limit` (opt)  | Array of search history records              |
| `POST`   | `/api/history`                        | Body: `{userId, searchTerm}`    | Created history record                       |

All routes validate input using **Zod** schemas and return appropriate HTTP status codes.

### 3.3 Database Schema

#### `favorite_cities`

| Column       | Type           | Constraints                          |
| ------------ | -------------- | ------------------------------------ |
| `id`         | `TEXT` (CUID)  | Primary Key                          |
| `city_name`  | `TEXT`         | Not null                             |
| `user_id`    | `TEXT`         | Not null, indexed                    |
| `created_at` | `TIMESTAMP`    | Default: `now()`                     |

**Unique constraint:** `(user_id, city_name)` -- prevents duplicate favorites.

#### `search_history`

| Column        | Type           | Constraints                          |
| ------------- | -------------- | ------------------------------------ |
| `id`          | `TEXT` (CUID)  | Primary Key                          |
| `search_term` | `TEXT`         | Not null                             |
| `user_id`     | `TEXT`         | Not null, indexed                    |
| `timestamp`   | `TIMESTAMP`    | Default: `now()`, indexed            |

### 3.4 Business Logic

#### Weather-Based Recommendations

| Priority | Condition                          | Threshold          | Recommendation                              |
| -------- | ---------------------------------- | ------------------ | ------------------------------------------- |
| 1        | Rain / Drizzle / Snow              | Condition text     | "Take an umbrella -- rain is expected."     |
| 2        | Extreme heat                       | temp_c > 35        | "Stay hydrated and seek shade."             |
| 3        | Cold                               | temp_c < 10        | "Wear a warm jacket -- it's cold outside."  |
| 4        | Sunny / Hot                        | temp_c > 25        | "Wear sunglasses and apply sunscreen."      |
| 5        | High UV                            | uv > 6             | "UV index is high -- wear sun protection."  |
| 6        | Windy                              | wind_kph > 40      | "It's quite windy -- secure loose items."   |
| 7        | Fog / Mist                         | Condition text     | "Visibility is low -- drive carefully."     |
| 8        | Mild (fallback)                    | 10 <= temp <= 25   | "Great weather for outdoor activities!"     |

Multiple recommendations can apply simultaneously.

#### Sunrise/Sunset Timezone Conversion

- WeatherAPI returns sunrise/sunset in the **location's local time**
- Display in the location's timezone **and** convert to the user's browser timezone
- Format: `"Sunrise: 6:45 AM BST (11:45 AM your time)"`

#### Caching Strategy

- **Server-side**: In-memory Map with 10-minute TTL per cache key
  - Pattern: **stale-while-revalidate** -- return stale data immediately, refresh in background
  - Deduplication: `isRefreshing` flag prevents concurrent background fetches for same key
  - Cache key format: `weather:forecast:{normalizedCity}`
- **Client-side**: TanStack Query with `staleTime: QUERY_STALE_MS` (10 min) and `gcTime: QUERY_GC_TIME_MS` (30 min), configured globally in `providers.tsx`

### 3.5 Multi-User Support

- **No authentication system** required
- Generate a **UUIDv4** client-side on first visit, persist in `localStorage` as `weatherapp_user_id`
- Include user ID in all API requests (header or query parameter)
- Each browser/device acts as a separate "user"

---

## 4. Non-Functional Requirements

| Requirement       | Target                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------- |
| **Performance**   | First Contentful Paint < 1.5 s. Weather data served from cache in < 50 ms.              |
| **Responsiveness**| Fully usable on screens from 320 px (mobile) to 2560 px (desktop).                      |
| **Accessibility** | Semantic HTML, ARIA labels on interactive elements, keyboard navigable.                  |
| **Error Handling**| All API failures show user-friendly messages. No unhandled promise rejections.            |
| **Security**      | API key server-side only (never exposed to client). Input validation on all routes.      |
| **Testing**       | Unit tests for business logic. Component tests for key UI elements. API route tests.     |
| **CI/CD**         | GitHub Actions: lint + typecheck + test on every push. Auto-deploy to Vercel on main.    |

---

## 5. External Dependencies

| Dependency       | Purpose                    | Free Tier Limits          |
| ---------------- | -------------------------- | ------------------------- |
| WeatherAPI.com   | Weather data + city search | 1 M calls/month           |
| Browser Geolocation API | User location detection | No limits (browser API) |
| Vercel           | Hosting + deployment       | Hobby plan (free)         |
| Docker (PostgreSQL 18) | Local database        | N/A (local)               |

---

## 6. Deliverables Checklist

- [ ] GitHub repository with clean commit history
- [ ] `README.md` with setup instructions, state management rationale, caching explanation
- [ ] `CLAUDE.md` and `AGENTS.md` for AI assistant context
- [ ] Prisma migration files (SQL scripts) for PostgreSQL schema
- [ ] Deployed app on Vercel with GitHub Actions CD pipeline
- [ ] `FEATURES.md` with comprehensive implementation checklist
