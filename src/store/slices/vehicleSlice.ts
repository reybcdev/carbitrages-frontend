import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Vehicle, SearchFilters, SearchResponse, SearchSuggestion } from '@/types/vehicle';
import { mockVehicleService } from '@/services/mockVehicleService';

// Async thunks using mock service
export const searchVehicles = createAsyncThunk(
  'vehicles/searchVehicles',
  async ({ filters, page = 1, limit = 12 }: { filters: SearchFilters; page?: number; limit?: number }) => {
    const response = await mockVehicleService.searchVehicles(filters, page, limit);
    return response;
  }
);

export const getVehicleById = createAsyncThunk(
  'vehicles/getVehicleById',
  async (vehicleId: string) => {
    const vehicle = await mockVehicleService.getVehicleById(vehicleId);
    return vehicle;
  }
);

export const getSimilarVehicles = createAsyncThunk(
  'vehicles/getSimilarVehicles',
  async (vehicleId: string) => {
    // For mock, return featured vehicles excluding the current one
    const featured = await mockVehicleService.getFeaturedVehicles(4);
    return featured.filter(v => v.id !== vehicleId);
  }
);

export const getSearchSuggestions = createAsyncThunk(
  'vehicles/getSearchSuggestions',
  async (query: string) => {
    const suggestions = await mockVehicleService.getSearchSuggestions(query);
    return suggestions;
  }
);

export const toggleFavorite = createAsyncThunk(
  'vehicles/toggleFavorite',
  async (vehicleId: string) => {
    // Mock implementation
    return { vehicleId, isFavorite: true };
  }
);

export const getFavoriteVehicles = createAsyncThunk(
  'vehicles/getFavoriteVehicles',
  async () => {
    // Mock implementation
    return [];
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
        state.searchResponse = action.payload as any;
        state.vehicles = action.payload.vehicles as any;
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
        state.suggestions = action.payload as any;
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
