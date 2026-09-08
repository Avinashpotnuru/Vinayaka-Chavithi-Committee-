# Vinayaka Chavithi Committee

A management app for the Vinayaka Chavithi festival committee. Tracks members,
contributions, and expenses, with a live dashboard and reports backed by
MongoDB Atlas.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, server components)
- React 19, TypeScript
- Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com)
- [MongoDB Atlas](https://www.mongodb.com/atlas) (official `mongodb` driver)
- zod (validation), react-hook-form (forms), @tanstack/react-table (tables)

## Features

- **Members** — add, edit, delete, and search members.
- **Contributions** — record contributions per member with payment mode/status.
- **Expenses** — track festival expenses by category.
- **Tasks** — manage assigned tasks and status.
- **Dashboard** — live KPIs (members, contributions, expenses, balance),
  monthly trend chart, contribution breakdown, recent & top contributors.
- **Reports** — financial overview, expense-by-category breakdown, biggest
  expenses.
- Responsive layout, server-side rendered data, dynamic API routes with
  zod validation.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure MongoDB

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb://...
MONGODB_DB=vinayaka-committee
```

`MONGODB_DB` is optional and defaults to `vinayaka-committee`.

> If the driver's SRV lookup fails in your environment, use the Atlas **direct
> connection** string (host list + `ssl=true&replicaSet=<cluster>`), which the
> app supports as-is.

On first use, each collection is automatically seeded with sample data when it
is empty (see the services under `src/lib/services`).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # serve the production build
npm run lint     # run ESLint
```

## Project Structure

```
src/app/            # routes: /, /members, /contributions, /expenses, /tasks, /reports + /api/*
src/components/     # shadcn/ui components + feature views (dashboard, reports, etc.)
src/lib/            # mongodb client, services, zod schemas, and reporting aggregations
src/hooks/          # shared client hooks
```

- Data access lives in `src/lib/services/<module>.ts` (server-only).
- `src/lib/reporting.ts` computes dashboard/report aggregates from live data.
- API routes (`src/app/api/<module>/`) expose CRUD; client views mutate via
  `fetch`.