import React, { useState, useEffect } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus, Printer } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { CustomerForm } from '../customers/CustomerForm';
import { formatDate, formatDateTime } from '../../utils/helpers';

export function ServiceTicketForm({ isOpen, onClose, ticket, onSubmit }) {
  const { customers, technicians, addCustomer, servicePayments, addServicePayment } = useInventory();
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
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState(null);

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
    const result = onSubmit(formData);
    
    // If creating a new ticket, show receipt option
    if (!ticket && result) {
      setGeneratedTicket(result);
      setShowReceiptModal(true);
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

  const handlePrintReceipt = () => {
    if (!generatedTicket) return;
    
    const customer = customers.find(c => c.id === generatedTicket.customerId);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Service Receipt - ${generatedTicket.ticketNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 3px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 28px; font-weight: bold; color: #ea580c; margin-bottom: 5px; }
            .receipt-title { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 15px; text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; }
            .ticket-number { background: #f3f4f6; padding: 10px; text-align: center; font-weight: bold; color: #374151; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
            .detail-section h3 { color: #1f2937; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
            .detail-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
            .detail-label { font-weight: 600; color: #4b5563; }
            .detail-value { color: #1f2937; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Hi Tech Computer</div>
            <div>Professional Computer Service & Repair</div>
            <div style="margin-top: 10px; color: #6b7280; font-size: 14px;">
              📍 123 Tech Street, Silicon Valley | 📞 +1-555-0123 | ✉️ service@hitechcomputer.com
            </div>
          </div>
          
          <div class="receipt-title">SERVICE RECEIPT</div>
          
          <div class="ticket-number">
            Ticket No: ${generatedTicket.ticketNumber}
          </div>
          
          <div class="details-grid">
            <div class="detail-section">
              <h3>Customer Information</h3>
              <div class="detail-item">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${customer?.name || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${customer?.phone || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${customer?.email || 'N/A'}</span>
              </div>
            </div>
            
            <div class="detail-section">
              <h3>Device Information</h3>
              <div class="detail-item">
                <span class="detail-label">Device:</span>
                <span class="detail-value">${generatedTicket.deviceBrand} ${generatedTicket.deviceModel}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Type:</span>
                <span class="detail-value" style="text-transform: capitalize;">${generatedTicket.deviceType}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Serial Number:</span>
                <span class="detail-value">${generatedTicket.serialNumber || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h3>Service Details</h3>
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 10px 0;">
              <strong>Issue Description:</strong><br>
              ${generatedTicket.issueDescription}
            </div>
            ${generatedTicket.customerNotes ? `
              <div style="background: #e0f2fe; border: 1px solid #0284c7; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <strong>Customer Notes:</strong><br>
                ${generatedTicket.customerNotes}
              </div>
            ` : ''}
          </div>
          
          <div class="detail-section">
            <h3>Service Information</h3>
            <div class="detail-item">
              <span class="detail-label">Priority:</span>
              <span class="detail-value" style="text-transform: capitalize;">${generatedTicket.priority}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Received Date:</span>
              <span class="detail-value">${formatDateTime(generatedTicket.createdAt)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Estimated Cost:</span>
              <span class="detail-value">$${generatedTicket.estimatedCost.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="footer">
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <div style="font-weight: bold; color: #1f2937; margin-bottom: 10px;">
                Important Information:
              </div>
              <div style="color: #6b7280; font-size: 14px; text-align: left;">
                • Please keep this receipt for your records<br>
                • You will be contacted once diagnosis is complete<br>
                • Estimated repair time: 3-5 business days<br>
                • For inquiries, please reference ticket number: ${generatedTicket.ticketNumber}
              </div>
            </div>
            
            <div style="margin-top: 30px;">
              <div style="font-weight: bold; color: #1f2937; margin-bottom: 5px;">
                Thank you for choosing Hi Tech Computer!
              </div>
              <div style="color: #6b7280; font-size: 12px;">
                Generated on ${formatDateTime(new Date())}
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
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

      {/* Receipt Modal */}
      <Modal
        isOpen={showReceiptModal}
        onClose={() => {
          setShowReceiptModal(false);
          setGeneratedTicket(null);
          onClose();
        }}
        title="Service Ticket Created Successfully!"
        size="md"
      >
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <Printer className="w-12 h-12 text-green-600" />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ticket {generatedTicket?.ticketNumber} Created
            </h3>
            <p className="text-gray-600">
              Would you like to print a receipt for the customer?
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">
              <p>Device: {generatedTicket?.deviceBrand} {generatedTicket?.deviceModel}</p>
              <p>Priority: {generatedTicket?.priority}</p>
              <p>Estimated Cost: ${generatedTicket?.estimatedCost?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={handlePrintReceipt}
              className="flex-1"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Receipt
            </Button>
            <Button 
              onClick={() => {
                setShowReceiptModal(false);
                setGeneratedTicket(null);
                onClose();
              }}
              variant="outline"
              className="flex-1"
            >
              Skip
            </Button>
          </div>
        </div>
      </Modal>
      <CustomerForm
        isOpen={showCustomerForm}
        onClose={() => setShowCustomerForm(false)}
        onSubmit={handleAddCustomer}
      />
    </>
  );
}