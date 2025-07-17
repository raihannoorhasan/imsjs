import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Calendar, Users, CheckCircle, XCircle, Clock, AlertCircle, Edit2, Eye } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { AttendanceMarking } from './AttendanceMarking';
import { formatDate, formatDateTime } from '../../utils/helpers';

export function AttendanceList({ sessions }) {
  const { courseBatches, courses, enrollments } = useInventory();
  const [selectedSession, setSelectedSession] = useState(null);
  const [viewMode, setViewMode] = useState('mark'); // 'mark' or 'view'

  const getBatchInfo = (batchId) => {
    const batch = courseBatches.find(b => b.id === batchId);
    const course = batch ? courses.find(c => c.id === batch.courseId) : null;
    return { batch, course };
  };

  const getAttendanceStats = (session) => {
    const records = session.attendanceRecords || [];
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const late = records.filter(r => r.status === 'late').length;
    const excused = records.filter(r => r.status === 'excused').length;
    
    // Get total enrolled students for this batch
    const totalEnrolled = enrollments.filter(e => e.batchId === session.batchId && e.status === 'active').length;
    const totalMarked = records.length;
    
    return { present, absent, late, excused, totalMarked, totalEnrolled };
  };

  const getAttendancePercentage = (session) => {
    const stats = getAttendanceStats(session);
    if (stats.totalEnrolled === 0) return 0;
    return Math.round((stats.present / stats.totalEnrolled) * 100);
  };

  const handleMarkAttendance = (session) => {
    setSelectedSession(session);
    setViewMode('mark');
  };

  const handleViewAttendance = (session) => {
    setSelectedSession(session);
    setViewMode('view');
  };

  if (sessions.length === 0) {
    return (
      <Card className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Sessions Found</h3>
        <p className="text-gray-600 mb-4">Create your first attendance session to get started.</p>
      </Card>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {sessions.map((session) => {
          const { batch, course } = getBatchInfo(session.batchId);
          const stats = getAttendanceStats(session);
          const attendancePercentage = getAttendancePercentage(session);
          const isCompleted = stats.totalMarked > 0;
          const isToday = new Date(session.date).toDateString() === new Date().toDateString();
          
          return (
            <Card key={session.id} className={`p-6 ${isToday ? 'border-l-4 border-l-blue-500' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-center space-x-3">
                    <Calendar size={16} className="text-gray-500" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">
                          {formatDate(session.date)}
                        </span>
                        {isToday && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Today
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={12} className="mr-1" />
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {course?.name} - {batch?.batchName}
                      </p>
                    </div>
                  </div>
                  
                  {/* Topic */}
                  <div>
                    <p className="font-medium text-gray-900">{session.topic}</p>
                    {session.notes && (
                      <p className="text-sm text-gray-600 mt-1">{session.notes}</p>
                    )}
                  </div>
                  
                  {/* Attendance Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={14} className="text-green-500" />
                      <div>
                        <p className="font-medium text-green-700">{stats.present}</p>
                        <p className="text-xs text-gray-500">Present</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <XCircle size={14} className="text-red-500" />
                      <div>
                        <p className="font-medium text-red-700">{stats.absent}</p>
                        <p className="text-xs text-gray-500">Absent</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={14} className="text-yellow-500" />
                      <div>
                        <p className="font-medium text-yellow-700">{stats.late}</p>
                        <p className="text-xs text-gray-500">Late</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle size={14} className="text-blue-500" />
                      <div>
                        <p className="font-medium text-blue-700">{stats.excused}</p>
                        <p className="text-xs text-gray-500">Excused</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users size={14} className="text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-700">{stats.totalMarked}/{stats.totalEnrolled}</p>
                        <p className="text-xs text-gray-500">Marked</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Attendance Rate */}
                  {isCompleted && (
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            attendancePercentage >= 80 ? 'bg-green-500' : 
                            attendancePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${attendancePercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {attendancePercentage}%
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col space-y-2">
                  <Button
                    size="sm"
                    onClick={() => handleMarkAttendance(session)}
                    variant={isCompleted ? "outline" : "primary"}
                  >
                    <Edit2 size={16} className="mr-2" />
                    {isCompleted ? 'Edit' : 'Mark'}
                  </Button>
                  {isCompleted && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewAttendance(session)}
                    >
                      <Eye size={16} className="mr-2" />
                      View
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedSession && (
        <AttendanceMarking
          session={selectedSession}
          viewMode={viewMode}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}