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
| Last reviewed | 2026-10-07 |
| Next review date | 2026-10-21 |
| Owner | Repository maintainer |
| Affected component | Backend Prisma tooling |
| Direct application exposure | Low |

#### Affected dependencies

- `deepmerge-ts@7.1.5`
- `mysql2@3.15.3`

#### Dependency paths

- `prisma@7.10.0 -> @prisma/config@7.10.0 -> deepmerge-ts@7.1.5`
- `prisma@7.10.0 -> mysql2@3.15.3`

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

#### Review outcome: 2026-10-07

The backend dependency tree was reviewed and the following supported updates
were applied:

- `@prisma/adapter-pg`, `@prisma/client`, and `prisma` were aligned on
  version `7.10.0`.
- `proxy-addr` was updated from `2.0.7` to `2.0.8`, resolving the reported
  critical IP-spoofing vulnerability.
- `source-map-js` was updated from `1.2.1` to `1.2.2`, resolving the reported
  event-loop denial-of-service vulnerability.

The remaining npm audit output reports four high-severity findings through the
Prisma CLI dependency paths documented above. npm continues to propose a
breaking downgrade to Prisma 6, which is not an acceptable remediation.

Validation after the supported updates completed successfully:

- Prisma schema validation and client generation
- backend lint and TypeScript compilation
- all 26 backend integration tests

#### Resolution criteria

This risk can be closed when a supported Prisma 7 release, or a later
compatible stable release, replaces the affected transitive dependencies with
patched versions.

The dependency status must be reviewed on or before the next review date.