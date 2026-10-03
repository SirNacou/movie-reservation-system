# AGENTS.md

Movie reservation system is a Bun + Turborepo monorepo: `apps/api` (NestJS + MikroORM + oRPC), `apps/web` (SvelteKit + TanStack Query + oRPC), `packages/contract` (shared oRPC contract).

## Setup

- Requires Bun 1.3.14, Node >= 24. Use Bun for all scripts.
- Copy `.env.example` to `.env` and set `TMDB_API_KEY`. API also requires DB/Redis env (see `.env.example`).
- Dependencies: `bun install`. Use `bun run deps:check` / `bun run deps:fix` for workspace deps (syncpack).
- Infrastructure (Postgres + Redis): `task infra:up` / `task infra:down`. Docker is only for Postgres/Redis in the recommended dev flow.

## Commands (repo-specific)

Root (Turborepo via `bun --env-file=.env run turbo ...`):

- `bun run dev` — runs all apps in dev (turbo). Persistent, not cached. For local dev with infra + migrations, prefer `task dev`.
- `bun run build` — `turbo run build` (depends on `^build`). Builds contract first via API prebuild in practice.
- `bun run check-types` — `turbo run check-types` (depends on `^check-types`).
- `bun run lint` / `lint:fix` — Biome lint on repo (configured via `biome.json`).
- `bun run format` / `format:check` / `check` — Biome format/check (writes on `check`/`format`).
- `bun run check` at root is also aliased as `task check`.

Taskfile (recommended local dev):

- `task dev` — `infra:up` + runs migrations on host (`task migration:up`) + `bun --env-file=.env run dev` (turbo). Apps: Web http://localhost:3000, API http://localhost:4000 (global prefix `api`), Node debugger 9229.
- `task infra:up/down` — start/stop Postgres + Redis only (`docker compose up -d --wait postgres redis`).
- Migrations (run on host from `apps/api`, Bun with `../../.env`): `task migration:create CLI_ARGS="..."`, `migration:initial`, `migration:blank CLI_ARGS="..."`, `migration:up`, `migration:down`, `migration:pending`, `migration:fresh`.
- Docker full workflow: `task up`, `task watch` (compose watch), `task down/clean`, `task logs` (API), `task sh` (shell in API container). `task contract:build` builds contract package.

API (`apps/api`):

- Build: `bun run build` (runs `prebuild` which builds contract at `../../packages/contract`). Outputs to `dist/`. MikroORM entities configured for `dist/**/*.entity.js` and `src/**/*.entity.ts`.
- Dev: `bun run dev` / `start:dev` / `start:debug` (Nest with watch/debug). Contract rebuilt in `predev`/`prestart:dev`.
- Lint: `bun run lint` uses oxlint (`--type-aware`) on `src/ test/` (Biome also lints repo; API has oxlint script).
- Tests: `bun run test` (Vitest, unit, `*.spec.ts`, globals true). `test:watch`, `test:cov`, `test:debug` (no file parallelism). E2E: `bun run test:e2e` with `vitest.config.e2e.ts` (`*.e2e-spec.ts`). DB services may be required for integration/e2e tests depending on test setup.
- Migrations: scripts also available directly in API dir (use `--env-file=../../.env` as Taskfile does). MikroORM migration config lives in `src/mikro-orm.config.ts` (uses `createMikroOrmOptions`), migrations in `src/common/infrastructure/database/migrations/`, snapshot at `.snapshot-movie_reservation.json`.

Web (`apps/web`):

- `bun run dev` (Vite via SvelteKit), `build`, `preview`. `prepare` runs `svelte-kit sync`. `check:watch` runs type checks. Lint via oxlint.

Contract (`packages/contract`):

- `bun run build` (tsc) → `dist/index.{js,d.ts}` (exports defined). `dev` watches with `preserveWatchOutput`. API depends on it and rebuilds it in prebuild steps; changes require rebuild for API to see them.

## Architecture / boundaries (high-signal)

- Monorepo uses workspaces `apps/*`, `packages/*`. Shared types/contracts live in `@repo/contract` (oRPC contract). Apps import from workspace `@repo/contract`.
- API: NestJS on Fastify (`app.listen(4000, '0.0.0.0')`), global prefix `api`, shutdown hooks enabled, body parsing disabled. oRPC/Nest integration; MikroORM (Postgres) with migrations and entities discovered from `src/**/*.entity.ts` (built to `dist/**/*.entity.js`).
- Database: MikroORM configured via `src/common/infrastructure/config/mikro-orm.options.ts` (migrations table `mikro_orm_migrations`, transactional, allOrNothing, emit ts). Migrations are TypeScript files in API migrations dir; snapshot tracked. Run migrations on host (not in container) per README/Taskfile.
- Contract is built first (API prebuild/predev ensure contract is up to date). If you change contract, rebuild it before typechecking API or running dev.
- Turbo: `build`/`check-types` depend on `^build`/`^check-types`; `dev` is persistent and uncached. Env files passed via `--env-file=.env`.

## Tooling / conventions (repo-specific)

- Lint/format: Biome 2.5.14 is the source of truth at root (tabs, width 100, single quotes, semicolons asNeeded, trailing commas es5). Includes `apps/**/src/**/*` and `packages/**/src/**/*`, ignores `**/*.gen.ts`. API override tweaks quote style/trailing commas and relaxes some style rules; Svelte/Vue/Astro files get relaxed correctness rules. API also has oxlint script (separate).
- TypeScript 6.0.2 across packages. Decorator parameter decorators enabled in Biome JS parser (API uses decorators).
- Testing: Vitest with tsconfig paths plugin. Unit tests `*.spec.ts`, E2E `*.e2e-spec.ts`. Use `--no-file-parallelism` for `test:debug`.
- Env: API loads env via config/validation (see `src/common/infrastructure/config/env.config.ts`); migrations and scripts use `--env-file` pointing to root `.env`.
- Docker: only Postgres/Redis by default in dev; full stack available if needed.

## Practical tips to avoid mistakes

- When running migrations or any API script that needs DB, use Taskfile (which passes `--env-file=../../.env`) or explicitly pass `--env-file=.env` from the correct cwd.
- If contract changes, rebuild it (`task contract:build` or `bun --cwd packages/contract build`) before API typecheck/build/tests; API prebuild already does this.
- Prefer `task dev` for a clean local setup (infra up + migrations up) rather than invoking turbo dev alone.
- Trust executable sources: `package.json`, `turbo.json`, `Taskfile.yml`, `biome.json`, `apps/*/package.json`, `apps/api/vitest*.ts`, `apps/api/src/mikro-orm.config.ts` over prose if they ever conflict.
- Keep changes consistent with Biome config (tabs, single quotes). API-specific style overrides exist.
- Global API prefix is `/api` (see `main.ts`).
- Do not assume generic commands work if they differ; use the exact forms above.
