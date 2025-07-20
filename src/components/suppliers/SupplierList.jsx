import React from 'react';
import { Mail, Phone, MapPin, Package } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { formatDate } from '../../utils/helpers';

export function SupplierList({ suppliers }) {
  if (suppliers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Package className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No suppliers found</h3>
        <p className="text-gray-600 dark:text-gray-400">Add your first supplier to get started</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Supplier</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Products</TableHead>
          <TableHead>Added</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.map((supplier) => (
          <TableRow key={supplier.id}>
            <TableCell>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{supplier.name}</p>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <Mail size={14} className="mr-1" />
                  {supplier.email}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone size={14} className="mr-1" />
                  {supplier.phone}
                </div>
                {supplier.address && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin size={14} className="mr-1" />
                    {supplier.address}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Package size={14} className="mr-1" />
                {supplier.products ? supplier.products.length : 0} products
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(supplier.createdAt)}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}