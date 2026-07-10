# Personal OS — Documentation

Single source of truth for the Personal Engineering Operating System.

## Map

| Section | Purpose |
|---|---|
| [VISION.md](./VISION.md) | Why this exists and where it is going |
| [PRODUCT.md](./PRODUCT.md) | What the product is — modules and behavior |
| [ROADMAP.md](./ROADMAP.md) | Phase plan and current status |
| [TECH_STACK.md](./TECH_STACK.md) | Technologies and versions in use |
| [CLAUDE.md](./CLAUDE.md) | How AI assistants should work in this repo |
| [roadmap/](./roadmap/) | One file per phase with scope and acceptance criteria |
| [architecture/](./architecture/) | System design: layers, database, UI system, standards |
| [decisions/](./decisions/) | Architecture Decision Records (ADRs) |
| [diagrams/](./diagrams/) | Mermaid diagrams: ERD, flows, integrations |
| [superpowers/specs/](./superpowers/specs/) | Working design documents per implementation session |

## Conventions

- Documentation is Markdown; diagrams are [Mermaid](https://mermaid.js.org/) so they render on GitHub.
- Every phase in `roadmap/` states **Goal, Scope, Out of scope, Acceptance criteria, Status**.
- Every ADR states **Context, Decision, Alternatives, Consequences, Status**.
- Update the relevant doc in the same commit as the change it describes.
