import React from 'react';
import { Edit2, Trash2, Mail, Phone } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { formatDate } from '../../utils/helpers';

export function StudentList({ students, onEdit, onDelete }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Emergency Contact</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>
              <div>
                <p className="font-medium text-gray-900">{student.name}</p>
                <p className="text-sm text-gray-600">{student.dateOfBirth}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail size={14} className="mr-1" />
                  {student.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={14} className="mr-1" />
                  {student.phone}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <p className="text-sm text-gray-900">{student.emergencyContactName}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={14} className="mr-1" />
                  {student.emergencyContactPhone}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-600">
                {formatDate(student.createdAt)}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(student)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(student.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}