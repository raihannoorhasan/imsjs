import React, { useState } from 'react';
import { Download, Upload, Trash2, AlertTriangle } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export function DataSettings() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExportData = () => {
    // Export data logic here
    console.log('Exporting data...');
  };

  const handleImportData = () => {
    // Import data logic here
    console.log('Importing data...');
  };

  const handleDeleteAllData = () => {
    if (showDeleteConfirm) {
      // Delete all data logic here
      localStorage.clear();
      console.log('All data deleted');
      setShowDeleteConfirm(false);
      // Reload the page to reset the application
      window.location.reload();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const getStorageInfo = () => {
    const data = {
      products: JSON.parse(localStorage.getItem('products') || '[]').length,
      customers: JSON.parse(localStorage.getItem('customers') || '[]').length,
      sales: JSON.parse(localStorage.getItem('sales') || '[]').length,
      serviceTickets: JSON.parse(localStorage.getItem('serviceTickets') || '[]').length,
      courses: JSON.parse(localStorage.getItem('courses') || '[]').length,
      students: JSON.parse(localStorage.getItem('students') || '[]').length
    };
    return data;
  };

  const storageInfo = getStorageInfo();

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Data Overview</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{storageInfo.products}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Products</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{storageInfo.customers}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Customers</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{storageInfo.sales}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sales</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{storageInfo.serviceTickets}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Service Tickets</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{storageInfo.courses}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Courses</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{storageInfo.students}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Data Management</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Export Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Download all your data as a backup</p>
            </div>
            <Button onClick={handleExportData} variant="outline">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Import Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Restore data from a backup file</p>
            </div>
            <Button onClick={handleImportData} variant="outline">
              <Upload size={16} className="mr-2" />
              Import
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Danger Zone</h2>
        
        <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900 dark:text-red-200">Delete All Data</h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                This will permanently delete all your data including products, customers, sales, and settings. 
                This action cannot be undone.
              </p>
              <div className="mt-4">
                {showDeleteConfirm ? (
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleDeleteAllData} 
                      variant="danger"
                      size="sm"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Confirm Delete
                    </Button>
                    <Button 
                      onClick={() => setShowDeleteConfirm(false)} 
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleDeleteAllData} 
                    variant="danger"
                    size="sm"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete All Data
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}