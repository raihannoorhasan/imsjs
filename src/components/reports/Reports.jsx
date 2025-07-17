import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { BarChart3, TrendingUp, DollarSign, Package } from 'lucide-react';
import { SalesReport } from './SalesReport';
import { InventoryReport } from './InventoryReport';
import { CustomerReport } from './CustomerReport';
import { ServiceReport } from './ServiceReport';

export function Reports() {
  const [activeTab, setActiveTab] = useState('sales');

  const tabs = [
    { id: 'sales', label: 'Sales Report', icon: DollarSign },
    { id: 'inventory', label: 'Inventory Report', icon: Package },
    { id: 'customers', label: 'Customer Report', icon: TrendingUp },
    { id: 'service', label: 'Service Report', icon: BarChart3 }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'sales':
        return <SalesReport />;
      case 'inventory':
        return <InventoryReport />;
      case 'customers':
        return <CustomerReport />;
      case 'service':
        return <ServiceReport />;
      default:
        return <SalesReport />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Analyze your business performance and trends</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {renderContent()}
    </div>
  );
}