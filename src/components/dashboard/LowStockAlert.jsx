import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card } from '../common/Card';

export function LowStockAlert({ products }) {
  return (
    <Card>
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
      </div>
      {products.length > 0 ? (
        <div className="space-y-3">
          {products.slice(0, 5).map((product) => (
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
      ) : (
        <p className="text-gray-500">All products are well stocked</p>
      )}
    </Card>
  );
}