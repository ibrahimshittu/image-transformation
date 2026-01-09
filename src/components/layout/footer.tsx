import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white py-12 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="text-2xl font-bold tracking-tight text-black">
          Uplane
          <span className="text-sm pl-1 font-light text-gray-400">Background Remover</span>
        </Link>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Uplane. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
