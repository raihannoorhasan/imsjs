import React, { useState } from 'react';
import { CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export function PaymentApprovalModal({ isOpen, onClose, payment, onApprove, onDecline }) {
  const [action, setAction] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (action === 'approve') {
      onApprove(payment.id, message);
    } else if (action === 'decline') {
      onDecline(payment.id, message);
    }
    setAction('');
    setMessage('');
    onClose();
  };

  const handleActionSelect = (selectedAction) => {
    setAction(selectedAction);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment Approval" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Payment Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Voucher:</span>
              <span className="ml-2 font-medium">{payment.voucherNumber}</span>
            </div>
            <div>
              <span className="text-gray-600">Amount:</span>
              <span className="ml-2 font-medium text-green-600">${payment.amount}</span>
            </div>
            <div>
              <span className="text-gray-600">Type:</span>
              <span className="ml-2 font-medium capitalize">{payment.paymentType}</span>
            </div>
            <div>
              <span className="text-gray-600">Method:</span>
              <span className="ml-2 font-medium capitalize">{payment.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Action Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Action</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleActionSelect('approve')}
              className={`flex items-center justify-center space-x-2 p-3 border-2 rounded-lg transition-colors ${
                action === 'approve'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-green-300'
              }`}
            >
              <CheckCircle size={20} />
              <span>Approve</span>
            </button>
            <button
              type="button"
              onClick={() => handleActionSelect('decline')}
              className={`flex items-center justify-center space-x-2 p-3 border-2 rounded-lg transition-colors ${
                action === 'decline'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-red-300'
              }`}
            >
              <XCircle size={20} />
              <span>Decline</span>
            </button>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MessageSquare size={16} className="inline mr-1" />
            Message {action === 'decline' ? '(Required)' : '(Optional)'}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder={
              action === 'approve' 
                ? 'Add approval message (optional)...' 
                : action === 'decline'
                ? 'Please provide reason for decline...'
                : 'Select an action first...'
            }
            required={action === 'decline'}
            disabled={!action}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!action || (action === 'decline' && !message.trim())}
            variant={action === 'approve' ? 'success' : action === 'decline' ? 'danger' : 'primary'}
          >
            {action === 'approve' ? 'Approve Payment' : action === 'decline' ? 'Decline Payment' : 'Select Action'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}