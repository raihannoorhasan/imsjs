import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AlertTriangle } from 'lucide-react';

export function ProtectedRoute({ children, module, action = 'read' }) {
  const { hasPermission, currentUser } = useAuth();

  if (!hasPermission(module, action)) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this section.
          </p>
          <p className="text-sm text-gray-500">
            Current role: <span className="font-medium capitalize">{currentUser?.role}</span>
          </p>
        </div>
      </div>
    );
  }

  return children;
}