import React from 'react';

export function Card({ 
  children, 
  className = '', 
  padding = 'p-6',
  hover = false 
}) {
  const hoverClasses = hover ? 'hover:shadow-md dark:hover:shadow-xl transition-all duration-200' : 'transition-colors duration-200';
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 ${padding} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}