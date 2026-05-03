# LF Chat Frontend

Web application for an AI chat interface similar to ChatGPT and Claude.ai. Users can have conversations with an AI assistant, create projects, and upload documents for context-aware responses using RAG (Retrieval-Augmented Generation).

## Features

- **Real-time AI Chat**: Streaming conversations with Server-Sent Events (SSE) and ability to cancel ongoing responses
- **Conversation Branching**: Edit and resend messages from any point to explore different response paths with full conversation history in a tree structure
- **AI Tool Transparency**: Visual indicators showing AI actions like document processing and reading
- **RAG (Retrieval-Augmented Generation)**: Upload and query PDF/TXT documents for context-aware AI responses
- **Project Organization**: Group related chats and documents into projects for better organization
- **Chat History**: Browse all conversations with infinite scroll pagination
- **JWT Authentication**: Secure authentication with email verification and password recovery flows
- **Profile Management**: Customizable user settings, display name, and custom AI prompts
- **Data Management**: Delete individual chats or bulk delete all conversation history
- **Theme Support**: Light, dark, and system-auto theme modes with Material Design 3
- **Internationalization**: Multi-language support using i18next
- **Responsive Design**: Mobile-friendly interface with collapsible sidebar navigation
- **Markdown Rendering**: Rich text display with syntax-highlighted code blocks
- **Automated Testing**: End-to-end tests with Playwright
- **Docker Multi-Environment**: Separate development and test environments with Docker Compose
- **CI/CD Pipelines**: Automated workflows with GitHub Actions

## Technologies

- **TypeScript** - Type-safe development
- **React** - UI library
- **Vite** - Fast build tool and dev server
- **Material-UI (MUI)** - Component library with Material Design 3
- **TanStack React Query** - Server state management and caching
- **Zustand** - Lightweight client state management
- **React Router** - Client-side routing
- **React Hook Form** - Performant form management
- **Zod** - Runtime schema validation
- **React Markdown** - Markdown rendering with syntax highlighting
- **i18next** - Internationalization framework
- **React Dropzone** - Drag-and-drop file uploads
- **Playwright** - End-to-end testing
- **ESLint** - Code linting and quality
- **Docker & Docker Compose** - Containerization
- **GitHub Actions** - CI/CD automation

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

## Demo

https://github.com/user-attachments/assets/8f78e671-8e94-459f-9cac-f2c22673ce07
