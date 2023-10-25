'use client'
import { useEffect, FC, useState, useRef } from "react";
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl, { VectorSource } from "mapbox-gl";
import { Button } from "@/components/ui/button"
import { ListIcon } from "lucide-react";
import LegendControl from 'mapboxgl-legend';
import 'mapboxgl-legend/dist/style.css';


interface MapboxMapProps{
  coords: number[]
}

const MapboxMap: FC<MapboxMapProps> = ({coords}) => {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '';
  const mapContainer = useRef<any>()
  const [mapboxMap, setMap] = useState<mapboxgl.Map>()
  const tilesets = [
    ['veterinarians', 'pet-connect.57y63ecv', 'vets-b69qae', 'rgb(255, 0, 0)'],
    ['groomers', 'pet-connect.5v78kdn3', 'groomers-1jn9or', 'rgb(255, 179, 26)'],
    ['dog_park', 'pet-connect.9ci1tp9t', 'dog_park-4q45u4', 'rgb(0, 184, 21)']
  ]
  const layerIDs = ['Veterinarians', 'Groomers', 'Dog Parks']

  useEffect(() => {
    //if (map.current) return //if already initialized, return
    
    const map = new mapboxgl.Map({
      container: mapContainer.current, 
      style: 'mapbox://styles/mapbox/streets-v12', 
      //style: 'mapbox://styles/pet-connect/clnuefcud00gl01p78kyhdtum',
      center: [coords[0], coords[1]], 
      zoom: 10 
    });

    map.addControl(new mapboxgl.GeolocateControl, 'top-right')
    map.addControl(new mapboxgl.NavigationControl, 'top-right')
    map.addControl(new mapboxgl.FullscreenControl, 'top-right')
    map.addControl(new LegendControl({
      collapsed: true,
      minimized: false, 
      toggler: true
    }), 'bottom-right')

    map.on('load', () => {
      const toggleableLayers = ['veterinarians', 'dog-parks', 'pet-groomers']

      //add layers forloop
      for (let i=0; i < tilesets.length; i++) {
        //if the layer is already here (map.getLayer(layer)) continue
        if(map.getLayer(tilesets[i][0])) {
          continue;
        }        

        map.addSource(tilesets[i][0], {
          type: 'vector',
          url: 'mapbox://' + tilesets[i][1]
        })

        map.addLayer({
          id: tilesets[i][0],
          type: 'circle',
          source: tilesets[i][0],
          layout: {
            visibility: 'visible'
          },
          paint: {
            'circle-color': tilesets[i][3]
          },
          'source-layer': tilesets[i][2]
        })
      }

      console.log("Tiles loaded?", map.areTilesLoaded())     
    })

    
    /*
    map.on('load', () => {
      
      for (let i=0; i < layerIDs.length; i++) {
        if (document.getElementById(layerIDs[i])) {
          continue;
        }
        const link = document.createElement('a')
        link.id = layerIDs[i]
        link.href = '#'
        link.textContent = layerIDs[i]
        link.className = 'active'
  
        link.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          //idk what the above two do
          //queryRenderedFeatures here i guess
          console.log("on screen,", layerIDs[i], "should load to the left")
          
      }
      const layers = document.getElementById('menu')
      layers?.appendChild(link)
      }
      
    })
    */
    setMap(map)

    
    return () => map.remove()
    //is map unmount actually required??

  }, []);

  function onMouseMove() {
    /*
    console.log("is source loaded? ", mapboxMap.isSourceLoaded('poi'))
      
      //query features that are veterinarians
      const vetFeatures = map.querySourceFeatures('poi', {
        sourceLayer: 'poi_label',
        filter: ['==', ['get', 'maki'], 'veterinary']
        //maybe the filter doesnt work here
      })
      console.log(vetFeatures)
      //querySourceFeatures has tendency to return duplicates.
      //figure out a unique property to filter dupes by
      
     if (mapboxMap.isSourceLoaded('poi') && !(mapboxMap?.getLayer('vet'))) {
      mapboxMap.addLayer(
        {
          id: 'vet',
          source: 'poi',
          type: 'circle',
          'paint': {
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              5, 5,
              10, 9
            ],
            'circle-color': '#ff004f'
          },
          'layout': {
            'visibility': 'visible'
          },
          
        })
        */
     }
      
  /*  
  mapboxMap?.on('idle', () => {
    if(mapboxMap?.getLayer('vets')) {
      console.log("vets layer not added")
      return
    }
  })
*/


  function onclick() {
    //(mapboxMap?.getLayoutProperty('veterinarians', 'visibility') == 'visible') ? 'none' : 'visible'
    console.log(mapboxMap?.getLayer('veterinarians'))
      //ok so since this is a layer that's a part of the style i suppose it doesnt have the same layout properties as simple layers do
    console.log(mapboxMap?.getLayer('vets-b69qae'))
      //returns undefined, so source layer inaccessible from style??
    console.log("Vet layer visibility now", mapboxMap?.getLayoutProperty('veterinarians', 'visibility'))
      //returns undefined
  }
  
  /*
  <ListIcon>Toggle Layers</ListIcon>
  <Button onClick={onclick}>Vets</Button>
  */

  return (
    <div>
      <div className="sidebar">
        <div className="heading">
          <h1 style={{padding: "20px 2px"}}>Header</h1>
        </div>
        <div id="listings" className="listings"></div>
      </div>
      <div className="map" ref={mapContainer} style={{width: "80vw", height: "80vh", position: "absolute"}} onMouseMove={onMouseMove}></div>  
    </div>
    
    );
}

export default MapboxMap