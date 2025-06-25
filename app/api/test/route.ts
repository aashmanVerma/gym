import { NextResponse } from 'next/server';
import sequelize from '@/lib/sequelize';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET() {
  try {
    // Test database connection
    await sequelize.authenticate();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}

// Test authentication endpoint
export async function POST() {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser();
    
    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Authentication test error:', error);
    if (error instanceof Error && error.message.includes('Authentication')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required',
          message: 'User not authenticated'
        },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { 
        success: false, 
        error: 'Authentication test failed',
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
} 