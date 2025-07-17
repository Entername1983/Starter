# Claude Project Configuration

This file provides context for the Claude AI assistant to understand and work with this project.

## Project Overview

This is a full-stack application with a React frontend and a FastAPI backend. The entire application is designed to be deployed via Docker.

## Tech Stack

### Frontend

- **Language:** TypeScript
- **Framework:** React
- **Build Tool:** Vite
- **State Management:** Redux Toolkit (RTK)
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **Icons:** Material Design icons from react-icons ("react-icons/md")

### Backend

- **Framework:** FastAPI (Python)
- **Package Management:** UV
- **Use of Pydantic:** For data validation and serialization
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Authentication:** JWT (JSON Web Tokens)
- **Testing:** Pytest for unit and integration tests
- **Typing:** Python type hints for static type checking
- **Logging:** Structured logging with JSON format and request tracing

### API & SDK

- **Specification:** OpenAPI
- **Automation:** The project aims to use OpenAPI to automatically generate the client-side SDK from the backend API specification.
  this is done using https://github.com/hey-api/openapi-ts

### Deployment

- **Containerization:** Docker

## Common Commands

_This section will be updated as the project is developed._

### Frontend

- **Install Dependencies:** `npm install`
- **Run Dev Server:** `npm run dev`
- **Build for Production:** `npm run build`
- **Lint:** `npm run lint`
- **Type Check:** `npm run type-check`
- **Run Tests:** `npm run test`
- **Run Tests (CI):** `npm run test:run`
- **Test Coverage:** `npm run test:coverage`
- **Test UI:** `npm run test:ui`

### Backend

- **Install Dependencies:** `uv sync`
- **Run Dev Server:** `uvicorn main:app --reload`
- **Run Tests:** `python -m pytest tests/ -v`
- **Run Tests with Coverage:** `python -m pytest tests/ --cov=app --cov-report=html`

## Development Guidelines

### TypeScript Import Requirements

- ALWAYS use `import type` for type-only imports when importing TypeScript types and interfaces
- This is required due to `verbatimModuleSyntax` being enabled in the TypeScript configuration
- Example: `import type { MyType } from './types'` instead of `import { MyType } from './types'`

### TypeScript Naming Conventions

- **ALL interfaces and types must start with 'I'** (Hungarian notation for interfaces)
- Examples:
  - `interface IUser { ... }` ✅
  - `type IColorPalette = { ... }` ✅
  - `interface User { ... }` ❌
  - `type ColorPalette = { ... }` ❌
- This naming convention is enforced by the ESLint rule `@typescript-eslint/naming-convention`
- The rule automatically checks that all interfaces and type aliases use PascalCase with an 'I' prefix

### React Component Structure

- **ALL React components MUST follow this structure:**
```typescript
import React from 'react';

interface I{ComponentName}Props {
  // Props definition here
}

const {ComponentName}: React.FC<I{ComponentName}Props> = () => {
  return (
    <>{/* Component content here */}</>
  )
}

export default {ComponentName}
```

- **Component naming**: Use PascalCase for component names
- **Interface naming**: Component props interfaces must start with 'I' and end with 'Props'
- **React import**: Always import React explicitly
- **FC typing**: Always use `React.FC<Props>` for functional components
- **Fragment usage**: Prefer `<>...</>` over `<div>` for wrapping unless semantic meaning required

### Code Style Preferences

- **Prefer `??` over `||`**: Use nullish coalescing (`??`) instead of logical OR (`||`) for default values
  - `const value = prop ?? 'default'` ✅
  - `const value = prop || 'default'` ❌
- **Keyboard accessibility**: All visible non-interactive elements with click handlers MUST have at least one keyboard listener (onKeyDown, onKeyUp, or onKeyPress)

### Design System

- Prioritize flex over grid

### Logging

- **Structured Logging:** JSON format for production, simple format for development
- **Request Tracing:** Automatic request ID generation and context propagation
- **Error Handling:** Comprehensive exception logging with structured data
- **Log Levels:** DEBUG for development, INFO for production, with appropriate filtering
- **Contextual Data:** User ID, request ID, and relevant business context included in logs

## Testing

### Frontend Testing Stack

- **Testing Framework:** Vitest (faster alternative to Jest, built for Vite)
- **React Testing:** React Testing Library (testing user behavior vs implementation)
- **DOM Assertions:** @testing-library/jest-dom (extended matchers)
- **User Interactions:** @testing-library/user-event
- **API Mocking:** MSW (Mock Service Worker) for realistic network request mocking
- **Test Environment:** jsdom for DOM simulation

### Testing Structure

```
src/
├── test/
│   ├── setup.ts              # Test configuration and MSW setup
│   ├── test-utils.tsx        # Custom render function with Redux
│   └── mocks/
│       ├── handlers.ts       # MSW request handlers
│       └── server.ts         # MSW server setup
├── components/
│   └── Button/
│       ├── index.tsx
│       └── Button.test.tsx   # Component tests
└── hooks/
    ├── useApi.ts
    └── useApi.test.ts        # Hook tests
```

### Testing Guidelines

- **Component Tests:** Focus on user interactions and behavior, not implementation details
- **Hook Tests:** Test custom hooks with proper Redux provider setup
- **API Tests:** Use MSW to mock API responses, avoiding axios/fetch mocking
- **Coverage:** Aim for high test coverage on business logic and user flows
- **Naming:** Use descriptive test names that explain the expected behavior

### Running Tests

- **Watch Mode:** `npm run test` - Interactive test runner
- **CI Mode:** `npm run test:run` - Single run for continuous integration
- **Coverage:** `npm run test:coverage` - Generate coverage report
- **UI Mode:** `npm run test:ui` - Visual test runner interface
