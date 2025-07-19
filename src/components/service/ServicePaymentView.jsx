import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { DollarSign, Receipt, User, Calendar, FileText, Printer } from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/helpers';

export function ServicePaymentView({ isOpen, onClose, payment }) {
  const { customers, serviceTickets, sales, products } = useInventory();

  if (!payment) return null;

  const customer = customers.find(c => c.id === payment.customerId);
  const ticket = serviceTickets.find(t => t.id === payment.serviceTicketId);
  const relatedSale = payment.relatedSaleId ? sales.find(s => s.id === payment.relatedSaleId) : null;
  
  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const handlePrintReceipt = () => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Receipt - ${payment.receiptNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 28px; font-weight: bold; color: #059669; margin-bottom: 5px; }
            .receipt-title { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 15px; text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; }
            .receipt-number { background: #f3f4f6; padding: 10px; text-align: center; font-weight: bold; color: #374151; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
            .detail-section h3 { color: #1f2937; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
            .detail-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
            .detail-label { font-weight: 600; color: #4b5563; }
            .detail-value { color: #1f2937; }
            .amount-section { background: #f0fdf4; border: 2px solid #10b981; padding: 20px; text-align: center; margin: 30px 0; }
            .amount-label { font-size: 18px; color: #4b5563; margin-bottom: 10px; }
            .amount-value { font-size: 32px; font-weight: bold; color: #059669; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; }
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; text-transform: uppercase; font-size: 12px; }
            .status-approved { background: #dcfce7; color: #166534; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-declined { background: #fee2e2; color: #991b1b; }
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
          
          <div class="receipt-title">PAYMENT RECEIPT</div>
          
          <div class="receipt-number">
            Receipt No: ${payment.receiptNumber}
            <span class="status-badge status-${payment.status}" style="margin-left: 20px;">
              ${payment.status}
            </span>
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
              <h3>Service Information</h3>
              <div class="detail-item">
                <span class="detail-label">Ticket:</span>
                <span class="detail-value">${ticket?.ticketNumber || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Device:</span>
                <span class="detail-value">${ticket?.deviceBrand || ''} ${ticket?.deviceModel || ''}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Service Type:</span>
                <span class="detail-value" style="text-transform: capitalize;">${payment.paymentType.replace('_', ' ')}</span>
              </div>
              ${payment.relatedSaleId ? `
                <div class="detail-item">
                  <span class="detail-label">Related Sale:</span>
                  <span class="detail-value">#${payment.relatedSaleId.slice(-6)}</span>
                </div>
              ` : ''}
            </div>
          </div>
          
          ${relatedSale ? `
            <div class="detail-section">
              <h3>Related Sale Details</h3>
              <div style="background: #f3e8ff; border: 1px solid #a855f7; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <div class="detail-item">
                  <span class="detail-label">Sale ID:</span>
                  <span class="detail-value">#${relatedSale.id.slice(-6)}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Sale Date:</span>
                  <span class="detail-value">${formatDate(relatedSale.createdAt)}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Items:</span>
                  <span class="detail-value">${relatedSale.items.length} item(s)</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Sale Total:</span>
                  <span class="detail-value">$${relatedSale.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ` : ''}
          
          <div class="detail-section">
            <h3>Payment Details</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div class="detail-item">
                <span class="detail-label">Payment Method:</span>
                <span class="detail-value" style="text-transform: capitalize;">${payment.paymentMethod}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Payment Date:</span>
                <span class="detail-value">${formatDate(payment.paymentDate)}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Received By:</span>
                <span class="detail-value">${payment.receivedBy}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Receipt Date:</span>
                <span class="detail-value">${formatDate(payment.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <div class="amount-section">
            <div class="amount-label">Amount Paid</div>
            <div class="amount-value">${formatCurrency(payment.amount)}</div>
          </div>
          
          ${payment.notes ? `
            <div class="detail-section">
              <h3>Notes</h3>
              <div style="padding: 15px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                ${payment.notes}
              </div>
            </div>
          ` : ''}
          
          ${payment.adminMessage ? `
            <div class="detail-section">
              <h3>Admin Message</h3>
              <div style="padding: 15px; background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px;">
                ${payment.adminMessage}
              </div>
            </div>
          ` : ''}
          
          <div class="footer">
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <div style="font-weight: bold; color: #1f2937; margin-bottom: 5px;">
                Thank you for your payment!
              </div>
              <div style="color: #6b7280; font-size: 12px;">
                Generated on ${formatDateTime(new Date())} | Receipt ID: ${payment.receiptNumber}
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment Details" size="xl">
      <div className="space-y-6">
        {/* Payment Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Receipt className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">{payment.receiptNumber}</h2>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Payment Date: {formatDate(payment.paymentDate)}</p>
              <p>Recorded: {formatDateTime(payment.createdAt)}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </span>
            <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(payment.amount)}</p>
          </div>
        </div>

        {/* Customer and Service Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Customer Information
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {customer?.name || 'N/A'}</p>
              <p><span className="font-medium">Phone:</span> {customer?.phone || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {customer?.email || 'N/A'}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Service Information
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Ticket:</span> {ticket?.ticketNumber || 'N/A'}</p>
              <p><span className="font-medium">Device:</span> {ticket?.deviceBrand} {ticket?.deviceModel}</p>
              <p><span className="font-medium">Payment Type:</span> {payment.paymentType.replace('_', ' ')}</p>
              {relatedSale && (
                <p><span className="font-medium">Related Sale:</span> #{relatedSale.id.slice(-6)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Related Sale Details */}
        {relatedSale && (
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Related Sale Information
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Sale ID:</span> #{relatedSale.id.slice(-6)}</p>
              <p><span className="font-medium">Sale Date:</span> {formatDate(relatedSale.createdAt)}</p>
              <p><span className="font-medium">Items:</span></p>
              <div className="ml-4 space-y-1">
                {relatedSale.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{getProductName(item.productId)} (x{item.quantity})</span>
                    <span>${item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Sale Total:</span>
                  <span>${relatedSale.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {payment.paymentType === 'advance_payment' && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
              Advance Payment Information
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Advance Amount:</span> {formatCurrency(payment.amount)}</p>
              <p><span className="font-medium">Payment Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  payment.status === 'approved' ? 'bg-green-100 text-green-800' :
                  payment.status === 'declined' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </span>
              </p>
              {ticket && (
                <>
                  <p><span className="font-medium">Total Service Cost:</span> {formatCurrency(ticket.laborCost + ticket.partsCost)}</p>
                  {payment.status === 'approved' && (
                    <p><span className="font-medium">Remaining Balance:</span> 
                      <span className="ml-2 font-bold text-red-600">
                        {formatCurrency(Math.max(0, (ticket.laborCost + ticket.partsCost) - payment.amount))}
                      </span>
                    </p>
                  )}
                </>
              )}
            </div>
            {payment.status === 'approved' && (
              <div className="mt-3 p-3 bg-emerald-100 border border-emerald-300 rounded">
                <p className="text-emerald-800 text-sm font-medium">
                  ✅ This advance payment has been applied to the service ticket
                </p>
              </div>
            )}
          </div>
        )}

        {/* Payment Details */}
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Payment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Amount:</span>
              <span className="ml-2 text-green-600 font-bold">{formatCurrency(payment.amount)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Method:</span>
              <span className="ml-2 capitalize">{payment.paymentMethod}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Received By:</span>
              <span className="ml-2">{payment.receivedBy}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Date:</span>
              <span className="ml-2">{formatDate(payment.paymentDate)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {payment.notes && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Payment Notes</h3>
            <p className="text-sm text-gray-700">{payment.notes}</p>
          </div>
        )}

        {/* Admin Message */}
        {payment.adminMessage && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Admin Message</h3>
            <p className="text-sm text-gray-700">{payment.adminMessage}</p>
            {payment.approvedBy && (
              <p className="text-xs text-gray-500 mt-2">
                By {payment.approvedBy} on {formatDateTime(payment.approvedAt)}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button variant="outline" onClick={handlePrintReceipt}>
            <Printer className="w-4 h-4 mr-2" />
            Print Receipt
          </Button>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}