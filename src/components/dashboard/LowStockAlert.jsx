import React from 'react';
import { AlertTriangle, Package, TrendingDown } from 'lucide-react';
import { Card } from '../common/Card';

export function LowStockAlert({ products }) {
  return (
    <Card className="relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Low Stock Alerts</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Items requiring attention</p>
          </div>
        </div>
        {products.length > 0 && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">
            {products.length} items
          </div>
        )}
      </div>
      
      {products.length > 0 ? (
        <div className="space-y-4">
          {products.slice(0, 5).map((product) => (
            <div key={product.id} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 dark:bg-red-900/40 p-2 rounded-lg">
                  <Package className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">SKU: {product.sku}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center">
                  <TrendingDown size={14} className="mr-1" />
                  {product.stock} remaining
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Min: {product.minStock}</p>
              </div>
            </div>
          ))}
          
          {products.length > 5 && (
            <div className="text-center pt-2">
              <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium">
                View {products.length - 5} more items →
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Package className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">All Good!</h4>
          <p className="text-gray-600 dark:text-gray-400">All products are well stocked</p>
        </div>
      )}
    </Card>
  );
}