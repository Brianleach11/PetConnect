'use client'
import {useRouter} from 'next/navigation'
import { useEffect, useRef } from "react";
import 'mapbox-gl/dist/mapbox-gl.css'
import { Map } from 'react-map-gl'

export default function MapboxMap() {

    return (
        <div>
            <Map 
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}
                initialViewState={{
                    longitude: -96.1,
                    latitude: 39.5,
                    zoom: 2
                }}
                style={{width: 800, height: 600}}
                mapStyle="mapbox://styles/mapbox/streets-v9"
            />
        </div>
        
      );
}