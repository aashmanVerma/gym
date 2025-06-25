import { NextRequest, NextResponse } from 'next/server';
import operations from '@/operations';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = (searchParams.get('sortOrder') || 'DESC') as 'ASC' | 'DESC';
    const category = searchParams.get('category') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    
    // Get authenticated user
    const user = await getAuthenticatedUser();
    const userId = user.id;
    
    const result = await operations.UserActivityOps.getUserActivities(userId, {
      page,
      limit,
      sortBy,
      sortOrder,
      category,
      startDate,
      endDate
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
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      activityName, 
      description, 
      duration, 
      caloriesBurned, 
      category, 
      difficulty, 
      notes, 
      date 
    } = body;
    
    if (!activityName || !duration || !caloriesBurned) {
      return NextResponse.json(
        { error: 'activityName, duration, and caloriesBurned are required' },
        { status: 400 }
      );
    }
    
    // Get authenticated user
    const user = await getAuthenticatedUser();
    const userId = user.id;
    
    const result = await operations.UserActivityOps.createActivity({
      userId,
      activityName,
      description,
      duration: parseInt(duration),
      caloriesBurned: parseInt(caloriesBurned),
      category: category || 'Other',
      difficulty: difficulty || 'Moderate',
      notes,
      date: date || new Date().toISOString().split('T')[0]
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
      { error: 'Failed to create activity' },
      { status: 500 }
    );
  }
} 