import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { FileText, DollarSign } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/helpers';

export function ServiceInvoices() {
  const { serviceInvoices, customers, serviceTickets } = useInventory();

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getTicketNumber = (serviceTicketId) => {
    const ticket = serviceTickets.find(t => t.id === serviceTicketId);
    return ticket ? ticket.ticketNumber : 'Unknown Ticket';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Service Invoices</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Service Ticket</TableHead>
            <TableHead>Labor Cost</TableHead>
            <TableHead>Parts Cost</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {serviceInvoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <FileText size={16} className="text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-600">{formatDate(invoice.createdAt)}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-900">{getCustomerName(invoice.customerId)}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-900">{getTicketNumber(invoice.serviceTicketId)}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-blue-600">
                  <DollarSign size={14} className="mr-1" />
                  <span>{formatCurrency(invoice.laborCost)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-purple-600">
                  <DollarSign size={14} className="mr-1" />
                  <span>{formatCurrency(invoice.partsCost)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-green-600">
                  <DollarSign size={14} className="mr-1" />
                  <span className="font-medium">{formatCurrency(invoice.total)}</span>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={invoice.status} />
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">{formatDate(invoice.dueDate)}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}