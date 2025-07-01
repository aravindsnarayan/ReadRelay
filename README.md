# ReadRelay

A community-based book-sharing application for web, iOS, and Android platforms using Supabase backend.

## Project Structure

This is a monorepo built with Turborepo and pnpm workspaces:

```
readrelay/
├── apps/
│   ├── web/                 # Next.js web application
│   └── mobile/              # React Native mobile app
├── packages/
│   ├── shared/              # Shared business logic and utilities
│   ├── ui/                  # Shared UI components
│   ├── database/            # Supabase schema & migrations
│   └── config/              # Shared configurations
├── docs/                    # Technical documentation
└── scripts/                 # Build and deployment scripts
```

## Technology Stack

- **Backend**: Supabase (Database, Auth, Real-time, Storage, Edge Functions)
- **Language**: TypeScript for all platforms
- **Web Framework**: Next.js 14+ with App Router
- **Mobile Framework**: React Native with Expo
- **Package Manager**: pnpm
- **Monorepo Tool**: Turborepo
- **Styling**: Tailwind CSS (web), NativeWind (mobile)
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation

## Prerequisites

- Node.js 18.17.0 or higher
- pnpm 8.0.0 or higher
- Git

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ReadRelay
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Build all packages**

   ```bash
   pnpm build
   ```

4. **Run type checking**
   ```bash
   pnpm type-check
   ```

## Available Scripts

- `pnpm build` - Build all packages
- `pnpm dev` - Start development mode for all apps
- `pnpm lint` - Lint all packages
- `pnpm test` - Run tests for all packages
- `pnpm type-check` - Type check all packages
- `pnpm clean` - Clean build artifacts
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## Development Workflow

1. Create a feature branch from `main`
2. Make your changes following the project standards in `shrimp-rules.md`
3. Run `pnpm build` and `pnpm type-check` to ensure everything compiles
4. Commit your changes (pre-commit hooks will run automatically)
5. Push and create a pull request

## Packages

### @readrelay/shared

Shared business logic, API clients, and utilities used across platforms.

### @readrelay/ui

Cross-platform UI component library with Tailwind CSS support.

### @readrelay/database

Supabase database schema, migrations, and type definitions.

### @readrelay/config

Shared configurations for TypeScript, ESLint, and other tools.

## Project Standards

Refer to `shrimp-rules.md` for comprehensive development standards including:

- Architecture guidelines
- Code organization rules
- Security requirements
- Testing standards
- Deployment procedures

## Contributing

Please read `shrimp-rules.md` before contributing to ensure compliance with project standards.

## License

[Add license information here]
