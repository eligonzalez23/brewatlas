"use client";

import { useEffect, useRef } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

type CoffeeShop = { name: string; coords: [number, number] };

export default function MapPage() {
  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const shops: CoffeeShop[] = [
    { name: "Frothy Monkey", coords: [-86.7832, 36.1623] },
    { name: "Barista Parlor", coords: [-86.7708, 36.1652] },
    { name: "Crema Coffee Roasters", coords: [-86.773, 36.155] },
  ];

  const clearMarkers = () => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  };

  const addCoffeeMarkers = (map: Map) => {
    clearMarkers();
    shops.forEach((shop) => {
      const el = document.createElement("div");
      el.className = "coffee-marker";
      el.innerText = shop.name;

      const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat(shop.coords)
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  const hideLayer = (map: Map, layerId: string) => {
    if (map.getLayer(layerId)) map.setLayoutProperty(layerId, "visibility", "none");
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/standard", // ✅ nicer modern style
      center: [-86.7816, 36.1627],
      zoom: 12,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    mapRef.current.on("load", () => {
      if (!mapRef.current) return;
      hideLayer(mapRef.current, "poi-label"); // declutter
      addCoffeeMarkers(mapRef.current);
    });

    mapRef.current.on("style.load", () => {
      if (!mapRef.current) return;
      hideLayer(mapRef.current, "poi-label");
      addCoffeeMarkers(mapRef.current);
    });

    return () => {
      clearMarkers();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const setStyle = (style: string) => mapRef.current?.setStyle(style);

  return (
    <div className="relative h-screen w-screen">
      {/* buttons */}
      <div className="absolute top-4 left-4 z-20 flex gap-2 bg-white/90 backdrop-blur px-3 py-2 rounded-full shadow">
        <button
          onClick={() => setStyle("mapbox://styles/mapbox/standard")}
          className="px-3 py-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          Light
        </button>
        <button
          onClick={() => setStyle("mapbox://styles/mapbox/satellite-streets-v12")}
          className="px-3 py-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          Satellite
        </button>
      </div>

      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
