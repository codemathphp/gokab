'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function MapComponent({ center = { lat: -17.825, lng: 31.033 } }) {
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [center.lng, center.lat],
      zoom: 13,
    })

    // Add marker
    new mapboxgl.Marker()
      .setLngLat([center.lng, center.lat])
      .addTo(map.current)

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [center])

  return (
    <div
      ref={mapContainer}
      className="w-full h-full rounded-2xl overflow-hidden"
      style={{ minHeight: '100%' }}
    />
  )
}
