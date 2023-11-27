'use client'
import { useEffect, FC, useState, useRef } from "react";
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl, { VectorSource } from "mapbox-gl";
import { Button } from "@/components/ui/button"
import { ListIcon } from "lucide-react";
import LegendControl from 'mapboxgl-legend';
import 'mapboxgl-legend/dist/style.css';
import { ScrollArea } from '../ui/scroll-area';


interface MapboxMapProps{
  coords: number[]
}

const MapboxMap: FC<MapboxMapProps> = ({coords}) => {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '';
  const mapContainer = useRef<any>()
  const [mapboxMap, setMap] = useState<mapboxgl.Map>()
  const tilesets = [
    ['dog_park', 'pet-connect.0lqme2o4', 'dog_parks-3rebou', 'rgb(0, 184, 21)'],
    ['veterinarians', 'pet-connect.5d6c9sva', 'vets-7dv97f', 'rgb(255, 0, 0)'],
    ['groomers', 'pet-connect.8fjt8ml4', 'groomers-27gab0', 'rgb(255, 179, 26)']
  ]

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current, 
      style: 'mapbox://styles/mapbox/streets-v12', 
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
    })
    
    setMap(map)

    
    return () => map.remove()

  }, []);

  useEffect(() => {
    mapboxMap?.on('render', () => {
      getDetails();
    })
  }, [mapboxMap]);
  
  function getDetails() {
    const features = mapboxMap?.queryRenderedFeatures({layers: ['veterinarians', 'groomers', 'dog_park']})
    
    const popup = new mapboxgl.Popup({
      closeButton: false
    })
    const listingElement = document.getElementById('listings')
    function renderListings(features: any) {
      //clear any existing listings
      if (listingElement) {
        listingElement.innerHTML = ''
      }
      if (features.length) {
        //if features.size is > 15 don't try to fetch addresses for every location
        var fetchAddresses = true
        if (features.length > 15) {
          fetchAddresses = false;
        }
        for (const feature of features) {
          var address = ""
          var open_hours = ""
          var website = ""
          var phone = ""
          var details = false
          if (feature.properties["addr:housenumber"] && feature.properties["addr:street"] && feature.properties["addr:city"] && feature.properties["addr:state"] && feature.properties["addr:postcode"]) {
            address += `Address: ${feature.properties["addr:housenumber"]} ${feature.properties["addr:street"]}, ${feature.properties["addr:city"]}, ${feature.properties["addr:state"]} ${feature.properties["addr:postcode"]}\n`
            details = true
          }
          else if (fetchAddresses){
            //plug it into geocoder and get address
          }
          if (feature.properties["opening_hours"]) {
            open_hours += `Opening Hours: ${feature.properties["opening_hours"]}\n`
            details = true
          }
          if (feature.properties["website"]) {
            website += `Website: ${feature.properties["website"]}\n`
            details = true
          }
          if (feature.properties["phone"]) {
            phone += `Phone Number: ${feature.properties["phone"]}\n`
            details = true
          }
          
          //if details blank then make feature into <p>
          //else make details element with summary and <p> description

          const itemLink = document.createElement('details')
          const summary = document.createElement('summary')
          summary.innerText = `${feature.properties.name}`
          const label = `${feature.properties.name}`

          if (details) {
            itemLink.appendChild(summary)
          }
          else if (feature.properties.name) {
            const place = document.createElement('a')
            place.innerText = `${feature.properties.name}`
            listingElement?.appendChild(place)
          }

          //create child text node with data in it
          if (details) {
            if (address) {
              const itemDetails = document.createElement('p')
              itemDetails.textContent = address
              itemLink.appendChild(itemDetails)
            }
            if (open_hours) {
              const itemDetails = document.createElement('p')
              itemDetails.textContent = open_hours
              itemLink.appendChild(itemDetails)
            }
            if (website) {
              const itemDetails = document.createElement('p')
              itemDetails.textContent = website
              itemLink.appendChild(itemDetails)
            }
            if (phone) {
              const itemDetails = document.createElement('p')
              itemDetails.textContent = phone
              itemLink.appendChild(itemDetails)
            }
          }


          
          itemLink.addEventListener('mouseover', () => {
            //highlight corresp. feature on map
            if (mapboxMap) {
              popup.setLngLat(feature.geometry.coordinates)
              .setText(label)
              .addTo(mapboxMap);
            }
          })
          if (details) {
            listingElement?.appendChild(itemLink)
          }
        }        
      }
    }
    renderListings(features)

  }

  mapboxMap?.on('movestart', () => {
  });

  mapboxMap?.on('moveend', () => {
    getDetails();
    //if heading element has text in it, clear it.
    var heading = document.getElementById("heading")
    if (heading) {
      heading.textContent = ""
    } 
    
  })

  return (
    <div>
      <div className="sidebar 'flex  flex-1 flex-col-reverse pb-1 scrollbar-thumb-rounded scrollbar-w-2 scrolling-touch'" style={{width: "20vw", height: "80vh"}}>
        <div id="heading" style={{padding: "20px 2px"}}>
        </div>
        <ScrollArea className='h-4/5 overflow-auto'>
          <div id="listings" className="listing"></div>
        </ScrollArea>
      </div>
      <div className="map" ref={mapContainer} style={{width: "80vw", height: "80vh", right: 0, position: "absolute"}}></div> 
    </div>
    );
}

export default MapboxMap