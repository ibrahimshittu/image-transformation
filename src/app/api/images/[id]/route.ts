/**
 * Single Image API Route
 *
 * GET /api/images/[id] - Get a specific image
 * DELETE /api/images/[id] - Delete an image
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import {
  deleteFile,
  BUCKETS,
  extractPathFromUrl,
} from '@/lib/storage/supabase-storage'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/images/[id]
 * Get a specific image with its transformations
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch image with transformations
    const image = await prisma.image.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        transformations: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    return NextResponse.json(image)
  } catch (error) {
    console.error('Get image error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/images/[id]
 * Delete an image and all associated files
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch image with transformations to get file paths
    const image = await prisma.image.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        transformations: true,
      },
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Delete original image from storage
    const originalPath = extractPathFromUrl(image.originalUrl, BUCKETS.IMAGES)
    if (originalPath) {
      try {
        await deleteFile(BUCKETS.IMAGES, originalPath)
      } catch (e) {
        console.error('Failed to delete original file:', e)
      }
    }

    // Delete all transformation output files from storage
    for (const transformation of image.transformations) {
      if (transformation.outputUrl) {
        const outputPath = extractPathFromUrl(
          transformation.outputUrl,
          BUCKETS.TRANSFORMATIONS
        )
        if (outputPath) {
          try {
            await deleteFile(BUCKETS.TRANSFORMATIONS, outputPath)
          } catch (e) {
            console.error('Failed to delete transformation file:', e)
          }
        }
      }
    }

    // Delete from database (cascade deletes transformations)
    await prisma.image.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete image error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
