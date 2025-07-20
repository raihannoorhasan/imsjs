import React from 'react';
import { RotateCcw, Calculator, Users, Receipt } from 'lucide-react';
import { Button } from '../common/Button';

export function QuickActions({ onClearCart, hasItems = false }) {
  const quickActions = [
    {
      id: 'clear',
      label: 'Clear Cart',
      icon: RotateCcw,
      action: onClearCart,
      variant: 'outline',
      show: hasItems
    }
  ];

  return (
    <div className="flex items-center space-x-2">
      {quickActions.filter(action => action.show !== false).map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.id}
            variant={action.variant}
            size="sm"
            onClick={action.action}
            className="flex items-center space-x-1 shadow-sm hover:shadow-md transition-all duration-200 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{action.label}</span>
          </Button>
        );
      })}
    </div>
  );
}