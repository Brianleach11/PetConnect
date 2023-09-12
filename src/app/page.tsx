import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import NavBar from '@/components/NavBar'

export default async function Home() {
  return (
    <>
      <div>
        <div>Hello world</div>
      </div>
    </>
  )
}
