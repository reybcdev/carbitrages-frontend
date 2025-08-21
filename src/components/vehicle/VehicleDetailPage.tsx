'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings, 
  Shield, 
  Star,
  Phone,
  Mail,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ExternalLink,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface VehicleImage {
  id: string;
  url: string;
  alt: string;
  type: 'exterior' | 'interior' | 'engine' | 'other';
}

interface VehicleSpec {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface ArbitrageData {
  score: number;
  marketPrice: number;
  listingPrice: number;
  potentialSavings: number;
  confidence: 'high' | 'medium' | 'low';
  factors: string[];
}

interface Dealer {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  phone: string;
  email: string;
  address: string;
  responseTime: string;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  price: number;
  mileage: number;
  condition: 'new' | 'used' | 'certified';
  bodyType: string;
  fuelType: string;
  transmission: string;
  drivetrain: string;
  exteriorColor: string;
  interiorColor: string;
  vin: string;
  stockNumber: string;
  images: VehicleImage[];
  specs: VehicleSpec[];
  features: string[];
  description: string;
  arbitrage: ArbitrageData;
  dealer: Dealer;
  location: string;
  daysOnMarket: number;
  carfaxReport?: string;
  autoCheckReport?: string;
}

interface VehicleDetailPageProps {
  vehicle: Vehicle;
  onBack?: () => void;
  onFavorite?: (vehicleId: string) => void;
  onShare?: (vehicle: Vehicle) => void;
  isFavorited?: boolean;
}

export default function VehicleDetailPage({
  vehicle,
  onBack,
  onFavorite,
  onShare,
  isFavorited = false
}: VehicleDetailPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'features' | 'history'>('overview');

  const handlePreviousImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? vehicle.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === vehicle.images.length - 1 ? 0 : prev + 1
    );
  };

  const getArbitrageColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Results</span>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
                </h1>
                <p className="text-sm text-gray-500 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {vehicle.location}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShare?.(vehicle)}
                className="flex items-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFavorite?.(vehicle.id)}
                className={`flex items-center space-x-2 ${
                  isFavorited ? 'text-red-600 border-red-200' : ''
                }`}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                <span>{isFavorited ? 'Saved' : 'Save'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative">
                <img
                  src={vehicle.images[currentImageIndex]?.url || '/placeholder-car.jpg'}
                  alt={vehicle.images[currentImageIndex]?.alt || 'Vehicle image'}
                  className="w-full h-96 object-cover cursor-pointer"
                  onClick={() => setShowImageModal(true)}
                />
                
                {/* Image Navigation */}
                {vehicle.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePreviousImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Zoom Icon */}
                <button
                  onClick={() => setShowImageModal(true)}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {vehicle.images.length}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {vehicle.images.length > 1 && (
                <div className="p-4 border-t">
                  <div className="flex space-x-2 overflow-x-auto">
                    {vehicle.images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-12 rounded border-2 overflow-hidden ${
                          index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Arbitrage Analysis */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Carbitrage Analysis
                </h3>
                <div className="flex items-center space-x-2">
                  {getConfidenceIcon(vehicle.arbitrage.confidence)}
                  <span className="text-sm text-gray-500 capitalize">
                    {vehicle.arbitrage.confidence} confidence
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold rounded-lg p-3 ${getArbitrageColor(vehicle.arbitrage.score)}`}>
                    {vehicle.arbitrage.score}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Arbitrage Score</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    ${vehicle.arbitrage.marketPrice.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Market Value</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${vehicle.arbitrage.potentialSavings.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Potential Savings</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Analysis Factors:</h4>
                <ul className="space-y-1">
                  {vehicle.arbitrage.factors.map((factor, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Vehicle Details Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'specs', label: 'Specifications' },
                    { id: 'features', label: 'Features' },
                    { id: 'history', label: 'History' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Year</p>
                          <p className="font-medium">{vehicle.year}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Gauge className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Mileage</p>
                          <p className="font-medium">{vehicle.mileage.toLocaleString()} mi</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Fuel className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Fuel Type</p>
                          <p className="font-medium">{vehicle.fuelType}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Settings className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Transmission</p>
                          <p className="font-medium">{vehicle.transmission}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600">{vehicle.description}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicle.specs.map((spec, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center space-x-2">
                          {spec.icon}
                          <span className="text-gray-600">{spec.label}</span>
                        </div>
                        <span className="font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {vehicle.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">VIN</p>
                        <p className="font-mono text-sm">{vehicle.vin}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Stock Number</p>
                        <p className="font-medium">{vehicle.stockNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Days on Market</p>
                        <p className="font-medium">{vehicle.daysOnMarket} days</p>
                      </div>
                    </div>
                    
                    {(vehicle.carfaxReport || vehicle.autoCheckReport) && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Vehicle History Reports</h4>
                        <div className="space-y-2">
                          {vehicle.carfaxReport && (
                            <Link href={vehicle.carfaxReport} target="_blank" className="flex items-center space-x-2 text-blue-600 hover:underline">
                              <ExternalLink className="h-4 w-4" />
                              <span>View CARFAX Report</span>
                            </Link>
                          )}
                          {vehicle.autoCheckReport && (
                            <Link href={vehicle.autoCheckReport} target="_blank" className="flex items-center space-x-2 text-blue-600 hover:underline">
                              <ExternalLink className="h-4 w-4" />
                              <span>View AutoCheck Report</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Pricing and Dealer Info */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${vehicle.price.toLocaleString()}
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    vehicle.condition === 'new' ? 'bg-green-100 text-green-800' :
                    vehicle.condition === 'certified' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {vehicle.condition.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{vehicle.mileage.toLocaleString()} miles</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Instant Contract
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Dealer
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Dealer
                </Button>
              </div>

              {/* Dealer Information */}
              <div className="border-t pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{vehicle.dealer.name}</h3>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(vehicle.dealer.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {vehicle.dealer.rating} ({vehicle.dealer.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  {vehicle.dealer.verified && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Shield className="h-4 w-4" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p>{vehicle.dealer.address}</p>
                  <p>Avg. response time: {vehicle.dealer.responseTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={vehicle.images[currentImageIndex]?.url}
              alt={vehicle.images[currentImageIndex]?.alt}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
