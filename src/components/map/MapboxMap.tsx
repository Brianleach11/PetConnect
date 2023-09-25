'use client'
import {useRouter} from 'next/navigation'
import { useEffect, useRef } from "react";
import 'mapbox-gl/dist/mapbox-gl.css'
import { Map } from 'react-map-gl'
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxgl from 'mapbox-gl';
import React, { CSSProperties } from 'react';
import mapboxSdk from '@mapbox/mapbox-sdk/services/geocoding'

/*export interface AutoWidthCSS extends CSSProperties {
  '--autowidth': string
}
export interface AutoLengthCSS extends CSSProperties {
  '--autolength': string
}*/

export default function MapboxMap({session, city, state}: {session: Session | null, city: string | undefined, state: string | undefined}) {

  //default center if no location
  var lng = -96.1;
  var lat = 39.5;

  const mapboxClient = require('@mapbox/mapbox-sdk');
  
  const geocodingClient = mapboxSdk({ accessToken: 'pk.eyJ1IjoicGV0LWNvbm5lY3QiLCJhIjoiY2xtZmswYm5pMDFuazNsbWV1ampseHl6YiJ9.NnNxP18_d4ankhK-woxOWA'});

  const query = city + " " + state;
  console.log("Query: ", query);

  if (city && state) {
    geocodingClient.forwardGeocode({
      query: city + " " + state,
      countries: ['us'], // Limit results to United States
      types: ['region'], // Only include regions in the results
      autocomplete: false,
      limit: 1
    }).send()
      .then((response: { body: { features: any; }; }) => {
        const features = response.body.features;
        // Do something with the search results
        lng = features[0].geometry[0];
        lat = features[0].geometry[1];
        console.log(features);
        console.log(features[0].geometry)
        console.log("longitude and latitude: ", lng, lat);
      })
      .catch((err: { message: any; }) => {
        console.log(err.message);
      });
  }
  


  /*const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [lng, lat],
    zoom: 13
  })*/

  function getUserLocation() {
      //get user location from supabase 
          //passed in from page
      //then turn that into coord
      
      //plug into 
  }
  const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
  });

  const url = "https://api.mapbox.com/geocoding/v5/{endpoint}/{search_text}.json"

  /*return (
    <div id="map">   
    </div>
  );*/

  

  /*
  useEffect(() => {
      const fetchLocations = async () => {
        await fetch(url).then((response) =>
          response.text()).then((res) => JSON.parse(res))
        .then((json) => {
          setLocations(json.features);
        }).catch((err) => console.log({ err }));
      };
      fetchLocations();
    }, []);
*/
  


  return (
      <div>
          <Map 
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}
              initialViewState={{
                  longitude: lng,
                  latitude: lat,
                  zoom: 7
              }}
              style={{width: 800, height: 500}}
              
              mapStyle="mapbox://styles/mapbox/streets-v12"
          />
      </div>
      
    );
}