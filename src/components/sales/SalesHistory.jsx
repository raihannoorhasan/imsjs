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
    if (customerId === 'guest') return 'Guest Customer';
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">Total Revenue</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-300">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="bg-green-200 dark:bg-green-800/50 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-green-700 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Total Sales</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">{totalSales}</p>
            </div>
            <div className="bg-blue-200 dark:bg-blue-800/50 p-3 rounded-full">
              <Receipt className="w-8 h-8 text-blue-700 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-400">Average Order</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-300">{formatCurrency(averageOrderValue)}</p>
            </div>
            <div className="bg-purple-200 dark:bg-purple-800/50 p-3 rounded-full">
              <Calendar className="w-8 h-8 text-purple-700 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6 shadow-sm dark:shadow-lg">
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
          <Card key={sale.id} className="p-6 hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:-translate-y-1" onClick={() => setSelectedSale(sale)}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Sale #{sale.id.slice(-6)}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{formatDateTime(sale.createdAt)}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                sale.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                sale.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
              }`}>
                {sale.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <User size={14} className="mr-2" />
                {getCustomerName(sale.customerId)}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Receipt size={14} className="mr-2" />
                {sale.items.length} item{sale.items.length !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <DollarSign size={14} className="mr-2" />
                {sale.paymentMethod.charAt(0).toUpperCase() + sale.paymentMethod.slice(1)}
                {sale.linkedToService && (
                  <span className="ml-2 text-blue-600 dark:text-blue-400 text-xs">• Linked to Service</span>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(sale.total)}</span>
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
        <Card className="p-12 text-center shadow-sm dark:shadow-lg">
          <Receipt className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No sales found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or date filters</p>
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
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Sale ID</p>
                <p className="text-gray-900 dark:text-white">#{selectedSale.id.slice(-6)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</p>
                <p className="text-gray-900 dark:text-white">{formatDateTime(selectedSale.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer</p>
                <p className="text-gray-900 dark:text-white">{getCustomerName(selectedSale.customerId)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</p>
                <p className="text-gray-900 dark:text-white capitalize">{selectedSale.paymentMethod}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Items</h3>
              <div className="space-y-3">
                {selectedSale.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{getProductName(item.productId)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</p>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="text-gray-900 dark:text-white">{formatCurrency(selectedSale.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                <span className="text-gray-900 dark:text-white">{formatCurrency(selectedSale.tax)}</span>
              </div>
              {selectedSale.discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount:</span>
                  <span>-{formatCurrency(selectedSale.discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-green-600 dark:text-green-400">{formatCurrency(selectedSale.total)}</span>
                </div>
              </div>
              {selectedSale.amountReceived && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Amount Received:</span>
                    <span className="text-gray-900 dark:text-white">{formatCurrency(selectedSale.amountReceived)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Change:</span>
                    <span className="text-gray-900 dark:text-white">{formatCurrency(selectedSale.change || 0)}</span>
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