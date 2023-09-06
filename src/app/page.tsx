
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import NavBar from '@/components/NavBar'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })

  const{
    data: { session },
  } = await supabase.auth.getSession()


  return (
    <>
      <NavBar session={session}/>
      <div>
        <div>Hello world</div>
      </div>
    </>
  )
}
