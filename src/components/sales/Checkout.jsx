import React from 'react';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export function Checkout({
  customers,
  selectedCustomer,
  onCustomerChange,
  paymentMethod,
  onPaymentMethodChange,
  discount,
  onDiscountChange,
  subtotal,
  tax,
  total,
  onSale,
  onShowCustomerForm
}) {
  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: Banknote },
    { id: 'card', label: 'Card', icon: CreditCard },
    { id: 'transfer', label: 'Transfer', icon: Smartphone }
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Checkout</h3>
      
      {/* Customer Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
        <div className="flex space-x-2">
          <select
            value={selectedCustomer}
            onChange={(e) => onCustomerChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
          <Button size="sm" onClick={onShowCustomerForm}>
            New
          </Button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
        <div className="grid grid-cols-3 gap-2">
          {paymentMethods.map(method => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => onPaymentMethodChange(method.id)}
                className={`flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm ${
                  paymentMethod === method.id 
                    ? 'bg-blue-100 text-blue-700 border-blue-300' 
                    : 'bg-gray-100 text-gray-700'
                } border`}
              >
                <Icon size={16} />
                <span>{method.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Discount */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Discount ($)</label>
        <input
          type="number"
          step="0.01"
          value={discount}
          onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Total */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax (10%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount:</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Button
        onClick={onSale}
        disabled={!selectedCustomer}
        variant="success"
        className="w-full mt-4"
      >
        Complete Sale
      </Button>
    </Card>
  );
}