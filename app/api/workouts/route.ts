// app/api/workouts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import operations from '@/operations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') || undefined;
    const difficulty = searchParams.get('difficulty') || undefined;
    const instructor = searchParams.get('instructor') || undefined;
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;
    const search = searchParams.get('search') || undefined;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'DESC') as 'ASC' | 'DESC';

    // Call your existing server function
    const result = await operations.WorkoutOps.getWorkouts({
      page,
      limit,
      category,
      difficulty,
      instructor,
      minRating,
      search,
      sortBy,
      sortOrder
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    );
  }
}