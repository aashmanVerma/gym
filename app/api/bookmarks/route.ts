import { NextRequest, NextResponse } from 'next/server';
import operations from '@/operations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'DESC') as 'ASC' | 'DESC';
    
    // TODO: Get userId from authentication context
    // For now, using a hardcoded userId for testing
    const userId = '8wRpplSufTBDN84McDxY1AoTZ2xA8aoC'; // This should come from your auth system
    
    const result = await operations.BookmarkOps.getUserBookmarks(userId, {
      page,
      limit,
      sortBy,
      sortOrder
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
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
    
    // TODO: Get userId from authentication context
    // For now, using a hardcoded userId for testing
    const userId = '8wRpplSufTBDN84McDxY1AoTZ2xA8aoC'; // This should come from your auth system
    
    const result = await operations.BookmarkOps.toggleBookmark(userId, workoutId);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle bookmark' },
      { status: 500 }
    );
  }
} 