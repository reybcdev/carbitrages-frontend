import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Vehicle, SearchFilters, SearchResponse, SearchSuggestion } from '@/types/vehicle';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Async thunks
export const searchVehicles = createAsyncThunk(
  'vehicles/searchVehicles',
  async ({ filters, page = 1, limit = 12 }: { filters: SearchFilters; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    
    if (filters.query) params.append('query', filters.query);
    if (filters.make?.length) params.append('make', filters.make.join(','));
    if (filters.model?.length) params.append('model', filters.model.join(','));
    if (filters.yearMin) params.append('yearMin', filters.yearMin.toString());
    if (filters.yearMax) params.append('yearMax', filters.yearMax.toString());
    if (filters.priceMin) params.append('priceMin', filters.priceMin.toString());
    if (filters.priceMax) params.append('priceMax', filters.priceMax.toString());
    if (filters.mileageMax) params.append('mileageMax', filters.mileageMax.toString());
    if (filters.condition?.length) params.append('condition', filters.condition.join(','));
    if (filters.bodyType?.length) params.append('bodyType', filters.bodyType.join(','));
    if (filters.fuelType?.length) params.append('fuelType', filters.fuelType.join(','));
    if (filters.transmission?.length) params.append('transmission', filters.transmission.join(','));
    if (filters.location?.city) params.append('city', filters.location.city);
    if (filters.location?.state) params.append('state', filters.location.state);
    if (filters.location?.radius) params.append('radius', filters.location.radius.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await axios.get(`${API_BASE_URL}/vehicles/search?${params.toString()}`);
    return response.data;
  }
);

export const getVehicleById = createAsyncThunk(
  'vehicles/getVehicleById',
  async (vehicleId: string) => {
    const response = await axios.get(`${API_BASE_URL}/vehicles/${vehicleId}`);
    return response.data;
  }
);

export const getSimilarVehicles = createAsyncThunk(
  'vehicles/getSimilarVehicles',
  async (vehicleId: string) => {
    const response = await axios.get(`${API_BASE_URL}/vehicles/${vehicleId}/similar`);
    return response.data;
  }
);

export const getSearchSuggestions = createAsyncThunk(
  'vehicles/getSearchSuggestions',
  async (query: string) => {
    const response = await axios.get(`${API_BASE_URL}/vehicles/suggestions?q=${encodeURIComponent(query)}`);
    return response.data;
  }
);

export const toggleFavorite = createAsyncThunk(
  'vehicles/toggleFavorite',
  async (vehicleId: string, { getState }) => {
    const response = await axios.post(`${API_BASE_URL}/vehicles/${vehicleId}/favorite`);
    return { vehicleId, isFavorite: response.data.isFavorite };
  }
);

export const getFavoriteVehicles = createAsyncThunk(
  'vehicles/getFavoriteVehicles',
  async () => {
    const response = await axios.get(`${API_BASE_URL}/vehicles/favorites`);
    return response.data;
  }
);

interface VehicleState {
  // Search results
  vehicles: Vehicle[];
  searchResponse: SearchResponse | null;
  searchLoading: boolean;
  searchError: string | null;
  
  // Current vehicle details
  currentVehicle: Vehicle | null;
  vehicleLoading: boolean;
  vehicleError: string | null;
  
  // Similar vehicles
  similarVehicles: Vehicle[];
  similarLoading: boolean;
  
  // Search suggestions
  suggestions: SearchSuggestion[];
  suggestionsLoading: boolean;
  
  // Favorites
  favoriteVehicles: Vehicle[];
  favoritesLoading: boolean;
  
  // UI state
  currentFilters: SearchFilters;
  currentPage: number;
  viewMode: 'grid' | 'list';
  showFilters: boolean;
}

const initialState: VehicleState = {
  vehicles: [],
  searchResponse: null,
  searchLoading: false,
  searchError: null,
  
  currentVehicle: null,
  vehicleLoading: false,
  vehicleError: null,
  
  similarVehicles: [],
  similarLoading: false,
  
  suggestions: [],
  suggestionsLoading: false,
  
  favoriteVehicles: [],
  favoritesLoading: false,
  
  currentFilters: {},
  currentPage: 1,
  viewMode: 'grid',
  showFilters: false,
};

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<SearchFilters>) => {
      state.currentFilters = action.payload;
      state.currentPage = 1;
    },
    updateFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
      state.currentFilters = { ...state.currentFilters, ...action.payload };
      state.currentPage = 1;
    },
    clearFilters: (state) => {
      state.currentFilters = {};
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    toggleFilters: (state) => {
      state.showFilters = !state.showFilters;
    },
    clearSearchResults: (state) => {
      state.vehicles = [];
      state.searchResponse = null;
    },
    clearCurrentVehicle: (state) => {
      state.currentVehicle = null;
      state.similarVehicles = [];
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
  },
  extraReducers: (builder) => {
    // Search vehicles
    builder
      .addCase(searchVehicles.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchVehicles.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResponse = action.payload;
        state.vehicles = action.payload.vehicles;
      })
      .addCase(searchVehicles.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.error.message || 'Failed to search vehicles';
      });

    // Get vehicle by ID
    builder
      .addCase(getVehicleById.pending, (state) => {
        state.vehicleLoading = true;
        state.vehicleError = null;
      })
      .addCase(getVehicleById.fulfilled, (state, action) => {
        state.vehicleLoading = false;
        state.currentVehicle = action.payload;
      })
      .addCase(getVehicleById.rejected, (state, action) => {
        state.vehicleLoading = false;
        state.vehicleError = action.error.message || 'Failed to load vehicle';
      });

    // Get similar vehicles
    builder
      .addCase(getSimilarVehicles.pending, (state) => {
        state.similarLoading = true;
      })
      .addCase(getSimilarVehicles.fulfilled, (state, action) => {
        state.similarLoading = false;
        state.similarVehicles = action.payload;
      })
      .addCase(getSimilarVehicles.rejected, (state) => {
        state.similarLoading = false;
      });

    // Get search suggestions
    builder
      .addCase(getSearchSuggestions.pending, (state) => {
        state.suggestionsLoading = true;
      })
      .addCase(getSearchSuggestions.fulfilled, (state, action) => {
        state.suggestionsLoading = false;
        state.suggestions = action.payload;
      })
      .addCase(getSearchSuggestions.rejected, (state) => {
        state.suggestionsLoading = false;
        state.suggestions = [];
      });

    // Toggle favorite
    builder
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { vehicleId, isFavorite } = action.payload;
        
        // Update in search results
        const vehicleIndex = state.vehicles.findIndex(v => v.id === vehicleId);
        if (vehicleIndex !== -1) {
          state.vehicles[vehicleIndex].isFavorite = isFavorite;
        }
        
        // Update current vehicle
        if (state.currentVehicle?.id === vehicleId) {
          state.currentVehicle.isFavorite = isFavorite;
        }
        
        // Update favorites list
        if (isFavorite) {
          const vehicle = state.vehicles.find(v => v.id === vehicleId) || state.currentVehicle;
          if (vehicle && !state.favoriteVehicles.find(v => v.id === vehicleId)) {
            state.favoriteVehicles.push(vehicle);
          }
        } else {
          state.favoriteVehicles = state.favoriteVehicles.filter(v => v.id !== vehicleId);
        }
      });

    // Get favorite vehicles
    builder
      .addCase(getFavoriteVehicles.pending, (state) => {
        state.favoritesLoading = true;
      })
      .addCase(getFavoriteVehicles.fulfilled, (state, action) => {
        state.favoritesLoading = false;
        state.favoriteVehicles = action.payload;
      })
      .addCase(getFavoriteVehicles.rejected, (state) => {
        state.favoritesLoading = false;
      });
  },
});

export const {
  setFilters,
  updateFilters,
  clearFilters,
  setCurrentPage,
  setViewMode,
  toggleFilters,
  clearSearchResults,
  clearCurrentVehicle,
  clearSuggestions,
} = vehicleSlice.actions;

export default vehicleSlice.reducer;
