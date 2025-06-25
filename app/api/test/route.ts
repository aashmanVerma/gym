import { NextResponse } from 'next/server';
import sequelize from '@/lib/sequelize';

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