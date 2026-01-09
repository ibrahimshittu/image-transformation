'use client'

import { useState } from 'react'
import { Download, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface TransformationViewerProps {
  originalUrl: string
  processedUrl: string | null
  status: string
  isProcessing: boolean
  onDownload: () => void
}

export function TransformationViewer({
  originalUrl,
  processedUrl,
  status,
  isProcessing,
  onDownload,
}: TransformationViewerProps) {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'toggle'>('side-by-side')
  const [showOriginal, setShowOriginal] = useState(false)

  const isCompleted = status === 'COMPLETED' && processedUrl
  const isFailed = status === 'FAILED'

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge
            variant={isCompleted ? "default" : isFailed ? "destructive" : "secondary"}
            className={`h-8 px-3 ${isCompleted ? 'bg-black text-white' : ''}`}
          >
            {isProcessing ? 'Processing...' : status}
          </Badge>

          <div className="flex bg-gray-100 p-1 rounded-lg">
             <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'side-by-side' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Side by Side
            </button>
            <button
              onClick={() => setViewMode('toggle')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'toggle' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Compare
            </button>
          </div>
        </div>

        {isCompleted && (
          <Button onClick={onDownload} size="lg" className="bg-black hover:bg-gray-800 text-white">
            <Download className="mr-2 h-4 w-4" />
            Download HD
          </Button>
        )}
      </div>

      {/* Viewer */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 min-h-[500px] flex items-center justify-center">
        {viewMode === 'side-by-side' ? (
          <div className="grid grid-cols-2 gap-8 w-full">
            <div className="space-y-3">
              <p className="text-center text-sm font-medium text-gray-500">Original</p>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[url('/grid-pattern.svg')] border border-gray-200">
                <img
                  src={originalUrl}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-center text-sm font-medium text-gray-500">Removed Background</p>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[url('/grid-pattern.svg')] border border-gray-200">
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
          <div className="relative w-full max-w-3xl aspect-[4/3] rounded-xl overflow-hidden bg-[url('/grid-pattern.svg')] border border-gray-200 group">
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
                   className="w-full h-full object-contain"
                 />
                 <button
                   onMouseDown={() => setShowOriginal(true)}
                   onMouseUp={() => setShowOriginal(false)}
                   onMouseLeave={() => setShowOriginal(false)}
                   className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors cursor-pointer"
                 >
                   <Eye className="h-4 w-4" />
                   Hold to see original
                 </button>
               </>
             )}
          </div>
        )}
      </div>
    </div>
  )
}
