import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Calendar, Clock, Plus, Search, Filter, Edit, Trash2, UserPlus, GraduationCap, DollarSign, FileText, CheckCircle, AlertCircle, XCircle, X, Save, Eye, Download, Printer as Print } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  description: string;
  duration: string;
  instructor: string;
  fee: number;
  materials: string[];
  status: 'active' | 'inactive';
}

interface Batch {
  id: string;
  courseId: string;
  courseName: string;
  name: string;
  startDate: string;
  endDate: string;
  schedule: string;
  maxStudents: number;
  enrolledStudents: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Enrollment {
  id: string;
  studentId: string;
  batchId: string;
  courseId: string;
  enrollmentDate: string;
  admissionFee: number;
  registrationFee: number;
  examFee: number;
  totalFee: number;
  paidAmount: number;
  status: 'pending' | 'confirmed' | 'completed';
  student: Student;
  batch: Batch;
  course: Course;
}

interface PaymentVoucher {
  id: string;
  enrollmentId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer';
  voucherNumber: string;
  status: 'paid' | 'pending';
  studentName: string;
  courseName: string;
  batchName: string;
}

export function Courses() {
  const [activeTab, setActiveTab] = useState<'courses' | 'batches' | 'enrollments' | 'vouchers'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [vouchers, setVouchers] = useState<PaymentVoucher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<PaymentVoucher | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  // Form states
  const [courseForm, setCourseForm] = useState({
    name: '',
    description: '',
    duration: '',
    instructor: '',
    fee: 0,
    materials: [''],
    status: 'active' as const
  });

  const [batchForm, setBatchForm] = useState({
    courseId: '',
    name: '',
    startDate: '',
    endDate: '',
    schedule: '',
    maxStudents: 25,
    status: 'upcoming' as const
  });

  const [enrollmentForm, setEnrollmentForm] = useState({
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    studentAddress: '',
    batchId: '',
    admissionFee: 5000,
    registrationFee: 2000,
    examFee: 1000
  });

  // Sample data initialization
  useEffect(() => {
    const sampleCourses: Course[] = [
      {
        id: '1',
        name: 'Web Development Fundamentals',
        description: 'Learn HTML, CSS, JavaScript and modern web development practices with hands-on projects',
        duration: '3 months',
        instructor: 'John Smith',
        fee: 15000,
        materials: ['HTML/CSS Guide', 'JavaScript Handbook', 'Project Templates', 'Code Editor Setup'],
        status: 'active'
      },
      {
        id: '2',
        name: 'React.js Mastery',
        description: 'Advanced React development with hooks, context, Redux and modern patterns',
        duration: '2 months',
        instructor: 'Sarah Johnson',
        fee: 20000,
        materials: ['React Documentation', 'Component Library', 'Best Practices Guide', 'Testing Framework'],
        status: 'active'
      },
      {
        id: '3',
        name: 'Full Stack Development',
        description: 'Complete full stack development with Node.js, Express, MongoDB and React',
        duration: '6 months',
        instructor: 'Mike Wilson',
        fee: 35000,
        materials: ['Backend Guide', 'Database Design', 'API Development', 'Deployment Guide', 'Security Practices'],
        status: 'active'
      }
    ];

    const sampleBatches: Batch[] = [
      {
        id: '1',
        courseId: '1',
        courseName: 'Web Development Fundamentals',
        name: 'WDF-2024-01',
        startDate: '2024-02-01',
        endDate: '2024-04-30',
        schedule: 'Mon, Wed, Fri - 6:00 PM to 8:00 PM',
        maxStudents: 25,
        enrolledStudents: 18,
        status: 'ongoing'
      },
      {
        id: '2',
        courseId: '2',
        courseName: 'React.js Mastery',
        name: 'RJM-2024-01',
        startDate: '2024-03-01',
        endDate: '2024-04-30',
        schedule: 'Tue, Thu - 7:00 PM to 9:00 PM',
        maxStudents: 20,
        enrolledStudents: 15,
        status: 'upcoming'
      },
      {
        id: '3',
        courseId: '3',
        courseName: 'Full Stack Development',
        name: 'FSD-2024-01',
        startDate: '2024-01-15',
        endDate: '2024-07-15',
        schedule: 'Mon, Wed, Fri - 5:00 PM to 7:00 PM',
        maxStudents: 30,
        enrolledStudents: 22,
        status: 'ongoing'
      },
      {
        id: '4',
        courseId: '1',
        courseName: 'Web Development Fundamentals',
        name: 'WDF-2024-02',
        startDate: '2024-04-01',
        endDate: '2024-06-30',
        schedule: 'Sat, Sun - 10:00 AM to 1:00 PM',
        maxStudents: 20,
        enrolledStudents: 8,
        status: 'upcoming'
      }
    ];

    const sampleEnrollments: Enrollment[] = [
      {
        id: '1',
        studentId: '1',
        batchId: '1',
        courseId: '1',
        enrollmentDate: '2024-01-15',
        admissionFee: 5000,
        registrationFee: 2000,
        examFee: 1000,
        totalFee: 23000,
        paidAmount: 15000,
        status: 'confirmed',
        student: {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          phone: '+1-234-567-8901',
          address: '123 Main St, City, State 12345'
        },
        batch: sampleBatches[0],
        course: sampleCourses[0]
      },
      {
        id: '2',
        studentId: '2',
        batchId: '2',
        courseId: '2',
        enrollmentDate: '2024-02-10',
        admissionFee: 5000,
        registrationFee: 2000,
        examFee: 1000,
        totalFee: 28000,
        paidAmount: 28000,
        status: 'completed',
        student: {
          id: '2',
          name: 'Bob Smith',
          email: 'bob@example.com',
          phone: '+1-234-567-8902',
          address: '456 Oak Ave, City, State 12345'
        },
        batch: sampleBatches[1],
        course: sampleCourses[1]
      }
    ];

    const sampleVouchers: PaymentVoucher[] = [
      {
        id: '1',
        enrollmentId: '1',
        amount: 15000,
        paymentDate: '2024-01-15',
        paymentMethod: 'cash',
        voucherNumber: 'PAY-2024-001',
        status: 'paid',
        studentName: 'Alice Johnson',
        courseName: 'Web Development Fundamentals',
        batchName: 'WDF-2024-01'
      },
      {
        id: '2',
        enrollmentId: '2',
        amount: 28000,
        paymentDate: '2024-02-10',
        paymentMethod: 'bank_transfer',
        voucherNumber: 'PAY-2024-002',
        status: 'paid',
        studentName: 'Bob Smith',
        courseName: 'React.js Mastery',
        batchName: 'RJM-2024-01'
      }
    ];

    setCourses(sampleCourses);
    setBatches(sampleBatches);
    setEnrollments(sampleEnrollments);
    setVouchers(sampleVouchers);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'ongoing':
      case 'confirmed':
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'upcoming':
      case 'pending':
        return 'text-orange-600 bg-orange-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'inactive':
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      setCourses(courses.map(course => 
        course.id === editingCourse.id 
          ? { ...courseForm, id: editingCourse.id }
          : course
      ));
    } else {
      const newCourse: Course = {
        ...courseForm,
        id: Date.now().toString(),
      };
      setCourses([...courses, newCourse]);
    }
    setShowCourseForm(false);
    setEditingCourse(null);
    setCourseForm({
      name: '',
      description: '',
      duration: '',
      instructor: '',
      fee: 0,
      materials: [''],
      status: 'active'
    });
  };

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCourse = courses.find(c => c.id === batchForm.courseId);
    if (!selectedCourse) return;

    if (editingBatch) {
      setBatches(batches.map(batch => 
        batch.id === editingBatch.id 
          ? { 
              ...batchForm, 
              id: editingBatch.id,
              courseName: selectedCourse.name,
              enrolledStudents: editingBatch.enrolledStudents
            }
          : batch
      ));
    } else {
      const newBatch: Batch = {
        ...batchForm,
        id: Date.now().toString(),
        courseName: selectedCourse.name,
        enrolledStudents: 0
      };
      setBatches([...batches, newBatch]);
    }
    setShowBatchForm(false);
    setEditingBatch(null);
    setBatchForm({
      courseId: '',
      name: '',
      startDate: '',
      endDate: '',
      schedule: '',
      maxStudents: 25,
      status: 'upcoming'
    });
  };

