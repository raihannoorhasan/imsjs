import React from 'react';
import { Edit2, Trash2, Clock, DollarSign, Users } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency } from '../../utils/helpers';

export function CourseList({ courses, onEdit, onDelete }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Pricing</TableHead>
          <TableHead>Capacity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => (
          <TableRow key={course.id}>
            <TableCell>
              <div>
                <p className="font-medium text-gray-900">{course.name}</p>
                <p className="text-sm text-gray-600">{course.description}</p>
                <p className="text-sm text-gray-500 mt-1">Instructor: {course.instructor}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={14} className="mr-1" />
                {course.duration} hours
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center text-sm">
                  <DollarSign size={14} className="mr-1" />
                  <span className="font-medium">{formatCurrency(course.price)}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Admission: {formatCurrency(course.admissionFee)} | 
                  Registration: {formatCurrency(course.registrationFee)} | 
                  Exam: {formatCurrency(course.examFee)}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center text-sm text-gray-600">
                <Users size={14} className="mr-1" />
                {course.maxStudents} students
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={course.status} />
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(course)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(course.id)}
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