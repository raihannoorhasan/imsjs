import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { useAuth } from '../../contexts/AuthContext';
import { Trash2, DollarSign, CheckCircle, XCircle, CreditCard, Edit2 } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/helpers';

export function EnrollmentList({ enrollments, onMakePayment, onDelete, onEdit }) {
  const { students, courses, courseBatches } = useInventory();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const getEnrollmentDetails = (enrollment) => {
    const student = students.find(s => s.id === enrollment.studentId);
    const course = courses.find(c => c.id === enrollment.courseId);
    const batch = courseBatches.find(b => b.id === enrollment.batchId);
    
    return { student, course, batch };
  };

  const getPaymentStatus = (enrollment) => {
    const paidPercentage = (enrollment.paidAmount / enrollment.totalAmount) * 100;
    if (paidPercentage === 100) return 'Fully Paid';
    if (paidPercentage > 0) return 'Partially Paid';
    return 'Unpaid';
  };

  const getFeeStatus = (enrollment, feeType) => {
    const course = courses.find(c => c.id === enrollment.courseId);
    if (!course) return false;
    
    let totalFee = 0;
    let paidAmount = 0;
    
    switch (feeType) {
      case 'admission':
        totalFee = course.admissionFee;
        paidAmount = enrollment.admissionFeeAmount || 0;
        break;
      case 'registration':
        totalFee = course.registrationFee;
        paidAmount = enrollment.registrationFeeAmount || 0;
        break;
      case 'exam':
        totalFee = course.examFee;
        paidAmount = enrollment.examFeeAmount || 0;
        break;
    }
    
    return paidAmount >= totalFee;
  };

  const getPaymentStatusColor = (enrollment) => {
    const paidPercentage = (enrollment.paidAmount / enrollment.totalAmount) * 100;
    if (paidPercentage === 100) return 'text-green-600';
    if (paidPercentage > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Course/Batch</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead>Fees Status</TableHead>
          <TableHead>Enrollment Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {enrollments.map((enrollment) => {
          const { student, course, batch } = getEnrollmentDetails(enrollment);
          
          return (
            <TableRow key={enrollment.id}>
              <TableCell>
                <div>
                  <p className="font-medium text-gray-900">{student?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-600">{student?.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm text-gray-900">{course?.name || 'Unknown Course'}</p>
                  <p className="text-sm text-gray-600">{batch?.batchName || 'Unknown Batch'}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className={`font-medium ${getPaymentStatusColor(enrollment)}`}>
                    {getPaymentStatus(enrollment)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(enrollment.paidAmount)} / {formatCurrency(enrollment.totalAmount)}
                  </p>
                  {enrollment.remainingAmount > 0 && (
                    <p className="text-xs text-red-600">
                      Remaining: {formatCurrency(enrollment.remainingAmount)}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center text-xs">
                    {getFeeStatus(enrollment, 'admission') ? (
                      <CheckCircle size={12} className="text-green-500 mr-1" />
                    ) : (
                      <XCircle size={12} className="text-red-500 mr-1" />
                    )}
                    <span>Admission</span>
                  </div>
                  <div className="flex items-center text-xs">
                    {getFeeStatus(enrollment, 'registration') ? (
                      <CheckCircle size={12} className="text-green-500 mr-1" />
                    ) : (
                      <XCircle size={12} className="text-red-500 mr-1" />
                    )}
                    <span>Registration</span>
                  </div>
                  <div className="flex items-center text-xs">
                    {getFeeStatus(enrollment, 'exam') ? (
                      <CheckCircle size={12} className="text-green-500 mr-1" />
                    ) : (
                      <XCircle size={12} className="text-red-500 mr-1" />
                    )}
                    <span>Exam</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {formatDate(enrollment.enrollmentDate)}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={enrollment.status} />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onMakePayment(enrollment)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Make Payment"
                  >
                    <CreditCard size={16} />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => onEdit(enrollment)}
                      className="text-green-600 hover:text-green-800"
                      title="Edit Enrollment"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  {isAdmin && (
                  <button
                    onClick={() => onDelete(enrollment.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Enrollment"
                  >
                    <Trash2 size={16} />
                  </button>
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