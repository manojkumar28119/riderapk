# SuperNova

A modern fleet management application built with React, TypeScript, and Vite.

## Quick Start

**Prerequisites:** Node.js v18+, npm or yarn

`ash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build:prod
`

## Tech Stack

- React 19 + TypeScript
- Vite 7 + TailwindCSS
- React Router v6
- React Hook Form + Zod
- TanStack Query
- Zustand
- Axios
- Radix UI components

## Features

- JWT authentication
- Responsive design
- Type-safe codebase
- Environment configuration

## Scripts

- `npm run dev` - Development server
- `npm run qa` - QA environment
- `npm run build:dev/qa/prod` - Build for specific environment
- `npm run preview` - Preview production build

## Project Structure

`
src/
+-- app/                # Application core
+-- assets/             # Static assets
+-- components/         # UI components
+-- config/             # Environment config
+-- data/               # Data management
+-- features/           # Feature modules
+-- hooks/              # Custom hooks
+-- lib/                # Utilities
+-- services/           # API services
+-- styles/             # Global styles
`

## Environment

Configuration in src/config/ directory:
- .env.development
- .env.qa
- .env.production
