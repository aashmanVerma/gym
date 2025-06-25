import { NextRequest, NextResponse } from 'next/server';
import operations from '@/operations';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'DESC') as 'ASC' | 'DESC';
    
    // Get authenticated user
    const user = await getAuthenticatedUser();
    const userId = user.id;
    
    const result = await operations.BookmarkOps.getUserBookmarks(userId, {
      page,
      limit,
      sortBy,
      sortOrder
    });

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
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workoutId } = body;
    
    if (!workoutId) {
      return NextResponse.json(
        { error: 'workoutId is required' },
        { status: 400 }
      );
    }
    
    // Get authenticated user
    const user = await getAuthenticatedUser();
    const userId = user.id;
    
    const result = await operations.BookmarkOps.toggleBookmark(userId, workoutId);
    
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
      { error: 'Failed to toggle bookmark' },
      { status: 500 }
    );
  }
} 