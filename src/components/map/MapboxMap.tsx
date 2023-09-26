'use client'
import { useEffect, FC, useState } from "react";
import 'mapbox-gl/dist/mapbox-gl.css'
import { Map } from 'react-map-gl'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxSdk from '@mapbox/mapbox-sdk/services/geocoding'

interface MapboxMapProps{
  city: string,
  state: string,
}

const MapboxMap: FC<MapboxMapProps> = ({city, state}) => {
  //const mapboxClient = require('@mapbox/mapbox-sdk');
  const geocodingClient = mapboxSdk({ accessToken: process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? ""});
  const [center, setCenter] = useState<number[]>([])

  useEffect(()=>{
    async function getLocation() {
      const res = await geocodingClient.forwardGeocode({
        query: city + " " + state,
        countries: ['us'], // Limit results to United States
        autocomplete: false,
        limit: 1
      }).send()
      setCenter(res.body.features[0].center)
    }
    getLocation()
  }, [city, state])

  return (
      <div>
        {center.length > 0 ? 
          <Map 
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}
              initialViewState={{    
                longitude: center[0],
                latitude: center[1],
                zoom: 10
              }}
              style={{width: 800, height: 500}}
              
              mapStyle="mapbox://styles/mapbox/streets-v12"
          />
          :
          <div className="text-lg text-midnight"> Loading...</div>
          }
      </div>
      
    );
}

export default MapboxMap