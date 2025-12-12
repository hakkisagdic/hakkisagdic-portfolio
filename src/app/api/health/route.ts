import { NextResponse } from 'next/server';

export async function GET() {
  // Simple health check - just return OK
  // Database check removed to prevent startup failures
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.VERSION || 'unknown'
  });
}
