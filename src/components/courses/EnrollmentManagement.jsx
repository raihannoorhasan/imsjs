import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';
import { EnrollmentList } from './EnrollmentList';
import { EnrollmentForm } from './EnrollmentForm';
import { PaymentForm } from './PaymentForm';

export function EnrollmentManagement() {
  const { enrollments, deleteEnrollment, addPayment } = useInventory();
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const handleMakePayment = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowPaymentForm(true);
  };

  const handleAddPayment = (paymentData) => {
    addPayment(paymentData);
    setShowPaymentForm(false);
    setSelectedEnrollment(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Enrollment Management</h2>
        <Button onClick={() => setShowEnrollmentForm(true)}>
          <Plus size={20} className="mr-2" />
          Enroll Student
        </Button>
      </div>

      <EnrollmentList
        enrollments={enrollments}
        onDelete={deleteEnrollment}
        onMakePayment={handleMakePayment}
      />

      <EnrollmentForm
        isOpen={showEnrollmentForm}
        onClose={() => setShowEnrollmentForm(false)}
      />

      <PaymentForm
        isOpen={showPaymentForm}
        onClose={() => {
          setShowPaymentForm(false);
          setSelectedEnrollment(null);
        }}
        onSubmit={handleAddPayment}
        preSelectedEnrollment={selectedEnrollment}
      />
    </div>
  );
}