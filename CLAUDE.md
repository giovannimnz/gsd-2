<!-- GSD:project-start source:PROJECT.md -->
## Project

**Projeto de Migração: GSD-2 → GSD-1**

**Core Value:** **Manter compatibilidade de comandos e projetos** entre gsd-2 e gsd-1, garantindo que:
- Comandos `/gsd-*` funcionem de forma equivalente
- Projetos iniciados no gsd-2 possam ser continuados no gsd-1
- Scripts e automações permaneçam funcionais
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Overview
## Runtime & Language
- **Runtime**: Node.js >= 22.0.0
- **Language**: TypeScript (ES Modules)
- **Package Manager**: npm 10.9.3
- **Module System**: ESM (`"type": "module"`)
## Core Frameworks & Libraries
### CLI Framework
- Custom CLI implementation in `src/cli.ts`
- Command routing system with subcommand support
- Bin entry: `dist/loader.js` (exposed as `gsd` and `gsd-cli`)
### Web Interface
- Next.js web application in `web/` directory
- API routes for project management
- Authentication system (login gate)
### Native Components
- Rust-based native modules in `native/` and `packages/native/`
- Cargo workspace for native tooling
- NAPI bindings for Node.js integration
### Workspace Packages (`packages/`)
| Package | Path | Purpose |
|---------|------|---------|
| daemon | `packages/daemon/` | Background service daemon |
| mcp-server | `packages/mcp-server/` | MCP protocol server |
| native | `packages/native/` | Native Rust bindings |
| pi-agent-core | `packages/pi-agent-core/` | Core agent functionality |
| pi-ai | `packages/pi-ai/` | AI model integrations |
| pi-coding-agent | `packages/pi-coding-agent/` | Coding agent implementation |
| pi-tui | `packages/pi-tui/` | Terminal UI components |
| rpc-client | `packages/rpc-client/` | RPC communication client |
## Build System
- TypeScript compilation with `tsconfig.json` variants
- Extension resources in `src/resources/`
- Distribution output in `dist/`
- Web build in `dist/web/`
## Key Dependencies
- **AI Integration**: Multiple model provider support (OpenAI, Anthropic, etc.)
- **Web Framework**: Next.js for web interface
- **UI Components**: React-based components
- **Testing**: Test suite in `src/tests/`
## Configuration Files
- `package.json` - Main project config with workspaces
- `tsconfig.json` - TypeScript configuration
- `.mcp.json` - MCP configuration
- `piConfig` in package.json defines config directory as `.gsd`
## Version
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## TypeScript Style
### Module System
- Use ES Modules (`import`/`export`)
- All files treated as modules (`"type": "module"`)
- Use `.js` extension in imports (Node.js ESM requirement)
### Naming Conventions
| Type | Pattern | Example |
|------|---------|---------|
| Files | kebab-case | `my-file.ts` |
| Components | PascalCase | `MyComponent.tsx` |
| Functions | camelCase | `doSomething()` |
| Constants | UPPER_SNAKE_CASE | `MAX_COUNT` |
| Types/Interfaces | PascalCase | `UserConfig` |
### Code Patterns
#### Agent Command Pattern
#### Service Pattern
#### Resource Loading
### Error Handling
- Use typed errors where possible
- Prefer early returns over nested ifs
- Log errors with context before throwing
### Comments
- JSDoc for public APIs
- Inline comments for complex logic only
- Avoid "what" comments, prefer "why"
## File Organization
### CLI Commands
- One command per file in `src/`
- Commands named after functionality (e.g., `web-mode.ts`)
- Export main function as default or named export
### Packages
- Each package has `src/` directory
- Package entry in `package.json` `"exports"`
- Tests co-located or in `tests/` subdirectory
### Web Components
- Page components in `web/app/`
- Shared components in `web/components/`
- API routes in `web/app/api/`
## Git Conventions
### Commit Messages
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `chore:` Maintenance
- `refactor:` Code restructuring
### Branching
- Main branch: `main`
- Feature branches: descriptive names
- GSD phases: `gsd/phase-{n}-{slug}`
## Testing
- Tests in `src/tests/` or `**/tests/`
- Integration tests use `.test.ts` suffix
- Test fixtures in `tests/fixtures/`
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## System Design
## High-Level Components
```
```
## Data Flow
### CLI Flow
### Web Flow
### Agent Flow
## Layer Boundaries
### Presentation Layer
- `src/cli.ts` - CLI interface
- `web/` - Web application
- `studio/` - Electron app (optional)
### Business Logic Layer
- `packages/pi-coding-agent/` - Coding agent logic
- `packages/pi-agent-core/` - Core agent abstractions
- `src/` - CLI command implementations
### Data Access Layer
- `packages/pi-ai/` - AI model integrations
- `packages/rpc-client/` - Communication layer
- `src/web/` - Web service clients
## Entry Points
| Entry Point | File | Purpose |
|-------------|------|---------|
| CLI | `dist/loader.js` | Main CLI entry |
| Web | `web/app/layout.tsx` | Next.js app entry |
| Native | `native/crates/` | Rust crate roots |
## Module Dependencies
- CLI depends on: agent-core, coding-agent
- Web depends on: project-discovery-service
- Agent packages depend on: pi-ai, rpc-client
- All depend on: native (optional)
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
