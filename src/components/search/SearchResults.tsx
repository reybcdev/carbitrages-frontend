'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrentPage, updateFilters } from '@/store/slices/vehicleSlice';
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
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          {/* Page Info */}
          <div className="text-sm text-gray-600">
            Page <span className="font-semibold text-gray-900">{page}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalPages}</span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                page <= 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              )}
            >
              ← Previous
            </button>
            
            {startPage > 1 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  1
                </button>
                {startPage > 2 && (
                  <span className="px-2 text-gray-400 text-sm">...</span>
                )}
              </>
            )}
            
            {pages.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pageNum === page
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                )}
              >
                {pageNum}
              </button>
            ))}
            
            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <span className="px-2 text-gray-400 text-sm">...</span>
                )}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  {totalPages}
                </button>
              </>
            )}
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                page >= totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              )}
            >
              Next →
            </button>
          </div>

          {/* Quick Jump */}
          <div className="text-sm text-gray-500">
            {searchResponse.total.toLocaleString()} total results
          </div>
        </div>
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
    <div id="search-results" className={cn("space-y-8", className)}>
      {/* Results Header */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          {/* Results Count */}
          <div className="flex items-center space-x-4">
            <div className="text-base text-gray-700">
              {searchLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="font-medium">Searching...</span>
                </div>
              ) : searchResponse ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <span className="text-gray-600">Showing</span>
                  <span className="font-bold text-gray-900">
                    {((searchResponse.page - 1) * searchResponse.limit) + 1}-
                    {Math.min(searchResponse.page * searchResponse.limit, searchResponse.total)}
                  </span>
                  <span className="text-gray-600">of</span>
                  <span className="font-bold text-blue-600 text-lg">
                    {searchResponse.total.toLocaleString()}
                  </span>
                  <span className="text-gray-600">vehicles</span>
                </div>
              ) : (
                <span className="text-gray-500">No results</span>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-3">
              <ArrowUpDown className="h-5 w-5 text-gray-400" />
              <select
                value={getCurrentSortValue()}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-[200px]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {searchLoading && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-16 text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full bg-blue-100 opacity-20 animate-pulse"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Finding the perfect vehicles</h3>
          <p className="text-gray-600">Searching through thousands of listings...</p>
        </div>
      )}

      {/* Empty State */}
      {!searchLoading && vehicles.length === 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-16 text-center">
          <div className="text-gray-300 mb-6">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No vehicles found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            We couldn't find any vehicles matching your criteria. Try adjusting your search filters or expanding your search area.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" className="bg-white hover:bg-gray-50">
              Clear All Filters
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Expand Search
            </Button>
          </div>
        </div>
      )}

      {/* Results List */}
      {!searchLoading && vehicles.length > 0 && (
        <div className="space-y-8">
          <div className="space-y-6">
            {vehicles.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <VehicleCard
                  vehicle={vehicle}
                  viewMode="list"
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {renderPagination()}
        </div>
      )}
    </div>
  );
}
