import React from 'react';

export function Card({ 
  children, 
  className = '', 
  padding = 'p-6',
  hover = false,
  gradient = false
}) {
  const hoverClasses = hover ? 'hover:shadow-md dark:hover:shadow-xl transition-all duration-200' : 'transition-colors duration-200';
  const gradientClasses = gradient ? 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900' : 'bg-white dark:bg-gray-800';
  
  return (
    <div className={`${gradientClasses} rounded-xl shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 ${padding} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}