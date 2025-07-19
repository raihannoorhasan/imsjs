import React from 'react';
import { X } from 'lucide-react';

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 w-full ${sizeClasses[size]} m-4 max-h-96 overflow-y-auto shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}