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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-900">Course Department Report - {getTimeRangeLabel()}</h2>
            <p className="text-blue-700 mt-1">Educational performance, enrollment trends, and revenue analysis</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Course Revenue</p>
              <p className="text-3xl font-bold text-green-900">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-green-600 mt-1">{getTimeRangeLabel()}</p>
            </div>
            <div className="bg-green-200 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">New Enrollments</p>
              <p className="text-3xl font-bold text-blue-900">{newEnrollments}</p>
              <p className="text-sm text-blue-600 mt-1">Students enrolled</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-full">
              <Users className="w-8 h-8 text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Active Courses</p>
              <p className="text-3xl font-bold text-purple-900">{activeCourses}</p>
              <p className="text-sm text-purple-600 mt-1">{activeBatches} batches running</p>
            </div>
            <div className="bg-purple-200 p-3 rounded-full">
              <BookOpen className="w-8 h-8 text-purple-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Attendance Rate</p>
              <p className="text-3xl font-bold text-orange-900">{attendanceMetrics.avgAttendanceRate.toFixed(1)}%</p>
              <p className="text-sm text-orange-600 mt-1">Average attendance</p>
            </div>
            <div className="bg-orange-200 p-3 rounded-full">
              <CheckCircle className="w-8 h-8 text-orange-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment by Type */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Payment Type</h3>
          <div className="space-y-3">
            {Object.entries(paymentsByType).map(([type, amount]) => {
              const percentage = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
              return (
                <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-900 capitalize">
                      {type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatCurrency(amount)}</p>
                    <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Payment by Method */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payments by Method</h3>
          <div className="space-y-3">
            {Object.entries(paymentsByMethod).map(([method, amount]) => {
              const percentage = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
              return (
                <div key={method} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-900 capitalize">{method}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatCurrency(amount)}</p>
                    <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
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
          <h3 className="text-xl font-semibold text-gray-900">Student Performance Metrics</h3>
          <GraduationCap className="w-6 h-6 text-gray-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-blue-700">Total Students</p>
            <p className="text-2xl font-bold text-blue-900">{studentMetrics.totalStudents}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-green-700">Active Enrollments</p>
            <p className="text-2xl font-bold text-green-900">{studentMetrics.activeEnrollments}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-sm text-purple-700">Completed</p>
            <p className="text-2xl font-bold text-purple-900">{studentMetrics.completedEnrollments}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <p className="text-sm text-orange-700">Dropout Rate</p>
            <p className="text-2xl font-bold text-orange-900">{studentMetrics.dropoutRate.toFixed(1)}%</p>
          </div>
        </div>
      </Card>

      {/* Course Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Course Performance Analysis</h3>
          <Target className="w-6 h-6 text-gray-500" />
        </div>
        <div className="space-y-4">
          {coursePerformance.slice(0, 5).map((course, index) => (
            <div key={course.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{course.name}</h4>
                    <p className="text-sm text-gray-600">{course.batchCount} batches • {course.totalEnrollments} total enrollments</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">{formatCurrency(course.revenue)}</p>
                  <p className="text-sm text-gray-600">{formatCurrency(course.avgRevenuePerStudent)}/student</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Utilization:</span>
                  <span className="ml-2 font-medium">{course.utilizationRate.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Current:</span>
                  <span className="ml-2 font-medium">{course.currentEnrollments}/{course.totalCapacity}</span>
                </div>
                <div>
                  <span className="text-gray-600">Price:</span>
                  <span className="ml-2 font-medium">{formatCurrency(course.price)}</span>
                </div>
              </div>
              
              {/* Utilization Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      course.utilizationRate >= 80 ? 'bg-green-500' : 
                      course.utilizationRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
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
          <h3 className="text-xl font-semibold text-gray-900">Top Performing Batches</h3>
          <Award className="w-6 h-6 text-gray-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Batch</th>
                <th className="text-left py-2">Course</th>
                <th className="text-left py-2">Students</th>
                <th className="text-left py-2">Attendance</th>
                <th className="text-left py-2">Revenue</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {batchPerformance.slice(0, 8).map((batch) => (
                <tr key={batch.id} className="border-b">
                  <td className="py-2">
                    <p className="font-medium text-gray-900">{batch.batchName}</p>
                    <p className="text-sm text-gray-500">{batch.sessionsCount} sessions</p>
                  </td>
                  <td className="py-2">
                    <p className="text-gray-900">{batch.courseName}</p>
                  </td>
                  <td className="py-2">
                    <p className="font-medium">{batch.currentStudents}/{batch.maxStudents}</p>
                    <p className="text-sm text-gray-500">{batch.utilizationRate.toFixed(1)}% capacity</p>
                  </td>
                  <td className="py-2">
                    <p className={`font-medium ${
                      parseFloat(batch.avgAttendance) >= 80 ? 'text-green-600' :
                      parseFloat(batch.avgAttendance) >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {batch.avgAttendance}%
                    </p>
                  </td>
                  <td className="py-2">
                    <p className="font-medium text-green-600">{formatCurrency(batch.revenue)}</p>
                  </td>
                  <td className="py-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      batch.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                      batch.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      batch.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
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
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No batch data available</p>
          </div>
        )}
      </Card>
    </div>
  );
}