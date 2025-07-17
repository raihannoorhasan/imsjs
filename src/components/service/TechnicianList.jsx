import React from 'react';
import { Mail, Phone, DollarSign, Star, CheckCircle } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency } from '../../utils/helpers';

export function TechnicianList({ technicians }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Technician</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Specializations</TableHead>
          <TableHead>Rate</TableHead>
          <TableHead>Performance</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {technicians.map((technician) => (
          <TableRow key={technician.id}>
            <TableCell>
              <div>
                <p className="font-medium text-gray-900">{technician.name}</p>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Mail size={14} className="mr-1" />
                  {technician.email}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center text-sm text-gray-600">
                <Phone size={14} className="mr-1" />
                {technician.phone}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {technician.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center text-green-600">
                <DollarSign size={14} className="mr-1" />
                <span className="font-medium">{formatCurrency(technician.hourlyRate)}/hr</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle size={14} className="mr-1" />
                  {technician.totalTicketsCompleted} completed
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Star size={14} className="mr-1" />
                  {technician.averageRating.toFixed(1)} rating
                </div>
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={technician.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}