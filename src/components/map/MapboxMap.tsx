'use client'
import { useEffect, FC, useState, useRef } from "react";
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxgl, { VectorSource } from "mapbox-gl";

interface MapboxMapProps{
  coords: number[]
}

const MapboxMap: FC<MapboxMapProps> = ({coords}) => {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '';
  const mapContainer = useRef<any>()
  const map = useRef<any>()

  useEffect(() => {
    if (map.current) return //if already initialized, return
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current, 
      style: 'mapbox://styles/mapbox/streets-v12', 
      center: [coords[0], coords[1]], 
      zoom: 12 
    });

    map.current.on('load', function() {
      map.current.addSource('mapbox-streets', {
        type: 'vector',
        url: 'mapbox://styles/mapbox/streets-v8'
      })
      
      //our set of different layers: figure POI labels
      var layerTypes = ['dog-park', 'veterinary', ]
      //for loop to add each of the different layers
  
      map.current.addLayer(
        {
          'id': 'vet',
          'source': 'mapbox-streets',
          'source-layer': 'poi_label',
          'type': 'circle',
          'paint': {
            'circle-radius': 6,
            'circle-color': '#007cbf'
          },
          'filter': ['==', 'icon', 'veterinary'] //idk how to do filters yet but get on that asap
        })
      map.current.setLayoutProperty('vet', 'visibility',)
    })
  }, []);
  

  return (
    <div className="map-container" ref={mapContainer} style={{width: "100%", height: "80vh"}}></div>
    );
}

export default MapboxMap