/**
 * remove.bg API Integration
 *
 * Handles background removal using the remove.bg API.
 * Free tier: 50 API calls per month.
 */

const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/removebg'

interface RemoveBgResult {
  imageBuffer: Buffer
  creditsCharged: number
}

/**
 * Remove background from an image using remove.bg API
 *
 * @param imageBuffer - The image as a Buffer
 * @param filename - Original filename (used for extension detection)
 * @returns Promise with processed image buffer and credits charged
 */
export async function removeBackground(
  imageBuffer: Buffer,
  filename: string
): Promise<RemoveBgResult> {
  const apiKey = process.env.REMOVE_BG_API_KEY

  if (!apiKey) {
    throw new Error('REMOVE_BG_API_KEY is not configured')
  }

  // Create form data with the image
  // Convert Buffer to Uint8Array for Blob compatibility
  const uint8Array = new Uint8Array(imageBuffer)
  const formData = new FormData()
  formData.append('image_file', new Blob([uint8Array]), filename)
  formData.append('size', 'auto') // auto, preview, small, regular, medium, hd, 4k
  formData.append('format', 'png') // Output as PNG to preserve transparency

  const response = await fetch(REMOVE_BG_API_URL, {
    method: 'POST',
    headers: {
      'X-Api-Key': apiKey,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error('remove.bg API error:', response.status, errorBody)

    // Handle specific error cases
    if (response.status === 402) {
      throw new Error('remove.bg API credits exhausted. Please try again later.')
    }
    if (response.status === 403) {
      throw new Error('Invalid remove.bg API key')
    }
    if (response.status === 400) {
      throw new Error('Invalid image format or unable to process image')
    }

    throw new Error(`remove.bg API error: ${response.status}`)
  }

  // Get credits charged from response headers
  const creditsCharged = parseInt(
    response.headers.get('X-Credits-Charged') || '1'
  )

  // Get the processed image
  const arrayBuffer = await response.arrayBuffer()
  const resultBuffer = Buffer.from(arrayBuffer)

  return {
    imageBuffer: resultBuffer,
    creditsCharged,
  }
}

/**
 * Check remaining remove.bg API credits
 * Note: This requires making a request to check, so use sparingly
 */
export async function checkCredits(): Promise<{
  free: number
  subscription: number
  payg: number
  enterprise: number
}> {
  const apiKey = process.env.REMOVE_BG_API_KEY

  if (!apiKey) {
    throw new Error('REMOVE_BG_API_KEY is not configured')
  }

  const response = await fetch('https://api.remove.bg/v1.0/account', {
    headers: {
      'X-Api-Key': apiKey,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to check remove.bg credits')
  }

  const data = await response.json()
  return data.data.attributes.credits
}
