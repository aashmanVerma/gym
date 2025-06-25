import { NextResponse } from 'next/server';
import operations from '@/operations';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET() {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser();
    const userId = user.id;
    
    const stats = await operations.UserActivityOps.getUserStats(userId);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof Error && error.message.includes('Authentication')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
} 