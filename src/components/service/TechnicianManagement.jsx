import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { TechnicianList } from './TechnicianList';
import { TechnicianForm } from './TechnicianForm';

export function TechnicianManagement() {
  const { technicians, addTechnician } = useInventory();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTechnician = (technicianData) => {
    addTechnician(technicianData);
    setShowAddForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Technician Management</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus size={20} className="mr-2" />
          Add Technician
        </Button>
      </div>

      <TechnicianList technicians={technicians} />

      <TechnicianForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddTechnician}
      />
    </div>
  );
}