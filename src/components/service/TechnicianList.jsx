import React from 'react';
import { Mail, Phone, DollarSign, Star, CheckCircle, User, Award, Wrench } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency } from '../../utils/helpers';

export function TechnicianList({ technicians }) {
  if (technicians.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No technicians found</h3>
        <p className="text-gray-600 mb-4">Add your first technician to get started with service management.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Technician</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Specializations</TableHead>
          <TableHead>Hourly Rate</TableHead>
          <TableHead>Performance</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {technicians.map((technician) => (
          <TableRow key={technician.id} className="hover:bg-gray-50">
            <TableCell>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                  <Wrench className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{technician.name}</p>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Mail size={14} className="mr-1" />
                    {technician.email}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center text-sm text-gray-600">
                <Phone size={14} className="mr-1" />
                <span>{technician.phone}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1 max-w-xs">
                {technician.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center text-green-600">
                <DollarSign size={14} className="mr-1" />
                <div>
                  <span className="font-medium">{formatCurrency(technician.hourlyRate)}</span>
                  <span className="text-xs text-gray-500 ml-1">per hour</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle size={14} className="mr-1" />
                  <span className="text-gray-900 font-medium">{technician.totalTicketsCompleted}</span>
                  <span className="text-gray-500 ml-1">completed</span>
                </div>
                <div className="flex items-center text-sm">
                  <Award size={14} className="mr-1 text-yellow-500" />
                  <span className="text-gray-900 font-medium">{technician.averageRating.toFixed(1)}</span>
                  <span className="text-gray-500 ml-1">rating</span>
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