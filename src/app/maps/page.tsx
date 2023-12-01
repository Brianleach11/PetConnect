import NavBar from '@/components/NavBar'
import MapboxMap from '@/components/map/MapboxMap'
import { redirect } from 'next/navigation';
import supabaseServer from '@/components/supabaseServer';

export default async function Home() {
  var city: string | null = null;
  var state: string | null = null;

  const {
    data: { session },
    error: sessionError
  } = await supabaseServer().auth.getSession()

  if (!session || sessionError) redirect('/')

  const { data: userData, error: userError } = await supabaseServer()
    .from("user")
    .select("city,state")
    .eq('id', session.user.id)
    .single();

  if (userData && !userError) {
    city = userData.city
    state = userData.state
  }
  else {
    city = "Davie"
    state = "Florida"
  }

  async function getCenter() {
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${city}%20${state}.json?limit=1&types=place&autocomplete=false&access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}`,
      { method: 'GET' });
    const data = await response.json()
    return [data.features[0].center[0], data.features[0].center[1]]
  }

  return (
    <div className="h-screen flex flex-col">
      <div className='z-50'>
        <NavBar session={session} authToken={false} />
      </div>
      <div className="flex-grow py-12 relative">
        <MapboxMap coords={await getCenter()} />
      </div>
    </div>
  )
}