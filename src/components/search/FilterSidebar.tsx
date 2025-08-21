'use client';

import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateFilters, clearFilters, toggleFilters } from '@/store/slices/vehicleSlice';
import { SearchFilters } from '@/types/vehicle';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface FilterSection {
  title: string;
  key: keyof SearchFilters;
  type: 'checkbox' | 'range' | 'select';
  options?: { value: string; label: string; count?: number }[];
  min?: number;
  max?: number;
  step?: number;
}

const filterSections: FilterSection[] = [
  {
    title: 'Make',
    key: 'make',
    type: 'checkbox',
    options: [
      { value: 'toyota', label: 'Toyota', count: 245 },
      { value: 'honda', label: 'Honda', count: 189 },
      { value: 'ford', label: 'Ford', count: 156 },
      { value: 'chevrolet', label: 'Chevrolet', count: 134 },
      { value: 'nissan', label: 'Nissan', count: 98 },
      { value: 'bmw', label: 'BMW', count: 87 },
      { value: 'mercedes', label: 'Mercedes-Benz', count: 76 },
      { value: 'audi', label: 'Audi', count: 65 },
    ],
  },
  {
    title: 'Condition',
    key: 'condition',
    type: 'checkbox',
    options: [
      { value: 'new', label: 'New', count: 156 },
      { value: 'used', label: 'Used', count: 834 },
      { value: 'certified', label: 'Certified Pre-Owned', count: 123 },
    ],
  },
  {
    title: 'Body Type',
    key: 'bodyType',
    type: 'checkbox',
    options: [
      { value: 'sedan', label: 'Sedan', count: 298 },
      { value: 'suv', label: 'SUV', count: 267 },
      { value: 'truck', label: 'Truck', count: 189 },
      { value: 'coupe', label: 'Coupe', count: 145 },
      { value: 'hatchback', label: 'Hatchback', count: 98 },
      { value: 'convertible', label: 'Convertible', count: 45 },
    ],
  },
  {
    title: 'Fuel Type',
    key: 'fuelType',
    type: 'checkbox',
    options: [
      { value: 'gasoline', label: 'Gasoline', count: 892 },
      { value: 'hybrid', label: 'Hybrid', count: 156 },
      { value: 'electric', label: 'Electric', count: 89 },
      { value: 'diesel', label: 'Diesel', count: 76 },
    ],
  },
  {
    title: 'Transmission',
    key: 'transmission',
    type: 'checkbox',
    options: [
      { value: 'automatic', label: 'Automatic', count: 967 },
      { value: 'manual', label: 'Manual', count: 145 },
      { value: 'cvt', label: 'CVT', count: 101 },
    ],
  },
];

