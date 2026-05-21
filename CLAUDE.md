# Weather App Agent Instructions

## Project Context

This is a full-stack weather application built with Next.js 16, TypeScript, Tailwind CSS 4, and PostgreSQL. The PRD is in `PRD.md`. The feature checklist is in `FEATURES.md`.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5.9
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **State Management:** TanStack Query (server state) + React useState (local UI state)
- **ORM:** Prisma 7 with PostgreSQL 18 (Docker)
- **Weather Data:** WeatherAPI.com
- **Testing:** Vitest + React Testing Library
- **CI/CD:** GitHub Actions → Vercel

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm test         # Run tests
pnpm lint         # ESLint
pnpm db:migrate   # Run Prisma migrations
pnpm db:studio    # Open Prisma Studio
```

## Architecture

- `src/app/` — Next.js App Router pages and API routes
- `src/components/` — React components (ui/, layout/, weather/, favorites/)
- `src/lib/` — Core utilities (db, cache, weather-api, recommendations, timezone)
- `src/hooks/` — Custom React hooks
- `src/types/` — TypeScript type definitions
- `prisma/` — Database schema and migrations

## Key Design Decisions

- **TanStack Query only:** No dedicated client state library — TanStack Query handles all server state; React useState covers local UI state
- **SWR caching:** Next.js `fetch` revalidate for server-side + TanStack Query client-side cache
- **WeatherAPI.com:** Single `/forecast.json` endpoint returns current weather, 3-day forecast, AND astronomy data
- **JWT auth:** User accounts with JWT cookie-based authentication
- **API routes as proxy:** Frontend never calls WeatherAPI directly — keeps API key server-side

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Conventions

- Use TypeScript strict mode throughout
- Import paths use `@/` alias (maps to `src/`)
- Components use `"use client"` directive only when they need browser APIs or React hooks
- API routes validate input with Zod schemas
- Database access goes through `src/lib/db.ts` (Prisma singleton)
- Weather data fetched via `src/lib/weather-api.ts` (never call WeatherAPI directly from components)
- State: TanStack Query for server state, React useState for local UI state

## Tailwind CSS Styling Rules

**NEVER write Tailwind classes inline in JSX.** Instead, define a `styles` constant object at the top of the component file, before the component function, and reference its keys in the JSX.

```tsx
// CORRECT — constant object before component
const styles = {
  root: "flex flex-col gap-4 p-6 rounded-xl bg-card",
  title: "text-2xl font-bold text-foreground",
  temp: "text-5xl font-light tabular-nums",
} as const;

export function CurrentWeather({ data }: Props) {
  return (
    <div className={cn(styles.root, "md:flex-row")}>
      <h2 className={styles.title}>{data.name}</h2>
      <span className={styles.temp}>{data.temp_c}°</span>
    </div>
  );
}
```

```tsx
// WRONG — inline classes in JSX
export function CurrentWeather({ data }: Props) {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-xl bg-card">
      <h2 className="text-2xl font-bold text-foreground">{data.name}</h2>
    </div>
  );
}
```

**Exceptions:**
- **shadcn/ui components** (`src/components/ui/`): Do NOT refactor these. They are copy-pasted from the shadcn registry and use their own conventions (CVA for variants, inline `cn()` for simple wrappers). Leave them as-is.
- Use `cn()` from `@/lib/utils` to merge the styles object values with conditional or responsive overrides when needed.

## Responsive Design

**All UI must be responsive.** Design mobile-first, then add breakpoints for larger screens.

- Use Tailwind breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- Minimum supported width: **320px** (mobile)
- Maximum supported width: **2560px** (desktop)
- Touch-friendly tap targets (min 44px) on mobile
- Test every component and page at mobile AND desktop widths before considering it done
- Navigation must adapt for mobile (hamburger/bottom nav) vs desktop (horizontal nav)

## Testing

- Unit tests live next to their source files as `*.test.ts(x)`
- Run with `pnpm test`
- Test setup in `src/test/setup.ts`

## Database

- Schema in `prisma/schema.prisma`
- Docker PostgreSQL via `docker compose up -d`
- Migrations via `pnpm db:migrate`

