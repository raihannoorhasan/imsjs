import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Wrench, Clock, CheckCircle, DollarSign, Target } from 'lucide-react';
import { Card } from '../common/Card';
import { formatCurrency, formatDate } from '../../utils/helpers';

export function ServiceReport({ timeRange = 'monthly' }) {
  const { serviceTickets, technicians, serviceInvoices } = useInventory();

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

  const filteredTickets = filterByTimeRange(serviceTickets);
  const filteredInvoices = filterByTimeRange(serviceInvoices);

  const totalTickets = filteredTickets.length;
  const completedTickets = filteredTickets.filter(ticket => ticket.status === 'completed').length;
  const pendingTickets = filteredTickets.filter(ticket => 
    ['received', 'diagnosed', 'in_progress'].includes(ticket.status)
  ).length;
  const serviceRevenue = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const averageTicketValue = completedTickets > 0 ? serviceRevenue / completedTickets : 0;
  const totalServiceCharge = filteredTickets.reduce((sum, ticket) => sum + (ticket.serviceCharge || 0), 0);
  const totalDiagnosticFee = filteredTickets.reduce((sum, ticket) => sum + (ticket.diagnosticFee || 0), 0);
  const totalPartsCost = filteredTickets.reduce((sum, ticket) => sum + (ticket.partsCost || 0), 0);

  const completionRate = totalTickets > 0 ? (completedTickets / totalTickets) * 100 : 0;

  // Device type breakdown
  const deviceTypeBreakdown = filteredTickets.reduce((acc, ticket) => {
    acc[ticket.deviceType] = (acc[ticket.deviceType] || 0) + 1;
    return acc;
  }, {});

  // Priority breakdown
  const priorityBreakdown = filteredTickets.reduce((acc, ticket) => {
    acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
    return acc;
  }, {});

  // Status breakdown with revenue
  const statusBreakdown = filteredTickets.reduce((acc, ticket) => {
    if (!acc[ticket.status]) {
      acc[ticket.status] = { count: 0, revenue: 0 };
    }
    acc[ticket.status].count += 1;
    acc[ticket.status].revenue += (ticket.laborCost || 0) + (ticket.partsCost || 0);
    return acc;
  }, {});

  const technicianPerformance = technicians.map(technician => {
    const assignedTickets = filteredTickets.filter(ticket => ticket.assignedTechnician === technician.id);
    const completedByTech = assignedTickets.filter(ticket => ticket.status === 'completed');
    const revenue = completedByTech.reduce((sum, ticket) => sum + (ticket.serviceCharge || 0) + (ticket.diagnosticFee || 0) + ticket.partsCost, 0);
    const avgCompletionTime = completedByTech.length > 0 ? 
      completedByTech.reduce((sum, ticket) => {
        const created = new Date(ticket.createdAt);
        const completed = new Date(ticket.updatedAt);
        return sum + (completed - created) / (1000 * 60 * 60 * 24); // days
      }, 0) / completedByTech.length : 0;
    
    return {
      ...technician,
      assignedTickets: assignedTickets.length,
      completedTickets: completedByTech.length,
      revenue,
      avgCompletionTime: avgCompletionTime.toFixed(1),
      completionRate: assignedTickets.length > 0 ? (completedByTech.length / assignedTickets.length) * 100 : 0
    };
  }).sort((a, b) => b.completedTickets - a.completedTickets);

  const recentTickets = filteredTickets
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

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
      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-200 dark:border-orange-800 rounded-xl p-6 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-orange-900 dark:text-orange-100">Service Center Report - {getTimeRangeLabel()}</h2>
            <p className="text-orange-700 dark:text-orange-300 mt-1">Comprehensive service performance and technician analytics</p>
          </div>
          <div className="bg-orange-100 dark:bg-orange-800/50 p-3 rounded-full">
            <Wrench className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Total Tickets</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{totalTickets}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{getTimeRangeLabel()}</p>
            </div>
            <div className="bg-blue-200 dark:bg-blue-800/50 p-3 rounded-full">
              <Wrench className="w-8 h-8 text-blue-700 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">Completed</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">{completedTickets}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">{completionRate.toFixed(1)}% rate</p>
            </div>
            <div className="bg-green-200 dark:bg-green-800/50 p-3 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-700 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Service Revenue</p>
              <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{formatCurrency(serviceRevenue)}</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">Total earnings</p>
            </div>
            <div className="bg-yellow-200 dark:bg-yellow-800/50 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-yellow-700 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-400">Avg Ticket Value</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{formatCurrency(averageTicketValue)}</p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Per completed job</p>
            </div>
            <div className="bg-purple-200 dark:bg-purple-800/50 p-3 rounded-full">
              <Target className="w-8 h-8 text-purple-700 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Service Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Type Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Services by Device Type</h3>
          <div className="space-y-3">
            {Object.entries(deviceTypeBreakdown).map(([type, count]) => {
              const percentage = totalTickets > 0 ? (count / totalTickets) * 100 : 0;
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{type}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{count}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Priority Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tickets by Priority</h3>
          <div className="space-y-3">
            {Object.entries(priorityBreakdown).map(([priority, count]) => {
              const percentage = totalTickets > 0 ? (count / totalTickets) * 100 : 0;
              const priorityColor = priority === 'urgent' ? 'text-red-600 dark:text-red-400' : 
                                  priority === 'high' ? 'text-orange-600 dark:text-orange-400' : 
                                  priority === 'medium' ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400';
              return (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      priority === 'urgent' ? 'bg-red-500 dark:bg-red-400' : 
                      priority === 'high' ? 'bg-orange-500 dark:bg-orange-400' : 
                      priority === 'medium' ? 'bg-yellow-500 dark:bg-yellow-400' : 'bg-green-500 dark:bg-green-400'
                    }`}></div>
                    <span className={`font-medium capitalize ${priorityColor}`}>{priority}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{count}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Cost Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cost Analysis</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-blue-700 dark:text-blue-400 font-medium">Service Charges</span>
                <span className="text-blue-900 dark:text-blue-100 font-bold">{formatCurrency(totalServiceCharge)}</span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                {totalServiceCharge + totalDiagnosticFee + totalPartsCost > 0 ? 
                  ((totalServiceCharge / (totalServiceCharge + totalDiagnosticFee + totalPartsCost)) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-orange-700 dark:text-orange-400 font-medium">Diagnostic Fees</span>
                <span className="text-orange-900 dark:text-orange-100 font-bold">{formatCurrency(totalDiagnosticFee)}</span>
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                {totalServiceCharge + totalDiagnosticFee + totalPartsCost > 0 ? 
                  ((totalDiagnosticFee / (totalServiceCharge + totalDiagnosticFee + totalPartsCost)) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-purple-700 dark:text-purple-400 font-medium">Parts Costs</span>
                <span className="text-purple-900 dark:text-purple-100 font-bold">{formatCurrency(totalPartsCost)}</span>
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                {totalServiceCharge + totalDiagnosticFee + totalPartsCost > 0 ? 
                  ((totalPartsCost / (totalServiceCharge + totalDiagnosticFee + totalPartsCost)) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-green-700 dark:text-green-400 font-medium">Total Revenue</span>
                <span className="text-green-900 dark:text-green-100 font-bold">{formatCurrency(serviceRevenue)}</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">From completed services</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technician Performance */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Technician Performance</h3>
          <div className="space-y-3">
            {technicianPerformance.map((technician, index) => (
              <div key={technician.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{technician.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{technician.completionRate.toFixed(1)}% completion rate</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Revenue</p>
                    <p className="font-bold text-green-600 dark:text-green-400">{formatCurrency(technician.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Completed</p>
                    <p className="font-medium text-gray-900 dark:text-white">{technician.completedTickets}/{technician.assignedTickets}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Avg Time</p>
                    <p className="font-medium text-gray-900 dark:text-white">{technician.avgCompletionTime} days</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {technicianPerformance.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p>No technician data available</p>
            </div>
          )}
        </Card>

        {/* Status Breakdown */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Status & Revenue Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(statusBreakdown).map(([status, data]) => {
              const percentage = totalTickets > 0 ? (data.count / totalTickets) * 100 : 0;
              const statusColor = status === 'completed' ? 'text-green-600 dark:text-green-400' : 
                                status === 'in_progress' ? 'text-blue-600 dark:text-blue-400' : 
                                status === 'received' ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-400';
              
              return (
                <div key={status} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium capitalize ${statusColor}`}>
                      {status.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Count: </span>
                      <span className="font-medium text-gray-900 dark:text-white">{data.count}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Revenue: </span>
                      <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(data.revenue)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Service Tickets</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-gray-900 dark:text-white">Ticket</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Device</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Priority</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Status</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Revenue</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2">
                    <p className="font-medium text-gray-900 dark:text-white">{ticket.ticketNumber}</p>
                  </td>
                  <td className="py-2">
                    <p className="text-gray-900 dark:text-white">{ticket.deviceBrand} {ticket.deviceModel}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{ticket.deviceType}</p>
                  </td>
                  <td className="py-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.priority === 'urgent' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                      ticket.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400' :
                      ticket.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                      'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      ticket.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                      ticket.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                      ticket.status === 'received' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2">
                    <p className="font-medium text-green-600 dark:text-green-400">
                      {formatCurrency((ticket.serviceCharge || 0) + (ticket.diagnosticFee || 0) + (ticket.partsCost || 0))}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      S: {formatCurrency(ticket.serviceCharge || 0)} | D: {formatCurrency(ticket.diagnosticFee || 0)} | P: {formatCurrency(ticket.partsCost || 0)}
                    </p>
                  </td>
                  <td className="py-2">
                    <p className="text-gray-900 dark:text-white">
                    {formatDate(ticket.createdAt)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {ticket.status === 'completed' && ticket.updatedAt ? 
                        `Completed ${formatDate(ticket.updatedAt)}` : 
                        'In progress'
                      }
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recentTickets.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Wrench className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            <p>No service tickets in this period</p>
          </div>
        )}
      </Card>
    </div>
  );
}