# Project Title

A starter template using FastAPI and React

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Technologies](#technologies)
3. [Getting Started](#getting-started)
4. [Backend](#backend)

   - [Startup](#Startup)
   - [Tooling](#Tooling)
   - [Config](#config)
   - [Logging](#logging)
   - [Types](#Types)
   - [ORM](#ORM)

5. [Frontend](#frontend)
6. [Reverse Proxy](#reverse-proxy)
7. [Database](#database)
8. [Cache](#cache)

---

## Project Structure

```
project-root/
├── backend/            # FastAPI application
├── frontend/           # React application
├── nginx/              # Nginx configuration files
├── postgres/                 # Database initialization scripts
├── cache/              # Redis configuration
└── README.md           # Project overview and instructions
```

## Technologies

- **Frontend:** React
- **Backend:** FastAPI
- **Reverse Proxy:** Nginx
- **Database:** PostgreSQL
- **Cache:** Redis

## Getting Started

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

## Backend

The backend is built with FastAPI and provides RESTful endpoints for the application.

### Startup

- Run dev:
  uvicorn main:app --reload --host 0.0.0.0 --port 8000

### Tooling

- Package manager: UV
- Linter: Ruff

### Config

We are using pydantic-settings to manage .env variables and application settings.
The main config file is in app/core/config/
There are three areas that pull configurations from:

- .env file - secrets, API keys, etc.
- pyproject.toml - project name, version, and description
- config.{environment}.yaml - application-specific settings (the environment will be loaded from the .env file first, and the appropriate config will be loaded)

### Logging

Logging configs can be loaded from the yaml files in app/core/logger/
Development or production configs will be loaded depending on the environment setting
Logging has structured JSON and time file rotation for development

### Types

Type hinting is applied as strictly as possible to take advantage of FastAPI/Pydantics validation as well as we auto generating API functions & types for the frontend.

### ORM

Using SQLAlchemy in async mode.

---

## Frontend

A React-based single-page application (SPA) located in the `frontend/` directory. See `frontend/README.md` for setup and development instructions.

## Reverse Proxy

Nginx is configured as a reverse proxy to route traffic to the frontend and backend. Configuration files live in the `nginx/` directory.

## Database

PostgreSQL is used for persistent storage. Database initialization and migration scripts are stored in `db/`.

## Cache

Redis is used for caching frequently accessed data. Configuration can be found in `cache/`.
