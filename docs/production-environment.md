# Customer360 Production Environment

This document records the non-secret configuration of the Customer360
portfolio deployment.

Secrets, passwords, tokens and complete database connection strings must never
be added to this document or committed to Git.

## Architecture

```text
Client
  |
  | HTTPS
  v
Render Web Service
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
| Deployment branch | `feature/backend-cloud-deployment` |
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

## Temporary CORS configuration

Until the frontend is deployed, the backend permits only the deliberately
non-routable placeholder origin:

```text
https://customer360.invalid
```

The placeholder must be replaced by the deployed frontend origin during the
frontend deployment.

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

## Free-tier operational behaviour

The Render free service can spin down after inactivity. Its first request after
an idle period may take longer while the service starts.

This deployment is intended for portfolio demonstration and learning rather
than a production workload with availability guarantees.

## Deployment branch transition

The Render service initially deploys from:

```text
feature/backend-cloud-deployment
```

After this change is merged, the Render deployment branch must be changed to:

```text
master
```

The feature branch must not be deleted until the master deployment succeeds
and its health endpoints pass.