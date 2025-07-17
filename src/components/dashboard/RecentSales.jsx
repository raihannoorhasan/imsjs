import React from 'react';
import { Card } from '../common/Card';

export function RecentSales({ sales }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h3>
      {sales.length > 0 ? (
        <div className="space-y-3">
          {sales.map((sale) => (
            <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Sale #{sale.id.slice(-6)}</p>
                <p className="text-sm text-gray-600">
                  {new Date(sale.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">${sale.total.toFixed(2)}</p>
                <p className="text-xs text-gray-500 capitalize">{sale.status}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No sales recorded yet</p>
      )}
    </Card>
  );
}