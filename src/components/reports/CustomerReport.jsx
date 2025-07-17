import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Users, DollarSign, TrendingUp, Star } from 'lucide-react';
import { Card } from '../common/Card';
import { formatCurrency, formatDate } from '../../utils/helpers';

export function CustomerReport() {
  const { customers, sales } = useInventory();

  const totalCustomers = customers.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const averageCustomerValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
  const repeatCustomers = customers.filter(customer => {
    const customerSales = sales.filter(sale => sale.customerId === customer.id);
    return customerSales.length > 1;
  }).length;

  const topCustomers = customers
    .map(customer => {
      const customerSales = sales.filter(sale => sale.customerId === customer.id);
      const totalSpent = customerSales.reduce((sum, sale) => sum + sale.total, 0);
      const orderCount = customerSales.length;
      return { ...customer, totalSpent, orderCount };
    })
    .filter(customer => customer.totalSpent > 0)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10);

  const recentCustomers = customers
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Customer Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageCustomerValue)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Repeat Customers</p>
              <p className="text-2xl font-bold text-gray-900">{repeatCustomers}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Retention Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalCustomers > 0 ? ((repeatCustomers / totalCustomers) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers by Revenue</h3>
          <div className="space-y-3">
            {topCustomers.map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">{formatCurrency(customer.totalSpent)}</p>
                  <p className="text-sm text-gray-500">{customer.orderCount} orders</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Customers */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Customers</h3>
          <div className="space-y-3">
            {recentCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{customer.name}</p>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                  <p className="text-xs text-gray-500">Joined {formatDate(customer.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">
                    {formatCurrency(customer.totalPurchases || 0)}
                  </p>
                  <p className="text-xs text-gray-500">Total spent</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}