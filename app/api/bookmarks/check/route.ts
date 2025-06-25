import { NextRequest, NextResponse } from 'next/server';
import operations from '@/operations';

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
    
    // TODO: Get userId from authentication context
    // For now, using a hardcoded userId for testing
    const userId = '8wRpplSufTBDN84McDxY1AoTZ2xA8aoC'; // This should come from your auth system
    
    const result = await operations.BookmarkOps.isWorkoutBookmarked(userId, parseInt(workoutId));
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to check bookmark status' },
      { status: 500 }
    );
  }
} 