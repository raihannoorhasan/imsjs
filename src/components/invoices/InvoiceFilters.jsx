import React from 'react';
import { SearchInput } from '../common/SearchInput';
import { Select } from '../common/Select';
import { Card } from '../common/Card';

export function InvoiceFilters({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusChange 
}) {
  return (
    <Card className="mb-6" padding="p-4">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <SearchInput
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            placeholder="Search invoices..."
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="md:w-48"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </Select>
      </div>
    </Card>
  );
}