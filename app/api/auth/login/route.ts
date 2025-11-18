import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/auth';
import connectDB from '@/lib/database/mongodb';

export async function POST(request: NextRequest) {
  try {
    // Ensure database is connected
    await connectDB();

    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    // Call sign in function
    const result = await signIn({ email, password });

    // Return appropriate response
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}