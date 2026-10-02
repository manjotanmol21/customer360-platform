# Customer360 Platform

[![Customer360 CI](https://github.com/manjotanmol21/customer360-platform/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/manjotanmol21/customer360-platform/actions/workflows/ci.yml)

Customer360 is a production-oriented full-stack customer management platform
built with React, TypeScript, Node.js, Express, Prisma and PostgreSQL.

## Features

- Secure user registration and login
- JWT-based authentication
- Administrator and viewer roles
- Backend and frontend route authorization
- Customer creation, viewing, updating and deletion
- Search, filtering, sorting and pagination
- Request validation and structured API errors
- Security headers, configurable CORS and rate limiting
- Graceful backend shutdown
- Liveness and database-backed readiness checks
- Server-generated request correlation IDs
- Structured JSON request and error logging
- Backend integration tests
- Enforced coverage thresholds
- Automated frontend and backend CI quality gates

## Architecture

```text
React frontend
    |
    | HTTPS / JSON
    v
Express REST API
    |
    | Prisma ORM
    v
PostgreSQL
```

## Technology stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack React Query
- Axios
- React Hook Form
- Zod

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- Zod validation
- Vitest and Supertest

### Engineering and security

- GitHub Actions
- ESLint
- Coverage thresholds
- Dependabot
- Helmet
- CORS allowlist
- API and authentication rate limits
- Structured logging
- Health probes
- Graceful shutdown

## Repository structure

- `.github/workflows/` — GitHub Actions CI
- `backend/prisma/` — Prisma schema and migrations
- `backend/src/` — Express application source
- `backend/tests/` — Backend integration tests
- `docs/` — Deployment and security documentation
- `frontend/src/` — React application source


## Local prerequisites

- Node.js 24
- npm
- PostgreSQL
- Git

## Backend setup

Create the local environment file from the example:

```powershell
Copy-Item backend\.env.example backend\.env
```

Update the copied values for your local PostgreSQL database and JWT secret.

Install dependencies, generate Prisma Client, apply development migrations and
start the backend:

```powershell
npm --prefix backend install
npm --prefix backend run prisma:generate
npm --prefix backend exec prisma migrate dev
npm --prefix backend run dev
```

The local backend runs at:

```text
http://localhost:3000
```

## Frontend setup

The frontend automatically uses `http://localhost:3000/api` during development
when `VITE_API_BASE_URL` is not provided.

Install dependencies and start Vite:

```powershell
npm --prefix frontend install
npm --prefix frontend run dev
```

The local frontend runs at:

```text
http://localhost:5173
```

## Health endpoints

| Endpoint | Purpose |
|---|---|
| `GET /api/health` | General health |
| `GET /api/health/live` | API process liveness |
| `GET /api/health/ready` | API and PostgreSQL readiness |

## Quality checks

### Backend

```powershell
npm --prefix backend run lint
npm --prefix backend run build:production
npm --prefix backend run test:coverage
```

### Frontend

A production frontend build requires an HTTPS API URL ending in `/api`:

```powershell
$env:VITE_API_BASE_URL = "https://api.example.com/api"

npm --prefix frontend run lint
npm --prefix frontend run build

Remove-Item Env:VITE_API_BASE_URL
```

## Deployment

The provider-neutral production deployment contract is documented in
[`docs/deployment.md`](docs/deployment.md).

The project is designed for managed hosting and does not require developers to
install Docker locally.

## Security

Environment files, credentials, generated Prisma Client code, dependencies,
build output and coverage reports are excluded from Git.

Known dependency risks that cannot currently be remediated safely are documented
in [`docs/security-risk-register.md`](docs/security-risk-register.md).

Never commit:

- `.env` files
- Database credentials
- JWT secrets
- Access tokens
- Private customer data