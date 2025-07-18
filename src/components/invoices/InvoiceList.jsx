import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { FileText, DollarSign, Eye, Send, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/helpers';

export function InvoiceList({ invoices, onView, onUpdateStatus, onSend }) {
  const { customers } = useInventory();

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'sent':
        return <Send size={16} className="text-blue-500" />;
      case 'overdue':
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const isOverdue = (invoice) => {
    return new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid';
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
          <TableRow key={invoice.id} className={isOverdue(invoice) ? 'bg-red-50' : ''}>
            <TableCell>
              <div className="flex items-center space-x-2">
                {getStatusIcon(invoice.status)}
                <div>
                  <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                  <p className="text-sm text-gray-600">{invoice.items.length} items</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="text-sm text-gray-900">{getCustomerName(invoice.customerId)}</p>
                {invoice.saleId && (
                  <p className="text-xs text-gray-500">Sale #{invoice.saleId.slice(-6)}</p>
                )}
              </div>
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
                {invoice.discount > 0 && (
                  <p className="text-xs text-green-600">
                    Discount: -{formatCurrency(invoice.discount)}
                  </p>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div>
                <StatusBadge status={isOverdue(invoice) ? 'overdue' : invoice.status} />
                {isOverdue(invoice) && (
                  <p className="text-xs text-red-600 mt-1">
                    {Math.ceil((new Date() - new Date(invoice.dueDate)) / (1000 * 60 * 60 * 24))} days overdue
                  </p>
                )}
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-600">{formatDate(invoice.createdAt)}</span>
            </TableCell>
            <TableCell>
              <span className={`text-sm ${isOverdue(invoice) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                {formatDate(invoice.dueDate)}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <button 
                  onClick={() => onView(invoice)}
                  className="text-blue-600 hover:text-blue-800"
                  title="View Invoice"
                >
                  <Eye size={16} />
                </button>
                {invoice.status === 'draft' && (
                  <button 
                    onClick={() => onSend(invoice.id)}
                    className="text-green-600 hover:text-green-800"
                    title="Send Invoice"
                  >
                    <Send size={16} />
                  </button>
                )}
                {invoice.status === 'sent' && (
                  <button 
                    onClick={() => onUpdateStatus(invoice.id, 'paid')}
                    className="text-green-600 hover:text-green-800"
                    title="Mark as Paid"
                  >
                    <CheckCircle size={16} />
                  </button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}