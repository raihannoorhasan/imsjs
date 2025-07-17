import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { LoginForm } from './components/auth/LoginForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header } from './components/layout/Header';
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

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <ProtectedRoute module="dashboard">
            <Dashboard />
          </ProtectedRoute>
        );
      case 'inventory':
        return (
          <ProtectedRoute module="inventory">
            <Inventory />
          </ProtectedRoute>
        );
      case 'sales':
        return (
          <ProtectedRoute module="sales">
            <Sales />
          </ProtectedRoute>
        );
      case 'service':
        return (
          <ProtectedRoute module="service">
            <ServiceCenter />
          </ProtectedRoute>
        );
      case 'customers':
        return (
          <ProtectedRoute module="customers">
            <Customers />
          </ProtectedRoute>
        );
      case 'suppliers':
        return (
          <ProtectedRoute module="suppliers">
            <Suppliers />
          </ProtectedRoute>
        );
      case 'courses':
        return (
          <ProtectedRoute module="courses">
            <Courses />
          </ProtectedRoute>
        );
      case 'invoices':
        return (
          <ProtectedRoute module="invoices">
            <Invoices />
          </ProtectedRoute>
        );
      case 'reports':
        return (
          <ProtectedRoute module="reports">
            <Reports />
          </ProtectedRoute>
        );
      case 'settings':
        return (
          <ProtectedRoute module="settings">
            <Settings />
          </ProtectedRoute>
        );
      default:
        return (
          <ProtectedRoute module="dashboard">
            <Dashboard />
          </ProtectedRoute>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <AppContent />
      </InventoryProvider>
    </AuthProvider>
  );
}

export default App;