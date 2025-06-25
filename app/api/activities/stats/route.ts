import { NextResponse } from 'next/server';
import operations from '@/operations';

export async function GET() {
  try {
    // TODO: Get userId from authentication context
    // For now, using a hardcoded userId for testing
    const userId = '8wRpplSufTBDN84McDxY1AoTZ2xA8aoC'; // This should come from your auth system
    
    const stats = await operations.UserActivityOps.getUserStats(userId);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
} 