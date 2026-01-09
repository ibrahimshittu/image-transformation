/**
 * Images API Route
 *
 * POST /api/images - Upload a new image
 * GET /api/images - List user's images
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { uploadFile, BUCKETS } from '@/lib/storage/supabase-storage'
import sharp from 'sharp'

// Allowed file types
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * POST /api/images
 * Upload a new image
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: PNG, JPG, JPEG, WEBP' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract image metadata using Sharp
    const metadata = await sharp(buffer).metadata()

    // Ensure user exists in database (sync from Supabase Auth)
    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email! },
      create: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name || null,
      },
    })

    // Upload to Supabase Storage
    const { path, publicUrl } = await uploadFile(
      BUCKETS.IMAGES,
      buffer,
      file.name,
      file.type
    )

    // Create database record
    const image = await prisma.image.create({
      data: {
        userId: user.id,
        originalUrl: publicUrl,
        originalFilename: file.name,
        mimeType: file.type,
        fileSize: file.size,
        width: metadata.width || null,
        height: metadata.height || null,
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      id: image.id,
      originalUrl: image.originalUrl,
      originalFilename: image.originalFilename,
      width: image.width,
      height: image.height,
      status: image.status,
      createdAt: image.createdAt,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/images
 * List user's images with pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    // Build where clause
    const where: {
      userId: string
      status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
    } = {
      userId: user.id,
    }

    if (
      status &&
      ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'].includes(status)
    ) {
      where.status = status as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
    }

    // Fetch images with transformations
    const [images, total] = await Promise.all([
      prisma.image.findMany({
        where,
        include: {
          transformations: {
            orderBy: { createdAt: 'desc' },
            take: 1, // Get latest transformation
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.image.count({ where }),
    ])

    return NextResponse.json({
      images,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('List images error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
}
