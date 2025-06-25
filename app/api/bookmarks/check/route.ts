import { NextRequest, NextResponse } from 'next/server';
import operations from '@/operations';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workoutId = searchParams.get('workoutId');
    
    if (!workoutId) {
      return NextResponse.json(
        { error: 'workoutId is required' },
        { status: 400 }
      );
    }
    
    // Get authenticated user
    const user = await getAuthenticatedUser();
    const userId = user.id;
    
    const result = await operations.BookmarkOps.isWorkoutBookmarked(userId, parseInt(workoutId));
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof Error && error.message.includes('Authentication')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to check bookmark status' },
      { status: 500 }
    );
  }
} 