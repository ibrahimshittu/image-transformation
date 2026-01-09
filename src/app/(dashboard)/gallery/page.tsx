'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ImageCard } from '@/components/gallery/image-card'
import { Navbar } from '@/components/layout/navbar'
import { UploadModal } from '@/components/upload/upload-modal'
import { Plus, Images, ArrowLeft, ArrowRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'

interface ImageData {
  id: string
  originalUrl: string
  originalFilename: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  createdAt: string
  transformations: Array<{
    id: string
    outputUrl: string | null
  }>
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function GalleryPage() {
  const [images, setImages] = useState<ImageData[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const { toast } = useToast()
  const { user, signOut } = useAuth()

  const fetchImages = useCallback(async (page: number = 1) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/images?page=${page}&limit=12`)
      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }
      const data = await response.json()
      setImages(data.images)
      setPagination(data.pagination)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching images:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load images',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchImages(1)
  }, [fetchImages])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/images/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      setImages((prev) => prev.filter((img) => img.id !== id))

      if (pagination) {
        setPagination({ ...pagination, total: pagination.total - 1 })
      }

      toast({
        title: 'Image deleted',
        description: 'The image has been permanently removed.',
      })

      if (images.length === 1 && currentPage > 1) {
        fetchImages(currentPage - 1)
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      toast({
        variant: 'destructive',
        title: 'Delete failed',
        description: 'Could not delete the image. Please try again.',
      })
      throw error
    }
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} onSignOut={handleSignOut} />
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={() => fetchImages(1)}
      />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Your Images</h1>
            {!isLoading && pagination && (
              <p className="text-sm text-gray-500 mt-1">
                {pagination.total} {pagination.total === 1 ? 'image' : 'images'}
              </p>
            )}
          </div>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="rounded-lg bg-black text-white hover:bg-gray-800 px-4 sm:px-6 h-9 sm:h-10 text-sm sm:text-[15px] font-medium gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Upload</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm animate-pulse"
              >
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 border-t border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Images className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No images yet</h2>
            <p className="text-gray-500 mb-6 max-w-sm">
              Upload your first image to get started with background removal.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {images.map((image) => (
                <ImageCard
                  key={image.id}
                  id={image.id}
                  originalUrl={image.originalUrl}
                  originalFilename={image.originalFilename}
                  status={image.status}
                  processedUrl={image.transformations?.[0]?.outputUrl}
                  createdAt={image.createdAt}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchImages(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchImages(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="gap-1"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
