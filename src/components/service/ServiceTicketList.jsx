import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Edit2, Smartphone, Laptop, Monitor, Tablet } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency, formatDate, getPriorityColor } from '../../utils/helpers';

export function ServiceTicketList({ tickets, onEdit }) {
  const { customers, technicians } = useInventory();

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ticket</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Device</TableHead>
          <TableHead>Technician</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Cost</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell>
              <div>
                <p className="font-medium text-gray-900">{ticket.ticketNumber}</p>
                <p className="text-sm text-gray-600">{formatDate(ticket.createdAt)}</p>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-900">{getCustomerName(ticket.customerId)}</span>
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
              <span className="text-sm text-gray-900">{getTechnicianName(ticket.assignedTechnician)}</span>
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
                <p className="text-gray-900">{formatCurrency(ticket.laborCost + ticket.partsCost)}</p>
                <p className="text-gray-500">Est: {formatCurrency(ticket.estimatedCost)}</p>
              </div>
            </TableCell>
            <TableCell>
              <button
                onClick={() => onEdit(ticket)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit2 size={16} />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}