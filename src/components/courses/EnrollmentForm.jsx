import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Modal } from '../common/Modal';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export function EnrollmentForm({ isOpen, onClose }) {
  const { students, courseBatches, courses, addEnrollment } = useInventory();
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    batchId: ''
  });

  const availableBatches = courseBatches.filter(batch => 
    batch.courseId === formData.courseId && batch.status !== 'completed'
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const batch = courseBatches.find(b => b.id === formData.batchId);
    const course = courses.find(c => c.id === formData.courseId);
    
    if (batch && course) {
      const enrollmentData = {
        studentId: formData.studentId,
        courseId: formData.courseId,
        batchId: formData.batchId,
        totalAmount: course.price,
        paidAmount: 0,
        remainingAmount: course.price,
        admissionFeePaid: false,
        registrationFeePaid: false,
        examFeePaid: false,
        status: 'active'
      };
      
      addEnrollment(enrollmentData);
      setFormData({ studentId: '', courseId: '', batchId: '' });
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'courseId') {
      setFormData(prev => ({ ...prev, batchId: '' }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enroll Student">
      <form onSubmit={handleSubmit} className="space-y-4">
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
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Enroll Student
          </Button>
        </div>
      </form>
    </Modal>
  );
}