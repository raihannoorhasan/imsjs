import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus, Wrench, Users, FileText } from 'lucide-react';
import { Button } from '../common/Button';
import { ServiceTicketList } from './ServiceTicketList';
import { ServiceTicketForm } from './ServiceTicketForm';
import { TechnicianManagement } from './TechnicianManagement';
import { ServiceInvoices } from './ServiceInvoices';

export function ServiceCenter() {
  const { serviceTickets, addServiceTicket, updateServiceTicket } = useInventory();
  const [activeTab, setActiveTab] = useState('tickets');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  const tabs = [
    { id: 'tickets', label: 'Service Tickets', icon: Wrench },
    { id: 'technicians', label: 'Technicians', icon: Users },
    { id: 'invoices', label: 'Service Invoices', icon: FileText }
  ];

  const handleEdit = (ticket) => {
    setEditingTicket(ticket);
    setShowTicketForm(true);
  };

  const handleCloseForm = () => {
    setShowTicketForm(false);
    setEditingTicket(null);
  };

  const handleSubmit = (ticketData) => {
    if (editingTicket) {
      updateServiceTicket(editingTicket.id, ticketData);
    } else {
      addServiceTicket(ticketData);
    }
    handleCloseForm();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'tickets':
        return (
          <ServiceTicketList
            tickets={serviceTickets}
            onEdit={handleEdit}
          />
        );
      case 'technicians':
        return <TechnicianManagement />;
      case 'invoices':
        return <ServiceInvoices />;
      default:
        return <ServiceTicketList tickets={serviceTickets} onEdit={handleEdit} />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Center</h1>
          <p className="text-gray-600 mt-2">Manage service tickets, technicians, and repairs</p>
        </div>
        {activeTab === 'tickets' && (
          <Button onClick={() => setShowTicketForm(true)}>
            <Plus size={20} className="mr-2" />
            New Ticket
          </Button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {renderContent()}

      <ServiceTicketForm
        isOpen={showTicketForm}
        onClose={handleCloseForm}
        ticket={editingTicket}
        onSubmit={handleSubmit}
      />
    </div>
  );
}