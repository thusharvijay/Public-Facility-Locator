import React, { useState, useEffect } from 'react';
import { MapPin, List, Map as MapIcon, Plus } from 'lucide-react';
import Map from './components/Map';
import ToiletDetails from './components/ToiletDetails';
import ToiletList from './components/ToiletList';
import Filters from './components/Filters';
import Auth from './components/Auth';
import AddToilet from './components/AddToilet';
import type { ToiletLocation, Review } from './types';

function App() {
  const [selectedToilet, setSelectedToilet] = useState<ToiletLocation | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddToilet, setShowAddToilet] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filters, setFilters] = useState({
    paid: null as boolean | null,
    wheelchairAccessible: null as boolean | null,
    sanitaryProducts: null as boolean | null,
    showers: null as boolean | null,
    minRating: 1,
  });

  const [toilets, setToilets] = useState<ToiletLocation[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      const sampleToilets: ToiletLocation[] = [
        {
          id: '1',
          name: 'Central Station Facility',
          position: { lat: userLat + 0.002, lng: userLng + 0.002 },
          paid: true,
          price: '₹5',
          hygieneRating: 4.5,
          wheelchairAccessible: true,
          sanitaryProducts: true,
          showers: true,
          reviews: [
            {
              id: '1',
              userName: 'Adrija',
              rating: 4,
              date: '2024-01-15',
              comment: 'Very clean and well-maintained. Friendly staff.',
              status: 'approved'
            }
          ]
        },
        {
          id: '2',
          name: 'City Mall Restroom',
          position: { lat: userLat - 0.001, lng: userLng + 0.001 },
          paid: true,
          price: '₹10',
          hygieneRating: 4.8,
          wheelchairAccessible: true,
          sanitaryProducts: true,
          showers: false,
          reviews: [
            {
              id: '2',
              userName: 'Rahul',
              rating: 5,
              date: '2024-01-14',
              comment: 'Premium facility with excellent cleanliness.',
              status: 'approved'
            }
          ]
        },
        {
          id: '3',
          name: 'Park Public Toilet',
          position: { lat: userLat + 0.003, lng: userLng - 0.001 },
          paid: false,
          hygieneRating: 3.5,
          wheelchairAccessible: false,
          sanitaryProducts: false,
          showers: false,
          reviews: [
            {
              id: '3',
              userName: 'Priya',
              rating: 3,
              date: '2024-01-13',
              comment: 'Basic facility, could be cleaner.',
              status: 'approved'
            }
          ]
        },
        {
          id: '4',
          name: 'Bus Terminal Facility',
          position: { lat: userLat - 0.002, lng: userLng - 0.002 },
          paid: true,
          price: '₹2',
          hygieneRating: 3.8,
          wheelchairAccessible: true,
          sanitaryProducts: true,
          showers: false,
          reviews: [
            {
              id: '4',
              userName: 'Amit',
              rating: 4,
              date: '2024-01-12',
              comment: 'Good for the price, regularly cleaned.',
              status: 'approved'
            }
          ]
        },
        {
          id: '5',
          name: 'Beach Restroom',
          position: { lat: userLat + 0.001, lng: userLng - 0.003 },
          paid: false,
          hygieneRating: 3.2,
          wheelchairAccessible: true,
          sanitaryProducts: false,
          showers: true,
          reviews: [
            {
              id: '5',
              userName: 'Maya',
              rating: 3,
              date: '2024-01-11',
              comment: 'Convenient location, shower available.',
              status: 'approved'
            }
          ]
        },
        {
          id: '6',
          name: 'Hospital Public Facility',
          position: { lat: userLat - 0.003, lng: userLng + 0.002 },
          paid: false,
          hygieneRating: 4.2,
          wheelchairAccessible: true,
          sanitaryProducts: true,
          showers: false,
          reviews: [
            {
              id: '6',
              userName: 'Dr. Kumar',
              rating: 4,
              date: '2024-01-10',
              comment: 'Well-maintained hospital facility.',
              status: 'approved'
            }
          ]
        },
        {
          id: '7',
          name: 'Market Complex Restroom',
          position: { lat: userLat + 0.002, lng: userLng - 0.002 },
          paid: true,
          price: '₹5',
          hygieneRating: 3.9,
          wheelchairAccessible: true,
          sanitaryProducts: true,
          showers: false,
          reviews: [
            {
              id: '7',
              userName: 'Neha',
              rating: 4,
              date: '2024-01-09',
              comment: 'Clean and accessible, reasonable price.',
              status: 'approved'
            }
          ]
        },
        {
          id: '8',
          name: 'Metro Station Facility',
          position: { lat: userLat - 0.001, lng: userLng - 0.004 },
          paid: true,
          price: '₹5',
          hygieneRating: 4.3,
          wheelchairAccessible: true,
          sanitaryProducts: true,
          showers: false,
          reviews: [
            {
              id: '8',
              userName: 'Raj',
              rating: 4,
              date: '2024-01-08',
              comment: 'Modern and clean facility.',
              status: 'approved'
            }
          ]
        },
        {
          id: '9',
          name: 'Community Center Restroom',
          position: { lat: userLat + 0.004, lng: userLng + 0.001 },
          paid: false,
          hygieneRating: 3.7,
          wheelchairAccessible: true,
          sanitaryProducts: false,
          showers: false,
          reviews: [
            {
              id: '9',
              userName: 'Anita',
              rating: 4,
              date: '2024-01-07',
              comment: 'Good community facility.',
              status: 'approved'
            }
          ]
        },
        {
          id: '10',
          name: 'Sports Complex Facility',
          position: { lat: userLat - 0.002, lng: userLng + 0.003 },
          paid: true,
          price: '₹10',
          hygieneRating: 4.6,
          wheelchairAccessible: true,
          sanitaryProducts: true,
          showers: true,
          reviews: [
            {
              id: '10',
              userName: 'Vikram',
              rating: 5,
              date: '2024-01-06',
              comment: 'Excellent facilities with shower.',
              status: 'approved'
            }
          ]
        }
      ];

      setToilets(sampleToilets);
    });
  }, []);

  const handleLogin = (adminStatus: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(adminStatus);
    setShowLogin(false);
  };

  const handleAddToilet = (newToilet: Omit<ToiletLocation, 'id'>) => {
    const toilet: ToiletLocation = {
      ...newToilet,
      id: Date.now().toString(),
      reviews: []
    };
    setToilets(prev => [...prev, toilet]);
  };

  const handleReviewSubmit = (toiletId: string, review: Omit<Review, 'id' | 'date' | 'status'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: isAdmin ? 'approved' : 'pending'
    };

    setToilets(prev => prev.map(toilet => {
      if (toilet.id === toiletId) {
        return {
          ...toilet,
          reviews: [newReview, ...toilet.reviews]
        };
      }
      return toilet;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="text-blue-500" size={24} />
              <h1 className="text-2xl font-bold text-gray-900">Public Facility Finder</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowMap(true)}
                  className={`p-2 rounded-lg ${
                    showMap ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <MapIcon size={20} />
                </button>
                <button
                  onClick={() => setShowMap(false)}
                  className={`p-2 rounded-lg ${
                    !showMap ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <button
                      onClick={() => setShowAddToilet(true)}
                      className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      <Plus size={20} />
                      Add Facility
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setIsAdmin(false);
                    }}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Filters filters={filters} onFilterChange={setFilters} />
            {showMap ? (
              <Map 
                toilets={toilets}
                onToiletSelect={setSelectedToilet}
                filters={filters}
              />
            ) : (
              <ToiletList
                toilets={toilets}
                onToiletSelect={setSelectedToilet}
                filters={filters}
              />
            )}
          </div>
          <div>
            {selectedToilet && (
              <ToiletDetails
                toilet={selectedToilet}
                onClose={() => setSelectedToilet(null)}
                onReviewSubmit={handleReviewSubmit}
              />
            )}
          </div>
        </div>
      </main>

      {showLogin && (
        <Auth onLogin={handleLogin} onClose={() => setShowLogin(false)} />
      )}

      {showAddToilet && (
        <AddToilet onAdd={handleAddToilet} onClose={() => setShowAddToilet(false)} />
      )}
    </div>
  );
}

export default App;