# Starter Template

A starter template using FastAPI and React

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Technologies](#technologies)
3. [Getting Started](#getting-started)
4. [Backend](#backend)
   - [Rules](#backend-rules)
   - [Startup](#startup)
   - [Tooling](#tooling)
   - [Config](#config)
   - [Logging](#logging)
   - [Types](#types)
   - [ORM](#orm)
   - [Dependency Injection](#dependency-injection)
   - [DB](#db)
   - [Testing](#testing)
   - [Auth](#backend-auth)
5. [Frontend](#frontend)
   - [Rules](#frontend-rules)
   - [Build](#build)
   - [Auth](#frontend-auth)
   - [Forms](#forms)
   - [Routing](#routing)
   - [Api](#api)
   - [State](#state)
   - [Components](#components)
   - [SVG](#svg)
   - [Styling](#styling)
   - [Validation](#validation)
   - [Contexts](#contexts)
   - [Text-Editor](#text-editor)

6. [Reverse Proxy](#reverse-proxy)
7. [Database](#database)
8. [Cache](#cache)
9. [Auth](#auth)
10. [Telemetry](#telemetry)

---

## Project-structure

```
project-root/
├── backend/            # FastAPI application
├── frontend/           # React application
├── nginx/              # Nginx configuration files
├── postgres/           # Database initialization scripts
├── cache/              # Redis configuration
└── README.md           # Project overview and instructions
```

## Technologies

- **Frontend:** React
- **Backend:** FastAPI
- **Reverse Proxy:** Nginx
- **Database:** PostgreSQL
- **Cache:** Redis

## Getting-started

1. Clone the repository:
   ```bash
   git clone https://github.com/Entername1983/Starter.git
   cd your-repo
   ```
2. Follow the setup instructions in each sub-directory:
   - `backend/README.md`
   - `frontend/README.md`
   - `nginx/README.md`

---

### Development mode

1. Access dev db container

```bash
psql -h localhost -p 5432 -U admin -d mydb
```

## Backend

The backend is built with FastAPI and provides RESTful endpoints for the
application.

### Backend-rules

- All API routes use dependency injections for DB, Cache(Redis), Settings + User

### Startup

- Run dev: uvicorn main:app --reload --host 0.0.0.0 --port 8000

### Tooling

- Package manager: UV
- - Activate with virtual env. with "source .venv/bin/activate.fish"
- Linter: Ruff
- Task runner: Poethepoet

### Config

We are using pydantic-settings to manage .env variables and application
settings. The main config file is in app/core/config/ There are three areas that
pull configurations from:

- .env file - secrets, API keys, etc.
- pyproject.toml - project name, version, and description
- config.{environment}.yaml - application-specific settings (the environment
  will be loaded from the .env file first, and the appropriate config will be
  loaded)

### Logging

Logging configs can be loaded from the yaml files in app/core/logger/
Development or production configs will be loaded depending on the environment
setting Logging has structured JSON and time file rotation for development

### Types

Type hinting is applied as strictly as possible to take advantage of
FastAPI/Pydantics validation as well as we auto generating API functions & types
for the frontend.

### ORM

Using SQLAlchemy in async mode.

### Dependency-injection

Using the following pattern for fully typed depency injection.

```python
@lru_cache
def get_settings() -> Settings:
    return Settings()

AppSettings = Annotated[Settings, Depends(get_settings)]


settings = get_settings()
```

### DB

- Using Alembic to manage migrations
- Alembic config in pyproject.toml:
  https://alembic.sqlalchemy.org/en/latest/tutorial.html#using-pep-621

### Testing

- Using pytest

### Frontend-Auth

- Using OAuth with google auth + internal auth.
- Storing HTTP only cookie with JWT token
- Before token expiry a check is made to see if user is still on page, if so
  refresh token is used to issue a new JWT token
- During registration using a session_id with an oAuthState token to protect
  against CSRF as well as a provider_id storing the external oauth provider ID
  to ensure a user cannot register an account with an external provider ID that
  does not belong to them

## Frontend

A React-based single-page application (SPA) located in the `frontend/`
directory. See `frontend/README.md` for setup and development instructions.

### Frontend-rules

- Seperate UI & Functionality as much as possible
- Atomic components, every file contains a single component
- Major components are in their own directory and named index.tsx
- Use semantic html even within react components

### Build

Vite, what else?

### Backend-Auth

- Login made through API calls that then sets an HTTP only JWT token
- Follow up check user status returns a user object upon verification of the JWT
  token
- Logout API call to server deletes JWT token then frontend clears User in Redux
  store
- Check user status made at top level so that a user is automatically logged in
  if the JWT token is still valid
- TODO: Add refresh token

### Forms

Using react-hook-form https://react-hook-form.com/

### Routing

Using Tanstack router https://tanstack.com/router/ File based with autogenerated
file "src/routeTree.gen.ts"

### API

Api functions are auto generated from OpenApi specs. Using React RTK query.
https://github.com/reduxjs/redux-toolkit/tree/master/packages/rtk-query-codegen-openapi

### State

Using Redux RTK + context api

### Components

Using mantine core

### SVG

Using a plugin to transform SVGs into components
https://www.npmjs.com/package/vite-plugin-svgr

### Styling

Primarily tailwindcss

### Validation

Using zod for validation where required (mostly search params & forms)

### Contexts

Using the following contexts:

- ContextWrapper: Wrapping all other contexts
- ModalContext: Toggling a modal + setting the content
- LayoutContext: Toggling optional Sidebar

### Text-editor

Using react-markdown and remark gfm

## Reverse Proxy

Nginx is configured as a reverse proxy to route traffic to the frontend and
backend. Configuration files live in the `nginx/` directory.

## Database

PostgreSQL is used for persistent storage. Database initialization and migration
scripts are stored in `db/`.

## Cache

Redis is used for caching frequently accessed data. Configuration can be found
in `cache/`.

## Auth

Using OAuth with bearer token stored as a http only cookie with expiration +
refresh tokens.

Currently supporting:

- Google Auth

## Telemetry

Using the following:

- Sentry
- Posthog
