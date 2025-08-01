import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { DollarSign, TrendingUp, ShoppingCart, Users, Package } from 'lucide-react';
import { Card } from '../common/Card';
import { formatCurrency, formatDate } from '../../utils/helpers';

export function SalesReport({ timeRange = 'monthly' }) {
  const { sales, customers, products } = useInventory();

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
  
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSales = filteredSales.length;
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
  
  // Calculate additional metrics
  const totalProfit = filteredSales.reduce((sum, sale) => {
    const saleProfit = sale.items.reduce((itemSum, item) => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const profit = (item.unitPrice - product.buyingPrice) * item.quantity;
        return itemSum + profit;
      }
      return itemSum;
    }, 0);
    return sum + saleProfit;
  }, 0);
  
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const totalItemsSold = filteredSales.reduce((sum, sale) => 
    sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );
  
  // Sales by payment method
  const salesByPaymentMethod = filteredSales.reduce((acc, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total;
    return acc;
  }, {});
  
  // Sales by status
  const salesByStatus = filteredSales.reduce((acc, sale) => {
    acc[sale.status] = (acc[sale.status] || 0) + 1;
    return acc;
  }, {});
  
  // Daily sales trend (for weekly/monthly views)
  const getDailySalesTrend = () => {
    const dailyData = {};
    filteredSales.forEach(sale => {
      const date = new Date(sale.createdAt).toDateString();
      dailyData[date] = (dailyData[date] || 0) + sale.total;
    });
    return Object.entries(dailyData)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .slice(-7); // Last 7 days
  };
  
  const dailyTrend = getDailySalesTrend();
  
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'daily': return 'Today';
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
      case 'yearly': return 'This Year';
      default: return 'This Month';
    }
  };

  const topProducts = products
    .map(product => {
      const soldQuantity = filteredSales.reduce((sum, sale) => {
        const item = sale.items.find(item => item.productId === product.id);
        return sum + (item ? item.quantity : 0);
      }, 0);
      const revenue = filteredSales.reduce((sum, sale) => {
        const item = sale.items.find(item => item.productId === product.id);
        return sum + (item ? item.total : 0);
      }, 0);
      return { ...product, soldQuantity, revenue };
    })
    .filter(product => product.soldQuantity > 0)
    .sort((a, b) => b.soldQuantity - a.soldQuantity)
    .slice(0, 5);

  const recentSales = filteredSales
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Time Range Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800 rounded-xl p-6 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-100">Sales Report - {getTimeRangeLabel()}</h2>
            <p className="text-green-700 dark:text-green-300 mt-1">Comprehensive sales performance analysis</p>
          </div>
          <div className="bg-green-100 dark:bg-green-800/50 p-3 rounded-full">
            <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">Total Revenue</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">{getTimeRangeLabel()}</p>
            </div>
            <div className="bg-green-200 dark:bg-green-800/50 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-green-700 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Total Sales</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{totalSales}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Orders processed</p>
            </div>
            <div className="bg-blue-200 dark:bg-blue-800/50 p-3 rounded-full">
              <ShoppingCart className="w-8 h-8 text-blue-700 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-400">Total Profit</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{formatCurrency(totalProfit)}</p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">{profitMargin.toFixed(1)}% margin</p>
            </div>
            <div className="bg-purple-200 dark:bg-purple-800/50 p-3 rounded-full">
              <TrendingUp className="w-8 h-8 text-purple-700 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400">Items Sold</p>
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{totalItemsSold}</p>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">Total quantity</p>
            </div>
            <div className="bg-orange-200 dark:bg-orange-800/50 p-3 rounded-full">
              <Package className="w-8 h-8 text-orange-700 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Sales Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales by Payment Method</h3>
          <div className="space-y-3">
            {Object.entries(salesByPaymentMethod).map(([method, amount]) => {
              const percentage = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
              return (
                <div key={method} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{method}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(amount)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Sales Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales by Status</h3>
          <div className="space-y-3">
            {Object.entries(salesByStatus).map(([status, count]) => {
              const percentage = totalSales > 0 ? (count / totalSales) * 100 : 0;
              const statusColor = status === 'completed' ? 'text-green-600 dark:text-green-400' : 
                                status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      status === 'completed' ? 'bg-green-500 dark:bg-green-400' : 
                      status === 'pending' ? 'bg-yellow-500 dark:bg-yellow-400' : 'bg-red-500 dark:bg-red-400'
                    }`}></div>
                    <span className={`font-medium capitalize ${statusColor}`}>{status}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{count}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Daily Trend (for non-daily views) */}
      {timeRange !== 'daily' && dailyTrend.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Sales Trend</h3>
          <div className="space-y-3">
            {dailyTrend.map(([date, amount]) => (
              <div key={date} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">{formatDate(new Date(date))}</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">SKU: {product.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">{product.soldQuantity} sold</p>
                  <p className="text-sm text-green-600 dark:text-green-400">{formatCurrency(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
          {topProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p>No products sold in this period</p>
            </div>
          )}
        </Card>

        {/* Recent Sales */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Sales</h3>
          <div className="space-y-3">
            {recentSales.map((sale) => {
              const customer = customers.find(c => c.id === sale.customerId);
              const customerName = sale.customerId === 'guest' ? 'Guest Customer' : (customer?.name || 'Unknown Customer');
              return (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Sale #{sale.id.slice(-6)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{customerName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{formatDate(sale.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600 dark:text-green-400">{formatCurrency(sale.total)}</p>
                    <p className={`text-xs capitalize ${
                      sale.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                      sale.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                    }`}>{sale.status}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {recentSales.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p>No sales in this period</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}