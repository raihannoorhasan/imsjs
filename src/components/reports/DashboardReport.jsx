import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Package, 
  Wrench, 
  BookOpen, 
  Calendar,
  Target,
  BarChart3,
  PieChart
} from 'lucide-react';
import { Card } from '../common/Card';
import { formatCurrency, formatDate } from '../../utils/helpers';

export function DashboardReport({ timeRange }) {
  const { 
    sales, 
    products, 
    customers, 
    serviceTickets, 
    courses, 
    enrollments, 
    coursePayments,
    serviceInvoices 
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

  // Calculate metrics for the selected time range
  const filteredSales = filterByTimeRange(sales);
  const filteredServiceTickets = filterByTimeRange(serviceTickets);
  const filteredEnrollments = filterByTimeRange(enrollments, 'enrollmentDate');
  const filteredPayments = filterByTimeRange(coursePayments, 'paymentDate');

  // Sales metrics
  const salesRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const salesCount = filteredSales.length;
  const averageOrderValue = salesCount > 0 ? salesRevenue / salesCount : 0;

  // Service metrics
  const serviceRevenue = serviceInvoices
    .filter(invoice => filterByTimeRange([invoice]).length > 0)
    .reduce((sum, invoice) => sum + invoice.total, 0);
  const completedTickets = filteredServiceTickets.filter(t => t.status === 'completed').length;
  const activeTickets = filteredServiceTickets.filter(t => 
    ['received', 'diagnosed', 'in_progress'].includes(t.status)
  ).length;

  // Course metrics
  const courseRevenue = filteredPayments
    .filter(p => p.status === 'approved')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const newEnrollments = filteredEnrollments.length;

  // Overall metrics
  const totalRevenue = salesRevenue + serviceRevenue + courseRevenue;
  const totalCustomers = customers.length;
  const totalProducts = products.length;

  // Department performance
  const departmentData = [
    {
      name: 'Sales Department',
      revenue: salesRevenue,
      transactions: salesCount,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      percentage: totalRevenue > 0 ? (salesRevenue / totalRevenue) * 100 : 0
    },
    {
      name: 'Service Center',
      revenue: serviceRevenue,
      transactions: completedTickets,
      icon: Wrench,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      percentage: totalRevenue > 0 ? (serviceRevenue / totalRevenue) * 100 : 0
    },
    {
      name: 'Course Department',
      revenue: courseRevenue,
      transactions: newEnrollments,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      percentage: totalRevenue > 0 ? (courseRevenue / totalRevenue) * 100 : 0
    }
  ];

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
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Business Overview - {getTimeRangeLabel()}</h2>
            <p className="text-blue-700 dark:text-blue-300 mt-1">Comprehensive performance metrics across all departments</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-800/50 p-3 rounded-full">
            <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">Total Revenue</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">All departments</p>
            </div>
            <div className="bg-green-200 dark:bg-green-800/50 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-green-700 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Total Transactions</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{salesCount + completedTickets + newEnrollments}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Sales + Service + Courses</p>
            </div>
            <div className="bg-blue-200 dark:bg-blue-800/50 p-3 rounded-full">
              <TrendingUp className="w-8 h-8 text-blue-700 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-400">Active Customers</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{totalCustomers}</p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Customer base</p>
            </div>
            <div className="bg-purple-200 dark:bg-purple-800/50 p-3 rounded-full">
              <Users className="w-8 h-8 text-purple-700 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400">Active Services</p>
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{activeTickets}</p>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">In progress</p>
            </div>
            <div className="bg-orange-200 dark:bg-orange-800/50 p-3 rounded-full">
              <Wrench className="w-8 h-8 text-orange-700 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Department Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Department Performance</h3>
          <PieChart className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {departmentData.map((dept, index) => {
            const Icon = dept.icon;
            return (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`${dept.bgColor} dark:bg-opacity-20 p-2 rounded-lg`}>
                      <Icon className={`w-5 h-5 ${dept.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{dept.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{dept.transactions} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(dept.revenue)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{dept.percentage.toFixed(1)}% of total</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${dept.color.replace('text-', 'bg-').replace('600', '500')}`}
                    style={{ width: `${dept.percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Quick Stats */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Performance</h3>
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(salesRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Orders:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{salesCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Average Order:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(averageOrderValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Products Sold:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {filteredSales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)}
              </span>
            </div>
          </div>
        </Card>

        {/* Service Quick Stats */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Service Performance</h3>
            <Wrench className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Service Revenue:</span>
              <span className="font-semibold text-orange-600 dark:text-orange-400">{formatCurrency(serviceRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Completed Tickets:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{completedTickets}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Active Tickets:</span>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">{activeTickets}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Tickets:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{filteredServiceTickets.length}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Course Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Department Performance</h3>
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
            <p className="text-sm text-blue-700 dark:text-blue-400">Course Revenue</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{formatCurrency(courseRevenue)}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
            <p className="text-sm text-green-700 dark:text-green-400">New Enrollments</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">{newEnrollments}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
            <p className="text-sm text-purple-700 dark:text-purple-400">Active Courses</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{courses.filter(c => c.status === 'active').length}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
            <p className="text-sm text-orange-700 dark:text-orange-400">Payment Rate</p>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {filteredPayments.length > 0 ? 
                ((filteredPayments.filter(p => p.status === 'approved').length / filteredPayments.length) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </Card>

      {/* Performance Trends */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Trends</h3>
          <Target className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Advanced Analytics Coming Soon</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Interactive charts and trend analysis will be available in the next update</p>
        </div>
      </Card>
    </div>
  );
}