export default function FilterSidebar() {
  const dispatch = useAppDispatch();
  const { currentFilters, showFilters, searchResponse } = useAppSelector((state) => state.vehicles);
  
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['make', 'condition', 'bodyType'])
  );
  const [priceRange, setPriceRange] = useState({
    min: currentFilters.priceMin || 0,
    max: currentFilters.priceMax || 100000,
  });
  const [yearRange, setYearRange] = useState({
    min: currentFilters.yearMin || 2000,
    max: currentFilters.yearMax || new Date().getFullYear(),
  });
  const [mileage, setMileage] = useState(currentFilters.mileageMax || 150000);

  const toggleSection = (sectionKey: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey);
    } else {
      newExpanded.add(sectionKey);
    }
    setExpandedSections(newExpanded);
  };

  const handleCheckboxChange = (filterKey: keyof SearchFilters, value: string, checked: boolean) => {
    const currentValues = (currentFilters[filterKey] as string[]) || [];
    let newValues: string[];
    
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }
    
    dispatch(updateFilters({ [filterKey]: newValues.length > 0 ? newValues : undefined }));
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    const newRange = { ...priceRange, [type]: value };
    setPriceRange(newRange);
    
    dispatch(updateFilters({
      priceMin: newRange.min > 0 ? newRange.min : undefined,
      priceMax: newRange.max < 100000 ? newRange.max : undefined,
    }));
  };

  const handleYearRangeChange = (type: 'min' | 'max', value: number) => {
    const newRange = { ...yearRange, [type]: value };
    setYearRange(newRange);
    
    dispatch(updateFilters({
      yearMin: newRange.min > 2000 ? newRange.min : undefined,
      yearMax: newRange.max < new Date().getFullYear() ? newRange.max : undefined,
    }));
  };

  const handleMileageChange = (value: number) => {
    setMileage(value);
    dispatch(updateFilters({
      mileageMax: value < 150000 ? value : undefined,
    }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setPriceRange({ min: 0, max: 100000 });
    setYearRange({ min: 2000, max: new Date().getFullYear() });
    setMileage(150000);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (currentFilters.make?.length) count++;
    if (currentFilters.model?.length) count++;
    if (currentFilters.condition?.length) count++;
    if (currentFilters.bodyType?.length) count++;
    if (currentFilters.fuelType?.length) count++;
    if (currentFilters.transmission?.length) count++;
    if (currentFilters.priceMin || currentFilters.priceMax) count++;
    if (currentFilters.yearMin || currentFilters.yearMax) count++;
    if (currentFilters.mileageMax) count++;
    return count;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (miles: number) => {
    return new Intl.NumberFormat('en-US').format(miles);
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => dispatch(toggleFilters())}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {getActiveFilterCount() > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
              {getActiveFilterCount()}
            </span>
          )}
        </Button>
      </div>

      {/* Filter Sidebar */}
      <div className={cn(
        "bg-white border border-gray-100 rounded-xl shadow-sm p-6 h-fit",
        "lg:block", // Always visible on desktop
        showFilters ? "block" : "hidden" // Toggle on mobile
      )}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Filter className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Filters</h3>
              {searchResponse && (
                <p className="text-sm text-gray-500">
                  {searchResponse.total.toLocaleString()} vehicles available
                </p>
              )}
            </div>
            {getActiveFilterCount() > 0 && (
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold rounded-full px-3 py-1.5 animate-pulse">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              disabled={getActiveFilterCount() === 0}
              className="text-sm hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              Clear All
            </Button>
            
            <button
              onClick={() => dispatch(toggleFilters())}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full py-3 px-4 text-left bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:from-green-100 hover:to-emerald-100 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <span className="text-green-600 text-sm font-bold">💰</span>
              </div>
              <span className="font-semibold text-gray-900">Price Range</span>
            </div>
            {expandedSections.has('price') ? (
              <ChevronUp className="h-5 w-5 text-green-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-green-600" />
            )}
          </button>
          
          {expandedSections.has('price') && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum</label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum</label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value) || 100000)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="100000"
                  />
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-1">Selected Range:</div>
                <div className="text-lg font-bold text-green-600">
                  {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Year Range */}
        <div className="mb-8">
          <button
            onClick={() => toggleSection('year')}
            className="flex items-center justify-between w-full py-3 px-4 text-left bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 hover:from-purple-100 hover:to-indigo-100 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <span className="text-purple-600 text-sm font-bold">📅</span>
              </div>
              <span className="font-semibold text-gray-900">Year Range</span>
            </div>
            {expandedSections.has('year') ? (
              <ChevronUp className="h-5 w-5 text-purple-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-purple-600" />
            )}
          </button>
          
          {expandedSections.has('year') && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">From Year</label>
                  <input
                    type="number"
                    value={yearRange.min}
                    onChange={(e) => handleYearRangeChange('min', parseInt(e.target.value) || 2000)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    min="1990"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">To Year</label>
                  <input
                    type="number"
                    value={yearRange.max}
                    onChange={(e) => handleYearRangeChange('max', parseInt(e.target.value) || new Date().getFullYear())}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    min="1990"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-1">Selected Years:</div>
                <div className="text-lg font-bold text-purple-600">
                  {yearRange.min} - {yearRange.max}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mileage */}
        <div className="mb-8">
          <button
            onClick={() => toggleSection('mileage')}
            className="flex items-center justify-between w-full py-3 px-4 text-left bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100 hover:from-orange-100 hover:to-red-100 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-orange-100 rounded-lg">
                <span className="text-orange-600 text-sm font-bold">🛣️</span>
              </div>
              <span className="font-semibold text-gray-900">Max Mileage</span>
            </div>
            {expandedSections.has('mileage') ? (
              <ChevronUp className="h-5 w-5 text-orange-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-orange-600" />
            )}
          </button>
          
          {expandedSections.has('mileage') && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-4">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="150000"
                  step="5000"
                  value={mileage}
                  onChange={(e) => handleMileageChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #f97316 0%, #f97316 ${(mileage / 150000) * 100}%, #e5e7eb ${(mileage / 150000) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 mi</span>
                  <span>150k mi</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-1">Maximum Mileage:</div>
                <div className="text-lg font-bold text-orange-600">
                  {formatMileage(mileage)} miles
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Checkbox Filters */}
        {filterSections.map((section, index) => {
          const colors = [
            { bg: 'from-blue-50 to-cyan-50', border: 'border-blue-100', hover: 'hover:from-blue-100 hover:to-cyan-100', icon: 'text-blue-600', accent: 'text-blue-600', focus: 'focus:ring-blue-500 focus:border-blue-500' },
            { bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-100', hover: 'hover:from-emerald-100 hover:to-teal-100', icon: 'text-emerald-600', accent: 'text-emerald-600', focus: 'focus:ring-emerald-500 focus:border-emerald-500' },
            { bg: 'from-amber-50 to-yellow-50', border: 'border-amber-100', hover: 'hover:from-amber-100 hover:to-yellow-100', icon: 'text-amber-600', accent: 'text-amber-600', focus: 'focus:ring-amber-500 focus:border-amber-500' },
            { bg: 'from-rose-50 to-pink-50', border: 'border-rose-100', hover: 'hover:from-rose-100 hover:to-pink-100', icon: 'text-rose-600', accent: 'text-rose-600', focus: 'focus:ring-rose-500 focus:border-rose-500' },
            { bg: 'from-violet-50 to-purple-50', border: 'border-violet-100', hover: 'hover:from-violet-100 hover:to-purple-100', icon: 'text-violet-600', accent: 'text-violet-600', focus: 'focus:ring-violet-500 focus:border-violet-500' },
          ];
          const colorScheme = colors[index % colors.length];
          const icons = ['🚗', '✨', '🏎️', '⛽', '⚙️'];
          
          return (
            <div key={section.key} className="mb-8">
              <button
                onClick={() => toggleSection(section.key)}
                className={`flex items-center justify-between w-full py-3 px-4 text-left bg-gradient-to-r ${colorScheme.bg} rounded-xl border ${colorScheme.border} ${colorScheme.hover} transition-all duration-200`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-1.5 bg-white rounded-lg`}>
                    <span className={`${colorScheme.icon} text-sm font-bold`}>{icons[index]}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{section.title}</span>
                  {(currentFilters[section.key] as string[])?.length > 0 && (
                    <span className={`bg-white ${colorScheme.accent} text-xs font-bold px-2 py-1 rounded-full border`}>
                      {(currentFilters[section.key] as string[]).length}
                    </span>
                  )}
                </div>
                {expandedSections.has(section.key) ? (
                  <ChevronUp className={`h-5 w-5 ${colorScheme.icon}`} />
                ) : (
                  <ChevronDown className={`h-5 w-5 ${colorScheme.icon}`} />
                )}
              </button>
              
              {expandedSections.has(section.key) && section.options && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {section.options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center space-x-3 cursor-pointer hover:bg-white p-3 rounded-lg transition-all duration-200 group"
                      >
                        <input
                          type="checkbox"
                          checked={(currentFilters[section.key] as string[])?.includes(option.value) || false}
                          onChange={(e) => handleCheckboxChange(section.key, option.value, e.target.checked)}
                          className={`rounded border-gray-300 ${colorScheme.accent} ${colorScheme.focus} w-4 h-4`}
                        />
                        <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-gray-900">{option.label}</span>
                        {option.count && (
                          <span className={`text-xs font-semibold ${colorScheme.accent} bg-white px-2 py-1 rounded-full border`}>
                            {option.count}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
