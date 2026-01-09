'use client'

/**
 * Image Result Component
 *
 * Displays the before/after comparison of an image transformation.
 * Shows the unique URL for the processed image.
 */

import { useState } from 'react'
import { Copy, Check, Download, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ImageResultProps {
  image: {
    id: string
    originalUrl: string
    originalFilename: string
    status: string
    createdAt: string
    transformations?: Array<{
      id: string
      status: string
      outputUrl: string | null
      processingTime: number | null
    }>
  }
  onDelete: (id: string) => Promise<void>
  isDeleting: boolean
}

export function ImageResult({ image, onDelete, isDeleting }: ImageResultProps) {
  const [copied, setCopied] = useState(false)

  const latestTransformation = image.transformations?.[0]
  const outputUrl = latestTransformation?.outputUrl

  const handleCopy = async () => {
    if (outputUrl) {
      await navigator.clipboard.writeText(outputUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (outputUrl) {
      const link = document.createElement('a')
      link.href = outputUrl
      link.download = `processed_${image.originalFilename}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getStatusBadge = () => {
    switch (image.status) {
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>
      case 'PROCESSING':
        return <Badge variant="default">Processing...</Badge>
      case 'COMPLETED':
        return <Badge className="bg-green-500">Completed</Badge>
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-gray-900 truncate max-w-[200px]">
            {image.originalFilename}
          </h3>
          {getStatusBadge()}
        </div>
        <div className="flex items-center gap-2">
          {outputUrl && (
            <>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(outputUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(image.id)}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Images */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {/* Original */}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">Original</p>
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={image.originalUrl}
              alt="Original"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Processed */}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">
            Processed (BG Removed + Flipped)
          </p>
          <div
            className="relative aspect-square rounded-lg overflow-hidden"
            style={{
              backgroundImage:
                'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              backgroundColor: '#fff',
            }}
          >
            {outputUrl ? (
              <img
                src={outputUrl}
                alt="Processed"
                className="w-full h-full object-contain"
              />
            ) : image.status === 'PROCESSING' ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
              </div>
            ) : image.status === 'FAILED' ? (
              <div className="w-full h-full flex items-center justify-center text-red-500">
                Processing failed
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Not processed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* URL Section */}
      {outputUrl && (
        <div className="px-4 pb-4">
          <p className="text-sm font-medium text-gray-500 mb-2">
            Unique Image URL
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={outputUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg truncate"
            />
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          {latestTransformation?.processingTime && (
            <p className="text-xs text-gray-500 mt-2">
              Processed in {(latestTransformation.processingTime / 1000).toFixed(2)}s
            </p>
          )}
        </div>
      )}
    </div>
  )
}
