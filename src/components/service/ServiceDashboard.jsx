import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Wrench, Clock, CheckCircle, DollarSign, AlertTriangle, TrendingUp, Users, Calendar } from 'lucide-react';
import { Card } from '../common/Card';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';

export function ServiceDashboard() {
  const { serviceTickets, technicians, serviceInvoices, customers } = useInventory();
  const { isDark } = useTheme();

  // Calculate statistics
  const totalTickets = serviceTickets.length;
  const activeTickets = serviceTickets.filter(ticket => 
    ['received', 'diagnosed', 'in_progress', 'waiting_approval'].includes(ticket.status)
  ).length;
  const completedTickets = serviceTickets.filter(ticket => ticket.status === 'completed').length;
  const totalRevenue = serviceInvoices.reduce((sum, invoice) => sum + invoice.total, 0);

  // Recent tickets
  const recentTickets = serviceTickets
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Urgent tickets
  const urgentTickets = serviceTickets.filter(ticket => 
    ticket.priority === 'urgent' && !['completed', 'delivered', 'cancelled'].includes(ticket.status)
  );

  // Top technicians
  const technicianStats = technicians.map(technician => {
    const assignedTickets = serviceTickets.filter(ticket => ticket.assignedTechnician === technician.id);
    const completedByTech = assignedTickets.filter(ticket => ticket.status === 'completed');
    return {
      ...technician,
      assignedCount: assignedTickets.length,
      completedCount: completedByTech.length,
      completionRate: assignedTickets.length > 0 ? (completedByTech.length / assignedTickets.length) * 100 : 0
    };
  }).sort((a, b) => b.completedCount - a.completedCount).slice(0, 3);

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const stats = [
    {
      title: 'Total Tickets',
      value: totalTickets,
      icon: Wrench,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Tickets',
      value: activeTickets,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Completed',
      value: completedTickets,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+18%',
      changeType: 'positive'
    },
    {
      title: 'Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+25%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400 mr-1" />
                    <span className="text-sm text-green-600 dark:text-green-400">{stat.change}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`${stat.bgColor} dark:bg-opacity-20 p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tickets</h3>
            <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-3">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900 dark:text-white">{ticket.ticketNumber}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{getCustomerName(ticket.customerId)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{ticket.deviceBrand} {ticket.deviceModel}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(ticket.createdAt)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{ticket.priority} priority</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Technicians */}
        <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Technicians</h3>
            <Users className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-3">
            {technicianStats.map((technician, index) => (
              <div key={technician.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{technician.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{technician.completedCount} completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">{technician.completionRate.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">completion rate</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Urgent Tickets Alert */}
      {urgentTickets.length > 0 && (
        <Card className="p-6 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">Urgent Tickets Require Attention</h3>
              <p className="text-red-700 dark:text-red-300">
                {urgentTickets.length} urgent ticket{urgentTickets.length !== 1 ? 's' : ''} need immediate attention
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {urgentTickets.slice(0, 3).map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-red-200 dark:border-red-800">
                <span className="font-medium text-gray-900 dark:text-white">{ticket.ticketNumber}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{getCustomerName(ticket.customerId)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}