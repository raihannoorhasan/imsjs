import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { FileText, DollarSign, Eye } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/helpers';

export function InvoiceList({ invoices }) {
  const { customers } = useInventory();

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>
              <div className="flex items-center space-x-2">
                <FileText size={16} className="text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                  <p className="text-sm text-gray-600">{invoice.items.length} items</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-900">{getCustomerName(invoice.customerId)}</span>
            </TableCell>
            <TableCell>
              <div>
                <div className="flex items-center text-green-600">
                  <DollarSign size={14} className="mr-1" />
                  <span className="font-medium">{formatCurrency(invoice.total)}</span>
                </div>
                <p className="text-xs text-gray-500">
                  Subtotal: {formatCurrency(invoice.subtotal)} | Tax: {formatCurrency(invoice.tax)}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={invoice.status} />
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-600">{formatDate(invoice.createdAt)}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-600">{formatDate(invoice.dueDate)}</span>
            </TableCell>
            <TableCell>
              <button className="text-blue-600 hover:text-blue-800">
                <Eye size={16} />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}