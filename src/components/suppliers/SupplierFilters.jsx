import React from 'react';
import { SearchInput } from '../common/SearchInput';
import { Card } from '../common/Card';

export function SupplierFilters({ searchTerm, onSearchChange }) {
  return (
    <Card className="mb-6" padding="p-4">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <SearchInput
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            placeholder="Search suppliers by name, email, or phone..."
          />
        </div>
      </div>
    </Card>
  );
}