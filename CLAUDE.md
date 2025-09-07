# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 dashboard application called "Tech Studio" built with TypeScript and modern React patterns. It serves as an e-commerce admin dashboard with authentication, product management, order processing, and various business management features.

## Common Commands

```bash
# Development
pnpm dev          # Start development server on localhost:3000

# Production build
pnpm build        # Build the application for production
pnpm start        # Start production server

# Code quality
pnpm lint         # Run ESLint to check code quality
```

## Architecture & Structure

### App Router Structure
- Uses Next.js App Router with TypeScript
- Main layouts: `src/app/layout.tsx` (root) and `src/app/(dashboard)/layout.tsx` (dashboard)
- Route groups: `(auth)` for authentication pages, `(dashboard)` for main application

### Key Directories
- `src/app/actions/` - Server actions for data fetching and mutations
- `src/components/ui/` - Reusable UI components built with Radix UI and shadcn/ui
- `src/components/layouts/` - Layout components (Sidebar, Header, etc.)
- `src/lib/` - Utilities, schemas, and configuration
- `src/services/` - Authentication configuration

### State Management & Data Fetching
- Uses TanStack Query for server state management
- Server actions pattern for data mutations
- NextAuth.js for authentication with custom credentials provider

### Styling & UI
- Tailwind CSS for styling with custom configuration
- Radix UI primitives with shadcn/ui components
- Theme support with next-themes
- Framer Motion for animations

### Authentication Flow
- NextAuth.js with credentials provider
- Custom sign-in at `/signin`
- JWT tokens stored in session
- Session management through `src/lib/auth.ts` and `src/services/auth.ts`

### Backend Integration
- Server actions communicate with external API at `BASE_URL`
- Actions organized by domain (auth, products, orders, etc.)
- Error handling with try/catch patterns

## Development Notes

- Uses strict TypeScript configuration
- Path aliases configured: `@/*` maps to `./src/*`
- Package manager: pnpm (specified in package.json)
- Image optimization configured for all external domains
- Uses React 19 and modern React patterns