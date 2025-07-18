import React, { useState, useEffect } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { CustomerForm } from '../customers/CustomerForm';

export function ServiceTicketForm({ isOpen, onClose, ticket, onSubmit }) {
  const { customers, technicians, generateServiceInvoice, addCustomer } = useInventory();
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
  const [showCustomerForm, setShowCustomerForm] = useState(false);

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
    
    // Check if status is being changed to completed
    const wasCompleted = ticket?.status === 'completed';
    const isNowCompleted = formData.status === 'completed';
    
    onSubmit(formData);
    
    // Generate invoice automatically when ticket is completed
    if (!wasCompleted && isNowCompleted && (formData.laborCost > 0 || formData.partsCost > 0)) {
      setTimeout(() => {
        if (ticket) {
          generateServiceInvoice(ticket.id);
        }
      }, 100);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCustomer = (customerData) => {
    const newCustomer = addCustomer(customerData);
    setFormData(prev => ({ ...prev, customerId: newCustomer.id }));
    setShowCustomerForm(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={ticket ? 'Edit Service Ticket' : 'New Service Ticket'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
              <div className="flex space-x-2">
                <select
                  value={formData.customerId}
                  onChange={(e) => handleChange('customerId', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShowCustomerForm(true)}
                  className="px-3 bg-green-600 hover:bg-green-700"
                  title="Add New Customer"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          
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
            placeholder="0.00"
          />
          
          <Input
            label="Labor Cost"
            type="number"
            step="0.01"
            value={formData.laborCost}
            onChange={(e) => handleChange('laborCost', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
          
          <Input
            label="Parts Cost"
            type="number"
            step="0.01"
            value={formData.partsCost}
            onChange={(e) => handleChange('partsCost', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
        </div>
        
        {/* Cost Summary */}
        {(formData.laborCost > 0 || formData.partsCost > 0) && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Cost Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Labor Cost:</span>
                <span className="ml-2 font-medium text-blue-600">${formData.laborCost.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-600">Parts Cost:</span>
                <span className="ml-2 font-medium text-purple-600">${formData.partsCost.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-600">Subtotal:</span>
                <span className="ml-2 font-medium text-gray-900">${(formData.laborCost + formData.partsCost).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-600">Total (with tax):</span>
                <span className="ml-2 font-bold text-green-600">${((formData.laborCost + formData.partsCost) * 1.1).toFixed(2)}</span>
              </div>
            </div>
            {formData.status === 'completed' && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                💡 Invoice will be automatically generated when this ticket is marked as completed
              </div>
            )}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Issue Description</label>
          <textarea
            value={formData.issueDescription}
            onChange={(e) => handleChange('issueDescription', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            required
            placeholder="Describe the issue in detail..."
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
              placeholder="Any additional notes from the customer..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technician Notes</label>
            <textarea
              value={formData.technicianNotes}
              onChange={(e) => handleChange('technicianNotes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Technical notes and work performed..."
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

      <CustomerForm
        isOpen={showCustomerForm}
        onClose={() => setShowCustomerForm(false)}
        onSubmit={handleAddCustomer}
      />
    </>
  );
}