'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function MapComponent({ 
  center = { lat: -17.825, lng: 31.033 },
  pickup = null,
  destination = null,
  drivers = [],
  tripInfo = null
}) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markers = useRef([])

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      console.warn('Mapbox token not configured')
      return
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

    if (map.current) return

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [center.lng, center.lat],
      zoom: 14,
    })

    // Add current location marker (blue dot)
    const currentMarker = document.createElement('div')
    currentMarker.className = 'w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg'
    new mapboxgl.Marker(currentMarker)
      .setLngLat([center.lng, center.lat])
      .addTo(map.current)

    // Draw route if pickup and destination exist
    if (pickup && destination && map.current.isStyleLoaded()) {
      drawRoute()
    }

    // Add nearby driver markers
    if (drivers && drivers.length > 0) {
      addDriverMarkers()
    }

    return () => {
      // Cleanup markers
      markers.current.forEach(marker => marker.remove())
      markers.current = []
    }
  }, [center])

  // Update route when pickup or destination changes
  useEffect(() => {
    if (map.current && map.current.isStyleLoaded() && pickup && destination) {
      drawRoute()
    }
  }, [pickup, destination])

  // Update driver markers
  useEffect(() => {
    if (map.current && drivers && drivers.length > 0) {
      // Remove old driver markers
      markers.current.forEach(marker => {
        if (marker.element.dataset.type === 'driver') {
          marker.remove()
        }
      })
      markers.current = markers.current.filter(m => m.element.dataset.type !== 'driver')
      
      addDriverMarkers()
    }
  }, [drivers])

  const drawRoute = async () => {
    if (!pickup || !destination) return

    try {
      // Get route from Mapbox Directions API
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&geometries=geojson&steps=true`
      )
      const data = await response.json()

      if (!data.routes || !data.routes[0]) {
        console.error('No route found')
        return
      }

      const route = data.routes[0]
      const distance = (route.distance / 1000).toFixed(1) // Convert to km
      const duration = Math.round(route.duration / 60) // Convert to minutes

      // Update trip info if callback provided
      if (window.onTripInfoUpdate) {
        window.onTripInfoUpdate({ distance, duration })
      }

      // Add route layer if it doesn't exist
      if (!map.current.getLayer('route')) {
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: route.geometry,
          },
        })

        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#FF8C00',
            'line-width': 4,
            'line-opacity': 0.8,
          },
        })
      } else {
        // Update existing route
        map.current.getSource('route').setData({
          type: 'Feature',
          geometry: route.geometry,
        })
      }

      // Add destination marker (red pin)
      if (!map.current.getLayer('destination-marker')) {
        const destMarker = document.createElement('div')
        destMarker.className = 'w-8 h-8 bg-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center'
        destMarker.innerHTML = `
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
        `
        destMarker.dataset.type = 'destination'
        new mapboxgl.Marker(destMarker)
          .setLngLat([destination.lng, destination.lat])
          .addTo(map.current)
      }

      // Fit bounds to show entire route
      const bounds = new mapboxgl.LngLatBounds()
      bounds.extend([pickup.lng, pickup.lat])
      bounds.extend([destination.lng, destination.lat])
      map.current.fitBounds(bounds, { padding: 100 })
    } catch (error) {
      console.error('Error drawing route:', error)
    }
  }

  const addDriverMarkers = () => {
    drivers.forEach((driver) => {
      const driverEl = document.createElement('div')
      driverEl.className = 'relative'
      driverEl.dataset.type = 'driver'
      driverEl.innerHTML = `
        <div class="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center border-2 border-orange-500 hover:scale-110 transition">
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"></path>
          </svg>
        </div>
        <div class="absolute bottom-full mb-1 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition pointer-events-none">
          ${driver.name} - ${driver.distance}
        </div>
      `

      const marker = new mapboxgl.Marker(driverEl)
        .setLngLat([driver.lng || center.lng, driver.lat || center.lat])
        .addTo(map.current)

      markers.current.push(marker)
    })
  }

  return (
    <div
      ref={mapContainer}
      className="w-full h-full relative"
      style={{ minHeight: '100%' }}
    />
  )
}

