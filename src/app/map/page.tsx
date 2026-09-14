"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import SplashScreen from "@/components/SplashScreen";
import BottomTabs from "@/components/BottomTabs";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

type BBox = [number, number, number, number];

type MapboxCoffeeFeature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    mapbox_id: string;
    name: string;
    full_address?: string;
    place_formatted?: string;
    operational_status?: string;
  };
};

type CoffeeSearchResponse = {
  type: "FeatureCollection";
  features: MapboxCoffeeFeature[];
};

type CoffeeShop = {
  id: string;
  name: string;
  coords: [number, number];
  address?: string;
};

// Broad Nashville / Davidson County area
const NASHVILLE_BOUNDS: BBox = [
  -87.05, // west
  35.96,  // south
  -86.51, // east
  36.40,  // north
];

function splitBBox(
  bbox: BBox,
  columns = 3,
  rows = 3
): BBox[] {
  const [west, south, east, north] = bbox;

  const width = (east - west) / columns;
  const height = (north - south) / rows;

  const boxes: BBox[] = [];

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const cellWest = west + width * column;
      const cellEast = west + width * (column + 1);

      const cellSouth = south + height * row;
      const cellNorth = south + height * (row + 1);

      boxes.push([
        cellWest,
        cellSouth,
        cellEast,
        cellNorth,
      ]);
    }
  }

  return boxes;
}

function mapBoundsToBBox(map: Map): BBox {
  const bounds = map.getBounds();

  const southwest = bounds.getSouthWest();
  const northeast = bounds.getNorthEast();

  return [
    southwest.lng,
    southwest.lat,
    northeast.lng,
    northeast.lat,
  ];
}

