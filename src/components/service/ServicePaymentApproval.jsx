import React, { useState } from 'react';
import { CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/helpers';

export function ServicePaymentApproval({ isOpen, onClose, payment, action, onSubmit }) {
  const [message, setMessage] = useState('');

  if (!payment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(payment.id, message);
    setMessage('');
  };

  const isApprove = action === 'approve';
  const isDecline = action === 'decline';

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`${isApprove ? 'Approve' : 'Decline'} Payment`} 
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Payment Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Receipt:</span>
              <span className="ml-2 font-medium">{payment.receiptNumber}</span>
            </div>
            <div>
              <span className="text-gray-600">Amount:</span>
              <span className="ml-2 font-medium text-green-600">{formatCurrency(payment.amount)}</span>
            </div>
            <div>
              <span className="text-gray-600">Type:</span>
              <span className="ml-2 font-medium capitalize">{payment.paymentType.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-gray-600">Method:</span>
              <span className="ml-2 font-medium capitalize">{payment.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Action Confirmation */}
        <div className={`p-4 rounded-lg border-2 ${
          isApprove 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {isApprove ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <h3 className={`font-medium ${
              isApprove ? 'text-green-900' : 'text-red-900'
            }`}>
              {isApprove ? 'Approve Payment' : 'Decline Payment'}
            </h3>
          </div>
          <p className={`text-sm ${
            isApprove ? 'text-green-700' : 'text-red-700'
          }`}>
            {isApprove 
              ? 'This payment will be marked as approved and processed.'
              : 'This payment will be marked as declined and rejected.'
            }
          </p>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MessageSquare size={16} className="inline mr-1" />
            Message {isDecline ? '(Required)' : '(Optional)'}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder={
              isApprove 
                ? 'Add approval message (optional)...' 
                : 'Please provide reason for decline...'
            }
            required={isDecline}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isDecline && !message.trim()}
            variant={isApprove ? 'success' : 'danger'}
          >
            {isApprove ? 'Approve Payment' : 'Decline Payment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}