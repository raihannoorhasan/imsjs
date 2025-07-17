import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Wrench, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { Card } from '../common/Card';
import { formatCurrency, formatDate } from '../../utils/helpers';

export function ServiceReport() {
  const { serviceTickets, technicians, serviceInvoices } = useInventory();

  const totalTickets = serviceTickets.length;
  const completedTickets = serviceTickets.filter(ticket => ticket.status === 'completed').length;
  const pendingTickets = serviceTickets.filter(ticket => 
    ['received', 'diagnosed', 'in_progress'].includes(ticket.status)
  ).length;
  const serviceRevenue = serviceInvoices.reduce((sum, invoice) => sum + invoice.total, 0);

  const completionRate = totalTickets > 0 ? (completedTickets / totalTickets) * 100 : 0;

  const technicianPerformance = technicians.map(technician => {
    const assignedTickets = serviceTickets.filter(ticket => ticket.assignedTechnician === technician.id);
    const completedByTech = assignedTickets.filter(ticket => ticket.status === 'completed');
    const revenue = completedByTech.reduce((sum, ticket) => sum + ticket.laborCost + ticket.partsCost, 0);
    
    return {
      ...technician,
      assignedTickets: assignedTickets.length,
      completedTickets: completedByTech.length,
      revenue
    };
  }).sort((a, b) => b.completedTickets - a.completedTickets);

  const statusBreakdown = serviceTickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {});

  const recentTickets = serviceTickets
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{totalTickets}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedTickets}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingTickets}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Service Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(serviceRevenue)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technician Performance */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Technician Performance</h3>
          <div className="space-y-3">
            {technicianPerformance.map((technician, index) => (
              <div key={technician.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{technician.name}</p>
                    <p className="text-sm text-gray-600">{technician.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">{formatCurrency(technician.revenue)}</p>
                  <p className="text-sm text-gray-500">
                    {technician.completedTickets}/{technician.assignedTickets} completed
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Status Breakdown */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Status Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(statusBreakdown).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900 capitalize">
                  {status.replace('_', ' ')}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">{count}</span>
                  <span className="text-sm text-gray-500">
                    ({totalTickets > 0 ? ((count / totalTickets) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Service Tickets</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Ticket</th>
                <th className="text-left py-2">Device</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Cost</th>
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
                  </td>
                  <td className="py-2">
                    <span className="capitalize text-sm text-gray-600">{ticket.status.replace('_', ' ')}</span>
                  </td>
                  <td className="py-2 text-green-600">
                    {formatCurrency(ticket.laborCost + ticket.partsCost)}
                  </td>
                  <td className="py-2 text-gray-600">
                    {formatDate(ticket.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}