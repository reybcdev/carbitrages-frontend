'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { searchVehicles, setFilters } from '@/store/slices/vehicleSlice';
import SearchBar from '@/components/search/SearchBar';
import FilterSidebar from '@/components/search/FilterSidebar';
import SearchResults from '@/components/search/SearchResults';

export default function SearchPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { currentFilters, currentPage } = useAppSelector((state) => state.vehicles);

  useEffect(() => {
    // Initialize filters from URL params
    const initialFilters: any = {};
    
    const query = searchParams.get('q');
    if (query) initialFilters.query = query;
    
    const make = searchParams.get('make');
    if (make) initialFilters.make = make.split(',');
    
    const model = searchParams.get('model');
    if (model) initialFilters.model = model.split(',');
    
    const priceMin = searchParams.get('priceMin');
    if (priceMin) initialFilters.priceMin = parseInt(priceMin);
    
    const priceMax = searchParams.get('priceMax');
    if (priceMax) initialFilters.priceMax = parseInt(priceMax);
    
    const yearMin = searchParams.get('yearMin');
    if (yearMin) initialFilters.yearMin = parseInt(yearMin);
    
    const yearMax = searchParams.get('yearMax');
    if (yearMax) initialFilters.yearMax = parseInt(yearMax);
    
    const condition = searchParams.get('condition');
    if (condition) initialFilters.condition = condition.split(',');
    
    const bodyType = searchParams.get('bodyType');
    if (bodyType) initialFilters.bodyType = bodyType.split(',');
    
    if (Object.keys(initialFilters).length > 0) {
      dispatch(setFilters(initialFilters));
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    // Trigger search when filters or page changes
    dispatch(searchVehicles({ 
      filters: currentFilters, 
      page: currentPage 
    }));
  }, [currentFilters, currentPage, dispatch]);

  const handleSearch = (query: string) => {
    // Search is handled by the SearchBar component through Redux
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Find Your Perfect Vehicle</h1>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Results */}
          <div className="flex-1">
            <SearchResults />
          </div>
        </div>
      </div>
    </div>
  );
}
