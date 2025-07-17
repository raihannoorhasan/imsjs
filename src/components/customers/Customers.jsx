import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { CustomerList } from './CustomerList';
import { CustomerForm } from './CustomerForm';
import { CustomerFilters } from './CustomerFilters';

export function Customers() {
  const { customers, addCustomer } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleAddCustomer = (customerData) => {
    addCustomer(customerData);
    setShowAddForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-2">Manage your customer database and relationships</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus size={20} className="mr-2" />
          Add Customer
        </Button>
      </div>

      <CustomerFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <CustomerList customers={filteredCustomers} />

      <CustomerForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddCustomer}
      />
    </div>
  );
}