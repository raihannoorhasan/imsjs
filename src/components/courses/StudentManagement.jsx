import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { StudentList } from './StudentList';
import { StudentForm } from './StudentForm';
import { EnrollmentForm } from './EnrollmentForm';

export function StudentManagement() {
  const { students, addStudent, updateStudent, deleteStudent } = useInventory();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingStudent(null);
  };

  const handleSubmit = (studentData) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, studentData);
    } else {
      addStudent(studentData);
    }
    handleCloseForm();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Student Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowEnrollmentForm(true)}>
            Enroll Student
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus size={20} className="mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      <StudentList
        students={students}
        onEdit={handleEdit}
        onDelete={deleteStudent}
      />

      <StudentForm
        isOpen={showAddForm}
        onClose={handleCloseForm}
        student={editingStudent}
        onSubmit={handleSubmit}
      />

      <EnrollmentForm
        isOpen={showEnrollmentForm}
        onClose={() => setShowEnrollmentForm(false)}
      />
    </div>
  );
}