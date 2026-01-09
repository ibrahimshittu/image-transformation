export function HowItWorks() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="w-full bg-black md:rounded-2xl text-white py-10 sm:py-12 md:py-16 px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl md:text-[32px] font-bold text-center">
            How to remove background from a picture
          </h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 md:mt-10 max-w-6xl mx-auto">
            <li className="flex flex-col p-4 sm:p-6 bg-white/10 rounded-2xl border border-white/20">
              <div className="flex gap-x-2 mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-lg text-black font-semibold shrink-0">
                  1
                </span>
                <h3 className="text-white font-bold text-base sm:text-lg leading-6">Upload your image</h3>
              </div>
              <p className="text-gray-300 text-sm sm:text-base">
                Click <strong className="text-white">Upload image</strong> and select a JPG, PNG, or HEIC file to begin editing.
              </p>
            </li>
            <li className="flex flex-col p-4 sm:p-6 bg-white/10 rounded-2xl border border-white/20">
              <div className="flex gap-x-2 mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-lg text-black font-semibold shrink-0">
                  2
                </span>
                <h3 className="text-white font-bold text-base sm:text-lg leading-6">Remove background</h3>
              </div>
              <p className="text-gray-300 text-sm sm:text-base">
                Uplane will <strong className="text-white">automatically remove the background</strong> from your image in seconds.
              </p>
            </li>
            <li className="flex flex-col sm:col-span-2 lg:col-span-1 p-4 sm:p-6 bg-white/10 rounded-2xl border border-white/20">
              <div className="flex gap-x-2 mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-lg text-black font-semibold shrink-0">
                  3
                </span>
                <h3 className="text-white font-bold text-base sm:text-lg leading-6">Download image</h3>
              </div>
              <p className="text-gray-300 text-sm sm:text-base">
                Download your image as a PNG with no background, ready to be used on your next project.
              </p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}
