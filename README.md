# TryUI - Full Stack Design Application

A modern full-stack application for creating and managing UI designs with a React frontend and FastAPI backend.

## 🏗️ Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit (RTK)
- **Styling**: Tailwind CSS
- **Authentication**: Google OAuth 2.0

### Backend

- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with async SQLAlchemy
- **Authentication**: JWT tokens with Google OAuth
- **API Documentation**: OpenAPI/Swagger
- **Testing**: Pytest with async support
- **Logging**: Structured logging with JSON format and request tracing

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 15
- **Package Management**:
  - Frontend: npm
  - Backend: uv (with virtual environment)

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd TryUI

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

### Local Development Setup

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
uv sync

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Start development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Development Commands

### Backend Commands

```bash
# Development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run tests
python -m pytest tests/ -v

# Run tests with coverage
python -m pytest tests/ --cov=app --cov-report=html

# Run specific test file
python -m pytest tests/test_auth_service.py -v

# Database migrations
alembic revision --autogenerate -m "Description"
alembic upgrade head
alembic downgrade -1

# Code formatting
black app/ tests/
isort app/ tests/

# Type checking
mypy app/
```

### Frontend Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate API client from backend OpenAPI spec
npm run generate-api

# Linting
npm run lint

# Type checking
npm run type-check

# Run tests
npm test

# Clean build artifacts
npm run clean
```

### Docker Commands

```bash
# Build and start all services
docker-compose up -d

# Rebuild services
docker-compose up -d --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Access service shell
docker-compose exec frontend sh
docker-compose exec backend bash
docker-compose exec postgres psql -U postgres -d tryui

# Remove all containers and volumes
docker-compose down -v --remove-orphans
```

## 📁 Project Structure

```
TryUI/
├── README.md                 # This file
├── docker-compose.yml        # Docker orchestration
├── CLAUDE.md                 # AI assistant instructions
│
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Button/       # Reusable button components
│   │   │   ├── ControlPanel/ # Design control panel
│   │   │   ├── DesignerApp/  # Main design application
│   │   │   └── SaveButton/   # Save with authentication
│   │   ├── store/           # Redux store setup
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   ├── package.json         # Node.js dependencies
│   ├── vite.config.ts       # Vite configuration
│   ├── tailwind.config.js   # Tailwind CSS config
│   └── Dockerfile           # Frontend container
│
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── api/             # API route handlers
│   │   │   ├── auth.py      # Authentication endpoints
│   │   │   ├── designs.py   # Design CRUD endpoints
│   │   │   └── users.py     # User profile endpoints
│   │   ├── core/            # Core configuration
│   │   │   ├── auth.py      # JWT authentication
│   │   │   ├── database.py  # Database setup
│   │   │   ├── logging.py   # Structured logging configuration
│   │   │   └── settings.py  # Application settings
│   │   ├── middleware/      # HTTP middleware
│   │   │   └── logging.py   # Request/response logging middleware
│   │   ├── models/          # SQLAlchemy models
│   │   │   ├── user.py      # User model
│   │   │   └── design.py    # Design model
│   │   ├── schemas/         # Pydantic schemas
│   │   │   ├── auth.py      # Authentication schemas
│   │   │   ├── user.py      # User schemas
│   │   │   └── design.py    # Design schemas
│   │   ├── services/        # Business logic
│   │   │   ├── auth_service.py    # Authentication service
│   │   │   └── design_service.py  # Design service
│   │   └── main.py          # FastAPI app factory
│   ├── tests/               # Test suite
│   │   ├── conftest.py      # Test configuration
│   │   ├── test_auth_service.py
│   │   ├── test_design_service.py
│   │   ├── test_models.py
│   │   ├── test_api_auth.py
│   │   ├── test_api_designs.py
│   │   ├── test_api_users.py
│   │   └── test_core.py
│   ├── alembic/             # Database migrations
│   ├── pyproject.toml       # Python dependencies and project config
│   ├── requirements.txt     # Legacy Python dependencies (for reference)
│   ├── pytest.ini          # Test configuration
│   ├── run_tests.py         # Test runner script
│   ├── main.py              # Application entry point
│   └── Dockerfile           # Backend container
│
└── postgres/                # Database setup
    └── init.sql             # Database initialization
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```bash
# Application
APP_NAME=TryUI
APP_ENV=development
DEBUG=true
SECRET_KEY=your-secret-key-here
HOST=0.0.0.0
PORT=8000

# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/tryui

# Authentication
ACCESS_TOKEN_EXPIRE_MINUTES=20
REFRESH_TOKEN_EXPIRE_DAYS=30

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

#### Frontend (.env)

```bash
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_API_BASE_URL=http://localhost:8000/api

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# Environment
NODE_ENV=development
```

## 🧪 Testing

### Backend Testing

The backend includes comprehensive test coverage:

- **Unit Tests**: Service layer and utility functions
- **Integration Tests**: API endpoints with authentication
- **Model Tests**: Database models and relationships
- **Auth Tests**: JWT token handling and Google OAuth

```bash
# Run all tests
python -m pytest tests/ -v

