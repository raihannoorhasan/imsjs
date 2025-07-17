import React, { useState } from 'react';
import { InventoryProvider } from './contexts/InventoryContext';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { Inventory } from './components/inventory/Inventory';
import { Sales } from './components/sales/Sales';
import { Customers } from './components/customers/Customers';
import { Suppliers } from './components/suppliers/Suppliers';
import { Courses } from './components/courses/Courses';
import { Invoices } from './components/invoices/Invoices';
import { Reports } from './components/reports/Reports';
import { Settings } from './components/settings/Settings';
import { ServiceCenter } from './components/service/ServiceCenter';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'sales':
        return <Sales />;
      case 'service':
        return <ServiceCenter />;
      case 'customers':
        return <Customers />;
      case 'suppliers':
        return <Suppliers />;
      case 'courses':
        return <Courses />;
      case 'invoices':
        return <Invoices />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <InventoryProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </InventoryProvider>
  );
}

export default App;