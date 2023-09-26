import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import NavBar from '@/components/NavBar'
import MapboxMap from '@/components/map/MapboxMap'
import { redirect } from 'next/navigation';
//export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  var city: string | null = null;
  var state: string | null = null;

  const{
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()

  if(!session || sessionError) redirect('/')

  const {data: userData, error: userError} = await supabase
  .from("user")
  .select("city,state")
  .eq('id', session.user.id)
  .single();

  if(userData && !userError){
    city = userData.city
    state = userData.state
  }
  return (
    <>
      <NavBar session={session} authToken={false}/>
      <div className='py-12'>
        <div>Welcome to the maps page!</div>
        <div>Explore other pet owners in your area, as well as pet-centered locations like parks, pet groomers, and more!</div>
        <div className="relative center flex-auto w-full">
          <MapboxMap city={city ? city:"Davie"} state={state ? state:"Florida"}/>
        </div>
      </div>
    </>
  )
}