'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DropzoneProps {
  onUpload: (file: File) => Promise<void>
  isUploading: boolean
}

export function Dropzone({ onUpload, isUploading }: DropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      onUpload(file)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: isUploading,
    noClick: true // We'll handle clicks on the button specifically to avoid accidental clicks on the simplified area
  })

  return (
    <div
      {...getRootProps()}
      className={`
        relative overflow-hidden rounded-2xl transition-all duration-200
        ${isDragActive ? 'ring-4 ring-blue-500/20 bg-blue-50' : 'bg-white shadow-xl shadow-gray-200/50'}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="px-8 py-16 sm:px-16 sm:py-24 text-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-2">
            <ImageIcon className="w-10 h-10 text-blue-600" />
          </div>
          
          <div className="space-y-2">
             <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Upload an Image
            </h2>
            <p className="text-lg text-gray-500 max-w-lg mx-auto">
              Remove background and flip instantly. <br className="hidden sm:block" />
              Drop your image here or click the button below.
            </p>
          </div>

          <div className="pt-4">
             <Button 
              onClick={open} 
              size="lg" 
              className="h-14 px-8 text-lg font-semibold rounded-full shadow-lg shadow-blue-600/20 bg-blue-600 hover:bg-blue-700 transition-all hover:scale-105"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </div>
          
          <p className="text-xs text-gray-400 mt-8">
            Supports PNG, JPG, WEBP upto 10MB
          </p>
        </div>
      </div>

      {/* Drag Overlay */}
      {isDragActive && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-blue-500/90 backdrop-blur-sm transition-opacity">
          <div className="text-center text-white">
            <Upload className="w-16 h-16 mx-auto mb-4 animate-bounce" />
            <p className="text-2xl font-bold">Drop existing image here</p>
          </div>
        </div>
      )}
    </div>
  )
}
