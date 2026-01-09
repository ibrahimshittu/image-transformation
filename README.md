# Uplane - Image Transformation Service

A full-stack image transformation service built with Next.js 14, TypeScript, and modern web technologies. Upload images, remove backgrounds, flip images, and manage your gallery with ease.

## Features

- **Image Upload**: Drag-and-drop interface for easy image uploads
- **Background Removal**: Powered by remove.bg API for professional results
- **Image Transformations**: Flip images horizontally and vertically
- **Gallery Management**: View, filter, and organize all your images
- **Batch Processing**: Process multiple images at once
- **API Access**: Generate API keys for programmatic access
- **Real-time Preview**: Before/after comparison with interactive slider
- **Optimistic UI**: Instant feedback with smart loading states

## Tech Stack

### Core
- **Next.js 14+** (App Router)
- **TypeScript** (strict mode)
- **Clerk** (authentication)
- **PostgreSQL** with Prisma ORM
- **Vercel Blob** (file storage)
- **Sharp** (image processing)

### UI & State
- **shadcn/ui** + Radix UI
- **Tailwind CSS**
- **TanStack Query** (React Query v5)
- **react-dropzone**
- **react-compare-slider**
- **Zod** (validation)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Clerk account (for authentication)
- remove.bg API key
- Vercel account (for blob storage)

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

Then fill in your environment variables in `.env.local`:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`: From [Clerk Dashboard](https://dashboard.clerk.com)
- `CLERK_WEBHOOK_SECRET`: Create webhook in Clerk for user sync
- `BLOB_READ_WRITE_TOKEN`: From [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- `REMOVE_BG_API_KEY`: From [remove.bg](https://www.remove.bg/api)

4. Initialize database:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Clerk Webhook Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com) → Webhooks
2. Add endpoint: `http://localhost:3000/api/webhooks/clerk` (or your production URL)
3. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
4. Copy the signing secret to `CLERK_WEBHOOK_SECRET`

## Project Structure

```
/Users/ibrahimshittu/Projects/uplane/
├── app/
│   ├── (auth)/           # Authentication pages
│   ├── (dashboard)/      # Protected routes (upload, gallery, batch, settings)
│   ├── api/              # API routes
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── upload/           # Upload components
│   ├── gallery/          # Gallery components
│   └── transformation/   # Transformation components
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── storage/          # Blob storage & image processing
│   ├── integrations/     # External APIs (remove.bg)
│   └── auth/             # API key validation
├── hooks/                # Custom React hooks
├── types/                # TypeScript types
├── prisma/
│   └── schema.prisma     # Database schema
└── public/
```

## API Routes

### Images
- `POST /api/images` - Upload image
- `GET /api/images` - List images with pagination and filtering
- `GET /api/images/[id]` - Get specific image
- `DELETE /api/images/[id]` - Delete image

### Transformations
- `POST /api/transformations` - Create transformation
- `GET /api/transformations/[id]` - Get transformation status
- `POST /api/transformations/batch` - Batch process images
- `GET /api/transformations/batch/[id]` - Get batch job progress

### Authentication
- `POST /api/webhooks/clerk` - Clerk webhook for user sync
- `POST /api/api-keys` - Generate API key
- `GET /api/api-keys` - List user's API keys

## Database Schema

- **User**: Synced from Clerk
- **Image**: Uploaded images with metadata
- **Transformation**: Processing operations (remove background, flip)
- **BatchJob**: Batch processing tracking
- **ApiKey**: Programmatic API access

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Prisma commands
npx prisma studio          # Open Prisma Studio (database GUI)
npx prisma migrate dev     # Create and apply migrations
npx prisma generate        # Generate Prisma Client
npx prisma db push         # Push schema changes without migration
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy!

### Environment Variables for Production

Make sure to set all environment variables from `.env.example` in your hosting platform.

For Clerk webhook, update the endpoint URL to your production domain:
```
https://your-domain.com/api/webhooks/clerk
```

## Performance Considerations

- Images are automatically optimized with Next.js Image component
- Thumbnails generated for gallery view (200x200px)
- Database queries use proper indexing for fast lookups
- TanStack Query provides automatic caching and revalidation

## Security Features

- File type validation (magic bytes)
- File size limits (10MB max)
- API key authentication for programmatic access
- Clerk middleware for route protection
- Webhook signature verification

## Cost Optimization

- remove.bg API usage tracked per user
- Image transformations cached (avoid reprocessing)
- Automatic cleanup policies for old images

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

## Acknowledgments

- [Next.js](https://nextjs.org)
- [Clerk](https://clerk.com)
- [remove.bg](https://www.remove.bg)
- [shadcn/ui](https://ui.shadcn.com)
- [Vercel](https://vercel.com)
