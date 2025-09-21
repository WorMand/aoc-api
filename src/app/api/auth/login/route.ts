import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateToken } from '@/lib/jwt'
import { ApiResponse, AuthResponse, LoginRequest } from '@/types/api'

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 })
    }

    // Supabase ile giriş yap
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    })

    if (error || !data.user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 })
    }

    // JWT token oluştur
    const accessToken = generateToken({
      userId: data.user.id,
      email: data.user.email!
    })

    const response: AuthResponse = {
      user: {
        id: data.user.id,
        email: data.user.email!,
        displayName: data.user.user_metadata?.display_name,
        avatarUrl: data.user.user_metadata?.avatar_url,
        createdAt: data.user.created_at,
        lastSignInAt: data.user.last_sign_in_at
      },
      accessToken
    }

    return NextResponse.json<ApiResponse<AuthResponse>>({
      success: true,
      data: response,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}