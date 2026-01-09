# Uplane - Background Remover

Remove backgrounds from images instantly. Free, fast, and high quality.

## Features

- Instant background removal
- HD quality output with no watermark
- Gallery to view and manage your images
- Hold to compare original vs processed
- Upload from gallery modal
- Mobile-friendly responsive design

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Supabase** (Auth + Storage)
- **Prisma** (Database ORM)
- **remove.bg API** (Background removal)
- **Tailwind CSS**
- **shadcn/ui** (UI components)

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- remove.bg API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ibrahimshittu/uplane.git
cd uplane
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env.local
```

4. Fill in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
REMOVE_BG_API_KEY=your_removebg_key
DATABASE_URL=your_postgres_url
```

5. Initialize database:
```bash
npx prisma generate
npx prisma db push
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   └── gallery/        # User's image gallery
│   ├── api/
│   │   ├── images/         # Image CRUD endpoints
│   │   └── transformations/# Background removal endpoint
│   ├── auth/
│   │   └── callback/       # Auth callback handler
│   └── page.tsx            # Landing page
├── components/
│   ├── auth/               # Authentication modal
│   ├── gallery/            # Gallery image cards
│   ├── home/               # Landing page sections
│   ├── layout/             # Navbar & footer
│   ├── ui/                 # shadcn/ui components
│   └── upload/             # Upload modal & viewer
├── hooks/
│   ├── use-auth.ts         # Auth state management
│   ├── use-upload.ts       # Upload flow logic
│   └── use-toast.ts        # Toast notifications
└── lib/
    ├── integrations/       # remove.bg API
    ├── storage/            # Supabase storage
    ├── supabase/           # Supabase clients
    └── prisma.ts           # Database client
```

## API Reference

### Images

#### Upload Image
```
POST /api/images
```
Upload a new image for processing.

**Request:** `multipart/form-data` with `file` field

**Response:**
```json
{
  "id": "uuid",
  "originalUrl": "https://...",
  "originalFilename": "image.png",
  "width": 1920,
  "height": 1080,
  "status": "PENDING",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### List Images
```
GET /api/images?page=1&limit=20&status=COMPLETED
```
Get paginated list of user's images.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status (PENDING, PROCESSING, COMPLETED, FAILED)

**Response:**
```json
{
  "images": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

#### Get Single Image
```
GET /api/images/[id]
```
Get a specific image with its transformations.

**Response:**
```json
{
  "id": "uuid",
  "originalUrl": "https://...",
  "originalFilename": "image.png",
  "status": "COMPLETED",
  "transformations": [...]
}
```

#### Delete Image
```
DELETE /api/images/[id]
```
Delete an image and all associated files.

**Response:**
```json
{
  "success": true
}
```

### Transformations

#### Remove Background
```
POST /api/transformations
```
Process an image to remove its background.

**Request:**
```json
{
  "imageId": "uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "imageId": "uuid",
  "status": "COMPLETED",
  "outputUrl": "https://...",
  "processingTime": 2500,
  "creditsCharged": 1
}
```

## Database Schema

- **User**: Synced from Supabase Auth
- **Image**: Uploaded images with metadata
- **Transformation**: Background removal results

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter

npx prisma studio    # Open database GUI
npx prisma db push   # Push schema changes
npx prisma generate  # Generate Prisma client
```

## Deployment

### Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy

## License

MIT
