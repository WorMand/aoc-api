import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateToken } from '@/lib/jwt'
import { ApiResponse, AuthResponse, RegisterRequest } from '@/types/api'

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()
    const { email, password, displayName } = body

    if (!email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 })
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 })
    }

    // Password strength kontrolü
    if (password.length < 6) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Password must be at least 6 characters long'
      }, { status: 400 })
    }

    // Supabase ile kayıt ol
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        display_name: displayName
      },
      email_confirm: true // Email doğrulamasını atla
    })

    if (error || !data.user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: error?.message || 'Registration failed'
      }, { status: 400 })
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
        displayName: displayName,
        avatarUrl: data.user.user_metadata?.avatar_url,
        createdAt: data.user.created_at,
        lastSignInAt: data.user.last_sign_in_at
      },
      accessToken
    }

    return NextResponse.json<ApiResponse<AuthResponse>>({
      success: true,
      data: response,
      message: 'Registration successful'
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}