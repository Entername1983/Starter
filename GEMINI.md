# Gemini Project Configuration

This file provides context for the Gemini AI assistant to understand and work with this project.

## Project Overview

This is a full-stack application with a React frontend and a FastAPI backend. The entire application is designed to be deployed via Docker.

## Tech Stack

### Frontend
- **Language:** TypeScript
- **Framework:** React
- **Build Tool:** Vite
- **State Management:** Redux Toolkit (RTK)
- **Styling:** Tailwind CSS

### Backend
- **Framework:** FastAPI (Python)
- **Package Management:** UV

### API & SDK
- **Specification:** OpenAPI
- **Automation:** The project aims to use OpenAPI to automatically generate the client-side SDK from the backend API specification.

### Deployment
- **Containerization:** Docker

## Common Commands

*This section will be updated as the project is developed.*

### Frontend
- **Install Dependencies:** `npm install`
- **Run Dev Server:** `npm run dev`
- **Build for Production:** `npm run build`

### Backend
- **Install Dependencies:** `uv pip install -r requirements.txt`
- **Run Dev Server:** `uvicorn main:app --reload`
