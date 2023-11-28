import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import NavBar from '@/components/NavBar'
import MapboxMap from '@/components/map/MapboxMap'
import { redirect } from 'next/navigation';
import MapboxMapcopy from '@/components/map/MapboxMap';
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
  else {
    city = "Davie"
    state= "Florida"
  }
  
  async function getCenter() {
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${city}%20${state}.json?limit=1&types=place&autocomplete=false&access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}`,
    { method: 'GET'});
    const data = await response.json()
    return [data.features[0].center[0], data.features[0].center[1]]
  }

  return (
    <>
      <NavBar session={session} />
      <div className='py-12'>
        <div>Welcome to the maps page! Explore other pet owners in your area, as well as pet-centered locations like parks, pet groomers, and more!</div>
        <div>
          <MapboxMap coords={await getCenter()}/>
        </div>
      </div>
    </>
  )
}