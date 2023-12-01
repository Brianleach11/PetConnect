'use client'
import { useEffect, FC, useState, useRef } from "react";
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl, { VectorSource } from "mapbox-gl";
import { Button } from "@/components/ui/button"
import { ListIcon, Menu } from "lucide-react";
import LegendControl from 'mapboxgl-legend';
import 'mapboxgl-legend/dist/style.css';
import { ScrollArea } from '../ui/scroll-area';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';


interface MapboxMapProps {
  coords: number[]
}

const MapboxMap: FC<MapboxMapProps> = ({ coords }) => {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '';
  const mapContainer = useRef<any>()
  const [mapboxMap, setMap] = useState<mapboxgl.Map>()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

    map.addControl(new mapboxgl.GeolocateControl(), 'top-right')
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right')
    map.addControl(new LegendControl({
      collapsed: true,
      minimized: false,
      toggler: true
    }), 'bottom-right')

    // Helper function to load an image and return a Promise
    // Helper function to load an image and return a Promise
    function loadImage(map: mapboxgl.Map, url: string, id: string) {
      return new Promise((resolve, reject) => {
        map.loadImage(url, (error, image) => {
          if (error || !image) {
            reject(error);
          } else {
            map.addImage(id, image);
            resolve(true);
          }
        });
      });
    }

    map.on('load', async () => {
      try {
        // Load all images first
        await Promise.all([
          loadImage(map, '/assets/park.png', 'dog-park-icon'),
          loadImage(map, '/assets/vet.png', 'vet-icon'),
          loadImage(map, '/assets/groomer.png', 'groomer-icon')
        ]);

        // Now add the layers
        tilesets.forEach(tileset => {
          const [id, source, layer, colorOrImage] = tileset;
          if (map.getLayer(id)) return;

          map.addSource(id, {
            type: 'vector',
            url: 'mapbox://' + source
          });

          const layerConfig = {
            id: id,
            source: id,
            'source-layer': layer
          };

          if (id === 'dog_park') {
            map.addLayer({
              ...layerConfig,
              type: 'symbol',
              layout: {
                'icon-image': 'dog-park-icon',
                'icon-size': 0.075
              }
            });
          } else if (id === 'veterinarians') {
            map.addLayer({
              ...layerConfig,
              type: 'symbol',
              layout: {
                'icon-image': 'vet-icon',
                'icon-size': 0.075
              }
            });
          } else if (id === 'groomers') {
            map.addLayer({
              ...layerConfig,
              type: 'symbol',
              layout: {
                'icon-image': 'groomer-icon',
                'icon-size': 0.075
              }
            });
          } else {
            map.addLayer({
              ...layerConfig,
              type: 'circle',
              layout: {
                visibility: 'visible'
              },
              paint: {
                'circle-color': colorOrImage
              }
            });
          }
        });
      } catch (error) {
        console.error('Error loading images:', error);
      }
    });

    const onIconClick = (e: any) => {
      if (e.features.length > 0) {
        const feature = e.features[0];
        map.flyTo({
          center: feature.geometry.coordinates,
          zoom: 15 // Set the zoom level you want after clicking
        });
      }
    };

    // Add click event listeners to the layers
    ['dog_park', 'veterinarians', 'groomers'].forEach(layerId => {
      map.on('click', layerId, onIconClick);
    });

    ['dog_park', 'veterinarians', 'groomers'].forEach(layerId => {
      // Change the cursor to a pointer when the it enters a feature in the layer
      map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      // Change it back to a pointer when it leaves a feature in the layer
      map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
      });

      // Add other event listeners like 'click' as per your requirement
    });


    setMap(map);

    return () => map.remove();
  }, []);

  useEffect(() => {
    mapboxMap?.on('render', () => {
      getDetails();
    })
  }, [mapboxMap]);

  function getDetails() {
    const features = mapboxMap?.queryRenderedFeatures(undefined, { layers: ['veterinarians', 'groomers', 'dog_park'] });
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
          else if (fetchAddresses) {
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
    <div className="flex h-full">
      <div className={`transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-60 lg:w-96 z-40 h-full bg-white fixed lg:static lg:translate-x-0`}>
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle>Map Details</CardTitle>
            <CardDescription>Information about map locations</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 overflow-auto">
              <div id='listings' className="flex flex-col gap-2.5 overflow-auto" />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <div className="flex-grow relative">
        <div className={`absolute top-4 z-10 lg:hidden transform transition-transform ${isSidebarOpen ? 'left-64' : 'left-2'}`}>
          <Button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu />
          </Button>
        </div>
        <div ref={mapContainer} className="h-full rounded-lg" />
      </div>
    </div>
  );
}

export default MapboxMap