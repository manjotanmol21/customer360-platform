# Customer360 Production Environment

This document records the non-secret configuration of the Customer360
portfolio deployment.

Secrets, passwords, tokens and complete database connection strings must never
be added to this document or committed to Git.

## Architecture

```text
Browser
  |
  | HTTPS
  v
Render Static Site (React)
  |
  | HTTPS API requests
  v
Render Web Service (Express)
  |
  | pooled TLS PostgreSQL connection
  v
Neon PostgreSQL
```

## Backend service

| Setting | Value |
|---|---|
| Provider | Render |
| Service | `customer360-platform` |
| Region | Singapore |
| Public URL | `https://customer360-platform-2a9p.onrender.com` |
| Deployment branch | `master` |
| Root directory | `backend` |
| Node version | `>=24 <25` |
| Health-check path | `/api/health/live` |
| Auto-deploy | Enabled |
| Instance type | Free portfolio instance |

### Build command

```text
npm ci --include=dev && npm run db:migrate:deploy && npm run build:production
```

Development dependencies are included in the build environment because
TypeScript, Prisma CLI and TypeScript declaration packages are required to
produce the compiled application.

### Start command

```text
npm start
```

The service runs the compiled application from `dist/server.js`.

These commands are Render service settings. They are not intended to be pasted
directly into Windows PowerShell.

## Database service

| Setting | Value |
|---|---|
| Provider | Neon |
| Cloud | AWS |
| Region | Singapore |
| Plan | Free |
| Database | `neondb` |
| Schema | `public` |
| Applied migrations | 4 |

The application uses two protected connection strings:

- `DATABASE_URL` uses the pooled Neon connection for application traffic.
- `DIRECT_URL` uses the direct Neon connection for Prisma migrations.

Connection strings are stored only in Render's protected environment settings.

## Environment variables

The backend service requires:

- `NODE_ENV`
- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CORS_ORIGINS`
- `JSON_BODY_LIMIT`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`
- `AUTH_RATE_LIMIT_MAX`

Render supplies `PORT`; it is not manually configured.

## Frontend service

| Setting | Value |
|---|---|
| Provider | Render |
| Service | `customer360-frontend` |
| Public URL | `https://customer360-frontend-v31t.onrender.com` |
| Deployment branch | `master` after the deployment PR is merged |
| Initial validation branch | `feature/frontend-cloud-deployment` |
| Root directory | `frontend` |
| Node version | `>=24 <25` |
| Build command | `npm install; npm run build` |
| Publish directory | `dist` |
| Auto-deploy | Enabled |

The static-site build receives:

```text
VITE_API_BASE_URL=https://customer360-platform-2a9p.onrender.com/api
```

The value is embedded into the generated JavaScript during the Vite build.
It is public configuration and must never contain a secret.

React Router navigation is supported by this Render rewrite:

```text
Source:      /*
Destination: /index.html
Action:      Rewrite
```

## Production CORS configuration

The backend allows the deployed frontend origin:

```text
https://customer360-frontend-v31t.onrender.com
```

The origin is stored in the backend Render service as `CORS_ORIGINS`.
The value does not include a trailing slash.

## Verified endpoints

| Endpoint | Expected result |
|---|---|
| `/api/health` | HTTP 200 |
| `/api/health/live` | HTTP 200 and API up |
| `/api/health/ready` | HTTP 200 and database up |
| `/api/customers` without a token | HTTP 401 |
| Unknown `/api/*` route | JSON HTTP 404 |

Production validation also confirmed:

- HTTPS transport and HSTS
- Helmet security headers
- no `X-Powered-By` disclosure
- modern rate-limit headers
- request correlation through `X-Request-ID`
- rejection of unapproved CORS origins
- structured request logging
- frontend home-page delivery
- React Router direct-route rewriting
- production frontend-to-backend CORS access
- authenticated admin login
- customer create, refresh, update and delete operations
- persisted customer data in Neon PostgreSQL
- zero frontend npm audit findings

## Free-tier operational behaviour

The Render free service can spin down after inactivity. Its first request after
an idle period may take longer while the service starts.

This deployment is intended for portfolio demonstration and learning rather
than a production workload with availability guarantees.

## Deployment branch

The Render service deploys from the protected default branch:

```text
master
```

The initial deployment was validated from
`feature/backend-cloud-deployment`. After pull request #37 was merged, Render
was changed to deploy commit `3c55cbd` from `master`.

The master deployment passed the general health, liveness, readiness and
request-correlation smoke tests.