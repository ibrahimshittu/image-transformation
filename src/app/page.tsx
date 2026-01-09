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
import { useUpload } from '@/hooks/use-upload'

function HomeContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { currentImage, isUploading, handleUpload, handleReset } = useUpload()
  const searchParams = useSearchParams()
  const router = useRouter()

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

  const onUpload = (file: File) => {
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }
    handleUpload(file)
  }

  const handleSignOut = async () => {
    await signOut()
    handleReset()
  }

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100">
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseModal} />
      <Navbar user={user} onSignOut={handleSignOut} onOpenAuth={() => setIsAuthModalOpen(true)} />
      <HeroSection
        user={user}
        currentImage={currentImage}
        isUploading={isUploading}
        onUpload={onUpload}
        onReset={handleReset}
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
