import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, Receipt, Eye, Edit2, CheckCircle, XCircle } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/helpers';

export function PaymentList({ payments, onViewVoucher, onEditPayment, onApprovePayment, onDeclinePayment }) {
  const { students, enrollments, courses, courseBatches } = useInventory();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const getPaymentDetails = (payment) => {
    const student = students.find(s => s.id === payment.studentId);
    const enrollment = payment.enrollmentId ? enrollments.find(e => e.id === payment.enrollmentId) : null;
    const course = enrollment ? courses.find(c => c.id === enrollment.courseId) : null;
    const batch = enrollment ? courseBatches.find(b => b.id === enrollment.batchId) : null;
    
    return { student, enrollment, course, batch };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Course/Batch</TableHead>
          <TableHead>Payment Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Voucher</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => {
          const { student, course, batch } = getPaymentDetails(payment);
          
          return (
            <TableRow key={payment.id}>
              <TableCell>
                <div>
                  <p className="font-medium text-gray-900">{student?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-600">{student?.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm text-gray-900">{course?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{batch?.batchName || 'N/A'}</p>
                </div>
              </TableCell>
              <TableCell>
                <span className="capitalize text-sm font-medium text-gray-900">
                  {payment.paymentType ? payment.paymentType.replace('_', ' ') : 'N/A'}
                </span>
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
                <span className="text-sm text-gray-600">
                  {formatDate(payment.paymentDate)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-sm text-gray-600">
                  <Receipt size={14} className="mr-1" />
                  {payment.voucherNumber}
                </div>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                  {payment.status || 'pending'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewVoucher(payment)}
                    className="text-blue-600 hover:text-blue-800"
                    title="View Voucher"
                  >
                    <Eye size={16} />
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => onEditPayment(payment)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Edit Payment"
                      >
                        <Edit2 size={16} />
                      </button>
                      {payment.status !== 'approved' && (
                        <button
                          onClick={() => onApprovePayment(payment)}
                          className="text-green-600 hover:text-green-800"
                          title="Approve Payment"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {payment.status !== 'declined' && (
                        <button
                          onClick={() => onDeclinePayment(payment)}
                          className="text-red-600 hover:text-red-800"
                          title="Decline Payment"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}