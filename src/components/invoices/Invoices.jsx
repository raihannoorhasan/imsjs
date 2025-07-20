import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { FileText, DollarSign, Calendar, Plus, Send, Eye } from 'lucide-react';
import { Button } from '../common/Button';
import { InvoiceList } from './InvoiceList';
import { InvoiceFilters } from './InvoiceFilters';
import { InvoiceForm } from './InvoiceForm';
import { InvoiceView } from './InvoiceView';

export function Invoices() {
  const { invoices, sales, customers, updateInvoice, generateInvoice } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showInvoiceView, setShowInvoiceView] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paidAmount = filteredInvoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.total, 0);
  const pendingAmount = totalAmount - paidAmount;
  const overdueAmount = filteredInvoices
    .filter(invoice => invoice.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.total, 0);

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceView(true);
  };

  const handleUpdateStatus = (invoiceId, status) => {
    updateInvoice(invoiceId, { status });
  };

  const handleSendInvoice = (invoiceId) => {
    updateInvoice(invoiceId, { 
      status: 'sent', 
      sentDate: new Date() 
    });
  };

  // Get sales without invoices for manual invoice creation
  const salesWithoutInvoices = sales.filter(sale => 
    !invoices.some(invoice => invoice.saleId === sale.id)
  );
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoice Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Track and manage customer invoices and payments</p>
          </div>
          <div className="flex space-x-2">
            {salesWithoutInvoices.length > 0 && (
              <Button variant="outline" onClick={() => setShowInvoiceForm(true)}>
                <Plus size={20} className="mr-2" />
                Create Invoice
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredInvoices.length}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalAmount.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Paid Amount</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">${paidAmount.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${pendingAmount.toFixed(2)}</p>
              {overdueAmount > 0 && (
                <p className="text-sm text-red-600 dark:text-red-400">${overdueAmount.toFixed(2)} overdue</p>
              )}
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Alert for sales without invoices */}
      {salesWithoutInvoices.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                {salesWithoutInvoices.length} sale(s) don't have invoices yet
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                Create invoices for completed sales to track payments
              </p>
            </div>
            <Button size="sm" onClick={() => setShowInvoiceForm(true)}>
              Create Invoices
            </Button>
          </div>
        </div>
      )}

      <InvoiceFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <InvoiceList 
        invoices={filteredInvoices} 
        onView={handleViewInvoice}
        onUpdateStatus={handleUpdateStatus}
        onSend={handleSendInvoice}
      />

      <InvoiceForm
        isOpen={showInvoiceForm}
        onClose={() => setShowInvoiceForm(false)}
        salesWithoutInvoices={salesWithoutInvoices}
      />

      {selectedInvoice && (
        <InvoiceView
          isOpen={showInvoiceView}
          onClose={() => {
            setShowInvoiceView(false);
            setSelectedInvoice(null);
          }}
          invoice={selectedInvoice}
        />
      )}
      </div>
    </div>
  );
}