'use client'

import { useState } from 'react'
import { Download, Eye, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TransformationViewerProps {
  originalUrl: string
  processedUrl: string | null
  status: string
  isProcessing: boolean
  onDownload: () => void
  onReset?: () => void
}

export function TransformationViewer({
  originalUrl,
  processedUrl,
  status,
  isProcessing,
  onDownload,
  onReset,
}: TransformationViewerProps) {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'compare'>('side-by-side')
  const [showOriginal, setShowOriginal] = useState(false)

  const isCompleted = status === 'COMPLETED' && processedUrl
  const isFailed = status === 'FAILED'

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header with controls */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            isProcessing ? 'bg-blue-100 text-blue-700' :
            isCompleted ? 'bg-green-100 text-green-700' :
            isFailed ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            {isProcessing && (
              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            )}
            {isProcessing ? 'Processing...' : isCompleted ? 'Completed' : isFailed ? 'Failed' : status}
          </div>

          {/* View mode toggle */}
          {isCompleted && (
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'side-by-side' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Side by Side
              </button>
              <button
                onClick={() => setViewMode('compare')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'compare' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Compare
              </button>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {onReset && (
            <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              New Upload
            </Button>
          )}
          {isCompleted && (
            <Button size="sm" onClick={onDownload} className="bg-black hover:bg-gray-800 text-white gap-2">
              <Download className="w-4 h-4" />
              Download HD
            </Button>
          )}
        </div>
      </div>

      {/* Image viewer */}
      <div className="p-6">
        {viewMode === 'side-by-side' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 text-center">Original</p>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[url('/grid-pattern.svg')] bg-repeat border border-gray-200">
                <img
                  src={originalUrl}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Processed */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 text-center">Background Removed</p>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[url('/grid-pattern.svg')] bg-repeat border border-gray-200">
                {isProcessing ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gray-50">
                    <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full" />
                    <p className="text-sm text-gray-500">Removing background...</p>
                  </div>
                ) : isCompleted ? (
                  <img
                    src={processedUrl}
                    alt="Processed"
                    className="w-full h-full object-contain"
                  />
                ) : isFailed ? (
                  <div className="w-full h-full flex items-center justify-center text-red-500 bg-red-50">
                    Failed to process
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                    Waiting...
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Compare mode */
          <div className="max-w-2xl mx-auto">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[url('/grid-pattern.svg')] bg-repeat border border-gray-200">
              {isProcessing ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gray-50">
                  <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full" />
                  <p className="text-sm text-gray-500">Removing background...</p>
                </div>
              ) : (
                <>
                  <img
                    src={showOriginal ? originalUrl : (processedUrl || originalUrl)}
                    alt="Preview"
                    className="w-full h-full object-contain transition-opacity"
                  />
                  <button
                    onMouseDown={() => setShowOriginal(true)}
                    onMouseUp={() => setShowOriginal(false)}
                    onMouseLeave={() => setShowOriginal(false)}
                    onTouchStart={() => setShowOriginal(true)}
                    onTouchEnd={() => setShowOriginal(false)}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-black transition-colors cursor-pointer backdrop-blur-sm"
                  >
                    <Eye className="h-4 w-4" />
                    Hold to see original
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
