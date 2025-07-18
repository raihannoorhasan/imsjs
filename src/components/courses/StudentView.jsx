import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Heart, 
  Shield,
  Printer,
  Edit2,
  BookOpen,
  Award,
  Clock,
  DollarSign
} from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/helpers';

export function StudentView({ isOpen, onClose, student, onEdit }) {
  const { enrollments, courses, courseBatches, coursePayments } = useInventory();

  if (!student) return null;

  const studentEnrollments = enrollments.filter(e => e.studentId === student.id);
  const studentPayments = coursePayments.filter(p => p.studentId === student.id);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Pop-up blocker is preventing the print. Please disable pop-up blocker for this site and try again.');
      return;
    }
    
    const profileContent = document.getElementById('student-profile-content').innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Profile - ${student.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
            .profile { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 28px; font-weight: bold; color: #1e40af; margin-bottom: 5px; }
            .company-tagline { color: #6b7280; font-size: 14px; }
            .student-header { display: flex; align-items: center; gap: 20px; margin: 30px 0; }
            .profile-image { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid #e5e7eb; }
            .profile-placeholder { width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #dbeafe, #bfdbfe); display: flex; align-items: center; justify-content: center; border: 4px solid #e5e7eb; }
            .student-info h1 { margin: 0; font-size: 24px; color: #1f2937; }
            .student-info p { margin: 5px 0; color: #6b7280; }
            .section { margin: 30px 0; }
            .section h2 { color: #1f2937; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .info-item { padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
            .info-label { font-weight: 600; color: #4b5563; margin-bottom: 5px; }
            .info-value { color: #1f2937; }
            .enrollment-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin: 10px 0; }
            .status-badge { display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
            .status-active { background: #dcfce7; color: #166534; }
            .status-completed { background: #e0e7ff; color: #3730a3; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
            @media print { body { margin: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          ${profileContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const getEnrollmentDetails = (enrollment) => {
    const course = courses.find(c => c.id === enrollment.courseId);
    const batch = courseBatches.find(b => b.id === enrollment.batchId);
    return { course, batch };
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getTotalPayments = () => {
    return studentPayments
      .filter(p => p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="xl" showCloseButton={false}>
      {/* Custom Header */}
      <div className="no-print flex justify-between items-center mb-6 pb-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Student Profile</h2>
            <p className="text-gray-600">Complete student information and records</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print Profile
          </Button>
          <Button variant="outline" onClick={() => onEdit(student)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Profile Content */}
      <div id="student-profile-content">
        <div className="profile">
          {/* Header for Print */}
          <div className="header" style={{ display: 'none' }}>
            <div className="company-name">Hi Tech Computer</div>
            <div className="company-tagline">Professional Computer Training Institute</div>
            <div style={{ marginTop: '10px', color: '#6b7280', fontSize: '14px' }}>
              📍 123 Tech Street, Silicon Valley | 📞 +1-555-0123 | ✉️ info@hitechcomputer.com
            </div>
          </div>

          {/* Student Header */}
          <div className="student-header bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
            <div className="flex items-center space-x-6">
              {student.profileImage ? (
                <img
                  src={student.profileImage}
                  alt={student.name}
                  className="profile-image w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="profile-placeholder w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center border-4 border-white shadow-lg">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{student.name}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail size={16} className="mr-2" />
                    <span>{student.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone size={16} className="mr-2" />
                    <span>{student.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>Age: {calculateAge(student.dateOfBirth)} years</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User size={16} className="mr-2" />
                    <span className="capitalize">{student.gender || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Information Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="section bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h2>
              <div className="space-y-3">
                <div className="info-item">
                  <div className="info-label">Full Name</div>
                  <div className="info-value font-medium">{student.name}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Date of Birth</div>
                  <div className="info-value">{student.dateOfBirth ? formatDate(student.dateOfBirth) : 'Not provided'}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Gender</div>
                  <div className="info-value capitalize">{student.gender || 'Not specified'}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">National ID</div>
                  <div className="info-value">{student.nationalId || 'Not provided'}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Current Occupation</div>
                  <div className="info-value">{student.currentOccupation || 'Not specified'}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Work Experience</div>
                  <div className="info-value">{student.workExperience ? `${student.workExperience} years` : 'Not specified'}</div>
                </div>
              </div>
            </div>

            {/* Education Information */}
            <div className="section bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-green-600" />
                Education Background
              </h2>
              <div className="space-y-3">
                <div className="info-item">
                  <div className="info-label">Education Level</div>
                  <div className="info-value capitalize">{student.educationLevel?.replace('_', ' ') || 'Not specified'}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Institution</div>
                  <div className="info-value">{student.institution || 'Not provided'}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Field of Study</div>
                  <div className="info-value">{student.fieldOfStudy || 'Not specified'}</div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="section bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                Contact Information
              </h2>
              <div className="space-y-3">
                <div className="info-item">
                  <div className="info-label">Email</div>
                  <div className="info-value">{student.email}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Phone</div>
                  <div className="info-value">{student.phone}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Address</div>
                  <div className="info-value">
                    {[student.address, student.city, student.state, student.zipCode, student.country]
                      .filter(Boolean)
                      .join(', ') || 'Not provided'}
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="section bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-red-600" />
                Emergency Contact
              </h2>
              <div className="space-y-3">
                <div className="info-item">
                  <div className="info-label">Contact Name</div>
                  <div className="info-value">{student.emergencyContactName || 'Not provided'}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Phone Number</div>
                  <div className="info-value">{student.emergencyContactPhone || 'Not provided'}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Relationship</div>
                  <div className="info-value capitalize">{student.emergencyContactRelation || 'Not specified'}</div>
                </div>
                {student.guardianName && (
                  <>
                    <div className="info-item">
                      <div className="info-label">Guardian Name</div>
                      <div className="info-value">{student.guardianName}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Guardian Phone</div>
                      <div className="info-value">{student.guardianPhone || 'Not provided'}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Enrollments Section */}
          {studentEnrollments.length > 0 && (
            <div className="section bg-white border border-gray-200 rounded-lg p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
                Course Enrollments
              </h2>
              <div className="space-y-4">
                {studentEnrollments.map((enrollment) => {
                  const { course, batch } = getEnrollmentDetails(enrollment);
                  const paymentProgress = enrollment.totalAmount > 0 ? (enrollment.paidAmount / enrollment.totalAmount) * 100 : 0;
                  
                  return (
                    <div key={enrollment.id} className="enrollment-card border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{course?.name || 'Unknown Course'}</h3>
                          <p className="text-sm text-gray-600">{batch?.batchName || 'Unknown Batch'}</p>
                        </div>
                        <span className={`status-badge ${enrollment.status === 'active' ? 'status-active' : 'status-completed'}`}>
                          {enrollment.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Enrolled:</span>
                          <span className="ml-2 font-medium">{formatDate(enrollment.enrollmentDate)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Fee:</span>
                          <span className="ml-2 font-medium text-blue-600">{formatCurrency(enrollment.totalAmount)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Paid:</span>
                          <span className="ml-2 font-medium text-green-600">{formatCurrency(enrollment.paidAmount)}</span>
                        </div>
                      </div>
                      
                      {/* Payment Progress Bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Payment Progress</span>
                          <span className="font-medium">{paymentProgress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${paymentProgress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${paymentProgress}%` }}
                          ></div>
                        </div>
                        {enrollment.remainingAmount > 0 && (
                          <p className="text-xs text-red-600 mt-1">
                            Remaining: {formatCurrency(enrollment.remainingAmount)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Payment Summary */}
          {studentPayments.length > 0 && (
            <div className="section bg-white border border-gray-200 rounded-lg p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Payment Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-green-700">Total Payments</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(getTotalPayments())}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-blue-700">Total Transactions</p>
                  <p className="text-2xl font-bold text-blue-900">{studentPayments.filter(p => p.status === 'approved').length}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-purple-700">Pending Payments</p>
                  <p className="text-2xl font-bold text-purple-900">{studentPayments.filter(p => p.status === 'pending').length}</p>
                </div>
              </div>
            </div>
          )}

          {/* Additional Information */}
          {(student.medicalConditions || student.specialNeeds) && (
            <div className="section bg-white border border-gray-200 rounded-lg p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-pink-600" />
                Additional Information
              </h2>
              <div className="space-y-3">
                {student.medicalConditions && (
                  <div className="info-item">
                    <div className="info-label">Medical Conditions</div>
                    <div className="info-value">{student.medicalConditions}</div>
                  </div>
                )}
                {student.specialNeeds && (
                  <div className="info-item">
                    <div className="info-label">Special Needs</div>
                    <div className="info-value">{student.specialNeeds}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer for Print */}
          <div className="footer" style={{ display: 'none' }}>
            <div style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>
              Hi Tech Computer - Student Profile
            </div>
            <div>
              Generated on {formatDate(new Date())} | Student ID: {student.id}
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          .header { display: block !important; }
          .footer { display: block !important; }
          .profile { max-width: none; }
          .student-header { page-break-inside: avoid; }
          .section { page-break-inside: avoid; margin-bottom: 20px; }
        }
      `}</style>
    </Modal>
  );
}