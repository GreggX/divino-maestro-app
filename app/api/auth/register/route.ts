import { NextRequest, NextResponse } from 'next/server';
import { signUp } from '@/lib/auth';
import connectDB from '@/lib/database/mongodb';

export async function POST(request: NextRequest) {
  try {
    // Ensure database is connected
    await connectDB();

    // Parse request body
    const body = await request.json();
    const { email, password, name } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email, password, and name are required',
        },
        { status: 400 }
      );
    }

    // Call sign up function
    const result = await signUp({ email, password, name });

    // Return appropriate response
    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}