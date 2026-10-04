# Customer360 Deployment Contract

This document defines the production build, migration, startup and environment
requirements for the Customer360 Platform.

No local Docker installation is required. The frontend, backend and PostgreSQL
database can be hosted by managed services connected to the GitHub repository.

## Architecture

```text
Browser
  |
  | HTTPS
  v
React static frontend
  |
  | HTTPS / JSON
  v
Express API
  |
  | TLS PostgreSQL connection
  v
Managed PostgreSQL database
```

## Backend deployment

The hosting service must use `backend` as its working directory.

### Install command

```text
npm ci
```

### Production build command

```text
npm run build:production
```

This command generates the Prisma Client and compiles TypeScript into `dist`.

### Database migration command

```text
npm run db:migrate:deploy
```

This applies committed Prisma migrations without generating new migrations.

The migration command should run before the new application version begins
serving production traffic.

### Start command

```text
npm start
```

This starts the compiled application from `dist/server.js`.

The hosting platform must provide the `PORT` environment variable when it
requires a specific listening port.

## Backend environment variables

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | Use `production` in the hosted environment |
| `PORT` | Platform-dependent | HTTP listening port |
| `DATABASE_URL` | Yes | Pooled managed PostgreSQL connection used by the running API |
| `DIRECT_URL` | Yes | Direct managed PostgreSQL connection used by Prisma migrations |
| `JWT_SECRET` | Yes | Random secret containing at least 32 characters |
| `JWT_EXPIRES_IN` | Yes | Access-token lifetime, such as `15m` |
| `CORS_ORIGINS` | Yes | Comma-separated allowed frontend origins |
| `JSON_BODY_LIMIT` | Yes | Maximum JSON request size |
| `RATE_LIMIT_WINDOW_MS` | Yes | API rate-limit window |
| `RATE_LIMIT_MAX` | Yes | General API request limit |
| `AUTH_RATE_LIMIT_MAX` | Yes | Authentication request limit |

Secrets must be stored in the hosting provider's protected environment-variable
settings. They must never be committed to Git.

## Frontend deployment

The hosting service must use `frontend` as its working directory.

### Install command

```text
npm ci
```

### Build command

```text
npm run build
```

### Publish directory

```text
dist
```

## Frontend environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Yes | Public HTTPS backend URL ending with `/api` |

Example:

```text
VITE_API_BASE_URL=https://customer360-api.example.com/api
```

Vite variables are included in the browser bundle. Never store secrets,
passwords, database URLs or JWT secrets in a `VITE_*` variable.

## Health endpoints

| Endpoint | Purpose | Successful status |
|---|---|---:|
| `/api/health` | General API health | 200 |
| `/api/health/live` | Confirms that the API process is alive | 200 |
| `/api/health/ready` | Confirms that PostgreSQL is reachable | 200 |

The readiness endpoint returns `503 Service Unavailable` when the database
cannot be reached.

## CORS sequence

The backend cannot allow the deployed frontend origin until the frontend URL is
known.

A first deployment may therefore use this sequence:

1. Deploy the backend with a temporary restricted CORS configuration.
2. Deploy the frontend using the backend API URL.
3. Add the deployed frontend origin to backend `CORS_ORIGINS`.
4. Redeploy the backend.
5. Validate browser requests from the deployed frontend.

Multiple origins are comma-separated:

```text
https://customer360.example.com,http://localhost:5173
```

Only required origins should be allowed.

## Production validation

After deployment, verify:

1. Liveness returns HTTP 200.
2. Readiness returns HTTP 200.
3. Registration and login work.
4. Admin and viewer authorization remain correct.
5. Customer CRUD operations work.
6. Browser CORS requests succeed only from approved origins.
7. API responses contain `X-Request-ID`.
8. Backend logs contain structured request-completion events.
9. Unknown API routes return JSON 404 responses.
10. The frontend does not reference `localhost`.

## Rollback principle

Application rollback and database rollback are different operations.

Application code can normally be redeployed from a previous known-good commit.
Database migrations should be backward-compatible whenever possible. Production
schema changes must not be reversed by running `prisma migrate dev`.

Use:

```text
prisma migrate deploy
```

for production deployment and preserve the migration history in Git.