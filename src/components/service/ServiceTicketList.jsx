import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Edit2, Smartphone, Laptop, Monitor, Tablet, Search, Filter, Eye, Plus, Wrench, FileText, CheckCircle, Truck, DollarSign, Trash2 } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { SearchInput } from '../common/SearchInput';
import { Select } from '../common/Select';
import { DeliveryForm } from './DeliveryForm';
import { formatCurrency, formatDate, getPriorityColor } from '../../utils/helpers';

export function ServiceTicketList({ tickets, onEdit, onMakePayment, onDelete }) {
  const { customers, technicians, generateServiceInvoice, serviceInvoices, updateServiceTicket } = useInventory();
  const { canModify } = useAuth();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [priorityFilter, setPriorityFilter] = React.useState('all');
  const [technicianFilter, setTechnicianFilter] = React.useState('all');
  const [showDeliveryForm, setShowDeliveryForm] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState(null);

  // Filter tickets based on search and filters
  const filteredTickets = tickets.filter(ticket => {
    const customer = customers.find(c => c.id === ticket.customerId);
    const technician = technicians.find(t => t.id === ticket.assignedTechnician);
    
    const matchesSearch = 
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.deviceBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.deviceModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.issueDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesTechnician = technicianFilter === 'all' || ticket.assignedTechnician === technicianFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesTechnician;
  });

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getTechnicianName = (technicianId) => {
    const technician = technicians.find(t => t.id === technicianId);
    return technician ? technician.name : 'Unassigned';
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'laptop':
        return <Laptop size={16} />;
      case 'desktop':
        return <Monitor size={16} />;
      case 'tablet':
        return <Tablet size={16} />;
      case 'phone':
        return <Smartphone size={16} />;
      default:
        return <Monitor size={16} />;
    }
  };

  const handleGenerateInvoice = (ticket) => {
    if (ticket.status === 'completed' && (ticket.laborCost > 0 || ticket.partsCost > 0)) {
      // Check if invoice already exists
      const existingInvoice = serviceInvoices.find(inv => inv.serviceTicketId === ticket.id);
      if (existingInvoice) {
        alert('Invoice already exists for this ticket');
        return;
      }
      
      generateServiceInvoice(ticket.id);
      alert('Service invoice generated successfully!');
    } else {
      alert('Ticket must be completed with costs to generate invoice');
    }
  };

  const hasInvoice = (ticketId) => {
    return serviceInvoices.some(inv => inv.serviceTicketId === ticketId);
  };

  const handleDelivery = (ticket) => {
    setSelectedTicket(ticket);
    setShowDeliveryForm(true);
  };

  const handleDeliverySubmit = (deliveryData) => {
    updateServiceTicket(selectedTicket.id, {
      status: 'delivered',
      deliveryInfo: deliveryData,
      deliveredAt: new Date()
    });
    setShowDeliveryForm(false);
    setSelectedTicket(null);
  };
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Service Tickets</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage all service requests</p>
          </div>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
              placeholder="Search tickets, customers, devices..."
              className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="received">Received</option>
            <option value="diagnosed">Diagnosed</option>
            <option value="waiting_approval">Waiting Approval</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>
        </div>
        
        {/* Additional Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <Select
            value={technicianFilter}
            onChange={(e) => setTechnicianFilter(e.target.value)}
            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          >
            <option value="all">All Technicians</option>
            <option value="">Unassigned</option>
            {technicians.map(technician => (
              <option key={technician.id} value={technician.id}>{technician.name}</option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Results Summary */}
      {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || technicianFilter !== 'all') && (
        <div className="text-sm text-gray-600 dark:text-gray-400 px-1">
          Found {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} 
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}

      {/* Tickets Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <Wrench className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tickets found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || technicianFilter !== 'all'
                ? 'Try adjusting your search criteria or filters'
                : 'Create your first service ticket to get started'
              }
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{ticket.ticketNumber}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(ticket.createdAt)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{getCustomerName(ticket.customerId)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Customer</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getDeviceIcon(ticket.deviceType)}
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{ticket.deviceBrand} {ticket.deviceModel}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 capitalize">{ticket.deviceType}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-900 dark:text-white truncate" title={ticket.issueDescription}>
                        {ticket.issueDescription}
                      </p>
                      {ticket.serialNumber && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">S/N: {ticket.serialNumber}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{getTechnicianName(ticket.assignedTechnician)}</p>
                      {ticket.assignedTechnician && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">Assigned</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={ticket.status} />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="text-gray-900 dark:text-white font-medium">{formatCurrency(ticket.laborCost + ticket.partsCost)}</p>
                      <p className="text-gray-500 dark:text-gray-500">Est: {formatCurrency(ticket.estimatedCost)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(ticket)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                        title="Edit Ticket"
                      >
                        <Edit2 size={16} />
                      </button>
                      {ticket.status === 'completed' && !hasInvoice(ticket.id) && (
                        <button
                          onClick={() => handleGenerateInvoice(ticket)}
                          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
                          title="Generate Invoice"
                        >
                          <FileText size={16} />
                        </button>
                      )}
                      {hasInvoice(ticket.id) && (
                        <span className="text-green-600 dark:text-green-400 p-1" title="Invoice Generated">
                          <CheckCircle size={16} />
                        </span>
                      )}
                      {ticket.status === 'completed' && (
                        <button
                          onClick={() => handleDelivery(ticket)}
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 p-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200"
                          title="Mark as Delivered"
                        >
                          <Truck size={16} />
                        </button>
                      )}
                      {onMakePayment && (
                      <button
                          onClick={() => onMakePayment(ticket)}
                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
                        title="Record Payment"
                      >
                        <DollarSign size={16} />
                      </button>
                      )}
                      {onDelete && canModify('service') && (
                        <button
                          onClick={() => onDelete(ticket.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                          title="Delete Ticket"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {selectedTicket && (
        <DeliveryForm
          isOpen={showDeliveryForm}
          onClose={() => {
            setShowDeliveryForm(false);
            setSelectedTicket(null);
          }}
          ticket={selectedTicket}
          onSubmit={handleDeliverySubmit}
        />
      )}
    </div>
  );
}