# DevArcAi

An intelligent System Design assistant that provides tailored explanations and architecture insights based on technical documentation.

## Overview

DevArcAi is an AI-powered learning platform built for junior developers who want to master system design. It offers personalized guidance on distributed systems, scalability patterns, and real-world architecture through an interactive chat interface.

## Features

- **AI-Powered Chat**: Interactive conversations with an AI mentor specialized in system design
- **Documentation-Based Answers**: Responses grounded in uploaded technical documentation
- **Persistent Chat History**: Conversations saved per user with localStorage
- **Admin Dashboard**: Secure document upload and management interface
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark Theme**: Modern navy-themed UI with smooth animations

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui components

**Backend:**
- Node.js
- Express
- SQLite (user management)
- ChromaDB (vector storage)
- Google Gemini API (AI responses)

## Project Structure

```
dev-entrance-project/
├── client/                 # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── contexts/          # Auth context
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities & API
│   ├── types/             # TypeScript types
│   └── public/            # Static assets
│
├── server/                # Express backend
│   ├── src/
│   │   ├── config/        # Database config
│   │   ├── controllers/   # Auth controllers
│   │   ├── middlewares/   # Auth middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # LLM service
│   └── chroma_data/       # Vector DB storage
│
└── knowledge-base/        # Documentation storage
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dev-entrance-project
   ```

2. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Set up environment variables**

   Create `server/.env`:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ADMIN_SECRET_KEY= DevArchAIAdmin
   ```

5. **Start the development servers**

   Backend:
   ```bash
   cd server
   npm run dev
   ```

   Frontend (new terminal):
   ```bash
   cd client
   npm run dev
   ```

6. **Open the application**
   
   Visit `http://localhost:3001`

## Usage

### Regular Users
- Sign up or log in to access the chat interface
- Ask questions about system design concepts
- View chat history across sessions

### Admin Users
- Access `/admin` with admin credentials
- Upload PDF documentation to enhance AI responses
- Manage uploaded documents

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | User registration |
| `/api/auth/login` | POST | User authentication |
| `/api/auth/me` | GET | Get current user |
| `/api/auth/logout` | POST | User logout |
| `/api/chat` | POST | Send message to AI |
| `/api/admin/upload` | POST | Upload documents |
| `/api/admin/documents` | GET/DELETE | Manage documents |

## Key Components

- **Hero Section**: Landing page with CTA and chat preview
- **About Section**: Platform overview and features
- **Chat Panel**: Real-time AI conversation interface
- **Navbar**: Navigation with auth state
- **Admin Dashboard**: Document management interface

## Authentication

- JWT-based authentication
- HTTP-only cookies for security
- Role-based access (user/admin)
- Protected routes middleware

## AI Integration

- Google Gemini API for responses
- ChromaDB for vector similarity search
- Document chunking and embedding
- Context-aware responses based on uploaded docs

## License

MIT License

## Author

Built as a CSEC ASTU enterance project within 5 days!!!.
