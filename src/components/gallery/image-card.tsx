'use client'

import { useState } from 'react'
import { Trash2, Download, Loader2, X, Expand } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageCardProps {
  id: string
  originalUrl: string
  originalFilename: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  processedUrl?: string | null
  createdAt: string
  onDelete: (id: string) => Promise<void>
}

export function ImageCard({
  id,
  originalUrl,
  originalFilename,
  status,
  processedUrl,
  createdAt,
  onDelete,
}: ImageCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(id)
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  const handleDownload = async () => {
    const url = processedUrl || originalUrl
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      const filename = processedUrl
        ? `processed_${originalFilename.replace(/\.[^/.]+$/, '')}.png`
        : originalFilename
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const displayUrl = processedUrl || originalUrl
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
        {/* Image Preview */}
        <div
          className="aspect-square relative bg-[url('/grid-pattern.svg')] bg-repeat cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <img
            src={displayUrl}
            alt={originalFilename}
            className="w-full h-full object-contain"
          />

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation()
                setShowModal(true)
              }}
            >
              <Expand className="w-4 h-4" />
            </Button>
            {status === 'COMPLETED' && (
              <Button
                size="sm"
                variant="secondary"
                className="bg-white hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownload()
                }}
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="secondary"
              className="bg-white hover:bg-red-50 text-red-600 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation()
                setShowConfirm(true)
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Delete Confirmation Overlay */}
          {showConfirm && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 p-4">
              <p className="text-white text-sm text-center font-medium">Delete this image?</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowConfirm(false)
                  }}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete()
                  }}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Delete'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="p-3 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-900 truncate" title={originalFilename}>
            {originalFilename}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{formattedDate}</p>
        </div>
      </div>

      {/* View Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal Content */}
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{originalFilename}</p>
                <p className="text-xs text-gray-500">{formattedDate}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {status === 'COMPLETED' && (
                  <Button
                    size="sm"
                    onClick={handleDownload}
                    className="bg-black hover:bg-gray-800 text-white gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="bg-[url('/grid-pattern.svg')] bg-repeat p-4">
              <img
                src={displayUrl}
                alt={originalFilename}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
