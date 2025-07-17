import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, DollarSign } from 'lucide-react';
import { Button } from '../common/Button';
import { PaymentList } from './PaymentList';
import { PaymentForm } from './PaymentForm';
import { PaymentVoucher } from './PaymentVoucher';
import { PaymentApprovalModal } from './PaymentApprovalModal';
import { PaymentEditModal } from './PaymentEditModal';

export function PaymentManagement() {
  const { 
    coursePayments, 
    addCoursePayment, 
    updateCoursePayment,
    students, 
    enrollments, 
    courses, 
    courseBatches 
  } = useInventory();
  const { currentUser } = useAuth();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [approvalAction, setApprovalAction] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  const handleAddPayment = (paymentData) => {
    addCoursePayment(paymentData);
    setShowPaymentForm(false);
  };

  const handleViewVoucher = (payment) => {
    setSelectedPayment(payment);
    setShowVoucher(true);
  };

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment);
    setShowEditModal(true);
  };

  const handleUpdatePayment = (paymentData) => {
    updateCoursePayment(selectedPayment.id, paymentData);
    setShowEditModal(false);
    setSelectedPayment(null);
  };

  const handleApprovePayment = (payment) => {
    setSelectedPayment(payment);
    setApprovalAction('approve');
    setShowApprovalModal(true);
  };

  const handleDeclinePayment = (payment) => {
    setSelectedPayment(payment);
    setApprovalAction('decline');
    setShowApprovalModal(true);
  };

  const handleApprovalSubmit = (paymentId, message) => {
    const updateData = {
      status: approvalAction === 'approve' ? 'approved' : 'declined',
      adminMessage: message,
      approvedBy: currentUser?.name,
      approvedAt: new Date()
    };
    
    updateCoursePayment(paymentId, updateData);
    setShowApprovalModal(false);
    setSelectedPayment(null);
    setApprovalAction('');
  };

  const getPaymentDetails = (payment) => {
    const student = students.find(s => s.id === payment.studentId);
    const enrollment = payment.enrollmentId ? enrollments.find(e => e.id === payment.enrollmentId) : null;
    const course = enrollment ? courses.find(c => c.id === enrollment.courseId) : null;
    const batch = enrollment ? courseBatches.find(b => b.id === enrollment.batchId) : null;
    
    return { student, enrollment, course, batch };
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

      <PaymentList 
        payments={coursePayments}
        onViewVoucher={handleViewVoucher}
        onEditPayment={handleEditPayment}
        onApprovePayment={handleApprovePayment}
        onDeclinePayment={handleDeclinePayment}
      />

      <PaymentForm
        isOpen={showPaymentForm}
        onClose={() => setShowPaymentForm(false)}
        onSubmit={handleAddPayment}
      />

      {showVoucher && selectedPayment && (
        <PaymentVoucher
          payment={selectedPayment}
          {...getPaymentDetails(selectedPayment)}
          onClose={() => {
            setShowVoucher(false);
            setSelectedPayment(null);
          }}
        />
      )}

      {isAdmin && (
        <>
          <PaymentApprovalModal
            isOpen={showApprovalModal}
            onClose={() => {
              setShowApprovalModal(false);
              setSelectedPayment(null);
              setApprovalAction('');
            }}
            payment={selectedPayment}
            onApprove={(paymentId, message) => handleApprovalSubmit(paymentId, message)}
            onDecline={(paymentId, message) => handleApprovalSubmit(paymentId, message)}
          />

          <PaymentEditModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedPayment(null);
            }}
            payment={selectedPayment}
            onSubmit={handleUpdatePayment}
          />
        </>
      )}
    </div>
  );
}