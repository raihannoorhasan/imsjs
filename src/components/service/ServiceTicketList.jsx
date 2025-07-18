import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Edit2, Smartphone, Laptop, Monitor, Tablet, Search, Filter, Eye, Plus, Wrench, FileText, CheckCircle } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { SearchInput } from '../common/SearchInput';
import { Select } from '../common/Select';
import { formatCurrency, formatDate, getPriorityColor } from '../../utils/helpers';

export function ServiceTicketList({ tickets, onEdit }) {
  const { customers, technicians, generateServiceInvoice, serviceInvoices } = useInventory();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [priorityFilter, setPriorityFilter] = React.useState('all');
  const [technicianFilter, setTechnicianFilter] = React.useState('all');
  const [showInvoiceModal, setShowInvoiceModal] = React.useState(false);
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

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Service Tickets</h2>
            <p className="text-gray-600 mt-1">Track and manage all service requests</p>
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
              className="w-full"
            />
          </div>
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full"
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
            className="w-full"
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
            className="w-full"
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
        <div className="text-sm text-gray-600 px-1">
          Found {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} 
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600 mb-4">
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
                <TableRow key={ticket.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{ticket.ticketNumber}</p>
                      <p className="text-sm text-gray-600">{formatDate(ticket.createdAt)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{getCustomerName(ticket.customerId)}</p>
                      <p className="text-xs text-gray-500">Customer</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getDeviceIcon(ticket.deviceType)}
                      <div>
                        <p className="text-sm text-gray-900">{ticket.deviceBrand} {ticket.deviceModel}</p>
                        <p className="text-xs text-gray-500 capitalize">{ticket.deviceType}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-900 truncate" title={ticket.issueDescription}>
                        {ticket.issueDescription}
                      </p>
                      {ticket.serialNumber && (
                        <p className="text-xs text-gray-500">S/N: {ticket.serialNumber}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-gray-900">{getTechnicianName(ticket.assignedTechnician)}</p>
                      {ticket.assignedTechnician && (
                        <p className="text-xs text-gray-500">Assigned</p>
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
                      <p className="text-gray-900 font-medium">{formatCurrency(ticket.laborCost + ticket.partsCost)}</p>
                      <p className="text-gray-500">Est: {formatCurrency(ticket.estimatedCost)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(ticket)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Edit Ticket"
                      >
                        <Edit2 size={16} />
                      </button>
                      {ticket.status === 'completed' && !hasInvoice(ticket.id) && (
                        <button
                          onClick={() => handleGenerateInvoice(ticket)}
                          className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                          title="Generate Invoice"
                        >
                          <FileText size={16} />
                        </button>
                      )}
                      {hasInvoice(ticket.id) && (
                        <span className="text-green-600 p-1" title="Invoice Generated">
                          <CheckCircle size={16} />
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}