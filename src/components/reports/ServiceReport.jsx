import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Wrench, Clock, CheckCircle, DollarSign } from 'lucide-react';
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
  const totalLaborCost = filteredTickets.reduce((sum, ticket) => sum + (ticket.laborCost || 0), 0);
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
    const revenue = completedByTech.reduce((sum, ticket) => sum + ticket.laborCost + ticket.partsCost, 0);
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
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-orange-900">Service Center Report - {getTimeRangeLabel()}</h2>
            <p className="text-orange-700 mt-1">Comprehensive service performance and technician analytics</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-full">
            <Wrench className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Tickets</p>
              <p className="text-3xl font-bold text-blue-900">{totalTickets}</p>
              <p className="text-sm text-blue-600 mt-1">{getTimeRangeLabel()}</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-full">
              <Wrench className="w-8 h-8 text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Completed</p>
              <p className="text-3xl font-bold text-green-900">{completedTickets}</p>
              <p className="text-sm text-green-600 mt-1">{completionRate.toFixed(1)}% rate</p>
            </div>
            <div className="bg-green-200 p-3 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Service Revenue</p>
              <p className="text-3xl font-bold text-yellow-900">{formatCurrency(serviceRevenue)}</p>
              <p className="text-sm text-yellow-600 mt-1">Total earnings</p>
            </div>
            <div className="bg-yellow-200 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-yellow-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Avg Ticket Value</p>
              <p className="text-3xl font-bold text-purple-900">{formatCurrency(averageTicketValue)}</p>
              <p className="text-sm text-purple-600 mt-1">Per completed job</p>
            </div>
            <div className="bg-purple-200 p-3 rounded-full">
              <Target className="w-8 h-8 text-purple-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Service Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Type Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Services by Device Type</h3>
          <div className="space-y-3">
            {Object.entries(deviceTypeBreakdown).map(([type, count]) => {
              const percentage = totalTickets > 0 ? (count / totalTickets) * 100 : 0;
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-900 capitalize">{type}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Priority Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets by Priority</h3>
          <div className="space-y-3">
            {Object.entries(priorityBreakdown).map(([priority, count]) => {
              const percentage = totalTickets > 0 ? (count / totalTickets) * 100 : 0;
              const priorityColor = priority === 'urgent' ? 'text-red-600' : 
                                  priority === 'high' ? 'text-orange-600' : 
                                  priority === 'medium' ? 'text-yellow-600' : 'text-green-600';
              return (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      priority === 'urgent' ? 'bg-red-500' : 
                      priority === 'high' ? 'bg-orange-500' : 
                      priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <span className={`font-medium capitalize ${priorityColor}`}>{priority}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Cost Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-blue-700 font-medium">Labor Costs</span>
                <span className="text-blue-900 font-bold">{formatCurrency(totalLaborCost)}</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                {totalLaborCost + totalPartsCost > 0 ? 
                  ((totalLaborCost / (totalLaborCost + totalPartsCost)) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-purple-700 font-medium">Parts Costs</span>
                <span className="text-purple-900 font-bold">{formatCurrency(totalPartsCost)}</span>
              </div>
              <p className="text-sm text-purple-600 mt-1">
                {totalLaborCost + totalPartsCost > 0 ? 
                  ((totalPartsCost / (totalLaborCost + totalPartsCost)) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-green-700 font-medium">Total Revenue</span>
                <span className="text-green-900 font-bold">{formatCurrency(serviceRevenue)}</span>
              </div>
              <p className="text-sm text-green-600 mt-1">From completed services</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technician Performance */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Technician Performance</h3>
          <div className="space-y-3">
            {technicianPerformance.map((technician, index) => (
              <div key={technician.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{technician.name}</p>
                    <p className="text-sm text-gray-600">{technician.completionRate.toFixed(1)}% completion rate</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                  <div>
                    <p className="text-gray-600">Revenue</p>
                    <p className="font-bold text-green-600">{formatCurrency(technician.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Completed</p>
                    <p className="font-medium">{technician.completedTickets}/{technician.assignedTickets}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg Time</p>
                    <p className="font-medium">{technician.avgCompletionTime} days</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {technicianPerformance.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No technician data available</p>
            </div>
          )}
        </Card>

        {/* Status Breakdown */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Status & Revenue Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(statusBreakdown).map(([status, data]) => {
              const percentage = totalTickets > 0 ? (data.count / totalTickets) * 100 : 0;
              const statusColor = status === 'completed' ? 'text-green-600' : 
                                status === 'in_progress' ? 'text-blue-600' : 
                                status === 'received' ? 'text-yellow-600' : 'text-gray-600';
              
              return (
                <div key={status} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium capitalize ${statusColor}`}>
                      {status.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Count: </span>
                      <span className="font-medium">{data.count}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Revenue: </span>
                      <span className="font-medium text-green-600">{formatCurrency(data.revenue)}</span>
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
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Service Tickets</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Ticket</th>
                <th className="text-left py-2">Device</th>
                <th className="text-left py-2">Priority</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Revenue</th>
                <th className="text-left py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b">
                  <td className="py-2">
                    <p className="font-medium text-gray-900">{ticket.ticketNumber}</p>
                  </td>
                  <td className="py-2">
                    <p className="text-gray-900">{ticket.deviceBrand} {ticket.deviceModel}</p>
                    <p className="text-sm text-gray-500 capitalize">{ticket.deviceType}</p>
                  </td>
                  <td className="py-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      ticket.status === 'completed' ? 'bg-green-100 text-green-800' :
                      ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      ticket.status === 'received' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2">
                    <p className="font-medium text-green-600">
                      {formatCurrency((ticket.laborCost || 0) + (ticket.partsCost || 0))}
                    </p>
                    <p className="text-xs text-gray-500">
                      L: {formatCurrency(ticket.laborCost || 0)} | P: {formatCurrency(ticket.partsCost || 0)}
                    </p>
                  </td>
                  <td className="py-2">
                    <p className="text-gray-900">
                    {formatDate(ticket.createdAt)}
                    </p>
                    <p className="text-xs text-gray-500">
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
          <div className="text-center py-8 text-gray-500">
            <Wrench className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No service tickets in this period</p>
          </div>
        )}
      </Card>
    </div>
  );
}