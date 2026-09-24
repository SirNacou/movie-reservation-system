# Movie Reservation System

Movie reservation system monorepo with a NestJS API, Solid web app, and shared oRPC contract.

## Development

Install dependencies with Bun, then copy `.env.example` to `.env` and fill in `TMDB_API_KEY`.

The recommended development workflow runs the API and web app directly on your machine. Docker is used only for PostgreSQL and Redis:

```sh
task dev
```

The apps are available at:

- Web: http://localhost:3000
- API: http://localhost:4000
- Node debugger: port 9229

To stop the development dependencies:

```sh
task infra:down
```

You can also run the apps without Task:

```sh
bun --env-file=.env run dev
```

In that case, start PostgreSQL and Redis first with `task infra:up` and apply migrations with `task migration:up`.

## Database migrations

Migration commands run on the host, so they are easy to debug locally:

- `task migration:up`
- `task migration:down`
- `task migration:pending`
- `task migration:create CLI_ARGS=AddMovieFields`
- `task migration:blank CLI_ARGS=AddCustomIndex`
- `task migration:fresh`

## Full Docker workflow

The original all-container workflow remains available when needed:

- `task up` starts every service in the background.
- `task watch` starts every service with Compose watch mode.
- `task down` stops every service.
- `task logs` follows API container logs.

## Common checks

- `bun run build`
- `bun run check-types`
- `bun run lint`
