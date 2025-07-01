# ReadRelay Development Standards

## Project Overview

**ReadRelay** is a community-based book-sharing application targeting web, iOS, and Android platforms. The application uses Supabase as the primary backend service and follows a monorepo architecture with TypeScript for cross-platform development.

**Core Purpose**: Enable users to share physical books within local communities through digital coordination.

## Technology Stack Standards

### Mandatory Technology Choices

- **Backend**: Supabase (Database, Auth, Real-time, Storage, Edge Functions)
- **Language**: TypeScript for all platforms
- **Web Framework**: Next.js 14+ with App Router
- **Mobile Framework**: React Native with Expo
- **Package Manager**: pnpm
- **Monorepo Tool**: Turborepo
- **Styling**: Tailwind CSS (web), NativeWind (mobile)
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Supabase client (built-in)

### Prohibited Technologies

- **DO NOT** use Vercel or Netlify for deployment (use Supabase hosting)
- **DO NOT** use Redux or Context API for state management
- **DO NOT** use CSS-in-JS libraries (styled-components, emotion)
- **DO NOT** use GraphQL (use Supabase's PostgREST API)
- **DO NOT** use traditional REST API frameworks (Express, Fastify)

## Monorepo Structure Rules

### Required Directory Structure

```
readrelay/
├── apps/
│   ├── web/                 # Next.js web application
│   ├── mobile/              # React Native mobile app
│   └── admin/               # Admin dashboard (Future)
├── packages/
│   ├── shared/              # Shared business logic
│   ├── ui/                  # Shared UI components
│   ├── database/            # Supabase schema & migrations
│   └── config/              # Shared configurations
├── docs/                    # Technical documentation
├── scripts/                 # Build and deployment scripts
└── turbo.json              # Turborepo configuration
```

### File Coordination Rules

- **ALWAYS** update both `apps/web/package.json` and `apps/mobile/package.json` when adding shared dependencies
- **MUST** update `packages/shared/src/types/` when modifying Supabase schema
- **REQUIRED** to update both platform implementations when modifying shared components in `packages/ui/`
- **MANDATORY** to update `packages/database/migrations/` before modifying any database-related code

## Supabase Integration Standards

### Database Schema Rules

- **USE** Row Level Security (RLS) for all tables
- **ENFORCE** UUID primary keys for all user-facing tables
- **IMPLEMENT** soft deletes with `deleted_at` timestamp columns
- **REQUIRE** `created_at` and `updated_at` timestamps on all tables
- **USE** lowercase snake_case for all table and column names

### Authentication Standards

- **IMPLEMENT** Supabase Auth with email/password and OAuth providers
- **STORE** user profiles in separate `profiles` table linked to `auth.users`
- **USE** Supabase RLS policies for user data access control
- **IMPLEMENT** role-based access control with custom claims

### Real-time Features

- **ENABLE** real-time subscriptions for:
  - Chat messages between users
  - Book availability updates
  - Exchange request status changes
- **USE** Supabase channels for real-time data synchronization
- **IMPLEMENT** optimistic updates with rollback on failure

### Storage Implementation

- **STORE** book cover images in Supabase Storage
- **USE** CDN URLs for image delivery
- **IMPLEMENT** image compression and multiple size variants
- **ENFORCE** file size limits (max 5MB per image)

## Cross-Platform Development Rules

### Shared Code Standards

- **PLACE** all business logic in `packages/shared/`
- **EXPORT** reusable functions from `packages/shared/src/utils/`
- **DEFINE** all TypeScript interfaces in `packages/shared/src/types/`
- **IMPLEMENT** Supabase client configuration in `packages/shared/src/lib/supabase.ts`

### Platform-Specific Rules

#### Web Application (Next.js)
- **USE** Server Components for data fetching when possible
- **IMPLEMENT** ISR (Incremental Static Regeneration) for book listings
- **ENABLE** PWA capabilities with service worker
- **USE** Next.js Image component for optimized images

#### Mobile Application (React Native)
- **IMPLEMENT** deep linking for book sharing
- **USE** React Native Paper for consistent Material Design
- **INTEGRATE** camera functionality for ISBN scanning
- **IMPLEMENT** offline-first approach with local SQLite cache

## Feature Implementation Guidelines

### User Profile Management

- **STORE** minimal data in Supabase Auth
- **EXTEND** user data in custom `profiles` table
- **IMPLEMENT** avatar upload to Supabase Storage
- **ENABLE** privacy controls for profile visibility

### Book Management

- **INTEGRATE** Google Books API for automatic book data fetching
- **FALLBACK** to Open Library API if Google Books fails
- **CACHE** book metadata locally to reduce API calls
- **IMPLEMENT** manual book entry as backup option

### Location Services

- **USE** browser geolocation API (web) and expo-location (mobile)
- **STORE** approximate location (city/region) only for privacy
- **IMPLEMENT** radius-based search with PostGIS functions
- **NEVER** store exact GPS coordinates

### Messaging System

- **IMPLEMENT** real-time chat using Supabase real-time
- **STORE** messages with encryption at rest
- **ENABLE** message templates for common exchanges
- **IMPLEMENT** message status indicators (sent, delivered, read)

### Search and Discovery

- **USE** PostgreSQL full-text search for book titles/authors
- **IMPLEMENT** fuzzy matching for typo tolerance
- **CACHE** popular searches in Redis (Supabase Edge Functions)
- **ENABLE** filter combinations (genre, distance, condition)

## Code Organization Standards

### File Naming Conventions

- **USE** kebab-case for file and directory names
- **USE** PascalCase for React components
- **USE** camelCase for functions and variables
- **USE** SCREAMING_SNAKE_CASE for constants

### Component Structure

```typescript
// Required component structure
interface ComponentProps {
  // Props definition
}

export function ComponentName({ prop }: ComponentProps) {
  // Component implementation
}

export default ComponentName;
```

### API Layer Organization

- **DEFINE** all API functions in `packages/shared/src/api/`
- **GROUP** related functions in feature-based modules
- **IMPLEMENT** consistent error handling across all API calls
- **USE** TypeScript for all API function signatures

## Development Workflow Standards

### Database Changes

1. **CREATE** migration in `packages/database/migrations/`
2. **UPDATE** types in `packages/shared/src/types/database.ts`
3. **REGENERATE** Supabase types with CLI
4. **UPDATE** affected components in both platforms

### Feature Development

1. **START** with shared logic in `packages/shared/`
2. **IMPLEMENT** web version in `apps/web/`
3. **ADAPT** for mobile in `apps/mobile/`
4. **TEST** on both platforms before completion

### Git Workflow

- **USE** conventional commits (feat:, fix:, docs:, etc.)
- **CREATE** feature branches from `main`
- **REQUIRE** PR reviews for all changes
- **RUN** automated tests before merging

## Testing Standards

### Required Test Coverage

- **ACHIEVE** minimum 80% test coverage for shared packages
- **TEST** all Supabase RLS policies
- **IMPLEMENT** E2E tests for critical user journeys
- **USE** Jest for unit tests, Playwright for E2E

### Testing Tools

- **USE** Jest and React Testing Library for component tests
- **USE** Supabase local development for integration tests
- **IMPLEMENT** visual regression testing for UI components
- **USE** Detox for React Native E2E testing

## Security Standards

### Data Protection

- **IMPLEMENT** RLS policies for all user-generated content
- **ENCRYPT** sensitive data at application level
- **VALIDATE** all inputs using Zod schemas
- **SANITIZE** user-generated content to prevent XSS

### API Security

- **USE** Supabase service role key only in Edge Functions
- **IMPLEMENT** rate limiting for public endpoints
- **VALIDATE** user permissions on all data operations
- **LOG** security-relevant events for monitoring

## Performance Standards

### Web Performance

- **ACHIEVE** Lighthouse score >90 for all categories
- **IMPLEMENT** lazy loading for book images
- **USE** Next.js dynamic imports for code splitting
- **OPTIMIZE** bundle size with tree shaking

### Mobile Performance

- **MAINTAIN** 60fps for all animations
- **IMPLEMENT** image caching and optimization
- **USE** React Native Performance monitoring
- **OPTIMIZE** startup time to <3 seconds

## Deployment Standards

### Environment Configuration

- **USE** Supabase projects for staging and production
- **IMPLEMENT** environment-specific configurations
- **SECURE** API keys and secrets properly
- **ENABLE** preview deployments for PRs

### Platform Deployment

#### Web Deployment
- **DEPLOY** to Supabase hosting or Vercel
- **IMPLEMENT** automatic deployments from main branch
- **ENABLE** preview URLs for testing

#### Mobile Deployment
- **USE** Expo Application Services (EAS) for builds
- **IMPLEMENT** over-the-air updates for minor changes
- **MAINTAIN** separate staging and production builds

## AI Decision-Making Standards

### Priority Order for Implementation

1. **Supabase backend setup and schema**
2. **Web application with core features**
3. **Mobile application adaptation**
4. **Advanced features and optimizations**

### Conflict Resolution

- **PRIORITIZE** cross-platform compatibility over platform-specific optimizations
- **CHOOSE** Supabase solutions over third-party alternatives
- **FAVOR** TypeScript strictness over development speed
- **PREFER** tested patterns over experimental approaches

## Prohibited Actions

### Architecture Violations

- **NEVER** bypass Supabase RLS policies
- **NEVER** store sensitive data in localStorage
- **NEVER** implement custom authentication
- **NEVER** use different state management per platform

### Code Quality Violations

- **NEVER** commit code without TypeScript compilation
- **NEVER** ignore ESLint errors
- **NEVER** commit unformatted code
- **NEVER** push directly to main branch

### Security Violations

- **NEVER** expose service role keys in client code
- **NEVER** store API keys in version control
- **NEVER** implement user authentication without encryption
- **NEVER** allow unrestricted file uploads

This document serves as the authoritative guide for all ReadRelay development activities. All AI agents must strictly follow these standards to ensure consistency, security, and maintainability across the entire application ecosystem. 