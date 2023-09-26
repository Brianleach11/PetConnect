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
import { get } from 'http';

export default function MapboxMap({session, city, state}: {session: Session | null, city: string, state: string}) {
  //const mapboxClient = require('@mapbox/mapbox-sdk');
  const geocodingClient = mapboxSdk({ accessToken: process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? ""});
  
  function getLocation(_coordinates: number[]) {
    var long;
    var latt;
    geocodingClient.forwardGeocode({
      query: city + " " + state,
      countries: ['us'], // Limit results to United States
      autocomplete: false,
      limit: 1
    }).send()
      .then((response: { body: { features: any; }; }) => {
        const features = response.body.features;
        // Do something with the search results
        long = features[0].center[0];
        latt = features[0].center[1];
        _coordinates[0] = features[0].center[0];
        _coordinates[1] = features[0].center[1];
        console.log(features);
        console.log("longitude and latitude: ", long, latt);
      });
      return _coordinates;
      
  }

  //default center if no location
  var lng = -96.1;
  var lat = 39.5;
  
  var coord = [0,0];
  coord = getLocation(coord);
  console.log("Coordinates: ", coord);

  var startViewState = {    
    longitude: coord[0],
    latitude: coord[1],
    zoom: 7
  };
      
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
                longitude: coord[0],
                latitude: coord[1],
                zoom: 7
              }}
              style={{width: 800, height: 500}}
              
              mapStyle="mapbox://styles/mapbox/streets-v12"
          />
      </div>
      
    );
}