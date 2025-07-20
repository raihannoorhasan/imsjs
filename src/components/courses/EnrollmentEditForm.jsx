import React, { useState, useEffect } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export function EnrollmentEditForm({ isOpen, onClose, enrollment, onSubmit }) {
  const { students, courses, courseBatches } = useInventory();
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    batchId: '',
    totalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    status: 'active'
  });

  useEffect(() => {
    if (enrollment) {
      setFormData({
        studentId: enrollment.studentId,
        courseId: enrollment.courseId,
        batchId: enrollment.batchId,
        totalAmount: enrollment.totalAmount,
        paidAmount: enrollment.paidAmount,
        remainingAmount: enrollment.remainingAmount,
        status: enrollment.status
      });
    }
  }, [enrollment]);

  const availableBatches = courseBatches.filter(batch => 
    batch.courseId === formData.courseId && batch.status !== 'completed'
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const course = courses.find(c => c.id === formData.courseId);
    if (course) {
      const updatedData = {
        ...formData,
        totalAmount: parseFloat(formData.totalAmount),
        paidAmount: parseFloat(formData.paidAmount),
        remainingAmount: parseFloat(formData.totalAmount) - parseFloat(formData.paidAmount)
      };
      
      onSubmit(updatedData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'courseId') {
      setFormData(prev => ({ ...prev, batchId: '' }));
      const course = courses.find(c => c.id === value);
      if (course) {
        setFormData(prev => ({ 
          ...prev, 
          totalAmount: course.price,
          remainingAmount: course.price - prev.paidAmount
        }));
      }
    }
    
    if (field === 'totalAmount' || field === 'paidAmount') {
      const total = field === 'totalAmount' ? parseFloat(value) : formData.totalAmount;
      const paid = field === 'paidAmount' ? parseFloat(value) : formData.paidAmount;
      setFormData(prev => ({ 
        ...prev, 
        remainingAmount: total - paid
      }));
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  };

  const getBatchName = (batchId) => {
    const batch = courseBatches.find(b => b.id === batchId);
    return batch ? batch.batchName : 'Unknown Batch';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Enrollment" size="lg">
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
            label="Course"
            value={formData.courseId}
            onChange={(e) => handleChange('courseId', e.target.value)}
            required
          >
            <option value="">Select Course</option>
            {courses.filter(c => c.status === 'active').map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </Select>
          
          <Select
            label="Batch"
            value={formData.batchId}
            onChange={(e) => handleChange('batchId', e.target.value)}
            required
            disabled={!formData.courseId}
          >
            <option value="">Select Batch</option>
            {availableBatches.map(batch => (
              <option key={batch.id} value={batch.id}>
                {batch.batchName} ({batch.currentStudents}/{batch.maxStudents})
              </option>
            ))}
          </Select>
          
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
            <option value="suspended">Suspended</option>
          </Select>
          
          <Input
            label="Total Amount"
            type="number"
            step="0.01"
            value={formData.totalAmount}
            onChange={(e) => handleChange('totalAmount', e.target.value)}
            required
          />
          
          <Input
            label="Paid Amount"
            type="number"
            step="0.01"
            value={formData.paidAmount}
            onChange={(e) => handleChange('paidAmount', e.target.value)}
            required
          />
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Calculated Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Remaining Amount:</span>
              <span className="ml-2 font-medium text-red-600 dark:text-red-400">
                ${formData.remainingAmount.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Payment Progress:</span>
              <span className="ml-2 font-medium text-blue-600 dark:text-blue-400">
                {formData.totalAmount > 0 ? ((formData.paidAmount / formData.totalAmount) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Update Enrollment
          </Button>
        </div>
      </form>
    </Modal>
  );
}