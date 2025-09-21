import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware'
import { ApiResponse, DashboardStats } from '@/types/api'

async function handler(request: AuthenticatedRequest) {
  try {
    const userId = request.user.userId

    // Paralel olarak tüm status'ları say
    const [pendingResult, approvedResult, rejectedResult] = await Promise.all([
      supabaseAdmin
        .from('product_capture_queue')
        .select('id', { count: 'exact', head: true })
        .eq('captured_by', userId)
        .eq('status', 'pending'),
      
      supabaseAdmin
        .from('product_capture_queue')
        .select('id', { count: 'exact', head: true })
        .eq('captured_by', userId)
        .eq('status', 'approved'),
      
      supabaseAdmin
        .from('product_capture_queue')
        .select('id', { count: 'exact', head: true })
        .eq('captured_by', userId)
        .eq('status', 'rejected')
    ])

    const stats: DashboardStats = {
      pendingCount: pendingResult.count || 0,
      approvedCount: approvedResult.count || 0,
      rejectedCount: rejectedResult.count || 0
    }

    return NextResponse.json<ApiResponse<DashboardStats>>({
      success: true,
      data: stats,
      message: 'Dashboard stats retrieved successfully'
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export const GET = withAuth(handler)