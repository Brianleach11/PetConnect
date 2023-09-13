import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import NavBar from '@/components/NavBar'
export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = createServerComponentClient({cookies})
  const {data: {session}, error} = await supabase.auth.getSession()
  const cookieStore = cookies().getAll()
  const regex = /.*?(?=auth-token-code-verifier)/;
  const authToken = cookieStore.some(cookie => regex.test(cookie.name));
  return (
    <>
      <NavBar session={session} authToken={authToken}/>
      <div className='pt-12'>
        <div>Hello world</div>
      </div>
    </>
  )
}
