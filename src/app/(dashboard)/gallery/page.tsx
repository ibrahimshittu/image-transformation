'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ImageCard } from '@/components/gallery/image-card'
import { Plus, Images, Loader2, ArrowLeft, ArrowRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

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
  const { toast } = useToast()

  const fetchImages = async (page: number = 1) => {
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
  }

  useEffect(() => {
    fetchImages(1)
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/images/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      // Remove from local state
      setImages((prev) => prev.filter((img) => img.id !== id))

      // Update pagination count
      if (pagination) {
        setPagination({ ...pagination, total: pagination.total - 1 })
      }

      toast({
        title: 'Image deleted',
        description: 'The image has been permanently removed.',
      })

      // Refetch if we deleted the last item on the page
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
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar - same style as main page */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-xl z-50 transition-all duration-300 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold tracking-tight text-black">
              Uplane
              <span className="text-sm pl-1 font-light text-gray-400">Background Remover</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/gallery">
              <Button
                variant="ghost"
                className="text-[15px] font-medium text-black hover:text-black hover:bg-transparent px-4 gap-2"
              >
                <Images className="w-4 h-4" />
                Gallery
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="text-[15px] font-medium text-gray-600 hover:text-black hover:bg-transparent px-4"
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 pt-28 pb-12">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Images</h1>
            {!isLoading && pagination && (
              <p className="text-sm text-gray-500 mt-1">
                {pagination.total} {pagination.total === 1 ? 'image' : 'images'}
              </p>
            )}
          </div>
          <Link href="/">
            <Button className="rounded-lg bg-black text-white hover:bg-gray-800 px-6 h-10 text-[15px] font-medium gap-2">
              <Plus className="w-4 h-4" />
              New Upload
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <p className="mt-4 text-gray-500">Loading your images...</p>
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
            <Link href="/">
              <Button className="gap-2 bg-black hover:bg-gray-800">
                <Plus className="w-4 h-4" />
                Upload Image
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Image Grid */}
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

            {/* Pagination */}
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
                  Previous
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
                  Next
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
