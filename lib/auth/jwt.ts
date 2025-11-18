import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables');
}

const secret = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  userId: string;
  email: string;
  name?: string;
  expiresAt: Date;
}

/**
 * Create a JWT token for a user session
 * @param payload - User session data
 * @returns Signed JWT token
 */
export async function createToken(
  payload: Omit<SessionPayload, 'expiresAt'>
): Promise<string> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  const token = await new SignJWT({
    ...payload,
    expiresAt: expiresAt.toISOString(),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  return token;
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export async function verifyToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string | undefined,
      expiresAt: new Date(payload.expiresAt as string),
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Set the session cookie with the JWT token
 * @param token - JWT token to set in cookie
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

/**
 * Get the session from the request cookies
 * @param request - Next.js request object (optional, uses cookies() if not provided)
 * @returns Session payload or null if not authenticated
 */
export async function getSession(
  request?: NextRequest
): Promise<SessionPayload | null> {
  let sessionToken: string | undefined;

  if (request) {
    sessionToken = request.cookies.get('session')?.value;
  } else {
    const cookieStore = await cookies();
    sessionToken = cookieStore.get('session')?.value;
  }

  if (!sessionToken) {
    return null;
  }

  return verifyToken(sessionToken);
}

/**
 * Clear the session cookie (logout)
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    path: '/',
  });
}

/**
 * Refresh the session token (extend expiry)
 * @param currentSession - Current session payload
 * @returns New JWT token
 */
export async function refreshToken(
  currentSession: SessionPayload
): Promise<string> {
  return createToken({
    userId: currentSession.userId,
    email: currentSession.email,
    name: currentSession.name,
  });
}
