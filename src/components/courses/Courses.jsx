import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus, BookOpen, Users, Calendar } from 'lucide-react';
import { Button } from '../common/Button';
import { CourseList } from './CourseList';
import { CourseForm } from './CourseForm';
import { BatchManagement } from './BatchManagement';
import { StudentManagement } from './StudentManagement';
import { AttendanceManagement } from './AttendanceManagement';
import { PaymentManagement } from './PaymentManagement';

export function Courses() {
  const { courses, addCourse, updateCourse, deleteCourse } = useInventory();
  const [activeTab, setActiveTab] = useState('courses');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const tabs = [
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'batches', label: 'Batches', icon: Calendar },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: BookOpen }
  ];

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
      case 'attendance':
        return <AttendanceManagement />;
      case 'payments':
        return <PaymentManagement />;
      default:
        return <CourseList courses={courses} onEdit={handleEdit} onDelete={deleteCourse} />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-2">Manage courses, batches, students, and payments</p>
        </div>
        {activeTab === 'courses' && (
          <Button onClick={() => setShowAddForm(true)}>
            <Plus size={20} className="mr-2" />
            Add Course
          </Button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {renderContent()}

      <CourseForm
        isOpen={showAddForm}
        onClose={handleCloseForm}
        course={editingCourse}
        onSubmit={handleSubmit}
      />
    </div>
  );
}