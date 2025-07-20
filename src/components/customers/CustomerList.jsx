import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { formatCurrency, formatDate } from '../../utils/helpers';

export function CustomerList({ customers }) {
  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Mail className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No customers found</h3>
        <p className="text-gray-600 dark:text-gray-400">Add your first customer to get started</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Total Purchases</TableHead>
          <TableHead>Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{customer.name}</p>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <Mail size={14} className="mr-1" />
                  {customer.email}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone size={14} className="mr-1" />
                  {customer.phone}
                </div>
                {customer.address && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin size={14} className="mr-1" />
                    {customer.address}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <span className="font-medium text-green-600 dark:text-green-400">
                {formatCurrency(customer.totalPurchases || 0)}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(customer.createdAt)}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}