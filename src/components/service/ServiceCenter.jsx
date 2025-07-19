import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Wrench, Users, FileText, Search, Filter, BarChart3, CreditCard, DollarSign } from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { ServiceTicketList } from './ServiceTicketList';
import { ServiceTicketForm } from './ServiceTicketForm';
import { TechnicianManagement } from './TechnicianManagement';
import { ServiceInvoices } from './ServiceInvoices';
import { ServiceDashboard } from './ServiceDashboard';
import { ServicePaymentManagement } from './ServicePaymentManagement';
import { ServicePaymentForm } from './ServicePaymentForm';

export function ServiceCenter() {
  const { serviceTickets, addServiceTicket, updateServiceTicket, deleteServiceTicket, customers, generateServiceInvoice, addServicePayment } = useInventory();
  const { canModify } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [selectedTicketForPayment, setSelectedTicketForPayment] = useState(null);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'tickets', label: 'Service Tickets', icon: Wrench },
    { id: 'payments', label: 'Service Payments', icon: CreditCard },
    { id: 'technicians', label: 'Technicians', icon: Users },
    { id: 'invoices', label: 'Service Invoices', icon: FileText }
  ];

  const handleEdit = (ticket) => {
    setEditingTicket(ticket);
    setShowTicketForm(true);
  };

  const handleMakePayment = (ticket) => {
    setSelectedTicketForPayment(ticket);
    setShowPaymentForm(true);
  };

  const handleDelete = (ticketId) => {
    if (window.confirm('Are you sure you want to delete this service ticket?')) {
      deleteServiceTicket(ticketId);
    }
  };

  const handleCloseForm = () => {
    setShowTicketForm(false);
    setEditingTicket(null);
  };

  const handleClosePaymentForm = () => {
    setShowPaymentForm(false);
    setSelectedTicketForPayment(null);
  };

  const handlePaymentSubmit = (paymentData) => {
    addServicePayment(paymentData);
    setShowPaymentForm(false);
    setSelectedTicketForPayment(null);
  };

  const handleSubmit = (ticketData) => {
    // Check if status is being changed to completed
    const wasCompleted = editingTicket?.status === 'completed';
    const isNowCompleted = ticketData.status === 'completed';
    
    if (editingTicket) {
      updateServiceTicket(editingTicket.id, ticketData);
      
      // Generate invoice automatically when existing ticket is completed
      if (!wasCompleted && isNowCompleted && (ticketData.laborCost > 0 || ticketData.partsCost > 0)) {
        setTimeout(() => {
          generateServiceInvoice(editingTicket.id);
        }, 100);
      }
    } else {
      const newTicket = addServiceTicket(ticketData);
      
      // Generate invoice automatically when new ticket is completed
      if (isNowCompleted && (ticketData.laborCost > 0 || ticketData.partsCost > 0)) {
        setTimeout(() => {
          generateServiceInvoice(newTicket.id);
        }, 100);
      }
      
      return newTicket; // Return the new ticket for receipt generation
    }
    handleCloseForm();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ServiceDashboard />;
      case 'tickets':
        return (
          <ServiceTicketList
            tickets={serviceTickets}
            onEdit={handleEdit}
            onMakePayment={handleMakePayment}
            onDelete={canModify('service') ? handleDelete : null}
          />
        );
      case 'payments':
        return <ServicePaymentManagement />;
      case 'technicians':
        return <TechnicianManagement />;
      case 'invoices':
        return <ServiceInvoices />;
      default:
        return <ServiceTicketList tickets={serviceTickets} onEdit={handleEdit} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Center</h1>
            <p className="text-gray-600">Complete service management solution for repairs and maintenance</p>
          </div>
          {activeTab === 'tickets' && (
            <Button 
              onClick={() => setShowTicketForm(true)}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus size={20} className="mr-2" />
              New Service Ticket
            </Button>
          )}
        </div>
      </div>

      {/* Tab Navigation with Modern Design */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex overflow-x-auto">
          <nav className="flex space-x-1 min-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                      ? 'border-orange-500 text-orange-600 bg-orange-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                  <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>

      <ServiceTicketForm
        isOpen={showTicketForm}
        onClose={handleCloseForm}
        ticket={editingTicket}
        onSubmit={handleSubmit}
      />

      <ServicePaymentForm
        isOpen={showPaymentForm}
        onClose={handleClosePaymentForm}
        onSubmit={handlePaymentSubmit}
        preSelectedTicket={selectedTicketForPayment}
      />
    </div>
  );
}