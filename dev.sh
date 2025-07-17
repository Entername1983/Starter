#!/bin/bash

# TryUI Development Helper Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "${BLUE}=================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}=================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Get the correct docker compose command
get_docker_compose_cmd() {
    if docker compose version > /dev/null 2>&1; then
        echo "docker compose"
    elif command -v $(get_docker_compose_cmd) > /dev/null 2>&1; then
        echo "$(get_docker_compose_cmd)"
    else
        print_error "Neither 'docker compose' nor '$(get_docker_compose_cmd)' is available"
        exit 1
    fi
}

# Show help
show_help() {
    echo "TryUI Development Helper Script"
    echo ""
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start       Start all services in development mode"
    echo "  stop        Stop all services"
    echo "  restart     Restart all services"
    echo "  build       Build all Docker images"
    echo "  logs        Show logs from all services"
    echo "  logs-api    Show backend API logs"
    echo "  logs-web    Show frontend logs"
    echo "  logs-db     Show database logs"
    echo "  shell-api   Open shell in backend container"
    echo "  shell-web   Open shell in frontend container"
    echo "  shell-db    Open PostgreSQL shell"
    echo "  test        Run backend tests"
    echo "  test-watch  Run backend tests in watch mode"
    echo "  test-db     Test database connection"
    echo "  migrate     Run database migrations"
    echo "  generate-api Generate frontend API client from backend"
    echo "  setup       Initial project setup"
    echo "  clean       Clean up containers and volumes"
    echo "  status      Show status of all services"
    echo "  help        Show this help message"
}

# Start services
start_services() {
    print_header "Starting TryUI Development Environment"
    check_docker
    COMPOSE_CMD=$(get_docker_compose_cmd)
    
    if [ ! -f .env ]; then
        print_warning "No .env file found. Creating from template..."
        cp .env.example .env
        print_warning "Please edit .env file with your configuration before running again."
        exit 1
    fi
    
    $COMPOSE_CMD up -d
    print_success "All services started!"
    print_services_info
}

# Stop services
stop_services() {
    print_header "Stopping TryUI Services"
    COMPOSE_CMD=$(get_docker_compose_cmd)
    $COMPOSE_CMD down
    print_success "All services stopped!"
}

# Restart services
restart_services() {
    print_header "Restarting TryUI Services"
    COMPOSE_CMD=$(get_docker_compose_cmd)
    $COMPOSE_CMD restart
    print_success "All services restarted!"
}

# Build images
build_images() {
    print_header "Building Docker Images"
    COMPOSE_CMD=$(get_docker_compose_cmd)
    $COMPOSE_CMD build --no-cache
    print_success "All images built!"
}

# Show logs
show_logs() {
    $(get_docker_compose_cmd) logs -f
}

show_api_logs() {
    $(get_docker_compose_cmd) logs -f backend
}

show_web_logs() {
    $(get_docker_compose_cmd) logs -f frontend
}

show_db_logs() {
    $(get_docker_compose_cmd) logs -f postgres
}

# Open shells
shell_api() {
    print_header "Opening Backend Shell"
    $(get_docker_compose_cmd) exec backend bash
}

shell_web() {
    print_header "Opening Frontend Shell"
    $(get_docker_compose_cmd) exec frontend sh
}

shell_db() {
    print_header "Opening Database Shell"
    $(get_docker_compose_cmd) exec postgres psql -U postgres -d tryui
}

# Run tests
run_tests() {
    print_header "Running Backend Tests"
    $(get_docker_compose_cmd) exec backend python -m pytest tests/ -v
}

run_tests_watch() {
    print_header "Running Backend Tests in Watch Mode"
    $(get_docker_compose_cmd) exec backend python -m pytest tests/ -v --watch
}

# Generate API client
generate_api() {
    print_header "Generating Frontend API Client"
    
    # Check if backend is running
    if ! $(get_docker_compose_cmd) ps backend | grep -q "Up"; then
        print_warning "Backend is not running. Starting backend first..."
        $(get_docker_compose_cmd) up -d backend
        sleep 10
    fi
    
    # Generate API client
    $(get_docker_compose_cmd) exec frontend npm run generate-api
    print_success "API client generated successfully!"
}

