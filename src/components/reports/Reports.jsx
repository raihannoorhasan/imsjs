import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { BarChart3, TrendingUp, DollarSign, Package, Calendar, FileText, Users, Wrench, BookOpen, PieChart, Target } from 'lucide-react';
import { SalesReport } from './SalesReport';
import { InventoryReport } from './InventoryReport';
import { CustomerReport } from './CustomerReport';
import { ServiceReport } from './ServiceReport';
import { CourseReport } from './CourseReport';
import { ProfitReport } from './ProfitReport';
import { DashboardReport } from './DashboardReport';

export function Reports() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeRange, setTimeRange] = useState('monthly');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: BarChart3 },
    { id: 'sales', label: 'Sales Report', icon: DollarSign },
    { id: 'profit', label: 'Profit Analysis', icon: Target },
    { id: 'inventory', label: 'Inventory Report', icon: Package },
    { id: 'customers', label: 'Customer Report', icon: TrendingUp },
    { id: 'service', label: 'Service Report', icon: Wrench },
    { id: 'courses', label: 'Course Report', icon: BookOpen }
  ];

  const timeRanges = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardReport timeRange={timeRange} />;
      case 'sales':
        return <SalesReport timeRange={timeRange} />;
      case 'profit':
        return <ProfitReport timeRange={timeRange} />;
      case 'inventory':
        return <InventoryReport timeRange={timeRange} />;
      case 'customers':
        return <CustomerReport timeRange={timeRange} />;
      case 'service':
        return <ServiceReport timeRange={timeRange} />;
      case 'courses':
        return <CourseReport timeRange={timeRange} />;
      default:
        return <DashboardReport timeRange={timeRange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-8 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reports & Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive business intelligence and performance insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm transition-colors duration-200"
              >
                {timeRanges.map(range => (
                  <option key={range.id} value={range.id}>{range.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 transition-colors duration-300">
        <div className="flex overflow-x-auto">
          <nav className="flex space-x-1 min-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}