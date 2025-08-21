'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Calendar, Gauge, Fuel, Settings, Star, TrendingUp, Shield, Eye } from 'lucide-react';
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
      <Link href={`/vehicle/${vehicle.id}`}>
        <div className={cn(
          "bg-white border border-gray-100 rounded-xl p-6 hover:shadow-xl transition-all duration-300",
          "cursor-pointer group transform hover:-translate-y-0.5", className
        )}>
          <div className="flex space-x-6">
            {/* Image */}
            <div className="relative w-56 h-36 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <Image
                src={vehicle.images[0] || '/placeholder-car.jpg'}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col space-y-1">
                {vehicle.condition === 'new' && (
                  <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
                    NEW
                  </div>
                )}
                {vehicle.condition === 'certified' && (
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
                    CERTIFIED
                  </div>
                )}
                {vehicle.savings && getSavingsPercentage() && (
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    {getSavingsPercentage()}% OFF
                  </div>
                )}
              </div>

              {/* Image Count */}
              {vehicle.images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
                  📷 {vehicle.images.length}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 truncate mb-2 group-hover:text-blue-600 transition-colors">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <div className="flex items-center space-x-4 mb-3">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{vehicle.bodyType}</p>
                    {vehicle.dealer.verified && (
                      <span className="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        ✓ Verified Dealer
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleFavoriteClick}
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-all duration-200 ml-4"
                >
                  <Heart 
                    className={cn(
                      "h-5 w-5 transition-all duration-200",
                      vehicle.isFavorite 
                        ? "fill-red-500 text-red-500 scale-110" 
                        : "text-gray-400 hover:text-red-400"
                    )} 
                  />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                  <Gauge className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{formatMileage(vehicle.mileage)} mi</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                  <Fuel className="h-4 w-4 text-green-500" />
                  <span className="font-medium capitalize">{vehicle.fuelType}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                  <Settings className="h-4 w-4 text-purple-500" />
                  <span className="font-medium capitalize">{vehicle.transmission}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span className="font-medium">{vehicle.location.city}, {vehicle.location.state}</span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="flex-1">
                  {/* Price Section */}
                  <div className="mb-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex items-baseline space-x-2 mb-1">
                      <span className="text-3xl font-bold text-gray-900">
                        {formatPrice(vehicle.price)}
                      </span>
                      {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                        <span className="text-xl text-gray-400 line-through">
                          {formatPrice(vehicle.originalPrice)}
                        </span>
                      )}
                    </div>
                    {vehicle.savings && (
                      <div className="flex items-center space-x-2">
                        <span className="text-emerald-600 font-bold text-sm">
                          💰 Save {formatPrice(vehicle.savings)}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">
                          {getSavingsPercentage()}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Arbitrage Score */}
                  {vehicle.arbitrageScore && (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 border border-indigo-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Arbitrage Score</span>
                        <span className="text-lg font-bold text-indigo-600">
                          {vehicle.arbitrageScore}/100
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${vehicle.arbitrageScore}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {vehicle.arbitrageScore >= 80 ? '🔥 Excellent Deal' : 
                         vehicle.arbitrageScore >= 60 ? '👍 Good Value' : '💡 Fair Price'}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-right ml-6">
                  <div className="text-sm text-gray-600 mb-2 font-medium">{vehicle.dealer.name}</div>
                  <div className="flex items-center justify-end space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={cn(
                        "text-sm",
                        i < Math.floor(vehicle.dealer.rating) ? "text-yellow-400" : "text-gray-300"
                      )}>
                        ⭐
                      </span>
                    ))}
                    <span className="text-sm text-gray-500 ml-1">
                      {vehicle.dealer.rating}
                    </span>
                  </div>
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
    <Link href={`/vehicle/${vehicle.id}`}>
      <div className={cn(
        "bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300",
        "cursor-pointer group transform hover:-translate-y-1", className
      )}>
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={vehicle.images[0] || '/placeholder-car.jpg'}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {vehicle.condition === 'new' && (
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                NEW
              </div>
            )}
            {vehicle.condition === 'certified' && (
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                CERTIFIED
              </div>
            )}
            {vehicle.savings && getSavingsPercentage() && (
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                {getSavingsPercentage()}% OFF
              </div>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2.5 bg-white/95 hover:bg-white rounded-full 
                     shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-all duration-200",
                vehicle.isFavorite 
                  ? "fill-red-500 text-red-500 scale-110" 
                  : "text-gray-600 hover:text-red-400"
              )} 
            />
          </button>

          {/* Image Count */}
          {vehicle.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
              📷 {vehicle.images.length}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{vehicle.bodyType}</p>
              {vehicle.dealer.verified && (
                <span className="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  ✓ Verified Dealer
                </span>
              )}
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <Gauge className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{formatMileage(vehicle.mileage)} mi</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <Fuel className="h-4 w-4 text-green-500" />
              <span className="font-medium capitalize">{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <Settings className="h-4 w-4 text-purple-500" />
              <span className="font-medium capitalize">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <MapPin className="h-4 w-4 text-red-500" />
              <span className="font-medium">{vehicle.location.city}, {vehicle.location.state}</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-baseline space-x-2 mb-1">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(vehicle.price)}
              </span>
              {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(vehicle.originalPrice)}
                </span>
              )}
            </div>
            {vehicle.savings && (
              <div className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold text-sm">
                  💰 Save {formatPrice(vehicle.savings)}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">
                  {getSavingsPercentage()}% OFF
                </span>
              </div>
            )}
          </div>

          {/* Arbitrage Score */}
          {vehicle.arbitrageScore && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Arbitrage Score</span>
                <span className="text-lg font-bold text-indigo-600">
                  {vehicle.arbitrageScore}/100
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${vehicle.arbitrageScore}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {vehicle.arbitrageScore >= 80 ? '🔥 Excellent Deal' : 
                 vehicle.arbitrageScore >= 60 ? '👍 Good Value' : '💡 Fair Price'}
              </div>
            </div>
          )}

          {/* Dealer Info */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 truncate font-medium">{vehicle.dealer.name}</span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={cn(
                    "text-xs",
                    i < Math.floor(vehicle.dealer.rating) ? "text-yellow-400" : "text-gray-300"
                  )}>
                    ⭐
                  </span>
                ))}
                <span className="text-xs text-gray-500 ml-1">
                  {vehicle.dealer.rating}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
