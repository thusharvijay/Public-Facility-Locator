import React from 'react';
import { Star, ArmchairIcon as WheelchairIcon, ShoppingBag, ShowerHead as Shower } from 'lucide-react';
import type { ToiletLocation } from '../types';

interface ToiletListProps {
  toilets: ToiletLocation[];
  onToiletSelect: (toilet: ToiletLocation) => void;
  filters: {
    paid: boolean | null;
    wheelchairAccessible: boolean | null;
    sanitaryProducts: boolean | null;
    showers: boolean | null;
    minRating: number;
  };
}

export default function ToiletList({ toilets, onToiletSelect, filters }: ToiletListProps) {
  const filteredToilets = toilets.filter(toilet => {
    if (filters.paid !== null && toilet.paid !== filters.paid) return false;
    if (filters.wheelchairAccessible && !toilet.wheelchairAccessible) return false;
    if (filters.sanitaryProducts && !toilet.sanitaryProducts) return false;
    if (filters.showers && !toilet.showers) return false;
    if (toilet.hygieneRating < filters.minRating) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {filteredToilets.map(toilet => (
        <div
          key={toilet.id}
          className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onToiletSelect(toilet)}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{toilet.name}</h3>
            <span className={`text-sm px-2 py-1 rounded ${
              toilet.paid 
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-600'
            }`}>
              {toilet.paid ? toilet.price : 'Free'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
              <Star className={`${toilet.hygieneRating >= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400'}`} size={16} />
              <span className="ml-1">{toilet.hygieneRating.toFixed(1)}/5</span>
              <span className="ml-2 text-gray-500">({toilet.reviews.length} reviews)</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {toilet.wheelchairAccessible && (
              <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                <WheelchairIcon size={12} />
                <span>Wheelchair</span>
              </span>
            )}
            {toilet.sanitaryProducts && (
              <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                <ShoppingBag size={12} />
                <span>Sanitary</span>
              </span>
            )}
            {toilet.showers && (
              <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                <Shower size={12} />
                <span>Showers</span>
              </span>
            )}
          </div>
          
          {toilet.reviews.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Latest: "{toilet.reviews[0].comment.slice(0, 60)}..."
            </div>
          )}
        </div>
      ))}
      
      {filteredToilets.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No facilities match your filters
        </div>
      )}
    </div>
  );
}