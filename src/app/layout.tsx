import './globals.css'
import type { Metadata } from 'next'
import { Unbounded } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import NavBar from '@/components/NavBar'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'


const unbounded = Unbounded({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pet Connect',
  description: 'Inspiring a Community of Pet Lovers',
  manifest: '/manifest.json'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) 
{
  const supabase = createServerComponentClient({cookies})
  const {data: {session}, error} = await supabase.auth.getSession()
  const cookieStore = cookies().getAll()
  const regex = /.*?(?=auth-token-code-verifier)/;
  const authToken = cookieStore.some(cookie => regex.test(cookie.name));

  return (
    <html lang='en' className={unbounded.className}>
      <body className='container min-h-screen pt-12 bg-slate-50 antialiased'>
        <NavBar session={session} authToken={authToken}/>
        <div className='container max-w-7xl mx-auto h-full pt-12'>
          {children}
        </div>
        <Toaster/>
      </body>
      <link rel="manifest" href="/manifest.json"></link>
    </html>
  )
}
