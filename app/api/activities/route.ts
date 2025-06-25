import { NextRequest, NextResponse } from 'next/server';
import operations from '@/operations';

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
    
    // TODO: Get userId from authentication context
    // For now, using a hardcoded userId for testing
    const userId = '8wRpplSufTBDN84McDxY1AoTZ2xA8aoC'; // This should come from your auth system
    
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
    
    // TODO: Get userId from authentication context
    // For now, using a hardcoded userId for testing
    const userId = '8wRpplSufTBDN84McDxY1AoTZ2xA8aoC'; // This should come from your auth system
    
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
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    );
  }
} 