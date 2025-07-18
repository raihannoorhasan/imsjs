import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, BookOpen, Users, Calendar, Search, Filter } from 'lucide-react';
import { Button } from '../common/Button';
import { SearchInput } from '../common/SearchInput';
import { Card } from '../common/Card';
import { CourseList } from './CourseList';
import { CourseForm } from './CourseForm';
import { BatchManagement } from './BatchManagement';
import { StudentManagement } from './StudentManagement';
import { AttendanceManagement } from './AttendanceManagement';
import { PaymentManagement } from './PaymentManagement';
import { EnrollmentManagement } from './EnrollmentManagement';

export function Courses() {
  const { courses, addCourse, updateCourse, deleteCourse } = useInventory();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const isInstructor = currentUser?.role === 'instructor';

  const tabs = [
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'batches', label: 'Batches', icon: Calendar },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'enrollments', label: 'Enrollments', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: BookOpen }
  ];

  // Filter tabs for instructors - only show attendance
  const accessibleTabs = isInstructor 
    ? tabs.filter(tab => tab.id === 'attendance')
    : tabs;

  // Set default tab for instructors
  React.useEffect(() => {
    if (isInstructor && activeTab !== 'attendance') {
      setActiveTab('attendance');
    }
  }, [isInstructor, activeTab]);

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingCourse(null);
  };

  const handleSubmit = (courseData) => {
    if (editingCourse) {
      updateCourse(editingCourse.id, courseData);
    } else {
      addCourse(courseData);
    }
    handleCloseForm();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <CourseList
            courses={courses}
            onEdit={handleEdit}
            onDelete={deleteCourse}
          />
        );
      case 'batches':
        return <BatchManagement />;
      case 'students':
        return <StudentManagement />;
      case 'enrollments':
        return <EnrollmentManagement />;
      case 'attendance':
        return <AttendanceManagement />;
      case 'payments':
        return <PaymentManagement />;
      default:
        return <CourseList courses={courses} onEdit={handleEdit} onDelete={deleteCourse} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isInstructor ? 'Attendance Management' : 'Course Management'}
              </h1>
              <p className="text-gray-600">
                {isInstructor 
                  ? 'Mark and manage student attendance for your classes' 
                  : 'Manage courses, batches, students, and payments with ease'
                }
              </p>
            </div>
            {activeTab === 'courses' && !isInstructor && (
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus size={20} className="mr-2" />
                Add Course
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation with Modern Design */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex overflow-x-auto">
          <nav className="flex space-x-1 min-w-full">
            {accessibleTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchTerm('');
                  }}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-all duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>

      {!isInstructor && (
        <CourseForm
          isOpen={showAddForm}
          onClose={handleCloseForm}
          course={editingCourse}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}