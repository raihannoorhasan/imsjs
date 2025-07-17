import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export function AttendanceSessionForm({ isOpen, onClose, onSubmit }) {
  const { courseBatches, courses } = useInventory();
  const [formData, setFormData] = useState({
    batchId: '',
    date: new Date().toISOString().split('T')[0],
    topic: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      date: new Date(formData.date)
    });
    setFormData({
      batchId: '',
      date: new Date().toISOString().split('T')[0],
      topic: '',
      notes: ''
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getBatchName = (batchId) => {
    const batch = courseBatches.find(b => b.id === batchId);
    const course = batch ? courses.find(c => c.id === batch.courseId) : null;
    return batch && course ? `${course.name} - ${batch.batchName}` : '';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Attendance Session">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Batch"
          value={formData.batchId}
          onChange={(e) => handleChange('batchId', e.target.value)}
          required
        >
          <option value="">Select Batch</option>
          {courseBatches.filter(b => b.status === 'ongoing').map(batch => (
            <option key={batch.id} value={batch.id}>
              {getBatchName(batch.id)}
            </option>
          ))}
        </Select>
        
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          required
        />
        
        <Input
          label="Topic"
          value={formData.topic}
          onChange={(e) => handleChange('topic', e.target.value)}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create Session
          </Button>
        </div>
      </form>
    </Modal>
  );
}