# Customer360 Platform

[![Customer360 CI](https://github.com/manjotanmol21/customer360-platform/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/manjotanmol21/customer360-platform/actions/workflows/ci.yml)

Customer360 is a full-stack customer management platform built to demonstrate production-oriented React, TypeScript, Node.js, Express, PostgreSQL and continuous-integration practices.

## Features

- Secure user registration and login
- JWT-based authentication
- Role-based authorization
- Administrator and viewer roles
- Protected frontend routes
- Customer creation, viewing, updating and deletion
- Search, filtering, sorting and pagination
- Request validation and structured API errors
- Security headers, CORS controls and rate limiting
- Graceful backend shutdown
- Backend integration testing
- Automated lint, build, test and coverage quality gates

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