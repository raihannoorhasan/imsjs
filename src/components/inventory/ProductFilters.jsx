import React from 'react';
import { SearchInput } from '../common/SearchInput';
import { Select } from '../common/Select';
import { Card } from '../common/Card';

export function ProductFilters({ 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange 
}) {
  return (
    <Card className="mb-6" padding="p-4">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <SearchInput
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            placeholder="Search products..."
          />
        </div>
        <Select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="md:w-48"
        >
          <option value="all">All Categories</option>
          <option value="laptop">Laptops</option>
          <option value="component">Components</option>
          <option value="course">Course Materials</option>
          <option value="accessory">Accessories</option>
        </Select>
      </div>
    </Card>
  );
}