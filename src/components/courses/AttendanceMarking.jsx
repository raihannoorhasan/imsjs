import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { CheckCircle, XCircle, Clock, AlertCircle, User, Save, Eye } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatDateTime } from '../../utils/helpers';

export function AttendanceMarking({ session, viewMode = 'mark', onClose }) {
  const { enrollments, students, updateAttendanceRecord, courseBatches, courses, attendanceSessions } = useInventory();

  // Get the most up-to-date session data from the context
  const currentSession = attendanceSessions.find(s => s.id === session.id) || session;

  const batchEnrollments = enrollments.filter(e => 
    e.batchId === currentSession.batchId && e.status === 'active'
  );
  
  const batch = courseBatches.find(b => b.id === currentSession.batchId);
  const course = batch ? courses.find(c => c.id === batch.courseId) : null;
  
  const getStudentAttendance = (studentId) => {
    return (currentSession.attendanceRecords || []).find(r => r.studentId === studentId);
  };

  const handleStatusChange = (studentId, status) => {
    if (viewMode === 'view') return; // Prevent changes in view mode
    updateAttendanceRecord(currentSession.id, studentId, status);
  };

  const statusOptions = [
    { id: 'present', label: 'Present', icon: CheckCircle, color: 'text-green-600' },
    { id: 'absent', label: 'Absent', icon: XCircle, color: 'text-red-600' },
    { id: 'late', label: 'Late', icon: Clock, color: 'text-yellow-600' },
    { id: 'excused', label: 'Excused', icon: AlertCircle, color: 'text-blue-600' }
  ];

  const getStatusStats = () => {
    const records = currentSession.attendanceRecords || [];
    return statusOptions.map(option => ({
      ...option,
      count: records.filter(r => r.status === option.id).length
    }));
  };

  const handleSaveAndClose = () => {
    // You could add validation here if needed
    onClose();
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={
        <div className="flex items-center space-x-2">
          {viewMode === 'view' ? <Eye size={20} /> : <CheckCircle size={20} />}
          <span>{viewMode === 'view' ? 'View' : 'Mark'} Attendance</span>
        </div>
      } 
      size="xl"
    >
      {/* Session Info Header */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6 border border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{currentSession.topic}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{course?.name} - {batch?.batchName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateTime(currentSession.date)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {getStatusStats().map(stat => (
              <div key={stat.id} className="flex items-center space-x-1 bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm border border-gray-200 dark:border-gray-600">
                <stat.icon size={14} className={stat.color} />
                <span className="capitalize">{stat.label}:</span>
                <span className="font-medium text-gray-900 dark:text-white">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {batchEnrollments.map((enrollment) => {
          const student = students.find(s => s.id === enrollment.studentId);
          const attendance = getStudentAttendance(enrollment.studentId);
          
          if (!student) return null;
          
          return (
            <div key={enrollment.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                  {attendance && attendance.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Note: {attendance.notes}</p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-1">
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = attendance?.status === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleStatusChange(enrollment.studentId, option.id)}
                      disabled={viewMode === 'view'}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isSelected
                          ? `bg-gray-100 ${option.color} border-2 border-current`
                          : viewMode === 'view' 
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-transparent'
                      } ${viewMode === 'mark' ? 'hover:scale-105' : ''}`}
                    >
                      <Icon size={16} />
                      <span className="hidden sm:inline">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      {batchEnrollments.length === 0 && (
        <div className="text-center py-8">
          <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No active students found in this batch.</p>
        </div>
      )}
      
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-600">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {viewMode === 'mark' ? 'Click status buttons to mark attendance' : 'Viewing attendance records'}
        </div>
        <div className="flex space-x-2">
          {viewMode === 'mark' && (
            <Button onClick={handleSaveAndClose} variant="success">
              <Save size={16} className="mr-2" />
              Save & Close
            </Button>
          )}
          <Button onClick={onClose} variant={viewMode === 'mark' ? 'outline' : 'primary'}>
            {viewMode === 'mark' ? 'Cancel' : 'Close'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}