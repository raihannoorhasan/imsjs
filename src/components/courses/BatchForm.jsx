import React, { useState, useEffect } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export function BatchForm({ isOpen, onClose, batch, onSubmit }) {
  const { courses } = useInventory();
  const [formData, setFormData] = useState({
    courseId: '',
    batchName: '',
    startDate: '',
    endDate: '',
    schedule: '',
    maxStudents: 15,
    currentStudents: 0,
    status: 'upcoming'
  });

  useEffect(() => {
    if (batch) {
      setFormData({
        courseId: batch.courseId,
        batchName: batch.batchName,
        startDate: new Date(batch.startDate).toISOString().split('T')[0],
        endDate: new Date(batch.endDate).toISOString().split('T')[0],
        schedule: batch.schedule,
        maxStudents: batch.maxStudents,
        currentStudents: batch.currentStudents,
        status: batch.status
      });
    } else {
      setFormData({
        courseId: '',
        batchName: '',
        startDate: '',
        endDate: '',
        schedule: '',
        maxStudents: 15,
        currentStudents: 0,
        status: 'upcoming'
      });
    }
  }, [batch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate)
    };
    onSubmit(submitData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={batch ? 'Edit Batch' : 'Add New Batch'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Course"
            value={formData.courseId}
            onChange={(e) => handleChange('courseId', e.target.value)}
            required
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </Select>
          <Input
            label="Batch Name"
            value={formData.batchName}
            onChange={(e) => handleChange('batchName', e.target.value)}
            required
          />
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            required
          />
          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            required
          />
          <Input
            label="Max Students"
            type="number"
            value={formData.maxStudents}
            onChange={(e) => handleChange('maxStudents', parseInt(e.target.value))}
            required
          />
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Schedule</label>
          <textarea
            value={formData.schedule}
            onChange={(e) => handleChange('schedule', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
            rows={2}
            placeholder="e.g., Mon, Wed, Fri 10:00 AM - 12:00 PM"
          />
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {batch ? 'Update Batch' : 'Add Batch'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}