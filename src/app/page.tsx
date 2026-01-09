'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { CompareSlider } from '@/components/home/compare-slider'
import { AuthModal } from '@/components/auth/auth-modal'
import { TransformationViewer } from '@/components/upload/transformation-viewer'
import { Check, Upload, Images } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

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

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [currentImage, setCurrentImage] = useState<Image | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  // Check auth state on mount
  useEffect(() => {
    const supabase = createClient()

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Open modal if redirected here for auth
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
      // Step 1: Upload
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

      setCurrentImage({
        ...initialImageState,
        status: transformationResult.status,
        transformations: [transformationResult]
      })

    } catch (err) {
      console.error(err)
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: err instanceof Error ? err.message : 'Something went wrong',
      })
      setCurrentImage((prev) => prev ? { ...prev, status: 'FAILED' } : null)
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
        const response = await fetch(url)
        const blob = await response.blob()
        const blobUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = `processed_${currentImage.originalFilename.replace(/\.[^/.]+$/, '')}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
      } catch (error) {
        console.error('Download failed:', error)
        toast({
          variant: "destructive",
          title: "Download failed",
          description: "Could not download the image. Please try again.",
        })
      }
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      handleUpload(file)
    }
  }, [user])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: isUploading,
    noClick: true
  })

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setCurrentImage(null)
  }

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100">
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseModal} />

      {/* Navbar */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-xl z-50 transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold tracking-tight text-black">
              Uplane
              <span className="text-sm pl-1 font-light text-gray-400">Background Remover</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/gallery">
                  <Button
                    variant="ghost"
                    className="text-[15px] font-medium text-gray-600 hover:text-black hover:bg-transparent px-4 gap-2"
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
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="hidden sm:block text-[15px] font-medium text-gray-600 hover:text-black hover:bg-transparent px-4"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Log in
                </Button>
                <Button
                  className="rounded-lg bg-black text-white hover:bg-gray-800 px-6 h-10 text-[15px] font-medium transition-transform hover:scale-105"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 px-6 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-6 max-w-xl mx-auto lg:mx-0">
            <div className="flex justify-center lg:justify-start">
              <img
                src="/hero-thumb.png"
                alt="Background Removed Preview"
                className="w-20 h-20 rounded-2xl shadow-sm border border-gray-100 object-cover"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Free Image <br />
              Background Remover
            </h1>
            <p className="text-base text-gray-600 leading-relaxed font-normal max-w-lg mx-auto lg:mx-0">
              Instantly remove background from any image using Uplane&apos;s AI Background Remover. Free and easy to use!
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
                <span className="text-sm font-medium text-gray-600">Free HD Download</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
                <span className="text-sm font-medium text-gray-600">No watermark</span>
              </div>
            </div>
          </div>

          {/* Right Card - Upload Area or Transformation Viewer */}
          <div className="w-full">
            {!currentImage ? (
              <div
                {...getRootProps()}
                className="bg-white rounded-3xl p-3 shadow-lg shadow-gray-100/50 border border-gray-100 aspect-square sm:aspect-[4/3] relative group overflow-hidden"
              >
                <input {...getInputProps()} />

                <div className={`w-full h-full bg-gray-50/30 rounded-2xl border border-dashed flex flex-col items-center justify-center relative transition-all duration-300 ${
                  isDragActive
                    ? 'border-black bg-gray-100'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  {isDragActive ? (
                    <div className="text-center space-y-4">
                      <Upload className="w-12 h-12 mx-auto text-gray-600 animate-bounce" />
                      <p className="text-gray-600 font-medium">Drop your image here</p>
                    </div>
                  ) : isUploading ? (
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 mx-auto border-4 border-black border-t-transparent rounded-full animate-spin" />
                      <p className="text-gray-600 font-medium">Uploading...</p>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!user) {
                            setIsAuthModalOpen(true)
                          } else {
                            open()
                          }
                        }}
                        className="h-11 px-8 bg-black hover:bg-gray-800 text-white font-medium rounded-lg text-sm shadow-md transition-transform hover:-translate-y-0.5"
                      >
                        Upload Image
                      </Button>
                      <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">or drop photos here</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <TransformationViewer
                originalUrl={currentImage.originalUrl}
                processedUrl={currentImage.transformations?.[0]?.outputUrl || null}
                status={currentImage.status}
                isProcessing={isUploading || currentImage.status === 'PROCESSING'}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="w-full bg-black md:rounded-2xl text-white py-12 md:py-16 px-6">
            <h2 className="text-2xl md:text-[32px] font-bold text-center">
              How to remove background from a picture
            </h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mt-6 md:mt-10 max-w-6xl mx-auto">
              <li className="flex flex-col col-span-3 md:col-span-1 p-6 bg-white/10 rounded-2xl border border-white/20">
                <div className="flex gap-x-2 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-lg text-black font-semibold shrink-0">
                    1
                  </span>
                  <h3 className="text-white font-bold text-lg leading-6">Upload your image</h3>
                </div>
                <div className="text-gray-300">
                  <p>
                    Click <strong className="text-white">Upload image</strong> and select a JPG, PNG, or HEIC file to begin editing. For best results, use a high-quality image where the subject has clear, defined edges.
                  </p>
                </div>
              </li>
              <li className="flex flex-col col-span-3 md:col-span-1 p-6 bg-white/10 rounded-2xl border border-white/20">
                <div className="flex gap-x-2 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-lg text-black font-semibold shrink-0">
                    2
                  </span>
                  <h3 className="text-white font-bold text-lg leading-6">Remove background automatically</h3>
                </div>
                <div className="text-gray-300">
                  <p>
                    Uplane will <strong className="text-white">automatically remove the background</strong> from your image in seconds. After, you can refine the cutout or add a new background.
                  </p>
                </div>
              </li>
              <li className="flex flex-col col-span-3 md:col-span-1 p-6 bg-white/10 rounded-2xl border border-white/20">
                <div className="flex gap-x-2 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-lg text-black font-semibold shrink-0">
                    3
                  </span>
                  <h3 className="text-white font-bold text-lg leading-6">Download image</h3>
                </div>
                <div className="text-gray-300">
                  <p>
                    Download your image as a PNG with no background or keep editing with Uplane until your image is ready to be shared or used on your next project.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>


      {/* Feature Section (Slider) */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 max-w-lg">
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                Instant and automatic background remover
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-normal">
                <p>
                  Our BG Remover automatically removes the background in less than 3 seconds!
                  With our AI-powered technology, you&apos;ll be amazed at how quickly and perfectly you can remove the background in your images.
                </p>
                <p>
                  Gone are the days of tedious manual editing—just let Uplane&apos;s free background eraser do its wonders.
                </p>
              </div>
              <div className="pt-2">
                <Button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                    if (!user) {
                      setIsAuthModalOpen(true)
                    }
                  }}
                  className="rounded-lg px-8 h-12 bg-black hover:bg-gray-800 text-white font-medium text-sm"
                >
                  Try it now
                </Button>
              </div>
            </div>
            <div className="w-full">
              <CompareSlider />
            </div>
          </div>
        </div>
      </section>



      {/* Simplified Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-2xl font-bold tracking-tight text-black">
              Uplane
              <span className="text-sm pl-1 font-light text-gray-400">Background Remover</span>
            </Link>
          </div>
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Uplane. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
