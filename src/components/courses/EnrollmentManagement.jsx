import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus, Search, UserCheck, CreditCard } from 'lucide-react';
import { Button } from '../common/Button';
import { SearchInput } from '../common/SearchInput';
import { Select } from '../common/Select';
import { Card } from '../common/Card';
import { EnrollmentList } from './EnrollmentList';
import { EnrollmentForm } from './EnrollmentForm';
import { EnrollmentEditForm } from './EnrollmentEditForm';
import { PaymentForm } from './PaymentForm';

export function EnrollmentManagement() {
  const { enrollments, deleteEnrollment, addCoursePayment, updateEnrollment, students, courses, courseBatches } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const handleEdit = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowEditForm(true);
  };

  const handleUpdateEnrollment = (enrollmentData) => {
    updateEnrollment(selectedEnrollment.id, enrollmentData);
    setShowEditForm(false);
    setSelectedEnrollment(null);
  };

  const handleMakePayment = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowPaymentForm(true);
  };

  const handleAddPayment = (paymentData) => {
    addCoursePayment(paymentData);
    setShowPaymentForm(false);
    setSelectedEnrollment(null);
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const student = students.find(s => s.id === enrollment.studentId);
    const course = courses.find(c => c.id === enrollment.courseId);
    const batch = courseBatches.find(b => b.id === enrollment.batchId);
    
    const matchesSearch = 
      student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch?.batchName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Enrollment Management</h2>
            <p className="text-gray-600 mt-1">Track student enrollments and payment status</p>
          </div>
          <Button 
            onClick={() => setShowEnrollmentForm(true)}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <UserCheck size={20} className="mr-2" />
            Enroll Student
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
              placeholder="Search by student name, email, course, or batch..."
              className="w-full"
            />
          </div>
          <div className="sm:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
              <option value="suspended">Suspended</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Results Summary */}
      {(searchTerm || statusFilter !== 'all') && (
        <div className="text-sm text-gray-600 px-1">
          Found {filteredEnrollments.length} enrollment{filteredEnrollments.length !== 1 ? 's' : ''} 
          {searchTerm && ` matching "${searchTerm}"`}
          {statusFilter !== 'all' && ` with status "${statusFilter}"`}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border">
        <EnrollmentList
          enrollments={filteredEnrollments}
          onDelete={deleteEnrollment}
          onMakePayment={handleMakePayment}
          onEdit={handleEdit}
        />
      </div>

      <EnrollmentForm
        isOpen={showEnrollmentForm}
        onClose={() => setShowEnrollmentForm(false)}
      />

      <EnrollmentEditForm
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false);
          setSelectedEnrollment(null);
        }}
        enrollment={selectedEnrollment}
        onSubmit={handleUpdateEnrollment}
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