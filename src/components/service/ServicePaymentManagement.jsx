import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, DollarSign, Search, CheckCircle, XCircle, Eye, Edit2 } from 'lucide-react';
import { Button } from '../common/Button';
import { SearchInput } from '../common/SearchInput';
import { Select } from '../common/Select';
import { Card } from '../common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { ServicePaymentForm } from './ServicePaymentForm';
import { ServicePaymentView } from './ServicePaymentView';
import { ServicePaymentApproval } from './ServicePaymentApproval';
import { ServicePaymentEditForm } from './ServicePaymentEditForm';
import { formatCurrency, formatDate } from '../../utils/helpers';

export function ServicePaymentManagement() {
  const { 
    servicePayments, 
    addServicePayment, 
    updateServicePayment,
    deleteServicePayment,
    customers, 
    serviceTickets,
    sales,
    products
  } = useInventory();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPaymentView, setShowPaymentView] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [approvalAction, setApprovalAction] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  const handleAddPayment = (paymentData) => {
    addServicePayment(paymentData);
    setShowPaymentForm(false);
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentView(true);
  };

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment);
    setShowEditForm(true);
  };

  const handleUpdatePayment = (paymentData) => {
    updateServicePayment(selectedPayment.id, paymentData);
    setShowEditForm(false);
    setSelectedPayment(null);
  };

  const handleDeletePayment = (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      deleteServicePayment(paymentId);
    }
  };

  const handleApprovePayment = (payment) => {
    setSelectedPayment(payment);
    setApprovalAction('approve');
    setShowApprovalModal(true);
  };

  const handleDeclinePayment = (payment) => {
    setSelectedPayment(payment);
    setApprovalAction('decline');
    setShowApprovalModal(true);
  };

  const handleApprovalSubmit = (paymentId, message) => {
    const updateData = {
      status: approvalAction === 'approve' ? 'approved' : 'declined',
      adminMessage: message,
      approvedBy: currentUser?.name,
      approvedAt: new Date()
    };
    
    updateServicePayment(paymentId, updateData);
    setShowApprovalModal(false);
    setSelectedPayment(null);
    setApprovalAction('');
  };

  const getPaymentDetails = (payment) => {
    const customer = customers.find(c => c.id === payment.customerId);
    const ticket = serviceTickets.find(t => t.id === payment.serviceTicketId);
    const relatedSale = payment.relatedSaleId ? sales.find(s => s.id === payment.relatedSaleId) : null;
    
    return { customer, ticket, relatedSale };
  };

  const filteredPayments = servicePayments.filter(payment => {
    const { customer, ticket, relatedSale } = getPaymentDetails(payment);
    
    const matchesSearch = 
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket?.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (relatedSale && relatedSale.id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalPayments = filteredPayments.length;
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const approvedPayments = filteredPayments.filter(p => p.status === 'approved').length;
  const pendingPayments = filteredPayments.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Service Payment Management</h2>
            <p className="text-gray-600 mt-1">Track and manage service payments and approvals</p>
          </div>
          <Button 
            onClick={() => setShowPaymentForm(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <DollarSign size={20} className="mr-2" />
            Record Payment
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Search payments, customers, tickets..."
            className="w-full"
          />
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </Select>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Payments</p>
              <p className="text-3xl font-bold text-blue-900">{totalPayments}</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Total Amount</p>
              <p className="text-3xl font-bold text-green-900">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="bg-green-200 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">Approved</p>
              <p className="text-3xl font-bold text-emerald-900">{approvedPayments}</p>
            </div>
            <div className="bg-emerald-200 p-3 rounded-full">
              <CheckCircle className="w-8 h-8 text-emerald-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Pending</p>
              <p className="text-3xl font-bold text-yellow-900">{pendingPayments}</p>
            </div>
            <div className="bg-yellow-200 p-3 rounded-full">
              <XCircle className="w-8 h-8 text-yellow-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Results Summary */}
      {(searchTerm || statusFilter !== 'all') && (
        <div className="text-sm text-gray-600 px-1">
          Found {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''} 
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search criteria or filters'
                : 'Service payments will appear here when customers make payments'
              }
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service Ticket</TableHead>
                <TableHead>Payment Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => {
                const { customer, ticket, relatedSale } = getPaymentDetails(payment);
                
                return (
                  <TableRow key={payment.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{payment.receiptNumber}</p>
                        <p className="text-sm text-gray-600">{formatDate(payment.createdAt)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{customer?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{customer?.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{ticket?.ticketNumber || 'N/A'}</p>
                        <p className="text-xs text-gray-500">
                          {ticket?.deviceBrand} {ticket?.deviceModel}
                          {relatedSale && (
                            <span className="ml-2 text-purple-600">• Sale #{relatedSale.id.slice(-6)}</span>
                          )}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {payment.paymentType.replace('_', ' ')}
                        </span>
                        {payment.paymentType === 'parts_payment' && relatedSale && (
                          <p className="text-xs text-purple-600 mt-1">Linked to POS sale</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-green-600">
                        <DollarSign size={14} className="mr-1" />
                        <span className="font-medium">{formatCurrency(payment.amount)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize text-sm text-gray-600">{payment.paymentMethod}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{formatDate(payment.paymentDate)}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewPayment(payment)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          title="View Payment"
                        >
                          <Eye size={16} />
                        </button>
                        {isAdmin && payment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleEditPayment(payment)}
                              className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-50"
                              title="Edit Payment"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeletePayment(payment.id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                              title="Delete Payment"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </>
                        )}
                        {isAdmin && payment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprovePayment(payment)}
                              className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                              title="Approve Payment"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleDeclinePayment(payment)}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                              title="Decline Payment"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <ServicePaymentForm
        isOpen={showPaymentForm}
        onClose={() => setShowPaymentForm(false)}
        onSubmit={handleAddPayment}
      />

      {selectedPayment && (
        <ServicePaymentView
          isOpen={showPaymentView}
          onClose={() => {
            setShowPaymentView(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
        />
      )}

      {isAdmin && selectedPayment && (
        <ServicePaymentEditForm
          isOpen={showEditForm}
          onClose={() => {
            setShowEditForm(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
          onSubmit={handleUpdatePayment}
        />
      )}

      {isAdmin && selectedPayment && (
        <ServicePaymentApproval
          isOpen={showApprovalModal}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedPayment(null);
            setApprovalAction('');
          }}
          payment={selectedPayment}
          action={approvalAction}
          onSubmit={handleApprovalSubmit}
        />
      )}
    </div>
  );
}