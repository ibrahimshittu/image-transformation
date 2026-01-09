/**
 * Supabase Storage Utilities
 *
 * Handles file uploads and deletions to Supabase Storage buckets.
 * Uses the admin client to bypass RLS for server-side operations.
 */

import { createAdminClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'

// Storage bucket names
export const BUCKETS = {
  IMAGES: 'images',
  TRANSFORMATIONS: 'transformations',
} as const

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS]

interface UploadResult {
  path: string
  publicUrl: string
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  bucket: BucketName,
  file: Buffer,
  originalFilename: string,
  contentType: string
): Promise<UploadResult> {
  const supabase = createAdminClient()

  // Generate unique filename to avoid collisions
  const extension = originalFilename.split('.').pop() || 'png'
  const uniqueFilename = `${nanoid()}.${extension}`
  const path = `${uniqueFilename}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`)
  }

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path)

  return {
    path: data.path,
    publicUrl,
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(
  bucket: BucketName,
  path: string
): Promise<void> {
  const supabase = createAdminClient()

  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`)
  }
}

/**
 * Get the public URL for a file
 */
export function getPublicUrl(bucket: BucketName, path: string): string {
  const supabase = createAdminClient()
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path)
  return publicUrl
}

/**
 * Download a file from Supabase Storage as a buffer
 */
export async function downloadFile(
  bucket: BucketName,
  path: string
): Promise<Buffer> {
  const supabase = createAdminClient()

  const { data, error } = await supabase.storage.from(bucket).download(path)

  if (error) {
    throw new Error(`Failed to download file: ${error.message}`)
  }

  const arrayBuffer = await data.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

/**
 * Extract file path from a Supabase Storage public URL
 */
export function extractPathFromUrl(url: string, bucket: BucketName): string {
  // URL format: https://xxx.supabase.co/storage/v1/object/public/bucket/path
  const pattern = new RegExp(`/storage/v1/object/public/${bucket}/(.+)$`)
  const match = url.match(pattern)
  return match ? match[1] : ''
}
