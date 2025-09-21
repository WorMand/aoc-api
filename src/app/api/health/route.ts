import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types/api'

export async function GET() {
  return NextResponse.json<ApiResponse>({
    success: true,
    message: 'AOC API is running',
    data: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }
  })
}