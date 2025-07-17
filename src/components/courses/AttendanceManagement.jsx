import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus, Calendar } from 'lucide-react';
import { Button } from '../common/Button';
import { AttendanceSessionForm } from './AttendanceSessionForm';
import { AttendanceList } from './AttendanceList';

export function AttendanceManagement() {
  const { attendanceSessions, addAttendanceSession } = useInventory();
  const [showSessionForm, setShowSessionForm] = useState(false);

  const handleAddSession = (sessionData) => {
    addAttendanceSession({
      ...sessionData,
      attendanceRecords: []
    });
    setShowSessionForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Attendance Management</h2>
        <Button onClick={() => setShowSessionForm(true)}>
          <Plus size={20} className="mr-2" />
          New Session
        </Button>
      </div>

      <AttendanceList sessions={attendanceSessions} />

      <AttendanceSessionForm
        isOpen={showSessionForm}
        onClose={() => setShowSessionForm(false)}
        onSubmit={handleAddSession}
      />
    </div>
  );
}