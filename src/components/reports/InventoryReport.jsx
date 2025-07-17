import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Package, AlertTriangle, TrendingDown, DollarSign } from 'lucide-react';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/helpers';

export function InventoryReport() {
  const { products } = useInventory();

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.stock * product.buyingPrice), 0);
  const lowStockProducts = products.filter(product => product.stock <= product.minStock);
  const outOfStockProducts = products.filter(product => product.stock === 0);

  const categoryBreakdown = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  const topValueProducts = products
    .map(product => ({
      ...product,
      totalValue: product.stock * product.buyingPrice
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockProducts.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockProducts.length}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Products by Category</h3>
          <div className="space-y-3">
            {Object.entries(categoryBreakdown).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900 capitalize">{category}</span>
                <span className="text-gray-600">{count} products</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alert</h3>
          <div className="space-y-3">
            {lowStockProducts.slice(0, 8).map((product) => (
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
      </div>

      {/* Top Value Products */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Highest Value Inventory</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Product</th>
                <th className="text-left py-2">Stock</th>
                <th className="text-left py-2">Unit Cost</th>
                <th className="text-left py-2">Total Value</th>
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
                  <td className="py-2 text-gray-600">{product.stock}</td>
                  <td className="py-2 text-gray-600">{formatCurrency(product.buyingPrice)}</td>
                  <td className="py-2 font-medium text-green-600">{formatCurrency(product.totalValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}