export default function MapPage() {
  const mapRef = useRef<Map | null>(null);

  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const markersRef =
    useRef<Map<string, mapboxgl.Marker>>(
      new globalThis.Map()
    );

  const shopsRef =
    useRef<Map<string, CoffeeShop>>(
      new globalThis.Map()
    );

  const abortRef =
    useRef<AbortController | null>(null);

  const requestIdRef = useRef(0);

  const [mapReady, setMapReady] = useState(false);

  const [loadingShops, setLoadingShops] =
    useState(false);

  const [shopCount, setShopCount] =
    useState(0);

  const [showFindArea, setShowFindArea] =
    useState(false);

  const [searchError, setSearchError] =
    useState(false);

  const hideLayer = (
    map: Map,
    layerId: string
  ) => {
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(
        layerId,
        "visibility",
        "none"
      );
    }
  };

  const updateMarkerDensity = (
    map: Map
  ) => {
    const showNames = map.getZoom() >= 13.2;

    markersRef.current.forEach((marker) => {
      const element = marker.getElement();

      element.classList.toggle(
        "coffee-marker--pill",
        showNames
      );

      element.classList.toggle(
        "coffee-marker--dot",
        !showNames
      );
    });
  };

  const addCoffeeShop = useCallback(
    (shop: CoffeeShop) => {
      const map = mapRef.current;

      if (!map) return;

      if (markersRef.current.has(shop.id)) {
        return;
      }

      shopsRef.current.set(shop.id, shop);

      const element =
        document.createElement("button");

      element.type = "button";
      element.className = "coffee-marker";
      element.textContent = shop.name;
      element.setAttribute(
        "aria-label",
        shop.name
      );

      const popupContent =
        document.createElement("div");

      popupContent.className =
        "ba-shop-popup";

      const title =
        document.createElement("div");

      title.className =
        "ba-shop-popup-title";

      title.textContent = shop.name;

      popupContent.appendChild(title);

      if (shop.address) {
        const address =
          document.createElement("div");

        address.className =
          "ba-shop-popup-address";

        address.textContent =
          shop.address;

        popupContent.appendChild(address);
      }

      const popup =
        new mapboxgl.Popup({
          offset: 18,
          closeButton: false,
          className: "ba-map-popup",
        }).setDOMContent(popupContent);

      const marker =
        new mapboxgl.Marker({
          element,
          anchor: "center",
        })
          .setLngLat(shop.coords)
          .setPopup(popup)
          .addTo(map);

      markersRef.current.set(
        shop.id,
        marker
      );

      setShopCount(
        markersRef.current.size
      );

      updateMarkerDensity(map);
    },
    []
  );

  const searchCoffeeShops =
    useCallback(
      async (bbox: BBox) => {
        const requestId =
          ++requestIdRef.current;

        abortRef.current?.abort();

        const controller =
          new AbortController();

        abortRef.current =
          controller;

        setLoadingShops(true);
        setSearchError(false);

        try {
          /*
            Each Mapbox category request can
            return up to 25 results.

            Splitting the area lets us get
            substantially more Nashville
            coffee shops.
          */
          const cells =
            splitBBox(bbox, 3, 3);

          const requests = cells.map(
            async (cell) => {
              const [
                west,
                south,
                east,
                north,
              ] = cell;

              const centerLongitude =
                (west + east) / 2;

              const centerLatitude =
                (south + north) / 2;

              const bboxValue =
                cell.join(",");

              const proximity =
                `${centerLongitude},${centerLatitude}`;

              const response =
                await fetch(
                  `/api/coffee-shops?bbox=${encodeURIComponent(
                    bboxValue
                  )}&proximity=${encodeURIComponent(
                    proximity
                  )}`,
                  {
                    signal:
                      controller.signal,
                  }
                );

              if (!response.ok) {
                throw new Error(
                  "Coffee search failed"
                );
              }

              return (
                (await response.json()) as CoffeeSearchResponse
              );
            }
          );

          const results =
            await Promise.allSettled(
              requests
            );

          if (
            controller.signal.aborted
          ) {
            return;
          }

          /*
            Mapbox may return the same shop
            in neighboring grid cells.

            mapbox_id gives us a stable way
            to remove those duplicates.
          */
          const uniqueFeatures =
            new globalThis.Map<
              string,
              MapboxCoffeeFeature
            >();

          results.forEach((result) => {
            if (
              result.status !==
              "fulfilled"
            ) {
              return;
            }

            result.value.features.forEach(
              (feature) => {
                uniqueFeatures.set(
                  feature.properties
                    .mapbox_id,
                  feature
                );
              }
            );
          });

          if (
            uniqueFeatures.size === 0
          ) {
            throw new Error(
              "No shops returned"
            );
          }

          uniqueFeatures.forEach(
            (feature) => {
              const shop: CoffeeShop = {
                id:
                  feature.properties
                    .mapbox_id,

                name:
                  feature.properties.name,

                coords:
                  feature.geometry
                    .coordinates,

                address:
                  feature.properties
                    .full_address ??
                  feature.properties
                    .place_formatted,
              };

              addCoffeeShop(shop);
            }
          );
        } catch (error) {
          if (
            error instanceof DOMException &&
            error.name === "AbortError"
          ) {
            return;
          }

          console.error(
            "Coffee shop search error:",
            error
          );

          setSearchError(true);
        } finally {
          if (
            requestIdRef.current ===
            requestId
          ) {
            setLoadingShops(false);
          }
        }
      },
      [addCoffeeShop]
    );

  useEffect(() => {
    if (
      !containerRef.current ||
      mapRef.current
    ) {
      return;
    }

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [-86.7816, 36.1627],
      zoom: 11.4,
      center: [-86.7816, 36.1627],
      zoom: 11.4,
    });

    mapRef.current = map;

    map.addControl(
      new mapboxgl.NavigationControl(),
      "bottom-right"
    );

    const handleMoveEnd = () => {
      setShowFindArea(true);
    };

    const handleZoom = () => {
      updateMarkerDensity(map);
    };

    map.on("load", async () => {
      hideLayer(map, "poi-label");

      /*
        Map itself is ready, so the
        splash may begin fading.
      */
      setMapReady(true);

      /*
        Initial launch searches the
        broader Nashville area instead
        of only what is on-screen.
      */
      await searchCoffeeShops(
        NASHVILLE_BOUNDS
      );

      setShowFindArea(false);

      /*
        Only start watching user movement
        after the initial Nashville load.
      */
      map.on(
        "moveend",
        handleMoveEnd
      );
    });

    map.on("style.load", () => {
      hideLayer(map, "poi-label");
    });

    map.on("zoom", handleZoom);

    return () => {
      abortRef.current?.abort();

      map.off(
        "moveend",
        handleMoveEnd
      );

      map.off("zoom", handleZoom);

      markersRef.current.forEach(
        (marker) => marker.remove()
      );

      markersRef.current.clear();
      shopsRef.current.clear();

      map.remove();

      mapRef.current = null;
    };
  }, [searchCoffeeShops]);

  const searchCurrentArea =
    async () => {
      const map = mapRef.current;

      if (!map) return;

      setShowFindArea(false);

      const bbox =
        mapBoundsToBBox(map);

      await searchCoffeeShops(bbox);
    };

  const setStyle = (
    style: string
  ) => {
    mapRef.current?.setStyle(style);
  };

  return (
    <main className="ba-map-screen">
      <div
        ref={containerRef}
        className="ba-map"
      />

      {/* Map style controls */}
      <div className="ba-map-style-toggle">
        <button
          type="button"
          onClick={() =>
            setStyle(
              "mapbox://styles/mapbox/standard"
            )
          }
        >
          Map
        </button>

        <button
          type="button"
          onClick={() =>
            setStyle(
              "mapbox://styles/mapbox/satellite-streets-v12"
            )
          }
        >
          Satellite
        </button>
      </div>

      {/* Number of shops currently loaded */}
      <div className="ba-shop-count">
        {loadingShops
          ? "Finding coffee..."
          : searchError
          ? "Search failed"
          : `${shopCount} shops`}
      </div>

      {/* Search after map movement */}
      {showFindArea &&
        !loadingShops && (
          <button
            type="button"
            className="ba-find-area"
            onClick={
              searchCurrentArea
            }
          >
            Find in this area
          </button>
        )}

      <SplashScreen
        ready={mapReady}
      />

      <BottomTabs />
    </main>
  );
}