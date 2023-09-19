import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import NavBar from '@/components/NavBar'
export const dynamic = 'force-dynamic'
import 'mapbox-gl/dist/mapbox-gl.css'
import page from '../(auth)/login/page'
import MapboxMap from '@/components/map/MapboxMap'


export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const cookieStore = cookies().getAll()
  const regex = /.*?(?=auth-token-code-verifier)/;
  const authToken = cookieStore.some(cookie => regex.test(cookie.name));

  const{
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <>
      <NavBar session={session} authToken={authToken}/>
      <div>
        <div>Welcome to the maps page!</div>
        <div>Explore other pet owners in your area, as well as pet-centered locations like parks, pet groomers, and more!</div>
        <MapboxMap />
      </div>
    </>
  )
}