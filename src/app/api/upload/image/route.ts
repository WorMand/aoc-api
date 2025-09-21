import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware'
import { ApiResponse } from '@/types/api'

interface ImageUploadResponse {
  imageUrl: string
  fileName: string
}

async function handler(request: AuthenticatedRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    const type = formData.get('type') as string // 'front' or 'back'
    const barcode = formData.get('barcode') as string

    if (!file) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Image file is required'
      }, { status: 400 })
    }

    if (!type || !['front', 'back'].includes(type)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Type must be either "front" or "back"'
      }, { status: 400 })
    }

    if (!barcode) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Barcode is required'
      }, { status: 400 })
    }

    // File'ı byte array'e çevir
    const bytes = await file.arrayBuffer()
    const buffer = new Uint8Array(bytes)

    // File adını oluştur
    const timestamp = Date.now()
    const fileName = `${barcode}_${type}_${timestamp}.jpg`
    const filePath = `${type}/${fileName}`

    // Supabase Storage'a upload
    const { data, error } = await supabaseAdmin.storage
      .from('product-capture-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (error) {
      console.error('Storage error:', error)
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Failed to upload image'
      }, { status: 500 })
    }

    // Public URL al
    const { data: urlData } = supabaseAdmin.storage
      .from('product-capture-images')
      .getPublicUrl(filePath)

    const response: ImageUploadResponse = {
      imageUrl: urlData.publicUrl,
      fileName: fileName
    }

    return NextResponse.json<ApiResponse<ImageUploadResponse>>({
      success: true,
      data: response,
      message: 'Image uploaded successfully'
    })

  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export const POST = withAuth(handler)