import React from 'react';
import { Star, ShoppingBag } from 'lucide-react';

interface FiltersProps {
  filters: {
    paid: boolean | null;
    wheelchairAccessible: boolean | null;
    sanitaryProducts: boolean | null;
    showers: boolean | null;
    minRating: number;
  };
  onFilterChange: (filters: any) => void;
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <h3 className="font-semibold text-lg mb-4">Filters</h3>
      
      <div className="space-y-4">
        {/* Payment Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700">Payment</label>
          <div className="mt-2 flex gap-2">
            <button
              className={`px-3 py-1 rounded-full text-sm ${
                filters.paid === null
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => onFilterChange({ ...filters, paid: null })}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm ${
                filters.paid === false
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => onFilterChange({ ...filters, paid: false })}
            >
              Free
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm ${
                filters.paid === true
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => onFilterChange({ ...filters, paid: true })}
            >
              Paid
            </button>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="text-sm font-medium text-gray-700">Amenities</label>
          <div className="mt-2 space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.wheelchairAccessible || false}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    wheelchairAccessible: e.target.checked,
                  })
                }
                className="rounded text-blue-500"
              />
              <span className="ml-2 text-sm">Wheelchair Accessible</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.sanitaryProducts || false}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    sanitaryProducts: e.target.checked,
                  })
                }
                className="rounded text-blue-500"
              />
              <div className="ml-2 flex items-center gap-2">
                <ShoppingBag size={16} />
                <span className="text-sm">Sanitary Products</span>
              </div>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.showers || false}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    showers: e.target.checked,
                  })
                }
                className="rounded text-blue-500"
              />
              <span className="ml-2 text-sm">Showers Available</span>
            </label>
          </div>
        </div>

        {/* Minimum Rating */}
        <div>
          <label className="text-sm font-medium text-gray-700">Minimum Rating</label>
          <div className="flex items-center gap-2 mt-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                className={`p-2 rounded ${
                  filters.minRating === rating
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => onFilterChange({ ...filters, minRating: rating })}
              >
                <Star size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}