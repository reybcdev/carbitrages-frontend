'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateFilters } from '@/store/slices/vehicleSlice';
import SearchAutocomplete from './SearchAutocomplete';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ 
  placeholder = "Search by make, model, or location...", 
  className,
  onSearch 
}: SearchBarProps) {
  const dispatch = useAppDispatch();
  const { currentFilters } = useAppSelector((state) => state.vehicles);

  const handleSearch = (query: string) => {
    // Update Redux filters with the search query
    dispatch(updateFilters({ query: query.trim() }));
    
    // Call the optional onSearch callback
    onSearch?.(query);
  };

  return (
    <div className={cn("w-full max-w-2xl", className)}>
      <SearchAutocomplete
        placeholder={placeholder}
        onSearch={handleSearch}
        showRecentSearches={true}
        className="w-full"
      />
    </div>
  );
}
