export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  originalPrice?: number;
  mileage: number;
  condition: 'new' | 'used' | 'certified';
  bodyType: string;
  fuelType: string;
  transmission: string;
  drivetrain: string;
  exteriorColor: string;
  interiorColor: string;
  engine: string;
  vin: string;
  images: string[];
  description: string;
  features: string[];
  location: {
    city: string;
    state: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
  };
  dealer: {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    rating: number;
    verified: boolean;
  };
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  arbitrageScore?: number;
  marketValue?: number;
  savings?: number;
}

export interface SearchFilters {
  query?: string;
  make?: string[];
  model?: string[];
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  mileageMax?: number;
  condition?: string[];
  bodyType?: string[];
  fuelType?: string[];
  transmission?: string[];
  location?: {
    city?: string;
    state?: string;
    radius?: number;
    zipCode?: string;
  };
  sortBy?: 'price' | 'year' | 'mileage' | 'arbitrage' | 'distance';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResponse {
  vehicles: Vehicle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: {
    makes: FilterOption[];
    models: FilterOption[];
    bodyTypes: FilterOption[];
    fuelTypes: FilterOption[];
    transmissions: FilterOption[];
    priceRange: { min: number; max: number };
    yearRange: { min: number; max: number };
  };
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface SearchSuggestion {
  type: 'make' | 'model' | 'location';
  value: string;
  label: string;
  count?: number;
}
