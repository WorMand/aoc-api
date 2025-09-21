import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware'
import { ApiResponse, ProductCaptureRequest, ProductCaptureResponse } from '@/types/api'

async function handler(request: AuthenticatedRequest) {
  try {
    const body: ProductCaptureRequest = await request.json()
    const { barcode, frontImageUrl, backImageUrl, location } = body
    const userId = request.user.userId

    if (!barcode) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Barcode is required'
      }, { status: 400 })
    }

    // Product capture'ı database'e kaydet
    const { data, error } = await supabaseAdmin
      .from('product_capture_queue')
      .insert({
        barcode,
        front_image_url: frontImageUrl,
        nutrition_image_url: backImageUrl, // back image'i nutrition olarak kaydediyoruz
        captured_by: userId,
        status: 'pending',
        location: location ? `POINT(${location.longitude} ${location.latitude})` : null
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Failed to save product capture'
      }, { status: 500 })
    }

    const response: ProductCaptureResponse = {
      id: data.id,
      barcode: data.barcode,
      frontImageUrl: data.front_image_url,
      nutritionImageUrl: data.nutrition_image_url,
      status: data.status,
      capturedBy: data.captured_by,
      createdAt: data.created_at
    }

    return NextResponse.json<ApiResponse<ProductCaptureResponse>>({
      success: true,
      data: response,
      message: 'Product capture saved successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Product capture error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export const POST = withAuth(handler)