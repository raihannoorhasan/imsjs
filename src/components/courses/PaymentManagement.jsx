import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, DollarSign, Search, Filter } from 'lucide-react';
import { Button } from '../common/Button';
import { SearchInput } from '../common/SearchInput';
import { Select } from '../common/Select';
import { Card } from '../common/Card';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('all');
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

  const filteredPayments = coursePayments.filter(payment => {
    const { student, course, batch } = getPaymentDetails(payment);
    
    const matchesSearch = 
      student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch?.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesType = paymentTypeFilter === 'all' || payment.paymentType === paymentTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
            <p className="text-gray-600 mt-1">Track and manage course payments and vouchers</p>
          </div>
          <Button 
            onClick={() => setShowPaymentForm(true)}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <DollarSign size={20} className="mr-2" />
            Record Payment
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
              placeholder="Search payments..."
              className="w-full"
            />
          </div>
          <div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </Select>
          </div>
          <div>
            <Select
              value={paymentTypeFilter}
              onChange={(e) => setPaymentTypeFilter(e.target.value)}
              className="w-full"
            >
              <option value="all">All Types</option>
              <option value="enrollment">Course Fee</option>
              <option value="admission">Admission Fee</option>
              <option value="registration">Registration Fee</option>
              <option value="exam">Exam Fee</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Results Summary */}
      {(searchTerm || statusFilter !== 'all' || paymentTypeFilter !== 'all') && (
        <div className="text-sm text-gray-600 px-1">
          Found {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''} 
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border">
        <PaymentList 
          payments={filteredPayments}
          onViewVoucher={handleViewVoucher}
          onEditPayment={handleEditPayment}
          onApprovePayment={handleApprovePayment}
          onDeclinePayment={handleDeclinePayment}
        />
      </div>

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