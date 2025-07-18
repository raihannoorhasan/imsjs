import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus, Calendar, Users, Clock, CheckCircle, Search, Filter } from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { SearchInput } from '../common/SearchInput';
import { Select } from '../common/Select';
import { AttendanceSessionForm } from './AttendanceSessionForm';
import { AttendanceList } from './AttendanceList';
import { formatDate } from '../../utils/helpers';

export function AttendanceManagement() {
  const { attendanceSessions, addAttendanceSession, courseBatches, courses } = useInventory();
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const handleAddSession = (sessionData) => {
    addAttendanceSession({
      ...sessionData,
      attendanceRecords: []
    });
    setShowSessionForm(false);
  };

  // Filter sessions based on search and filters
  const filteredSessions = attendanceSessions.filter(session => {
    const batch = courseBatches.find(b => b.id === session.batchId);
    const course = batch ? courses.find(c => c.id === batch.courseId) : null;
    
    const matchesSearch = session.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (batch?.batchName || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBatch = selectedBatch === 'all' || session.batchId === selectedBatch;
    
    const sessionDate = new Date(session.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = sessionDate.toDateString() === today.toDateString();
    } else if (dateFilter === 'yesterday') {
      matchesDate = sessionDate.toDateString() === yesterday.toDateString();
    } else if (dateFilter === 'week') {
      matchesDate = sessionDate >= weekAgo;
    }
    
    return matchesSearch && matchesBatch && matchesDate;
  });

  // Calculate statistics
  const totalSessions = filteredSessions.length;
  const todaySessions = attendanceSessions.filter(s => 
    new Date(s.date).toDateString() === new Date().toDateString()
  ).length;
  const completedSessions = filteredSessions.filter(s => 
    s.attendanceRecords && s.attendanceRecords.length > 0
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
            <p className="text-gray-600 mt-1">Track and manage student attendance across all sessions</p>
          </div>
          <Button 
            onClick={() => setShowSessionForm(true)}
            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus size={20} className="mr-2" />
            Create Session
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
              placeholder="Search by topic, course, or batch..."
              className="w-full"
            />
          </div>
          <div>
            <Select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full"
            >
              <option value="all">All Batches</option>
              {courseBatches.map(batch => {
                const course = courses.find(c => c.id === batch.courseId);
                return (
                  <option key={batch.id} value={batch.id}>
                    {course?.name} - {batch.batchName}
                  </option>
                );
              })}
            </Select>
          </div>
          <div>
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Sessions</p>
              <p className="text-3xl font-bold text-blue-900">{totalSessions}</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-full">
              <Calendar className="w-8 h-8 text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Today's Sessions</p>
              <p className="text-3xl font-bold text-green-900">{todaySessions}</p>
            </div>
            <div className="bg-green-200 p-3 rounded-full">
              <Clock className="w-8 h-8 text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Completed Sessions</p>
              <p className="text-3xl font-bold text-purple-900">{completedSessions}</p>
            </div>
            <div className="bg-purple-200 p-3 rounded-full">
              <CheckCircle className="w-8 h-8 text-purple-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Results Summary */}
      {(searchTerm || selectedBatch !== 'all' || dateFilter !== 'all') && (
        <div className="text-sm text-gray-600 px-1">
          Found {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} 
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}

      <AttendanceList sessions={filteredSessions} />

      <AttendanceSessionForm
        isOpen={showSessionForm}
        onClose={() => setShowSessionForm(false)}
        onSubmit={handleAddSession}
      />
    </div>
  );
}