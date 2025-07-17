import React from 'react';
import { getStatusColor, formatStatus } from '../../utils/helpers';

export function StatusBadge({ status, className = '' }) {
  const colorClasses = getStatusColor(status);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses} ${className}`}>
      {formatStatus(status)}
    </span>
  );
}