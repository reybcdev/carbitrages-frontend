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
        "bg-white border border-gray-200 rounded-lg p-6 h-fit",
        "lg:block", // Always visible on desktop
        showFilters ? "block" : "hidden" // Toggle on mobile
      )}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {getActiveFilterCount() > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs rounded-full px-2 py-1">
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
              className="text-sm"
            >
              Clear All
            </Button>
            
            <button
              onClick={() => dispatch(toggleFilters())}
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full py-2 text-left"
          >
            <span className="font-medium text-gray-900">Price Range</span>
            {expandedSections.has('price') ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.has('price') && (
            <div className="mt-3 space-y-3">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Min</label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Max</label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value) || 100000)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="100000"
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
              </div>
            </div>
          )}
        </div>

        {/* Year Range */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('year')}
            className="flex items-center justify-between w-full py-2 text-left"
          >
            <span className="font-medium text-gray-900">Year</span>
            {expandedSections.has('year') ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.has('year') && (
            <div className="mt-3 space-y-3">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Min</label>
                  <input
                    type="number"
                    value={yearRange.min}
                    onChange={(e) => handleYearRangeChange('min', parseInt(e.target.value) || 2000)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    min="1990"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Max</label>
                  <input
                    type="number"
                    value={yearRange.max}
                    onChange={(e) => handleYearRangeChange('max', parseInt(e.target.value) || new Date().getFullYear())}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    min="1990"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mileage */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('mileage')}
            className="flex items-center justify-between w-full py-2 text-left"
          >
            <span className="font-medium text-gray-900">Max Mileage</span>
            {expandedSections.has('mileage') ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.has('mileage') && (
            <div className="mt-3">
              <input
                type="range"
                min="0"
                max="150000"
                step="5000"
                value={mileage}
                onChange={(e) => handleMileageChange(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-gray-600 mt-1">
                Up to {formatMileage(mileage)} miles
              </div>
            </div>
          )}
        </div>

        {/* Checkbox Filters */}
        {filterSections.map((section) => (
          <div key={section.key} className="mb-6">
            <button
              onClick={() => toggleSection(section.key)}
              className="flex items-center justify-between w-full py-2 text-left"
            >
              <span className="font-medium text-gray-900">{section.title}</span>
              {expandedSections.has(section.key) ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            
            {expandedSections.has(section.key) && section.options && (
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {section.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={(currentFilters[section.key] as string[])?.includes(option.value) || false}
                      onChange={(e) => handleCheckboxChange(section.key, option.value, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="flex-1 text-sm text-gray-700">{option.label}</span>
                    {option.count && (
                      <span className="text-xs text-gray-500">({option.count})</span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
