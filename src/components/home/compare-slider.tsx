'use client'

import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { ChevronsLeftRight } from 'lucide-react'

export function CompareSlider() {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white">
      <ReactCompareSlider
        itemOne={
          <div className="w-full h-full relative">
            <ReactCompareSliderImage
              src="/demo-clean-original.png"
              srcSet="/demo-clean-original.png"
              alt="Original Image"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="absolute bottom-4 left-4 bg-black text-white text-xs font-medium px-3 py-1.5 rounded-md z-10 pointer-events-none">
              Before
            </div>
          </div>
        }
        itemTwo={
          <div
            className="w-full h-full relative"
            style={{
              backgroundImage: 'url(/grid-pattern.svg)',
              backgroundRepeat: 'repeat',
              backgroundColor: '#f9fafb'
            }}
          >
            <ReactCompareSliderImage
              src="/demo-clean-removed.png"
              srcSet="/demo-clean-removed.png"
              alt="Background Removed"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="absolute bottom-4 right-4 bg-black text-white text-xs font-medium px-3 py-1.5 rounded-md">
              After
            </div>
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
