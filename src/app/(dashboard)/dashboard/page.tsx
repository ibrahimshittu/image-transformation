'use client'

/**
 * Dashboard Page
 *
 * Main page for uploading images and viewing results.
 */

import { useState, useEffect } from 'react'
import { Dropzone } from '@/components/upload/dropzone'
import { ImageResult } from '@/components/upload/image-result'
import { Loader2 } from 'lucide-react'

interface Image {
  id: string
  originalUrl: string
  originalFilename: string
  status: string
  createdAt: string
  transformations: Array<{
    id: string
    status: string
    outputUrl: string | null
    processingTime: number | null
  }>
}

export default function DashboardPage() {
  const [images, setImages] = useState<Image[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch images on mount
  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images')
      if (!response.ok) throw new Error('Failed to fetch images')
      const data = await response.json()
      setImages(data.images)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    setError(null)

    try {
      // Step 1: Upload the image
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const err = await uploadResponse.json()
        throw new Error(err.error || 'Failed to upload image')
      }

      const uploadedImage = await uploadResponse.json()

      // Add image to list with pending status
      setImages((prev) => [
        { ...uploadedImage, transformations: [] },
        ...prev,
      ])

      // Step 2: Trigger transformation (remove bg + flip)
      const transformResponse = await fetch('/api/transformations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId: uploadedImage.id }),
      })

      if (!transformResponse.ok) {
        const err = await transformResponse.json()
        throw new Error(err.error || 'Failed to process image')
      }

      // Refresh images to get updated status
      await fetchImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload')
      // Refresh to get latest state
      await fetchImages()
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    setError(null)

    try {
      const response = await fetch(`/api/images/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to delete image')
      }

      // Remove from list
      setImages((prev) => prev.filter((img) => img.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Image Transformer</h1>
        <p className="mt-1 text-gray-600">
          Upload an image to remove its background and flip it horizontally
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Upload Image
        </h2>
        <Dropzone onUpload={handleUpload} isUploading={isUploading} />
      </div>

      {/* Results Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your Images
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">
              No images yet. Upload one to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {images.map((image) => (
              <ImageResult
                key={image.id}
                image={image}
                onDelete={handleDelete}
                isDeleting={deletingId === image.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
