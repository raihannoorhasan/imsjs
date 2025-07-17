import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus, DollarSign } from 'lucide-react';
import { Button } from '../common/Button';
import { PaymentList } from './PaymentList';
import { PaymentForm } from './PaymentForm';

export function PaymentManagement() {
  const { coursePayments, addCoursePayment } = useInventory();
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleAddPayment = (paymentData) => {
    addCoursePayment(paymentData);
    setShowPaymentForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Payment Management</h2>
        <Button onClick={() => setShowPaymentForm(true)}>
          <Plus size={20} className="mr-2" />
          Record Payment
        </Button>
      </div>

      <PaymentList payments={coursePayments} />

      <PaymentForm
        isOpen={showPaymentForm}
        onClose={() => setShowPaymentForm(false)}
        onSubmit={handleAddPayment}
      />
    </div>
  );
}