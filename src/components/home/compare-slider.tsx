'use client'

import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { ChevronsLeftRight } from 'lucide-react'

export function CompareSlider() {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white relative">
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage
            src="/demo-clean-original.png"
            srcSet="/demo-clean-original.png"
            alt="Original Image"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        }
        itemTwo={
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'url(/grid-pattern.svg?v=2)',
              backgroundRepeat: 'repeat',
              backgroundColor: '#ffffff'
            }}
          >
            <ReactCompareSliderImage
              src="/demo-clean-removed.png"
              srcSet="/demo-clean-removed.png"
              alt="Background Removed"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        }
        handle={
          <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-black border-2 border-gray-200 cursor-ew-resize absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 hover:scale-110 transition-transform">
            <ChevronsLeftRight className="w-5 h-5" />
          </div>
        }
        className="aspect-[4/3]"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
