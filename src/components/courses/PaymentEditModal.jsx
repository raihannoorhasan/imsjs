import React, { useState, useEffect } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export function PaymentEditModal({ isOpen, onClose, payment, onSubmit }) {
  const { students, enrollments, courses, courseBatches } = useInventory();
  const [formData, setFormData] = useState({
    studentId: '',
    enrollmentId: '',
    paymentType: 'enrollment',
    amount: 0,
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    receivedBy: 'Admin',
    notes: '',
    status: 'pending'
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        studentId: payment.studentId || '',
        enrollmentId: payment.enrollmentId || '',
        paymentType: payment.paymentType || 'enrollment',
        amount: payment.amount || 0,
        paymentMethod: payment.paymentMethod || 'cash',
        paymentDate: payment.paymentDate ? new Date(payment.paymentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        receivedBy: payment.receivedBy || 'Admin',
        notes: payment.notes || '',
        status: payment.status || 'pending'
      });
    }
  }, [payment]);

  const studentEnrollments = enrollments.filter(e => e.studentId === formData.studentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      paymentDate: new Date(formData.paymentDate),
      amount: parseFloat(formData.amount)
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'studentId') {
      setFormData(prev => ({ ...prev, enrollmentId: '' }));
    }
  };

  const getEnrollmentDisplay = (enrollment) => {
    const course = courses.find(c => c.id === enrollment.courseId);
    const batch = courseBatches.find(b => b.id === enrollment.batchId);
    return `${course?.name || 'Unknown'} - ${batch?.batchName || 'Unknown'}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Payment" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Student"
            value={formData.studentId}
            onChange={(e) => handleChange('studentId', e.target.value)}
            required
          >
            <option value="">Select Student</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>{student.name}</option>
            ))}
          </Select>
          
          <Select
            label="Enrollment"
            value={formData.enrollmentId}
            onChange={(e) => handleChange('enrollmentId', e.target.value)}
            required
            disabled={!formData.studentId}
          >
            <option value="">Select Enrollment</option>
            {studentEnrollments.map(enrollment => (
              <option key={enrollment.id} value={enrollment.id}>
                {getEnrollmentDisplay(enrollment)}
              </option>
            ))}
          </Select>
          
          <Select
            label="Payment Type"
            value={formData.paymentType}
            onChange={(e) => handleChange('paymentType', e.target.value)}
          >
            <option value="enrollment">Course Fee</option>
            <option value="admission">Admission Fee</option>
            <option value="registration">Registration Fee</option>
            <option value="exam">Exam Fee</option>
          </Select>
          
          <Input
            label="Amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            required
          />
          
          <Select
            label="Payment Method"
            value={formData.paymentMethod}
            onChange={(e) => handleChange('paymentMethod', e.target.value)}
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="transfer">Bank Transfer</option>
          </Select>
          
          <Input
            label="Payment Date"
            type="date"
            value={formData.paymentDate}
            onChange={(e) => handleChange('paymentDate', e.target.value)}
            required
          />

          <Input
            label="Received By"
            value={formData.receivedBy}
            onChange={(e) => handleChange('receivedBy', e.target.value)}
            required
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
            rows={3}
          />
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Update Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
}