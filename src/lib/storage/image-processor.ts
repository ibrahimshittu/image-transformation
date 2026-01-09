/**
 * Image Processor
 *
 * Handles image transformations using Sharp.
 * - Horizontal flip (flop)
 * - Vertical flip (flip)
 */

import sharp from 'sharp'

/**
 * Flip an image horizontally (mirror)
 * Uses Sharp's .flop() method
 */
export async function flipHorizontal(imageBuffer: Buffer): Promise<Buffer> {
  return sharp(imageBuffer).flop().toBuffer()
}

/**
 * Flip an image vertically
 * Uses Sharp's .flip() method
 */
export async function flipVertical(imageBuffer: Buffer): Promise<Buffer> {
  return sharp(imageBuffer).flip().toBuffer()
}

/**
 * Get image metadata
 */
export async function getImageMetadata(imageBuffer: Buffer) {
  return sharp(imageBuffer).metadata()
}

/**
 * Convert image to PNG format
 * Useful for preserving transparency after background removal
 */
export async function convertToPng(imageBuffer: Buffer): Promise<Buffer> {
  return sharp(imageBuffer).png().toBuffer()
}

/**
 * Resize image to specific dimensions
 * Maintains aspect ratio by default
 */
export async function resizeImage(
  imageBuffer: Buffer,
  width: number,
  height?: number
): Promise<Buffer> {
  return sharp(imageBuffer)
    .resize(width, height, { fit: 'inside', withoutEnlargement: true })
    .toBuffer()
}

/**
 * Generate a thumbnail
 */
export async function generateThumbnail(
  imageBuffer: Buffer,
  size: number = 200
): Promise<Buffer> {
  return sharp(imageBuffer)
    .resize(size, size, { fit: 'cover' })
    .jpeg({ quality: 80 })
    .toBuffer()
}
