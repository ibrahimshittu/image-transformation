'use client'

import { TransformationViewer } from '@/components/upload/transformation-viewer'

export function HeroDemo() {
  return (
    <div className="w-full max-w-5xl mx-auto transform hover:scale-[1.01] transition-transform duration-500">
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-2 sm:p-4">
        <TransformationViewer
            originalUrl="/demo-original.png"
            processedUrl="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800&h=600" // Placeholder for now, ideally we'd have a matched pair
            status="COMPLETED"
            isProcessing={false}
            onDownload={() => alert("This is a demo! Sign in to process your own images.")}
        />
        <div className="text-center mt-4 pb-2">
            <p className="text-sm text-gray-400">
                Interactive Demo • Hold "Compare" to see the magic
            </p>
        </div>
      </div>
    </div>
  )
}
