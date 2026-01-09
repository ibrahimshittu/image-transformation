'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Eye, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TransformationViewerProps {
  originalUrl: string
  processedUrl: string | null
  isProcessing: boolean
  onReset?: () => void
}

export function TransformationViewer({
  originalUrl,
  processedUrl,
  isProcessing,
  onReset,
}: TransformationViewerProps) {
  const [showOriginal, setShowOriginal] = useState(false)
  const [processedImageLoaded, setProcessedImageLoaded] = useState(false)

  const isCompleted = !!processedUrl

  // Reset loaded state and preload original when processedUrl changes
  useEffect(() => {
    if (processedUrl) {
      setProcessedImageLoaded(false)
    }
  }, [processedUrl])

  // Preload original image so it's ready for instant switching
  useEffect(() => {
    if (originalUrl) {
      const img = new Image()
      img.src = originalUrl
    }
  }, [originalUrl])

  const handleOpenImage = () => {
    if (processedUrl) {
      window.open(processedUrl, '_blank')
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden w-full">
      <div className="flex items-center justify-end px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          {onReset && (
            <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              New Upload
            </Button>
          )}
          {isCompleted && (
            <Button size="sm" onClick={handleOpenImage} className="bg-black hover:bg-gray-800 text-white gap-2">
              <ExternalLink className="w-4 h-4" />
              Open
            </Button>
          )}
        </div>
      </div>

      {/* Image viewer - single view with hold to compare */}
      <div className="p-6">
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[url('/grid-pattern.svg')] bg-repeat border border-gray-200">
          {isProcessing ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gray-50">
              <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full" />
              <p className="text-sm text-gray-500">Removing background...</p>
            </div>
          ) : (
            <>
              {/* Original image - shown when holding button */}
              <img
                src={originalUrl}
                alt="Original"
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-150 ${showOriginal ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              />
              {/* Processed image - shown by default */}
              <img
                src={processedUrl || originalUrl}
                alt="Processed"
                className={`w-full h-full object-contain transition-opacity duration-150 ${!showOriginal && processedImageLoaded ? 'opacity-100' : showOriginal ? 'opacity-0' : 'opacity-0'}`}
                onLoad={() => setProcessedImageLoaded(true)}
              />
              {!processedImageLoaded && isCompleted && !showOriginal && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="animate-spin h-6 w-6 border-2 border-black border-t-transparent rounded-full" />
                </div>
              )}
              {isCompleted && processedImageLoaded && (
                <button
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  onMouseLeave={() => setShowOriginal(false)}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    setShowOriginal(true)
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault()
                    setShowOriginal(false)
                  }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-black transition-colors cursor-pointer backdrop-blur-sm z-20 select-none"
                >
                  <Eye className="h-4 w-4" />
                  Hold to see original
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
