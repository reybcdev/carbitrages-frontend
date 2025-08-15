// Mock vehicle service for MVP testing
// This simulates the backend API responses using the same mock data structure

import { Vehicle, SearchFilters } from '@/types/vehicle';

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 28500,
    originalPrice: 32000,
    mileage: 15000,
    condition: 'used',
    bodyType: 'sedan',
    fuelType: 'gasoline',
    transmission: 'automatic',
    drivetrain: 'fwd',
    exteriorColor: 'Silver',
    interiorColor: 'Black',
    engine: '2.5L 4-Cylinder',
    vin: '1HGBH41JXMN109186',
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop'
    ],
    description: 'Well-maintained Toyota Camry with low mileage and clean history.',
    features: ['Backup Camera', 'Bluetooth', 'Cruise Control', 'Power Windows', 'Air Conditioning'],
    location: {
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      latitude: 34.0522,
      longitude: -118.2437,
    },
    dealer: {
      id: 'dealer1',
      name: 'Premium Auto Sales',
      phone: '(555) 123-4567',
      email: 'sales@premiumauto.com',
      address: '123 Auto Row, Los Angeles, CA 90210',
      rating: 4.5,
      verified: true,
    },
    arbitrageScore: 85,
    marketValue: 30000,
    savings: 3500,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    make: 'Honda',
    model: 'Accord',
    year: 2022,
    price: 26800,
    originalPrice: 29500,
    mileage: 22000,
    condition: 'used',
    bodyType: 'sedan',
    fuelType: 'gasoline',
    transmission: 'automatic',
    drivetrain: 'fwd',
    exteriorColor: 'White',
    interiorColor: 'Beige',
    engine: '1.5L Turbo',
    vin: '1HGCV1F30NA123456',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop'
    ],
    description: 'Reliable Honda Accord with excellent fuel economy and safety features.',
    features: ['Apple CarPlay', 'Lane Keeping Assist', 'Adaptive Cruise Control', 'Heated Seats'],
    location: {
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      latitude: 37.7749,
      longitude: -122.4194,
    },
    dealer: {
      id: 'dealer2',
      name: 'Bay Area Motors',
      phone: '(415) 555-0123',
      email: 'info@bayareamotors.com',
      address: '456 Market St, San Francisco, CA 94102',
      rating: 4.2,
      verified: true,
    },
    arbitrageScore: 78,
    marketValue: 28000,
    savings: 2700,
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z',
  },
  {
    id: '3',
    make: 'Ford',
    model: 'F-150',
    year: 2023,
    price: 42500,
    originalPrice: 48000,
    mileage: 8500,
    condition: 'used',
    bodyType: 'truck',
    fuelType: 'gasoline',
    transmission: 'automatic',
    drivetrain: 'awd',
    exteriorColor: 'Blue',
    interiorColor: 'Gray',
    engine: '3.5L V6 EcoBoost',
    vin: '1FTFW1E50NFA12345',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop'
    ],
    description: 'Powerful Ford F-150 with EcoBoost engine and excellent towing capacity.',
    features: ['4WD', 'Tow Package', 'Bed Liner', 'Running Boards', 'Backup Camera'],
    location: {
      city: 'Austin',
      state: 'TX',
      zipCode: '73301',
      latitude: 30.2672,
      longitude: -97.7431,
    },
    dealer: {
      id: 'dealer3',
      name: 'Texas Truck Center',
      phone: '(512) 555-7890',
      email: 'sales@texastrucks.com',
      address: '789 Truck Way, Austin, TX 73301',
      rating: 4.7,
      verified: true,
    },
    arbitrageScore: 92,
    marketValue: 45000,
    savings: 5500,
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
  },
  {
    id: '4',
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    price: 38900,
    originalPrice: 42000,
    mileage: 2500,
    condition: 'used',
    bodyType: 'sedan',
    fuelType: 'electric',
    transmission: 'automatic',
    drivetrain: 'rwd',
    exteriorColor: 'Red',
    interiorColor: 'Black',
    engine: 'Electric Motor',
    vin: '5YJ3E1EA8PF123456',
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop'
    ],
    description: 'Nearly new Tesla Model 3 with Autopilot and zero emissions.',
    features: ['Autopilot', 'Supercharging', 'Premium Audio', 'Glass Roof', 'Mobile Connector'],
    location: {
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      latitude: 47.6062,
      longitude: -122.3321,
    },
    dealer: {
      id: 'dealer4',
      name: 'Electric Vehicle Hub',
      phone: '(206) 555-3456',
      email: 'info@evhub.com',
      address: '321 Electric Ave, Seattle, WA 98101',
      rating: 4.8,
      verified: true,
    },
    arbitrageScore: 88,
    marketValue: 40000,
    savings: 3100,
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
  },
  {
    id: '5',
    make: 'BMW',
    model: 'X5',
    year: 2022,
    price: 52000,
    originalPrice: 58000,
    mileage: 18000,
    condition: 'used',
    bodyType: 'suv',
    fuelType: 'gasoline',
    transmission: 'automatic',
    drivetrain: 'awd',
    exteriorColor: 'Black',
    interiorColor: 'Tan',
    engine: '3.0L Turbo I6',
    vin: '5UXCR6C08N9123456',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop'
    ],
    description: 'Luxury BMW X5 with premium features and excellent performance.',
    features: ['Leather Seats', 'Navigation', 'Panoramic Sunroof', 'Heated Seats', 'Premium Audio'],
    location: {
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      latitude: 25.7617,
      longitude: -80.1918,
    },
    dealer: {
      id: 'dealer5',
      name: 'Luxury Motors Miami',
      phone: '(305) 555-9876',
      email: 'sales@luxurymotors.com',
      address: '654 Ocean Drive, Miami, FL 33101',
      rating: 4.6,
      verified: true,
    },
    arbitrageScore: 76,
    marketValue: 55000,
    savings: 6000,
    createdAt: '2024-01-11T11:30:00Z',
    updatedAt: '2024-01-11T11:30:00Z',
  }
];


