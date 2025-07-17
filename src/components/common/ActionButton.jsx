import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from './Button';

export function ActionButton({ 
  module, 
  action = 'write', 
  children, 
  fallback = null,
  ...props 
}) {
  const { hasPermission } = useAuth();

  if (!hasPermission(module, action)) {
    return fallback;
  }

  return <Button {...props}>{children}</Button>;
}