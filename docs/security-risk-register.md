# Security Risk Register

This document records dependency-security findings that cannot currently be
remediated safely without introducing unsupported or breaking dependency
changes.

## Active risks

### RISK-001: Prisma CLI transitive dependencies

| Field | Value |
|---|---|
| Status | Temporarily accepted |
| Severity reported by npm | High |
| Identified | 2026-09-28 |
| Review date | 2026-10-12 |
| Owner | Repository maintainer |
| Affected component | Backend Prisma tooling |
| Direct application exposure | Low |

#### Affected dependencies

- `deepmerge-ts@7.1.5`
- `mysql2@3.15.3`

#### Dependency paths

- `prisma@7.9.1 -> @prisma/config@7.9.1 -> deepmerge-ts@7.1.5`
- `prisma@7.9.1 -> mysql2@3.15.3`

#### Risk analysis

`deepmerge-ts` is used through Prisma configuration tooling. Customer360 does
not pass externally supplied HTTP request objects into Prisma configuration
processing.

`mysql2` is installed transitively by the Prisma CLI. Customer360 uses
PostgreSQL through `@prisma/adapter-pg` and does not establish MySQL
connections. The affected MySQL authentication and compressed-protocol paths
are therefore not used by the application.

The Prisma CLI is primarily used during development, Prisma Client generation,
and database migration deployment. These dependencies are not called by
Customer360 API request handlers.

#### Remediation investigation

Prisma `7.10.0` was evaluated but still declares:

- `mysql2@3.15.3`
- `deepmerge-ts@7.1.5`

The patched upstream versions are:

- `mysql2@3.24.4`
- `deepmerge-ts@8.0.2`

The following remediations were rejected:

- Downgrading to Prisma 6 because it is a breaking architectural regression.
- Forcing `deepmerge-ts@8` because Prisma does not currently declare support
  for that major version.
- Overriding Prisma's exactly pinned `mysql2` dependency because that would
  create an unsupported dependency combination.

#### Compensating controls

- Customer360 uses PostgreSQL and does not connect to MySQL.
- Prisma configuration files and migration inputs are repository-controlled.
- Pull requests require backend and frontend CI quality gates.
- Dependency lockfiles are committed and reviewed.
- Dependabot and GitHub dependency alerts are enabled.
- Production secrets are not stored in the repository.
- Forced npm audit remediation is prohibited.

#### Resolution criteria

This risk can be closed when a supported Prisma 7 release, or a later
compatible stable release, replaces the affected transitive dependencies with
patched versions.

The dependency status must be reviewed on or before the review date.