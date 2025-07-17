# TryUI Frontend

A modern React frontend for the TryUI design system application, built with TypeScript, Vite, and comprehensive testing.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 🛠️ Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Testing:** Vitest + React Testing Library + MSW
- **API:** Auto-generated client from OpenAPI spec

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── store/              # Redux store and slices
├── api/                # Auto-generated API client
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── test/               # Test utilities and mocks
└── assets/             # Static assets
```

## 🧪 Testing

This project uses a comprehensive testing setup with:

- **Vitest** - Fast test runner built for Vite
- **React Testing Library** - Testing utilities focused on user behavior
- **MSW (Mock Service Worker)** - API mocking for realistic tests
- **@testing-library/jest-dom** - Extended DOM matchers

### Running Tests

```bash
# Interactive test runner (watch mode)
npm run test

# Single test run (CI mode)
npm run test:run

# Generate coverage report
npm run test:coverage

# Visual test interface
npm run test:ui
```

### Test Structure

- Component tests: `src/components/**/*.test.tsx`
- Hook tests: `src/hooks/**/*.test.ts`
- API mocks: `src/test/mocks/`
- Test utilities: `src/test/test-utils.tsx`

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage
- `npm run test:ui` - Open Vitest UI
- `npm run generate-api:local` - Generate API client from local backend

## 🔧 Development Guidelines

### TypeScript

- Use `import type` for type-only imports
- All interfaces and types must start with 'I' (e.g., `IUser`, `IApiResponse`)
- Enable strict TypeScript checking

### Testing

- Focus on testing user behavior, not implementation details
- Use MSW for API mocking instead of stubbing fetch/axios
- Write descriptive test names that explain expected behavior
- Aim for high coverage on business logic and user flows

### Code Style

- Follow the configured ESLint rules
- Use Prettier for consistent formatting
- Prefer functional components with hooks
- Use Tailwind CSS for styling
- Prioritize flexbox over CSS grid

## 🌐 API Integration

The frontend uses an auto-generated API client created from the backend's OpenAPI specification. To update the API client:

```bash
# Generate from local backend (ensure backend is running on :8000)
npm run generate-api:local
```

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)