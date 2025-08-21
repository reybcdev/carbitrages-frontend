'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VehicleDetailPage from '@/components/vehicle/VehicleDetailPage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

// Mock vehicle data - in production, this would come from your API
const mockVehicle = {
  id: '1',
  make: 'Toyota',
  model: 'Camry',
  year: 2023,
  trim: 'XLE',
  price: 28500,
  mileage: 15420,
  condition: 'used' as const,
  bodyType: 'Sedan',
  fuelType: 'Gasoline',
  transmission: 'Automatic',
  drivetrain: 'FWD',
  exteriorColor: 'Midnight Black Metallic',
  interiorColor: 'Black',
  vin: '4T1C11AK5NU123456',
  stockNumber: 'TC2023001',
  location: 'Los Angeles, CA',
  daysOnMarket: 12,
  description: 'This pristine 2023 Toyota Camry XLE offers the perfect blend of comfort, reliability, and efficiency. With low mileage and excellent condition, this vehicle represents exceptional value in today\'s market. Features include premium interior materials, advanced safety systems, and Toyota\'s renowned reliability.',
  images: [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      alt: 'Toyota Camry exterior front view',
      type: 'exterior' as const
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      alt: 'Toyota Camry interior dashboard',
      type: 'interior' as const
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      alt: 'Toyota Camry side profile',
      type: 'exterior' as const
    }
  ],
  specs: [
    { label: 'Engine', value: '2.5L 4-Cylinder' },
    { label: 'Horsepower', value: '203 hp' },
    { label: 'Torque', value: '184 lb-ft' },
    { label: 'Fuel Economy', value: '28 city / 39 hwy mpg' },
    { label: 'Drivetrain', value: 'Front-Wheel Drive' },
    { label: 'Transmission', value: '8-Speed Automatic' },
    { label: 'Seating Capacity', value: '5 passengers' },
    { label: 'Cargo Space', value: '15.1 cubic feet' }
  ],
  features: [
    'Toyota Safety Sense 2.0',
    'Adaptive Cruise Control',
    'Lane Departure Alert',
    'Automatic Emergency Braking',
    'Blind Spot Monitor',
    'Rear Cross Traffic Alert',
    'Apple CarPlay & Android Auto',
    '9-inch Touchscreen Display',
    'Wireless Phone Charging',
    'Dual-Zone Climate Control',
    'Heated Front Seats',
    'Power Driver Seat',
    'LED Headlights',
    'Alloy Wheels',
    'Backup Camera',
    'Keyless Entry & Start'
  ],
  arbitrage: {
    score: 85,
    marketPrice: 30200,
    listingPrice: 28500,
    potentialSavings: 1700,
    confidence: 'high' as const,
    factors: [
      'Below market average by 5.6%',
      'Low mileage for model year',
      'Excellent condition rating',
      'High demand model in this area',
      'Dealer has competitive pricing history'
    ]
  },
  dealer: {
    id: 'dealer1',
    name: 'Premium Auto Group',
    rating: 4.7,
    reviewCount: 342,
    verified: true,
    phone: '(555) 123-4567',
    email: 'sales@premiumautogroup.com',
    address: '1234 Auto Mall Dr, Los Angeles, CA 90210',
    responseTime: '< 2 hours'
  },
  carfaxReport: 'https://example.com/carfax-report',
  autoCheckReport: 'https://example.com/autocheck-report'
};

export default function VehicleDetailPageRoute() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [vehicle, setVehicle] = useState(mockVehicle);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    // In production, fetch vehicle data based on params.id
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update vehicle ID to match route param
        setVehicle(prev => ({ ...prev, id: params.id as string }));
        
        // Check if vehicle is favorited (from localStorage or API)
        const favorites = JSON.parse(localStorage.getItem('carbitrages_favorites') || '[]');
        setIsFavorited(favorites.includes(params.id));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        setLoading(false);
      }
    };

    if (params.id) {
      fetchVehicle();
    }
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  const handleFavorite = (vehicleId: string) => {
    const favorites = JSON.parse(localStorage.getItem('carbitrages_favorites') || '[]');
    let updatedFavorites;
    
    if (favorites.includes(vehicleId)) {
      updatedFavorites = favorites.filter((id: string) => id !== vehicleId);
      setIsFavorited(false);
    } else {
      updatedFavorites = [...favorites, vehicleId];
      setIsFavorited(true);
    }
    
    localStorage.setItem('carbitrages_favorites', JSON.stringify(updatedFavorites));
  };

  const handleShare = (vehicle: any) => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        text: `Check out this ${vehicle.year} ${vehicle.make} ${vehicle.model} for $${vehicle.price.toLocaleString()}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  return (
    <VehicleDetailPage
      vehicle={vehicle}
      onBack={handleBack}
      onFavorite={handleFavorite}
      onShare={handleShare}
      isFavorited={isFavorited}
    />
  );
}