# Run with coverage report
python -m pytest tests/ --cov=app --cov-report=html --cov-report=term-missing

# Run specific test categories
python -m pytest tests/test_auth_service.py -v
python -m pytest tests/test_api_* -v

# Run tests in parallel
python -m pytest tests/ -n auto
```

### Frontend Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 📊 Features

### Authentication

- 🔐 Google OAuth 2.0 integration
- 🎟️ JWT tokens with automatic refresh (20-minute expiry)
- 👤 User profile management
- 🔒 Protected routes and API endpoints

### Design Management

- 🎨 Create, read, update, delete designs
- 📱 Multiple UI preset types (sidebar, navbar, etc.)
- 💾 JSON-based configuration storage
- 👥 User-specific design ownership

### UI Components

- 🔘 Reusable button components with multiple variants
- 🎛️ Control panel for design customization
- 💧 Dropdown menus with proper z-index handling
- 📱 Responsive design with Tailwind CSS

### Developer Experience

- 📚 Comprehensive API documentation (OpenAPI/Swagger)
- 🧪 Extensive test coverage (>80%)
- 🐳 Docker containerization
- 🔄 Hot reload for development
- 📝 TypeScript support with strict type checking
- 📊 Structured logging with request tracing and error monitoring

## 🚀 Deployment

### Production Docker Setup

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# View production logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Environment-Specific Configurations

- **Development**: Hot reload, debug mode, simple logging format
- **Staging**: Production-like setup with structured logging
- **Production**: Optimized builds, security hardening, JSON logging, monitoring

## 🛡️ Security

- JWT tokens with short expiry and refresh mechanism
- CORS configuration for cross-origin requests
- Input validation with Pydantic models
- SQL injection prevention with SQLAlchemy ORM
- Environment-based secret management

## 📈 Performance

- Async database operations with SQLAlchemy
- Connection pooling for database efficiency
- Vite for fast frontend builds and HMR
- Docker multi-stage builds for optimized images

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Ensure all tests pass: `npm test && python -m pytest`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Database Connection Issues**

```bash
# Check if PostgreSQL is running
docker compose logs postgres

# Reset database
docker compose down -v
docker compose up -d postgres
```

**Frontend Build Issues**

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Backend Import Issues**

```bash
# Ensure virtual environment is activated and sync dependencies
uv sync
```

**Docker Issues**

```bash
# Clean Docker system
docker system prune -a
docker-compose down --remove-orphans
```

### Getting Help

- 📚 Check the API documentation at `http://localhost:8000/docs`
- 🐛 Report issues on GitHub
- 💬 Join our community discussions

---

Built with ❤️ using React, FastAPI, and PostgreSQL
