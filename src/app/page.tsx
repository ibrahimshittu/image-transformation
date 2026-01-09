'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CompareSlider } from '@/components/home/compare-slider'
import { AuthModal } from '@/components/auth/auth-modal'
import { Check } from 'lucide-react'

export default function Home() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const searchParams = useSearchParams()
    const router = useRouter()

    // Open modal if redirected here for auth
    useEffect(() => {
        if (searchParams.get('auth') === 'required') {
            setIsAuthModalOpen(true)
        }
    }, [searchParams])

    const handleCloseModal = () => {
        setIsAuthModalOpen(false)
        // Clear auth params from URL so modal can be triggered again
        if (searchParams.get('auth') === 'required') {
            router.replace('/', { scroll: false })
        }
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
                            Instantly remove background from any image using Uplane's AI Background Remover. Free and easy to use!
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

                    {/* Right Card (Visual Upload) */}
                    <div className="w-full">
                        <div className="bg-white rounded-3xl p-3 shadow-lg shadow-gray-100/50 border border-gray-100 aspect-square sm:aspect-[4/3] relative group overflow-hidden">

                            {/* Inner Dashed/White Area */}
                            <div className="w-full h-full bg-gray-50/30 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center relative hover:border-gray-400 transition-colors duration-300">

                                <div className="text-center space-y-4">
                                    <Link href="/dashboard">
                                        <Button className="h-11 px-8 bg-black hover:bg-gray-800 text-white font-medium rounded-lg text-sm shadow-md transition-transform hover:-translate-y-0.5">
                                            Upload Image
                                        </Button>
                                    </Link>
                                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">or drop photos here</p>
                                </div>
                            </div>
                        </div>
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
                                    With our AI-powered technology, you'll be amazed at how quickly and perfectly you can remove the background in your images.
                                </p>
                                <p>
                                    Gone are the days of tedious manual editing—just let Uplane's free background eraser do its wonders.
                                </p>
                            </div>
                            <div className="pt-2">
                                <Link href="/dashboard">
                                    <Button className="rounded-lg px-8 h-12 bg-black hover:bg-gray-800 text-white font-medium text-sm">
                                        Try it now
                                    </Button>
                                </Link>
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
                        </Link>                    </div>
                    <p className="text-sm text-gray-500">© {
                        new Date().getFullYear()
                    } Uplane. All rights reserved.</p>
                </div>
            </footer>
        </main>
    )
}
