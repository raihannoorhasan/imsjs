import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Calendar, Users, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { AttendanceMarking } from './AttendanceMarking';
import { formatDate } from '../../utils/helpers';

export function AttendanceList({ sessions }) {
  const { courseBatches, courses } = useInventory();
  const [selectedSession, setSelectedSession] = useState(null);

  const getBatchInfo = (batchId) => {
    const batch = courseBatches.find(b => b.id === batchId);
    const course = batch ? courses.find(c => c.id === batch.courseId) : null;
    return { batch, course };
  };

  const getAttendanceStats = (session) => {
    const present = session.attendanceRecords.filter(r => r.status === 'present').length;
    const absent = session.attendanceRecords.filter(r => r.status === 'absent').length;
    const late = session.attendanceRecords.filter(r => r.status === 'late').length;
    const excused = session.attendanceRecords.filter(r => r.status === 'excused').length;
    
    return { present, absent, late, excused, total: session.attendanceRecords.length };
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {sessions.map((session) => {
          const { batch, course } = getBatchInfo(session.batchId);
          const stats = getAttendanceStats(session);
          
          return (
            <Card key={session.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {formatDate(session.date)}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">
                      {course?.name} - {batch?.batchName}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">Topic: {session.topic}</p>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <CheckCircle size={14} className="text-green-500" />
                      <span>Present: {stats.present}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <XCircle size={14} className="text-red-500" />
                      <span>Absent: {stats.absent}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} className="text-yellow-500" />
                      <span>Late: {stats.late}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <AlertCircle size={14} className="text-blue-500" />
                      <span>Excused: {stats.excused}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => setSelectedSession(session)}
                >
                  Mark Attendance
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedSession && (
        <AttendanceMarking
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}