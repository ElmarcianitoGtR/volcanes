'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import Map, { Marker, GeolocateControl, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Datos de volcanes en la zona de Puebla
const volcanoes = [
  {
    id: 1,
    name: 'Popocatépetl',
    latitude: 19.0225,
    longitude: -98.6278,
    radius: 0.02 // Radio de detección
  },
  {
    id: 2, 
    name: 'Iztaccíhuatl',
    latitude: 19.1792,
    longitude: -98.6417,
    radius: 0.02
  },
  {
    id: 3,
    name: 'La Malinche',
    latitude: 19.2308,
    longitude: -98.0319,
    radius: 0.015
  },
  {
    id: 4,
    name: 'Pico de Orizaba',
    latitude: 19.0300,
    longitude: -97.2700,
    radius: 0.025
  }
];

const MapWithVolcanoDetection = () => {
  const [viewState, setViewState] = useState({
    longitude: -98.628341,
    latitude: 19.020907,
    zoom: 10
  });

  const [marker, setMarker] = useState({
    longitude: -98.628341,
    latitude: 19.020907
  });

  const [currentVolcano, setCurrentVolcano] = useState(null);

  const mapRef = useRef();

  // Función para calcular distancia entre dos puntos
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Detectar si el marcador está sobre un volcán
  const detectVolcano = useCallback((lat, lng) => {
    for (const volcano of volcanoes) {
      const distance = calculateDistance(lat, lng, volcano.latitude, volcano.longitude);
      if (distance <= 2) {
        return volcano;
      }
    }
    return null;
  }, []);

  const addMarker = useCallback((e) => {
    const { lng, lat } = e.lngLat;
    const volcano = detectVolcano(lat, lng);
    
    setMarker({
      longitude: lng,
      latitude: lat
    });
    
    setCurrentVolcano(volcano);
  }, [detectVolcano]);

  // Opciones del mapa memoizadas para mejor rendimiento
  const mapOptions = useMemo(() => ({
    mapboxAccessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    mapStyle: "mapbox://styles/cristofer1501/cmgt1s8xm00ea01qocm8f153s", 
    reuseMaps: true,
    doubleClickZoom: true,
  }), []);

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <Map
        ref={mapRef}
        {...viewState}
        {...mapOptions}
        onMove={evt => setViewState(evt.viewState)}
        onClick={addMarker}
        style={{ width: '100%', height: '100%' }}
      >
        <GeolocateControl position="top-right" />
        <NavigationControl position="top-right" />

        {/* Marcador principal */}
        <Marker
          longitude={marker.longitude}
          latitude={marker.latitude}
          anchor="bottom"
        >
          <div className={`p-2 rounded-full shadow-lg ${
            currentVolcano ? 'bg-red-500 animate-bounce' : 'bg-blue-500'
          }`}>
            <svg 
              className="w-5 h-5 text-white" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </Marker>

        {/* Marcadores de volcanes */}
        {volcanoes.map(volcano => (
          <Marker
            key={volcano.id}
            longitude={volcano.longitude}
            latitude={volcano.latitude}
            anchor="bottom"
          >
            <div className="bg-orange-500 p-2 rounded-full shadow-lg">
              <svg 
                className="w-4 h-4 text-white" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          </Marker>
        ))}
      </Map>

      {/* Panel de información */}
      <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200 max-w-sm">
        {currentVolcano ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-green-500 text-lg">✅</span>
              <span className="font-bold text-green-700">¡EL MARCADOR ESTA SOBRE UN VOLCÁN!</span>
            </div>
            <p className="text-green-600 font-semibold">{currentVolcano.name}</p>
            <p className="text-xs text-green-500 mt-1">
              El marcador está posicionado sobre este volcán activo
            </p>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-lg">⚠️</span>
              <span className="font-bold text-red-700">EL MARCADOR SE ENCUENTRA FUERA DE UN VOLCAN</span>
            </div>
            <p className="text-xs text-red-600 mt-1">
              Coloca el marcador sobre un volcan conocido
            </p>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Haz click en el mapa para mover el marcador y detectar volcanes
          </p>
        </div>
      </div>

      {/* Leyenda de volcanes */}
      <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200">
        <h4 className="font-semibold text-gray-50 mb-2">Volcanes conocidos:</h4>
        <div className="space-y-1">
          {volcanoes.map(volcano => (
            <div key={volcano.id} className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-gray-50">{volcano.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapWithVolcanoDetection;