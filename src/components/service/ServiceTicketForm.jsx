import React, { useState, useEffect } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export function ServiceTicketForm({ isOpen, onClose, ticket, onSubmit }) {
  const { customers, technicians } = useInventory();
  const [formData, setFormData] = useState({
    customerId: '',
    deviceType: 'laptop',
    deviceBrand: '',
    deviceModel: '',
    serialNumber: '',
    issueDescription: '',
    priority: 'medium',
    assignedTechnician: '',
    estimatedCost: 0,
    laborCost: 0,
    partsCost: 0,
    status: 'received',
    customerNotes: '',
    technicianNotes: '',
    partsUsed: []
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        customerId: ticket.customerId,
        deviceType: ticket.deviceType,
        deviceBrand: ticket.deviceBrand,
        deviceModel: ticket.deviceModel,
        serialNumber: ticket.serialNumber,
        issueDescription: ticket.issueDescription,
        priority: ticket.priority,
        assignedTechnician: ticket.assignedTechnician,
        estimatedCost: ticket.estimatedCost,
        laborCost: ticket.laborCost,
        partsCost: ticket.partsCost,
        status: ticket.status,
        customerNotes: ticket.customerNotes,
        technicianNotes: ticket.technicianNotes,
        partsUsed: ticket.partsUsed || []
      });
    } else {
      setFormData({
        customerId: '',
        deviceType: 'laptop',
        deviceBrand: '',
        deviceModel: '',
        serialNumber: '',
        issueDescription: '',
        priority: 'medium',
        assignedTechnician: '',
        estimatedCost: 0,
        laborCost: 0,
        partsCost: 0,
        status: 'received',
        customerNotes: '',
        technicianNotes: '',
        partsUsed: []
      });
    }
  }, [ticket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={ticket ? 'Edit Service Ticket' : 'New Service Ticket'}
      size="xl"
    >
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
            label="Device Type"
            value={formData.deviceType}
            onChange={(e) => handleChange('deviceType', e.target.value)}
          >
            <option value="laptop">Laptop</option>
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablet</option>
            <option value="phone">Phone</option>
            <option value="other">Other</option>
          </Select>
          
          <Input
            label="Device Brand"
            value={formData.deviceBrand}
            onChange={(e) => handleChange('deviceBrand', e.target.value)}
            required
          />
          
          <Input
            label="Device Model"
            value={formData.deviceModel}
            onChange={(e) => handleChange('deviceModel', e.target.value)}
            required
          />
          
          <Input
            label="Serial Number"
            value={formData.serialNumber}
            onChange={(e) => handleChange('serialNumber', e.target.value)}
          />
          
          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>
          
          <Select
            label="Assigned Technician"
            value={formData.assignedTechnician}
            onChange={(e) => handleChange('assignedTechnician', e.target.value)}
          >
            <option value="">Select Technician</option>
            {technicians.filter(t => t.status === 'active').map(technician => (
              <option key={technician.id} value={technician.id}>{technician.name}</option>
            ))}
          </Select>
          
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="received">Received</option>
            <option value="diagnosed">Diagnosed</option>
            <option value="waiting_approval">Waiting Approval</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          
          <Input
            label="Estimated Cost"
            type="number"
            step="0.01"
            value={formData.estimatedCost}
            onChange={(e) => handleChange('estimatedCost', parseFloat(e.target.value) || 0)}
          />
          
          <Input
            label="Labor Cost"
            type="number"
            step="0.01"
            value={formData.laborCost}
            onChange={(e) => handleChange('laborCost', parseFloat(e.target.value) || 0)}
          />
          
          <Input
            label="Parts Cost"
            type="number"
            step="0.01"
            value={formData.partsCost}
            onChange={(e) => handleChange('partsCost', parseFloat(e.target.value) || 0)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Issue Description</label>
          <textarea
            value={formData.issueDescription}
            onChange={(e) => handleChange('issueDescription', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Notes</label>
            <textarea
              value={formData.customerNotes}
              onChange={(e) => handleChange('customerNotes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technician Notes</label>
            <textarea
              value={formData.technicianNotes}
              onChange={(e) => handleChange('technicianNotes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {ticket ? 'Update Ticket' : 'Create Ticket'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}