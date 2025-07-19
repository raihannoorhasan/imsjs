import React, { useState, useEffect } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { DollarSign, User, Calendar, FileText, Edit2 } from 'lucide-react';

export function ServicePaymentEditForm({ isOpen, onClose, payment, onSubmit }) {
  const { customers, serviceTickets, sales } = useInventory();
  const [formData, setFormData] = useState({
    customerId: '',
    serviceTicketId: '',
    relatedSaleId: '',
    amount: 0,
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    receivedBy: 'Admin',
    notes: '',
    paymentType: 'service_charge'
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        customerId: payment.customerId || '',
        serviceTicketId: payment.serviceTicketId || '',
        relatedSaleId: payment.relatedSaleId || '',
        amount: payment.amount || 0,
        paymentMethod: payment.paymentMethod || 'cash',
        paymentDate: payment.paymentDate ? new Date(payment.paymentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        receivedBy: payment.receivedBy || 'Admin',
        notes: payment.notes || '',
        paymentType: payment.paymentType || 'service_charge'
      });
    }
  }, [payment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSubmit({
      ...formData,
      paymentDate: new Date(formData.paymentDate),
      amount: parseFloat(formData.amount)
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const customerTickets = serviceTickets.filter(t => 
    t.customerId === formData.customerId && 
    !['cancelled'].includes(t.status)
  );

  const customerSales = sales.filter(s => 
    s.customerId === formData.customerId && 
    (s.status === 'completed' || s.status === 'pending')
  );

  const getSaleDescription = (sale) => {
    const itemCount = sale.items.length;
    const statusText = sale.status === 'pending' ? ' [PENDING]' : '';
    return `Sale #${sale.id.slice(-6)} - ${itemCount} item(s) ($${sale.total.toFixed(2)})${statusText}`;
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={
        <div className="flex items-center space-x-2">
          <Edit2 className="w-5 h-5 text-blue-600" />
          <span>Edit Service Payment</span>
        </div>
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer & Service Selection */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-4">Customer & Service Information</h3>
          
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
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-4">Payment Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <Input
              label="Amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              required
            />
            
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
        </div>

        {/* Related Sale (for parts payment) */}
        {formData.paymentType === 'parts_payment' && customerSales.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 mb-4">Related Sale (Optional)</h3>
            
            <Select
              label="Related Sale"
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
          </div>
        )}

        {/* Additional Information */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-4">Additional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Received By"
              value={formData.receivedBy}
              onChange={(e) => handleChange('receivedBy', e.target.value)}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Additional payment notes..."
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Update Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
}