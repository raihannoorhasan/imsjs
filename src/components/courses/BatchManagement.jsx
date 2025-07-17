import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { BatchList } from './BatchList';
import { BatchForm } from './BatchForm';

export function BatchManagement() {
  const { courseBatches, addCourseBatch, updateCourseBatch, deleteCourseBatch } = useInventory();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);

  const handleEdit = (batch) => {
    setEditingBatch(batch);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingBatch(null);
  };

  const handleSubmit = (batchData) => {
    if (editingBatch) {
      updateCourseBatch(editingBatch.id, batchData);
    } else {
      addCourseBatch(batchData);
    }
    handleCloseForm();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Batch Management</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus size={20} className="mr-2" />
          Add Batch
        </Button>
      </div>

      <BatchList
        batches={courseBatches}
        onEdit={handleEdit}
        onDelete={deleteCourseBatch}
      />

      <BatchForm
        isOpen={showAddForm}
        onClose={handleCloseForm}
        batch={editingBatch}
        onSubmit={handleSubmit}
      />
    </div>
  );
}