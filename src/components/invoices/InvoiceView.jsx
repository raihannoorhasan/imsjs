import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { FileText, User, Calendar, DollarSign } from 'lucide-react';

export function InvoiceView({ isOpen, onClose, invoice }) {
  const { customers, products } = useInventory();

  if (!invoice) return null;

  const customer = customers.find(c => c.id === invoice.customerId);

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
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">{invoice.invoiceNumber}</h2>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
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
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
              {invoice.status}
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Bill To:</h3>
          </div>
          <div className="text-sm text-gray-700">
            <p className="font-medium">{customer?.name || 'Unknown Customer'}</p>
            <p>{customer?.email}</p>
            <p>{customer?.phone}</p>
            {customer?.address && <p>{customer.address}</p>}
          </div>
        </div>

        {/* Items Table */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2 px-4 border-b">Item</th>
                  <th className="text-right py-2 px-4 border-b">Qty</th>
                  <th className="text-right py-2 px-4 border-b">Unit Price</th>
                  <th className="text-right py-2 px-4 border-b">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">
                      <p className="font-medium">{getProductName(item.productId)}</p>
                    </td>
                    <td className="text-right py-2 px-4">{item.quantity}</td>
                    <td className="text-right py-2 px-4">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-right py-2 px-4 font-medium">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="border-t pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>{formatCurrency(invoice.tax)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(invoice.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="flex items-center">
                  <DollarSign size={16} className="mr-1" />
                  {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
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