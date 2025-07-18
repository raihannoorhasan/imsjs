import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus, Search, Users, Award, Clock } from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { SearchInput } from '../common/SearchInput';
import { Select } from '../common/Select';
import { TechnicianList } from './TechnicianList';
import { TechnicianForm } from './TechnicianForm';

export function TechnicianManagement() {
  const { technicians, addTechnician, serviceTickets } = useInventory();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleAddTechnician = (technicianData) => {
    addTechnician(technicianData);
    setShowAddForm(false);
  };

  // Filter technicians based on search and status
  const filteredTechnicians = technicians.filter(technician => {
    const matchesSearch = 
      technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technician.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technician.specializations.some(spec => 
        spec.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'all' || technician.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const activeTechnicians = technicians.filter(t => t.status === 'active').length;
  const totalTicketsAssigned = serviceTickets.filter(t => t.assignedTechnician).length;
  const averageRating = technicians.reduce((sum, t) => sum + (t.averageRating || 0), 0) / technicians.length || 0;

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Technician Management</h2>
            <p className="text-gray-600 mt-1">Manage your service team and their specializations</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus size={20} className="mr-2" />
            Add Technician
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Search technicians by name, email, or specialization..."
            className="w-full"
          />
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Active Technicians</p>
              <p className="text-3xl font-bold text-blue-900">{activeTechnicians}</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-full">
              <Users className="w-8 h-8 text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Assigned Tickets</p>
              <p className="text-3xl font-bold text-green-900">{totalTicketsAssigned}</p>
            </div>
            <div className="bg-green-200 p-3 rounded-full">
              <Clock className="w-8 h-8 text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Average Rating</p>
              <p className="text-3xl font-bold text-yellow-900">{averageRating.toFixed(1)}</p>
            </div>
            <div className="bg-yellow-200 p-3 rounded-full">
              <Award className="w-8 h-8 text-yellow-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Results Summary */}
      {(searchTerm || statusFilter !== 'all') && (
        <div className="text-sm text-gray-600 px-1">
          Found {filteredTechnicians.length} technician{filteredTechnicians.length !== 1 ? 's' : ''} 
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border">
        <TechnicianList technicians={filteredTechnicians} />
      </div>

      <TechnicianForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddTechnician}
      />
    </div>
  );
}