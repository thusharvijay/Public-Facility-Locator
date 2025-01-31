import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import Map from './components/Map';
import Filters from './components/Filters';
import ToiletList from './components/ToiletList';
import ToiletDetails from './components/ToiletDetails';
import AddToilet from './components/AddToilet';
import Auth from './components/Auth';
import CommunityTab from './components/CommunityTab';
import { Map as MapIcon, List, Users } from 'lucide-react';
import type { ToiletLocation, Review, CommunityOpinion } from './types';

// Generate random toilets near the default location
const generateRandomToilets = (): ToiletLocation[] => {
  const defaultLat = 8.5241;
  const defaultLng = 76.9366;
  
  return Array.from({ length: 5 }, (_, i) => ({
    id: `toilet-${i + 1}`,
    name: `Public Toilet ${i + 1}`,
    position: {
      lat: defaultLat + (Math.random() - 0.5) * 0.01,
      lng: defaultLng + (Math.random() - 0.5) * 0.01
    },
    paid: Math.random() > 0.5,
    price: Math.random() > 0.5 ? '₹5' : undefined,
    hygieneRating: Math.floor(Math.random() * 3) + 3,
    wheelchairAccessible: Math.random() > 0.5,
    sanitaryProducts: Math.random() > 0.5,
    showers: Math.random() > 0.3,
    reviews: []
  }));
};

type Tab = 'map' | 'list' | 'community';

export default function App() {
  const [toilets, setToilets] = useState<ToiletLocation[]>(generateRandomToilets());
  const [selectedToilet, setSelectedToilet] = useState<ToiletLocation | null>(null);
  const [showAddToilet, setShowAddToilet] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('map');
  const [communityOpinions, setCommunityOpinions] = useState<CommunityOpinion[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const [filters, setFilters] = useState({
    paid: null as boolean | null,
    wheelchairAccessible: false,
    sanitaryProducts: false,
    showers: false,
    minRating: 1,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }, []);

  const handleReviewSubmit = (toiletId: string, review: Omit<Review, 'id' | 'date' | 'status'>) => {
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      status: 'approved'
    };

    setToilets(prevToilets => 
      prevToilets.map(toilet => {
        if (toilet.id === toiletId) {
          return {
            ...toilet,
            reviews: [newReview, ...toilet.reviews]
          };
        }
        return toilet;
      })
    );

    if (selectedToilet?.id === toiletId) {
      setSelectedToilet(prev => prev ? {
        ...prev,
        reviews: [newReview, ...prev.reviews]
      } : null);
    }
  };

  const handleAddOpinion = (opinion: Omit<CommunityOpinion, 'id' | 'date' | 'likes' | 'dislikes'>) => {
    const newOpinion: CommunityOpinion = {
      ...opinion,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      likes: 0,
      dislikes: 0
    };

    setCommunityOpinions(prev => [newOpinion, ...prev]);
  };

  const handleOpinionReaction = (opinionId: string, reaction: 'like' | 'dislike') => {
    setCommunityOpinions(prev => 
      prev.map(opinion => {
        if (opinion.id === opinionId) {
          const previousReaction = opinion.userReaction;
          let likes = opinion.likes;
          let dislikes = opinion.dislikes;

          if (previousReaction === 'like') likes--;
          if (previousReaction === 'dislike') dislikes--;

          if (reaction !== previousReaction) {
            if (reaction === 'like') likes++;
            if (reaction === 'dislike') dislikes++;
          }

          return {
            ...opinion,
            likes,
            dislikes,
            userReaction: reaction === previousReaction ? undefined : reaction
          };
        }
        return opinion;
      })
    );
  };

  const sortedToilets = [...toilets].sort((a, b) => {
    if (!userLocation) return 0;
    
    const distA = Math.sqrt(
      Math.pow(a.position.lat - userLocation.lat, 2) + 
      Math.pow(a.position.lng - userLocation.lng, 2)
    );
    const distB = Math.sqrt(
      Math.pow(b.position.lat - userLocation.lat, 2) + 
      Math.pow(b.position.lng - userLocation.lng, 2)
    );
    
    return distA - distB;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Public Facilities Finder</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('map')}
                className={`p-2 rounded-md ${
                  activeTab === 'map' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
                title="Map View"
              >
                <MapIcon size={24} />
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`p-2 rounded-md ${
                  activeTab === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
                title="List View"
              >
                <List size={24} />
              </button>
              <button
                onClick={() => setActiveTab('community')}
                className={`p-2 rounded-md ${
                  activeTab === 'community' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
                title="Community"
              >
                <Users size={24} />
              </button>
              <button
                onClick={() => setShowAuth(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                {isAdmin ? 'Admin' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-6">
            <div className="space-y-6">
              <Filters filters={filters} onFilterChange={setFilters} />
              <ToiletList
                toilets={sortedToilets}
                onToiletSelect={setSelectedToilet}
                filters={filters}
                userLocation={userLocation}
              />
            </div>
            <div className="relative">
              <Map
                toilets={toilets}
                onToiletSelect={setSelectedToilet}
                filters={filters}
              />
              {isAdmin && (
                <button
                  onClick={() => setShowAddToilet(true)}
                  className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 shadow-lg"
                >
                  Add Facility
                </button>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'list' && (
          <div className="space-y-6">
            <Filters filters={filters} onFilterChange={setFilters} />
            <ToiletList
              toilets={sortedToilets}
              onToiletSelect={setSelectedToilet}
              filters={filters}
              userLocation={userLocation}
            />
          </div>
        )}
        
        {activeTab === 'community' && (
          <CommunityTab
            opinions={communityOpinions}
            onAddOpinion={handleAddOpinion}
            onReact={handleOpinionReaction}
          />
        )}
      </main>

      {selectedToilet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <ToiletDetails
              toilet={selectedToilet}
              onClose={() => setSelectedToilet(null)}
              onReviewSubmit={handleReviewSubmit}
            />
          </div>
        </div>
      )}

      {showAddToilet && (
        <AddToilet
          onAdd={(toilet) => {
            setToilets(prev => [...prev, { ...toilet, id: Math.random().toString(36).substr(2, 9), reviews: [] }]);
            setShowAddToilet(false);
          }}
          onClose={() => setShowAddToilet(false)}
        />
      )}

      {showAuth && (
        <Auth
          onLogin={(adminStatus) => {
            setIsAdmin(adminStatus);
            setShowAuth(false);
          }}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}