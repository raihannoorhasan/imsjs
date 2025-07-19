import React from 'react';

export function Select({ 
  label, 
  error, 
  required = false, 
  children, 
  className = '', 
  ...props 
}) {
  const selectClasses = `
    w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
    transition-colors duration-200
    ${error ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      <select className={selectClasses} {...props}>
        {children}
      </select>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}