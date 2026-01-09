'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AuthModal } from '@/components/auth/auth-modal'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/home/hero-section'
import { HowItWorks } from '@/components/home/how-it-works'
import { FeatureSection } from '@/components/home/feature-section'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { downloadImage } from '@/lib/download'

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

function HomeContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState<Image | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { user, signOut } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (searchParams.get('auth') === 'required') {
      setIsAuthModalOpen(true)
    }
  }, [searchParams])

  const handleCloseModal = () => {
    setIsAuthModalOpen(false)
    if (searchParams.get('auth') === 'required') {
      router.replace('/', { scroll: false })
    }
  }

  const handleUpload = async (file: File) => {
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }

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

  const handleDownload = async () => {
    const url = currentImage?.transformations?.[0]?.outputUrl
    if (url && currentImage) {
      try {
        const filename = `processed_${currentImage.originalFilename.replace(/\.[^/.]+$/, '')}.png`
        await downloadImage(url, filename)
      } catch (error) {
        console.error('Download failed:', error)
        toast({
          variant: 'destructive',
          title: 'Download failed',
          description: 'Could not download the image. Please try again.',
        })
      }
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setCurrentImage(null)
  }

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100">
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseModal} />
      <Navbar user={user} onSignOut={handleSignOut} onOpenAuth={() => setIsAuthModalOpen(true)} />
      <HeroSection
        user={user}
        currentImage={currentImage}
        isUploading={isUploading}
        onUpload={handleUpload}
        onReset={handleReset}
        onDownload={handleDownload}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />
      <HowItWorks />
      <FeatureSection user={user} onOpenAuth={() => setIsAuthModalOpen(true)} />
      <Footer />
    </main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <HomeContent />
    </Suspense>
  )
}
