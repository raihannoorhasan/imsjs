import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Award,
  CheckCircle,
  Clock,
  Target,
  GraduationCap
} from 'lucide-react';
import { Card } from '../common/Card';
import { formatCurrency, formatDate } from '../../utils/helpers';

export function CourseReport({ timeRange = 'monthly' }) {
  const { 
    courses, 
    courseBatches, 
    students, 
    enrollments, 
    coursePayments, 
    attendanceSessions 
  } = useInventory();

  // Helper function to filter data by time range
  const filterByTimeRange = (data, dateField = 'createdAt') => {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'yearly':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }
    
    return data.filter(item => new Date(item[dateField]) >= startDate);
  };

  const filteredEnrollments = filterByTimeRange(enrollments, 'enrollmentDate');
  const filteredPayments = filterByTimeRange(coursePayments, 'paymentDate');
  const filteredSessions = filterByTimeRange(attendanceSessions, 'date');

  // Calculate metrics
  const totalRevenue = filteredPayments
    .filter(p => p.status === 'approved')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const newEnrollments = filteredEnrollments.length;
  const totalStudents = students.length;
  const activeCourses = courses.filter(c => c.status === 'active').length;
  const activeBatches = courseBatches.filter(b => b.status === 'ongoing').length;

  // Payment analysis
  const paymentsByType = filteredPayments.reduce((acc, payment) => {
    if (payment.status === 'approved') {
      acc[payment.paymentType] = (acc[payment.paymentType] || 0) + payment.amount;
    }
    return acc;
  }, {});

  const paymentsByMethod = filteredPayments.reduce((acc, payment) => {
    if (payment.status === 'approved') {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + payment.amount;
    }
    return acc;
  }, {});

  // Course performance
  const coursePerformance = courses.map(course => {
    const courseBatchesData = courseBatches.filter(b => b.courseId === course.id);
    const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
    const courseRevenue = coursePayments
      .filter(p => p.status === 'approved' && 
        courseEnrollments.some(e => e.id === p.enrollmentId))
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalCapacity = courseBatchesData.reduce((sum, batch) => sum + batch.maxStudents, 0);
    const currentEnrollments = courseBatchesData.reduce((sum, batch) => sum + batch.currentStudents, 0);
    const utilizationRate = totalCapacity > 0 ? (currentEnrollments / totalCapacity) * 100 : 0;

    return {
      ...course,
      batchCount: courseBatchesData.length,
      totalEnrollments: courseEnrollments.length,
      currentEnrollments,
      totalCapacity,
      utilizationRate,
      revenue: courseRevenue,
      avgRevenuePerStudent: courseEnrollments.length > 0 ? courseRevenue / courseEnrollments.length : 0
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Student performance metrics
  const studentMetrics = {
    totalStudents,
    newStudents: filterByTimeRange(students).length,
    activeEnrollments: enrollments.filter(e => e.status === 'active').length,
    completedEnrollments: enrollments.filter(e => e.status === 'completed').length,
    dropoutRate: enrollments.length > 0 ? 
      (enrollments.filter(e => e.status === 'dropped').length / enrollments.length) * 100 : 0
  };

  // Attendance metrics
  const attendanceMetrics = {
    totalSessions: filteredSessions.length,
    avgAttendanceRate: filteredSessions.length > 0 ? 
      filteredSessions.reduce((sum, session) => {
        const records = session.attendanceRecords || [];
        const present = records.filter(r => r.status === 'present').length;
        const total = records.length;
        return sum + (total > 0 ? (present / total) * 100 : 0);
      }, 0) / filteredSessions.length : 0
  };

  // Top performing batches
  const batchPerformance = courseBatches.map(batch => {
    const course = courses.find(c => c.id === batch.courseId);
    const batchEnrollments = enrollments.filter(e => e.batchId === batch.id);
    const batchRevenue = coursePayments
      .filter(p => p.status === 'approved' && 
        batchEnrollments.some(e => e.id === p.enrollmentId))
      .reduce((sum, p) => sum + p.amount, 0);
    
    const batchSessions = attendanceSessions.filter(s => s.batchId === batch.id);
    const avgAttendance = batchSessions.length > 0 ? 
      batchSessions.reduce((sum, session) => {
        const records = session.attendanceRecords || [];
        const present = records.filter(r => r.status === 'present').length;
        const total = records.length;
        return sum + (total > 0 ? (present / total) * 100 : 0);
      }, 0) / batchSessions.length : 0;

    return {
      ...batch,
      courseName: course?.name || 'Unknown Course',
      enrollmentCount: batchEnrollments.length,
      revenue: batchRevenue,
      sessionsCount: batchSessions.length,
      avgAttendance: avgAttendance.toFixed(1),
      utilizationRate: batch.maxStudents > 0 ? (batch.currentStudents / batch.maxStudents) * 100 : 0
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'daily': return 'Today';
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
      case 'yearly': return 'This Year';
      default: return 'This Month';
    }
  };

  return (
    <div className="space-y-6">
      {/* Time Range Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Course Department Report - {getTimeRangeLabel()}</h2>
            <p className="text-blue-700 dark:text-blue-300 mt-1">Educational performance, enrollment trends, and revenue analysis</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-800/50 p-3 rounded-full">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">Course Revenue</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">{getTimeRangeLabel()}</p>
            </div>
            <div className="bg-green-200 dark:bg-green-800/50 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-green-700 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">New Enrollments</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{newEnrollments}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Students enrolled</p>
            </div>
            <div className="bg-blue-200 dark:bg-blue-800/50 p-3 rounded-full">
              <Users className="w-8 h-8 text-blue-700 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-400">Active Courses</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{activeCourses}</p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">{activeBatches} batches running</p>
            </div>
            <div className="bg-purple-200 dark:bg-purple-800/50 p-3 rounded-full">
              <BookOpen className="w-8 h-8 text-purple-700 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400">Attendance Rate</p>
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{attendanceMetrics.avgAttendanceRate.toFixed(1)}%</p>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">Average attendance</p>
            </div>
            <div className="bg-orange-200 dark:bg-orange-800/50 p-3 rounded-full">
              <CheckCircle className="w-8 h-8 text-orange-700 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment by Type */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue by Payment Type</h3>
          <div className="space-y-3">
            {Object.entries(paymentsByType).map(([type, amount]) => {
              const percentage = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
              return (
                <div key={type} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(amount)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Payment by Method */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payments by Method</h3>
          <div className="space-y-3">
            {Object.entries(paymentsByMethod).map(([method, amount]) => {
              const percentage = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
              return (
                <div key={method} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 dark:bg-green-400 rounded-full"></div>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{method}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(amount)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Student Metrics */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Student Performance Metrics</h3>
          <GraduationCap className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
            <p className="text-sm text-blue-700 dark:text-blue-400">Total Students</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{studentMetrics.totalStudents}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
            <p className="text-sm text-green-700 dark:text-green-400">Active Enrollments</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">{studentMetrics.activeEnrollments}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
            <p className="text-sm text-purple-700 dark:text-purple-400">Completed</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{studentMetrics.completedEnrollments}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
            <p className="text-sm text-orange-700 dark:text-orange-400">Dropout Rate</p>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{studentMetrics.dropoutRate.toFixed(1)}%</p>
          </div>
        </div>
      </Card>

      {/* Course Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Course Performance Analysis</h3>
          <Target className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="space-y-4">
          {coursePerformance.slice(0, 5).map((course, index) => (
            <div key={course.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{course.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{course.batchCount} batches • {course.totalEnrollments} total enrollments</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(course.revenue)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(course.avgRevenuePerStudent)}/student</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Utilization:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{course.utilizationRate.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Current:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{course.currentEnrollments}/{course.totalCapacity}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Price:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{formatCurrency(course.price)}</span>
                </div>
              </div>
              
              {/* Utilization Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      course.utilizationRate >= 80 ? 'bg-green-500 dark:bg-green-400' : 
                      course.utilizationRate >= 60 ? 'bg-yellow-500 dark:bg-yellow-400' : 'bg-red-500 dark:bg-red-400'
                    }`}
                    style={{ width: `${course.utilizationRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Batch Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Top Performing Batches</h3>
          <Award className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 text-gray-900 dark:text-white">Batch</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Course</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Students</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Attendance</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Revenue</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {batchPerformance.slice(0, 8).map((batch) => (
                <tr key={batch.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2">
                    <p className="font-medium text-gray-900 dark:text-white">{batch.batchName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{batch.sessionsCount} sessions</p>
                  </td>
                  <td className="py-2">
                    <p className="text-gray-900 dark:text-white">{batch.courseName}</p>
                  </td>
                  <td className="py-2">
                    <p className="font-medium text-gray-900 dark:text-white">{batch.currentStudents}/{batch.maxStudents}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{batch.utilizationRate.toFixed(1)}% capacity</p>
                  </td>
                  <td className="py-2">
                    <p className={`font-medium ${
                      parseFloat(batch.avgAttendance) >= 80 ? 'text-green-600 dark:text-green-400' :
                      parseFloat(batch.avgAttendance) >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {batch.avgAttendance}%
                    </p>
                  </td>
                  <td className="py-2">
                    <p className="font-medium text-green-600 dark:text-green-400">{formatCurrency(batch.revenue)}</p>
                  </td>
                  <td className="py-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      batch.status === 'ongoing' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                      batch.status === 'upcoming' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                      batch.status === 'completed' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300' :
                      'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                    }`}>
                      {batch.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {batchPerformance.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            <p>No batch data available</p>
          </div>
        )}
      </Card>
    </div>
  );
}