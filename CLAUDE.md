# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BI-agent is a React-based chat interface for interacting with Odoo ERP data through an AI assistant. Users can query business intelligence data (sales, inventory, customers) and generate reports via natural language conversations.

## Tech Stack

- **React 19** with TypeScript
- **Tailwind CSS** for styling (with @tailwindcss/typography)
- **Create React App** (react-scripts 5.0.1)
- **react-router-dom** for routing

## Commands

```bash
npm start     # Run development server on localhost:3000
npm test      # Run tests in interactive watch mode
npm run build # Production build to /build
```

## Architecture

### API Integration

- Backend API: `https://biagent.diyarbek.uz` (defined in `src/types/index.ts`)
- JWT authentication with token/refresh flow stored in localStorage
- SSE streaming for real-time AI responses (`/api/v1/sessions/stream/`)
- Falls back to standard POST if streaming unavailable

### Routing

Uses `react-router-dom` with two routes:
- `/` - New chat or landing page
- `/c/:sessionId` - Existing chat session

### Component Structure

```
src/
├── types/index.ts           # All TypeScript interfaces and constants
├── services/api.ts          # ApiService class - HTTP/SSE streaming logic
├── App.tsx                  # Main app with state management (~460 lines)
├── index.tsx                # Entry point
├── index.css                # Tailwind directives + custom component classes
├── components/
│   ├── Chat/
│   │   ├── ChatMessage.tsx      # Renders messages with Markdown
│   │   ├── ChatView.tsx         # Messages container with streaming
│   │   ├── MessageInput.tsx     # Text input with send button
│   │   ├── ThinkingIndicator.tsx # Shows AI processing steps
│   │   ├── FileAttachment.tsx   # PDF/file download links
│   │   └── CopyButton.tsx       # Copy message to clipboard
│   ├── Modals/
│   │   ├── AuthModal.tsx        # Login/register modal
│   │   └── ConfigModal.tsx      # Odoo settings modal
│   ├── Landing/
│   │   ├── WelcomeScreen.tsx    # Logged-out welcome page
│   │   └── EmptyState.tsx       # Empty chat with suggestions
│   ├── Sidebar/
│   │   ├── Sidebar.tsx          # Navigation container
│   │   ├── ChatHistory.tsx      # Session list
│   │   └── UserSection.tsx      # User profile/logout
│   └── Layout/
│       └── AppHeader.tsx        # Top header bar
```

### State Management

All state lives in `App.tsx` via useState hooks:
- Authentication: `isLoggedIn`, `token`, `username`
- Sessions: `sessions`, `currentSessionId`, `messages`
- Streaming: `streamingContent`, `isStreaming`, `thinkingSteps`
- Config: `config`, `configForm` (Odoo connection settings)

### Type Definitions

Core types defined in `src/types/index.ts`:
- `Message`, `Session`, `StreamChunk` - Data models
- `AuthResponse`, `OdooConfig`, `ConfigFormData` - API types
- Component props interfaces for all components
- `SUGGESTION_CARDS`, `API_BASE_URL`, `INITIAL_CONFIG_FORM` - Constants

### Streaming Implementation

The app uses SSE for real-time responses:
1. `sendMessage()` in App.tsx calls `ApiService.sendMessage()` with a chunk callback
2. `sendStreamingRequest()` reads SSE events and parses JSON payloads
3. Event types: `step_started`, `step_completed`, `react_thinking`, `react_action`, `react_observation`, `react_finishing`, `complete`
4. UI shows `ThinkingIndicator` during analysis, then streams markdown content

### Styling

- **Tailwind CSS** with custom theme in `tailwind.config.js`
- Custom colors: `primary` (#0f1419), `secondary` (#1a1f2e), `border` (#2d3748)
- Gradient: `bg-gradient-accent` (purple gradient)
- Component classes defined in `index.css`: `.btn-primary`, `.input-field`, `.modal-overlay`, etc.
- Dark mode overrides for `@uiw/react-markdown-preview`

### API Endpoints

```
POST /api/v1/token/              # Login, returns {access, refresh}
POST /api/v1/users/register/     # User registration
GET  /api/v1/sessions/           # List user's chat sessions
POST /api/v1/sessions/           # Create new session
GET  /api/v1/sessions/:id/       # Get session with messages
DELETE /api/v1/sessions/:id/     # Delete session
POST /api/v1/sessions/stream/    # SSE streaming message endpoint
POST /api/v1/sessions/send_message/  # Fallback non-streaming endpoint
GET  /api/v1/config/me/          # Get user's Odoo configuration
POST /api/v1/config/             # Create Odoo config
PATCH /api/v1/config/:id/        # Update Odoo config
```
