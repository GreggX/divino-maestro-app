import { User } from '@/lib/database/models';
import { hashPassword, verifyPassword, validatePassword } from './password';
import { createToken, setSessionCookie, clearSessionCookie, getSession } from './jwt';
import { SessionPayload } from './jwt';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  errors?: string[];
}

/**
 * Register a new user
 * @param data - User registration data
 * @returns Authentication response
 */
export async function signUp(data: SignUpData): Promise<AuthResponse> {
  try {
    const { email, password, name } = data;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Invalid email format',
      };
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors,
      };
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return {
        success: false,
        message: 'Email already registered',
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user in database
    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      emailVerified: false, // You can implement email verification later
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newUser.save();

    // Create session token
    const token = await createToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
    });

    // Set session cookie
    await setSessionCookie(token);

    return {
      success: true,
      message: 'Registration successful',
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
      },
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      message: 'Registration failed. Please try again.',
    };
  }
}

/**
 * Sign in an existing user
 * @param data - User login credentials
 * @returns Authentication response
 */
export async function signIn(data: SignInData): Promise<AuthResponse> {
  try {
    const { email, password } = data;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Create session token
    const token = await createToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    // Set session cookie
    await setSessionCookie(token);

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      message: 'Login failed. Please try again.',
    };
  }
}

/**
 * Sign out the current user
 * @returns Authentication response
 */
export async function signOut(): Promise<AuthResponse> {
  try {
    await clearSessionCookie();

    return {
      success: true,
      message: 'Logout successful',
    };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      message: 'Logout failed',
    };
  }
}

/**
 * Get current user from session
 * @returns User data or null
 */
export async function getCurrentUser(): Promise<{
  id: string;
  email: string;
  name?: string;
} | null> {
  try {
    const session = await getSession();

    if (!session) {
      return null;
    }

    // Optionally, you can fetch fresh user data from the database
    const user = await User.findById(session.userId).select('_id email name');

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

// Re-export types and functions
export { getSession, type SessionPayload } from './jwt';
export { validatePassword } from './password';