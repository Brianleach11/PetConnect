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
      <body className='pt-12'>
        <div className='h-full'>
          {children}
        </div>
        <Toaster/>
      </body>
      <link rel="manifest" href="/manifest.json"></link>
    </html>
  )
}
