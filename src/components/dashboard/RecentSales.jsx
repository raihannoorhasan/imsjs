import React from 'react';
import { ShoppingCart, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { Card } from '../common/Card';
import { formatCurrency, formatDate } from '../../utils/helpers';

export function RecentSales({ sales }) {
  return (
    <Card className="relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Sales</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Latest transactions</p>
          </div>
        </div>
        {sales.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
            <TrendingUp size={16} />
            <span className="font-medium">
              {formatCurrency(sales.reduce((sum, sale) => sum + sale.total, 0))}
            </span>
          </div>
        )}
      </div>
      
      {sales.length > 0 ? (
        <div className="space-y-4">
          {sales.map((sale) => (
            <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600/50 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg">
                  <ShoppingCart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Sale #{sale.id.slice(-6)}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar size={12} />
                    <span>{formatDate(sale.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <DollarSign size={14} className="mr-1" />
                  <span className="font-bold">{formatCurrency(sale.total)}</span>
                </div>
                <p className={`text-xs capitalize px-2 py-1 rounded-full ${
                  sale.status === 'completed' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                    : sale.status === 'pending'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                }`}>
                  {sale.status}
                </p>
              </div>
            </div>
          ))}
          
          <div className="text-center pt-2">
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
              View all sales →
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Sales Yet</h4>
          <p className="text-gray-600 dark:text-gray-400">Sales will appear here once you start making transactions</p>
          <button className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
            Create your first sale →
          </button>
        </div>
      )}
    </Card>
  );
}