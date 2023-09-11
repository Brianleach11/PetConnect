import './globals.css'
import type { Metadata } from 'next'
import { Unbounded } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"

const unbounded = Unbounded({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pet Connect',
  description: 'Inspiring a Community of Pet Lovers',
  manifest: '/manifest.json'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className={unbounded.className}>
      <body className='container min-h-screen pt-12 bg-slate-50 antialiased'>
        <div className='container max-w-7xl mx-auto h-full pt-12'>
          {children}
        </div>
        <Toaster/>
      </body>
      <link rel="manifest" href="/manifest.json"></link>
    </html>
  )
}
