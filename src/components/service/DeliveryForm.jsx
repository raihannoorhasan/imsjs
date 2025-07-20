import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Truck, User, Calendar, FileText, Printer } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { formatDateTime } from '../../utils/helpers';

export function DeliveryForm({ isOpen, onClose, ticket, onSubmit }) {
  const { customers } = useInventory();
  const [formData, setFormData] = useState({
    deliveredTo: 'customer',
    recipientName: '',
    recipientPhone: '',
    recipientId: '',
    relationToCustomer: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    deliveryTime: new Date().toTimeString().slice(0, 5),
    deliveredBy: 'Admin',
    notes: '',
    customerSignature: false,
    deviceCondition: 'working'
  });
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const customer = customers.find(c => c.id === ticket?.customerId);

  React.useEffect(() => {
    if (customer && formData.deliveredTo === 'customer') {
      setFormData(prev => ({
        ...prev,
        recipientName: customer.name,
        recipientPhone: customer.phone
      }));
    }
  }, [customer, formData.deliveredTo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const deliveryDateTime = new Date(`${formData.deliveryDate}T${formData.deliveryTime}`);
    
    const deliveryData = {
      ...formData,
      deliveryDateTime,
      ticketNumber: ticket.ticketNumber
    };
    
    onSubmit(deliveryData);
    setShowReceiptModal(true);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'deliveredTo') {
      if (value === 'customer' && customer) {
        setFormData(prev => ({
          ...prev,
          recipientName: customer.name,
          recipientPhone: customer.phone,
          recipientId: '',
          relationToCustomer: ''
        }));
      } else if (value === 'other') {
        setFormData(prev => ({
          ...prev,
          recipientName: '',
          recipientPhone: '',
          recipientId: '',
          relationToCustomer: ''
        }));
      }
    }
  };

  const handlePrintDeliveryReceipt = () => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Delivery Receipt - ${ticket.ticketNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 3px solid #8b5cf6; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 28px; font-weight: bold; color: #7c3aed; margin-bottom: 5px; }
            .receipt-title { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 15px; text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; }
            .ticket-number { background: #f3f4f6; padding: 10px; text-align: center; font-weight: bold; color: #374151; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
            .detail-section h3 { color: #1f2937; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
            .detail-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
            .detail-label { font-weight: 600; color: #4b5563; }
            .detail-value { color: #1f2937; }
            .signature-section { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; margin-top: 40px; }
            .signature-box { text-align: center; }
            .signature-line { border-top: 2px solid #374151; margin-top: 50px; padding-top: 10px; font-weight: 600; }
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
          
          <div class="receipt-title">DELIVERY RECEIPT</div>
          
          <div class="ticket-number">
            Service Ticket: ${ticket.ticketNumber}
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
                <span class="detail-value">${ticket.deviceBrand} ${ticket.deviceModel}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Serial Number:</span>
                <span class="detail-value">${ticket.serialNumber || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Condition:</span>
                <span class="detail-value" style="text-transform: capitalize;">${formData.deviceCondition}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h3>Delivery Information</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div class="detail-item">
                <span class="detail-label">Delivered To:</span>
                <span class="detail-value">${formData.recipientName}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${formData.recipientPhone}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Delivery Date:</span>
                <span class="detail-value">${formatDateTime(new Date(`${formData.deliveryDate}T${formData.deliveryTime}`))}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Delivered By:</span>
                <span class="detail-value">${formData.deliveredBy}</span>
              </div>
              ${formData.deliveredTo === 'other' ? `
                <div class="detail-item">
                  <span class="detail-label">ID Number:</span>
                  <span class="detail-value">${formData.recipientId}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Relation:</span>
                  <span class="detail-value">${formData.relationToCustomer}</span>
                </div>
              ` : ''}
            </div>
          </div>
          
          ${formData.notes ? `
            <div class="detail-section">
              <h3>Delivery Notes</h3>
              <div style="padding: 15px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                ${formData.notes}
              </div>
            </div>
          ` : ''}
          
          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line">Customer/Recipient Signature</div>
              <div style="margin-top: 10px; font-size: 12px; color: #6b7280;">
                ${formData.recipientName}
              </div>
            </div>
            <div class="signature-box">
              <div class="signature-line">Delivered By</div>
              <div style="margin-top: 10px; font-size: 12px; color: #6b7280;">
                ${formData.deliveredBy}
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <div style="font-weight: bold; color: #1f2937; margin-bottom: 5px;">
                Device Successfully Delivered
              </div>
              <div style="color: #6b7280; font-size: 12px;">
                Generated on ${formatDateTime(new Date())} | Ticket: ${ticket.ticketNumber}
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
        title={
          <div className="flex items-center space-x-2">
            <Truck size={20} />
            <span>Device Delivery</span>
          </div>
        }
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Device Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Device Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Ticket:</span>
                <span className="ml-2 font-medium">{ticket?.ticketNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">Device:</span>
                <span className="ml-2 font-medium">{ticket?.deviceBrand} {ticket?.deviceModel}</span>
              </div>
              <div>
                <span className="text-gray-600">Customer:</span>
                <span className="ml-2 font-medium">{customer?.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                <span className="ml-2 font-medium">{customer?.phone}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Delivered To"
              value={formData.deliveredTo}
              onChange={(e) => handleChange('deliveredTo', e.target.value)}
              required
            >
              <option value="customer">Customer (Self)</option>
              <option value="other">Other Person</option>
            </Select>
            
            <Select
              label="Device Condition"
              value={formData.deviceCondition}
              onChange={(e) => handleChange('deviceCondition', e.target.value)}
            >
              <option value="working">Working Properly</option>
              <option value="partial">Partially Working</option>
              <option value="not_working">Not Working</option>
            </Select>
            
            <Input
              label="Recipient Name"
              value={formData.recipientName}
              onChange={(e) => handleChange('recipientName', e.target.value)}
              required
              disabled={formData.deliveredTo === 'customer'}
            />
            
            <Input
              label="Recipient Phone"
              value={formData.recipientPhone}
              onChange={(e) => handleChange('recipientPhone', e.target.value)}
              required
              disabled={formData.deliveredTo === 'customer'}
            />
            
            {formData.deliveredTo === 'other' && (
              <>
                <Input
                  label="Recipient ID Number"
                  value={formData.recipientId}
                  onChange={(e) => handleChange('recipientId', e.target.value)}
                  required
                  placeholder="National ID, Driver's License, etc."
                />
                
                <Input
                  label="Relation to Customer"
                  value={formData.relationToCustomer}
                  onChange={(e) => handleChange('relationToCustomer', e.target.value)}
                  required
                  placeholder="e.g., Family member, Friend, Colleague"
                />
              </>
            )}
            
            <Input
              label="Delivery Date"
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => handleChange('deliveryDate', e.target.value)}
              required
            />
            
            <Input
              label="Delivery Time"
              type="time"
              value={formData.deliveryTime}
              onChange={(e) => handleChange('deliveryTime', e.target.value)}
              required
            />
            
            <Input
              label="Delivered By"
              value={formData.deliveredBy}
              onChange={(e) => handleChange('deliveredBy', e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Any special delivery notes or conditions..."
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="customerSignature"
              checked={formData.customerSignature}
              onChange={(e) => handleChange('customerSignature', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="customerSignature" className="text-sm text-gray-700">
              Customer/Recipient signature obtained
            </label>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Truck className="w-4 h-4 mr-2" />
              Mark as Delivered
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delivery Success Modal */}
      <Modal
        isOpen={showReceiptModal}
        onClose={() => {
          setShowReceiptModal(false);
          onClose();
        }}
        title="Device Delivered Successfully!"
        size="md"
      >
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full">
              <Truck className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Delivery Completed
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Device has been successfully delivered to {formData.recipientName}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Ticket: {ticket?.ticketNumber}</p>
              <p>Device: {ticket?.deviceBrand} {ticket?.deviceModel}</p>
              <p>Delivered to: {formData.recipientName}</p>
              <p>Date: {formatDateTime(new Date(`${formData.deliveryDate}T${formData.deliveryTime}`))}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={handlePrintDeliveryReceipt}
              variant="outline"
              className="flex-1"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Receipt
            </Button>
            <Button 
              onClick={() => {
                setShowReceiptModal(false);
                onClose();
              }}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}