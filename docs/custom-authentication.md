# Custom Authentication System

This document describes the custom JWT-based authentication system implemented in the Divino Maestro application.

## Overview

The application uses a custom authentication system built with:
- **JWT (JSON Web Tokens)** for session management
- **bcryptjs** for password hashing
- **jose** library for JWT signing and verification
- **HTTP-only cookies** for secure token storage
- **Mongoose** for database integration

This replaced the previous BetterAuth implementation for better control and simpler integration.

## Architecture

### Core Components

1. **Password Management** (`lib/auth/password.ts`)
   - Password hashing with bcrypt
   - Password verification
   - Password strength validation

2. **JWT Management** (`lib/auth/jwt.ts`)
   - Token creation and signing
   - Token verification and decoding
   - Session cookie management
   - Token refresh functionality

3. **Authentication Functions** (`lib/auth/index.ts`)
   - User registration (`signUp`)
   - User login (`signIn`)
   - User logout (`signOut`)
   - Get current user (`getCurrentUser`)

4. **Client-Side Hook** (`lib/auth/useSession.ts`)
   - React hook for session management
   - Fetches session from API
   - Manages loading and error states

## API Routes

### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### POST /api/auth/login

Authenticate user and create session.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

Sets HTTP-only cookie: `session`

### POST /api/auth/logout

Clear user session.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### GET /api/auth/session

Get current authenticated user.

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

## Usage Examples

### Server-Side (Server Components, API Routes)

```typescript
import { getCurrentUser } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return <div>Welcome, {user.name}!</div>;
}
```

### Client-Side (Client Components)

```typescript
'use client';

import { useSession } from '@/lib/auth/useSession';

export function UserProfile() {
  const { data, loading, error } = useSession();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading session</div>;
  if (!data?.user) return <div>Not logged in</div>;

  return <div>Welcome, {data.user.name}!</div>;
}
```

### Middleware Protection

Routes are protected in `middleware.ts`:

```typescript
const protectedRoutes = ['/dashboard', '/settings', '/profile'];
const authRoutes = ['/login', '/register'];

// Redirects to login if not authenticated
// Redirects to dashboard if already authenticated
```

## Security Features

1. **Password Hashing**: bcrypt with salt rounds (10)
2. **HTTP-Only Cookies**: Prevents XSS attacks
3. **Secure Cookies**: HTTPS-only in production
4. **SameSite Strict**: CSRF protection
5. **JWT Expiry**: 7-day token lifetime
6. **Password Validation**: Enforces strong passwords

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## Configuration

### Environment Variables

```env
# JWT secret for signing tokens (min 32 characters)
JWT_SECRET=your-secret-key-min-32-characters-long

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### JWT Configuration

```typescript
// lib/auth/jwt.ts
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const expiresIn = '7d'; // 7 days
```

## Testing

### Manual Testing Script

Use the provided `test-auth.sh` script:

```bash
chmod +x test-auth.sh
./test-auth.sh
```

Tests:
1. User registration
2. User login
3. Session retrieval
4. User logout
5. Session cleared after logout

### Unit Tests

Mock the `useSession` hook in tests:

```typescript
// jest.setup.ts
jest.mock('@/lib/auth/useSession', () => ({
  useSession: () => ({
    data: { user: { id: '1', email: 'test@example.com', name: 'Test User' } },
    loading: false,
    error: null,
  }),
}));
```

## Migration from BetterAuth

The custom authentication system replaced BetterAuth. Key differences:

| Feature | BetterAuth | Custom Auth |
|---------|-----------|-------------|
| Session Storage | MongoDB + Cookies | JWT + Cookies |
| Password Hashing | Built-in | bcryptjs |
| Token Type | Opaque tokens | JWT |
| Database Queries | Every request | Once at login |
| Client Hook | `useSession` from better-auth | Custom `useSession` |
| Complexity | Higher | Lower |

## Troubleshooting

### "Unauthorized" errors

- Check if JWT_SECRET is set in `.env.local`
- Verify cookie is being sent with requests
- Check token hasn't expired (7 days max)

### Login fails

- Verify password meets requirements
- Check user exists in database
- Ensure MongoDB is connected

### Session not persisting

- Check cookie settings in browser
- Verify HTTPS in production
- Check SameSite cookie settings

## Future Enhancements

- [ ] Email verification
- [ ] Password reset flow
- [ ] Two-factor authentication (2FA)
- [ ] Session refresh tokens
- [ ] OAuth providers (Google, GitHub)
- [ ] Rate limiting
- [ ] Account lockout after failed attempts

---

**Last Updated**: 2025-01-17
