import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import NavBar from '@/components/NavBar'
export const dynamic = 'force-dynamic'
import mapboxgl from "mapbox-gl";
import page from '../(auth)/login/page'
import MapboxMap from '@/components/map/MapboxMap'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { NextResponse } from 'next/server'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const cookieStore = cookies().getAll()
  const regex = /.*?(?=auth-token-code-verifier)/;
  const authToken = cookieStore.some(cookie => regex.test(cookie.name));

  const{
    data: { session },
  } = await supabase.auth.getSession()

  const {data: {user}, error} = await supabase.auth.getUser()

  var city;
  var state;

  if(user?.id && !error) {
    const {data, error} = await supabase
    .from("user")
    .select("city,state")
    .eq('id', user?.id);
    city = data?.at(0)?.city
    state = data?.at(0)?.state
  }

  var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + {city} + " " + {state} + ".json";
  //https://api.mapbox.com/geocoding/v5/mapbox.places/hollywood%20florida.json?access_token=pk.eyJ1IjoicGV0LWNvbm5lY3QiLCJhIjoiY2xtZmswYm5pMDFuazNsbWV1ampseHl6YiJ9.NnNxP18_d4ankhK-woxOWA  
  //https://api.mapbox.com/geocoding/v5/mapbox.places/?query={}.json?&access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}
  //const response = await fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/hollywood%20florida.json?access_token=pk.eyJ1IjoicGV0LWNvbm5lY3QiLCJhIjoiY2xtZmswYm5pMDFuazNsbWV1ampseHl6YiJ9.NnNxP18_d4ankhK-woxOWA');
  var query = city + " " + state;
  
  //const stuff = GET();
  

  //GET() fetch here
  async function GET() {
    const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?limit=1&autocomplete=false&access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}`)
    const data = await res.json().then((data) => {
      console.log(data)
    })
    //sigh. it'd be nice if we could just use the API for the forward geocoding
    //then get the coordinates from the fetched data
    //but does this GET() before the page loads? 
    //since the function in the page.tsx is also a async maybe we can call the function in there...
    
    return NextResponse.json({ data })
}
  //const location = GET();
  //console.log(location);



  //parse results

  return (
    <>
      <NavBar session={session} authToken={authToken}/>
      <div>
        <div>Welcome to the maps page!</div>
        <div>Explore other pet owners in your area, as well as pet-centered locations like parks, pet groomers, and more!</div>
        <div className="relative center flex-auto w-full">
          <MapboxMap session={session} city={city ? city:"Davie"} state={state? state:"Florida"}/>
        </div>
        
      </div>
    </>
  )
}