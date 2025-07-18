import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { generateId } from '../../utils/helpers';

export function ServicePaymentForm({ isOpen, onClose, onSubmit }) {
  const { customers, serviceTickets } = useInventory();
  const [formData, setFormData] = useState({
    customerId: '',
    serviceTicketId: '',
    amount: 0,
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    receivedBy: 'Admin',
    notes: '',
    paymentType: 'service_charge'
  });

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
      amount: 0,
      paymentMethod: 'cash',
      paymentDate: new Date().toISOString().split('T')[0],
      receivedBy: 'Admin',
      notes: '',
      paymentType: 'service_charge'
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-fill customer when ticket is selected
    if (field === 'serviceTicketId') {
      const ticket = serviceTickets.find(t => t.id === value);
      if (ticket) {
        setFormData(prev => ({ ...prev, customerId: ticket.customerId }));
      }
    }
  };

  const customerTickets = serviceTickets.filter(t => 
    t.customerId === formData.customerId && 
    ['completed', 'delivered'].includes(t.status)
  );

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