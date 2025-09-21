export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface User {
  id: string
  email: string
  displayName?: string
  avatarUrl?: string
  createdAt: string
  lastSignInAt?: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  displayName?: string
}

export interface ProductCaptureRequest {
  barcode: string
  frontImageUrl?: string
  backImageUrl?: string
  location?: {
    latitude: number
    longitude: number
  }
}

export interface ProductCaptureResponse {
  id: string
  barcode: string
  frontImageUrl?: string
  nutritionImageUrl?: string
  status: 'pending' | 'approved' | 'rejected'
  capturedBy: string
  createdAt: string
}

export interface DashboardStats {
  pendingCount: number
  approvedCount: number
  rejectedCount: number
}