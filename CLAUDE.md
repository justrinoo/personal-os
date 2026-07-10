# CLAUDE.md

# Personal Engineering OS

> AI Development Guide

# Vision

Build a **Personal Engineering Operating System (Personal OS)** that becomes the single source of truth for my daily work, software development lifecycle, project management, deployment history, monitoring, documentation, learning, and personal productivity.

This application is intended for long-term personal use and should be designed to scale into a complete engineering workspace.

The application should prioritize:

- Simplicity
- Performance
- Clean Architecture
- Excellent User Experience
- Extensibility
- Automation
- Reusability

Claude should always think long-term when generating code.

---

# Project Goals

This system should allow me to:

- Manage daily activities
- Track all software projects
- Track every development task
- Synchronize with ClickUp
- Connect GitHub repositories
- Monitor deployments
- Monitor production environments
- Store documentation
- Write journals
- Track habits
- Track learning
- Analyze productivity
- Generate reports

Everything should be connected together.

---

# Core Philosophy

Every piece of data should be connected.

```
Workspace
    │
    ▼
Client
    │
    ▼
Project
    │
    ▼
Sprint
    │
    ▼
Feature
    │
    ▼
Task
    │
    ▼
ClickUp Ticket
    │
    ▼
Git Branch
    │
    ▼
Commit
    │
    ▼
Pull Request
    │
    ▼
Deployment
    │
    ▼
Monitoring
    │
    ▼
Incident
    │
    ▼
Fix
    │
    ▼
Documentation
    │
    ▼
Report
```

Never build isolated modules.

Always think relationally.

---

# Primary Modules

## Dashboard

- Daily Overview
- Active Projects
- Open Tasks
- Sprint Progress
- Recent Deployments
- System Health
- Productivity Metrics

---

## Workspace

Represents work environments.

Examples:

- Office
- Freelance
- Personal
- Open Source

Each workspace contains:

- Projects
- Teams
- Documentation
- Activity Timeline

---

## Clients

Relationship:

```
Workspace
    ↓
Client
    ↓
Projects
```

---

## Projects

Every project includes:

- Information
- Members
- Repository
- Documentation
- Features
- Tasks
- Deployments
- Monitoring
- Timeline

---

## Features

Examples:

- Authentication
- Payment
- Dashboard
- Inventory
- Reports

Each Feature has:

- Status
- Progress
- Priority
- Sprint
- Linked Tickets
- Linked Commits
- Linked Deployments

---

## Tasks

### Types

- Development
- Bug
- Research
- Meeting
- Documentation
- Testing
- Deployment

### Status

- Backlog
- Planning
- Ready
- Development
- Review
- Testing
- Done
- Archived

---

## Daily Activities

Track everything I do.

Examples:

- Coding
- Meeting
- Learning
- Reading
- Research
- Workout
- Writing
- Gaming

Each activity stores:

- Time
- Duration
- Category
- Project
- Notes
- Mood
- Productivity

---

## ClickUp Integration

Sync:

- Spaces
- Folders
- Lists
- Tasks
- Status
- Priorities
- Comments

Rules:

- Do not duplicate data unnecessarily.
- Store external IDs.

---

## Git Integration

Track:

- Repository
- Branch
- Commit
- Pull Request
- Release

Allow future GitHub API integration.

---

## Deployment

Track deployment history.

Environment:

- Local
- Development
- Staging
- Production

Each deployment stores:

- Version
- Commit
- Release Notes
- Environment
- Success Status
- Rollback

---

## Monitoring

Monitor:

- Server
- API
- Queue
- Cron Jobs
- Database
- CPU
- Memory
- Error Logs
- Uptime

---

## Documentation

Markdown-based documentation.

Categories:

- API
- Architecture
- Meeting Notes
- SOP
- Troubleshooting
- Knowledge Base

---

## Journal

### Morning

- Goals
- Focus

### Night

