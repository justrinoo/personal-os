# Entity Relationship Diagram

Current schema (`prisma/schema.prisma`, migration `20260710141246_init`).
Regenerate this diagram whenever the schema changes.

```mermaid
erDiagram
    Workspace ||--o{ Client : "has"
    Workspace ||--o{ Project : "has"
    Client ||--o{ Project : "owns (optional)"
    Project ||--o{ Sprint : "has"
    Project ||--o{ Feature : "has"
    Project ||--o{ Task : "has (optional link)"
    Project ||--o{ DailyActivity : "tagged in (optional)"
    Project ||--o{ Deployment : "has"
    Sprint ||--o{ Feature : "contains (optional)"
    Sprint ||--o{ Task : "contains (optional)"
    Feature ||--o{ Task : "contains (optional)"
    Habit ||--o{ HabitLog : "logs"

    Workspace {
        string id PK
        string name
        WorkspaceType type
        string description "nullable"
    }
    Client {
        string id PK
        string workspaceId FK
        string name
        string email "nullable"
        string company "nullable"
    }
    Project {
        string id PK
        string workspaceId FK
        string clientId FK "nullable"
        string name
        ProjectStatus status
        string repositoryUrl "nullable"
    }
    Sprint {
        string id PK
        string projectId FK
        string name
        SprintStatus status
        datetime startDate
        datetime endDate
    }
    Feature {
        string id PK
        string projectId FK
        string sprintId FK "nullable"
        string name
        FeatureStatus status
        Priority priority
        int progress "0-100"
    }
    Task {
        string id PK
        string projectId FK "nullable"
        string featureId FK "nullable"
        string sprintId FK "nullable"
        string title
        TaskType type
        TaskStatus status
        Priority priority
        datetime dueDate "nullable"
        string clickupId UK "nullable"
        string gitBranch "nullable"
    }
    DailyActivity {
        string id PK
        string projectId FK "nullable"
        string title
        ActivityCategory category
        datetime date
        int durationMin
        int mood "1-5 nullable"
        int productivity "1-5 nullable"
    }
    Deployment {
        string id PK
        string projectId FK
        string version
        DeployEnvironment environment
        string commitHash "nullable"
        boolean success
        boolean rolledBack
        datetime deployedAt
    }
    JournalEntry {
        string id PK
        JournalType type "MORNING|NIGHT"
        datetime date
        string goals "nullable"
        string focus "nullable"
        string reflection "nullable"
        string wins "nullable"
        string problems "nullable"
        string lessons "nullable"
        string tomorrow "nullable"
    }
    Habit {
        string id PK
        string name
        int targetDays "per week"
        boolean isActive
    }
    HabitLog {
        string id PK
        string habitId FK
        datetime date "unique per habit"
        boolean completed
    }
```

## Delete behavior

- Cascade: Workspace → Clients/Projects; Project → Sprints/Features/Deployments; Habit → HabitLogs
- SetNull (link breaks, row survives): Client→Project, Sprint/Feature/Project→Task, Project→DailyActivity
- Every table also carries `createdAt` / `updatedAt` (omitted above for brevity).
