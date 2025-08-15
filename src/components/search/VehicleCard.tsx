'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Calendar, Gauge, Fuel, Settings } from 'lucide-react';
import { Vehicle } from '@/types/vehicle';
import { useAppDispatch } from '@/store/hooks';
import { toggleFavorite } from '@/store/slices/vehicleSlice';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
  viewMode?: 'grid' | 'list';
  className?: string;
}

export default function VehicleCard({ vehicle, viewMode = 'grid', className }: VehicleCardProps) {
  const dispatch = useAppDispatch();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(vehicle.id));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

  const getSavingsPercentage = () => {
    if (!vehicle.originalPrice || !vehicle.savings) return null;
    return Math.round((vehicle.savings / vehicle.originalPrice) * 100);
  };

  if (viewMode === 'list') {
    return (
      <Link href={`/vehicles/${vehicle.id}`}>
        <div className={cn(
          "bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow",
          "cursor-pointer", className
        )}>
          <div className="flex space-x-4">
            {/* Image */}
            <div className="relative w-48 h-32 flex-shrink-0">
              <Image
                src={vehicle.images[0] || '/placeholder-car.jpg'}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                fill
                className="object-cover rounded-lg"
              />
              {vehicle.condition === 'new' && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  NEW
                </div>
              )}
              {vehicle.condition === 'certified' && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  CERTIFIED
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-sm text-gray-600">{vehicle.bodyType} • {vehicle.transmission}</p>
                </div>
                
                <button
                  onClick={handleFavoriteClick}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Heart 
                    className={cn(
                      "h-5 w-5",
                      vehicle.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                    )} 
                  />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Gauge className="h-4 w-4" />
                  <span>{formatMileage(vehicle.mileage)} mi</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Fuel className="h-4 w-4" />
                  <span className="capitalize">{vehicle.fuelType}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Settings className="h-4 w-4" />
                  <span className="capitalize">{vehicle.transmission}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{vehicle.location.city}, {vehicle.location.state}</span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(vehicle.price)}
                    </span>
                    {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(vehicle.originalPrice)}
                      </span>
                    )}
                  </div>
                  {vehicle.savings && getSavingsPercentage() && (
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-green-600 font-medium">
                        Save {formatPrice(vehicle.savings)}
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {getSavingsPercentage()}% OFF
                      </span>
                    </div>
                  )}
                  {vehicle.arbitrageScore && (
                    <div className="text-sm text-blue-600 mt-1">
                      Arbitrage Score: {vehicle.arbitrageScore}/100
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">{vehicle.dealer.name}</div>
                  {vehicle.dealer.verified && (
                    <span className="inline-flex items-center text-xs text-green-600">
                      ✓ Verified Dealer
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view
  return (
    <Link href={`/vehicles/${vehicle.id}`}>
      <div className={cn(
        "bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow",
        "cursor-pointer group", className
      )}>
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={vehicle.images[0] || '/placeholder-car.jpg'}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-1">
            {vehicle.condition === 'new' && (
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                NEW
              </div>
            )}
            {vehicle.condition === 'certified' && (
              <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                CERTIFIED
              </div>
            )}
            {vehicle.savings && getSavingsPercentage() && (
              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                {getSavingsPercentage()}% OFF
              </div>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full 
                     shadow-sm transition-colors backdrop-blur-sm"
          >
            <Heart 
              className={cn(
                "h-4 w-4",
                vehicle.isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
              )} 
            />
          </button>

          {/* Image Count */}
          {vehicle.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
              +{vehicle.images.length - 1} photos
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm text-gray-600">{vehicle.bodyType}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Gauge className="h-3 w-3" />
              <span>{formatMileage(vehicle.mileage)} mi</span>
            </div>
            <div className="flex items-center space-x-1">
              <Fuel className="h-3 w-3" />
              <span className="capitalize">{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Settings className="h-3 w-3" />
              <span className="capitalize">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{vehicle.location.city}, {vehicle.location.state}</span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(vehicle.price)}
              </span>
              {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(vehicle.originalPrice)}
                </span>
              )}
            </div>
            {vehicle.savings && (
              <div className="text-green-600 font-medium text-sm">
                Save {formatPrice(vehicle.savings)}
              </div>
            )}
          </div>

          {/* Dealer Info */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 truncate">{vehicle.dealer.name}</span>
            {vehicle.dealer.verified && (
              <span className="text-green-600 text-xs">✓ Verified</span>
            )}
          </div>

          {/* Arbitrage Score */}
          {vehicle.arbitrageScore && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">Arbitrage Score</span>
              <div className="flex items-center space-x-1">
                <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${vehicle.arbitrageScore}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-blue-600">
                  {vehicle.arbitrageScore}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
