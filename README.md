# AOC API Server

> Arnelyum Org Chart API Backend built with Next.js and Supabase

## 🚀 Features

### Authentication
- ✅ JWT-based authentication
- ✅ User registration and login
- ✅ Secure password handling
- ✅ Token-based session management

### Product Management
- ✅ Product capture with barcode scanning
- ✅ Image upload (front/back photos)
- ✅ Status tracking (pending/approved/rejected)
- ✅ User-specific product queues

### Dashboard & Analytics
- ✅ User dashboard statistics
- ✅ Capture count by status
- ✅ Real-time data tracking

## 📡 API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/register
```

### Product Capture
```
POST /api/products/capture
GET /api/dashboard/stats
```

### File Upload
```
POST /api/upload/image
```

### Health Check
```
GET /api/health
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: JWT + Supabase Auth
- **Language**: TypeScript
- **Deployment**: Vercel

## 🚀 Deployment

### Environment Variables
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 📱 Android Integration

This API is designed to work with the AOC Android application. The Android client uses this API for:

- User authentication
- Product barcode capture
- Image uploads
- Dashboard data retrieval

## 🔒 Security

- JWT tokens for API authentication
- Supabase RLS (Row Level Security) policies
- Environment variable protection
- CORS configuration
- Input validation and sanitization

## 🧪 Testing

### Local Development
```bash
npm run dev
```

### API Testing
Use tools like Postman or curl to test endpoints:

```bash
# Health check
curl https://api.arnelyum.tech/api/health

# Login
curl -X POST https://api.arnelyum.tech/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

## 📞 Contact

- Domain: [arnelyum.tech](https://arnelyum.tech)
- API: [api.arnelyum.tech](https://api.arnelyum.tech)

---

Built with ❤️ for Arnelyum Organization