  const handleEnrollmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedBatch = batches.find(b => b.id === enrollmentForm.batchId);
    const selectedCourse = courses.find(c => c.id === selectedBatch?.courseId);
    
    if (!selectedBatch || !selectedCourse) return;

    const totalFee = enrollmentForm.admissionFee + enrollmentForm.registrationFee + enrollmentForm.examFee + selectedCourse.fee;
    
    const newStudent: Student = {
      id: Date.now().toString(),
      name: enrollmentForm.studentName,
      email: enrollmentForm.studentEmail,
      phone: enrollmentForm.studentPhone,
      address: enrollmentForm.studentAddress
    };

    const newEnrollment: Enrollment = {
      id: Date.now().toString(),
      studentId: newStudent.id,
      batchId: selectedBatch.id,
      courseId: selectedCourse.id,
      enrollmentDate: new Date().toISOString().split('T')[0],
      admissionFee: enrollmentForm.admissionFee,
      registrationFee: enrollmentForm.registrationFee,
      examFee: enrollmentForm.examFee,
      totalFee,
      paidAmount: 0,
      status: 'pending',
      student: newStudent,
      batch: selectedBatch,
      course: selectedCourse
    };

    setEnrollments([...enrollments, newEnrollment]);
    
    // Update batch enrolled students count
    setBatches(batches.map(batch => 
      batch.id === selectedBatch.id 
        ? { ...batch, enrolledStudents: batch.enrolledStudents + 1 }
        : batch
    ));

