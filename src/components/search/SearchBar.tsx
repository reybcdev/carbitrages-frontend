'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getSearchSuggestions, clearSuggestions, updateFilters } from '@/store/slices/vehicleSlice';
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
  const { suggestions, suggestionsLoading, currentFilters } = useAppSelector((state) => state.vehicles);
  
  const [query, setQuery] = useState(currentFilters.query || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.length >= 2) {
        dispatch(getSearchSuggestions(query));
        setShowSuggestions(true);
      } else {
        dispatch(clearSuggestions());
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(updateFilters({ query: query.trim() }));
      onSearch?.(query.trim());
    }
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleSuggestionClick = (suggestion: any) => {
    const value = suggestion.value;
    setQuery(value);
    
    // Update filters based on suggestion type
    if (suggestion.type === 'make') {
      dispatch(updateFilters({ make: [value], query: value }));
    } else if (suggestion.type === 'model') {
      dispatch(updateFilters({ model: [value], query: value }));
    } else {
      dispatch(updateFilters({ query: value }));
    }
    
    onSearch?.(value);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setQuery('');
    dispatch(updateFilters({ query: undefined }));
    dispatch(clearSuggestions());
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'make':
        return '🚗';
      case 'model':
        return '🔧';
      case 'location':
        return '📍';
      default:
        return '🔍';
    }
  };

  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   bg-white shadow-sm text-gray-900 placeholder-gray-500
                   transition-all duration-200"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center
                     text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 
                   rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.value}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                "w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3",
                "border-b border-gray-100 last:border-b-0 transition-colors",
                selectedIndex === index && "bg-blue-50 text-blue-700"
              )}
            >
              <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{suggestion.label}</div>
                {suggestion.count && (
                  <div className="text-sm text-gray-500">
                    {suggestion.count} vehicles
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400 capitalize">
                {suggestion.type}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {suggestionsLoading && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 
                       rounded-lg shadow-lg p-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm">Searching...</span>
          </div>
        </div>
      )}
    </div>
  );
}
