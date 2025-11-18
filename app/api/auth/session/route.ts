import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import connectDB from '@/lib/database/mongodb';

export async function GET(request: NextRequest) {
  try {
    // Ensure database is connected
    await connectDB();

    // Get current user from session
    const user = await getCurrentUser();

    if (user) {
      return NextResponse.json(
        {
          success: true,
          user,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Not authenticated',
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}