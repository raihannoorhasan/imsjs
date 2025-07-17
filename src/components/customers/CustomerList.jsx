import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { formatCurrency, formatDate } from '../../utils/helpers';

export function CustomerList({ customers }) {
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
                <p className="font-medium text-gray-900">{customer.name}</p>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Mail size={14} className="mr-1" />
                  {customer.email}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={14} className="mr-1" />
                  {customer.phone}
                </div>
                {customer.address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={14} className="mr-1" />
                    {customer.address}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <span className="font-medium text-green-600">
                {formatCurrency(customer.totalPurchases || 0)}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-600">
                {formatDate(customer.createdAt)}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}