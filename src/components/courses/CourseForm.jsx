import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export function CourseForm({ isOpen, onClose, course, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    duration: 40,
    price: 0,
    admissionFee: 0,
    registrationFee: 0,
    examFee: 0,
    description: '',
    materials: [],
    instructor: '',
    maxStudents: 15,
    status: 'active'
  });

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        duration: course.duration,
        price: course.price,
        admissionFee: course.admissionFee,
        registrationFee: course.registrationFee,
        examFee: course.examFee,
        description: course.description,
        materials: course.materials || [],
        instructor: course.instructor,
        maxStudents: course.maxStudents,
        status: course.status
      });
    } else {
      setFormData({
        name: '',
        duration: 40,
        price: 0,
        admissionFee: 0,
        registrationFee: 0,
        examFee: 0,
        description: '',
        materials: [],
        instructor: '',
        maxStudents: 15,
        status: 'active'
      });
    }
  }, [course]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={course ? 'Edit Course' : 'Add New Course'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Course Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
          <Input
            label="Duration (hours)"
            type="number"
            value={formData.duration}
            onChange={(e) => handleChange('duration', parseInt(e.target.value))}
            required
          />
          <Input
            label="Course Price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleChange('price', parseFloat(e.target.value))}
            required
          />
          <Input
            label="Admission Fee"
            type="number"
            step="0.01"
            value={formData.admissionFee}
            onChange={(e) => handleChange('admissionFee', parseFloat(e.target.value))}
            required
          />
          <Input
            label="Registration Fee"
            type="number"
            step="0.01"
            value={formData.registrationFee}
            onChange={(e) => handleChange('registrationFee', parseFloat(e.target.value))}
            required
          />
          <Input
            label="Exam Fee"
            type="number"
            step="0.01"
            value={formData.examFee}
            onChange={(e) => handleChange('examFee', parseFloat(e.target.value))}
            required
          />
          <Input
            label="Instructor"
            value={formData.instructor}
            onChange={(e) => handleChange('instructor', e.target.value)}
            required
          />
          <Input
            label="Max Students"
            type="number"
            value={formData.maxStudents}
            onChange={(e) => handleChange('maxStudents', parseInt(e.target.value))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {course ? 'Update Course' : 'Add Course'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}