- Reflection
- Wins
- Problems
- Lessons
- Tomorrow

---

## Learning

Track:

- Courses
- Books
- Videos
- Technologies
- Certifications

---

## Habits

Track daily habits.

Examples:

- Workout
- Reading
- Coding
- Sleep
- Water Intake

---

## Reports

Generate:

- Daily Report
- Weekly Report
- Monthly Report
- Yearly Report

Reports should include charts and summaries.

---

# Technical Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

## Backend

- Next.js Route Handlers
- Server Actions

## Database

- PostgreSQL
- Prisma ORM

## Authentication

- Better Auth

## Storage

- Supabase Storage

## State Management

- Zustand

## Forms

- React Hook Form

## Validation

- Zod

## Charts

- Recharts

## Markdown

- MDX

## Deployment

- Docker
- Coolify

## Monitoring

- Grafana
- Prometheus
- Uptime Kuma

---

# Architecture Principles

Follow:

- Feature-first architecture
- Modular architecture
- Domain-driven folder structure
- Reusable components
- Separation of concerns
- SOLID
- DRY
- KISS

Avoid:

- God Components
- Business logic inside UI
- Duplicate logic
- Deep prop drilling
- Large utility files

---

# Folder Structure

```
app/
components/
features/
actions/
services/
repositories/
lib/
hooks/
schemas/
types/
store/
utils/
constants/
prisma/
docs/
```

---

# Database Design

Prefer normalized database design.

Every entity should have:

- id
- createdAt
- updatedAt

Relationships should use foreign keys.

Never duplicate data if relationships exist.

---

# UI Principles

Design should be:

- Modern
- Minimal
- Responsive
- Fast
- Clean
- Dashboard-oriented

Prefer:

- Cards
- Tables
- Timeline
- Kanban
- Charts
- Calendar
- Activity Feed

Avoid unnecessary animations.

---

# Coding Standards

Always:

- Use TypeScript
- No `any`
- Explicit interfaces
- Strict typing
- Reusable hooks
- Reusable components

Prefer:

- Server Components
- Server Actions

Use React Query only if necessary.

Use Zod for validation.

---

# API Standard

```json
{
  "data": {},
  "error": null,
  "status": 200
}
```

Errors should always be typed.

---

# Naming Convention

| Item | Convention |
|------|------------|
| Components | PascalCase |
| Hooks | useSomething |
| Utilities | camelCase |
| Database Tables | snake_case |
| Variables | camelCase |
| Constants | UPPER_SNAKE_CASE |

---

# Development Workflow

```text
Idea
  ↓
Planning
  ↓
Design
  ↓
Development
  ↓
Testing
  ↓
Review
  ↓
Deployment
  ↓
Monitoring
  ↓
Improvement
```

Claude should understand where each feature belongs in this lifecycle.

---

# Before Writing Code

Claude should always:

1. Understand the business goal.
2. Reuse existing components.
3. Check existing database models.
4. Avoid duplicate logic.
5. Keep code modular.
6. Consider scalability.
7. Think about future integrations.

---

# Future Integrations

- ClickUp API
- GitHub API
- GitLab API
- Jira
- Slack
- Discord
- Google Calendar
- Google Drive
- Telegram
- OpenAI
- Anthropic
- n8n
- Grafana
- Prometheus
- Uptime Kuma
- Docker
- Kubernetes
- Cloudflare

---

# AI Rules

Claude should act as a **Senior Software Engineer**, **Solution Architect**, and **Technical Product Owner**.

When implementing a feature:

- Understand the business process first.
- Explain architectural decisions when necessary.
- Prefer maintainability over shortcuts.
- Generate production-ready code.
- Never overengineer simple features.
- Always think about scalability and future integrations.
- Keep documentation updated when the architecture changes.
- Prefer clean, readable, and reusable code over clever code.

The AI should optimize for **long-term maintainability** rather than the fastest possible implementation.
