'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { TransformationViewer } from '@/components/upload/transformation-viewer'
import { Check, Upload } from 'lucide-react'

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

interface HeroSectionProps {
  user: { id: string; email?: string } | null
  currentImage: Image | null
  isUploading: boolean
  onUpload: (file: File) => void
  onReset: () => void
  onDownload: () => void
  onOpenAuth: () => void
}

export function HeroSection({
  user,
  currentImage,
  isUploading,
  onUpload,
  onReset,
  onDownload,
  onOpenAuth,
}: HeroSectionProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        onUpload(file)
      }
    },
    [onUpload]
  )

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
    noClick: true,
  })

  return (
    <section className="pt-24 sm:pt-32 pb-16 lg:pt-40 lg:pb-24 px-4 sm:px-6 max-w-[1400px] mx-auto">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
        <div className="text-center lg:text-left space-y-6 max-w-xl mx-auto lg:mx-0">
          <div className="flex justify-center lg:justify-start">
            <img
              src="/hero-thumb.png"
              alt="Background Removed Preview"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-sm border border-gray-100 object-cover"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Free Image <br />
            Background Remover
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal max-w-lg mx-auto lg:mx-0">
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

        <div className="w-full">
          {!currentImage && !isUploading ? (
            <div
              {...getRootProps()}
              className="bg-white rounded-3xl p-3 shadow-lg shadow-gray-100/50 border border-gray-100 aspect-square sm:aspect-[4/3] relative group overflow-hidden"
            >
              <input {...getInputProps()} />
              <div
                className={`w-full h-full bg-gray-50/30 rounded-2xl border border-dashed flex flex-col items-center justify-center relative transition-all duration-300 ${
                  isDragActive ? 'border-black bg-gray-100' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {isDragActive ? (
                  <div className="text-center space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-gray-600 animate-bounce" />
                    <p className="text-gray-600 font-medium">Drop your image here</p>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!user) {
                          onOpenAuth()
                        } else {
                          open()
                        }
                      }}
                      className="h-11 px-8 bg-black hover:bg-gray-800 text-white font-medium rounded-lg text-sm shadow-md transition-transform hover:-translate-y-0.5"
                    >
                      Upload Image
                    </Button>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                      or drop photos here
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <TransformationViewer
              originalUrl={currentImage?.originalUrl || ''}
              processedUrl={currentImage?.transformations?.[0]?.outputUrl || null}
              isProcessing={isUploading || currentImage?.status === 'PROCESSING'}
              onDownload={onDownload}
              onReset={onReset}
            />
          )}
        </div>
      </div>
    </section>
  )
}
