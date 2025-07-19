import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  BarChart3, 
  Package, 
  ShoppingCart,
  Calculator,
  PieChart
} from 'lucide-react';
import { Card } from '../common/Card';
import { formatCurrency, formatDate, calculateProfitMargin } from '../../utils/helpers';

export function ProfitReport({ timeRange = 'monthly' }) {
  const { sales, products, customers } = useInventory();

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

  // Calculate profit metrics
  const calculateProfitMetrics = () => {
    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;
    const productProfits = {};
    const categoryProfits = {};

    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const revenue = item.total;
          const cost = product.buyingPrice * item.quantity;
          const profit = revenue - cost;

          totalRevenue += revenue;
          totalCost += cost;
          totalProfit += profit;

          // Product-wise profit
          if (!productProfits[product.id]) {
            productProfits[product.id] = {
              ...product,
              totalRevenue: 0,
              totalCost: 0,
              totalProfit: 0,
              quantitySold: 0
            };
          }
          productProfits[product.id].totalRevenue += revenue;
          productProfits[product.id].totalCost += cost;
          productProfits[product.id].totalProfit += profit;
          productProfits[product.id].quantitySold += item.quantity;

          // Category-wise profit
          if (!categoryProfits[product.category]) {
            categoryProfits[product.category] = {
              totalRevenue: 0,
              totalCost: 0,
              totalProfit: 0,
              quantitySold: 0
            };
          }
          categoryProfits[product.category].totalRevenue += revenue;
          categoryProfits[product.category].totalCost += cost;
          categoryProfits[product.category].totalProfit += profit;
          categoryProfits[product.category].quantitySold += item.quantity;
        }
      });
    });

    return {
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
      productProfits: Object.values(productProfits),
      categoryProfits
    };
  };

  const profitMetrics = calculateProfitMetrics();

  // Top profitable products
  const topProfitableProducts = profitMetrics.productProfits
    .sort((a, b) => b.totalProfit - a.totalProfit)
    .slice(0, 10);

  // Top profitable categories
  const topProfitableCategories = Object.entries(profitMetrics.categoryProfits)
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.totalProfit - a.totalProfit);

  // Profit by customer
  const customerProfits = customers.map(customer => {
    const customerSales = filteredSales.filter(sale => sale.customerId === customer.id);
    let customerRevenue = 0;
    let customerCost = 0;
    let customerProfit = 0;

    customerSales.forEach(sale => {
      sale.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          customerRevenue += item.total;
          customerCost += product.buyingPrice * item.quantity;
          customerProfit += item.total - (product.buyingPrice * item.quantity);
        }
      });
    });

    return {
      ...customer,
      customerRevenue,
      customerCost,
      customerProfit,
      orderCount: customerSales.length
    };
  }).filter(customer => customer.customerProfit > 0)
    .sort((a, b) => b.customerProfit - a.customerProfit)
    .slice(0, 10);

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'daily': return 'Today';
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
      case 'yearly': return 'This Year';
      default: return 'This Month';
    }
  };

  return (
    <div className="space-y-6">
      {/* Time Range Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-purple-900">Profit Analysis - {getTimeRangeLabel()}</h2>
            <p className="text-purple-700 mt-1">Detailed profitability insights and margin analysis</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-full">
            <Target className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Profit Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Total Revenue</p>
              <p className="text-3xl font-bold text-green-900">{formatCurrency(profitMetrics.totalRevenue)}</p>
              <p className="text-sm text-green-600 mt-1">Gross sales</p>
            </div>
            <div className="bg-green-200 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Total Cost</p>
              <p className="text-3xl font-bold text-red-900">{formatCurrency(profitMetrics.totalCost)}</p>
              <p className="text-sm text-red-600 mt-1">Cost of goods</p>
            </div>
            <div className="bg-red-200 p-3 rounded-full">
              <Calculator className="w-8 h-8 text-red-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Net Profit</p>
              <p className="text-3xl font-bold text-blue-900">{formatCurrency(profitMetrics.totalProfit)}</p>
              <p className="text-sm text-blue-600 mt-1">After costs</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-full">
              <TrendingUp className="w-8 h-8 text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Profit Margin</p>
              <p className="text-3xl font-bold text-purple-900">{profitMetrics.profitMargin.toFixed(1)}%</p>
              <p className="text-sm text-purple-600 mt-1">Overall margin</p>
            </div>
            <div className="bg-purple-200 p-3 rounded-full">
              <Target className="w-8 h-8 text-purple-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Profit Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Profitability */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Profit by Category</h3>
            <PieChart className="w-6 h-6 text-gray-500" />
          </div>
          <div className="space-y-4">
            {topProfitableCategories.map((category, index) => {
              const marginPercentage = category.totalRevenue > 0 ? (category.totalProfit / category.totalRevenue) * 100 : 0;
              const revenuePercentage = profitMetrics.totalRevenue > 0 ? (category.totalRevenue / profitMetrics.totalRevenue) * 100 : 0;
              
              return (
                <div key={category.category} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900 capitalize">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(category.totalProfit)}</p>
                      <p className="text-sm text-gray-600">{marginPercentage.toFixed(1)}% margin</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Revenue</p>
                      <p className="font-medium">{formatCurrency(category.totalRevenue)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Cost</p>
                      <p className="font-medium text-red-600">{formatCurrency(category.totalCost)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Sold</p>
                      <p className="font-medium">{category.quantitySold} items</p>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${revenuePercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{revenuePercentage.toFixed(1)}% of total revenue</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top Profitable Products */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Most Profitable Products</h3>
            <Package className="w-6 h-6 text-gray-500" />
          </div>
          <div className="space-y-3">
            {topProfitableProducts.slice(0, 8).map((product, index) => {
              const marginPercentage = product.totalRevenue > 0 ? (product.totalProfit / product.totalRevenue) * 100 : 0;
              
              return (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.quantitySold} sold • {marginPercentage.toFixed(1)}% margin</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(product.totalProfit)}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(product.totalRevenue)} revenue</p>
                  </div>
                </div>
              );
            })}
          </div>
          {topProfitableProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No profitable products in this period</p>
            </div>
          )}
        </Card>
      </div>

      {/* Customer Profitability */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Top Profitable Customers</h3>
          <TrendingUp className="w-6 h-6 text-gray-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customerProfits.slice(0, 9).map((customer, index) => {
            const marginPercentage = customer.customerRevenue > 0 ? (customer.customerProfit / customer.customerRevenue) * 100 : 0;
            
            return (
              <div key={customer.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900">{customer.name}</span>
                  </div>
                  <span className="text-sm text-blue-600 font-medium">{customer.orderCount} orders</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium">{formatCurrency(customer.customerRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profit:</span>
                    <span className="font-bold text-green-600">{formatCurrency(customer.customerProfit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Margin:</span>
                    <span className="font-medium text-purple-600">{marginPercentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {customerProfits.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No customer profit data available for this period</p>
          </div>
        )}
      </Card>

      {/* Profit Insights */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Profit Insights & Recommendations</h3>
          <BarChart3 className="w-6 h-6 text-gray-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* High Margin Alert */}
          {profitMetrics.profitMargin > 30 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Excellent Margins</span>
              </div>
              <p className="text-sm text-green-700">
                Your profit margin of {profitMetrics.profitMargin.toFixed(1)}% is excellent. 
                Consider expanding high-margin product lines.
              </p>
            </div>
          )}

          {/* Low Margin Warning */}
          {profitMetrics.profitMargin < 15 && profitMetrics.profitMargin > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-900">Low Margins</span>
              </div>
              <p className="text-sm text-yellow-700">
                Your profit margin of {profitMetrics.profitMargin.toFixed(1)}% could be improved. 
                Review pricing strategy and supplier costs.
              </p>
            </div>
          )}

          {/* Top Category Insight */}
          {topProfitableCategories.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <PieChart className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Top Category</span>
              </div>
              <p className="text-sm text-blue-700">
                {topProfitableCategories[0].category.charAt(0).toUpperCase() + topProfitableCategories[0].category.slice(1)} 
                {' '}is your most profitable category with {formatCurrency(topProfitableCategories[0].totalProfit)} profit.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}