'use client'

import { useState } from 'react'
import { Dropzone } from '@/components/upload/dropzone'
import { TransformationViewer } from '@/components/upload/transformation-viewer'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Image {
  id: string
  originalUrl: string
  originalFilename: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  transformations: Array<{
    id: string
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
    outputUrl: string | null
    processingTime: number | null
  }>
}

export default function DashboardPage() {
  const [currentImage, setCurrentImage] = useState<Image | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    setError(null)

    try {
      // Step 1: Upload
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image')
      }

      const uploadedImage = await uploadResponse.json()
      
      // Update state immediately to show the viewer in "Processing" state (simulated until we trigger real processing)
      const initialImageState: Image = {
         ...uploadedImage,
         status: 'PROCESSING', // Optimistic update
         transformations: []
      }
      setCurrentImage(initialImageState)

      // Step 2: Trigger Transformation
      const transformResponse = await fetch('/api/transformations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId: uploadedImage.id }),
      })

      if (!transformResponse.ok) {
        throw new Error('Failed to start processing')
      }

      const transformationResult = await transformResponse.json()
      
      // Update state with result
      setCurrentImage({
        ...initialImageState,
        status: transformationResult.status,
        transformations: [transformationResult]
      })

    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setCurrentImage((prev) => prev ? { ...prev, status: 'FAILED' } : null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleReset = () => {
    setCurrentImage(null)
    setError(null)
  }

  const handleDownload = () => {
    const url = currentImage?.transformations?.[0]?.outputUrl
    if (url) {
      const link = document.createElement('a')
      link.href = url
      link.download = `processed_${currentImage.originalFilename}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Uplane Dashboard</span>
          </div>
          
          {currentImage && (
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <Plus className="w-4 h-4" />
              New Upload
            </Button>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          {error && (
             <div className="w-full max-w-md p-4 mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
               {error}
             </div>
          )}

          {!currentImage ? (
            <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
              <Dropzone onUpload={handleUpload} isUploading={isUploading} />
            </div>
          ) : (
            <div className="w-full animate-in fade-in duration-500">
               <TransformationViewer
                 originalUrl={currentImage.originalUrl}
                 processedUrl={currentImage.transformations?.[0]?.outputUrl || null}
                 status={currentImage.status}
                 isProcessing={isUploading || currentImage.status === 'PROCESSING'}
                 onDownload={handleDownload}
               />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
