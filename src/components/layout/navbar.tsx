'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Images } from 'lucide-react'

interface NavbarProps {
  user: { id: string; email?: string } | null
  onSignOut: () => void
  onOpenAuth?: () => void
}

export function Navbar({ user, onSignOut, onOpenAuth }: NavbarProps) {
  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-xl z-50 transition-all duration-300 border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight text-black whitespace-nowrap">
          Uplane
          <span className="text-xs sm:text-sm pl-1 font-light text-gray-400 hidden sm:inline">Background Remover</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <Link href="/gallery">
                <Button
                  variant="ghost"
                  className="text-sm sm:text-[15px] font-medium text-gray-600 hover:text-black hover:bg-transparent px-2 sm:px-4 gap-1 sm:gap-2"
                >
                  <Images className="w-4 h-4" />
                  <span className="hidden sm:inline">Gallery</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="text-sm sm:text-[15px] font-medium text-gray-600 hover:text-black hover:bg-transparent px-2 sm:px-4"
                onClick={onSignOut}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button
                className="rounded-lg bg-black text-white hover:bg-gray-800 px-4 sm:px-6 h-9 sm:h-10 text-sm sm:text-[15px] font-medium"
                onClick={onOpenAuth}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
