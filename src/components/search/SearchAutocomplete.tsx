'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Car, Clock, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchSuggestion {
  id: string;
  type: 'make' | 'model' | 'location' | 'recent';
  text: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

interface SearchAutocompleteProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  showRecentSearches?: boolean;
}

export default function SearchAutocomplete({
  placeholder = "Search by make, model, or location...",
  onSearch,
  className = "",
  showRecentSearches = true
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Mock data - in production, this would come from your API
  const mockSuggestions: SearchSuggestion[] = [
    // Makes
    { id: '1', type: 'make', text: 'Toyota', icon: <Car className="h-4 w-4" /> },
    { id: '2', type: 'make', text: 'Honda', icon: <Car className="h-4 w-4" /> },
    { id: '3', type: 'make', text: 'Ford', icon: <Car className="h-4 w-4" /> },
    { id: '4', type: 'make', text: 'BMW', icon: <Car className="h-4 w-4" /> },
    { id: '5', type: 'make', text: 'Mercedes-Benz', icon: <Car className="h-4 w-4" /> },
    { id: '6', type: 'make', text: 'Audi', icon: <Car className="h-4 w-4" /> },
    { id: '7', type: 'make', text: 'Volkswagen', icon: <Car className="h-4 w-4" /> },
    { id: '8', type: 'make', text: 'Nissan', icon: <Car className="h-4 w-4" /> },
    { id: '9', type: 'make', text: 'Hyundai', icon: <Car className="h-4 w-4" /> },
    { id: '10', type: 'make', text: 'Kia', icon: <Car className="h-4 w-4" /> },
    
    // Models
    { id: '11', type: 'model', text: 'Toyota Camry', subtitle: 'Sedan', icon: <Car className="h-4 w-4" /> },
    { id: '12', type: 'model', text: 'Honda Accord', subtitle: 'Sedan', icon: <Car className="h-4 w-4" /> },
    { id: '13', type: 'model', text: 'Ford F-150', subtitle: 'Pickup Truck', icon: <Car className="h-4 w-4" /> },
    { id: '14', type: 'model', text: 'BMW 3 Series', subtitle: 'Luxury Sedan', icon: <Car className="h-4 w-4" /> },
    { id: '15', type: 'model', text: 'Tesla Model 3', subtitle: 'Electric Sedan', icon: <Car className="h-4 w-4" /> },
    
    // Locations
    { id: '16', type: 'location', text: 'Los Angeles, CA', icon: <MapPin className="h-4 w-4" /> },
    { id: '17', type: 'location', text: 'New York, NY', icon: <MapPin className="h-4 w-4" /> },
    { id: '18', type: 'location', text: 'Chicago, IL', icon: <MapPin className="h-4 w-4" /> },
    { id: '19', type: 'location', text: 'Houston, TX', icon: <MapPin className="h-4 w-4" /> },
    { id: '20', type: 'location', text: 'Phoenix, AZ', icon: <MapPin className="h-4 w-4" /> },
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    if (showRecentSearches && typeof window !== 'undefined') {
      const saved = localStorage.getItem('carbitrages_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    }
  }, [showRecentSearches]);

  // Filter suggestions based on query
  useEffect(() => {
    if (query.trim() === '') {
      if (showRecentSearches && recentSearches.length > 0) {
        const recentSuggestions: SearchSuggestion[] = recentSearches.slice(0, 5).map((search, index) => ({
          id: `recent-${index}`,
          type: 'recent',
          text: search,
          icon: <Clock className="h-4 w-4" />
        }));
        setSuggestions(recentSuggestions);
      } else {
        setSuggestions([]);
      }
    } else {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
    }
    setSelectedIndex(-1);
  }, [query, recentSearches, showRecentSearches]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    // Delay closing to allow for suggestion clicks
    setTimeout(() => setIsOpen(false), 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

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
          handleSearch(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setIsOpen(false);
    handleSearch(suggestion.text);
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim() === '') return;

    // Save to recent searches
    if (showRecentSearches && typeof window !== 'undefined') {
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 10);
      setRecentSearches(updated);
      localStorage.setItem('carbitrages_recent_searches', JSON.stringify(updated));
    }

    // Execute search
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      // Navigate to search page with query
      const params = new URLSearchParams({ q: searchQuery });
      router.push(`/search?${params.toString()}`);
    }
  };

  const clearRecentSearch = (searchToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== searchToRemove);
    setRecentSearches(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('carbitrages_recent_searches', JSON.stringify(updated));
    }
  };

  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    const iconClass = suggestion.type === 'make' ? 'text-blue-500' :
                     suggestion.type === 'model' ? 'text-green-500' :
                     suggestion.type === 'location' ? 'text-purple-500' :
                     'text-gray-400';
    
    return (
      <div className={`flex-shrink-0 ${iconClass}`}>
        {suggestion.icon}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {query.trim() === '' && showRecentSearches && recentSearches.length > 0 && (
            <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
              Recent Searches
            </div>
          )}
          
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`flex items-center px-3 py-3 cursor-pointer transition-colors ${
                index === selectedIndex 
                  ? 'bg-blue-50 border-l-2 border-blue-500' 
                  : 'hover:bg-gray-50'
              }`}
            >
              {getSuggestionIcon(suggestion)}
              <div className="ml-3 flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {suggestion.text}
                </div>
                {suggestion.subtitle && (
                  <div className="text-xs text-gray-500 truncate">
                    {suggestion.subtitle}
                  </div>
                )}
              </div>
              {suggestion.type === 'recent' && (
                <button
                  onClick={(e) => clearRecentSearch(suggestion.text, e)}
                  className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
