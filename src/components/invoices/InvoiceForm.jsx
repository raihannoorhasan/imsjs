import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { formatCurrency, formatDate } from '../../utils/helpers';

export function InvoiceForm({ isOpen, onClose, salesWithoutInvoices }) {
  const { generateInvoice, customers } = useInventory();
  const [selectedSales, setSelectedSales] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    selectedSales.forEach(saleId => {
      generateInvoice(saleId);
    });
    setSelectedSales([]);
    onClose();
  };

  const handleSaleToggle = (saleId) => {
    setSelectedSales(prev => 
      prev.includes(saleId) 
        ? prev.filter(id => id !== saleId)
        : [...prev, saleId]
    );
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Invoices" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <p className="text-gray-600">
            Select sales to create invoices for. These are completed sales that don't have invoices yet.
          </p>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2">
          {salesWithoutInvoices.map(sale => (
            <div key={sale.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={selectedSales.includes(sale.id)}
                onChange={() => handleSaleToggle(sale.id)}
                className="mr-3"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      Sale #{sale.id.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {getCustomerName(sale.customerId)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(sale.createdAt)} • {sale.items.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      {formatCurrency(sale.total)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {sale.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {salesWithoutInvoices.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">All sales already have invoices</p>
          </div>
        )}

        <div className="flex justify-between items-center pt-4">
          <p className="text-sm text-gray-600">
            {selectedSales.length} sale(s) selected
          </p>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={selectedSales.length === 0}
            >
              Create {selectedSales.length} Invoice(s)
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}