# Test database connection
test_database() {
    print_header "Testing Database Connection"
    
    # Check if backend is running
    if ! $(get_docker_compose_cmd) ps backend | grep -q "Up"; then
        print_warning "Backend is not running. Starting backend first..."
        $(get_docker_compose_cmd) up -d backend postgres
        sleep 15
    fi
    
    # Run database test
    $(get_docker_compose_cmd) exec backend python test_db_connection.py
}

# Run database migrations
run_migrations() {
    print_header "Running Database Migrations"
    
    # Check if backend is running
    if ! $(get_docker_compose_cmd) ps backend | grep -q "Up"; then
        print_warning "Backend is not running. Starting backend first..."
        $(get_docker_compose_cmd) up -d backend postgres
        sleep 15
    fi
    
    # Run migrations
    $(get_docker_compose_cmd) exec backend alembic upgrade head
    print_success "Database migrations completed!"
}

# Initial setup
setup_project() {
    print_header "Setting Up TryUI Development Environment"
    
    # Check prerequisites
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check for docker compose (new syntax) or $(get_docker_compose_cmd) (legacy)
    if ! docker compose version &> /dev/null && ! command -v $(get_docker_compose_cmd) &> /dev/null; then
        print_error "Docker Compose is not available. Please install Docker Compose first."
        exit 1
    fi
    
    # Create .env from template
    if [ ! -f .env ]; then
        cp .env.example .env
        print_success "Created .env file from template"
        print_warning "Please edit .env file with your Google OAuth credentials"
    fi
    
    # Build images
    print_header "Building Docker Images"
    $(get_docker_compose_cmd) build
    
    # Start services
    print_header "Starting Services"
    $(get_docker_compose_cmd) up -d
    
    # Wait for services to be ready
    print_header "Waiting for Services to be Ready"
    sleep 10
    
    # Test database connection
    print_header "Testing Database Connection"
    $(get_docker_compose_cmd) exec backend python test_db_connection.py
    
    # Run database migrations
    print_header "Running Database Migrations"
    $(get_docker_compose_cmd) exec backend alembic upgrade head
    
    print_success "Setup complete!"
    print_services_info
}

# Clean up
clean_up() {
    print_header "Cleaning Up Docker Resources"
    $(get_docker_compose_cmd) down -v --remove-orphans
    docker system prune -f
    print_success "Cleanup complete!"
}

# Show status
show_status() {
    print_header "Service Status"
    $(get_docker_compose_cmd) ps
}

# Print service information
print_services_info() {
    echo ""
    print_success "Services are running:"
    echo "  🌐 Frontend: http://localhost:3000"
    echo "  🔧 Backend API: http://localhost:8000"
    echo "  📚 API Docs: http://localhost:8000/docs"
    echo "  🗄️  Database: localhost:5432"
    echo "  🔄 Redis: localhost:6379"
    echo ""
    echo "Useful commands:"
    echo "  ./dev.sh logs      - View all logs"
    echo "  ./dev.sh shell-api - Backend shell"
    echo "  ./dev.sh test      - Run tests"
    echo "  ./dev.sh stop      - Stop services"
}

# Main script logic
case "${1:-help}" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    build)
        build_images
        ;;
    logs)
        show_logs
        ;;
    logs-api)
        show_api_logs
        ;;
    logs-web)
        show_web_logs
        ;;
    logs-db)
        show_db_logs
        ;;
    shell-api)
        shell_api
        ;;
    shell-web)
        shell_web
        ;;
    shell-db)
        shell_db
        ;;
    test)
        run_tests
        ;;
    test-watch)
        run_tests_watch
        ;;
    test-db)
        test_database
        ;;
    migrate)
        run_migrations
        ;;
    generate-api)
        generate_api
        ;;
    setup)
        setup_project
        ;;
    clean)
        clean_up
        ;;
    status)
        show_status
        ;;
    help)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac