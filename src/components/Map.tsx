import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { Navigation2 } from 'lucide-react';
import type { ToiletLocation } from '../types';

// Custom location icon
const locationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: 'location-pin'
});

interface MapProps {
  toilets: ToiletLocation[];
  onToiletSelect: (toilet: ToiletLocation) => void;
  filters: {
    paid: boolean | null;
    wheelchairAccessible: boolean | null;
    familyFriendly: boolean | null;
    showers: boolean | null;
    minRating: number;
  };
}

function LocationMarker({ selectedToilet, showRoute }: { selectedToilet: ToiletLocation | null, showRoute: boolean }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [routingControl, setRoutingControl] = useState<L.Routing.Control | null>(null);
  const map = useMap();

  React.useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  React.useEffect(() => {
    if (position && selectedToilet && showRoute) {
      if (routingControl) {
        map.removeControl(routingControl);
      }

      const plan = new L.Routing.Plan([
        L.latLng(position.lat, position.lng),
        L.latLng(selectedToilet.position.lat, selectedToilet.position.lng)
      ], {
        createMarker: function() { return null; }, // Disable waypoint markers
        draggableWaypoints: false,
        addWaypoints: false
      });

      const control = L.Routing.control({
        plan: plan,
        routeWhileDragging: false,
        showAlternatives: true,
        fitSelectedRoutes: true,
        show: false, // Hide the instructions panel
        lineOptions: {
          styles: [{ color: '#6366f1', weight: 4 }]
        }
      }).addTo(map);

      setRoutingControl(control);
    }

    return () => {
      if (routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, position, selectedToilet, showRoute]);

  return position === null ? null : (
    <Marker position={position} icon={locationIcon} draggable={false}>
      <Popup>
        <div className="text-center">
          <Navigation2 className="mx-auto mb-2 text-blue-500" size={24} />
          <p className="font-semibold">You are here</p>
        </div>
      </Popup>
    </Marker>
  );
}

export default function Map({ toilets, onToiletSelect, filters }: MapProps) {
  const [selectedToilet, setSelectedToilet] = useState<ToiletLocation | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const defaultPosition: [number, number] = [8.5241, 76.9366];

  const handleToiletSelect = (toilet: ToiletLocation) => {
    setSelectedToilet(toilet);
    setShowRoute(false);
    onToiletSelect(toilet);
  };

  const handleGetDirections = (toilet: ToiletLocation) => {
    setSelectedToilet(toilet);
    setShowRoute(true);
  };

  const filteredToilets = toilets.filter(toilet => {
    if (filters.paid !== null && toilet.paid !== filters.paid) return false;
    if (filters.wheelchairAccessible && !toilet.wheelchairAccessible) return false;
    if (filters.familyFriendly && !toilet.familyFriendly) return false;
    if (filters.showers && !toilet.showers) return false;
    if (toilet.hygieneRating < filters.minRating) return false;
    return true;
  });

  return (
    <MapContainer
      center={defaultPosition}
      zoom={15}
      className="w-full h-[calc(100vh-300px)] rounded-lg shadow-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker selectedToilet={selectedToilet} showRoute={showRoute} />
      {filteredToilets.map((toilet) => (
        <Marker
          key={toilet.id}
          position={[toilet.position.lat, toilet.position.lng]}
          eventHandlers={{
            click: () => handleToiletSelect(toilet),
          }}
          draggable={false}
        >
          <Popup>
            <div className="p-4 min-w-[200px]">
              <h3 className="font-bold text-lg mb-2">{toilet.name}</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <span className="font-medium">Rating:</span> {toilet.hygieneRating}/5
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Price:</span> {toilet.paid ? toilet.price || 'Paid' : 'Free'}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {toilet.wheelchairAccessible && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Wheelchair
                    </span>
                  )}
                  {toilet.familyFriendly && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Family
                    </span>
                  )}
                  {toilet.showers && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Showers
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGetDirections(toilet);
                  }}
                  className="w-full mt-3 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors"
                >
                  Get Directions
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}