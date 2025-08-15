'use client';

import React from 'react';
import { Grid, List, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setViewMode, setCurrentPage, updateFilters } from '@/store/slices/vehicleSlice';
import VehicleCard from './VehicleCard';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface SearchResultsProps {
  className?: string;
}

const sortOptions = [
  { value: 'price-asc', label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' },
  { value: 'price-desc', label: 'Price: High to Low', sortBy: 'price', sortOrder: 'desc' },
  { value: 'year-desc', label: 'Year: Newest First', sortBy: 'year', sortOrder: 'desc' },
  { value: 'year-asc', label: 'Year: Oldest First', sortBy: 'year', sortOrder: 'asc' },
  { value: 'mileage-asc', label: 'Mileage: Low to High', sortBy: 'mileage', sortOrder: 'asc' },
  { value: 'mileage-desc', label: 'Mileage: High to Low', sortBy: 'mileage', sortOrder: 'desc' },
  { value: 'arbitrage-desc', label: 'Best Arbitrage Score', sortBy: 'arbitrage', sortOrder: 'desc' },
];

export default function SearchResults({ className }: SearchResultsProps) {
  const dispatch = useAppDispatch();
  const { 
    vehicles, 
    searchResponse, 
    searchLoading, 
    searchError, 
    viewMode, 
    currentPage,
    currentFilters 
  } = useAppSelector((state) => state.vehicles);

  const handleSortChange = (sortValue: string) => {
    const option = sortOptions.find(opt => opt.value === sortValue);
    if (option) {
      dispatch(updateFilters({
        sortBy: option.sortBy as any,
        sortOrder: option.sortOrder as any,
      }));
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    // Scroll to top of results
    document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getCurrentSortValue = () => {
    const { sortBy, sortOrder } = currentFilters;
    if (!sortBy || !sortOrder) return 'price-asc';
    return `${sortBy}-${sortOrder}`;
  };

  const renderPagination = () => {
    if (!searchResponse || searchResponse.totalPages <= 1) return null;

    const { page, totalPages } = searchResponse;
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </Button>
        
        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="text-gray-500">...</span>}
          </>
        )}
        
        {pages.map((pageNum) => (
          <Button
            key={pageNum}
            variant={pageNum === page ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(pageNum)}
          >
            {pageNum}
          </Button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    );
  };

  if (searchError) {
    return (
      <div className={cn("bg-white rounded-lg p-8 text-center", className)}>
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Search Error</h3>
        <p className="text-gray-600 mb-4">{searchError}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div id="search-results" className={cn("space-y-6", className)}>
      {/* Results Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Results Count */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {searchLoading ? (
                'Searching...'
              ) : searchResponse ? (
                <>
                  Showing {((searchResponse.page - 1) * searchResponse.limit) + 1}-
                  {Math.min(searchResponse.page * searchResponse.limit, searchResponse.total)} of{' '}
                  <span className="font-medium text-gray-900">
                    {searchResponse.total.toLocaleString()}
                  </span>{' '}
                  vehicles
                </>
              ) : (
                'No results'
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="h-4 w-4 text-gray-500" />
              <select
                value={getCurrentSortValue()}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={() => dispatch(setViewMode('grid'))}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === 'grid' 
                    ? "bg-blue-500 text-white" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => dispatch(setViewMode('list'))}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === 'list' 
                    ? "bg-blue-500 text-white" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {searchLoading && (
        <div className="bg-white rounded-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for vehicles...</p>
        </div>
      )}

      {/* Empty State */}
      {!searchLoading && vehicles.length === 0 && (
        <div className="bg-white rounded-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters to find more results.
          </p>
          <Button variant="outline">Clear All Filters</Button>
        </div>
      )}

      {/* Results Grid/List */}
      {!searchLoading && vehicles.length > 0 && (
        <>
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          )}>
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Pagination */}
          {renderPagination()}
        </>
      )}
    </div>
  );
}
