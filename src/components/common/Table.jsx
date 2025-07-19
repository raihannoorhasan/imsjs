import React from 'react';

export function Table({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300 ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {children}
        </table>
      </div>
    </div>
  );
}

export function TableHeader({ children }) {
  return (
    <thead className="bg-gray-50 dark:bg-gray-700">
      {children}
    </thead>
  );
}

export function TableBody({ children }) {
  return (
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '', hover = true }) {
  const hoverClasses = hover ? 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150' : '';
  
  return (
    <tr className={`${hoverClasses} ${className}`}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '' }) {
  return (
    <th className={`text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100 ${className}`}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = '' }) {
  return (
    <td className={`py-3 px-4 text-gray-900 dark:text-gray-100 ${className}`}>
      {children}
    </td>
  );
}