import React from 'react';
import { formatCurrency, formatDate } from '../../utils/helpers';

export function PaymentVoucher({ payment, student, course, batch, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a new window with the voucher content
    const printWindow = window.open('', '_blank');
    
    // Check if popup was blocked
    if (!printWindow) {
      alert('Pop-up blocker is preventing the download. Please disable pop-up blocker for this site and try again.');
      return;
    }
    
    const voucherContent = document.getElementById('voucher-content').innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Voucher - ${payment.voucherNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .voucher { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 28px; font-weight: bold; color: #1e40af; margin-bottom: 5px; }
            .company-tagline { color: #6b7280; font-size: 14px; }
            .voucher-title { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 15px; text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; }
            .voucher-number { background: #f3f4f6; padding: 10px; text-align: center; font-weight: bold; color: #374151; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
            .detail-section h3 { color: #1f2937; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
            .detail-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
            .detail-label { font-weight: 600; color: #4b5563; }
            .detail-value { color: #1f2937; }
            .amount-section { background: #f8fafc; border: 2px solid #e2e8f0; padding: 20px; text-align: center; margin: 30px 0; }
            .amount-label { font-size: 18px; color: #4b5563; margin-bottom: 10px; }
            .amount-value { font-size: 32px; font-weight: bold; color: #059669; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; }
            .signature-section { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; margin-top: 40px; }
            .signature-box { text-align: center; }
            .signature-line { border-top: 2px solid #374151; margin-top: 50px; padding-top: 10px; font-weight: 600; }
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; text-transform: uppercase; font-size: 12px; }
            .status-approved { background: #dcfce7; color: #166534; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-declined { background: #fee2e2; color: #991b1b; }
            @media print { body { margin: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          ${voucherContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'declined':
        return 'status-declined';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Action Buttons */}
        <div className="no-print flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Payment Voucher</h2>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Print
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Download
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Voucher Content */}
        <div id="voucher-content" className="p-8">
          <div className="voucher">
            {/* Header */}
            <div className="header">
              <div className="company-name">Hi Tech Computer</div>
              <div className="company-tagline">Professional Computer Training Institute</div>
              <div style={{ marginTop: '10px', color: '#6b7280', fontSize: '14px' }}>
                📍 123 Tech Street, Silicon Valley | 📞 +1-555-0123 | ✉️ info@hitechcomputer.com
              </div>
            </div>

            {/* Voucher Title */}
            <div className="voucher-title">
              PAYMENT VOUCHER
            </div>

            {/* Voucher Number and Status */}
            <div className="voucher-number">
              Voucher No: {payment.voucherNumber}
              <span className={`status-badge ${getStatusBadgeClass(payment.status)} ml-4`}>
                {payment.status || 'pending'}
              </span>
            </div>

            {/* Details Grid */}
            <div className="details-grid">
              {/* Student Information */}
              <div className="detail-section">
                <h3>Student Information</h3>
                <div className="detail-item">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{student?.name || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{student?.email || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{student?.phone || 'N/A'}</span>
                </div>
              </div>

              {/* Course Information */}
              <div className="detail-section">
                <h3>Course Information</h3>
                <div className="detail-item">
                  <span className="detail-label">Course:</span>
                  <span className="detail-value">{course?.name || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Batch:</span>
                  <span className="detail-value">{batch?.batchName || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{course?.duration || 0} hours</span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="detail-section">
              <h3>Payment Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="detail-item">
                  <span className="detail-label">Payment Type:</span>
                  <span className="detail-value" style={{ textTransform: 'capitalize' }}>
                    {payment.paymentType?.replace('_', ' ') || 'N/A'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Payment Method:</span>
                  <span className="detail-value" style={{ textTransform: 'capitalize' }}>
                    {payment.paymentMethod || 'N/A'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Payment Date:</span>
                  <span className="detail-value">{formatDate(payment.paymentDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Received By:</span>
                  <span className="detail-value">{payment.receivedBy || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Amount Section */}
            <div className="amount-section">
              <div className="amount-label">Amount Paid</div>
              <div className="amount-value">{formatCurrency(payment.amount)}</div>
            </div>

            {/* Notes */}
            {payment.notes && (
              <div className="detail-section">
                <h3>Notes</h3>
                <div style={{ padding: '15px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  {payment.notes}
                </div>
              </div>
            )}

            {/* Admin Message */}
            {payment.adminMessage && (
              <div className="detail-section">
                <h3>Admin Message</h3>
                <div style={{ padding: '15px', background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '8px' }}>
                  {payment.adminMessage}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="footer">
              <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
                This is a computer-generated voucher and does not require a signature.
              </div>
              
              <div className="signature-section">
                <div className="signature-box">
                  <div className="signature-line">Student Signature</div>
                </div>
                <div className="signature-box">
                  <div className="signature-line">Authorized Signature</div>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '30px', padding: '15px', background: '#f3f4f6', borderRadius: '8px' }}>
                <div style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>
                  Thank you for choosing Hi Tech Computer!
                </div>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>
                  Generated on {formatDate(new Date())} | Voucher ID: {payment.voucherNumber}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}