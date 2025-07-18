import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Search, Filter, Calendar, DollarSign, Receipt, Eye, User, FileText, X } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { SearchInput } from '../common/SearchInput';
import { Select } from '../common/Select';
import { Modal } from '../common/Modal';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/helpers';

export function SalesHistory() {
  const { sales, customers, products } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedSale, setSelectedSale] = useState(null);

  const filteredSales = sales.filter(sale => {
    const customer = customers.find(c => c.id === sale.customerId);
    const matchesSearch = customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    
    // Date filtering
    const saleDate = new Date(sale.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = saleDate.toDateString() === today.toDateString();
    } else if (dateFilter === 'yesterday') {
      matchesDate = saleDate.toDateString() === yesterday.toDateString();
    } else if (dateFilter === 'week') {
      matchesDate = saleDate >= weekAgo;
    } else if (dateFilter === 'month') {
      matchesDate = saleDate >= monthAgo;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSales = filteredSales.length;
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  return (
    <div className="p-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Total Revenue</p>
              <p className="text-3xl font-bold text-green-900">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="bg-green-200 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Sales</p>
              <p className="text-3xl font-bold text-blue-900">{totalSales}</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-full">
              <Receipt className="w-8 h-8 text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Average Order</p>
              <p className="text-3xl font-bold text-purple-900">{formatCurrency(averageOrderValue)}</p>
            </div>
            <div className="bg-purple-200 p-3 rounded-full">
              <Calendar className="w-8 h-8 text-purple-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Search by customer or sale ID..."
          />
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          
          <Select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </Select>
        </div>
      </Card>

      {/* Sales List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSales.map((sale) => (
          <Card key={sale.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedSale(sale)}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Sale #{sale.id.slice(-6)}</h3>
                <p className="text-sm text-gray-600">{formatDateTime(sale.createdAt)}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {sale.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <User size={14} className="mr-2" />
                {getCustomerName(sale.customerId)}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Receipt size={14} className="mr-2" />
                {sale.items.length} item{sale.items.length !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign size={14} className="mr-2" />
                {sale.paymentMethod.charAt(0).toUpperCase() + sale.paymentMethod.slice(1)}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">{formatCurrency(sale.total)}</span>
                <Button size="sm" variant="outline">
                  <Eye size={14} className="mr-1" />
                  View
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredSales.length === 0 && (
        <Card className="p-12 text-center">
          <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sales found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or date filters</p>
        </Card>
      )}

      {/* Sale Detail Modal */}
      {selectedSale && (
        <Modal 
          isOpen={true} 
          onClose={() => setSelectedSale(null)} 
          title={`Sale Details - #${selectedSale.id.slice(-6)}`}
          size="xl"
        >
          <div className="space-y-6">
            {/* Sale Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Sale ID</p>
                <p className="text-gray-900">#{selectedSale.id.slice(-6)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Date</p>
                <p className="text-gray-900">{formatDateTime(selectedSale.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Customer</p>
                <p className="text-gray-900">{getCustomerName(selectedSale.customerId)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Payment Method</p>
                <p className="text-gray-900 capitalize">{selectedSale.paymentMethod}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Items</h3>
              <div className="space-y-3">
                {selectedSale.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{getProductName(item.productId)}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</p>
                    </div>
                    <span className="font-semibold text-gray-900">{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(selectedSale.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatCurrency(selectedSale.tax)}</span>
              </div>
              {selectedSale.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(selectedSale.discount)}</span>
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(selectedSale.total)}</span>
                </div>
              </div>
              {selectedSale.amountReceived && (
                <>
                  <div className="flex justify-between">
                    <span>Amount Received:</span>
                    <span>{formatCurrency(selectedSale.amountReceived)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Change:</span>
                    <span>{formatCurrency(selectedSale.change || 0)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}