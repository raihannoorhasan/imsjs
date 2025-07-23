import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { 
  DollarSign, 
  Receipt, 
  User, 
  Calendar, 
  FileText, 
  Printer, 
  ArrowLeftRight, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Calculator,
  Info
} from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/helpers';

export function ServicePaymentView({ isOpen, onClose, payment }) {
  const { customers, serviceTickets, sales, products, servicePayments } = useInventory();
  const { isDark } = useTheme();

  if (!payment) return null;

  const customer = customers.find(c => c.id === payment.customerId);
  const ticket = serviceTickets.find(t => t.id === payment.serviceTicketId);
  const relatedSale = payment.relatedSaleId ? sales.find(s => s.id === payment.relatedSaleId) : null;
  
  // Get advance payment context for this ticket
  const getAdvancePaymentContext = () => {
    if (!ticket) return null;
    
    const advancePayments = servicePayments.filter(p => 
      p.serviceTicketId === ticket.id && 
      p.paymentType === 'advance_payment' && 
      p.status === 'approved'
    );
    
    const totalAdvance = advancePayments.reduce((sum, p) => sum + p.amount, 0);
    const totalServiceCost = ticket.laborCost + ticket.partsCost;
    const remainingBalance = totalServiceCost - totalAdvance;
    
    return {
      totalAdvance,
      totalServiceCost,
      remainingBalance,
      hasAdvance: totalAdvance > 0,
      needsRefund: remainingBalance < 0,
      refundAmount: remainingBalance < 0 ? Math.abs(remainingBalance) : 0,
      advancePayments
    };
  };

  const advanceContext = getAdvancePaymentContext();
  
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
            .refund-section { background: #fef2f2; border: 2px solid #ef4444; padding: 20px; text-align: center; margin: 30px 0; }
            .refund-value { font-size: 32px; font-weight: bold; color: #dc2626; }
            .advance-section { background: #eff6ff; border: 2px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 8px; }
            .calculation-section { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; margin: 20px 0; border-radius: 8px; }
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
          
          <div class="receipt-title">
            ${payment.paymentType === 'refund' ? 'REFUND RECEIPT' : 'PAYMENT RECEIPT'}
          </div>
          
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
          
          ${advanceContext && advanceContext.hasAdvance ? `
            <div class="advance-section">
              <h3 style="color: #1e40af; margin-bottom: 15px;">Advance Payment Context</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; text-align: center;">
                <div>
                  <div style="font-weight: bold; color: #1f2937;">Total Service Cost</div>
                  <div style="font-size: 18px; color: #059669;">${formatCurrency(advanceContext.totalServiceCost)}</div>
                </div>
                <div>
                  <div style="font-weight: bold; color: #1f2937;">Total Advance Paid</div>
                  <div style="font-size: 18px; color: #3b82f6;">${formatCurrency(advanceContext.totalAdvance)}</div>
                </div>
                <div>
                  <div style="font-weight: bold; color: #1f2937;">${advanceContext.remainingBalance >= 0 ? 'Remaining Balance' : 'Overpaid Amount'}</div>
                  <div style="font-size: 18px; color: ${advanceContext.remainingBalance >= 0 ? '#dc2626' : '#f59e0b'};">${formatCurrency(Math.abs(advanceContext.remainingBalance))}</div>
                </div>
              </div>
            </div>
          ` : ''}
          
          ${payment.paymentCalculation ? `
            <div class="calculation-section">
              <h3 style="color: #1f2937; margin-bottom: 15px;">Payment Calculation Breakdown</h3>
              <div style="background: white; padding: 15px; border-radius: 8px;">
                ${payment.paymentCalculation.breakdown.map(item => `
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; ${item.type === 'total' || item.type === 'refund' ? 'border-top: 1px solid #e5e7eb; margin-top: 8px; font-weight: bold;' : ''}">
                    <span style="color: ${item.type === 'credit' ? '#059669' : item.type === 'refund' ? '#dc2626' : '#374151'};">${item.label}:</span>
                    <span style="color: ${item.type === 'credit' ? '#059669' : item.type === 'refund' ? '#dc2626' : item.type === 'total' ? '#3b82f6' : '#1f2937'}; font-weight: ${item.type === 'total' || item.type === 'refund' ? 'bold' : 'normal'};">
                      ${item.amount < 0 ? '-' : ''}${formatCurrency(Math.abs(item.amount))}
                    </span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
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
          
          ${payment.paymentType === 'refund' ? `
            <div class="refund-section">
              <div class="amount-label">Refund Amount</div>
              <div class="refund-value">${formatCurrency(payment.amount)}</div>
            </div>
          ` : `
            <div class="amount-section">
              <div class="amount-label">${payment.paymentType === 'advance_payment' ? 'Advance Payment' : 'Amount Paid'}</div>
              <div class="amount-value">${formatCurrency(payment.amount)}</div>
            </div>
          `}
          
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
                ${payment.paymentType === 'refund' ? 'Refund processed successfully!' : 'Thank you for your payment!'}
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
              {payment.paymentType === 'refund' ? (
                <ArrowLeftRight className="w-6 h-6 text-red-600 dark:text-red-400" />
              ) : (
                <Receipt className="w-6 h-6 text-green-600 dark:text-green-400" />
              )}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{payment.receiptNumber}</h2>
            </div>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>Payment Date: {formatDate(payment.paymentDate)}</p>
              <p>Recorded: {formatDateTime(payment.createdAt)}</p>
              <p className="capitalize">Type: {payment.paymentType.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </span>
            <p className={`text-2xl font-bold mt-2 ${
              payment.paymentType === 'refund' 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-green-600 dark:text-green-400'
            }`}>
              {payment.paymentType === 'refund' ? '-' : ''}{formatCurrency(payment.amount)}
            </p>
          </div>
        </div>

        {/* Advance Payment Context - Only show if there are advance payments */}
        {advanceContext && advanceContext.hasAdvance && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200">Advance Payment Context</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Wrench className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                  <p className="text-sm text-blue-700 dark:text-blue-400">Total Service Cost</p>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(advanceContext.totalServiceCost)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <p className="text-sm text-blue-700 dark:text-blue-400">Total Advance Paid</p>
                </div>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(advanceContext.totalAdvance)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  {advanceContext.remainingBalance >= 0 ? (
                    <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                  ) : (
                    <ArrowLeftRight className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
                  )}
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    {advanceContext.remainingBalance >= 0 ? 'Remaining Balance' : 'Overpaid Amount'}
                  </p>
                </div>
                <p className={`text-xl font-bold ${
                  advanceContext.remainingBalance >= 0 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-orange-600 dark:text-orange-400'
                }`}>
                  {formatCurrency(Math.abs(advanceContext.remainingBalance))}
                </p>
              </div>
            </div>
            
            {/* Advance Payment History */}
            <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-3">Advance Payment History</h4>
              <div className="space-y-2">
                {advanceContext.advancePayments.map((advPayment) => (
                  <div key={advPayment.id} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-200">{advPayment.receiptNumber}</p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        {formatDate(advPayment.paymentDate)} • {advPayment.paymentMethod}
                      </p>
                    </div>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(advPayment.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Payment Calculation Display */}
        {payment.paymentCalculation && (
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-2 border-cyan-200 dark:border-cyan-800 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-lg font-semibold text-cyan-900 dark:text-cyan-200">Smart Payment Calculation</h3>
            </div>
            
            <p className="text-cyan-800 dark:text-cyan-200 mb-4">{payment.paymentCalculation.description}</p>
            
            <div className="bg-white dark:bg-gray-800 border border-cyan-200 dark:border-cyan-700 rounded-lg p-4">
              <div className="space-y-3">
                {payment.paymentCalculation.breakdown.map((item, index) => (
                  <div key={index} className={`flex items-center justify-between py-2 ${
                    item.type === 'total' || item.type === 'refund' ? 'border-t border-gray-200 dark:border-gray-600 pt-3 font-bold' : ''
                  }`}>
                    <span className={`${
                      item.type === 'credit' ? 'text-green-600 dark:text-green-400' :
                      item.type === 'refund' ? 'text-red-600 dark:text-red-400' :
                      'text-gray-700 dark:text-gray-300'
                    }`}>
                      {item.label}:
                    </span>
                    <span className={`font-medium ${
                      item.type === 'credit' ? 'text-green-600 dark:text-green-400' :
                      item.type === 'refund' ? 'text-red-600 dark:text-red-400' :
                      item.type === 'total' ? 'text-blue-600 dark:text-blue-400' :
                      'text-gray-900 dark:text-white'
                    }`}>
                      {item.amount < 0 ? '-' : ''}{formatCurrency(Math.abs(item.amount))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {payment.paymentCalculation.refundDue > 0 && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ArrowLeftRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <p className="text-red-800 dark:text-red-200 font-medium">Refund Processed</p>
                </div>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                  Customer received a refund of {formatCurrency(payment.paymentCalculation.refundDue)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Customer and Service Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
              Customer Information
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><span className="font-medium">Name:</span> {customer?.name || 'N/A'}</p>
              <p><span className="font-medium">Phone:</span> {customer?.phone || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {customer?.email || 'N/A'}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
              Service Information
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
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
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Related Sale Information
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
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
              <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Sale Total:</span>
                  <span>${relatedSale.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Special Payment Type Information */}
        {payment.paymentType === 'advance_payment' && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
              Advance Payment Information
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
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
                      <span className="ml-2 font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(Math.max(0, (ticket.laborCost + ticket.partsCost) - payment.amount))}
                      </span>
                    </p>
                  )}
                </>
              )}
            </div>
            {payment.status === 'approved' && (
              <div className="mt-3 p-3 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 rounded">
                <p className="text-emerald-800 dark:text-emerald-300 text-sm font-medium">
                  ✅ This advance payment has been applied to the service ticket
                </p>
              </div>
            )}
          </div>
        )}

        {payment.paymentType === 'refund' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <ArrowLeftRight className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
              Refund Information
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><span className="font-medium">Refund Amount:</span> 
                <span className="ml-2 font-bold text-red-600 dark:text-red-400">{formatCurrency(payment.amount)}</span>
              </p>
              <p><span className="font-medium">Reason:</span> Customer overpayment through advance payments</p>
              <p><span className="font-medium">Refund Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  payment.status === 'approved' ? 'bg-green-100 text-green-800' :
                  payment.status === 'declined' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </span>
              </p>
            </div>
            {payment.status === 'approved' && (
              <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded">
                <p className="text-red-800 dark:text-red-300 text-sm font-medium">
                  💰 Refund has been processed and should be returned to customer
                </p>
              </div>
            )}
          </div>
        )}

        {/* Payment Details */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
            Payment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <span className="font-medium">Amount:</span>
              <span className={`ml-2 font-bold ${
                payment.paymentType === 'refund' 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-green-600 dark:text-green-400'
              }`}>
                {payment.paymentType === 'refund' ? '-' : ''}{formatCurrency(payment.amount)}
              </span>
            </div>
            <div>
              <span className="font-medium">Method:</span>
              <span className="ml-2 capitalize">{payment.paymentMethod}</span>
            </div>
            <div>
              <span className="font-medium">Received By:</span>
              <span className="ml-2">{payment.receivedBy}</span>
            </div>
            <div>
              <span className="font-medium">Date:</span>
              <span className="ml-2">{formatDate(payment.paymentDate)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {payment.notes && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Payment Notes</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{payment.notes}</p>
          </div>
        )}

        {/* Admin Message */}
        {payment.adminMessage && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Admin Message</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{payment.adminMessage}</p>
            {payment.approvedBy && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                By {payment.approvedBy} on {formatDateTime(payment.approvedAt)}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
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