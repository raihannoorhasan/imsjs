import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus, Search, UserPlus } from 'lucide-react';
import { Button } from '../common/Button';
import { SearchInput } from '../common/SearchInput';
import { Card } from '../common/Card';
import { StudentList } from './StudentList';
import { StudentForm } from './StudentForm';
import { StudentView } from './StudentView';
import { EnrollmentForm } from './EnrollmentForm';

export function StudentManagement() {
  const { students, addStudent, updateStudent, deleteStudent } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [showStudentView, setShowStudentView] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowAddForm(true);
  };

  const handleView = (student) => {
    setViewingStudent(student);
    setShowStudentView(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingStudent(null);
  };

  const handleCloseView = () => {
    setShowStudentView(false);
    setViewingStudent(null);
  };

  const handleSubmit = (studentData) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, studentData);
    } else {
      addStudent(studentData);
    }
    handleCloseForm();
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Student Management</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage student profiles and enrollments</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowEnrollmentForm(true)}
              className="border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-400 dark:hover:border-purple-500"
            >
              <UserPlus size={20} className="mr-2" />
              Enroll Student
            </Button>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus size={20} className="mr-2" />
              Add Student
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
              placeholder="Search students by name, email, or phone..."
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Results Summary */}
      {searchTerm && (
        <div className="text-sm text-gray-600 dark:text-gray-400 px-1">
          Found {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} matching "{searchTerm}"
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <StudentList
          students={filteredStudents}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={deleteStudent}
        />
      </div>

      <StudentForm
        isOpen={showAddForm}
        onClose={handleCloseForm}
        student={editingStudent}
        onSubmit={handleSubmit}
      />

      <StudentView
        isOpen={showStudentView}
        onClose={handleCloseView}
        student={viewingStudent}
        onEdit={(student) => {
          handleCloseView();
          handleEdit(student);
        }}
      />

      <EnrollmentForm
        isOpen={showEnrollmentForm}
        onClose={() => setShowEnrollmentForm(false)}
      />
    </div>
  );
}