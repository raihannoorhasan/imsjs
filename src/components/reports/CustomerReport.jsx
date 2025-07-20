import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Users, DollarSign, TrendingUp, Star } from 'lucide-react';
import { Card } from '../common/Card';
import { formatCurrency, formatDate } from '../../utils/helpers';

export function CustomerReport({ timeRange = 'monthly' }) {
  const { customers, sales } = useInventory();

  // Helper function to filter data by time range
  const filterByTimeRange = (data, dateField = 'createdAt') => {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'yearly':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }
    
    return data.filter(item => new Date(item[dateField]) >= startDate);
  };

  const filteredSales = filterByTimeRange(sales);
  const newCustomers = filterByTimeRange(customers);

  const totalCustomers = customers.length;
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const averageCustomerValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
  const repeatCustomers = customers.filter(customer => {
    const customerSales = filteredSales.filter(sale => sale.customerId === customer.id);
    return customerSales.length > 1;
  }).length;

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'daily': return 'Today';
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
      case 'yearly': return 'This Year';
      default: return 'This Month';
    }
  };

  const topCustomers = customers
    .map(customer => {
      const customerSales = filteredSales.filter(sale => sale.customerId === customer.id);
      const totalSpent = customerSales.reduce((sum, sale) => sum + sale.total, 0);
      const orderCount = customerSales.length;
      return { ...customer, totalSpent, orderCount };
    })
    .filter(customer => customer.totalSpent > 0)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10);

  const recentCustomers = newCustomers
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Time Range Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-800 rounded-xl p-6 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100">Customer Report - {getTimeRangeLabel()}</h2>
            <p className="text-purple-700 dark:text-purple-300 mt-1">Customer behavior analysis and relationship insights</p>
          </div>
          <div className="bg-purple-100 dark:bg-purple-800/50 p-3 rounded-full">
            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Total Customers</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{totalCustomers}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Customer base</p>
            </div>
            <div className="bg-blue-200 dark:bg-blue-800/50 p-3 rounded-full">
              <Users className="w-8 h-8 text-blue-700 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">New Customers</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">{newCustomers.length}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">{getTimeRangeLabel()}</p>
            </div>
            <div className="bg-green-200 dark:bg-green-800/50 p-3 rounded-full">
              <TrendingUp className="w-8 h-8 text-green-700 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-400">Average Value</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{formatCurrency(averageCustomerValue)}</p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Per customer</p>
            </div>
            <div className="bg-purple-200 dark:bg-purple-800/50 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-purple-700 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400">Retention Rate</p>
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                {totalCustomers > 0 ? ((repeatCustomers / totalCustomers) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">{repeatCustomers} repeat customers</p>
            </div>
            <div className="bg-orange-200 dark:bg-orange-800/50 p-3 rounded-full">
              <Star className="w-8 h-8 text-orange-700 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Top Customers by Revenue</h3>
          <div className="space-y-3">
            {topCustomers.map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{customer.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{customer.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 dark:text-green-400">{formatCurrency(customer.totalSpent)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{customer.orderCount} orders</p>
                </div>
              </div>
            ))}
          </div>
          {topCustomers.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p>No customer purchases in this period</p>
            </div>
          )}
        </Card>

        {/* New Customers */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">New Customers - {getTimeRangeLabel()}</h3>
          <div className="space-y-3">
            {recentCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{customer.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{customer.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Joined {formatDate(customer.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(customer.totalPurchases || 0)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Total spent</p>
                </div>
              </div>
            ))}
          </div>
          {recentCustomers.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p>No new customers in this period</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}