    setShowEnrollmentForm(false);
    setEnrollmentForm({
      studentName: '',
      studentEmail: '',
      studentPhone: '',
      studentAddress: '',
      batchId: '',
      admissionFee: 5000,
      registrationFee: 2000,
      examFee: 1000
    });
  };

  const deleteBatch = (batchId: string) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      setBatches(batches.filter(batch => batch.id !== batchId));
    }
  };

  const renderCourses = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Courses Management
          </h2>
          <p className="text-gray-600 mt-1">Create and manage your educational courses</p>
        </div>
        <button
          onClick={() => setShowCourseForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Add New Course
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search courses by name or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses
          .filter(course => {
            const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
            return matchesSearch && matchesStatus;
          })
          .map((course) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600" />
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{course.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4 text-green-500" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold">₹{course.fee.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {course.materials.slice(0, 2).map((material, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-lg font-medium">
                      {material}
                    </span>
                  ))}
                  {course.materials.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
                      +{course.materials.length - 2} more
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCourse(course);
                      setCourseForm(course);
                      setShowCourseForm(true);
                    }}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => {
                      setBatchForm({ ...batchForm, courseId: course.id });
                      setShowBatchForm(true);
                    }}
                    className="flex-1 bg-green-50 text-green-600 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Batch
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Course Form Modal */}
      {showCourseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h3>
                <button
                  onClick={() => {
                    setShowCourseForm(false);
                    setEditingCourse(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCourseSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
                  <input
                    type="text"
                    required
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter course name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    required
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 3 months"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter course description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
                  <input
                    type="text"
                    required
                    value={courseForm.instructor}
                    onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter instructor name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={courseForm.fee}
                    onChange={(e) => setCourseForm({ ...courseForm, fee: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter course fee"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Materials</label>
                {courseForm.materials.map((material, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={material}
                      onChange={(e) => {
                        const newMaterials = [...courseForm.materials];
                        newMaterials[index] = e.target.value;
                        setCourseForm({ ...courseForm, materials: newMaterials });
                      }}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter material name"
                    />
                    {courseForm.materials.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newMaterials = courseForm.materials.filter((_, i) => i !== index);
                          setCourseForm({ ...courseForm, materials: newMaterials });
                        }}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setCourseForm({ ...courseForm, materials: [...courseForm.materials, ''] })}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Material
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={courseForm.status}
                  onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCourseForm(false);
                    setEditingCourse(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderBatches = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Batch Management
          </h2>
          <p className="text-gray-600 mt-1">Organize students into batches and manage schedules</p>
        </div>
        <button
          onClick={() => setShowBatchForm(true)}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Create New Batch
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Batches</p>
              <p className="text-3xl font-bold">{batches.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Ongoing</p>
              <p className="text-3xl font-bold">{batches.filter(b => b.status === 'ongoing').length}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Upcoming</p>
              <p className="text-3xl font-bold">{batches.filter(b => b.status === 'upcoming').length}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Students</p>
              <p className="text-3xl font-bold">{batches.reduce((sum, batch) => sum + batch.enrolledStudents, 0)}</p>
            </div>
            <GraduationCap className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search batches by name or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches
          .filter(batch => {
            const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                batch.courseName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || batch.status === filterStatus;
            return matchesSearch && matchesStatus;
          })
          .map((batch) => (
            <div key={batch.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
              <div className={`h-2 ${
                batch.status === 'ongoing' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                batch.status === 'upcoming' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                batch.status === 'completed' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                'bg-gradient-to-r from-red-500 to-red-600'
              }`} />
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{batch.name}</h3>
                    <p className="text-sm text-gray-600 font-medium">{batch.courseName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                    {batch.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span>{batch.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span>{batch.enrolledStudents}/{batch.maxStudents} students</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span className="font-medium">Enrollment Progress</span>
                    <span className="font-semibold">{Math.round((batch.enrolledStudents / batch.maxStudents) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(batch.enrolledStudents / batch.maxStudents) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingBatch(batch);
                      setBatchForm({
                        courseId: batch.courseId,
                        name: batch.name,
                        startDate: batch.startDate,
                        endDate: batch.endDate,
                        schedule: batch.schedule,
                        maxStudents: batch.maxStudents,
                        status: batch.status
                      });
                      setShowBatchForm(true);
                    }}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => {
                      setEnrollmentForm({ ...enrollmentForm, batchId: batch.id });
                      setShowEnrollmentForm(true);
                    }}
                    className="flex-1 bg-green-50 text-green-600 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                  >
                    <UserPlus className="w-4 h-4" />
                    Enroll
                  </button>
                  <button
                    onClick={() => deleteBatch(batch.id)}
                    className="bg-red-50 text-red-600 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Batch Form Modal */}
      {showBatchForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingBatch ? 'Edit Batch' : 'Create New Batch'}
                </h3>
                <button
                  onClick={() => {
                    setShowBatchForm(false);
                    setEditingBatch(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleBatchSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                  <select
                    required
                    value={batchForm.courseId}
                    onChange={(e) => setBatchForm({ ...batchForm, courseId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a course</option>
                    {courses.filter(c => c.status === 'active').map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batch Name</label>
                  <input
                    type="text"
                    required
                    value={batchForm.name}
                    onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., WDF-2024-01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    required
                    value={batchForm.startDate}
                    onChange={(e) => setBatchForm({ ...batchForm, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    required
                    value={batchForm.endDate}
                    onChange={(e) => setBatchForm({ ...batchForm, endDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                <input
                  type="text"
                  required
                  value={batchForm.schedule}
                  onChange={(e) => setBatchForm({ ...batchForm, schedule: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Mon, Wed, Fri - 6:00 PM to 8:00 PM"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Students</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={batchForm.maxStudents}
                    onChange={(e) => setBatchForm({ ...batchForm, maxStudents: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={batchForm.status}
                    onChange={(e) => setBatchForm({ ...batchForm, status: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBatchForm(false);
                    setEditingBatch(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingBatch ? 'Update Batch' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderEnrollments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Student Enrollments
          </h2>
          <p className="text-gray-600 mt-1">Manage student registrations and track payments</p>
        </div>
        <button
          onClick={() => setShowEnrollmentForm(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <UserPlus className="w-5 h-5" />
          New Enrollment
        </button>
      </div>

      {/* Enrollment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Enrollments</p>
              <p className="text-3xl font-bold">{enrollments.length}</p>
            </div>
            <UserPlus className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Confirmed</p>
              <p className="text-3xl font-bold">{enrollments.filter(e => e.status === 'confirmed').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Pending</p>
              <p className="text-3xl font-bold">{enrollments.filter(e => e.status === 'pending').length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold">₹{enrollments.reduce((sum, e) => sum + e.paidAmount, 0).toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Enrollments List */}
      <div className="space-y-4">
        {enrollments.map((enrollment) => (
          <div key={enrollment.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
            <div className={`h-1 ${
              enrollment.status === 'confirmed' ? 'bg-gradient-to-r from-green-500 to-green-600' :
              enrollment.status === 'pending' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
              'bg-gradient-to-r from-blue-500 to-blue-600'
            }`} />
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{enrollment.student.name}</h3>
                    <p className="text-sm text-gray-600">{enrollment.student.email}</p>
                    <p className="text-sm text-gray-600">{enrollment.student.phone}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                  {enrollment.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Course Details</h4>
                  <p className="text-sm text-gray-600 mb-1">{enrollment.course.name}</p>
                  <p className="text-sm text-gray-600 mb-1">Batch: {enrollment.batch.name}</p>
                  <p className="text-sm text-gray-600">Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Fee Breakdown</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Course Fee:</span>
                      <span className="font-medium">₹{enrollment.course.fee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Admission Fee:</span>
                      <span className="font-medium">₹{enrollment.admissionFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registration Fee:</span>
                      <span className="font-medium">₹{enrollment.registrationFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Exam Fee:</span>
                      <span className="font-medium">₹{enrollment.examFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1 font-semibold">
                      <span>Total:</span>
                      <span>₹{enrollment.totalFee.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Payment Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Paid Amount:</span>
                      <span className="font-medium text-green-600">₹{enrollment.paidAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining:</span>
                      <span className="font-medium text-red-600">₹{(enrollment.totalFee - enrollment.paidAmount).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(enrollment.paidAmount / enrollment.totalFee) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {Math.round((enrollment.paidAmount / enrollment.totalFee) * 100)}% paid
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center gap-2 font-medium">
                  <Edit className="w-4 h-4" />
                  Edit Enrollment
                </button>
                <button className="flex-1 bg-green-50 text-green-600 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors duration-200 flex items-center justify-center gap-2 font-medium">
                  <DollarSign className="w-4 h-4" />
                  Add Payment
                </button>
                <button className="bg-purple-50 text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-100 transition-colors duration-200 flex items-center justify-center gap-2 font-medium">
                  <FileText className="w-4 h-4" />
                  Generate Voucher
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enrollment Form Modal */}
      {showEnrollmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">New Student Enrollment</h3>
                <button
                  onClick={() => setShowEnrollmentForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleEnrollmentSubmit} className="p-6 space-y-6">
              {/* Student Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={enrollmentForm.studentName}
                      onChange={(e) => setEnrollmentForm({ ...enrollmentForm, studentName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter student's full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={enrollmentForm.studentEmail}
                      onChange={(e) => setEnrollmentForm({ ...enrollmentForm, studentEmail: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={enrollmentForm.studentPhone}
                      onChange={(e) => setEnrollmentForm({ ...enrollmentForm, studentPhone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      required
                      value={enrollmentForm.studentAddress}
                      onChange={(e) => setEnrollmentForm({ ...enrollmentForm, studentAddress: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter full address"
                    />
                  </div>
                </div>
              </div>

              {/* Course Selection */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Course Selection</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch</label>
                  <select
                    required
                    value={enrollmentForm.batchId}
                    onChange={(e) => setEnrollmentForm({ ...enrollmentForm, batchId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a batch</option>
                    {batches.filter(b => b.status === 'upcoming' || b.status === 'ongoing').map(batch => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name} - {batch.courseName} ({batch.enrolledStudents}/{batch.maxStudents} students)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fee Structure */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Fee Structure</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Admission Fee (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={enrollmentForm.admissionFee}
                      onChange={(e) => setEnrollmentForm({ ...enrollmentForm, admissionFee: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Fee (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={enrollmentForm.registrationFee}
                      onChange={(e) => setEnrollmentForm({ ...enrollmentForm, registrationFee: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Exam Fee (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={enrollmentForm.examFee}
                      onChange={(e) => setEnrollmentForm({ ...enrollmentForm, examFee: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Fee Summary */}
                {enrollmentForm.batchId && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <h5 className="font-semibold text-gray-900 mb-2">Fee Summary</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Course Fee:</span>
                        <span>₹{courses.find(c => c.id === batches.find(b => b.id === enrollmentForm.batchId)?.courseId)?.fee.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Admission Fee:</span>
                        <span>₹{enrollmentForm.admissionFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Registration Fee:</span>
                        <span>₹{enrollmentForm.registrationFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Exam Fee:</span>
                        <span>₹{enrollmentForm.examFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1 font-semibold">
                        <span>Total Fee:</span>
                        <span>₹{(
                          (courses.find(c => c.id === batches.find(b => b.id === enrollmentForm.batchId)?.courseId)?.fee || 0) +
                          enrollmentForm.admissionFee +
                          enrollmentForm.registrationFee +
                          enrollmentForm.examFee
                        ).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEnrollmentForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderVouchers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Payment Vouchers
          </h2>
          <p className="text-gray-600 mt-1">Track and manage payment receipts</p>
        </div>
      </div>

      {/* Voucher Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Total Vouchers</p>
              <p className="text-3xl font-bold">{vouchers.length}</p>
            </div>
            <FileText className="w-8 h-8 text-indigo-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Paid Vouchers</p>
              <p className="text-3xl font-bold">{vouchers.filter(v => v.status === 'paid').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Pending</p>
              <p className="text-3xl font-bold">{vouchers.filter(v => v.status === 'pending').length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Amount</p>
              <p className="text-3xl font-bold">₹{vouchers.reduce((sum, v) => sum + v.amount, 0).toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Vouchers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vouchers.map((voucher) => (
          <div key={voucher.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
            <div className={`h-2 ${
              voucher.status === 'paid' ? 'bg-gradient-to-r from-green-500 to-green-600' :
              'bg-gradient-to-r from-orange-500 to-orange-600'
            }`} />
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{voucher.voucherNumber}</h3>
                    <p className="text-sm text-gray-600">{voucher.studentName}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(voucher.status)}`}>
                  {voucher.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Course:</span>
                  <span className="font-medium">{voucher.courseName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Batch:</span>
                  <span className="font-medium">{voucher.batchName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-lg text-green-600">₹{voucher.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Date:</span>
                  <span className="font-medium">{new Date(voucher.paymentDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-medium capitalize">{voucher.paymentMethod.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedVoucher(voucher);
                    setShowVoucherModal(true);
                  }}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button className="flex-1 bg-green-50 text-green-600 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors duration-200 flex items-center justify-center gap-2 font-medium">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="bg-purple-50 text-purple-600 py-2 px-3 rounded-lg hover:bg-purple-100 transition-colors duration-200 flex items-center justify-center">
                  <Print className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Voucher Detail Modal */}
      {showVoucherModal && selectedVoucher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Payment Voucher</h3>
                <button
                  onClick={() => setShowVoucherModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Voucher Content */}
            <div className="p-8 bg-white">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">EduManage Institute</h1>
                <p className="text-gray-600">Payment Receipt Voucher</p>
              </div>

              {/* Voucher Details */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Student Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Name:</span> <span className="font-medium">{selectedVoucher.studentName}</span></p>
                    <p><span className="text-gray-600">Course:</span> <span className="font-medium">{selectedVoucher.courseName}</span></p>
                    <p><span className="text-gray-600">Batch:</span> <span className="font-medium">{selectedVoucher.batchName}</span></p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Voucher No:</span> <span className="font-medium">{selectedVoucher.voucherNumber}</span></p>
                    <p><span className="text-gray-600">Date:</span> <span className="font-medium">{new Date(selectedVoucher.paymentDate).toLocaleDateString()}</span></p>
                    <p><span className="text-gray-600">Method:</span> <span className="font-medium capitalize">{selectedVoucher.paymentMethod.replace('_', ' ')}</span></p>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Amount Paid</p>
                  <p className="text-4xl font-bold text-indigo-600">₹{selectedVoucher.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedVoucher.status === 'paid' ? 'Payment Confirmed' : 'Payment Pending'}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t pt-6">
                <div className="text-center text-sm text-gray-600">
                  <p>Generated on: {new Date().toLocaleDateString()}</p>
                  <p>Status: <span className={`font-medium ${selectedVoucher.status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                    {selectedVoucher.status.toUpperCase()}
                  </span></p>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500 text-center">
                    This is a computer-generated receipt and does not require a signature.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t bg-gray-50 flex gap-4">
              <button
                onClick={() => setShowVoucherModal(false)}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
              >
                Close
              </button>
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download PDF
              </button>
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium flex items-center justify-center gap-2">
                <Print className="w-5 h-5" />
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'courses', label: 'Courses', icon: BookOpen, count: courses.length },
              { id: 'batches', label: 'Batches', icon: Users, count: batches.length },
              { id: 'enrollments', label: 'Enrollments', icon: UserPlus, count: enrollments.length },
              { id: 'vouchers', label: 'Payment Vouchers', icon: FileText, count: vouchers.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className={`mr-2 h-5 w-5 ${
                  activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs font-medium ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'courses' && renderCourses()}
      {activeTab === 'batches' && renderBatches()}
      {activeTab === 'enrollments' && renderEnrollments()}
      {activeTab === 'vouchers' && renderVouchers()}
    </div>
  );
}