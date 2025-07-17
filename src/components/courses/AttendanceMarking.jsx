import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export function AttendanceMarking({ session, onClose }) {
  const { enrollments, students, updateAttendanceRecord } = useInventory();

  const batchEnrollments = enrollments.filter(e => e.batchId === session.batchId);
  
  const getStudentAttendance = (studentId) => {
    return session.attendanceRecords.find(r => r.studentId === studentId);
  };

  const handleStatusChange = (studentId, status) => {
    updateAttendanceRecord(session.id, studentId, status);
  };

  const statusOptions = [
    { id: 'present', label: 'Present', icon: CheckCircle, color: 'text-green-600' },
    { id: 'absent', label: 'Absent', icon: XCircle, color: 'text-red-600' },
    { id: 'late', label: 'Late', icon: Clock, color: 'text-yellow-600' },
    { id: 'excused', label: 'Excused', icon: AlertCircle, color: 'text-blue-600' }
  ];

  return (
    <Modal isOpen={true} onClose={onClose} title="Mark Attendance" size="lg">
      <div className="space-y-4">
        {batchEnrollments.map((enrollment) => {
          const student = students.find(s => s.id === enrollment.studentId);
          const attendance = getStudentAttendance(enrollment.studentId);
          
          if (!student) return null;
          
          return (
            <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{student.name}</p>
                <p className="text-sm text-gray-600">{student.email}</p>
              </div>
              
              <div className="flex space-x-2">
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = attendance?.status === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleStatusChange(enrollment.studentId, option.id)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm ${
                        isSelected
                          ? `bg-gray-100 ${option.color}`
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-end pt-4">
        <Button onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
}