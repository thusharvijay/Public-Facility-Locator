import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import type { ToiletLocation } from '../types';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

interface AddToiletProps {
  onAdd: (toilet: Omit<ToiletLocation, 'id'>) => void;
  onClose: () => void;
}

// Custom location icon
const locationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4f46e5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: 'location-pin'
});

function LocationPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export default function AddToilet({ onAdd, onClose }: AddToiletProps) {
  const [formData, setFormData] = useState({
    name: '',
    paid: false,
    price: '',
    hygieneRating: 5,
    wheelchairAccessible: false,
    sanitaryProducts: false,
    showers: false,
    position: { lat: 0, lng: 0 }
  });

  const [showMap, setShowMap] = useState(false);
  const defaultPosition: [number, number] = [8.5241, 76.9366];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.position.lat === 0 && formData.position.lng === 0) {
      alert('Please select a location on the map');
      return;
    }
    onAdd(formData);
    onClose();
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      position: { lat, lng }
    }));
  };

  const useCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        handleLocationSelect(position.coords.latitude, position.coords.longitude);
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-3xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Add New Facility</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facility Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.paid}
                    onChange={(e) => setFormData(prev => ({ ...prev, paid: e.target.checked }))}
                    className="rounded text-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Paid Facility</span>
                </label>
              </div>

              {formData.paid && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g. ₹5"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hygiene Rating
                </label>
                <select
                  value={formData.hygieneRating}
                  onChange={(e) => setFormData(prev => ({ ...prev, hygieneRating: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {[1, 2, 3, 4, 5].map(rating => (
                    <option key={rating} value={rating}>{rating}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.wheelchairAccessible}
                    onChange={(e) => setFormData(prev => ({ ...prev, wheelchairAccessible: e.target.checked }))}
                    className="rounded text-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Wheelchair Accessible</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.sanitaryProducts}
                    onChange={(e) => setFormData(prev => ({ ...prev, sanitaryProducts: e.target.checked }))}
                    className="rounded text-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Sanitary Products Available</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.showers}
                    onChange={(e) => setFormData(prev => ({ ...prev, showers: e.target.checked }))}
                    className="rounded text-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Showers Available</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Location
                </label>
                <button
                  type="button"
                  onClick={useCurrentLocation}
                  className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <MapPin size={16} />
                  Use Current Location
                </button>
              </div>

              <div className="h-[300px] rounded-lg overflow-hidden border">
                <MapContainer
                  center={defaultPosition}
                  zoom={15}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker onLocationSelect={handleLocationSelect} />
                  {formData.position.lat !== 0 && (
                    <Marker
                      position={[formData.position.lat, formData.position.lng]}
                      icon={locationIcon}
                    />
                  )}
                </MapContainer>
              </div>

              {formData.position.lat !== 0 && (
                <p className="text-sm text-gray-600">
                  Selected location: {formData.position.lat.toFixed(6)}, {formData.position.lng.toFixed(6)}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Add Facility
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}