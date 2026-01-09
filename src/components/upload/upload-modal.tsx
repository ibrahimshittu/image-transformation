'use client'

import { useDropzone } from 'react-dropzone'
import { X, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TransformationViewer } from '@/components/upload/transformation-viewer'
import { useUpload } from '@/hooks/use-upload'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadComplete?: () => void
}

export function UploadModal({ isOpen, onClose, onUploadComplete }: UploadModalProps) {
  const { currentImage, isUploading, handleUpload, handleReset } = useUpload(onUploadComplete)

  const handleClose = () => {
    handleReset()
    onClose()
  }

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      handleUpload(file)
    }
  }

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Remove Background
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {!currentImage && !isUploading ? (
            <div
              {...getRootProps()}
              className={`w-full aspect-[4/3] border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${isDragActive
                ? 'border-black bg-gray-50'
                : 'border-gray-300 hover:border-gray-400'
                }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <div className="text-center space-y-3">
                  <Upload className="w-12 h-12 mx-auto text-gray-600 animate-bounce" />
                  <p className="text-gray-600 font-medium">Drop your image here</p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
                    <Upload className="w-7 h-7 text-gray-500" />
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        open()
                      }}
                      className="h-11 px-8 bg-black hover:bg-gray-800 text-white font-medium rounded-lg text-sm"
                    >
                      Choose Image
                    </Button>
                    <p className="text-gray-400 text-sm">or drag and drop here</p>
                  </div>
                  <p className="text-gray-400 text-xs">PNG, JPG, WEBP up to 10MB</p>
                </div>
              )}
            </div>
          ) : (
            <TransformationViewer
              originalUrl={currentImage?.originalUrl || ''}
              processedUrl={currentImage?.transformations?.[0]?.outputUrl || null}
              isProcessing={isUploading || currentImage?.status === 'PROCESSING'}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  )
}
