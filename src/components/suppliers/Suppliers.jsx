import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { SupplierList } from './SupplierList';
import { SupplierForm } from './SupplierForm';
import { SupplierFilters } from './SupplierFilters';

export function Suppliers() {
  const { suppliers, addSupplier } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.includes(searchTerm)
  );

  const handleAddSupplier = (supplierData) => {
    addSupplier(supplierData);
    setShowAddForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supplier Management</h1>
          <p className="text-gray-600 mt-2">Manage your supplier relationships and contacts</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus size={20} className="mr-2" />
          Add Supplier
        </Button>
      </div>

      <SupplierFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <SupplierList suppliers={filteredSuppliers} />

      <SupplierForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddSupplier}
      />
    </div>
  );
}