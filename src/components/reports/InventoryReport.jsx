import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Package, AlertTriangle, TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/helpers';

export function InventoryReport({ timeRange = 'monthly' }) {
  const { products } = useInventory();

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'daily': return 'Today';
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
      case 'yearly': return 'This Year';
      default: return 'Current Status';
    }
  };

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.stock * product.buyingPrice), 0);
  const lowStockProducts = products.filter(product => product.stock <= product.minStock);
  const outOfStockProducts = products.filter(product => product.stock === 0);
  const overStockedProducts = products.filter(product => product.stock > product.minStock * 5);
  const totalSellingValue = products.reduce((sum, product) => sum + (product.stock * product.sellingPrice), 0);
  const potentialProfit = totalSellingValue - totalValue;

  const categoryBreakdown = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = {
        count: 0,
        value: 0,
        stock: 0,
        lowStock: 0
      };
    }
    acc[product.category].count += 1;
    acc[product.category].value += product.stock * product.buyingPrice;
    acc[product.category].stock += product.stock;
    if (product.stock <= product.minStock) {
      acc[product.category].lowStock += 1;
    }
    return acc;
  }, {});

  const topValueProducts = products
    .map(product => ({
      ...product,
      totalValue: product.stock * product.buyingPrice,
      totalSellingValue: product.stock * product.sellingPrice,
      potentialProfit: (product.stock * product.sellingPrice) - (product.stock * product.buyingPrice)
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 10);

  // Stock movement analysis (simulated - in real app would track actual movements)
  const stockMovementAnalysis = {
    fastMoving: products.filter(p => p.stock < p.minStock * 2).length,
    slowMoving: products.filter(p => p.stock > p.minStock * 3).length,
    deadStock: products.filter(p => p.stock > p.minStock * 5).length
  };

  return (
    <div className="space-y-6">
      {/* Time Range Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-indigo-900">Inventory Report - {getTimeRangeLabel()}</h2>
            <p className="text-indigo-700 mt-1">Stock levels, valuation, and inventory health analysis</p>
          </div>
          <div className="bg-indigo-100 p-3 rounded-full">
            <Package className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Products</p>
              <p className="text-3xl font-bold text-blue-900">{totalProducts}</p>
              <p className="text-sm text-blue-600 mt-1">SKUs in system</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-full">
              <Package className="w-8 h-8 text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Inventory Value</p>
              <p className="text-3xl font-bold text-green-900">{formatCurrency(totalValue)}</p>
              <p className="text-sm text-green-600 mt-1">Cost basis</p>
            </div>
            <div className="bg-green-200 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Potential Value</p>
              <p className="text-3xl font-bold text-yellow-900">{formatCurrency(totalSellingValue)}</p>
              <p className="text-sm text-yellow-600 mt-1">At selling price</p>
            </div>
            <div className="bg-yellow-200 p-3 rounded-full">
              <TrendingUp className="w-8 h-8 text-yellow-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Low Stock Items</p>
              <p className="text-3xl font-bold text-red-900">{lowStockProducts.length}</p>
              <p className="text-sm text-red-600 mt-1">Need attention</p>
            </div>
            <div className="bg-red-200 p-3 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Stock Health Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Stock Health Overview</h3>
          <TrendingDown className="w-6 h-6 text-gray-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-green-700">Well Stocked</p>
            <p className="text-2xl font-bold text-green-900">
              {products.length - lowStockProducts.length - outOfStockProducts.length - overStockedProducts.length}
            </p>
            <p className="text-xs text-green-600 mt-1">Optimal levels</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <p className="text-sm text-yellow-700">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-900">{lowStockProducts.length}</p>
            <p className="text-xs text-yellow-600 mt-1">Below minimum</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-sm text-red-700">Out of Stock</p>
            <p className="text-2xl font-bold text-red-900">{outOfStockProducts.length}</p>
            <p className="text-xs text-red-600 mt-1">Zero inventory</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-sm text-purple-700">Overstocked</p>
            <p className="text-2xl font-bold text-purple-900">{overStockedProducts.length}</p>
            <p className="text-xs text-purple-600 mt-1">Excess inventory</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Inventory by Category</h3>
          <div className="space-y-3">
            {Object.entries(categoryBreakdown).map(([category, data]) => {
              const valuePercentage = totalValue > 0 ? (data.value / totalValue) * 100 : 0;
              return (
                <div key={category} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 capitalize">{category}</span>
                    <span className="text-sm text-gray-600">{valuePercentage.toFixed(1)}% of value</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Products</p>
                      <p className="font-medium">{data.count}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Value</p>
                      <p className="font-medium text-green-600">{formatCurrency(data.value)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Low Stock</p>
                      <p className={`font-medium ${data.lowStock > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {data.lowStock}
                      </p>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${valuePercentage}%` }}
                      ></div>
                    </div>
                  </div>
              </div>
              );
            })}
          </div>
        </Card>

        {/* Stock Movement Analysis */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Stock Movement Analysis</h3>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-red-900">Fast Moving</span>
                <span className="text-red-700 font-bold">{stockMovementAnalysis.fastMoving}</span>
              </div>
              <p className="text-sm text-red-700">Products with low stock levels - high demand</p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-yellow-900">Slow Moving</span>
                <span className="text-yellow-700 font-bold">{stockMovementAnalysis.slowMoving}</span>
              </div>
              <p className="text-sm text-yellow-700">Products with high stock levels - consider promotion</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-purple-900">Dead Stock</span>
                <span className="text-purple-700 font-bold">{stockMovementAnalysis.deadStock}</span>
              </div>
              <p className="text-sm text-purple-700">Overstocked items - review purchasing strategy</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Critical Stock Alerts */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Critical Stock Alerts</h3>
          <div className="space-y-3">
            {outOfStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <p className="font-medium text-red-900">{product.name}</p>
                  <p className="text-sm text-red-700">SKU: {product.sku} • OUT OF STOCK</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">0 remaining</p>
                  <p className="text-xs text-red-500">Min: {product.minStock}</p>
                </div>
              </div>
            ))}
            {lowStockProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">
                    {product.stock} remaining
                  </p>
                  <p className="text-xs text-gray-500">Min: {product.minStock}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Top Value Products */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Highest Value Inventory</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Product</th>
                <th className="text-left py-2">Category</th>
                <th className="text-left py-2">Stock</th>
                <th className="text-left py-2">Unit Cost</th>
                <th className="text-left py-2">Current Value</th>
                <th className="text-left py-2">Potential Profit</th>
              </tr>
            </thead>
            <tbody>
              {topValueProducts.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="py-2">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                    </div>
                  </td>
                  <td className="py-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-2 text-gray-600">{product.stock}</td>
                  <td className="py-2 text-gray-600">{formatCurrency(product.buyingPrice)}</td>
                  <td className="py-2 font-medium text-green-600">{formatCurrency(product.totalValue)}</td>
                  <td className="py-2 font-medium text-blue-600">{formatCurrency(product.potentialProfit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}