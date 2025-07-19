import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  FileText, 
  Truck, 
  BookOpen, 
  BarChart3, 
  Settings,
  Home,
  Wrench,
  UserCheck
} from 'lucide-react';

export function Sidebar({ activeTab, onTabChange }) {
  const { canAccess } = useAuth();
  const { isDark } = useTheme();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'sales', label: 'Sales & POS', icon: ShoppingCart },
    { id: 'service', label: 'Service Center', icon: Wrench },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Filter menu items based on user permissions
  const accessibleMenuItems = menuItems.filter(item => canAccess(item.id));

  return (
    <div className="w-64 bg-slate-900 dark:bg-gray-950 text-white h-screen p-4 transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-blue-400 dark:text-blue-300">Hi Tech Computer</h1>
        <p className="text-slate-400 dark:text-gray-500 text-sm">Inventory Management</p>
      </div>
      
      <nav className="space-y-2">
        {accessibleMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:scale-105 ${
                activeTab === item.id
                  ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-lg'
                  : 'text-slate-300 dark:text-gray-400 hover:bg-slate-800 dark:hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}