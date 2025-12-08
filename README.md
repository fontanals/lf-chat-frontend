# LF Chat Frontend

Web application for an AI chat interface similar to ChatGPT and Claude.ai. Users can have conversations with an AI assistant, create projects, and upload documents for context-aware responses using RAG (Retrieval-Augmented Generation).

## DEMO BRANCH

This branch is configured for a **live public demo** with a shared demo account.

The following features are **disabled** for security and demo purposes:

- **Signup**
- **Password Recovery**
- **Profile Update**
- **Account Deletion**

Live demo: https://lfchat.lucasfontana.dev

## Features

- **Real-time AI Chat**: Streaming conversations with AI assistant using Server-Sent Events (SSE)
- **Conversation Branching**: Edit and resend messages from any point in the conversation to explore different response paths while maintaining full conversation history in a tree structure
- **Project Organization**: Group related chats and documents into projects for better organization
- **Document Processing**: Upload PDF and TXT documents that can be processed and queried by the AI assistant for context-aware responses
- **Authentication**: Secure authentication with JWT tokens, including account verification and password recovery flows
- **Theme Support**: Light, dark, and system theme modes with Material Design 3
- **Internationalization**: Multi-language support using i18next
- **Responsive Design**: Mobile-friendly interface with sidebar navigation
- **Profile Management**: User settings, data management, and account deletion options
- **Docker Multi-Environment Setup**: Dedicated environment setups using Docker Compose
- **Automated Tests**: End-to-end tests using Playwright

## Technologies

- TypeScript
- React 19
- Vite 7
- Material-UI (MUI)
- TanStack React Query
- Zustand (State Management)
- React Router 7
- React Hook Form with Zod Validation
- i18next (Internationalization)
- React Markdown with Syntax Highlighting
- Playwright (E2E Testing)
- Docker
- Docker Compose
- CI with GitHub Actions

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose (or Node.js 22+ if running without Docker)
- Backend API running (see [lf-chat-backend](https://github.com/yourusername/lf-chat-backend))

## Environment Variables

1. Copy `.env.example` to `.env` for development and `.env.test` for test
2. Replace the placeholder values with your own

| Variable            | Description                                                     |
| ------------------- | --------------------------------------------------------------- |
| `VITE_SERVICE_TYPE` | Service type: `web` for API integration or `mock` for mock data |
| `VITE_API_BASE_URL` | Backend API base URL (e.g., `http://localhost:3001/api`)        |

## Running the Project

1. Install Docker
2. Clone the repository
3. Setup environment variables
4. Run one of the following commands:

```bash
# Development
docker compose up

# Test (for running Playwright tests)
docker compose --env-file .env.test -f docker-compose.test.yml up

# Production Build (using nginx)
docker compose -f docker-compose.prod.yml up
```

5. Open `http://localhost:5173` in your browser (or `http://localhost:5174` for test environment)

If you do not want to use Docker, you can have Node.js 22+ on your host machine instead:

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build
npm run preview
```

## Architecture

The application follows a **layered architecture** pattern:

```
Pages (Route Components)
    ↓
Layout Components (Sidebar, Auth Layout)
    ↓
Feature Components (Chat, Projects, Documents)
    ↓
Hooks (React Query + Business Logic)
    ↓
Services (HTTP Client + API Calls)
    ↓
State Management (Zustand Stores)
    ↓
Backend API
```

## Testing

The application uses **Playwright** for end-to-end testing:

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui
```

Tests are located in the `tests/` directory and cover:

- Authentication flows (signup, signin, verification, password recovery)
- Chat functionality (creating chats, sending messages, streaming responses)
- Project management (creating, editing, deleting projects)
- Document uploads and processing
- Profile management

## License

MIT
