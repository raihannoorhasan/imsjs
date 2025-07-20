import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { FileText, User, Calendar, DollarSign } from 'lucide-react';

export function InvoiceView({ isOpen, onClose, invoice }) {
  const { customers, products } = useInventory();

  if (!invoice) return null;

  const customer = invoice.customerId === 'guest' ? null : customers.find(c => c.id === invoice.customerId);
  const customerName = invoice.customerId === 'guest' ? 'Guest Customer' : (customer?.name || 'Unknown Customer');

  const handlePrint = () => {
    window.print();
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invoice Details" size="xl">
      <div className="space-y-6">
        {/* Invoice Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{invoice.invoiceNumber}</h2>
            </div>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>Created: {formatDate(invoice.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>Due: {formatDate(invoice.dueDate)}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 capitalize">
              {invoice.status}
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="font-medium text-gray-900 dark:text-white">Bill To:</h3>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p className="font-medium">{customerName}</p>
            {customer?.email && <p>{customer.email}</p>}
            {customer?.phone && <p>{customer.phone}</p>}
            {customer?.address && <p>{customer.address}</p>}
          </div>
        </div>

        {/* Items Table */}
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="text-left py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">Item</th>
                  <th className="text-right py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">Qty</th>
                  <th className="text-right py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">Unit Price</th>
                  <th className="text-right py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-2 px-4 text-gray-900 dark:text-white">
                      <p className="font-medium">{getProductName(item.productId)}</p>
                    </td>
                    <td className="text-right py-2 px-4 text-gray-900 dark:text-white">{item.quantity}</td>
                    <td className="text-right py-2 px-4 text-gray-900 dark:text-white">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-right py-2 px-4 font-medium text-gray-900 dark:text-white">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="text-gray-900 dark:text-white">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                <span className="text-gray-900 dark:text-white">{formatCurrency(invoice.tax)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Discount:</span>
                  <span>-{formatCurrency(invoice.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-600 pt-2">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="flex items-center">
                  <DollarSign size={16} className="mr-1" />
                  <span className="text-gray-900 dark:text-white">{formatCurrency(invoice.total)}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <Button variant="outline" onClick={handlePrint}>
            Print Invoice
          </Button>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}