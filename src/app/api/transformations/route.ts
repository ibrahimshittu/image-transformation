/**
 * Transformations API Route
 *
 * POST /api/transformations - Process an image (remove bg + flip)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import {
  uploadFile,
  downloadFile,
  BUCKETS,
  extractPathFromUrl,
} from '@/lib/storage/supabase-storage'
import { removeBackground } from '@/lib/integrations/remove-bg'
import { flipHorizontal } from '@/lib/storage/image-processor'

/**
 * POST /api/transformations
 * Process an image: remove background + flip horizontally
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { imageId } = body

    if (!imageId) {
      return NextResponse.json(
        { error: 'imageId is required' },
        { status: 400 }
      )
    }

    // Verify user owns the image
    const image = await prisma.image.findFirst({
      where: {
        id: imageId,
        userId: user.id,
      },
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Update image status to processing
    await prisma.image.update({
      where: { id: imageId },
      data: { status: 'PROCESSING' },
    })

    // Create transformation record
    const transformation = await prisma.transformation.create({
      data: {
        imageId,
        type: 'REMOVE_BACKGROUND',
        status: 'PROCESSING',
      },
    })

    try {
      // Download original image from storage
      const originalPath = extractPathFromUrl(image.originalUrl, BUCKETS.IMAGES)
      const originalBuffer = await downloadFile(BUCKETS.IMAGES, originalPath)

      // Step 1: Remove background using remove.bg API
      const { imageBuffer: bgRemovedBuffer, creditsCharged } =
        await removeBackground(originalBuffer, image.originalFilename)

      // Step 2: Flip horizontally
      const finalBuffer = await flipHorizontal(bgRemovedBuffer)

      // Upload processed image to transformations bucket
      const { publicUrl } = await uploadFile(
        BUCKETS.TRANSFORMATIONS,
        finalBuffer,
        `processed_${image.originalFilename}`,
        'image/png' // Output is always PNG to preserve transparency
      )

      const processingTime = Date.now() - startTime

      // Update transformation record with success
      const updatedTransformation = await prisma.transformation.update({
        where: { id: transformation.id },
        data: {
          status: 'COMPLETED',
          outputUrl: publicUrl,
          processingTime,
          apiCost: creditsCharged,
        },
      })

      // Update image status to completed
      await prisma.image.update({
        where: { id: imageId },
        data: { status: 'COMPLETED' },
      })

      return NextResponse.json({
        id: updatedTransformation.id,
        imageId,
        status: 'COMPLETED',
        outputUrl: publicUrl,
        processingTime,
        creditsCharged,
      })
    } catch (processingError) {
      // Update transformation with failure
      await prisma.transformation.update({
        where: { id: transformation.id },
        data: {
          status: 'FAILED',
          errorMessage:
            processingError instanceof Error
              ? processingError.message
              : 'Unknown error',
          processingTime: Date.now() - startTime,
        },
      })

      // Update image status to failed
      await prisma.image.update({
        where: { id: imageId },
        data: { status: 'FAILED' },
      })

      throw processingError
    }
  } catch (error) {
    console.error('Transformation error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to process image',
      },
      { status: 500 }
    )
  }
}
