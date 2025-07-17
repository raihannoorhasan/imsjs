import React from 'react';
import { Mail, Phone, MapPin, Package } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { formatDate } from '../../utils/helpers';

export function SupplierList({ suppliers }) {
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
                <p className="font-medium text-gray-900">{supplier.name}</p>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Mail size={14} className="mr-1" />
                  {supplier.email}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={14} className="mr-1" />
                  {supplier.phone}
                </div>
                {supplier.address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={14} className="mr-1" />
                    {supplier.address}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center text-sm text-gray-600">
                <Package size={14} className="mr-1" />
                {supplier.products ? supplier.products.length : 0} products
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-600">
                {formatDate(supplier.createdAt)}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}