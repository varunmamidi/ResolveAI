# ResolveAI — AI-Powered Customer Support Platform

ResolveAI is a full-stack customer support platform that combines traditional ticket management with AI-assisted knowledge retrieval and real-time human support.

The application uses role-based authentication, PostgreSQL vector search, Gemini-powered RAG, and Socket.IO to support customer service workflows.

## Tech Stack

**Frontend:** React, TypeScript, Vite, Axios, React Router, Socket.IO Client

**Backend:** Node.js, Express.js, TypeScript, Sequelize ORM, Socket.IO

**Database:** PostgreSQL, pgvector

**AI:** Google Gemini, Retrieval-Augmented Generation (RAG), Vector Embeddings

**Security:** JWT Authentication, Role-Based Access Control (RBAC)

**Tools:** Docker, Swagger/OpenAPI, Git, GitHub

## Key Features

- User registration and secure JWT login
- Role-based access for ADMIN, AGENT, and CUSTOMER
- Customer support ticket creation and management
- Knowledge base CRUD operations
- Semantic knowledge retrieval using pgvector
- Gemini-powered AI support integration
- AI-to-human escalation workflow
- Admin-controlled agent assignment
- Real-time customer–agent messaging using Socket.IO
- Persistent conversation history in PostgreSQL
- Role-specific support dashboard
- REST API documentation using Swagger

## Architecture

```text
React + TypeScript
       |
       | REST API / Socket.IO
       v
Express.js + TypeScript
       |
       +-- JWT Authentication & RBAC
       +-- Ticket Management
       +-- Knowledge Base
       +-- Escalation Management
       +-- Real-Time Chat
       |
       +-- RAG Service
       |      |
       |      +-- Gemini Embeddings
       |      +-- pgvector Similarity Search
       |      +-- Gemini Answer Generation
       |
       v
PostgreSQL + pgvector
```

## Getting Started

### Prerequisites

- Node.js
- Docker Desktop
- npm
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ResolveAI.git
cd ResolveAI
```

### 2. Configure Environment Variables

Create environment files using the supplied `.env.example` templates.

Configure PostgreSQL credentials, JWT secret, and Gemini API key.

### 3. Start PostgreSQL

```bash
docker compose up -d
```

### 4. Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend: `http://localhost:5000`

Swagger documentation: `http://localhost:5000/api-docs`

### 5. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

### 6. Initialize Knowledge Embeddings

After creating knowledge articles, run:

```bash
cd backend
npx ts-node src/scripts/index-knowledge.ts
```

## User Roles

| Role | Responsibilities |
|---|---|
| CUSTOMER | Create tickets, ask AI questions, request human support, chat with agents |
| AGENT | View assigned escalations, communicate with customers, resolve support issues |
| ADMIN | Manage support tickets, assign agents, oversee escalations |

## AI Support Workflow

1. Customer submits a question.
2. Gemini converts the question into an embedding.
3. pgvector retrieves semantically relevant knowledge articles.
4. Retrieved articles are supplied as context for answer generation.
5. If human assistance is needed, the customer can request escalation.
6. An admin assigns an agent.
7. Customer and agent communicate through Socket.IO.

## Current Limitations

- Gemini chat generation may be temporarily unavailable due to provider-side capacity errors.
- Human escalation is currently initiated through a dedicated support request rather than automatic transfer.
- The application is configured for local development and has not yet been production deployed.

## Future Improvements

- Automatic AI-to-human handoff
- Production deployment and monitoring
- Automated integration tests
- Advanced agent analytics

## Project Purpose

ResolveAI demonstrates practical full-stack development, database integration, secure API design, generative AI integration, and real-time communication in a customer support application.
