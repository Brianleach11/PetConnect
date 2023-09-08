
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import NavBar from '@/components/NavBar'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const cookieStore = cookies().getAll()
  const regex = /.*?(?=auth-token-code-verifier)/;
  const authToken = cookieStore.some(cookie => regex.test(cookie.name));
  console.log(cookieStore, authToken)

  const{
    data: { session },
  } = await supabase.auth.getSession()


  return (
    <>
      <NavBar session={session} authToken={authToken}/>
      <div>
        <div>Hello world</div>
      </div>
    </>
  )
}
