# Uplane - AI Background Remover

Remove backgrounds from images instantly using AI. Free, fast, and with HD quality downloads.

## Features

- Instant AI-powered background removal
- HD quality downloads with no watermark
- Gallery to view and manage your images
- Hold to compare original vs processed
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
git clone <your-repo-url>
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
├── app/                    # Pages and API routes
│   ├── (dashboard)/        # Protected routes
│   │   └── gallery/        # User's image gallery
│   ├── api/                # API endpoints
│   │   ├── images/         # Image CRUD
│   │   └── transformations/# Background removal
│   └── page.tsx            # Landing page
├── components/
│   ├── auth/               # Authentication modal
│   ├── gallery/            # Gallery components
│   ├── home/               # Landing page sections
│   ├── layout/             # Shared layout (navbar, footer)
│   ├── ui/                 # Base UI components
│   └── upload/             # Upload/transformation viewer
├── hooks/                  # Custom React hooks
│   ├── use-auth.ts         # Auth state management
│   └── use-toast.ts        # Toast notifications
└── lib/                    # Utilities and services
    ├── download.ts         # File download utility
    ├── integrations/       # External APIs
    ├── storage/            # File storage
    ├── supabase/           # Supabase clients
    └── prisma.ts           # Database client
```

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/images` | Upload image |
| GET | `/api/images` | List images (paginated) |
| GET | `/api/images/[id]` | Get single image |
| DELETE | `/api/images/[id]` | Delete image |
| POST | `/api/transformations` | Remove background |

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
