'use client'

import { Button } from '@/components/ui/button'
import { CompareSlider } from '@/components/home/compare-slider'

interface FeatureSectionProps {
  user: { id: string; email?: string } | null
  onOpenAuth: () => void
}

export function FeatureSection({ user, onOpenAuth }: FeatureSectionProps) {
  const handleTryNow = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (!user) {
      onOpenAuth()
    }
  }

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 max-w-lg order-2 lg:order-1 text-center lg:text-left mx-auto lg:mx-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              Instant and automatic background remover
            </h2>
            <div className="space-y-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              <p>
                Our BG Remover automatically removes the background in less than 3 seconds! With our AI-powered technology, you&apos;ll be amazed at how quickly and perfectly you can remove the background in your images.
              </p>
              <p>
                Gone are the days of tedious manual editing—just let Uplane&apos;s free background eraser do its wonders.
              </p>
            </div>
            <div className="pt-2">
              <Button
                onClick={handleTryNow}
                className="rounded-lg px-8 h-12 bg-black hover:bg-gray-800 text-white font-medium text-sm"
              >
                Try it now
              </Button>
            </div>
          </div>
          <div className="w-full order-1 lg:order-2">
            <CompareSlider />
          </div>
        </div>
      </div>
    </section>
  )
}
