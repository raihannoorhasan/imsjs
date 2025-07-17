import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { DollarSign, Receipt } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/helpers';

export function PaymentList({ payments }) {
  const { students, enrollments, courses, courseBatches } = useInventory();

  const getPaymentDetails = (payment) => {
    const student = students.find(s => s.id === payment.studentId);
    const enrollment = payment.enrollmentId ? enrollments.find(e => e.id === payment.enrollmentId) : null;
    const course = enrollment ? courses.find(c => c.id === enrollment.courseId) : null;
    const batch = enrollment ? courseBatches.find(b => b.id === enrollment.batchId) : null;
    
    return { student, enrollment, course, batch };
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
                <StatusBadge status={payment.paymentType} />
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
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}