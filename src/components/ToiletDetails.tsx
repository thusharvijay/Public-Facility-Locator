import React, { useState } from 'react';
import { X, Star, ArmchairIcon as WheelchairIcon, ShoppingBag, ShowerHead as Shower, Navigation2 } from 'lucide-react';
import type { ToiletLocation, Review } from '../types';
import ReviewForm from './ReviewForm';

interface ToiletDetailsProps {
  toilet: ToiletLocation;
  onClose: () => void;
  onReviewSubmit?: (toiletId: string, review: Omit<Review, 'id' | 'date' | 'status'>) => void;
}

export default function ToiletDetails({ toilet, onClose, onReviewSubmit }: ToiletDetailsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleReviewSubmit = (review: Omit<Review, 'id' | 'date' | 'status'>) => {
    if (onReviewSubmit) {
      onReviewSubmit(toilet.id, review);
    }
    setShowReviewForm(false);
  };

  const handleGetDirections = () => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const origin = `${position.coords.latitude},${position.coords.longitude}`;
        const destination = `${toilet.position.lat},${toilet.position.lng}`;
        const googleMapsUrl = `https://www.google.com/maps/dir/${origin}/${destination}`;
        window.open(googleMapsUrl, '_blank');
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Please enable location services to get directions.");
      }
    );
  };

  const approvedReviews = toilet.reviews.filter(review => review.status === 'approved');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">{toilet.name}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Star className="text-yellow-400 fill-yellow-400" size={20} />
            <span className="ml-1 font-semibold">{toilet.hygieneRating.toFixed(1)}/5</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            toilet.paid 
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {toilet.paid ? toilet.price : 'Free'}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {toilet.wheelchairAccessible && (
            <div className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1 rounded-full">
              <WheelchairIcon size={16} />
              <span>Wheelchair Accessible</span>
            </div>
          )}
          {toilet.sanitaryProducts && (
            <div className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1 rounded-full">
              <ShoppingBag size={16} />
              <span>Sanitary Products</span>
            </div>
          )}
          {toilet.showers && (
            <div className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1 rounded-full">
              <Shower size={16} />
              <span>Showers Available</span>
            </div>
          )}
        </div>

        <button
          onClick={handleGetDirections}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Navigation2 size={20} />
          Get Directions (Google Maps)
        </button>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Reviews</h3>
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Write Review
            </button>
          </div>

          {showReviewForm ? (
            <div className="mb-6">
              <ReviewForm onSubmit={handleReviewSubmit} />
            </div>
          ) : (
            <div className="space-y-4">
              {approvedReviews.length > 0 ? (
                approvedReviews.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-700">{review.comment}</p>
                    {review.audioUrl && (
                      <div className="mt-2">
                        <audio controls src={review.audioUrl} className="w-full" />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}