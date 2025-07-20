import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '../common/Button';
import { SearchInput } from '../common/SearchInput';
import { Card } from '../common/Card';
import { BatchList } from './BatchList';
import { BatchForm } from './BatchForm';

export function BatchManagement() {
  const { courseBatches, addCourseBatch, updateCourseBatch, deleteCourseBatch } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredBatches = courseBatches.filter(batch =>
    batch.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.schedule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Batch Management</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Organize and manage course batches</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus size={20} className="mr-2" />
            Add Batch
          </Button>
        </div>
        
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
              placeholder="Search batches by name or schedule..."
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Results Summary */}
      {searchTerm && (
        <div className="text-sm text-gray-600 dark:text-gray-400 px-1">
          Found {filteredBatches.length} batch{filteredBatches.length !== 1 ? 'es' : ''} matching "{searchTerm}"
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <BatchList
          batches={filteredBatches}
          onEdit={handleEdit}
          onDelete={deleteCourseBatch}
        />
      </div>

      <BatchForm
        isOpen={showAddForm}
        onClose={handleCloseForm}
        batch={editingBatch}
        onSubmit={handleSubmit}
      />
    </div>
  );
}