export const mockVehicleService = {
  // Simulate API delay
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  searchVehicles: async (filters: SearchFilters = {}, page: number = 1, limit: number = 12) => {
    await mockVehicleService.delay(500); // Simulate API call

    let results = [...mockVehicles];

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(v => 
        v.make.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query) ||
        `${v.make} ${v.model}`.toLowerCase().includes(query)
      );
    }

    if (filters.make?.length) {
      results = results.filter(v => 
        filters.make!.some(make => v.make.toLowerCase() === make.toLowerCase())
      );
    }

    if (filters.model?.length) {
      results = results.filter(v => 
        filters.model!.some(model => v.model.toLowerCase() === model.toLowerCase())
      );
    }

    if (filters.bodyType?.length) {
      results = results.filter(v => filters.bodyType!.includes(v.bodyType));
    }

    if (filters.condition?.length) {
      results = results.filter(v => filters.condition!.includes(v.condition));
    }

    if (filters.priceMin) {
      results = results.filter(v => v.price >= filters.priceMin!);
    }

    if (filters.priceMax) {
      results = results.filter(v => v.price <= filters.priceMax!);
    }

    if (filters.yearMin) {
      results = results.filter(v => v.year >= filters.yearMin!);
    }

    if (filters.yearMax) {
      results = results.filter(v => v.year <= filters.yearMax!);
    }

    if (filters.mileageMax) {
      results = results.filter(v => v.mileage <= filters.mileageMax!);
    }

    if (filters.fuelType?.length) {
      results = results.filter(v => filters.fuelType!.includes(v.fuelType));
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'arbitrageScore';
    const sortOrder = filters.sortOrder || 'desc';

    results.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'year':
          aValue = a.year;
          bValue = b.year;
          break;
        case 'mileage':
          aValue = a.mileage;
          bValue = b.mileage;
          break;
        case 'arbitrageScore':
        default:
          aValue = a.arbitrageScore;
          bValue = b.arbitrageScore;
          break;
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);

    return {
      vehicles: paginatedResults,
      total: results.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(results.length / limit),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(results.length / limit),
        totalResults: results.length,
        hasNextPage: endIndex < results.length,
        hasPrevPage: page > 1,
      },
      filters: {
        makes: [...new Set(mockVehicles.map(v => v.make))].sort(),
        models: [...new Set(mockVehicles.map(v => v.model))].sort(),
        bodyTypes: [...new Set(mockVehicles.map(v => v.bodyType))].sort(),
        conditions: [...new Set(mockVehicles.map(v => v.condition))].sort(),
        fuelTypes: [...new Set(mockVehicles.map(v => v.fuelType))].sort(),
        transmissions: [...new Set(mockVehicles.map(v => v.transmission))].sort(),
        priceRange: {
          min: Math.min(...mockVehicles.map(v => v.price)),
          max: Math.max(...mockVehicles.map(v => v.price)),
        },
        yearRange: {
          min: Math.min(...mockVehicles.map(v => v.year)),
          max: Math.max(...mockVehicles.map(v => v.year)),
        },
      },
    };
  },

  getVehicleById: async (id: string) => {
    await mockVehicleService.delay(300);
    return mockVehicles.find(v => v.id === id) || null;
  },

  getSearchSuggestions: async (query: string) => {
    await mockVehicleService.delay(200);
    
    if (!query || query.length < 2) return [];

    const suggestions = [
      { type: 'make', value: 'toyota', label: 'Toyota', count: 150 },
      { type: 'make', value: 'honda', label: 'Honda', count: 120 },
      { type: 'make', value: 'ford', label: 'Ford', count: 98 },
      { type: 'make', value: 'bmw', label: 'BMW', count: 65 },
      { type: 'make', value: 'tesla', label: 'Tesla', count: 38 },
      { type: 'model', value: 'camry', label: 'Toyota Camry', count: 45 },
      { type: 'model', value: 'accord', label: 'Honda Accord', count: 38 },
      { type: 'model', value: 'f-150', label: 'Ford F-150', count: 42 },
      { type: 'model', value: 'model 3', label: 'Tesla Model 3', count: 28 },
    ];

    return suggestions
      .filter(suggestion => 
        suggestion.label.toLowerCase().includes(query.toLowerCase()) ||
        suggestion.value.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 8);
  },

  getFeaturedVehicles: async (limit: number = 6) => {
    await mockVehicleService.delay(300);
    return mockVehicles
      .sort((a, b) => b.arbitrageScore - a.arbitrageScore)
      .slice(0, limit);
  }
};
