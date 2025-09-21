import { NextRequest } from 'next/server'
import { verifyToken, extractTokenFromHeader, TokenPayload } from '@/lib/jwt'

export interface AuthenticatedRequest extends NextRequest {
  user: TokenPayload
}

export function withAuth(
  handler: (request: AuthenticatedRequest) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    try {
      const authHeader = request.headers.get('authorization')
      const token = extractTokenFromHeader(authHeader ?? undefined)
      const user = verifyToken(token)
      
      // Request'e user bilgisini ekle
      const authenticatedRequest = request as AuthenticatedRequest
      authenticatedRequest.user = user
      
      return await handler(authenticatedRequest)
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unauthorized'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }
  }
}