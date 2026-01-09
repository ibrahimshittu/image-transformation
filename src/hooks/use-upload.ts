'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface Image {
  id: string
  originalUrl: string
  originalFilename: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  transformations: Array<{
    id: string
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
    outputUrl: string | null
  }>
}

export function useUpload(onUploadComplete?: () => void) {
  const [currentImage, setCurrentImage] = useState<Image | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleUpload = async (file: File) => {
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json()
        throw new Error(error.error || 'Failed to upload image')
      }

      const uploadedImage = await uploadResponse.json()

      const initialImageState: Image = {
        ...uploadedImage,
        status: 'PROCESSING',
        transformations: [],
      }
      setCurrentImage(initialImageState)

      const transformResponse = await fetch('/api/transformations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId: uploadedImage.id }),
      })

      if (!transformResponse.ok) {
        throw new Error('Failed to start processing')
      }

      const transformationResult = await transformResponse.json()

      setCurrentImage({
        ...initialImageState,
        status: transformationResult.status,
        transformations: [transformationResult],
      })

      onUploadComplete?.()
    } catch (err) {
      console.error(err)
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: err instanceof Error ? err.message : 'Something went wrong',
      })
      setCurrentImage((prev) => (prev ? { ...prev, status: 'FAILED' } : null))
    } finally {
      setIsUploading(false)
    }
  }

  const handleReset = () => {
    setCurrentImage(null)
  }

  return {
    currentImage,
    isUploading,
    handleUpload,
    handleReset,
  }
}
