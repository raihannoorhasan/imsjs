import React from 'react';
import { Edit2, Trash2, Clock, DollarSign, Users, BookOpen, Award } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/helpers';

export function CourseList({ courses, onEdit, onDelete }) {
  if (courses.length === 0) {
    return (
      <Card className="text-center py-16">
        <div className="flex flex-col items-center">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <BookOpen className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Found</h3>
          <p className="text-gray-600 mb-6 max-w-md">
            Get started by creating your first course. You can add course details, pricing, and manage everything from here.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Grid for better visual appeal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
            <div className="p-6">
              {/* Course Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg leading-tight">{course.name}</h3>
                    <StatusBadge status={course.status} className="mt-1" />
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => onEdit(course)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Course"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(course.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Course"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Course Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

              {/* Course Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Clock size={14} className="mr-1" />
                    <span>Duration</span>
                  </div>
                  <p className="font-semibold text-gray-900">{course.duration} hours</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Users size={14} className="mr-1" />
                    <span>Capacity</span>
                  </div>
                  <p className="font-semibold text-gray-900">{course.maxStudents} students</p>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Award size={14} className="mr-2" />
                <span>Instructor: <span className="font-medium text-gray-900">{course.instructor}</span></span>
              </div>

              {/* Pricing Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Course Fee</span>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(course.price)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                  <div className="text-center">
                    <p className="font-medium">Admission</p>
                    <p>{formatCurrency(course.admissionFee)}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Registration</p>
                    <p>{formatCurrency(course.registrationFee)}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Exam</p>
                    <p>{formatCurrency(course.examFee)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}