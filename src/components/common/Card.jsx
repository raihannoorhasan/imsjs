import React from 'react';

export function Card({ 
  children, 
  className = '', 
  padding = 'p-6',
  hover = false 
}) {
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow' : '';
  
  return (
    <div className={`bg-white rounded-lg shadow-sm border ${padding} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}