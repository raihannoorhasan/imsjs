import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Edit2, Trash2, Calendar, Users } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate } from '../../utils/helpers';

export function BatchList({ batches, onEdit, onDelete }) {
  const { courses } = useInventory();

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Batch</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Schedule</TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {batches.map((batch) => (
          <TableRow key={batch.id}>
            <TableCell>
              <div>
                <p className="font-medium text-gray-900">{batch.batchName}</p>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Calendar size={14} className="mr-1" />
                  {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-900">{getCourseName(batch.courseId)}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-600">{batch.schedule}</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center text-sm text-gray-600">
                <Users size={14} className="mr-1" />
                {batch.currentStudents}/{batch.maxStudents}
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={batch.status} />
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(batch)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(batch.id)}
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