import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { generateId } from '../../utils/helpers';

export function ServicePaymentForm({ isOpen, onClose, onSubmit }) {
  const { customers, serviceTickets, sales, products } = useInventory();
  const [formData, setFormData] = useState({
    customerId: '',
    serviceTicketId: '',
    relatedSaleId: '',
    amount: 0,
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    receivedBy: 'Admin',
    notes: '',
    paymentType: 'service_charge',
    autoCalculateFromSale: false
  });
  const [selectedSale, setSelectedSale] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const receiptNumber = `SR-${generateId()}`;
    
    onSubmit({
      ...formData,
      receiptNumber,
      paymentDate: new Date(formData.paymentDate),
      amount: parseFloat(formData.amount),
      status: 'pending',
      createdAt: new Date()
    });
    
    setFormData({
      customerId: '',
      serviceTicketId: '',
      relatedSaleId: '',
      amount: 0,
      paymentMethod: 'cash',
      paymentDate: new Date().toISOString().split('T')[0],
      receivedBy: 'Admin',
      notes: '',
      paymentType: 'service_charge',
      autoCalculateFromSale: false
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-fill customer when ticket is selected
    if (field === 'serviceTicketId') {
      const ticket = serviceTickets.find(t => t.id === value);
      if (ticket) {
        setFormData(prev => ({ 
          ...prev, 
          customerId: ticket.customerId,
          // Auto-suggest parts cost if available
          amount: prev.paymentType === 'parts_payment' ? ticket.partsCost : prev.amount
        }));
      }
    }
    
    // Handle sale selection for parts payment
    if (field === 'relatedSaleId') {
      const sale = sales.find(s => s.id === value);
      setSelectedSale(sale);
      if (sale && formData.paymentType === 'parts_payment') {
        setFormData(prev => ({ 
          ...prev, 
          amount: sale.total,
          notes: `Parts payment for sale #${sale.id.slice(-6)} - ${sale.items.length} item(s)`
        }));
      }
    }
    
    // Handle payment type change
    if (field === 'paymentType') {
      if (value === 'parts_payment' && formData.serviceTicketId) {
        const ticket = serviceTickets.find(t => t.id === formData.serviceTicketId);
        if (ticket && ticket.partsCost > 0) {
          setFormData(prev => ({ ...prev, amount: ticket.partsCost }));
        }
      }
    }
  };

  const customerTickets = serviceTickets.filter(t => 
    t.customerId === formData.customerId && 
    !['cancelled'].includes(t.status)
  );
  
  // Get sales for the selected customer (for parts payment)
  const customerSales = sales.filter(s => 
    s.customerId === formData.customerId && 
    s.status === 'completed'
  );
  
  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };
  
  const getSaleDescription = (sale) => {
    const itemCount = sale.items.length;
    const firstItem = sale.items[0];
    const productName = firstItem ? getProductName(firstItem.productId) : 'Unknown';
    return `Sale #${sale.id.slice(-6)} - ${productName}${itemCount > 1 ? ` +${itemCount - 1} more` : ''} ($${sale.total.toFixed(2)})`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Service Payment" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Customer"
            value={formData.customerId}
            onChange={(e) => handleChange('customerId', e.target.value)}
            required
          >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </Select>
          
          <Select
            label="Service Ticket"
            value={formData.serviceTicketId}
            onChange={(e) => handleChange('serviceTicketId', e.target.value)}
            required
            disabled={!formData.customerId}
          >
            <option value="">Select Service Ticket</option>
            {customerTickets.map(ticket => (
              <option key={ticket.id} value={ticket.id}>
                {ticket.ticketNumber} - {ticket.deviceBrand} {ticket.deviceModel}
              </option>
            ))}
          </Select>
          
          <Select
            label="Payment Type"
            value={formData.paymentType}
            onChange={(e) => handleChange('paymentType', e.target.value)}
          >
            <option value="service_charge">Service Charge</option>
            <option value="advance_payment">Advance Payment</option>
            <option value="parts_payment">Parts Payment</option>
            <option value="labor_payment">Labor Payment</option>
            <option value="diagnostic_fee">Diagnostic Fee</option>
          </Select>
          
          {/* Show sale selection for parts payment */}
          {formData.paymentType === 'parts_payment' && customerSales.length > 0 && (
            <Select
              label="Related Sale (Optional)"
              value={formData.relatedSaleId}
              onChange={(e) => handleChange('relatedSaleId', e.target.value)}
            >
              <option value="">Select related sale</option>
              {customerSales.map(sale => (
                <option key={sale.id} value={sale.id}>
                  {getSaleDescription(sale)}
                </option>
              ))}
            </Select>
          )}
          
          <Input
            label="Amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            required
          />
          
          {/* Show helpful info for parts payment */}
          {formData.paymentType === 'parts_payment' && formData.serviceTicketId && (
            <div className="md:col-span-2">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <div className="bg-blue-100 p-1 rounded">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <p className="text-blue-800 font-medium">Parts Payment</p>
                    <p className="text-blue-700">
                      {(() => {
                        const ticket = serviceTickets.find(t => t.id === formData.serviceTicketId);
                        if (ticket && ticket.partsCost > 0) {
                          return `Service ticket has parts cost of $${ticket.partsCost.toFixed(2)}`;
                        }
                        return 'Record payment for parts used in this service';
                      })()}
                    </p>
                    {selectedSale && (
                      <p className="text-blue-600 mt-1">
                        Linked to sale: {getSaleDescription(selectedSale)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Select
            label="Payment Method"
            value={formData.paymentMethod}
            onChange={(e) => handleChange('paymentMethod', e.target.value)}
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="transfer">Bank Transfer</option>
            <option value="check">Check</option>
          </Select>
          
          <Input
            label="Payment Date"
            type="date"
            value={formData.paymentDate}
            onChange={(e) => handleChange('paymentDate', e.target.value)}
            required
          />
        </div>
        
        <Input
          label="Received By"
          value={formData.receivedBy}
          onChange={(e) => handleChange('receivedBy', e.target.value)}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Additional payment notes..."
          />
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Record Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
}