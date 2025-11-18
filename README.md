# Divino Maestro App

A modern web application for managing religious brotherhood operations, built with Next.js, TypeScript, and MongoDB.

## Overview

Divino Maestro App is a comprehensive management system designed for religious brotherhoods (hermandades). It provides tools for member management, event coordination, guard duty scheduling, and administrative tasks.

## Core Features

### Member Management (Socios)
- Complete member database with detailed profiles
- Member status tracking (aspirante, prueba, activo, honorario, baja, inactivo)
- Contact information and family data
- Historical records and notes

### Event Management
- Meeting minutes (Actas de Junta) with rich content
- Vigil (Vigilia) scheduling and management
- Attendance tracking for all events
- Document archiving and retrieval

### Guard Duty System (Guardias y Turnos)
- Shift scheduling and assignment
- Section-based organization
- Automated notifications
- Conflict resolution

### Financial Management
- Member dues (Cuotas) tracking
- Payment status monitoring
- Financial reporting
- Payment history

### Authentication & Authorization
- Secure email/password authentication
- Role-based access control
- Session management
- Protected routes and API endpoints

### Internationalization
- Multi-language support (English/Spanish)
- Easy language switching
- Localized content throughout the app

## Tech Stack

- **Runtime**: Node.js 22 LTS
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS 3.4
- **Authentication**: Custom JWT-based (bcryptjs + jose)
- **Database**: MongoDB with Mongoose 8.9 ODM
- **Validation**: Zod 3.24
- **Testing**: Jest 29 + Playwright
- **Code Quality**: ESLint 9 + Prettier 3.4

## Quick Start

### Prerequisites

- Node.js 22.x LTS or higher
- npm 10.x or higher
- MongoDB (local or cloud instance)

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/divino-maestro
JWT_SECRET=your-secret-key-here-min-32-characters
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Start the development server:**

```bash
npm run dev
```

4. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

### Development
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix ESLint errors
- `npm run typecheck` - TypeScript type checking

### Testing
- `npm test` - Run unit tests (Jest)
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests (Playwright)
- `npm run test:e2e:ui` - Run e2e tests with UI mode
- `npm run test:all` - Run all checks (lint + tests + build)

## Project Structure

```
divino-maestro-app/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authentication pages (login, register)
│   ├── dashboard/           # Protected dashboard
│   └── api/                 # API routes
├── components/              # React components
│   ├── common/             # Shared components (Logo, etc.)
│   ├── forms/              # Form components (LoginForm, RegisterForm)
│   ├── layouts/            # Layout components
│   └── ui/                 # Reusable UI primitives
├── lib/                    # Utility libraries
│   ├── auth/               # Authentication configuration
│   ├── database/           # Database models and connection
│   │   └── models/         # Mongoose models
│   └── utils/              # Helper functions and validators
├── i18n/                   # Internationalization configuration
├── messages/               # Translation files (en.json, es.json)
├── types/                  # TypeScript type definitions
├── __tests__/              # Unit tests
├── e2e/                    # End-to-end tests
└── docs/                   # Additional documentation
```

## Documentation

For detailed information about specific topics, see the `/docs` folder:

- **[Database Setup](./docs/database-setup.md)** - MongoDB configuration and schema details
- **[Testing Guide](./docs/testing.md)** - Comprehensive testing documentation
- **[Development Guide](./CLAUDE.md)** - Guide for AI assistants and developers

## Key Features Explained

### Database Models

The application uses the following main models:

- **User** - Authentication users
- **Account** - OAuth and credential accounts
- **Session** - User sessions
- **Socio** - Brotherhood members
- **ActaJunta** - Meeting minutes
- **Vigilia** - Vigil events
- **GuardiaTurno** - Guard duty assignments
- **Asistencia** - Attendance records
- **Cuota** - Member dues/payments
- **Seccion** - Organizational sections

### Authentication Flow

1. User registers/logs in via custom JWT authentication
2. Credentials validated and JWT token created
3. Token stored in secure HTTP-only cookie
4. Middleware protects routes and redirects as needed
5. User accesses protected resources

### Middleware Protection

Routes are automatically protected:
- `/dashboard/*` - Requires authentication
- `/login`, `/register` - Redirects if already authenticated
- Public routes accessible to all

## Development Workflow

### Before Making Changes

```bash
# Type check
npm run typecheck

# Run linter
npm run lint
```

### During Development

```bash
# Start dev server
npm run dev

# In another terminal, run tests in watch mode
npm run test:watch
```

### Before Committing

```bash
# Run all checks (required to pass)
npm run test:all
```

This runs: ESLint → Unit Tests → E2E Tests → Production Build

## Environment Variables

Required variables for `.env.local`:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/divino-maestro` |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | `your-secret-key-change-in-production` |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `http://localhost:3000` |

**Important:** Never commit `.env.local` to version control!

## Code Quality Standards

### TypeScript
- Strict mode enabled
- No unused variables or parameters
- Comprehensive type coverage

### ESLint
- Next.js recommended rules
- TypeScript strict rules
- Prettier integration
- Console.log warnings (use console.warn/error)

### Testing
- 50% minimum code coverage
- Unit tests for all components
- E2E tests for critical flows
- All tests must pass before deployment

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Server-side rendering for initial page load
- Optimized bundle splitting
- Image optimization
- Code splitting with dynamic imports

## Security

- Secure session cookies (HTTP-only, SameSite)
- CSRF protection
- Input validation with Zod
- Password hashing via bcryptjs
- Environment variable protection
- XSS prevention

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run `npm run test:all` to ensure all checks pass
4. Commit your changes
5. Create a pull request

## Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Ensure MongoDB is running
- Check MONGODB_URI in `.env.local`
- Verify network connectivity

**Tests Failing**
- Clear Jest cache: `npm test -- --clearCache`
- Check test output for specific errors
- Ensure all dependencies are installed

**Build Failing**
- Run `npm run typecheck` to find type errors
- Run `npm run lint:fix` to auto-fix linting issues
- Check for missing environment variables

For more troubleshooting tips, see [CLAUDE.md](./CLAUDE.md).

## License

Private project - All rights reserved

## Support

For issues or questions, please check the documentation in the `/docs` folder or refer to the development guide in `CLAUDE.md`.
