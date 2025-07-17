import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Calendar, Clock, BookOpen } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export function AttendanceSessionForm({ isOpen, onClose, onSubmit }) {
  const { courseBatches, courses } = useInventory();
  const [formData, setFormData] = useState({
    batchId: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    topic: '',
    notes: '',
    duration: 60
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.batchId) newErrors.batchId = 'Please select a batch';
    if (!formData.topic.trim()) newErrors.topic = 'Topic is required';
    if (!formData.date) newErrors.date = 'Date is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Combine date and time
    const sessionDateTime = new Date(`${formData.date}T${formData.time}`);
    
    onSubmit({
      ...formData,
      date: sessionDateTime
    });
    
    // Reset form
    setFormData({
      batchId: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      topic: '',
      notes: '',
      duration: 60
    });
    setErrors({});
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getBatchName = (batchId) => {
    const batch = courseBatches.find(b => b.id === batchId);
    const course = batch ? courses.find(c => c.id === batch.courseId) : null;
    return batch && course ? `${course.name} - ${batch.batchName}` : '';
  };

  const activeBatches = courseBatches.filter(b => 
    b.status === 'ongoing' || b.status === 'upcoming'
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={
        <div className="flex items-center space-x-2">
          <Calendar size={20} />
          <span>Create Attendance Session</span>
        </div>
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Batch"
            value={formData.batchId}
            onChange={(e) => handleChange('batchId', e.target.value)}
            error={errors.batchId}
            required
          >
            <option value="">Select Batch</option>
            {activeBatches.map(batch => (
              <option key={batch.id} value={batch.id}>
                {getBatchName(batch.id)}
              </option>
            ))}
          </Select>
          
          <Input
            label="Duration (minutes)"
            type="number"
            value={formData.duration}
            onChange={(e) => handleChange('duration', parseInt(e.target.value) || 60)}
            min="15"
            max="480"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            error={errors.date}
            required
          />
          
          <Input
            label="Time"
            type="time"
            value={formData.time}
            onChange={(e) => handleChange('time', e.target.value)}
          />
        </div>
        
        <Input
          label="Topic"
          value={formData.topic}
          onChange={(e) => handleChange('topic', e.target.value)}
          error={errors.topic}
          placeholder="e.g., Introduction to Computer Hardware"
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Add any additional notes about this session..."
          />
        </div>
        
        {activeBatches.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800 text-sm">
                No active batches found. Please create a batch first before creating attendance sessions.
              </p>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={activeBatches.length === 0}>
            Create Session
          </Button>
        </div>
      </form>
    </Modal>
  );
}