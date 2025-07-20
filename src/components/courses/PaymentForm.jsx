import React, { useState, useEffect } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { generateId } from '../../utils/helpers';

export function PaymentForm({ isOpen, onClose, onSubmit, preSelectedEnrollment }) {
  const { students, enrollments, courses, courseBatches } = useInventory();
  const [formData, setFormData] = useState({
    studentId: '',
    enrollmentId: '',
    paymentType: 'enrollment',
    amount: 0,
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    receivedBy: 'Admin',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Set pre-selected enrollment data when component opens
  useEffect(() => {
    if (preSelectedEnrollment && isOpen) {
      const student = students.find(s => s.id === preSelectedEnrollment.studentId);
      setFormData(prev => ({
        ...prev,
        studentId: preSelectedEnrollment.studentId,
        enrollmentId: preSelectedEnrollment.id,
        paymentType: 'enrollment'
      }));
      
      // Calculate remaining amount for enrollment payment
      const remainingAmount = preSelectedEnrollment.remainingAmount || 0;
      setFormData(prev => ({ ...prev, amount: remainingAmount }));
    } else if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        studentId: '',
        enrollmentId: '',
        paymentType: 'enrollment',
        amount: 0,
        paymentMethod: 'cash',
        paymentDate: new Date().toISOString().split('T')[0],
        receivedBy: 'Admin',
        notes: ''
      });
    }
  }, [preSelectedEnrollment, isOpen, students]);

  const studentEnrollments = enrollments.filter(e => e.studentId === formData.studentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const enrollment = enrollments.find(e => e.id === formData.enrollmentId);
    const course = enrollment ? courses.find(c => c.id === enrollment.courseId) : null;
    
    if (!enrollment || !course) {
      setError('Invalid enrollment or course data.');
      return;
    }
    
    const paymentAmount = parseFloat(formData.amount);
    let maxAmount = 0;
    let alreadyPaid = 0;
    
    // Calculate max amount and already paid based on payment type
    switch (formData.paymentType) {
      case 'admission':
        maxAmount = course.admissionFee;
        alreadyPaid = enrollment.admissionFeeAmount || 0;
        break;
      case 'registration':
        maxAmount = course.registrationFee;
        alreadyPaid = enrollment.registrationFeeAmount || 0;
        break;
      case 'exam':
        maxAmount = course.examFee;
        alreadyPaid = enrollment.examFeeAmount || 0;
        break;
      case 'enrollment':
        maxAmount = enrollment.remainingAmount;
        alreadyPaid = 0; // For enrollment, we check remaining amount directly
        break;
    }
    
    const remainingAmount = maxAmount - alreadyPaid;
    
    // Check if fee is already fully paid
    if (remainingAmount <= 0 && formData.paymentType !== 'enrollment') {
      setSuccess(`🎉 Awesome! The ${formData.paymentType} fee is already fully paid!`);
      return;
    }
    
    // Check if payment amount exceeds remaining amount
    if (paymentAmount > remainingAmount) {
      setError(`Payment amount cannot exceed the remaining ${formData.paymentType} fee of $${remainingAmount.toFixed(2)}.`);
      return;
    }
    
    // Check if payment amount is valid
    if (paymentAmount <= 0) {
      setError('Payment amount must be greater than 0.');
      return;
    }
    
    const voucherNumber = `PV-${generateId()}`;
    
    onSubmit({
      ...formData,
      voucherNumber,
      paymentDate: new Date(formData.paymentDate),
      amount: parseFloat(formData.amount),
      status: 'pending',
      createdAt: new Date()
    });
    
    setFormData({
      studentId: '',
      enrollmentId: '',
      paymentType: 'enrollment',
      amount: 0,
      paymentMethod: 'cash',
      paymentDate: new Date().toISOString().split('T')[0],
      receivedBy: 'Admin',
      notes: ''
    });
    setError('');
    setSuccess('');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'studentId') {
      setFormData(prev => ({ ...prev, enrollmentId: '' }));
    }
    
    if (field === 'enrollmentId' || field === 'paymentType') {
      const enrollmentId = field === 'enrollmentId' ? value : formData.enrollmentId;
      const paymentType = field === 'paymentType' ? value : formData.paymentType;
      
      const enrollment = enrollments.find(e => e.id === enrollmentId);
      const course = enrollment ? courses.find(c => c.id === enrollment.courseId) : null;
      
      if (course) {
        let amount = 0;
        switch (paymentType) {
          case 'admission':
            amount = Math.max(0, course.admissionFee - (enrollment.admissionFeeAmount || 0));
            break;
          case 'registration':
            amount = Math.max(0, course.registrationFee - (enrollment.registrationFeeAmount || 0));
            break;
          case 'exam':
            amount = Math.max(0, course.examFee - (enrollment.examFeeAmount || 0));
            break;
          case 'enrollment':
            amount = enrollment ? enrollment.remainingAmount : course.price;
            break;
          default:
            amount = 0;
        }
        setFormData(prev => ({ ...prev, amount }));
      }
    }
  };

  const getEnrollmentDisplay = (enrollment) => {
    const course = courses.find(c => c.id === enrollment.courseId);
    const batch = courseBatches.find(b => b.id === enrollment.batchId);
    return `${course?.name || 'Unknown'} - ${batch?.batchName || 'Unknown'}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Payment" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
          </div>
        )}
        
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
        </div>
        
        <Input
          label="Received By"
          value={formData.receivedBy}
          onChange={(e) => handleChange('receivedBy', e.target.value)}
          required
        />
        
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
            Record Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
}